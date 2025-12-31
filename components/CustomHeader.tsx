import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CustomHeaderProps {
    title: string;
    showBack?: boolean;
}

export const CustomHeader = ({ title, showBack }: CustomHeaderProps) => {
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const router = useRouter();

    return (
        <Text style={{
            fontSize: 34,
            fontWeight: '800',
            color: isDark ? COLORS.text.dark : COLORS.text.light,
            letterSpacing: -1
        }}>
            {title}
        </Text>
            </View >
        </View >
    );
};
