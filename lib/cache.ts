import { Image } from 'expo-image';

// Prefetch images to disk cache
export const cacheImages = async (urls: string[]) => {
    const promises = urls.map((url) => {
        return Image.prefetch(url);
    });

    await Promise.all(promises);
};

// In-memory cache for data (not images, just the JSON response)
let dataCache: any = null;

export const setCache = (data: any) => {
    dataCache = data;
};

export const getCache = () => {
    return dataCache;
};
