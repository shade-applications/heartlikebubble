// @ts-ignore
import { MasonryFlashList } from '@shopify/flash-list';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
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

    // Fallback or Web Layout (simple 2-column flex)
    // We use this if MasonryFlashList is undefined (Web issue) or explicitly on Web if preferred
    if (!MasonryFlashList || Platform.OS === 'web') {
        const col1 = images.filter((_, i) => i % 2 === 0);
        const col2 = images.filter((_, i) => i % 2 !== 0);

        return (
            <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ paddingVertical: 12, flexDirection: 'row' }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1, paddingLeft: 12, paddingRight: 6 }}>
                    {col1.map(img => (
                        <View key={img.id} style={{ marginBottom: 0 }}>
                            <ImageCard image={img} onPress={onImagePress} />
                        </View>
                    ))}
                </View>
                <View style={{ flex: 1, paddingLeft: 6, paddingRight: 12 }}>
                    {col2.map(img => (
                        <View key={img.id} style={{ marginBottom: 0 }}>
                            <ImageCard image={img} onPress={onImagePress} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        );
    }

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
