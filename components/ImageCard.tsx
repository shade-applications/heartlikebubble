import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { UnsplashImage } from '../lib/fetchImages';

interface ImageCardProps {
    image: UnsplashImage;
    onPress?: (image: UnsplashImage) => void;
    style?: StyleProp<ViewStyle>;
    height?: number; // Explicit height for masonry
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress, style, height }) => {
    const aspectRatio = image.width / image.height;
    // If height is provided (masonry), use it. Otherwise use aspect ratio.
    // MasonryFlashList usually handles height logic, but we might pass dynamic height based on column width.
    // Actually simplest is:

    return (
        <Pressable
            onPress={() => onPress?.(image)}
            className="active:opacity-90 active:scale-95 transform duration-200"
            style={style}
        >
            <View className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 w-full mb-3 shadow-sm">
                <Image
                    source={{ uri: image.url }}
                    placeholder={image.blurhash}
                    contentFit="cover"
                    transition={500}
                    style={{
                        width: '100%',
                        height: height ?? undefined,
                        aspectRatio: height ? undefined : aspectRatio
                    }}
                    cachePolicy="memory-disk"
                />
            </View>
        </Pressable>
    );
};
