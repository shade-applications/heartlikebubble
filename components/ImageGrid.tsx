// @ts-ignore
import { MasonryFlashList } from '@shopify/flash-list';
import React from 'react';
import { View } from 'react-native';
import { UnsplashImage } from '../lib/fetchImages';
import { ImageCard } from './ImageCard';

interface ImageGridProps {
    images: UnsplashImage[];
    onImagePress: (image: UnsplashImage) => void;
    onEndReached?: () => void;
    refreshing?: boolean;
    onRefresh?: () => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
    images,
    onImagePress,
    onEndReached,
    refreshing,
    onRefresh
}) => {
    const renderItem = ({ item, index }: { item: UnsplashImage, index: number }) => {
        // Calculate random height or aspect ratio based on item
        // For masonry, we usually just let the image determine its height by aspect ratio if width is fixed by column.
        // Unsplash mock data has width/height.
        // MasonryFlashList column width is roughly (Screen Width / numColumns).
        // We rely on ImageCard using aspectRatio.

        const columnIndex = index % 2;

        return (
            <View style={{
                paddingLeft: columnIndex === 0 ? 12 : 6,
                paddingRight: columnIndex === 0 ? 6 : 12,
                marginBottom: 0
            }}>
                <ImageCard
                    image={item}
                    onPress={onImagePress}
                />
            </View>
        );
    };

    return (
        <View style={{ flex: 1, width: '100%' }}>
            <MasonryFlashList
                data={images}
                numColumns={2}
                renderItem={renderItem}
                estimatedItemSize={250}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
            />
        </View>
    );
};
