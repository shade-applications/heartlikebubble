import { BlurView } from 'expo-blur';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

interface CustomHeaderProps {
    title: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: 60 + insets.top,
        }}>
            <BlurView
                intensity={isDark ? 50 : 80}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />
            <View style={{
                paddingTop: insets.top,
                height: '100%',
                justifyContent: 'center',
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }}>
                <Text style={{
                    fontSize: 34,
                    fontWeight: '800',
                    color: isDark ? COLORS.text.dark : COLORS.text.light,
                    letterSpacing: -1
                }}>
                    {title}
                </Text>
            </View>
        </View>
    );
};
