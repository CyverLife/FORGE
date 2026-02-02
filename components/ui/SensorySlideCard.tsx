import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export interface SensorySlideData {
    title: string;
    narrative: string;
    visual_mood?: string;
    sensory_details: {
        sight?: string;
        sound?: string;
        smell?: string;
        touch?: string;
        emotion?: string;
    };
    consciousness_message?: string;
    portal_actions: {
        brighten: string;
        darken: string;
    };
}

interface SensorySlideCardProps {
    visible: boolean;
    data: SensorySlideData;
    onClose: () => void;
    onPortalAction: (action: 'brighten' | 'darken') => void;
}

export const SensorySlideCard: React.FC<SensorySlideCardProps> = ({
    visible,
    data,
    onClose,
    onPortalAction
}) => {
    const [showDetails, setShowDetails] = useState(false);
    const detailsHeight = useSharedValue(0);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
        detailsHeight.value = withSpring(showDetails ? 0 : 1, { damping: 15 });
    };

    const detailsStyle = useAnimatedStyle(() => ({
        opacity: detailsHeight.value,
        transform: [{ translateY: (1 - detailsHeight.value) * 20 }],
    }));

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View className="flex-1 bg-black">
                {/* Background Image (Moodboard) */}
                {data.visual_mood ? (
                    <Image
                        source={{ uri: data.visual_mood }}
                        className="absolute w-full h-full opacity-60"
                        resizeMode="cover"
                    />
                ) : (
                    <LinearGradient
                        colors={['#0E0E0E', '#1A1A1A']}
                        className="absolute w-full h-full"
                    />
                )}

                {/* Content Overlay */}
                <BlurView intensity={30} tint="dark" className="flex-1">
                    <ScrollView className="flex-1 px-6 pt-12" showsVerticalScrollIndicator={false}>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute right-0 top-0 p-2 z-50 bg-black/20 rounded-full"
                        >
                            <IconSymbol name="xmark" size={24} color="#FFF" />
                        </TouchableOpacity>

                        {/* Slide Title */}
                        <Animated.View entering={FadeInDown.delay(100).springify()} className="mt-8 mb-6">
                            <Text className="text-forge-orange font-bold text-xs tracking-[0.2em] uppercase mb-2">
                                INVOCACIÓN DE REALIDAD
                            </Text>
                            <Text className="text-white font-black text-4xl font-display leading-tight shadow-lg">
                                {data.title}
                            </Text>
                        </Animated.View>

                        {/* Narrative */}
                        <Animated.View entering={FadeInDown.delay(200).springify()} className="bg-black/40 p-6 rounded-premium border-l-4 border-forge-orange mb-6 backdrop-blur-md">
                            <Text className="text-white text-lg font-serif italic leading-relaxed">
                                "{data.narrative}"
                            </Text>
                        </Animated.View>

                        {/* Sensory Details Expander */}
                        <TouchableOpacity
                            onPress={toggleDetails}
                            className="flex-row items-center justify-center py-4 mb-2"
                        >
                            <Text className="text-white/70 font-bold uppercase tracking-wider text-xs mr-2">
                                {showDetails ? 'Ocultar Detalles' : 'Ver Detalles Sensoriales'}
                            </Text>
                            <IconSymbol
                                name={showDetails ? 'chevron.up' : 'chevron.down'}
                                size={14}
                                color="rgba(255,255,255,0.7)"
                            />
                        </TouchableOpacity>

                        {/* Sensory Details Grid */}
                        {showDetails && (
                            <Animated.View style={detailsStyle} className="mb-8">
                                <View className="flex-row flex-wrap gap-3">
                                    {[
                                        { icon: 'eye.fill', label: 'VISTA', value: data.sensory_details.sight },
                                        { icon: 'music.note', label: 'SONIDO', value: data.sensory_details.sound },
                                        { icon: 'nose.fill', label: 'OLFATO', value: data.sensory_details.smell }, // Customize icon if needed
                                        { icon: 'hand.point.up.fill', label: 'TACTO', value: data.sensory_details.touch },
                                        { icon: 'heart.fill', label: 'EMOCIÓN', value: data.sensory_details.emotion },
                                    ].map((detail, i) => detail.value && (
                                        <View key={i} className="w-full bg-white/5 p-4 rounded-xl border border-white/10 mb-2">
                                            <View className="flex-row items-center mb-1">
                                                <IconSymbol name={detail.icon as any} size={14} color="#F97316" />
                                                <Text className="text-forge-orange text-[10px] font-bold ml-2 uppercase tracking-wide">
                                                    {detail.label}
                                                </Text>
                                            </View>
                                            <Text className="text-white/90 text-sm">{detail.value}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Animated.View>
                        )}

                        {/* Consciousness Message */}
                        {data.consciousness_message && (
                            <Animated.View entering={FadeInDown.delay(400).springify()} className="mb-10 items-center">
                                <Text className="text-white/60 text-center text-xs uppercase tracking-widest mb-2">
                                    Mensaje del Portal
                                </Text>
                                <Text className="text-white text-center font-bold text-xl px-4">
                                    {data.consciousness_message}
                                </Text>
                            </Animated.View>
                        )}

                        {/* Portal Actions */}
                        <View className="gap-4 pb-12">
                            <View className="items-center mb-2">
                                <Text className="text-white/80 font-bold text-sm">
                                    ¿Hacia dónde vas?
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => onPortalAction('brighten')}
                                className="bg-blue-600 p-4 rounded-xl border border-blue-400 active:bg-blue-700 flex-row items-center"
                            >
                                <View className="bg-white/20 p-2 rounded-full mr-4">
                                    <Text style={{ fontSize: 20 }}>😇</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg uppercase tracking-wide">
                                        BRILLAR
                                    </Text>
                                    <Text className="text-white/80 text-xs">
                                        {data.portal_actions.brighten}
                                    </Text>
                                </View>
                                <IconSymbol name="arrow.up.right" size={20} color="#FFF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => onPortalAction('darken')}
                                className="bg-red-600/80 p-4 rounded-xl border border-red-500/50 active:bg-red-700/80 flex-row items-center"
                            >
                                <View className="bg-white/10 p-2 rounded-full mr-4">
                                    <Text style={{ fontSize: 20 }}>🐒</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg uppercase tracking-wide">
                                        OSCURECER
                                    </Text>
                                    <Text className="text-white/80 text-xs">
                                        {data.portal_actions.darken}
                                    </Text>
                                </View>
                                <IconSymbol name="arrow.down.right" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </BlurView>
            </View>
        </Modal>
    );
};
