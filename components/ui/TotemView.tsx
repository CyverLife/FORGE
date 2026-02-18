import { useGamification } from '@/hooks/useGamification';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export const TotemView = () => {
    const { consciousnessRank, consciousnessLevel, antiGravityScore } = useGamification();

    // Determine totem stage based on consciousness rank
    const getTotemInfo = () => {
        switch (consciousnessRank) {
            case 'BRONCE':
                return {
                    image: require('@/assets/images/totem_bronze.png'),
                    name: 'ROCA TOSCA',
                    description: 'Sin forma, sin pulir',
                    color: '#CD7F32',
                    glowColor: ['rgba(205, 127, 50, 0.3)', 'transparent'],
                    stage: 1,
                };
            case 'PLATA':
                return {
                    image: require('@/assets/images/totem_silver.png'),
                    name: 'PIEDRA TALLADA',
                    description: 'Forma emergiendo',
                    color: '#C0C0C0',
                    glowColor: ['rgba(192, 192, 192, 0.3)', 'transparent'],
                    stage: 2,
                };
            case 'ORO':
                return {
                    image: require('@/assets/images/totem_gold.png'),
                    name: 'ESCULTURA PULIDA',
                    description: 'Detalles refinados',
                    color: '#FFD700',
                    glowColor: ['rgba(255, 215, 0, 0.3)', 'transparent'],
                    stage: 3,
                };
            case 'INFINITO':
                return {
                    image: require('@/assets/images/totem_gold.png'), // Placeholder until specific infinite asset
                    name: 'MONUMENTO BRILLANTE',
                    description: 'Perfección artística',
                    color: '#E0E7FF',
                    glowColor: ['rgba(224, 231, 255, 0.4)', 'transparent'],
                    stage: 4,
                };
            default:
                return {
                    image: require('@/assets/images/totem_bronze.png'),
                    name: 'ROCA TOSCA',
                    description: 'Sin forma, sin pulir',
                    color: '#CD7F32',
                    glowColor: ['rgba(205, 127, 50, 0.3)', 'transparent'],
                    stage: 1,
                };
        }
    };

    const totemInfo = getTotemInfo();

    // Breathing Animation
    const scale = useSharedValue(1);
    const glowOpacity = useSharedValue(0.3);
    const rotate = useSharedValue(0);

    useEffect(() => {
        // Breathing rhythm - slower for higher stages
        const breathDuration = 2000 + (totemInfo.stage * 500);

        scale.value = withRepeat(
            withSequence(
                withTiming(1.02, { duration: breathDuration }),
                withTiming(1.0, { duration: breathDuration + 500 })
            ),
            -1,
            true
        );

        // Pulsing glow - more intense for higher stages
        const glowIntensity = 0.2 + (totemInfo.stage * 0.1);
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(glowIntensity + 0.3, { duration: breathDuration }),
                withTiming(glowIntensity, { duration: breathDuration + 500 })
            ),
            -1,
            true
        );

        // Subtle rotation - more for higher stages
        const rotationAmount = totemInfo.stage * 0.5;
        rotate.value = withRepeat(
            withSequence(
                withTiming(rotationAmount, { duration: 5000 }),
                withTiming(-rotationAmount, { duration: 5000 })
            ),
            -1,
            true
        );
    }, [totemInfo.stage]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { rotate: `${rotate.value}deg` }
        ],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
        transform: [{ scale: scale.value * 1.15 }]
    }));

    return (
        <View className="items-center justify-center py-4">
            {/* Totem Name */}
            <Text
                className="font-black text-lg uppercase tracking-widest font-display mb-1"
                style={{ color: totemInfo.color }}
            >
                {totemInfo.name}
            </Text>

            {/* Stage Indicator */}
            <View className="flex-row items-center gap-1 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <View
                        key={i}
                        className="h-1 w-6 rounded-full"
                        style={{
                            backgroundColor: i < totemInfo.stage ? totemInfo.color : '#2A2A2A',
                        }}
                    />
                ))}
            </View>

            {/* Background Glow */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        width: 240,
                        height: 240,
                        top: 40
                    },
                    glowStyle
                ]}
            >
                <LinearGradient
                    colors={totemInfo.glowColor as any}
                    style={{ flex: 1, borderRadius: 120 }}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>

            {/* The Totem - Image representation */}
            <Animated.View style={animatedStyle} className="items-center justify-center">
                <Image
                    source={totemInfo.image}
                    style={{ width: 180, height: 180 }}
                    contentFit="contain"
                />
            </Animated.View>

            {/* Totem Description */}
            <Text className="text-text-tertiary text-[10px] uppercase tracking-wider mt-2 text-center">
                {totemInfo.description}
            </Text>

            {/* Level Progress */}
            <View className="mt-3 items-center">
                <Text className="text-text-secondary text-[10px] mb-1">
                    Nivel {consciousnessLevel}
                </Text>
                <Text className="text-text-tertiary text-[9px]">
                    {consciousnessRank === 'BRONCE' && 'Niveles 1-25'}
                    {consciousnessRank === 'PLATA' && 'Niveles 26-50'}
                    {consciousnessRank === 'ORO' && 'Niveles 51-75'}
                    {consciousnessRank === 'INFINITO' && 'Nivel 76+'}
                </Text>
            </View>
        </View>
    );
};
