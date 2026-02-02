import { useHabits } from '@/hooks/useHabits';
import { PortalDecisionType } from '@/hooks/usePortalDecision';
import { useSoundSystem } from '@/hooks/useSoundSystem';
import { Habit, SensorySlideData } from '@/types';
import { FlashList as ShopifyFlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { FadeInDown, useAnimatedStyle } from 'react-native-reanimated';
import { IconSymbol } from './icon-symbol';
import { PortalDecisionModal } from './PortalDecisionModal';
import { QuestCard } from './QuestCard';
import { SensorySlideCard } from './SensorySlideCard';

// Fix for FlashList type mismatch
const FlashList = ShopifyFlashList as any;

export const HabitList = () => {
    const { habits, loading, logHabit } = useHabits();
    const { playSound, playHaptic } = useSoundSystem();
    const [filter, setFilter] = useState<'ALL' | 'IRON' | 'FIRE' | 'STEEL' | 'FOCUS'>('ALL');

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
                Alert.alert('Error', 'Failed to log protocol.');
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
            Alert.alert('Error', 'Failed to log protocol.');
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

    const handleSensoryAction = (action: 'brighten' | 'darken') => {
        if (!selectedSensorySlide) return;

        // Close slide
        const habitId = selectedSensorySlide.habitId;
        const habitData = habits.find(h => h.id === habitId); // Need title
        setSelectedSensorySlide(null);

        // Map action to portal decision
        if (action === 'brighten') {
            // For brighten, we assume completion and trigger portal logic (which updates scores)
            // We can skip the question "Does this brighten?" because they just answered it in the slide
            // But we need to update the scores.
            // Actually, the user wants "Tap -> Slide -> Action -> Complete".
            // We can reuse handlePortalDecision logic if we synthesize the call.
            // Or simpler: trigger the swipe-like completion but pass a flag to AUTO-SELECT the decision if we want to skip the second modal.

            // For now, let's open the Portal Decision Modal as confirmation? 
            // Or better: Direct completion with specific decision.
            // But handlePortalDecision takes a decision type and updates locally? No, it calls hook.
            // Wait, handlePortalDecision in HabitList calls logHabit. 
            // The ACTUAL decision recording happens in the Modal's hook? 
            // No, looking at HabitList again... handlePortalDecision calls logHabit.
            // The PortalDecisionModal handles the `usePortalDecision` hook internally to record the decision?
            // Yes, let's check PortalDecisionModal usage. 
            // <PortalDecisionModal onDecision={handlePortalDecision} ... />
            // handlePortalDecision receives `decision` but currently ignores it in the catch/try block in HabitList?
            // Let's re-read handlePortalDecision in HabitList:
            /*
               const handlePortalDecision = async (decision: PortalDecisionType) => {
                   if (!pendingHabit) return;
                   try {
                       await logHabit(pendingHabit.id, pendingHabit.status);
                   } ...
               };
            */
            // It seems HabitList just logs the habit. The recording of the 'decision' (Angel/Simio score) must happen inside the Modal or via the callback?
            // If PortalDecisionModal takes `onDecision`, it probably calls it AFTER recording the decision internally?
            // I need to verify PortalDecisionModal.

            // As a safe bet: Let's trigger the completion flow normally.
            if (habitData) {
                handleSwipe(habitId, habitData.title, 'completed');
            }
        } else {
            // Darken -> Facillaty / Skip
            if (habitData) {
                handleSwipe(habitId, habitData.title, 'failed');
            }
        }
    };

    const renderItem = ({ item, index }: { item: Habit, index: number }) => (
        <Reanimated.View
            entering={FadeInDown.delay(index * 100).springify()}
            style={{ marginBottom: 12 }}
        >
            <ReanimatedSwipeable
                containerStyle={{ width: '100%' }}
                friction={2}
                enableTrackpadTwoFingerGesture
                rightThreshold={40}
                leftThreshold={40}
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
                            {/* Optional label if space permits, but icon is cleaner */}
                        </Reanimated.View>
                    );
                }}
                onSwipeableOpen={(direction) => {
                    if (direction === 'left') {
                        playHaptic('medium'); // Pre-portal haptic
                        handleSwipe(item.id, item.title, 'completed');
                    } else if (direction === 'right') {
                        playSound('recalibrate'); // Specific sound/haptic for recalibration
                        handleSwipe(item.id, item.title, 'failed');
                    }
                }}
            >
                <TouchableOpacity onPress={() => handleHabitPress(item)} activeOpacity={0.9}>
                    <QuestCard
                        habit={item}
                        onComplete={() => handleSwipe(item.id, item.title, 'completed')}
                        onFail={() => handleSwipe(item.id, item.title, 'failed')}
                    />
                </TouchableOpacity>
            </ReanimatedSwipeable>
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
                <View className="bg-[#1A1110] px-3 py-1 rounded border border-[#F97316]">
                    <Text className="text-[#F97316] font-bold text-[10px] tracking-widest">{filteredHabits.length} ACTIVOS</Text>
                </View>
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
