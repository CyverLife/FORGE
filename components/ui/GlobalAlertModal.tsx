import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

type AlertButton = {
    text: string;
    onPress?: () => void | Promise<void>;
    style?: 'default' | 'cancel' | 'destructive';
};

interface GlobalAlertModalProps {
    visible: boolean;
    title: string;
    message?: string;
    buttons?: AlertButton[];
    onClose: () => void;
}

export function GlobalAlertModal({ visible, title, message, buttons = [], onClose }: GlobalAlertModalProps) {
    if (!visible) return null;

    // Default 'OK' button if none provided
    const activeButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK', onPress: onClose, style: 'default' }];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View className="flex-1 items-center justify-center bg-black/60 px-8">
                <BlurView intensity={20} tint="dark" className="absolute inset-0" />

                <Animated.View
                    entering={ZoomIn.duration(200)}
                    className="w-full bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black"
                >
                    {/* Header Gradient Line */}
                    <View className="h-1 w-full bg-forge-orange opacity-80" />

                    <View className="p-6 items-center">
                        <Text className="text-white font-black text-xl uppercase italic tracking-wider text-center mb-4 font-display">
                            {title}
                        </Text>

                        {message && (
                            <Text className="text-gray-400 text-sm text-center mb-8 font-body leading-5">
                                {message}
                            </Text>
                        )}

                        <View className={`w-full flex-row gap-3 ${activeButtons.length > 2 ? 'flex-col' : ''}`}>
                            {activeButtons.map((btn, index) => {
                                const isDestructive = btn.style === 'destructive';
                                const isCancel = btn.style === 'cancel';

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={async () => {
                                            if (btn.onPress) {
                                                await btn.onPress();
                                            }
                                            onClose();
                                        }}
                                        className={`flex-1 py-4 rounded-xl items-center justify-center border ${isDestructive
                                                ? 'bg-red-500/10 border-red-500/30'
                                                : isCancel
                                                    ? 'bg-white/5 border-white/10'
                                                    : 'bg-forge-orange border-forge-orange'
                                            }`}
                                    >
                                        <Text className={`font-black text-xs uppercase tracking-widest ${isDestructive
                                                ? 'text-red-400'
                                                : isCancel
                                                    ? 'text-gray-400'
                                                    : 'text-black'
                                            }`}>
                                            {btn.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
