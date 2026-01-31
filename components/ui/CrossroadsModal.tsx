import React from 'react';
import { View, Text, Modal, TouchableOpacity, ViewProps, Dimensions } from 'react-native';
import { Canvas, Path, Defs, LinearGradient, vec } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { styled } from 'nativewind';

const { width, height } = Dimensions.get('window');

interface CrossroadsModalProps {
    visible: boolean;
    onClose: () => void;
    onDecision: (type: 'ANGEL' | 'APE') => void;
}

export const CrossroadsModal = ({ visible, onClose, onDecision }: CrossroadsModalProps) => {
    // Diagonal split path
    // Top right (Angel)
    const angelPath = `M 0 0 L ${width} 0 L ${width} ${height} L 0 0 Z`; // Triangle covering top right? No, we need a diagonal line.
    // Diagonal line from Top-Left (or slightly down) to Bottom-Right.
    // Actually, PRD: "Superior Derecha (Rojo/Luz) ... Inferior Izquierda (Gris/Oscuridad)"
    // So a line from Top-Left to Bottom-Right works.

    // Angle for diagonal 
    const p1 = vec(0, height * 0.4);
    const p2 = vec(width, height * 0.6);
    // We can construct paths based on these two points and corners.

    const angelPathD = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height * 0.4} Z`; // Top part? No.
    // Let's keep it simple: Top Right triangle means (0,0) -> (width,0) -> (width, height) -> (close with diagonal)? No.

    // Use Skia for background rendering to get the split.

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 bg-black/90 relative">
                <Canvas style={{ position: 'absolute', width, height }}>
                    {/* Angel Side (Top Right) */}
                    <Path
                        path={`M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height * 0.3} Z`}
                        color="#FF2E2E"
                        opacity={0.1}
                    />
                    <LinearGradient
                        start={vec(width, 0)}
                        end={vec(0, height)}
                        colors={['rgba(255, 46, 46, 0.4)', 'transparent']}
                    />

                    {/* Ape Side (Bottom Left) -> Implicit black background but we can add texture */}
                </Canvas>

                {/* Content Container */}
                <View className="flex-1">
                    {/* Angel Action (Top Right) */}
                    <TouchableOpacity
                        className="absolute top-0 right-0 w-full h-1/2 justify-center items-end pr-8 pt-20"
                        onPress={() => onDecision('ANGEL')}
                    >
                        <Text className="text-white text-4xl font-bold tracking-widest text-right">ASCEND</Text>
                        <Text className="text-magma text-lg font-bold tracking-widest text-right mt-2 text-shadow">THE HARD PATH</Text>
                    </TouchableOpacity>

                    {/* Ape Action (Bottom Left) */}
                    <TouchableOpacity
                        className="absolute bottom-0 left-0 w-full h-1/2 justify-center items-start pl-8 pb-20"
                        onPress={() => onDecision('APE')}
                    >
                        <Text className="text-gray-500 text-4xl font-bold tracking-widest text-left">FALL</Text>
                        <Text className="text-gray-700 text-lg font-bold tracking-widest text-left mt-2">THE EASY PATH</Text>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity
                        className="absolute top-12 left-6 bg-black/50 p-2 rounded-full z-50"
                        onPress={onClose}
                    >
                        <Text className="text-white font-bold">X</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
