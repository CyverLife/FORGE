import { useGlobalAlert } from '@/context/GlobalAlertContext';
import { useHabits } from '@/hooks/useHabits';

import { PortalDecisionType } from '@/hooks/usePortalDecision';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { Habit, SensorySlideData } from '@/types';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { FadeInDown, useAnimatedStyle } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';
import { PortalDecisionModal } from './PortalDecisionModal';
import { QuestCard } from './QuestCard';
import { SensorySlideCard } from './SensorySlideCard';

// Fix for FlashList type mismatch
const FlashList = ShopifyFlashList as any;

export const HabitList = () => {
    const { showAlert } = useGlobalAlert();
    const { habits, loading, logHabit, deleteHabit } = useHabits();
    const { playSound, playHaptic } = useSoundSystem();
    const [filter, setFilter] = useState<'ALL' | 'IRON' | 'FIRE' | 'STEEL' | 'FOCUS'>('ALL');
    const [isEditing, setIsEditing] = useState(false);

    // Portal Decision Modal State
    const [portalModalVisible, setPortalModalVisible] = useState(false);
    const [pendingHabit, setPendingHabit] = useState<{ id: string; title: string; status: 'completed' | 'failed' } | null>(null);

    // Sensory Slide State
    const [selectedSensorySlide, setSelectedSensorySlide] = useState<{ habitId: string; data: SensorySlideData } | null>(null);

    const filteredHabits = React.useMemo(() => {
        if (filter === 'ALL') return habits;
        return habits.filter(h => h.attribute === filter);
    }, [habits, filter]);

    const handleSwipe = useCallback(async (habitId: string, habitTitle: string, status: 'completed' | 'failed') => {
        // Only show portal modal for completed habits
        if (status === 'completed') {
            setPendingHabit({ id: habitId, title: habitTitle, status });
            setPortalModalVisible(true);
        } else {
            // For failed habits, log directly (will be handled by GPS Emocional later)
            try {
                await logHabit(habitId, status);
            } catch (error) {
                showAlert('Error', 'Failed to log protocol.');
            }
        }
    }, [logHabit]);

    const handlePortalDecision = async (decision: PortalDecisionType) => {
        if (!pendingHabit) return;

        try {
            // Log the habit completion
            await logHabit(pendingHabit.id, pendingHabit.status);
            // Portal decision is already recorded by the modal's hook
        } catch (error) {
            showAlert('Error', 'Failed to log protocol.');
        } finally {
            setPendingHabit(null);
        }
    };

    const handleHabitPress = (habit: Habit) => {
        if (habit.sensory_slide) {
            setSelectedSensorySlide({
                habitId: habit.id,
                data: habit.sensory_slide
            });
        }
        // If no slide, maybe later implement details modal or just do nothing (currently swipe to complete)
    };

    const handleDeleteHabit = (habit: Habit) => {
        showAlert(
            'Eliminar Protocolo',
            `¿Estás seguro de que deseas eliminar "${habit.title}"? Esta acción no se puede deshacer.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteHabit(habit.id);
                        playHaptic('heavy');
                    }
                }
            ]
        );
    };

    const handleSensoryAction = (action: 'brighten' | 'darken') => {
        if (!selectedSensorySlide) return;

        // Close slide
        const habitId = selectedSensorySlide.habitId;
        const habitData = habits.find(h => h.id === habitId); // Need title
        setSelectedSensorySlide(null);

        // Map action to portal decision
        if (action === 'brighten') {
            // DIRECT COMPLETION - Fix duplicate screen issue
            if (habitData) {
                logHabit(habitId, 'completed');
                // Optional: trigger "Angel" sound or effect here if not handled by logHabit
                // We skip the PortalModal because decision was made in Sensory Slide
                if (habitData.attribute === 'IRON' || habitData.attribute === 'FIRE') {
                    // Just an example logic, really we assume "Brighten" = Angel decision in this context? 
                    // Or simply completing is enough. The user disliked the second question.
                }
            }
        } else {
            // Darken -> Facillaty / Skip
            if (habitData) {
                logHabit(habitId, 'failed');
            }
        }
    };

    const renderItem = ({ item, index }: { item: Habit, index: number }) => (
        <Reanimated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
            {isEditing && (
                <TouchableOpacity
                    onPress={() => handleDeleteHabit(item)}
                    className="bg-red-500/10 border border-red-500/50 w-10 h-10 rounded-full items-center justify-center"
                >
                    <IconSymbol name="trash.fill" size={16} color="#EF4444" />
                </TouchableOpacity>
            )}

            <View style={{ flex: 1 }}>
                <ReanimatedSwipeable
                    containerStyle={{ width: '100%' }}
                    friction={2}
                    enableTrackpadTwoFingerGesture
                    rightThreshold={40}
                    leftThreshold={40}
                    enabled={!item.completed_today && !isEditing} // Disable swipe if completed OR editing
                    renderLeftActions={(_prog, drag) => {
                        const styleAnimation = useAnimatedStyle(() => ({
                            transform: [{ translateX: drag.value - 80 }],
                        }));
                        return (
                            <Reanimated.View style={styleAnimation} className="bg-emerald-900/50 justify-center items-center w-20 rounded-xl mb-3 h-full absolute left-0">
                                <IconSymbol name="checkmark.circle.fill" size={24} color="#10B981" />
                            </Reanimated.View>
                        );
                    }}
                    renderRightActions={(_prog, drag) => {
                        const styleAnimation = useAnimatedStyle(() => ({
                            transform: [{ translateX: drag.value + 80 }],
                        }));
                        return (
                            <Reanimated.View style={styleAnimation} className="bg-amber-900/50 justify-center items-center w-20 rounded-xl mb-3 h-full absolute right-0 border border-amber-500/30">
                                <IconSymbol name="arrow.triangle.2.circlepath" size={24} color="#F59E0B" />
                            </Reanimated.View>
                        );
                    }}
                    onSwipeableOpen={(direction) => {
                        if (direction === 'left') {
                            playHaptic('medium');
                            handleSwipe(item.id, item.title, 'completed');
                        } else if (direction === 'right') {
                            playSound('recalibrate');
                            handleSwipe(item.id, item.title, 'failed');
                        }
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                    // Disabled press actions as requested to remove "Visual Mode"
                    // onPress={() => !item.completed_today && !isEditing && handleHabitPress(item)}
                    >
                        <QuestCard
                            habit={item}
                            onComplete={() => !isEditing && handleSwipe(item.id, item.title, 'completed')}
                            onFail={() => !isEditing && handleSwipe(item.id, item.title, 'failed')}
                        />
                    </TouchableOpacity>
                </ReanimatedSwipeable>
            </View>
        </Reanimated.View>
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center p-8">
                <Text className="text-text-secondary">Cargando protocolos...</Text>
            </View>
        );
    }

    if (filteredHabits.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-8">
                <IconSymbol name="tray" size={64} color="#6B7280" />
                <Text className="text-text-secondary text-center mt-4">
                    No hay protocolos activos.{'\n'}Crea tu primer hábito para comenzar.
                </Text>
            </View>
        );
    }

    return (
        <>
            {/* Context Header */}
            <View className="flex-row justify-between items-center px-4 mb-4">
                <Text
                    className="text-white font-black italic text-xl uppercase tracking-tighter font-mono"
                    style={{
                        textShadowColor: 'rgba(0, 0, 0, 0.75)',
                        textShadowOffset: { width: 0, height: 4 },
                        textShadowRadius: 10
                    }}
                >
                    PROTOCOLOS DIARIOS
                </Text>

                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => setIsEditing(!isEditing)}
                        className={`px-3 py-1 rounded border ${isEditing ? 'bg-red-500/20 border-red-500' : 'bg-[#1A1110] border-[#F97316]'}`}
                    >
                        <Text className={`${isEditing ? 'text-red-500' : 'text-[#F97316]'} font-bold text-[10px] tracking-widest`}>
                            {isEditing ? 'LISTO' : 'EDITAR'}
                        </Text>
                    </TouchableOpacity>

                    {!isEditing && (
                        <View className="bg-[#1A1110] px-3 py-1 rounded border border-[#F97316]">
                            <Text className="text-[#F97316] font-bold text-[10px] tracking-widest">{filteredHabits.length} ACTIVOS</Text>
                        </View>
                    )}
                </View>
            </View>

            <View className="px-4 mb-2 h-4">
                {isEditing && <Text className="text-red-500 text-[10px] text-right italic font-bold">Toca el ícono de basura para eliminar</Text>}
            </View>

            <View style={{ minHeight: 200, flex: 1 }}>
                <FlashList
                    data={filteredHabits}
                    renderItem={renderItem}
                    estimatedItemSize={110}
                    keyExtractor={(item: Habit) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
                />
            </View>

            {/* Sensory Slide Card */}
            {selectedSensorySlide && (
                <SensorySlideCard
                    visible={!!selectedSensorySlide}
                    data={selectedSensorySlide.data}
                    onClose={() => setSelectedSensorySlide(null)}
                    onPortalAction={handleSensoryAction}
                />
            )}

            {/* Portal Decision Modal */}
            <PortalDecisionModal
                visible={portalModalVisible}
                habitId={pendingHabit?.id}
                habitTitle={pendingHabit?.title}
                onDecision={handlePortalDecision}
                onClose={() => {
                    setPortalModalVisible(false);
                    setPendingHabit(null);
                }}
            />
        </>
    );
};
