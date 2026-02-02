import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export default function SplashScreen() {
    const logoScale = useSharedValue(0.8);
    const logoOpacity = useSharedValue(0);
    const gridOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        // Grid appears first
        gridOpacity.value = withTiming(1, { duration: 600 });

        // Logo entrance
        logoScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 100 }));
        logoOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));

        // Text appears
        textOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));

        // Navigate after 2.5 seconds
        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const gridStyle = useAnimatedStyle(() => ({
        opacity: gridOpacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
    }));

    return (
        <View className="flex-1 bg-deep-black items-center justify-center">
            {/* Premium Grid Background - Heroes Academy Style */}
            <Animated.View style={[{ position: 'absolute', width: '100%', height: '100%' }, gridStyle]}>
                {/* Vertical Lines */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <View
                        key={`v-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${(i + 1) * 12.5}%`,
                            top: 0,
                            bottom: 0,
                            width: 1,
                            backgroundColor: 'rgba(255,255,255,0.05)'
                        }}
                    />
                ))}
                {/* Horizontal Lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <View
                        key={`h-${i}`}
                        style={{
                            position: 'absolute',
                            top: `${(i + 1) * 8.33}%`,
                            left: 0,
                            right: 0,
                            height: 1,
                            backgroundColor: 'rgba(255,255,255,0.05)'
                        }}
                    />
                ))}
            </Animated.View>

            {/* Logo */}
            <Animated.View style={logoStyle} className="items-center">
                <Image
                    source={require('@/assets/images/forge_logo_final.png')}
                    style={{ width: 280, height: 140 }}
                    contentFit="contain"
                />
            </Animated.View>

            {/* Subtitle */}
            <Animated.View style={textStyle} className="absolute bottom-24 items-center">
                <View className="flex-row items-center gap-2 mb-2">
                    <View className="w-8 h-[1px] bg-forge-orange" />
                    <IconSymbol name="flame.fill" size={12} color="#F97316" />
                    <View className="w-8 h-[1px] bg-forge-orange" />
                </View>
                <Text className="text-text-secondary text-xs uppercase tracking-[4px] font-bold">
                    FORJANDO TU DESTINO
                </Text>
            </Animated.View>
        </View>
    );
}
