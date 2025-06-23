import requests
from datetime import datetime, timedelta
import time
import asyncio
from playwright.async_api import async_playwright

#Global dictionaries, lists and all
top100_cartesian = {
    'HWH': (1445446, 5653619), 
    'NDLS': (1833107, 4942125), 
    'BCT': (1212422, 4660851), 
    'MAS': (837293, 5137325), 
    'SDAH': (1444288, 5655680), 
    'CNB': (1692794, 5141242), 
    'ALD': (1628698, 5237344), 
    'PNBE': (1639168, 5450170), 
    'JP': (1723014, 4849850), 
    'ADI': (1473702, 4646528), 
    'SBC': (830554, 4964230), 
    'LKO': (1718400, 5180794), 
    'BZA': (1056960, 5160480), 
    'NGP': (1353850, 5061318), 
    'PUNE': (1185299, 4726829), 
    'KOAA': (1444646, 5655290),
    'CSTM': (1212147, 4661472),
    'BPL': (1488634, 4954406), 
    'GHY': (1675782, 5872000), 
    'BBS': (1298950, 5492768), 
    'CBE': (705171, 4926240), 
    'HYB': (1111142, 5022381), 
    'INDB': (1453946, 4855571),
    'JAT': (2092128, 4789690), 
    'JHS': (1628698, 5028384), 
    'KGP': (1429670, 5588730), 
    'MDU': (635213, 4999667), 
    'MYS': (787661, 4905581), 
    'RJT': (1427450, 4531341), 
    'RNC': (1494035, 5459814), 
    'TVC': (543200, 4924960), 
    'BSB': (1620326, 5310330), 
    'VSKP': (1134189, 5330208),
    'GKP': (1712678, 5335917), 
    'JU': (1682349, 4672531), 
    'ASR': (2024512, 4791398), 
    'ST': (1354893, 4661190), 
    'UDZ': (1573466, 4717600),
    'GAYA': (1586912, 5440768),
    'JBP': (1482790, 5115770), 
    'KIR': (1635072, 5581568), 
    'KOTA': (1613683, 4855347),
    'LDH': (1978202, 4854182), 
    'R': (1360090, 5224294), 
    'TPJ': (688986, 5037101),
    'AGC': (1739309, 4992518),
    'AII': (1692794, 4776954),
    'BE': (1815488, 5083546), 
    'BSP': (1396058, 5247597),
    'DHN': (1522925, 5531546),
    'GWL': (1677971, 5003699),
    'UBL': (1014381, 4767853),
    'CLT': (720563, 4849946), 
    'MFP': (1671738, 5463341),
    'SRE': (1917696, 4962950),
    'SRR': (689126, 4881350), 
    'TEN': (558650, 4973318), 
    'BRC': (1427661, 4683597),
    'WL': (1150010, 5094022), 
    'ANND': (1443616, 4668640),
    'ASN': (1515130, 5564954), 
    'BGM': (1014381, 4767853), 
    'BVC': (1392928, 4617722), 
    'BKN': (1793466, 4691962), 
    'CDG': (1966931, 4913882), 
    'DBG': (1674611, 5497421), 
    'DDN': (1940256, 4994061), 
    'DURG': (1356160, 5202221),
    'ED': (725824, 4973901), 
    'GIMB': (1476294, 4488410),
    'HPU': (1838746, 4977798), 
    'ET': (1391443, 4612179), 
    'JL': (1344186, 4836224),
    'CCT': (1087302, 5263840), 
    'KUN': (1899885, 4927392),
    'KMT': (1103827, 5129690),
    'QLN': (569165, 4903302), 
    'KRNT': (1012998, 4994387),
    'MTJ': (1759514, 4971117), 
    'MB': (1845690, 5041523), 
    'NCJ': (517651, 4962464), 
    'NK': (1279840, 4722547), 
    'PGT': (689126, 4881350), 
    'PDY': (763814, 5109094), 
    'RTM': (1493222, 4772090),
    'RK': (1911635, 4984877), 
    'SBP': (1374099, 5374086), 
    'STA': (1572134, 5172173), 
    'SUR': (1130234, 4858010), 
    'TCR': (673766, 4877722), 
    'TPTY': (872243, 5082829), 
    'UJN': (1483475, 4850234), 
    'VLR': (826893, 5064512),
    'BJP': (1077133, 4845760),
    'VR': (1241082, 4661741), 
    'YPR': (832870, 4963206), 
    'AF': (1739309, 4992518), 
    'ALLP': (607878, 4885683), 
    'UMB': (1944205, 4913709)
    }

coordinates = []
intermediates = []
# available_trains = [] #{train_number : (train_name, from_st, to_st, (depart_time, day, date, month), (arrive_time, day, date, month), duration)}

