import { ParticleExplosion } from '@/components/ParticleExplosion';
import { ToastNotification } from '@/components/ToastNotification';
import { useGlobalAlert } from '@/context/GlobalAlertContext';
import { useHabits } from '@/hooks/useHabits';
import { triggerSuccessFeedback } from '@/services/FeedbackManager';
import { getForgeMessage } from '@/services/MessageGeneratorService';

import { PortalDecisionType } from '@/hooks/usePortalDecision';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { Habit, SensorySlideData } from '@/types';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DailyProgressBar } from './DailyProgressBar';
import { IconSymbol } from './icon-symbol';
import { IgnitionStrikeCard } from './IgnitionStrikeCard';
import { PortalDecisionModal } from './PortalDecisionModal';
import { RewardPopup } from './RewardPopup';
import { SensorySlideCard } from './SensorySlideCard';

// Fix for FlashList type mismatch
const FlashList = ShopifyFlashList as any;

export const HabitList = () => {
    const { showAlert } = useGlobalAlert();
    const { habits, loading, logHabit, deleteHabit, lastReward } = useHabits();
    const { playSound, playHaptic } = useSoundSystem();

    console.log('[HABIT_LIST] Current Habits State:', {
        count: habits.length,
        loading,
        ids: habits.map(h => h.id),
        titles: habits.map(h => h.title),
        completedToday: habits.map(h => `${h.title}: ${h.completed_today}`)
    });
    const [filter, setFilter] = useState<'ALL' | 'IRON' | 'FIRE' | 'STEEL' | 'FOCUS'>('ALL');
    const [isEditing, setIsEditing] = useState(false);

    // Portal Decision Modal State
    const [portalModalVisible, setPortalModalVisible] = useState(false);
    const [pendingHabit, setPendingHabit] = useState<{ id: string; title: string; status: 'completed' | 'failed' } | null>(null);

    // Reward Popup State
    const [showRewardPopup, setShowRewardPopup] = useState(false);

    // Sensory Slide State
    const [selectedSensorySlide, setSelectedSensorySlide] = useState<{ habitId: string; data: SensorySlideData } | null>(null);

    const filteredHabits = React.useMemo(() => {
        let result = habits;
        if (filter !== 'ALL') {
            result = habits.filter(h => h.attribute === filter);
        }
        console.log('[HABIT_LIST] Filtered Habits:', {
            filter,
            count: result.length,
            ids: result.map(h => h.id)
        });
        return result;
    }, [habits, filter]);

    const handleSwipe = useCallback(async (habitId: string, habitTitle: string, status: 'completed' | 'failed') => {
        // Only show portal modal for completed habits
        if (status === 'completed') {
            try {
                // 1. Immediate Optimistic Log (returns variable reward)
                const reward = await logHabit(habitId, 'completed');

                // 2. Show Reward Popup first
                if (reward) {
                    setShowRewardPopup(true);
                }

                // 3. Then Show Portal Modal for "Juice" & Decision
                setPendingHabit({ id: habitId, title: habitTitle, status });
                setPortalModalVisible(true);
            } catch (error) {
                console.error('HABIT LOG ERROR:', error);
                showAlert('Error', 'Failed to log protocol.');
            }
        } else {
            // For failed habits, log directly
            try {
                await logHabit(habitId, status);
            } catch (error) {
                showAlert('Error', 'Failed to log protocol.');
            }
        }
    }, [logHabit]);

    // Emotional Design State
    const [toastMessage, setToastMessage] = useState('');
    const [showParticles, setShowParticles] = useState(false);
    // Center of screen for now, or maybe capture press location?
    // Since it comes from a modal, screen center is appropriate for the "Event".
    const [particlePosition, setParticlePosition] = useState({ x: 200, y: 400 });

    const handlePortalDecision = async (decision: PortalDecisionType) => {
        if (!pendingHabit) return;

        try {
            // NOTE: Habit is already logged in handleSwipe!
            // We only handle the "Juice" and detailed decision recording here.

            // JUICY FEEDBACK
            if (decision === 'BRIGHTEN') {
                // 1. Sensory Feedback
                await triggerSuccessFeedback('habitCompletion');

                // 2. Visual Particles (Center of screen approx)
                setParticlePosition({ x: 200, y: 300 }); // Approximate center
                setShowParticles(true);

                // 3. Thematic Message
                const msg = getForgeMessage('HABIT_COMPLETION');
                setToastMessage(msg);
            }

        } catch (error) {
            console.error('PORTAL DECISION ERROR:', error);
            const err = error as any;
            // Don't show alert here since the main action (completion) succeeded
            // showAlert('Error', `Failed to log: ${err.message || 'Unknown error'}`);
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

    // Standard render item function removed in favor of direct mapping for debug

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center p-8">
                <Text className="text-text-secondary">Cargando protocolos...</Text>
            </View>
        );
    }

    const completedCount = habits.filter(h => h.completed_today).length;
    const totalCount = habits.length;

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
            <View className="flex-row justify-between items-center px-4 mb-3">
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
                            <Text className="text-[#F97316] font-bold text-[10px] tracking-widest">
                                {filteredHabits.filter(h => !h.completed_today).length} PENDIENTES
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Integrated Progress Indicator */}
            <View className="px-4 mb-2">
                <DailyProgressBar completed={completedCount} total={totalCount} />
            </View>

            <View className="px-4 mb-2 h-4">
                {isEditing && <Text className="text-red-500 text-[10px] text-right italic font-bold">Toca el ícono de basura para eliminar</Text>}
            </View>

            <View style={{ flex: 1, minHeight: 400 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 150, paddingHorizontal: 16 }}
                >
                    {filteredHabits.map((item, index) => (
                        <View key={item.id} style={{ marginBottom: 12 }}>
                            <IgnitionStrikeCard
                                habit={item}
                                isEditing={isEditing}
                                onDelete={() => handleDeleteHabit(item)}
                                onComplete={() => !isEditing && handleSwipe(item.id, item.title, 'completed')}
                            />
                        </View>
                    ))}

                    {filteredHabits.length === 0 && (
                        <View className="py-20 items-center justify-center">
                            <IconSymbol name="list.bullet.rectangle.fill" size={48} color="rgba(255,255,255,0.05)" />
                            <Text className="text-text-tertiary font-bold uppercase tracking-[0.2em] mt-4">
                                NO HAY PROTOCOLOS
                            </Text>
                            <Text className="text-text-tertiary/50 text-[10px] mt-2">
                                Forja uno nuevo para comenzar
                            </Text>
                        </View>
                    )}
                </ScrollView>
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

            {/* Variable XP Reward Popup */}
            {lastReward && (
                <RewardPopup
                    reward={lastReward}
                    visible={showRewardPopup}
                    onComplete={() => setShowRewardPopup(false)}
                />
            )}

            <ToastNotification message={toastMessage} onHide={() => setToastMessage('')} />
            {
                showParticles && (
                    <ParticleExplosion
                        trigger={showParticles}
                        position={particlePosition}
                        onComplete={() => setShowParticles(false)}
                    />
                )
            }
        </>
    );
};
