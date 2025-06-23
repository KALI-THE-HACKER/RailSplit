from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.responses import JSONResponse, StreamingResponse
from main import st_code_to_cartesian, algorithm_one, web_scrapping
import asyncio
import redis, json
from datetime import datetime, timedelta
import time
import logging

app = FastAPI()
r = redis.Redis(host="127.0.0.1", port=6379, db=0)

coordinates = []
intermediates = []

logging.basicConfig(
    filename='../logs/logfile.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)


@app.post("/railsplit-server")
async def fastapiapp(request: Request, x_api_key: str = Header(...)):
    x_forwarded_for = request.headers.get('x-forwarded-for')
    ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.client.host

    logging.info(f"Request from IP : {ip}")

    if x_api_key != "linuxapi5657":
        logging.error(f"Invalid API Key, user IP: {ip}")
        raise HTTPException(status_code=401, detail="Invalid API key!")
    
    try:
        data = await request.json()
        if not data:
            raise HTTPException(status_code=422, detail="Incomplete data provided")
        
        source, destination, date = data.get("origin"), data.get("destination"), data.get("date")

        logging.info(f"IP : {ip} \n       -Source: {source}\n       -Destination: {destination}\n       -Date: {date}")

        async def main(source, destination, date):
            available_trains = [] #{train_number : (train_name, from_st, to_st, (depart_time, day, date, month), (arrive_time, day, date, month), duration)}

            fetchedIntermediates = []

            source = source.upper()
            destination = destination.upper()

            start_time = time.time()

            try:
                # Check if the result is already cached
                cached_result = r.get(f"{source}-{destination}-{date}")
                cached_fetchedIntermediates = r.get(f"{source}-{destination}-{date}-fetchedIntermediates")

                #If cached result found, load them
                if cached_result:
                    yield f"data: {json.dumps({'status': 'Cached data found!'})}\n\n"
                    available_trains = json.loads(cached_result)
                    logging.info("Cached result found!")
                    yield f"data: {json.dumps(available_trains)}\n\n"

                #If cached result not found, find direct trains
                else:
                    # Send initial status
                    yield f"data: {json.dumps({'status': 'searching_direct_trains'})}\n\n"
                    
                    direct_trains = await web_scrapping(source, destination, date)
                    if direct_trains:
                        available_trains.append({"Direct-trains": direct_trains})
                        yield f"data: {json.dumps(available_trains)}\n\n"
                        
                        # Cache the result
                        r.set(f"{source}-{destination}-{date}", json.dumps(available_trains))
                    else:
                        yield f"data: {json.dumps({'status': 'no_direct_trains_found'})}\n\n"

                #If cached fetchedIntermediates found, load them
                if cached_fetchedIntermediates:
                    yield f"data: {json.dumps({'status': 'Cached fetchedIntermediates found!'})}\n\n"
                    fetchedIntermediates = json.loads(cached_fetchedIntermediates)
                    logging.info("Cached fetchedIntermediates found!")

                #If cached fetchedIntermediates not found, initialize empty list    
                else:
                    fetchedIntermediates = []

                # Send status update
                yield f"data: {json.dumps({'status': 'finding_intermediate_stations'})}\n\n"
                
                coordinates = st_code_to_cartesian(source, destination)
                intermediates = algorithm_one(source, destination, coordinates)
                logging.info(f"Intermediates: {intermediates}")

                intermediates = list(set(intermediates) - set(fetchedIntermediates)) 


                if not intermediates:
                    yield f"data: {json.dumps({'status': 'no_intermediates_found'})}\n\n"
                    yield f"data: {json.dumps({'status': 'completed'})}\n\n"
                    return

                yield f"data: {json.dumps({'status': f'checking_{len(intermediates)}_intermediate_stations'})}\n\n"

                for idx, i in enumerate(intermediates):
                    try:
                        # Send progress update
                        yield f"data: {json.dumps({'status': f'checking_intermediate_{idx+1}_of_{len(intermediates)}', 'station': i})}\n\n"
                        
                        leg1_trains = await web_scrapping(source, i, date) or []
                        
                        if not leg1_trains:
                            logging.info(f"No leg1 trains found for intermediate: {i}")
                            continue
                            
                        leg2_day1_trains = await web_scrapping(i, destination, date) or []
                        leg2_day2_trains = await web_scrapping(i, destination, (datetime.strptime(date, "%d%m%Y")+timedelta(days=1)).strftime("%d%m%Y")) or []

                        leg2_trains = leg2_day1_trains + leg2_day2_trains

                        if not leg2_trains:
                            logging.info(f"No leg2 trains found for intermediate: {i}")
                            continue

                        year = "2025" #Fetch year from user input
                        
                        # Filter leg2 trains based on arrival time of leg1
                        if leg1_trains and leg2_trains:
                            leg1_very_arrival = datetime.strptime(f"{leg1_trains[0]['arrival'][2]} {leg1_trains[0]['arrival'][3]} {year} {leg1_trains[0]['arrival'][0]}", "%d %b %Y %H:%M")

                            for each_train in leg2_trains[:]:
                                leg2_very_departure = datetime.strptime(f"{each_train['departure'][2]} {each_train['departure'][3]} {year} {each_train['departure'][0]}", "%d %b %Y %H:%M")

                                if (leg2_very_departure < leg1_very_arrival + timedelta(minutes=15)):
                                    leg2_trains.remove(each_train)

                            if leg1_trains and leg2_trains:
                                intermediate_result = {
                                    "intermediate": i,
                                    "leg1": leg1_trains,
                                    "leg2": leg2_trains
                                }
                                available_trains.append(intermediate_result)

                                # Cache the result
                                r.set(f"{source}-{destination}-{date}", json.dumps(available_trains))

                                # Send the updated results
                                yield f"data: {json.dumps(available_trains)}\n\n"
                            else:
                                logging.info(f"No valid connecting trains for intermediate: {i} after time filtering")
                        else:
                            logging.info(f"Missing trains for intermediate: {i}, Origin: {source}, destination: {destination}, date: {date}")

                        fetchedIntermediates.append(i)
                        logging.info(f"Processed intermediate {i} successfully")
                        r.set(f"{source}-{destination}-{date}-fetchedIntermediates", json.dumps(fetchedIntermediates))

                    except Exception as e:
                        logging.error(f"Error processing intermediate {i}: {str(e)}")
                        yield f"data: {json.dumps({'error': f'Error processing station {i}: {str(e)}'})}\n\n"
                        continue

                # Send completion status
                end_time = time.time()
                total_time = end_time - start_time
                logging.info(f"IP: {ip}; \nTime taken : {total_time//60} minutes {total_time%60} seconds")
                
                yield f"data: {json.dumps({'status': 'completed', 'total_time': f'{total_time//60} minutes {total_time%60} seconds', 'total_results': len(available_trains)})}\n\n"

            except Exception as e:
                logging.error(f"Error in main function: {str(e)}")
                yield f"data: {json.dumps({'error': f'Processing error: {str(e)}'})}\n\n"

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
                yield f"data: {json.dumps({'error': f'Stream error: {str(e)}'})}\n\n"
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