import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { CustomHeader } from '../../components/CustomHeader';
import { ImageGrid } from '../../components/ImageGrid';
import { CATEGORIES } from '../../constants/categories';
import { COLORS } from '../../constants/theme';
import { fetchImages, UnsplashImage } from '../../lib/fetchImages';

export default function CategoryScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const router = useRouter();
    const { colorScheme } = useColorScheme();

    const categoryLabel = CATEGORIES.find(c => c.id === id)?.label || id;

    useEffect(() => {
        loadImages(1, true);
    }, [id]);

    const loadImages = async (pageNum: number, reset = false) => {
        if (reset) setLoading(true);
        const newImages = await fetchImages(pageNum, 20, id);
        if (reset) {
            setImages(newImages);
            setLoading(false);
        } else {
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const loadMore = () => {
        if (!loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadImages(nextPage, false);
        }
    };

    const openImage = (image: UnsplashImage) => {
        router.push(`/image/${image.id}`);
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack.Screen options={{ headerShown: false }} />

            <CustomHeader title={categoryLabel} showBack />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ImageGrid
                    images={images}
                    onImagePress={openImage}
                    onEndReached={loadMore}
                />
            )}
        </View>
    );
}
