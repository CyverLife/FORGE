import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';
import { pickImageFromLibrary, uploadImageToSupabase } from '@/utils/image-uploader';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface CreateHabitModalProps {
    visible: boolean;
    onClose: () => void;
}

const ATTRIBUTES = [
    { id: 'IRON', color: 'bg-gray-500', label: 'HIERRO' },
    { id: 'FIRE', color: 'bg-orange-500', label: 'FUEGO' },
    { id: 'STEEL', color: 'bg-blue-500', label: 'ACERO' },
    { id: 'FOCUS', color: 'bg-purple-500', label: 'FOCO' }
] as const;

export const CreateHabitModal = ({ visible, onClose }: CreateHabitModalProps) => {
    const { addHabit } = useHabits();
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [selectedAttribute, setSelectedAttribute] = useState<Habit['attribute']>('FIRE');
    const [difficulty, setDifficulty] = useState(1);
    const [narrative, setNarrative] = useState('');
    const [visualMood, setVisualMood] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const handlePickImage = async () => {
        if (!user) return;

        const asset = await pickImageFromLibrary();
        if (asset && asset.base64) {
            setUploadingImage(true);
            const publicUrl = await uploadImageToSupabase(
                user.id,
                'habit-images', // Ensure this bucket exists or use 'avatars' temporarily if 'habit-images' is not created
                asset.base64,
                asset.mimeType || 'image/jpeg'
            );
            if (publicUrl) {
                setVisualMood(publicUrl);
            }
            setUploadingImage(false);
        }
    };

    const handleCreate = async () => {
        if (!title.trim()) return;

        setLoading(true);
        try {
            // Construct sensory slide object if narrative provided
            let sensorySlide = null;
            if (narrative.trim()) {
                sensorySlide = {
                    title: title.trim(),
                    narrative: narrative.trim(),
                    visual_mood: visualMood.trim() || undefined,
                    sensory_details: {
                        emotion: 'Poder y Control', // Default values for now, can be expanded later
                    },
                    portal_actions: {
                        brighten: 'Completar Misión',
                        darken: 'Posponer',
                    }
                };
            }

            await addHabit({
                title: title.trim(),
                attribute: selectedAttribute,
                difficulty: difficulty,
                points: difficulty * 10,
                completed_today: false,
                streak: 0,
                consistency: 0,
                xp_reward: difficulty * 50,
                sensory_slide: sensorySlide as any, // Cast as any to match DB/Type bridge
                essence_type: 'NEUTRAL', // Default
            });
            resetForm();
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setNarrative('');
        setVisualMood('');
        setSelectedAttribute('FIRE');
        setDifficulty(1);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/95">
                <ScrollView className="flex-1 px-8 pt-16">
                    <View className="flex-row justify-between items-center mb-8">
                        <Text className="text-white text-3xl font-black tracking-tighter uppercase header-font">NUEVO PROTOCOLO</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text className="text-gray-500 font-bold text-xs tracking-widest">CANCELAR</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Title Input */}
                    <View className="mb-8">
                        <Text className="text-gray-500 mb-2 font-bold tracking-widest text-[10px] uppercase">OBJETIVO DE LA MISIÓN</Text>
                        <TextInput
                            className="text-white text-2xl font-bold border-b border-white/20 pb-2"
                            placeholder="Ej. Levantarse 5 AM"
                            placeholderTextColor="#333"
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                        />
                    </View>

                    {/* Attribute Selector */}
                    <View className="mb-10">
                        <Text className="text-gray-500 mb-4 font-bold tracking-widest text-[10px] uppercase">ATRIBUTO A FORJAR</Text>
                        <View className="flex-row gap-2">
                            {ATTRIBUTES.map((attr) => (
                                <TouchableOpacity
                                    key={attr.id}
                                    className={`flex-1 items-center justify-center p-3 rounded-sm border ${selectedAttribute === attr.id ? 'border-white bg-white/10' : 'border-white/5 bg-[#1A1A1A]'}`}
                                    onPress={() => setSelectedAttribute(attr.id as any)}
                                >
                                    <View className={`w-2 h-2 rounded-full ${attr.color} mb-2`} />
                                    <Text className={`text-[10px] font-bold ${selectedAttribute === attr.id ? 'text-white' : 'text-gray-600'}`}>{attr.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Sensory Narrative Input */}
                    <View className="mb-6">
                        <Text className="text-gray-500 mb-2 font-bold tracking-widest text-[10px] uppercase">NARRATIVA SENSORIAL (INVOCACIÓN)</Text>
                        <TextInput
                            className="bg-white/5 text-white p-4 rounded-xl border border-white/10"
                            placeholder="Describe cómo se siente lograr este hábito..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={3}
                            value={narrative}
                            onChangeText={setNarrative}
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>



                    {/* Moodboard Image Picker */}
                    <View className="mb-8">
                        <Text className="text-gray-500 mb-2 font-bold tracking-widest text-[10px] uppercase">VISUAL MOOD (GALERÍA)</Text>

                        <TouchableOpacity
                            onPress={handlePickImage}
                            disabled={uploadingImage}
                            className="w-full h-40 bg-white/5 rounded-xl border border-white/10 items-center justify-center overflow-hidden active:bg-white/10"
                        >
                            {visualMood ? (
                                <Image
                                    source={{ uri: visualMood }}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit="cover"
                                />
                            ) : (
                                <View className="items-center opacity-50">
                                    <IconSymbol name="photo.fill" size={32} color="white" />
                                    <Text className="text-white text-xs mt-2 font-bold tracking-widest uppercase">
                                        {uploadingImage ? 'SUBIENDO...' : 'SELECCIONAR IMAGEN'}
                                    </Text>
                                    {uploadingImage && <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />}
                                </View>
                            )}
                        </TouchableOpacity>

                        {visualMood ? (
                            <TouchableOpacity onPress={() => setVisualMood('')} className="mt-2 self-end">
                                <Text className="text-red-400 text-[10px] font-bold uppercase tracking-widest">ELIMINAR</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    {/* Submit Button - Forge Style */}
                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={loading || !title.trim()}
                        className="bg-[#F97316] h-[60px] items-center justify-center border-b-4 border-[#C2410C] active:border-b-2 mb-8 rounded-sm"
                        style={{ opacity: (loading || !title.trim()) ? 0.5 : 1 }}
                    >
                        <Text className="text-black font-black text-lg uppercase tracking-widest font-mono">
                            {loading ? 'FORJANDO...' : 'FORJAR REALIDAD'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal >
    );
};
