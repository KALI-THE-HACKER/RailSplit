from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

# Setup Selenium with a headless browser
options = Options()
options.add_argument("--headless")  
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Load the webpage
driver.get("https://www.ixigo.com")

# Extract paragraph elements using Selenium
paragraphs = driver.find_elements(By.TAG_NAME, "p")

for p in paragraphs:
    print(p.text)

driver.quit()
