import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    title?: string;
    onHide: () => void;
}

export function Toast({ message, type, title, onHide }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onHide, 3000);
        return () => clearTimeout(timer);
    }, [onHide]);

    const getIcon = () => {
        switch (type) {
            case 'success': return 'checkmark.circle.fill';
            case 'error': return 'exclamationmark.circle.fill';
            case 'warning': return 'exclamationmark.triangle.fill';
            default: return 'info.circle.fill';
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return { border: 'border-green-500/50', icon: '#22c55e', bg: 'bg-green-500/10' };
            case 'error': return { border: 'border-red-500/50', icon: '#ef4444', bg: 'bg-red-500/10' };
            case 'warning': return { border: 'border-yellow-500/50', icon: '#eab308', bg: 'bg-yellow-500/10' };
            default: return { border: 'border-blue-500/50', icon: '#3b82f6', bg: 'bg-blue-500/10' };
        }
    };

    const colors = getColors();

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutUp}
            style={{ position: 'absolute', top: 60, left: 20, right: 20, zIndex: 100 }}
        >
            <BlurView intensity={40} tint="dark" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <View className={`p-4 flex-row items-center gap-4 border ${colors.border} ${colors.bg}`}>
                    <IconSymbol name={getIcon()} size={28} color={colors.icon} />
                    <View className="flex-1">
                        {title && <Text className="text-white font-bold text-base mb-0.5">{title}</Text>}
                        <Text className="text-gray-300 text-sm font-medium">{message}</Text>
                    </View>
                </View>
            </BlurView>
        </Animated.View>
    );
}
