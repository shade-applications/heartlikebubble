import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CATEGORIES } from '../constants/categories';

interface CategoryChipsProps {
    selectedCategory: string;
    onSelectCategory: (id: string) => void;
}

export const CategoryChips = ({ selectedCategory, onSelectCategory }: CategoryChipsProps) => {
    return (
        <View className="h-14">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
                className="h-full"
            >
                {CATEGORIES.map((cat, index) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <Animated.View
                            key={cat.id}
                            entering={FadeIn.delay(index * 30).springify()}
                        >
                            <Pressable
                                onPress={() => onSelectCategory(cat.id)}
                                className={`px-4 py-2 rounded-full border ${isSelected
                                        ? 'bg-black dark:bg-white border-transparent'
                                        : 'bg-transparent border-gray-300 dark:border-gray-700'
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${isSelected
                                        ? 'text-white dark:text-black'
                                        : 'text-black dark:text-white'
                                    }`}>
                                    {cat.emoji} {cat.label}
                                </Text>
                            </Pressable>
                        </Animated.View>
                    );
                })}
            </ScrollView>
        </View>
    );
};
