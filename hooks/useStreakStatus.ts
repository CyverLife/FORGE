import { useHabitsContext } from '@/context/HabitsContext';
import { useSquadsContext } from '@/context/SquadsContext';
import { useMemo } from 'react';

export type StreakStatus = 'WinningStreak' | 'Danger' | 'Neutral';

export const useStreakStatus = (): StreakStatus => {
    const { habits } = useHabitsContext();
    const { activeSquad } = useSquadsContext();

    const status = useMemo(() => {
        // Danger logic: If squad health is low (e.g., < 30%)
        if (activeSquad && activeSquad.collective_hp < 30) {
            return 'Danger';
        }

        // Winning Streak logic: If user has a decent streak on *any* habit or high global completion
        // Let's say if any habit has a streak > 3
        const hasWinningStreak = habits.some(h => h.streak >= 3);
        if (hasWinningStreak) {
            return 'WinningStreak';
        }

        return 'Neutral';
    }, [habits, activeSquad]);

    return status;
};
