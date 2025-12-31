import time
import json
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

import sys

# Configuration
SEARCH_QUERY = "positive quotes"
OUTPUT_FILE = "positive-images.json"
TARGET_COUNT = int(sys.argv[1]) if len(sys.argv) > 1 else 10000
SCROLL_PAUSE_TIME = 2.0  # Seconds to wait after scrolling
BATCH_SIZE = 100  # Save every N items

def setup_driver():
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless") # Run in background (optional, better to see for debugging)
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def load_existing_data():
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return []
    return []

def save_data(data):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(data)} items to {OUTPUT_FILE}")

def scrape_pinterest():
    driver = setup_driver()
    collected_data = load_existing_data()
    collected_ids = {item['id'] for item in collected_data}
    
    url = f"https://www.pinterest.com/search/pins/?q={SEARCH_QUERY.replace(' ', '%20')}"
    item_count_start = len(collected_data)
    
    try:
        print(f"Opening {url}...")
        driver.get(url)
        time.sleep(5)  # Wait for initial load

        last_height = driver.execute_script("return document.body.scrollHeight")
        
        while len(collected_data) < TARGET_COUNT:
            # Parse current page source
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            
            # Pinterest often puts images in these containers
            # This selector strategy tries to be robust against class name changes
            # We look for images that are likely the main pin content
            images = soup.find_all('img', src=True)
            
            for img in images:
                src = img['src']
                
                # Filter for pin images (usually have /236x/, /474x/, /736x/ or /originals/ in path)
                # We want high quality, so we try to grab the higher res version if possible
                if 'pinimg.com' not in src or 'profile' in src:
                    continue
                
                # Convert thumbnail to high-res URL guess (736x is standard large detailed preview)
                # original is often random chars, but 736x is reliable
                high_res_url = src.replace('/236x/', '/736x/').replace('/474x/', '/736x/')
                
                # Generate a unique ID from the URL (filename part)
                unique_id = src.split('/')[-1].split('.')[0]
                
                if unique_id in collected_ids:
                    continue
                
                alt_text = img.get('alt', 'Positive Quote')
                
                # Try to find reactions/upvotes (This is tricky as it varies greatly)
                # For now, we'll default to 0 or try to parse if a reaction span is near
                upvotes = 0 
                
                item = {
                    "id": unique_id,
                    "url": high_res_url,
                    "caption": alt_text,
                    "upvotes": upvotes # Placeholder for now, hard to scrape reliably without expensive DOM traversal
                }
                
                collected_data.append(item)
                collected_ids.add(unique_id)
                
                if len(collected_data) % BATCH_SIZE == 0:
                    print(f"Collected {len(collected_data)} items...")
                    save_data(collected_data)
                    
                if len(collected_data) >= TARGET_COUNT:
                    break
            
            # Scroll down
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(SCROLL_PAUSE_TIME)
            
            # Check if we hit bottom (Pinterest is infinite, but sometimes it pauses)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                print("Might have reached end or stuck. Waiting shorter...")
                time.sleep(2)
            last_height = new_height
            
    except KeyboardInterrupt:
        print("\nScraping interrupted by user.")
    except Exception as e:
        print(f"\nError occurred: {e}")
    finally:
        save_data(collected_data)
        driver.quit()
        print(f"Done. Total collected: {len(collected_data)}")

if __name__ == "__main__":
    scrape_pinterest()