#Algorithm to find the cartesian coordinates of source and destination
def st_code_to_cartesian(source, destination):
    
    #Station_code to Coordinates to Cartesian
    base_url = f"https://nominatim.openstreetmap.org/search"
    
    src_params = {
        "q": f"{source} railway station India",
        "format": "json",
        "limit": 1
    }
    dest_params = {
        "q": f"{destination} railway station India",
        "format": "json",
        "limit": 1
    }
    
    headers = {
        "User-Agent": "RailSplitApp/1.0 railsplitapp@gmail.com"
    }

    src_response = requests.get(base_url, params=src_params, headers=headers)
    dest_response = requests.get(base_url, params=dest_params, headers=headers)
    r = 64000 #radius of earth
    
    if src_response.status_code == 200 and src_response.json():
        data = src_response.json()[0]
        latitude = data["lat"]
        longitude = data["lon"]
        coordinates.append((round(r*float(latitude)), round(r*float(longitude))))
    else:
        return f"{{error}}: OpenstreetmapAPI src_response_code : {src_response.status_code}"
    if dest_response.status_code == 200 and dest_response.json():
        data = dest_response.json()[0]
        latitude = data["lat"]
        longitude = data["lon"]
        coordinates.append((round(r*float(latitude)), round(r*float(longitude))))
    else:
        return f"{{error}}: OpenstreetmapAPI Dest_response_code : {dest_response.status_code}"
    
    return coordinates
    

#Algorithm_one for finding intermediate junctions (using ellipse)
def algorithm_one(source, destination, coordinates):
        
        x1 = coordinates[0][0]
        y1 = coordinates[0][1]
        x2 = coordinates[1][0]
        y2 = coordinates[1][1]
        
        for i in range(1, 3):
            
            #Future implementation: Enhance this algorithm by limiting number of intermediates stations as per the distance between source and destination
            
            if len(intermediates) > 10:
                break

            s = ((((x2-x1)**2) + ((y2-y1)**2))**0.5) * ((i+10)/10)
            s = round(s, 2)
            
            for st, (x, y) in top100_cartesian.items():
                if (((((x-x1)**2) + ((y-y1)**2))**0.5) + ((((x-x2)**2) + ((y-y2)**2))**0.5)) <= s:
                     if st not in intermediates:
                        intermediates.append(st)

        if source in intermediates:
            intermediates.remove(source)
        if destination in intermediates:
            intermediates.remove(destination)

        return intermediates

#Algorithm to scrap data from internet about travel time,seat availabilty and all
async def web_scrapping(from_station, to_station, date):
    async with async_playwright() as p:
        temp_trains_data = []
        # Launch the browser
        browser = await p.chromium.launch(headless=True)
        
        # Create a new context with a custom user agent
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        page = await context.new_page()

        try:
            # Navigate to the ixigo trains page
            await page.goto(f"https://www.ixigo.com/search/result/train/{from_station}/{to_station}/{date}//1/0/0/0/ALL", timeout=40000)

            # Wait for the network to be idle
            await page.wait_for_load_state("networkidle")

            # Wait for the train listing rows to load
            await page.wait_for_selector("div.train-listing-row", timeout=50000)

            # Extract train information
            train_rows = await page.query_selector_all("div.train-listing-row")
            for row in train_rows:
                temp_train_data = {}

                # Extract train name and number
                name_number = await row.query_selector("div.name-number")
                if name_number:
                    train_number_el = await name_number.query_selector("span.train-number")
                    train_number = (await train_number_el.inner_text()).strip() if train_number_el else ""

                    train_name_el = await name_number.query_selector("span.train-name")
                    train_name = (await train_name_el.inner_text()).strip() if train_name_el else ""


                    seat_availability_row = await row.query_selector_all("div.train-class-item")

                    seat_availability_data ={}
                    for i in seat_availability_row:
                        class_name_el = await i.query_selector('.train-class')
                        class_name = (await class_name_el.inner_text()).strip() if class_name_el else ""

                        availability_el = await i.query_selector('.avail-class')
                        availability = (await availability_el.inner_text()).strip() if availability_el else ""

                        if class_name and availability:
                            seat_availability_data[class_name] = availability

                    train_details = await row.query_selector("div.orgn-dstn")
                    if train_details:
                        # details = await train_details.inner_text().strip()
                        details = (await train_details.inner_text()).strip() if train_details else ""
                        
                        details = details.split()
                        from_st = details[0]
                        departure = (details[1], details[2], details[3], details[4])

                        if len(details)==11:
                            duration = details[5]
                            to_st = details[6]
                            arrival = (details[7], details[8], details[9], details[10])
                        elif len(details)==12:
                            duration = details[5]+' '+details[6]
                            to_st = details[7]
                            arrival = (details[8], details[9], details[10], details[11])
                        else:
                            return "error in finding train details!"

                    # available_trains[train_number] = (train_name, from_st, to_st, departure, arrival, duration)
                    temp_train_data.update({"train_number": train_number,"train_name": train_name, "from_station": from_st,"to_station": to_st, "seat_availabilty": seat_availability_data, "departure": departure, "arrival": arrival, "duration": duration})

                    temp_trains_data.append(temp_train_data)


            
            for i in list(seat_availability_data.values()):
                if "AVL" in i:
                    return temp_trains_data
            else:
                return None

        except Exception as e:
            print(f"An error occurred: {e}")

        finally:
            # Close the browser
            await browser.close()

