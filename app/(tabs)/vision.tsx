import { GradientBackground } from '@/components/ui/GradientBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useVisionBoard, VisionEntry } from '@/hooks/useVisionBoard';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, Layout, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VisionScreen() {
    const { visions, currentVision, loading, addVision, deleteVision, selectVision, updateVision } = useVisionBoard();
    const insets = useSafeAreaInsets();

    // Debug: Log vision data
    console.log('📱 VisionScreen - Visions count:', visions.length);
    console.log('📱 VisionScreen - Current vision:', currentVision?.title);
    console.log('📱 VisionScreen - Current vision URI:', currentVision?.uri);

    // State for Title Modal
    const [editingVisonId, setEditingVisionId] = useState<string | null>(null);
    const [tempTitle, setTempTitle] = useState('');

    // State for Text Style Modal
    const [editingStyleId, setEditingStyleId] = useState<string | null>(null);
    const [tempTextStyle, setTempTextStyle] = useState<VisionEntry['textStyle']>();

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
            updateVision(editingVisonId, { title: tempTitle });
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

                                {/* Overlay Labels with Custom Styling */}
                                <View className={`absolute ${currentVision.textStyle?.position === 'bottom-left' ? 'bottom-10 left-8 items-start' :
                                    currentVision.textStyle?.position === 'top-right' ? 'top-10 right-8 items-end' :
                                        currentVision.textStyle?.position === 'top-left' ? 'top-10 left-8 items-start' :
                                            currentVision.textStyle?.position === 'center' ? 'inset-0 items-center justify-center' :
                                                'bottom-10 right-8 items-end'  // default bottom-right
                                    }`}>
                                    <Text
                                        className="uppercase italic leading-none"
                                        style={{
                                            fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Fallback or use custom font if loaded
                                            fontWeight: currentVision.textStyle?.fontFamily === 'display' ? '900' :
                                                currentVision.textStyle?.fontFamily === 'body' ? '600' : '300',
                                            color: currentVision.textStyle?.color1 || '#3B82F6',
                                            fontSize: currentVision.textStyle?.fontSize1 || 36,
                                            textShadowColor: 'rgba(0,0,0,0.8)',
                                            textShadowOffset: { width: 0, height: 2 },
                                            textShadowRadius: 10
                                        }}
                                    >
                                        {currentVision.title.split(' ')[0]}
                                    </Text>
                                    <Text
                                        className="uppercase tracking-tighter -mt-2"
                                        style={{
                                            fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                                            fontWeight: currentVision.textStyle?.fontFamily === 'display' ? '900' :
                                                currentVision.textStyle?.fontFamily === 'body' ? '600' : '300',
                                            color: currentVision.textStyle?.color2 || '#FFFFFF',
                                            fontSize: currentVision.textStyle?.fontSize2 || 28,
                                            textShadowColor: 'rgba(0,0,0,0.8)',
                                            textShadowOffset: { width: 0, height: 2 },
                                            textShadowRadius: 10
                                        }}
                                    >
                                        {currentVision.title.split(' ').slice(1).join(' ') || ''}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingStyleId(currentVision.id);
                                        setTempTextStyle(currentVision.textStyle || {
                                            color1: '#3B82F6',
                                            color2: '#FFFFFF',
                                            fontSize1: 36,
                                            fontSize2: 28,
                                            fontFamily: 'display',
                                            position: 'bottom-right'
                                        });
                                        setTempTitle(currentVision.title);
                                    }}
                                    className="absolute top-6 right-6 bg-black/40 p-2 rounded-full border border-white/20"
                                >
                                    <IconSymbol name="paintbrush.fill" size={16} color="white" />
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

            {/* Text Style Customization Modal */}
            <Modal
                visible={!!editingStyleId}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setEditingStyleId(null)}
            >
                <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
                    <View className="bg-[#09090B] w-full border-t border-white/10 rounded-t-3xl h-[80%]">
                        <View className="p-4 border-b border-white/10 flex-row justify-between items-center">
                            <Text className="text-white font-black text-xl uppercase italic tracking-widest pl-2">DISEÑO VISUAL</Text>
                            <TouchableOpacity
                                onPress={() => setEditingStyleId(null)}
                                className="p-2"
                            >
                                <IconSymbol name="xmark.circle.fill" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            className="flex-1"
                        >
                            <ScrollView
                                className="flex-1 w-full"
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                            >

                                {/* Title Edit */}
                                <View className="mb-8">
                                    <Text className="text-forge-orange text-[10px] font-black uppercase tracking-[0.2em] mb-3">CONTENIDO</Text>
                                    <TextInput
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl text-white font-black text-xl font-display"
                                        placeholder="EJ: INVOCA DESEOS"
                                        placeholderTextColor="#444"
                                        value={tempTitle}
                                        onChangeText={setTempTitle}
                                        autoCapitalize="characters"
                                        multiline={false}
                                    />
                                </View>

                                {/* Typography Section */}
                                <View className="mb-8">
                                    <Text className="text-forge-orange text-[10px] font-black uppercase tracking-[0.2em] mb-4">TIPOGRAFÍA</Text>
                                    <View className="flex-row gap-3 mb-4">
                                        {[
                                            { id: 'display', label: 'IMPACT', fontFamily: 'System', fontWeight: '900' },
                                            { id: 'body', label: 'MODERN', fontFamily: 'System', fontWeight: '600' },
                                            { id: 'label', label: 'ELEGANT', fontFamily: 'System', fontWeight: '300' }
                                        ].map(font => (
                                            <TouchableOpacity
                                                key={font.id}
                                                onPress={() => setTempTextStyle(prev => ({ ...prev!, fontFamily: font.id as any }))}
                                                className={`flex-1 py-3 px-2 rounded-xl border-2 items-center justify-center ${tempTextStyle?.fontFamily === font.id
                                                    ? 'bg-white border-white'
                                                    : 'bg-[#1A1A1A] border-white/10'
                                                    }`}
                                            >
                                                <Text
                                                    style={{ fontWeight: font.fontWeight as any }}
                                                    className={`text-xs uppercase ${tempTextStyle?.fontFamily === font.id ? 'text-black' : 'text-gray-400'}`}
                                                >
                                                    {font.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                {/* Primary Word Customization */}
                                <View className="mb-8 bg-[#1A1A1A] p-4 rounded-2xl border border-white/5">
                                    <View className="flex-row items-center justify-between mb-4">
                                        <Text className="text-white/60 text-[10px] uppercase font-bold tracking-widest">PRIMERA PALABRA</Text>
                                        <Text className="text-white font-bold text-xs">"{tempTitle.split(' ')[0]}"</Text>
                                    </View>

                                    {/* Color Palette 1 */}
                                    <View className="flex-row justify-between mb-4">
                                        {['#FFFFFF', '#3B82F6', '#F97316', '#EF4444', '#10B981', '#FBBF24', '#8B5CF6'].map(color => (
                                            <TouchableOpacity
                                                key={color}
                                                onPress={() => setTempTextStyle(prev => ({ ...prev!, color1: color }))}
                                                className={`w-8 h-8 rounded-full border-2 ${tempTextStyle?.color1 === color ? 'border-white scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </View>

                                    {/* Size Slider 1 */}
                                    <View className="flex-row items-center gap-4">
                                        <Text className="text-white/40 text-[10px]">TAMAÑO</Text>
                                        <View className="flex-1 flex-row gap-2 bg-black/30 p-1 rounded-lg">
                                            {[24, 32, 40, 48, 56].map(size => (
                                                <TouchableOpacity
                                                    key={size}
                                                    onPress={() => setTempTextStyle(prev => ({ ...prev!, fontSize1: size }))}
                                                    className={`flex-1 py-2 items-center rounded-md ${tempTextStyle?.fontSize1 === size ? 'bg-white/20' : ''}`}
                                                >
                                                    <Text className="text-white/80 text-[10px]">{size}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>

                                {/* Secondary Text Customization */}
                                <View className="mb-8 bg-[#1A1A1A] p-4 rounded-2xl border border-white/5">
                                    <View className="flex-row items-center justify-between mb-4">
                                        <Text className="text-white/60 text-[10px] uppercase font-bold tracking-widest">RESTO DEL TEXTO</Text>
                                        <Text className="text-white font-bold text-xs">"{tempTitle.split(' ').slice(1).join(' ') || '...'}"</Text>
                                    </View>

                                    {/* Color Palette 2 */}
                                    <View className="flex-row justify-between mb-4">
                                        {['#FFFFFF', '#3B82F6', '#F97316', '#EF4444', '#10B981', '#FBBF24', '#8B5CF6'].map(color => (
                                            <TouchableOpacity
                                                key={color}
                                                onPress={() => setTempTextStyle(prev => ({ ...prev!, color2: color }))}
                                                className={`w-8 h-8 rounded-full border-2 ${tempTextStyle?.color2 === color ? 'border-white scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </View>

                                    {/* Size Slider 2 */}
                                    <View className="flex-row items-center gap-4">
                                        <Text className="text-white/40 text-[10px]">TAMAÑO</Text>
                                        <View className="flex-1 flex-row gap-2 bg-black/30 p-1 rounded-lg">
                                            {[16, 20, 24, 32, 40].map(size => (
                                                <TouchableOpacity
                                                    key={size}
                                                    onPress={() => setTempTextStyle(prev => ({ ...prev!, fontSize2: size }))}
                                                    className={`flex-1 py-2 items-center rounded-md ${tempTextStyle?.fontSize2 === size ? 'bg-white/20' : ''}`}
                                                >
                                                    <Text className="text-white/80 text-[10px]">{size}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>

                                {/* Position Grid */}
                                <View className="mb-8">
                                    <Text className="text-forge-orange text-[10px] font-black uppercase tracking-[0.2em] mb-4">POSICIÓN</Text>
                                    <View className="flex-row flex-wrap gap-3">
                                        {[
                                            { id: 'top-left', label: '↖', width: '48%' },
                                            { id: 'top-right', label: '↗', width: '48%' },
                                            { id: 'center', label: '◉ CENTRO', width: '100%' },
                                            { id: 'bottom-left', label: '↙', width: '48%' },
                                            { id: 'bottom-right', label: '↘', width: '48%' }
                                        ].map(pos => (
                                            <TouchableOpacity
                                                key={pos.id}
                                                style={{ width: pos.width as any }}
                                                onPress={() => setTempTextStyle(prev => ({ ...prev!, position: pos.id as any }))}
                                                className={`py-4 rounded-xl border-2 items-center ${tempTextStyle?.position === pos.id
                                                    ? 'bg-white border-white'
                                                    : 'bg-[#1A1A1A] border-white/10'
                                                    }`}
                                            >
                                                <Text className={`font-black ${tempTextStyle?.position === pos.id ? 'text-black' : 'text-gray-500'}`}>
                                                    {pos.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                            </ScrollView>
                        </KeyboardAvoidingView>

                        {/* Floating Save Button */}
                        <View className="p-6 border-t border-white/10 bg-[#09090B]">
                            <TouchableOpacity
                                onPress={() => {
                                    if (editingStyleId && tempTextStyle) {
                                        updateVision(editingStyleId, {
                                            title: tempTitle,
                                            textStyle: tempTextStyle
                                        });
                                        setEditingStyleId(null);
                                    }
                                }}
                                className="w-full py-4 rounded-premium bg-forge-orange items-center"
                                style={{
                                    shadowColor: '#F97316',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 10
                                }}
                            >
                                <Text className="text-black font-black uppercase tracking-widest text-lg">GUARDAR DISEÑO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
}
