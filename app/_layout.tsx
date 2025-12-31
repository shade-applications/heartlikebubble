import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import "../global.css";

import { useColorScheme } from 'nativewind';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasOnboarded = await AsyncStorage.getItem('has_onboarded');
        setIsReady(true);

        if (hasOnboarded !== 'true') {
          // We need to wait a tick for navigation to be ready
          setTimeout(() => {
            router.replace('/onboarding');
          }, 0);
        }
      } catch (e) {
        setIsReady(true);
      }
    };

    checkOnboarding();
  }, []);

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="image/[id]" options={{ presentation: 'transparentModal', headerShown: false, animation: 'fade' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
