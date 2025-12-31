import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoritesContextType {
    favorites: string[];
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    isFavorite: () => false,
    toggleFavorite: async () => { },
});

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem('user_favorites');
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load favorites", e);
        }
    };

    const toggleFavorite = async (id: string) => {
        try {
            let newFavorites;
            if (favorites.includes(id)) {
                newFavorites = favorites.filter(favId => favId !== id);
            } else {
                newFavorites = [...favorites, id];
            }
            setFavorites(newFavorites);
            await AsyncStorage.setItem('user_favorites', JSON.stringify(newFavorites));
        } catch (e) {
            console.error("Failed to toggle favorite", e);
        }
    };

    const isFavorite = (id: string) => favorites.includes(id);

    return (
        <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};
