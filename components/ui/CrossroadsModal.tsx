import { Canvas, Group, Image, LinearGradient, Path, Rect, useImage, vec } from '@shopify/react-native-skia';
import React from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface CrossroadsModalProps {
    visible: boolean;
    onClose: () => void;
    onDecision: (type: 'ANGEL' | 'APE') => void;
}

export const CrossroadsModal = ({ visible, onClose, onDecision }: CrossroadsModalProps) => {
    const angelBg = useImage(require('@/assets/images/essence_angel_bg.png'));
    const apeBg = useImage(require('@/assets/images/impulse_ape_bg.png'));

    const animState = useSharedValue(0); // 0: Neutral, 1: Angel, -1: Ape

    const handleDecision = (type: 'ANGEL' | 'APE') => {
        const targetValue = type === 'ANGEL' ? 1 : -1;
        animState.value = withTiming(targetValue, { duration: 800 });

        setTimeout(() => {
            onDecision(type);
            // Reset after delay to avoid flicker if modal reopens
            setTimeout(() => { animState.value = 0; }, 500);
        }, 800);
    };

    const angelPath = useDerivedValue(() => {
        // Neutral (0): Triangle Top-Right -> M 0 0 L W 0 L W H Z
        // Angel (1): Full Rect -> M 0 0 L W 0 L W H L 0 H Z (Extend Bottom-Left)
        // Ape (-1): Collapse -> M W 0 L W 0 L W H Z (Collapse Top-Left to Top-Right)

        // We interpolate the "Top Left" X coordinate and "Bottom Left" (Added point) X/Y
        // Standard Triangle: (0,0) -> (W,0) -> (W,H) -> CLOSE (Effective 4th point is 0,0)

        // Let's use 4 points explicitly for all states to make interpolation clean.
        // P1(TL), P2(TR), P3(BR), P4(BL - Virtual/Closing)

        // Neutral: (0,0) -> (W,0) -> (W,H) -> (0,0) [P4 matches P1]
        // Angel (1): (0,0) -> (W,0) -> (W,H) -> (0,H) [P4 moves down to BL]
        // Ape (-1): (W,0) -> (W,0) -> (W,H) -> (W,0) [P1 moves to TR, P4 stays at P1/TR]

        const w = width;
        const h = height;
        const s = animState.value;

        // P1 X: 0 when s>=0. When s<0 (Ape), moves to W.
        const p1x = s < 0 ? -s * w : 0;

        // P4 X: 0. P4 Y: 0 when s<=0. When s>0 (Angel), moves to H.
        const p4y = s > 0 ? s * h : 0;

        // Construct Path
        return `M ${p1x} 0 L ${w} 0 L ${w} ${h} L 0 ${p4y} Z`;
    });

    const angelTransform = useDerivedValue(() => {
        const s = animState.value;
        const scale = s > 0 ? 1 + (s * 0.1) : 1; // Zoom in if Angel
        // Center zoom: translate to center, scale, translate back
        const translateX = (width - width * scale) / 2;
        const translateY = (height - height * scale) / 2;
        return [{ translateX }, { translateY }, { scale }];
    });

    const apeTransform = useDerivedValue(() => {
        const s = animState.value;
        const scale = s < 0 ? 1 + (-s * 0.1) : 1; // Zoom in if Ape
        const translateX = (width - width * scale) / 2;
        const translateY = (height - height * scale) / 2;
        return [{ translateX }, { translateY }, { scale }];
    });

    const textOpacity = useDerivedValue(() => {
        return 1 - Math.abs(animState.value) * 2; // Fade out quickly
    });

    const angelOpacity = useDerivedValue(() => {
        return animState.value >= 0 ? 1 : 1 + animState.value;
    });

    const apeOpacity = useDerivedValue(() => {
        return animState.value <= 0 ? 1 : 1 - animState.value;
    });

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 bg-black/95 relative">
                <Canvas style={{ position: 'absolute', width, height }}>
                    {/* Ape Side (Bottom Left) - Background Layer */}
                    <Group opacity={apeOpacity}>
                        {apeBg && (
                            <Image image={apeBg} x={0} y={0} width={width} height={height} fit="cover" />
                        )}
                        <Rect x={0} y={0} width={width} height={height} color="rgba(0,0,0,0.4)" />
                    </Group>

                    {/* Angel Side (Top Right) - Overlay */}
                    <Group opacity={angelOpacity}>
                        {angelBg && (
                            <Image image={angelBg} x={0} y={0} width={width} height={height} fit="cover" />
                        )}
                        {/* Gradient Overlay for Angel */}
                        <Rect x={0} y={0} width={width} height={height}>
                            <LinearGradient
                                start={vec(width, 0)}
                                end={vec(0, height)}
                                colors={['rgba(255,255,255,0.3)', 'rgba(0,0,0,0.5)']}
                                positions={[0, 1]}
                            />
                        </Rect>
                    </Group>

                    {/* Dividing Line - Diagonal from top-right to bottom-left */}
                    <Path
                        path={`M ${width} 0 L 0 ${height}`}
                        color="rgba(255,255,255,0.2)"
                        style="stroke"
                        strokeWidth={2}
                        opacity={textOpacity}
                    />
                </Canvas>

                {/* Content Container - Fades out during animation */}
                <Animated.View style={{ flex: 1, opacity: textOpacity }}>
                    {/* Angel Action (Top Right) */}
                    <TouchableOpacity
                        className="absolute top-0 right-0 w-full h-1/2 justify-center items-end pr-10 pt-10"
                        onPress={() => handleDecision('ANGEL')}
                        activeOpacity={0.8}
                    >
                        <View className="items-end transform -rotate-6">
                            <Text className="text-white text-5xl font-black tracking-widest text-right pl-4 shadow-lg shadow-amber-500/50">ESSENCE</Text>
                            <Text className="text-amber-200/80 text-xl font-bold tracking-[0.2em] text-right mt-1">PURPOSE & TRUTH</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Ape Action (Bottom Left) */}
                    <TouchableOpacity
                        className="absolute bottom-0 left-0 w-full h-1/2 justify-center items-start pl-10 pb-10"
                        onPress={() => handleDecision('APE')}
                        activeOpacity={0.8}
                    >
                        <View className="items-start transform -rotate-6">
                            <Text className="text-red-600 text-5xl font-black tracking-widest text-left shadow-lg shadow-red-900/50">IMPULSE</Text>
                            <Text className="text-red-400/80 text-xl font-bold tracking-[0.2em] text-left mt-1">PLEASURE & EGO</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity
                        className="absolute top-12 left-6 bg-white/10 p-3 rounded-full z-50 backdrop-blur-md"
                        onPress={onClose}
                    >
                        <Text className="text-white font-black text-lg">✕</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};
