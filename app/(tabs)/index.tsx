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
import { fetchAllImages, shuffleArray, UnsplashImage } from '../../lib/fetchImages';

export default function Home() {
    const [allImages, setAllImages] = useState<UnsplashImage[]>([]);
    const [displayedImages, setDisplayedImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("positive");
    const [page, setPage] = useState(1);

    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const insets = useSafeAreaInsets();
    const PAGE_SIZE = 20;

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
            initialLoad();
        }
    }, [selectedCategory]);

    const initialLoad = async () => {
        setLoading(true);
        setPage(1);

        // Fetch ALL images for the category
        const fullList = await fetchAllImages(selectedCategory);

        // Shuffle them randomly for the "random feed" requirement
        const shuffled = shuffleArray(fullList);
        setAllImages(shuffled);

        // Set initial page
        setDisplayedImages(shuffled.slice(0, PAGE_SIZE));
        setLoading(false);
    };

    const loadMore = () => {
        if (!loading && !refreshing && displayedImages.length < allImages.length) {
            const nextPage = page + 1;
            const nextBatch = allImages.slice(0, nextPage * PAGE_SIZE); // Slice from 0 to new end
            // OR strictly append:
            // const nextBatch = allImages.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
            // setDisplayedImages(prev => [...prev, ...nextBatch]);

            setDisplayedImages(nextBatch);
            setPage(nextPage);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Re-fetch and Re-shuffle to change feed every time
        const fullList = await fetchAllImages(selectedCategory);
        const shuffled = shuffleArray(fullList);
        setAllImages(shuffled);
        setDisplayedImages(shuffled.slice(0, PAGE_SIZE));
        setPage(1);
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
                        images={displayedImages}
                        onImagePress={openImage}
                        onEndReached={loadMore}
                        // refreshing={refreshing} 
                        onRefresh={onRefresh}
                    />
                </View>
            )}
        </View>
    );
}
