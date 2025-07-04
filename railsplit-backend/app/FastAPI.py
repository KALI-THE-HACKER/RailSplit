from fastapi import FastAPI, Request, HTTPException, Header, Query
from fastapi.responses import JSONResponse, StreamingResponse
from main import st_code_to_cartesian, algorithm_one, web_scrapping
import asyncio
import redis, json
from datetime import datetime, timedelta
import time
import logging
import uuid
from fastapi.middleware.cors import CORSMiddleware

# bg-green-700 → #15803D
# bg-red-700 → #B91C1C
# bg-blue-600 → #2563EB


app = FastAPI()
r = redis.Redis(host="redis", port=6379, db=0)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://railsplit.luckylinux.xyz"],  # Or specify frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

coordinates = []
intermediates = []

logging.basicConfig(
    filename='/logs/logfile.log',  # change name as needed
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def time_difference_calculator(time1, time2, layover=0):
    #time1 is more than time2
    diff = time1 - time2 - timedelta(minutes=layover)
    minutes = diff.total_seconds() / 60

    return minutes

def user_id_generator():
    length = 8

    existing_ids = [key.decode('utf-8') for key in r.keys('*')]
    random_string = str(uuid.uuid4()).replace('-', '')[:length]
    if random_string in existing_ids:
        return user_id_generator()
    else:
        return random_string


@app.post("/start-stream")
async def start_stream(request: Request, x_api_key:str = Header(...)):
    x_forwarded_for = request.headers.get('x-forwarded-for')
    ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.client.host

    logging.info(f"Request from IP : {ip}")

    if x_api_key != "bGludXhhcGk1NjU3":
        logging.error(f"Invalid API Key, user IP: {ip}")
        raise HTTPException(status_code=401, detail="Invalid API key!")
    
    try:
        data = await request.json()
        if not data:
            raise HTTPException(status_code=422, detail="Incomplete data provided!")
        
        source, destination, date = data.get("origin"), data.get("destination"), data.get("date")

        user_id = user_id_generator()
        if not source or not destination or not date:
            logging.error(f"Invalid data provided by user {user_id} from IP: {ip}")
            raise HTTPException(status_code=422, detail="Incomplete data provided!")

        # Saving user data in Redis
        r.set(user_id, json.dumps({
            "source": source['code'],
            "destination": destination['code'],
            "date": date
        }),
        ex=3600)  # Set expiration time to 1 hour

        logging.info(f"User ID generated: {user_id} for IP: {ip}")

        logging.info(f"IP : {ip} \n       -Source: {source}\n       -Destination: {destination}\n       -Date: {date}")

        return JSONResponse(
            content={
                "message": "Stream started successfully!",
                "user_id": user_id,
                "status": "success"
            },
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error in start_stream: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/railsplit-server")
async def fastapiapp(request: Request, user_id: str = Query(...)):
    x_forwarded_for = request.headers.get('x-forwarded-for')
    ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.client.host
    
    try:
        user_id_data = r.get(user_id)
        if user_id_data is None:
            raise HTTPException(status_code=404, detail="User ID not found in Redis.")
        
        
        user_id_data_json = json.loads(user_id_data)
        source = user_id_data_json.get("source")
        destination = user_id_data_json.get("destination")
        date = user_id_data_json.get("date")

        async def main(source, destination, date):
            available_trains = [] #{train_number : (train_name, from_st, to_st, (depart_time, day, date, month), (arrive_time, day, date, month), duration)}

            fetchedIntermediates = []

            source = source.upper()
            destination = destination.upper()

            start_time = time.time()

            try:
                yield f"data: {json.dumps({'status': 'Connection established!', 'type': '#15803D'})}\n\n"
                
                # Check if the result is already cached
                cached_result = r.get(f"{source}-{destination}-{date}")
                cached_fetchedIntermediates = r.get(f"{source}-{destination}-{date}-fetchedIntermediates")

                #If cached result found, load them
                if cached_result:
                    yield f"data: {json.dumps({'status': 'Cached data found!', 'type': '#15803D'})}\n\n"
                    available_trains = json.loads(cached_result)
                    logging.info("Cached result found!")
                    yield f"data: {json.dumps(available_trains)}\n\n"

                #If cached result not found, find direct trains
                else:
                    # Send initial status
                    yield f"data: {json.dumps({'status': 'searching direct trains...', 'type': '#2563EB'})}\n\n"
                    
                    direct_trains = await web_scrapping(source, destination, date)
                    if direct_trains:
                        available_trains.append({"Direct-trains": direct_trains})
                        yield f"data: {json.dumps(available_trains)}\n\n"
                        
                        # Cache the result
                        r.set(f"{source}-{destination}-{date}", json.dumps(available_trains), ex=604800) #7 days expiry
                    else:
                        yield f"data: {json.dumps({'status': 'No direct trains found!', 'type': '#B91C1C'})}\n\n"

                yield f"data: {json.dumps({'status': 'Searching for intermediate stations...', 'type': '#2563EB'})}\n\n"

                #If cached fetchedIntermediates found, load them
                if cached_fetchedIntermediates:
                    # yield f"data: {json.dumps({'status': 'Cached fetchedIntermediates found!'})}\n\n"
                    fetchedIntermediates = json.loads(cached_fetchedIntermediates)
                    logging.info("Cached fetchedIntermediates found!")

                #If cached fetchedIntermediates not found, initialize empty list    
                else:
                    fetchedIntermediates = []
                coordinates = st_code_to_cartesian(source, destination)
                intermediates = algorithm_one(source, destination, coordinates)
                
                logging.info(f"Intermediates: {intermediates}")

                intermediates = list(set(intermediates) - set(fetchedIntermediates)) 


                if not intermediates:
                    yield f"data: {json.dumps({'status': 'Unfortunately no intermediates found!', 'type': '#B91C1C'})}\n\n"
                    return

                yield f"data: {json.dumps({'status': f'Searching for trains via intermediate stations!', 'type': '#2563EB'})}\n\n"

                for idx, i in enumerate(intermediates):
                    try:
                        logging.info(f"Processing intermediate station: {i}")
                        # Send progress update
                        yield f"data: {json.dumps({'status': f'Searching for {i}...', 'type': '#2563EB'})}\n\n"
                        
                        leg1_trains = await web_scrapping(source, i, date) or []
                        # logging.info(f"Fetched leg1 trains for {source} -> {i}: {len(leg1_trains)} found")
                        
                        if not leg1_trains:
                            logging.info(f"No leg1 trains found for intermediate: {i}")
                            continue
                            
                        leg2_day1_trains = await web_scrapping(i, destination, date) or []
                        leg2_day2_trains = await web_scrapping(i, destination, (datetime.strptime(date, "%d%m%Y")+timedelta(days=1)).strftime("%d%m%Y")) or []

                        leg2_trains = leg2_day1_trains + leg2_day2_trains
                        # logging.info(f"Fetched leg2 trains for {i} -> {destination}: {len(leg2_trains)} found")

                        if not leg2_trains:
                            logging.info(f"No leg2 trains found for intermediate: {i}")
                            continue

                        year = date[4:] #Fetch year from user input

                        # Filteration and coupling of leg1 & leg2 trains
                        for train1 in leg1_trains[:]:
                            train1_departure = datetime.strptime(f"{train1['departure'][2]} {train1['departure'][3]} {year} {train1['departure'][0]}", "%d %b %Y %H:%M")
                            train1_arrival = datetime.strptime(f"{train1['arrival'][2]} {train1['arrival'][3]} {year} {train1['arrival'][0]}", "%d %b %Y %H:%M")

                            for train2 in leg2_trains[:]:
                                train2_departure = datetime.strptime(f"{train2['departure'][2]} {train2['departure'][3]} {year} {train2['departure'][0]}", "%d %b %Y %H:%M")
                                train2_arrival = datetime.strptime(f"{train2['arrival'][2]} {train2['arrival'][3]} {year} {train2['arrival'][0]}", "%d %b %Y %H:%M")

                                #Filter trains with departure more than arrival of train1 + 15min
                                if(train2_departure > train1_arrival + timedelta(minutes=15)):
                                    layover = time_difference_calculator(train2_departure, train1_arrival)
                                    duration = time_difference_calculator(train2_arrival, train1_departure, layover)
                                    # logging.info(f"Valid connection found: {train1['from_station']}->{i}->{train2['to_station']}, layover: {layover} min, duration: {duration} min")

                                    logging.info(f"Layover : {layover}")
                                    intermediate_result = {
                                        "intermediate": i,
                                        "origin": train1['from_station'],
                                        "destination": train2['to_station'],
                                        "train1_departure_date": train1_departure.strftime("%a, %d %B"),
                                        "train1_departure_time": train1_departure.strftime("%H:%M"),
                                        "train1_arrival_date": train1_arrival.strftime("%a, %d %B"),
                                        "train1_arrival_time": train1_arrival.strftime("%H:%M"),
                                        "train2_departure_date": train2_departure.strftime("%a, %d %B"),
                                        "train2_departure_time": train2_departure.strftime("%H:%M"),
                                        "train2_arrival_date": train2_arrival.strftime("%a, %d %B"),
                                        "train2_arrival_time": train2_arrival.strftime("%H:%M"),
                                        "train1_number": train1['train_number'],
                                        "train1_name": train1['train_name'],
                                        "train2_number": train2['train_number'],
                                        "train2_name": train2['train_name'],
                                        "train1_seat_availability": train1['seat_availabilty'],
                                        "train2_seat_availability": train2['seat_availabilty'],
                                        "layover": layover,
                                        "duration": duration
                                    }
                                    #Upadate available_trains list
                                    available_trains.append(intermediate_result)
                                    # logging.info(f"Appended intermediate_result for {i} to available_trains. Total now: {len(available_trains)}")
                                else:
                                    message = f'Found nothing for {i}\n searching others...'
                                    yield f"data: {json.dumps({'status': message, 'type': '#B91C1C'})}\n\n"
                                    # logging.info(f"No valid connecting trains for intermediate: {i} after time filtering")

                        # Send the updated results
                        logging.info(f"Yielding updated available_trains, total: {len(available_trains)}")
                        yield f"data: {json.dumps(available_trains)}\n\n"

                        fetchedIntermediates.append(i)
                        logging.info(f"Processed intermediate {i} successfully")
                        
                        # Cache the result
                        r.set(f"{source}-{destination}-{date}", json.dumps(available_trains))
                        r.set(f"{source}-{destination}-{date}-fetchedIntermediates", json.dumps(fetchedIntermediates))
                        # logging.info(f"Cached results for {source}-{destination}-{date}")

                    except Exception as e:
                        logging.error(f"Error processing intermediate {i}: {str(e)}")
                        yield f"data: {json.dumps({'status': f'Error processing station {i}: {str(e)}', 'type': '#B91C1C'})}\n\n"
                        continue

                # Send completion status
                end_time = time.time()
                total_time = end_time - start_time
                logging.info(f"IP: {ip}; \nTime taken : {total_time//60} minutes {total_time%60} seconds")
                
                yield f"data: {json.dumps({'status': f'Completed; Time taken: {total_time//60} minutes {total_time%60} seconds', 'type': '#15803D'})}\n\n"

            except Exception as e:
                logging.error(f"Error in main function: {str(e)}")
                yield f"data: {json.dumps({'status': f'Processing error: {str(e)}', 'type': '#B91C1C'})}\n\n"

        # Fixed event stream function
        async def event_stream():
            try:
                # Send initial connection confirmation
                yield f"data: {json.dumps({'status': 'connection_established'})}\n\n"
                
                # Process the main logic
                async for chunk in main(source, destination, date):
                    yield chunk
                    # Add a small delay to prevent overwhelming the client
                    await asyncio.sleep(0.1)
                    
            except Exception as e:
                logging.error(f"Error in event stream: {str(e)}")
                yield f"data: {json.dumps({'status': f'Stream error: {str(e)}', 'type': '#B91C1C'})}\n\n"
            finally:
                # Send final event to indicate stream end
                yield f"data: {json.dumps({'status': 'stream_ended'})}\n\n"

        # Add proper headers for SSE
        headers = {
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        }
        
        return StreamingResponse(
            event_stream(), 
            media_type="text/event-stream",
            headers=headers
        )
    
    except HTTPException as e:
        logging.error(f"HTTPException error occured: {e}")
        raise e
    except Exception as e:
        logging.error(f"Non-HTTPException error occured: {e}")
        raise HTTPException(status_code=500, detail=f"An error occured: {str(e)}")