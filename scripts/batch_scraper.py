import time
import json
import os
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Global Config
TARGET_PER_CATEGORY = 2000 
SCROLL_PAUSE_TIME = 2.0
BATCH_SIZE = 50

# Quote-centric categories
CATEGORIES = [
    "positive", "life", "motivation", "study", "love", 
    "wisdom", "success", "happiness", "sad", "faith", 
    "affirmations", "funny", "friendship", "gym", "morning", 
    "night", "healing", "nature", "calm", "books", 
    "aesthetic", "minimal", "phone", "dark", "vintage"
]

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "constants", "data")

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--headless") 
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def save_data(category, data):
    filepath = os.path.join(DATA_DIR, f"{category}.json")
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[{category}] Saved {len(data)} items.")

def scrape_category(driver, category):
    # Enforce "quotes" suffix for relevance unless it already implies it
    search_term = f"{category} quotes wallpaper"
    print(f"\n--- Starting Category: {category} (Search: '{search_term}') ---")
    
    filepath = os.path.join(DATA_DIR, f"{category}.json")
    
    collected_data = []
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                collected_data = json.load(f)
        except:
            collected_data = []
    
    collected_ids = {item['id'] for item in collected_data}
    initial_count = len(collected_data)
    
    if initial_count >= TARGET_PER_CATEGORY:
        print(f"[{category}] Already met target ({initial_count}). (Will continue for a bit to check for new stuff anyway)")
        # return # Optional: force continue to find NEW items even if target met?
    
    url = f"https://www.pinterest.com/search/pins/?q={search_term.replace(' ', '%20')}"
    driver.get(url)
    time.sleep(5)
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    consecutive_stalls = 0
    
    # Try finding the body to press keys on
    try:
        body = driver.find_element(By.TAG_NAME, 'body')
    except:
        body = None
    
    while len(collected_data) < TARGET_PER_CATEGORY + 500: # Overshoot slightly to dedupe later if needed
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        images = soup.find_all('img', src=True)
        
        new_items_found = False
        
        for img in images:
            src = img['src']
            if 'pinimg.com' not in src or 'profile' in src:
                continue
            
            # Resolution bump
            high_res_url = src
            for sizes in ['/60x60/', '/236x/', '/474x/']:
                high_res_url = high_res_url.replace(sizes, '/736x/')
            
            if '/60x60/' in high_res_url:
                continue

            unique_id = src.split('/')[-1].split('.')[0]
            
            if unique_id in collected_ids:
                continue
            
            alt_text = img.get('alt', f'{category} quote')
            
            item = {
                "id": unique_id,
                "url": high_res_url,
                "caption": alt_text,
                "category": category,
                "upvotes": 0
            }
            
            collected_data.append(item)
            collected_ids.add(unique_id)
            new_items_found = True
        
        if new_items_found:
            # Only save batch if we actually added something
            if len(collected_data) % BATCH_SIZE == 0:
                save_data(category, collected_data)
                print(f"[{category}] Collected {len(collected_data)} (New: {len(collected_data) - initial_count})...")
            consecutive_stalls = 0 # Reset fails if we found data
        
        if len(collected_data) >= TARGET_PER_CATEGORY:
            print(f"[{category}] Hit target {TARGET_PER_CATEGORY}!")
            break
            
        # Scroll Logic
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        # Also try keys to trigger lazy load sometimes
        if body:
            try:
                body.send_keys(Keys.PAGE_DOWN)
            except:
                pass
                
        time.sleep(SCROLL_PAUSE_TIME + random.uniform(0.5, 2.0))
        
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            consecutive_stalls += 1
            if consecutive_stalls > 8:
                print(f"[{category}] Stalled endlessly ({consecutive_stalls} times).")
                # Try one refresh + reload
                # driver.refresh()
                # time.sleep(5)
                # But typically this loses scroll position on infinite feeds. 
                # Better to just break and move to next category.
                break
        else:
            consecutive_stalls = 0
            last_height = new_height

    save_data(category, collected_data)
    print(f"[{category}] Finished with {len(collected_data)} items.")

def main():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        
    driver = setup_driver()
    
    try:
        # Check connection or do a dummy load
        driver.get("https://www.pinterest.com")
        time.sleep(3)
        
        for category in CATEGORIES:
            scrape_category(driver, category)
            time.sleep(2) # Breath between categories
    except KeyboardInterrupt:
        print("\nBatch scraping interrupted.")
    except Exception as e:
        print(f"Global Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
