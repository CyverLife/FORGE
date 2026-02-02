import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { Habit } from '@/types';
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
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim()) return;

        setLoading(true);
        try {
            await addHabit({
                title: title.trim(),
                attribute: selectedAttribute,
                difficulty: difficulty,
                points: difficulty * 10,
                completed_today: false,
                streak: 0,
                consistency: 0,
                xp_reward: difficulty * 50,
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
        setSelectedAttribute('FIRE');
        setDifficulty(1);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/95">
                <ScrollView className="flex-1 px-8 pt-24" scrollEnabled={false}>
                    <View className="flex-row justify-between items-center mb-12">
                        <Text className="text-white text-3xl font-black tracking-tighter uppercase header-font">FORJAR HÁBITO</Text>
                        <TouchableOpacity onPress={onClose}>
                            <IconSymbol name="xmark.circle.fill" size={28} color="#4B5563" />
                        </TouchableOpacity>
                    </View>

                    {/* Title Input */}
                    <View className="mb-10">
                        <Text className="text-gray-500 mb-4 font-bold tracking-widest text-[10px] uppercase">MISIÓN PRINCIPAL</Text>
                        <TextInput
                            className="text-white text-3xl font-black border-b border-white/20 pb-4 font-display"
                            placeholder="Ej. LEVANTARSE 5 AM"
                            placeholderTextColor="#333"
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                            autoCapitalize="characters"
                        />
                    </View>

                    {/* Attribute Selector */}
                    <View className="mb-12">
                        <Text className="text-gray-500 mb-4 font-bold tracking-widest text-[10px] uppercase">ATRIBUTO</Text>
                        <View className="flex-row gap-3">
                            {ATTRIBUTES.map((attr) => (
                                <TouchableOpacity
                                    key={attr.id}
                                    className={`flex-1 items-center justify-center py-4 rounded-xl border ${selectedAttribute === attr.id ? 'border-white bg-white/10' : 'border-white/5 bg-[#1A1A1A]'}`}
                                    onPress={() => setSelectedAttribute(attr.id as any)}
                                >
                                    <View className={`w-3 h-3 rounded-full ${attr.color} mb-2 shadow-lg shadow-${attr.color}/50`} />
                                    <Text className={`text-[10px] font-bold tracking-wider ${selectedAttribute === attr.id ? 'text-white' : 'text-gray-600'}`}>{attr.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Submit Button - Forge Style */}
                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={loading || !title.trim()}
                        className={`h-[70px] items-center justify-center rounded-premium border-b-4 active:border-b-0 active:translate-y-1 transition-all ${!title.trim() ? 'bg-gray-800 border-gray-900 opacity-50' : 'bg-[#F97316] border-[#C2410C]'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className={`font-black text-xl uppercase tracking-[0.2em] font-display ${!title.trim() ? 'text-gray-500' : 'text-black'}`}>
                                INICIAR PROTOCOLO
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal >
    );
};
