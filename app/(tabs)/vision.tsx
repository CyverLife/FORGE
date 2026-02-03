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
    const [activeLineIndex, setActiveLineIndex] = useState<number>(0);

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
                                                'bottom-10 right-8 items-end'
                                    }`}>
                                    {(currentVision.textStyle?.lines || []).map((line, index) => {
                                        let fontFamily: any = Platform.OS === 'ios' ? 'System' : 'Roboto';
                                        let fontWeight: any = 'bold';

                                        switch (line.fontFamily) {
                                            case 'oswald':
                                                fontFamily = 'Oswald_700Bold';
                                                fontWeight = undefined; // Font file handles weight
                                                break;
                                            case 'playfair':
                                                fontFamily = 'PlayfairDisplay_700Bold';
                                                fontWeight = undefined;
                                                break;
                                            case 'display':
                                                fontWeight = '900';
                                                break;
                                            case 'body':
                                                fontWeight = '600';
                                                break;
                                            case 'label':
                                                fontWeight = '300';
                                                break;
                                        }

                                        return (
                                            <Text
                                                key={index}
                                                className="uppercase leading-none"
                                                style={{
                                                    fontFamily,
                                                    fontWeight,
                                                    color: line.color,
                                                    fontSize: line.fontSize,
                                                    textShadowColor: 'rgba(0,0,0,0.8)',
                                                    textShadowOffset: { width: 0, height: 2 },
                                                    textShadowRadius: 10,
                                                    marginBottom: -4
                                                }}
                                            >
                                                {currentVision.title.split('\n')[index] || ''}
                                            </Text>
                                        );
                                    })}
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingStyleId(currentVision.id);
                                        setTempTextStyle(currentVision.textStyle || {
                                            lines: [
                                                { color: '#3B82F6', fontSize: 36, fontFamily: 'display' },
                                                { color: '#FFFFFF', fontSize: 28, fontFamily: 'body' },
                                                { color: '#FFFFFF', fontSize: 28, fontFamily: 'body' }
                                            ],
                                            position: 'bottom-right'
                                        });
                                        // Auto-Select the first line or previously selected? Default 0
                                        setActiveLineIndex(0);
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

                                {/* Title Edit - Split into 3 Lines */}
                                <View className="mb-8">
                                    <Text className="text-forge-orange text-[10px] font-black uppercase tracking-[0.2em] mb-3">CONTENIDO (3 LÍNEAS)</Text>

                                    {/* Line 1 Input */}
                                    <Text className="text-white/40 text-[10px] uppercase font-bold mb-2">LÍNEA 1 (ESTILO PRINCIPAL)</Text>
                                    <TextInput
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl text-white font-black text-xl font-display mb-4"
                                        placeholder="EJ: INVOCA"
                                        placeholderTextColor="#444"
                                        value={tempTitle.split('\n')[0] || ''}
                                        onChangeText={(text) => {
                                            const parts = tempTitle.split('\n');
                                            const l2 = parts[1] || '';
                                            const l3 = parts[2] || '';
                                            setTempTitle(`${text.toUpperCase()}\n${l2}\n${l3}`);
                                        }}
                                        autoCapitalize="characters"
                                    />

                                    {/* Line 2 Input */}
                                    <Text className="text-white/40 text-[10px] uppercase font-bold mb-2">LÍNEA 2 (ESTILO SECUNDARIO)</Text>
                                    <TextInput
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold text-lg font-body mb-4"
                                        placeholder="EJ: DESEOS"
                                        placeholderTextColor="#444"
                                        value={tempTitle.split('\n')[1] || ''}
                                        onChangeText={(text) => {
                                            const parts = tempTitle.split('\n');
                                            const l1 = parts[0] || '';
                                            const l3 = parts[2] || '';
                                            setTempTitle(`${l1}\n${text.toUpperCase()}\n${l3}`);
                                        }}
                                        autoCapitalize="characters"
                                    />

                                    {/* Line 3 Input */}
                                    <Text className="text-white/40 text-[10px] uppercase font-bold mb-2">LÍNEA 3 (ESTILO SECUNDARIO)</Text>
                                    <TextInput
                                        className="bg-white/5 border border-white/10 p-4 rounded-xl text-white font-bold text-lg font-body"
                                        placeholder="EJ: REALIDAD"
                                        placeholderTextColor="#444"
                                        value={tempTitle.split('\n')[2] || ''}
                                        onChangeText={(text) => {
                                            const parts = tempTitle.split('\n');
                                            const l1 = parts[0] || '';
                                            const l2 = parts[1] || '';
                                            setTempTitle(`${l1}\n${l2}\n${text.toUpperCase()}`);
                                        }}
                                        autoCapitalize="characters"
                                    />
                                </View>

                                {/* Line Selector Tabs */}
                                <View className="flex-row mb-6 border-b border-white/10">
                                    {[0, 1, 2].map(idx => (
                                        <TouchableOpacity
                                            key={idx}
                                            onPress={() => setActiveLineIndex(idx)}
                                            className={`px-4 py-3 mr-4 border-b-2 ${activeLineIndex === idx ? 'border-forge-orange' : 'border-transparent'}`}
                                        >
                                            <Text className={`font-black text-xs uppercase ${activeLineIndex === idx ? 'text-forge-orange' : 'text-white/40'}`}>
                                                LÍNEA {idx + 1}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Active Line Customization */}
                                <View className="mb-8 bg-[#1A1A1A] p-4 rounded-2xl border border-white/5">
                                    <View className="flex-row items-center justify-between mb-6">
                                        <Text className="text-white/60 text-[10px] uppercase font-bold tracking-widest">EDITANDO LÍNEA {activeLineIndex + 1}</Text>
                                        <Text className="text-white font-bold text-xs">"{tempTitle.split('\n')[activeLineIndex] || '...'}"</Text>
                                    </View>

                                    {/* Typography */}
                                    <Text className="text-white/40 text-[10px] uppercase font-bold mb-3">TIPOGRAFÍA</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                                        <View className="flex-row gap-3">
                                            {[
                                                { id: 'display', label: 'IMPACT', fontWeight: '900' },
                                                { id: 'body', label: 'MODERN', fontWeight: '600' },
                                                { id: 'label', label: 'THIN', fontWeight: '300' },
                                                { id: 'oswald', label: 'OSWALD', fontWeight: 'bold' }, // Future support
                                                { id: 'playfair', label: 'SERIF', fontWeight: 'bold' },
                                            ].map(font => (
                                                <TouchableOpacity
                                                    key={font.id}
                                                    onPress={() => {
                                                        if (!tempTextStyle?.lines) return;
                                                        const newLines = [...tempTextStyle.lines];
                                                        newLines[activeLineIndex] = { ...newLines[activeLineIndex], fontFamily: font.id };
                                                        setTempTextStyle({ ...tempTextStyle, lines: newLines });
                                                    }}
                                                    className={`py-2 px-4 rounded-lg border items-center justify-center ${tempTextStyle?.lines?.[activeLineIndex].fontFamily === font.id
                                                        ? 'bg-white border-white'
                                                        : 'bg-black/40 border-white/10'
                                                        }`}
                                                >
                                                    <Text
                                                        className={`text-[10px] uppercase ${tempTextStyle?.lines?.[activeLineIndex].fontFamily === font.id ? 'text-black font-black' : 'text-gray-400 font-bold'}`}
                                                    >
                                                        {font.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </ScrollView>

                                    {/* Color */}
                                    <Text className="text-white/40 text-[10px] uppercase font-bold mb-3">COLOR</Text>
                                    <View className="flex-row justify-between mb-6">
                                        {['#FFFFFF', '#3B82F6', '#F97316', '#EF4444', '#10B981', '#FBBF24', '#8B5CF6', '#EC4899'].map(color => (
                                            <TouchableOpacity
                                                key={color}
                                                onPress={() => {
                                                    if (!tempTextStyle?.lines) return;
                                                    const newLines = [...tempTextStyle.lines];
                                                    newLines[activeLineIndex] = { ...newLines[activeLineIndex], color };
                                                    setTempTextStyle({ ...tempTextStyle, lines: newLines });
                                                }}
                                                className={`w-8 h-8 rounded-full border-2 ${tempTextStyle?.lines?.[activeLineIndex].color === color ? 'border-white scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </View>

                                    {/* Size */}
                                    <Text className="text-white/40 text-[10px] uppercase font-bold mb-3">TAMAÑO</Text>
                                    <View className="flex-row gap-2 bg-black/30 p-1 rounded-lg">
                                        {[16, 24, 32, 40, 48, 56, 64].map(size => (
                                            <TouchableOpacity
                                                key={size}
                                                onPress={() => {
                                                    if (!tempTextStyle?.lines) return;
                                                    const newLines = [...tempTextStyle.lines];
                                                    newLines[activeLineIndex] = { ...newLines[activeLineIndex], fontSize: size };
                                                    setTempTextStyle({ ...tempTextStyle, lines: newLines });
                                                }}
                                                className={`flex-1 py-2 items-center rounded-md ${tempTextStyle?.lines?.[activeLineIndex].fontSize === size ? 'bg-white/20' : ''}`}
                                            >
                                                <Text className="text-white/80 text-[10px]">{size}</Text>
                                            </TouchableOpacity>
                                        ))}
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
