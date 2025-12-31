import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ImageGrid } from '../components/ImageGrid';
import { COLORS } from '../constants/theme';
import { fetchImages, UnsplashImage } from '../lib/fetchImages';

export default function Home() {
    const [images, setImages] = useState<UnsplashImage[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    useEffect(() => {
        loadImages();
    }, []);

    const loadImages = async () => {
        // In a real app, handle pagination here
        const newImages = await fetchImages();
        setImages(newImages);
        setLoading(false);
    };

    const openImage = (image: UnsplashImage) => {
        router.push(`/image/${image.id}`);
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack.Screen
                options={{
                    title: 'HeartLikeBubble',
                    headerLargeTitle: false,
                    headerTitleStyle: {
                        fontWeight: '800',
                        fontSize: 20,
                    },
                    headerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
                    },
                    headerTintColor: colorScheme === 'dark' ? '#fff' : '#000',
                    headerShadowVisible: false,
                }}
            />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ImageGrid
                    images={images}
                    onImagePress={openImage}
                    onEndReached={() => {
                        // Simulate infinite scroll by appending current images again
                        // In production, fetch next page
                        // For this demo, let's just keep it simple or append
                    }}
                />
            )}
        </View>
    );
}
