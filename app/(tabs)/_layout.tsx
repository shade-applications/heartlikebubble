import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Platform } from 'react-native';
import { COLORS } from '../../constants/theme';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'] | 'compass';
    color: string;
}) {
    if (props.name === 'compass') {
        return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} name="compass" />;
    }
    // @ts-ignore - FontAwesome name mismatch with compass potential logic above
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    elevation: 0,
                    borderTopWidth: 0,
                    backgroundColor: 'transparent',
                    height: Platform.OS === 'ios' ? 85 : 60,
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={isDark ? 50 : 80}
                        tint={isDark ? 'dark' : 'light'}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0
                        }}
                    />
                ),
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: isDark ? '#888' : '#666',
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size + 2} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <TabBarIcon name="compass" color={color} />,
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size + 2} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
