import json

FILE = "positive-images.json"

try:
    with open(FILE, "r") as f:
        data = json.load(f)

    updated_count = 0
    for item in data:
        original = item["url"]
        # Replace common low-res definitions
        new_url = original.replace("/60x60/", "/736x/")
        new_url = new_url.replace("/236x/", "/736x/")
        new_url = new_url.replace("/474x/", "/736x/")
        
        if original != new_url:
            item["url"] = new_url
            updated_count += 1

    with open(FILE, "w") as f:
        json.dump(data, f, indent=2)

    print(f"Updated {updated_count} images to high resolution.")

except Exception as e:
    print(f"Error: {e}")
