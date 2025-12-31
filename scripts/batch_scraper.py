import time
import json
import os
import random
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Global Config
TARGET_PER_CATEGORY = 2000
SCROLL_PAUSE_TIME = 2.5
BATCH_SIZE = 50

# Priority list based on empty files found
PRIORITY_CATEGORIES = [
    "night", "morning", "motivation", "success", "happiness", "calm", "faith", 
    "friendship", "funny", "gym", "sad", "books", "phone", "healing", 
    "wisdom", "affirmations"
]

# Full List
ALL_CATEGORIES = [
    "positive", "life", "love", "nature", "aesthetic", "minimal", "dark", "vintage",
    "study" 
] + PRIORITY_CATEGORIES 

# Scrape Priority First
CATEGORIES = sorted(list(set(ALL_CATEGORIES)), key=lambda x: 0 if x in PRIORITY_CATEGORIES else 1)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "constants", "data")

def setup_driver():
    options = Options()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    # Randomized UA
    ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    options.add_argument(f"user-agent={ua}")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    # Stealth properties
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        """
    })
    return driver

def save_data(category, data):
    filepath = os.path.join(DATA_DIR, f"{category}.json")
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[{category}] Saved {len(data)} items.")

def remove_login_popup(driver):
    try:
        # Pinterest login overlay is often a div with specific aria-label or just blocking
        driver.execute_script("""
            const overlays = document.querySelectorAll('div[data-test-id="giftWrap"], div[aria-label="Unauth scenario"]');
            overlays.forEach(el => el.remove());
            document.body.style.overflow = "auto"; 
        """)
    except:
        pass

def scrape_category(driver, category):
    search_term = f"{category} quotes wallpaper"
    print(f"\n--- Starting Category: {category} (Search: '{search_term}') ---")
    
    filepath = os.path.join(DATA_DIR, f"{category}.json")
    
    collected_data = []
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                content = json.load(f)
                if isinstance(content, list):
                    collected_data = content
        except:
            collected_data = []
    
    collected_ids = {item['id'] for item in collected_data}
    initial_count = len(collected_data)
    
    if initial_count >= TARGET_PER_CATEGORY:
        print(f"[{category}] Already met target ({initial_count}).")
        return

    url = f"https://www.pinterest.com/search/pins/?q={search_term.replace(' ', '%20')}"
    driver.get(url)
    time.sleep(random.uniform(4, 7))
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    consecutive_stalls = 0
    
    while len(collected_data) < TARGET_PER_CATEGORY + 200:
        # Attempt to remove popup if present
        remove_login_popup(driver)
        
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
            if len(collected_data) % BATCH_SIZE == 0:
                save_data(category, collected_data)
                print(f"[{category}] Collected {len(collected_data)} (+{len(collected_data) - initial_count} new)...")
            consecutive_stalls = 0
        
        if len(collected_data) >= TARGET_PER_CATEGORY:
            print(f"[{category}] Hit target {TARGET_PER_CATEGORY}!")
            break
            
        # Robust Logic for scrolling
        try:
            # 1. Scroll JS
            driver.execute_script(f"window.scrollBy(0, {random.randint(800, 1500)});")
            time.sleep(random.uniform(0.5, 1.0))
            
            # 2. Key press
            body = driver.find_element(By.TAG_NAME, 'body')
            body.send_keys(Keys.PAGE_DOWN)
        except:
            pass
            
        time.sleep(SCROLL_PAUSE_TIME + random.random())
        
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            consecutive_stalls += 1
            if consecutive_stalls > 6:
                print(f"[{category}] Stalled. Refreshing page...")
                driver.refresh()
                time.sleep(5)
                # After refresh, we lose position, but might find new stuff at top if randomized? 
                # Pinterest search results are somewhat static.
                # If we stall after refresh, we bail.
                if consecutive_stalls > 8:
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
        driver.get("https://www.pinterest.com")
        time.sleep(3)
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
