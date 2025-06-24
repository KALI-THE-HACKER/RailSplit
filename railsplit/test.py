import requests
from datetime import datetime, timedelta
import time
import asyncio
from playwright.async_api import async_playwright

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

                        print("Length of details : ", len(details))
                        print("Element 5: ", details[5])
                        print("Element 6:", details[6])

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
            # return "SUCCESS"

async def main():
    from_station = "CSTM"
    to_station = "SBC"
    date = "05072025"
    
    trains_data = await web_scrapping(from_station, to_station, date)
    
    if trains_data:
        print("Available Trains:")
        for train in trains_data:
            print(train)
    else:
        print("No trains available or an error occurred.")

if __name__ == "__main__":
    asyncio.run(main())