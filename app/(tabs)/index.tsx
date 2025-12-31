import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CategoryChips } from '../../components/CategoryChips';
import { CustomHeader } from '../../components/CustomHeader';
import { CustomRefreshControl } from '../../components/CustomRefreshControl';
import { ImageGrid } from '../../components/ImageGrid';
import { COLORS } from '../../constants/theme';
import { fetchImages, UnsplashImage } from '../../lib/fetchImages';

export default function Home() {
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("positive");

    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const prefs = await AsyncStorage.getItem('user_interests');
            if (prefs) {
                const interests = JSON.parse(prefs);
                if (interests.length > 0) {
                    setSelectedCategory(interests[0]);
                }
            }
        } catch (e) {
            console.log("Error loading prefs", e);
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            loadImages();
        }
    }, [selectedCategory]); // Reload when category changes

    const loadImages = async () => {
        setLoading(true);
        const newImages = await fetchImages(1, 20, selectedCategory);
        setImages(newImages);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh fetch with slight delay
        await new Promise(r => setTimeout(r, 1500));
        // Shuffle or re-fetch logic could go here
        // For now, re-fetch from top
        await loadImages();
        setRefreshing(false);
    };

    const openImage = (image: UnsplashImage) => {
        router.push(`/image/${image.id}`);
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack.Screen options={{ headerShown: false }} />

            <CustomHeader title="Discover" />

            <View className="py-2 bg-white/80 dark:bg-black/80 blur-md z-10">
                <CategoryChips
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </View>

            <CustomRefreshControl refreshing={refreshing} />

            {loading ? (
                <View className="flex-1 justify-center items-center pt-20">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    {/* Padding handled by header/chips height now, or we adjust contentContainerStyle */}
                    <ImageGrid
                        images={images}
                        onImagePress={openImage}
                        onEndReached={() => { }}
                        // refreshing={refreshing} 
                        onRefresh={onRefresh}
                    />
                </View>
            )}
        </View>
    );
}
