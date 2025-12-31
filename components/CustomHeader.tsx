import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomHeaderProps {
    title: string;
    showBack?: boolean;
}

export const CustomHeader = ({ title, showBack }: CustomHeaderProps) => {
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    const isDark = colorScheme === 'dark';

    return (
        <View
            style={{ paddingTop: insets.top }}
            className="flex-row items-center justify-between px-5 py-3 bg-white/80 dark:bg-black/80 blur-md z-50 border-b border-gray-100 dark:border-gray-900"
        >
            <View className="flex-row items-center gap-3">
                {showBack && (
                    <Pressable onPress={() => router.back()} hitSlop={10}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={isDark ? 'white' : 'black'}
                        />
                    </Pressable>
                )}
                <Text className="text-2xl font-bold text-black dark:text-white tracking-tight">
                    {title}
                </Text>
            </View>
            <Pressable className="p-2 rounded-full active:bg-gray-100 dark:active:bg-gray-800">
                <Ionicons
                    name="search-outline"
                    size={24}
                    color={isDark ? 'white' : 'black'}
                />
            </Pressable>
        </View>
    );
};
