import time
import json
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Global Config
TARGET_PER_CATEGORY = 1000
SCROLL_PAUSE_TIME = 2.0
BATCH_SIZE = 50

CATEGORIES = [
    "life", "study", "motivation", "wallpaper", "background",
    "nature", "travel", "food", "fitness", "aesthetic",
    "art", "minimal", "dark", "neon", "cats",
    "dogs", "cars", "architecture", "love", "vintage",
    "abstract", "space", "sky", "flowers", "fashion",
    "music", "coding", "gaming"
]

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "constants", "data")

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--headless") # Uncomment for headless
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver

def save_data(category, data):
    filepath = os.path.join(DATA_DIR, f"{category}.json")
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[{category}] Saved {len(data)} items.")

def scrape_category(driver, category):
    print(f"\n--- Starting Category: {category} ---")
    filepath = os.path.join(DATA_DIR, f"{category}.json")
    
    collected_data = []
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                collected_data = json.load(f)
        except:
            collected_data = []
    
    collected_ids = {item['id'] for item in collected_data}
    
    if len(collected_data) >= TARGET_PER_CATEGORY:
        print(f"[{category}] Already met target ({len(collected_data)}). Skipping.")
        return

    url = f"https://www.pinterest.com/search/pins/?q={category + ' aesthetic'}"
    driver.get(url)
    time.sleep(5)
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    consecutive_stalls = 0
    
    while len(collected_data) < TARGET_PER_CATEGORY:
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
            
            # Double check
            if '/60x60/' in high_res_url:
                continue

            unique_id = src.split('/')[-1].split('.')[0]
            
            if unique_id in collected_ids:
                continue
            
            alt_text = img.get('alt', f'{category} image')
            
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
            if len(collected_data) % BATCH_SIZE == 0:
                save_data(category, collected_data)
        
        if len(collected_data) >= TARGET_PER_CATEGORY:
            break
            
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(SCROLL_PAUSE_TIME)
        
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            consecutive_stalls += 1
            if consecutive_stalls > 5:
                print(f"[{category}] Stalled endlessly. Moving to next.")
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
        for category in CATEGORIES:
            scrape_category(driver, category)
    except KeyboardInterrupt:
        print("\nBatch scraping interrupted.")
    except Exception as e:
        print(f"Global Error: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
