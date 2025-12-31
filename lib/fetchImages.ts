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

// Fisher-Yates shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
                rawData = data;
            }
        }

        // 2. Fetch from Network if no cache
        if (rawData.length === 0) {
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
            if (category !== 'positive') {
                return [];
            }
            return [];
        }

        // Shuffle the full dataset BEFORE pagination to ensure randomness
        // Note: For consistency across pages, we might ideally want to seed this or shuffle once per session.
        // But for "random feed" requirement, full shuffle on load is good.
        // To keep pagination consistent, shuffling should ideally happen once and be stored in state, 
        // BUT `fetchImages` is stateless.
        // Workaround: We shuffle the mapped array, but since this func is called on every "load more", 
        // completely randomizing every time might show duplicates across pages.
        // HOWEVER, user requested "after refresh change the feed every time".

        // Let's rely on the caller to handle randomness consistency OR just shuffle here and accept some potential dupes on infinite scroll boundary if called repeatedly.
        // Actually, to make it truly random but consistent for pagination, we should probably shuffle based on a seed or let the UI handle shuffling.
        // For now, let's simply map.

        let mapped = mapScrapedData(rawData);

        // We will simple return a slice. To implement "random feed on refresh", the caller (Home) 
        // should probably fetch ALL IDs or a large batch and locally shuffle.
        // But to keep it simple within this function: we can't easily shuffle consistently across pages without state.
        // So we will add a `randomize` flag?

        // Better approach: modifying logic to simple shuffle always? No, pagination breaks.
        // Let's just return the data. The UI (`index.tsx`) acts as the state holder.
        // It calls `fetchImages` which returns a slice.
        // If we want random order, we should shuffle `rawData` before slicing.
        // But `fetchImages` is called for page 1, then page 2.
        // If we shuffle inside `fetchImages` every time, page 2 might contain items from page 1.

        // SOLUTION: The `fetchImages` function should perhaps return the WHOLE list if page=1? 
        // OR we just shuffle deterministically based on a session ID?

        // Let's implement a deterministic shuffle based on a seed? Too complex for now.
        // Let's stick to: Fetch returns slice of original order.
        // BUT `mapScrapedData` creates the list.

        // Revised plan: We'll modify `index.tsx` to handle the shuffling after fetching the FULL list or large batch.
        // Actually, let's keep `fetchImages` as is (returning sliced data), but maybe we can introduce a `shuffle` param?
        // If we shuffle here, we break pagination consistency.

        // User wants: "image feed must be random and after refresh change the feed every time"
        // This suggests we shouldn't rely on the fixed JSON order.
        // I will add a `shuffle` util but implement the randomization in the UI state or a wrapper.

        // ACTUALLY, simpler: `fetchImages` fetches the JSON, shuffles it locally based on a `seed` if provided?
        // Let's leave `fetchImages` mostly as is but add the shuffle utility export so `index.tsx` can use it.

        return mapped.slice((page - 1) * limit, ((page - 1) * limit) + limit);
    } catch (e) {
        console.error("Error loading images:", e);
        return [];
    }
};

export const fetchAllImages = async (category = 'positive'): Promise<UnsplashImage[]> => {
    // Helper to get everything so we can shuffle in the UI
    try {
        const cacheKey = `${CACHE_PREFIX}${category}`;
        let rawData: any[] = [];
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) rawData = data;
        }
        if (rawData.length === 0) {
            const response = await fetch(`${GITHUB_RAW_BASE}/${category}.json`);
            if (response.ok) {
                rawData = await response.json();
                await AsyncStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: rawData }));
            }
        }
        return mapScrapedData(rawData);
    } catch (e) {
        return [];
    }
}

export const getImageById = async (id: string, category = 'positive'): Promise<UnsplashImage | undefined> => {
    // Try to find in the current category first
    try {
        const imageList = await fetchImages(1, 10000, category);
        const found = imageList.find(img => img.id === id);
        if (found) return found;
    } catch (e) { }

    return undefined;
};
