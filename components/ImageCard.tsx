import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { useFavorites } from '../context/FavoritesContext';
import { UnsplashImage } from '../lib/fetchImages';

interface ImageCardProps {
    image: UnsplashImage;
    onPress?: (image: UnsplashImage) => void;
    style?: StyleProp<ViewStyle>;
    height?: number;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress, style, height }) => {
    const aspectRatio = image.width / image.height;
    const { isFavorite, toggleFavorite } = useFavorites();
    const liked = isFavorite(image.id);
    const scale = useSharedValue(1);

    const handleLike = (e: any) => {
        e.stopPropagation();
        toggleFavorite(image.id);
        scale.value = withSequence(withSpring(1.2), withSpring(1));
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Pressable
            onPress={() => onPress?.(image)}
            className="active:opacity-90 active:scale-95 transform duration-200 relative"
            style={style}
        >
            <View className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 w-full mb-3 shadow-sm relative">
                <Image
                    source={{ uri: image.url }}
                    placeholder={image.blur_hash}
                    contentFit="cover"
                    transition={500}
                    style={{
                        width: '100%',
                        height: height ?? undefined,
                        aspectRatio: height ? undefined : aspectRatio
                    }}
                    cachePolicy="memory-disk"
                />

                {/* Heart Button Overlay */}
                <Pressable
                    onPress={handleLike}
                    className="absolute bottom-2 right-2 p-2 bg-black/30 backdrop-blur-md rounded-full"
                    hitSlop={10}
                >
                    <Animated.View style={animatedStyle}>
                        <Heart
                            size={20}
                            color={liked ? "#FF3366" : "white"}
                            fill={liked ? "#FF3366" : "transparent"}
                        />
                    </Animated.View>
                </Pressable>
            </View>
        </Pressable>
    );
};
