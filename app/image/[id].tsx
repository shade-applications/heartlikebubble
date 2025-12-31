import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Dimensions, Platform, Pressable, Text, View } from 'react-native';
import { ImageViewer } from '../../components/ImageViewer';
import { getImageById } from '../../lib/fetchImages';

const { height } = Dimensions.get('window');

export default function ImageDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const image = getImageById(id);

    if (!image) {
        return <View className="flex-1 bg-black justify-center items-center"><Text className="text-white">Image not found</Text></View>;
    }

    const handleShare = async () => {
        try {
            const fileUri = (FileSystem.cacheDirectory || "") + image.id + '.jpg';
            await FileSystem.downloadAsync(image.url, fileUri);
            await Sharing.shareAsync(fileUri);
        } catch (e) {
            Alert.alert("Error", "Could not share image");
        }
    };

    const handleSave = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission needed", "We need permission to save to gallery");
            return;
        }
        try {
            // @ts-ignore
            const fileUri = (FileSystem.cacheDirectory || "") + image.id + '.jpg';
            const { uri } = await FileSystem.downloadAsync(image.url, fileUri);
            await MediaLibrary.saveToLibraryAsync(uri);
            Alert.alert("Saved", "Image saved to gallery!");
        } catch (e) {
            Alert.alert("Error", "Could not save image");
        }
    };

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background Blur (optional aesthetic) */}
            <BlurView intensity={90} tint="dark" style={[{ position: 'absolute', width: '100%', height: '100%' }]} />

            <ImageViewer image={image} onClose={() => router.back()} />

            {/* Top Bar */}
            <View className="absolute top-12 left-0 right-0 p-4 flex-row justify-between items-center z-50">
                <Pressable onPress={() => router.back()} className="w-10 h-10 bg-black/50 rounded-full justify-center items-center">
                    <Ionicons name="close" size={24} color="white" />
                </Pressable>
            </View>

            {/* Bottom Action Sheet (Mock) */}
            <View className="absolute bottom-10 left-0 right-0 flex-row justify-center space-x-6 items-center z-50">
                <Pressable onPress={handleShare} className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                    <Ionicons name="share-outline" size={28} color="white" />
                </Pressable>
                <Pressable onPress={handleSave} className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                    <Ionicons name="download-outline" size={28} color="white" />
                </Pressable>
                {Platform.OS === 'android' && (
                    <Pressable onPress={handleShare} className="bg-green-500/80 p-4 rounded-full backdrop-blur-md">
                        <Ionicons name="logo-whatsapp" size={28} color="white" />
                    </Pressable>
                )}
            </View>
        </View>
    );
}
