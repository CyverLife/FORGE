import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useVisionBoard } from '@/hooks/useVisionBoard';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, Layout, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisionScreen() {
    const { visions, currentVision, loading, addVision, deleteVision, selectVision, updateTitle } = useVisionBoard();
    const insets = useSafeAreaInsets();

    // Debug: Log vision data
    console.log('📱 VisionScreen - Visions count:', visions.length);
    console.log('📱 VisionScreen - Current vision:', currentVision?.title);
    console.log('📱 VisionScreen - Current vision URI:', currentVision?.uri);

    // State for Title Modal
    const [editingVisonId, setEditingVisionId] = useState<string | null>(null);
    const [tempTitle, setTempTitle] = useState('');

    // Scale and Rotation for Focus Transition
    const focusScale = useSharedValue(1);
    const focusRotate = useSharedValue(0);

    const handleSelect = (id: string, rotation: number) => {
        selectVision(id);
        focusScale.value = 0.95;
        focusRotate.value = rotation; // Inherit the tilt momentarily
        focusScale.value = withSpring(1, { damping: 15 });
        focusRotate.value = withSpring(0, { damping: 15 }); // Settle back to 0
    };

    const openEditModal = (id: string, currentTitle: string) => {
        setEditingVisionId(id);
        setTempTitle(currentTitle);
    };

    const saveTitle = () => {
        if (editingVisonId) {
            updateTitle(editingVisonId, tempTitle);
            setEditingVisionId(null);
        }
    };

    const animatedMainStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: focusScale.value },
            { rotate: `${focusRotate.value}deg` }
        ],
    }));

    if (loading) {
        return (
            <View className="flex-1 bg-deep-black items-center justify-center">
                <ActivityIndicator color="#F97316" size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#09090B]" style={{ paddingTop: insets.top }}>
            <GradientBackground>
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Header */}
                    <View className="px-6 py-6 flex-row items-center justify-between">
                        <View>
                            <Text className="text-white/40 font-mono text-[8px] tracking-[0.3em] uppercase">SISTEMA VISUAL</Text>
                            <Text className="text-white font-black text-2xl tracking-tight uppercase italic">Vision Board</Text>
                        </View>
                        <TouchableOpacity
                            onPress={addVision}
                            className="bg-forge-orange p-3 rounded-full active:scale-95"
                            style={{
                                shadowColor: '#F97316',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8
                            }}
                        >
                            <IconSymbol name="plus" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Main Focus Vision */}
                    <View className="px-10 mb-10">
                        {currentVision ? (
                            <Animated.View
                                key={currentVision.id}
                                entering={FadeIn.duration(400)}
                                style={[
                                    animatedMainStyle,
                                    {
                                        width: '100%',
                                        aspectRatio: 4 / 5,
                                        borderRadius: 40,
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 20 },
                                        shadowOpacity: 0.8,
                                        shadowRadius: 25,
                                        elevation: 24
                                    }
                                ]}
                            >
                                <Image
                                    source={{ uri: currentVision.uri }}
                                    style={{ flex: 1, width: '100%' }}
                                    contentFit="cover"
                                    transition={500}
                                />

                                {/* Overlay Labels (Similar to User Image) */}
                                <View className="absolute bottom-10 right-8 items-end">
                                    <Text className="text-blue-500 font-display font-black text-4xl uppercase italic leading-none" style={{ textShadowColor: '#000', textShadowRadius: 10 }}>
                                        {currentVision.title.split(' ')[0]}
                                    </Text>
                                    <Text className="text-white font-display font-black text-3xl uppercase tracking-tighter -mt-2" style={{ textShadowColor: '#000', textShadowRadius: 10 }}>
                                        {currentVision.title.split(' ').slice(1).join(' ') || 'DESEOS'}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => openEditModal(currentVision.id, currentVision.title)}
                                    className="absolute top-6 right-6 bg-black/40 p-2 rounded-full border border-white/20"
                                >
                                    <IconSymbol name="pencil" size={16} color="white" />
                                </TouchableOpacity>
                            </Animated.View>
                        ) : (
                            <TouchableOpacity
                                onPress={addVision}
                                className="w-full aspect-[4/5] rounded-[40px] border-2 border-dashed border-white/10 items-center justify-center bg-white/5"
                            >
                                <IconSymbol name="camera.fill" size={48} color="rgba(255,255,255,0.1)" />
                                <Text className="text-white/20 font-bold uppercase tracking-widest mt-4">Cargar Visión</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Thumbnail Gallery */}
                    <View className="px-6">
                        <Text className="text-white/40 font-bold text-xs uppercase tracking-[0.2em] mb-6">ARCHIVOS ({visions.length}/3)</Text>
                        <View className="flex-row gap-4">
                            {visions.map((vision) => {
                                const isSelected = vision.id === currentVision?.id;
                                return (
                                    <Animated.View
                                        key={vision.id}
                                        layout={Layout.springify()}
                                        className="flex-1"
                                    >
                                        <TouchableOpacity
                                            onPress={() => handleSelect(vision.id, vision.rotation)}
                                            onLongPress={() => deleteVision(vision.id)}
                                            activeOpacity={0.8}
                                            style={[
                                                {
                                                    aspectRatio: 3 / 4,
                                                    borderRadius: 16,
                                                    overflow: 'hidden',
                                                    borderWidth: 2,
                                                    transform: [{ rotate: `${vision.rotation}deg` }]
                                                },
                                                isSelected ? {
                                                    borderColor: '#F97316',
                                                    shadowColor: '#F97316',
                                                    shadowOffset: { width: 0, height: 4 },
                                                    shadowOpacity: 0.4,
                                                    shadowRadius: 8,
                                                    elevation: 8
                                                } : {
                                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                                }
                                            ]}
                                        >
                                            <Image
                                                source={{ uri: vision.uri }}
                                                style={{ flex: 1, width: '100%', height: '100%' }}
                                                contentFit="cover"
                                                transition={300}
                                            />
                                            {/* Minimal label on thumbnails */}
                                            <View className="absolute bottom-2 left-2 right-2">
                                                <Text className="text-white text-[8px] font-black uppercase text-center" numberOfLines={1}>
                                                    {vision.title}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </Animated.View>
                                );
                            })}

                            {/* Empty placeholders */}
                            {Array.from({ length: 3 - visions.length }).map((_, i) => (
                                <View
                                    key={`empty-${i}`}
                                    className="flex-1 aspect-[3/4] rounded-2xl border border-dashed border-white/5 bg-white/5 items-center justify-center"
                                >
                                    <IconSymbol name="plus" size={16} color="rgba(255,255,255,0.05)" />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="items-center mt-12 mb-8 px-10">
                        <Text className="text-white/10 text-[10px] text-center uppercase tracking-widest leading-4">
                            SISTEMA DE VISUALIZACIÓN NEURONAL V.1.0{'\n'}
                            LA IMAGEN PRECEDE A LA REALIDAD
                        </Text>
                    </View>
                </ScrollView>
            </GradientBackground>

            {/* Title Edit Modal */}
            <Modal
                visible={!!editingVisonId}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEditingVisionId(null)}
            >
                <BlurView intensity={30} tint="dark" className="flex-1 items-center justify-center px-6">
                    <View className="bg-card-black w-full p-8 border border-white/10 rounded-3xl">
                        <Text className="text-white font-black text-xl uppercase italic mb-6">Editar Título</Text>
                        <TextInput
                            className="bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold text-lg mb-8"
                            placeholder="EJ: INVOCA DESEOS"
                            placeholderTextColor="#666"
                            value={tempTitle}
                            onChangeText={setTempTitle}
                            autoFocus
                            autoCapitalize="characters"
                        />
                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => setEditingVisionId(null)}
                                className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 items-center"
                            >
                                <Text className="text-gray-400 font-bold uppercase">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveTitle}
                                className="flex-1 p-4 rounded-xl bg-forge-orange items-center"
                            >
                                <Text className="text-black font-black uppercase">Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
}
