import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UnsplashImage {
    id: string;
    url: string;
    width: number;
    height: number;
    description: string | null;
    blur_hash?: string;
}

// GitHub Raw Content Base URL
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/shade-applications/heartlikebubble/refs/heads/main/constants/data";
const CACHE_PREFIX = "cache_category_";
const CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24; // 24 hours

// Map the scraped data format to our app's format
const mapScrapedData = (data: any[]): UnsplashImage[] => {
    return data.map((item) => ({
        id: item.id,
        url: item.url,
        width: 736,
        height: 1000,
        description: item.caption,
        blur_hash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    }));
};

export const fetchImages = async (page = 1, limit = 20, category = 'positive'): Promise<UnsplashImage[]> => {
    try {
        const cacheKey = `${CACHE_PREFIX}${category}`;
        let rawData: any[] = [];

        // 1. Check Cache
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                // console.log(`[Cache] Hit for ${category}`);
                rawData = data;
            }
        }

        // 2. Fetch from Network if no cache
        if (rawData.length === 0) {
            // console.log(`[Network] Fetching ${category}...`);
            const url = `${GITHUB_RAW_BASE}/${category}.json`;
            const response = await fetch(url);

            if (response.ok) {
                const json = await response.json();
                rawData = json;
                // Save to cache
                await AsyncStorage.setItem(cacheKey, JSON.stringify({
                    timestamp: Date.now(),
                    data: rawData
                }));
            } else {
                console.warn(`[Network] Failed to fetch ${category}: ${response.status}`);
            }
        }

        if (!rawData || rawData.length === 0) {
            // Fallback to positive if specific category fails and we have no cache
            if (category !== 'positive') {
                // Prevent infinite recursion loops if positive also fails
                return [];
            }
            return [];
        }

        const mapped = mapScrapedData(rawData);

        // Pagination logic
        const start = (page - 1) * limit;
        const end = start + limit;

        if (start >= mapped.length) {
            const wrappedStart = start % mapped.length;
            return mapped.slice(wrappedStart, wrappedStart + limit);
        }

        return mapped.slice(start, end);
    } catch (e) {
        console.error("Error loading images:", e);
        return [];
    }
};

export const getImageById = async (id: string, category = 'positive'): Promise<UnsplashImage | undefined> => {
    // Try to find in the current category first
    try {
        const imageList = await fetchImages(1, 10000, category);
        const found = imageList.find(img => img.id === id);
        if (found) return found;
    } catch (e) { }

    return undefined;
};
