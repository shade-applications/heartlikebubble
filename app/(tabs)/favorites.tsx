import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Text, View } from 'react-native';

export default function Favorites() {
    const { colorScheme } = useColorScheme();

    return (
        <View className="flex-1 justify-center items-center bg-white dark:bg-black">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Text className="text-2xl font-bold dark:text-white text-black">Favorites</Text>
            <Text className="text-gray-500 mt-2">Your saved bubbles will appear here.</Text>
        </View>
    );
}
