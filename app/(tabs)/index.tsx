import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomHeader } from '../../components/CustomHeader';
import { ImageGrid } from '../../components/ImageGrid';
import { COLORS } from '../../constants/theme';
import { fetchImages, UnsplashImage } from '../../lib/fetchImages';

export default function Home() {
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        const newImages = await fetchImages();
        setImages(newImages);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate refresh fetch
        await new Promise(r => setTimeout(r, 1500));
        // Shuffle images for "new" content effect
        setImages(prev => [...prev].sort(() => Math.random() - 0.5));
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

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <View style={{ flex: 1, paddingTop: 60 + insets.top }}>
                    <ImageGrid
                        images={images}
                        onImagePress={openImage}
                        onEndReached={() => { }}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                </View>
            )}
        </View>
    );
}
