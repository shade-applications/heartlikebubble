import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES } from '../constants/categories';

export default function Onboarding() {
    const [selectedcats, setSelectedCats] = useState<string[]>([]);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const toggleCategory = (id: string) => {
        if (selectedcats.includes(id)) {
            setSelectedCats(prev => prev.filter(c => c !== id));
        } else {
            setSelectedCats(prev => [...prev, id]);
        }
    };

    const handleContinue = async () => {
        if (selectedcats.length === 0) return;

        try {
            await AsyncStorage.setItem('user_interests', JSON.stringify(selectedcats));
            await AsyncStorage.setItem('has_onboarded', 'true');
            router.replace('/(tabs)');
        } catch (e) {
            console.error('Failed to save preferences', e);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="auto" />

            <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20 }} className="flex-1">
                <Animated.View entering={FadeInUp.delay(200).springify()}>
                    <Text className="text-3xl font-bold text-black dark:text-white mb-2">
                        Welcome to HeartLikeBubble 🫧
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-lg mb-8">
                        Pick what you love to personalize your feed.
                    </Text>
                </Animated.View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-row flex-wrap gap-3">
                        {CATEGORIES.map((cat, index) => {
                            const isSelected = selectedcats.includes(cat.id);
                            return (
                                <Animated.View
                                    key={cat.id}
                                    entering={FadeInDown.delay(index * 30).springify()}
                                >
                                    <Pressable
                                        onPress={() => toggleCategory(cat.id)}
                                        className={`px-5 py-3 rounded-full border-2 ${isSelected
                                                ? 'bg-black dark:bg-white border-black dark:border-white'
                                                : 'bg-transparent border-gray-200 dark:border-gray-800'
                                            }`}
                                    >
                                        <Text className={`font-semibold ${isSelected
                                                ? 'text-white dark:text-black'
                                                : 'text-black dark:text-white'
                                            }`}>
                                            {cat.emoji} {cat.label}
                                        </Text>
                                    </Pressable>
                                </Animated.View>
                            );
                        })}
                    </View>
                </ScrollView>

                <View
                    style={{ paddingBottom: insets.bottom + 20 }}
                    className="absolute bottom-0 left-0 right-0 px-5 bg-white/90 dark:bg-black/90 blur-lg pt-4"
                >
                    <Pressable
                        onPress={handleContinue}
                        className={`w-full py-4 rounded-2xl items-center justify-center ${selectedcats.length > 0
                                ? 'bg-[#FF3366]'
                                : 'bg-gray-200 dark:bg-gray-800'
                            }`}
                        disabled={selectedcats.length === 0}
                    >
                        <Text className={`font-bold text-lg ${selectedcats.length > 0 ? 'text-white' : 'text-gray-400'
                            }`}>
                            Start Exploring
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
