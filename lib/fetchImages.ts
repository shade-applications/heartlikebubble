import { getCategoryData } from '../constants/categories';

export interface UnsplashImage {
    id: string;
    url: string;
    width: number;
    height: number;
    description: string | null;
    blur_hash?: string;
}

// Map the scraped data format to our app's format
const mapScrapedData = (data: any[]): UnsplashImage[] => {
    return data.map((item) => ({
        id: item.id,
        url: item.url,
        width: 736, // Approximate for high res pint
        height: 1000, // Varied, but 1000 is a safe aspect ratio guess for Masonry
        description: item.caption,
        blur_hash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4', // Placeholder blur
    }));
};

export const fetchImages = async (page = 1, limit = 20, category = 'positive'): Promise<UnsplashImage[]> => {
    // Simulate network delay for effect
    // await new Promise((resolve) => setTimeout(resolve, 500));

    try {
        const rawData = getCategoryData(category);
        if (!rawData || rawData.length === 0) {
            // Fallback to positive if requested category is empty (e.g. while scraping)
            if (category !== 'positive') {
                return fetchImages(page, limit, 'positive');
            }
            return [];
        }

        const mapped = mapScrapedData(rawData);

        // Simple pagination simulation
        const start = (page - 1) * limit;
        const end = start + limit;

        // If we run out, wrap around for infinite feel
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
    // In a real app we'd search all or pass category. 
    // For now, we search the passed category or default.
    let data = getCategoryData(category);
    let found = data.find((img: any) => img.id === id);

    if (!found) {
        // Search default positive as fallback
        data = getCategoryData('positive');
        found = data.find((img: any) => img.id === id);
    }

    if (found) {
        return {
            id: found.id,
            url: found.url,
            width: 736,
            height: 1000,
            description: found.caption,
            blur_hash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
        };
    }
    return undefined;
};
