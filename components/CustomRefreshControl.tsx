import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { COLORS } from '../constants/theme';

interface CustomRefreshControlProps {
    refreshing: boolean;
}

export const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({ refreshing }) => {
    const scale = useSharedValue(0);
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (refreshing) {
            scale.value = withSpring(1);
            rotation.value = withRepeat(
                withTiming(360, { duration: 1000, easing: Easing.linear }),
                -1
            );
        } else {
            scale.value = withTiming(0);
            rotation.value = 0;
        }
    }, [refreshing]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotation.value}deg` }
        ],
        opacity: scale.value
    }));

    if (!refreshing) return null;

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circle, animatedStyle]}>
                <View style={styles.innerCircle} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100, // Below header
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 50,
        pointerEvents: 'none'
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface.light,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    innerCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: COLORS.primary,
        borderStyle: 'dotted'
    }
});
