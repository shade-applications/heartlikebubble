// This file maps category IDs to their dataset.
// Note: As the scraper runs, more files need to be imported here.
// For now, we stub them or use correct paths waiting for the file to exist.

// We will use a dynamic loader pattern where possible, or explicit imports.
// Getting explicit is safer for Metro.

export const CATEGORIES = [
    { id: 'positive', label: 'Positive', emoji: '✨' },
    { id: 'life', label: 'Life', emoji: '🌱' },
    { id: 'study', label: 'Study', emoji: '📚' },
    { id: 'motivation', label: 'Motivation', emoji: '🔥' },
    { id: 'wallpaper', label: 'Wallpaper', emoji: '📱' },
    { id: 'background', label: 'Background', emoji: '🖼️' },
    { id: 'nature', label: 'Nature', emoji: '🌿' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'food', label: 'Food', emoji: '🍕' },
    { id: 'fitness', label: 'Fitness', emoji: '💪' },
    { id: 'aesthetic', label: 'Aesthetic', emoji: '🎨' },
    { id: 'art', label: 'Art', emoji: '🎭' },
    { id: 'minimal', label: 'Minimal', emoji: '⚪' },
    { id: 'dark', label: 'Dark', emoji: '🌑' },
    { id: 'neon', label: 'Neon', emoji: '🌈' },
    { id: 'cats', label: 'Cats', emoji: '🐱' },
    { id: 'dogs', label: 'Dogs', emoji: '🐶' },
    { id: 'cars', label: 'Cars', emoji: '🚗' },
    { id: 'architecture', label: 'Architecture', emoji: '🏛️' },
    { id: 'love', label: 'Love', emoji: '❤️' },
    { id: 'vintage', label: 'Vintage', emoji: '📺' },
    { id: 'abstract', label: 'Abstract', emoji: '🌀' },
    { id: 'space', label: 'Space', emoji: '🌌' },
    { id: 'sky', label: 'Sky', emoji: '☁️' },
    { id: 'flowers', label: 'Flowers', emoji: '🌸' },
    { id: 'fashion', label: 'Fashion', emoji: '👗' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'coding', label: 'Coding', emoji: '💻' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
];

// Helper to get data regardless of whether file exists (fallback to empty)
export const getCategoryData = (categoryId: string) => {
    switch (categoryId) {
        case 'positive': return require('./data/positive.json');
        // Generated:
        case 'life': try { return require('./data/life.json'); } catch { return []; }
        case 'study': try { return require('./data/study.json'); } catch { return []; }
        case 'motivation': try { return require('./data/motivation.json'); } catch { return []; }
        case 'wallpaper': try { return require('./data/wallpaper.json'); } catch { return []; }
        case 'background': try { return require('./data/background.json'); } catch { return []; }
        case 'nature': try { return require('./data/nature.json'); } catch { return []; }
        case 'travel': try { return require('./data/travel.json'); } catch { return []; }
        case 'food': try { return require('./data/food.json'); } catch { return []; }
        case 'fitness': try { return require('./data/fitness.json'); } catch { return []; }
        case 'aesthetic': try { return require('./data/aesthetic.json'); } catch { return []; }
        case 'art': try { return require('./data/art.json'); } catch { return []; }
        case 'minimal': try { return require('./data/minimal.json'); } catch { return []; }
        case 'dark': try { return require('./data/dark.json'); } catch { return []; }
        case 'neon': try { return require('./data/neon.json'); } catch { return []; }
        case 'cats': try { return require('./data/cats.json'); } catch { return []; }
        case 'dogs': try { return require('./data/dogs.json'); } catch { return []; }
        case 'cars': try { return require('./data/cars.json'); } catch { return []; }
        case 'architecture': try { return require('./data/architecture.json'); } catch { return []; }
        case 'love': try { return require('./data/love.json'); } catch { return []; }
        case 'vintage': try { return require('./data/vintage.json'); } catch { return []; }
        case 'abstract': try { return require('./data/abstract.json'); } catch { return []; }
        case 'space': try { return require('./data/space.json'); } catch { return []; }
        case 'sky': try { return require('./data/sky.json'); } catch { return []; }
        case 'flowers': try { return require('./data/flowers.json'); } catch { return []; }
        case 'fashion': try { return require('./data/fashion.json'); } catch { return []; }
        case 'music': try { return require('./data/music.json'); } catch { return []; }
        case 'coding': try { return require('./data/coding.json'); } catch { return []; }
        case 'gaming': try { return require('./data/gaming.json'); } catch { return []; }
        default: return [];
    }
};
