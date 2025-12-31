import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Check } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomHeader } from '../../components/CustomHeader';
import { CATEGORIES } from '../../constants/categories';

export default function Explore() {
    const [selectedcats, setSelectedCats] = useState<string[]>([]);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const prefs = await AsyncStorage.getItem('user_interests');
            if (prefs) setSelectedCats(JSON.parse(prefs));
        } catch (e) { }
    };

    const toggleInterest = async (id: string) => {
        let newInterests;
        if (selectedcats.includes(id)) {
            newInterests = selectedcats.filter(c => c !== id);
        } else {
            // Keep specific order? Or just append.
            newInterests = [...selectedcats, id];
        }
        setSelectedCats(newInterests);
        await AsyncStorage.setItem('user_interests', JSON.stringify(newInterests));
    };

    const navigateToCategory = (id: string) => {
        router.push(`/category/${id}`);
    };

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <CustomHeader title="Explore" />

            <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }} className="px-5">

                {/* Preferences Section */}
                <Text className="text-xl font-bold mb-4 text-black dark:text-white">Your Interests</Text>
                <Text className="text-gray-500 mb-4">Select the topics you want to see on your home feed.</Text>

                <View className="flex-row flex-wrap gap-2 mb-8">
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedcats.includes(cat.id);
                        return (
                            <Pressable
                                key={cat.id}
                                onPress={() => toggleInterest(cat.id)}
                                className={`flex-row items-center px-4 py-2 rounded-full border ${isSelected
                                        ? 'bg-black dark:bg-white border-transparent'
                                        : 'border-gray-300 dark:border-gray-700'
                                    }`}
                            >
                                <Text className={`mr-2 ${isSelected ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                                    {cat.emoji} {cat.label}
                                </Text>
                                {isSelected && (
                                    <Check size={14} color={colorScheme === 'dark' ? 'black' : 'white'} />
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* Categories Navigation Section */}
                <Text className="text-xl font-bold mb-4 text-black dark:text-white">Browse Categories</Text>
                <View className="gap-3">
                    {CATEGORIES.map((cat) => (
                        <Pressable
                            key={cat.id}
                            onPress={() => navigateToCategory(cat.id)}
                            className="flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl active:opacity-80"
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 items-center justify-center bg-white dark:bg-gray-800 rounded-full mr-3">
                                    <Text className="text-lg">{cat.emoji}</Text>
                                </View>
                                <Text className="text-lg font-medium text-black dark:text-white">
                                    {cat.label}
                                </Text>
                            </View>
                            <ArrowRight size={20} color="gray" />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
