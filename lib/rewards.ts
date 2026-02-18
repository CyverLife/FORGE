import { supabase } from './supabase';

export interface VariableReward {
    totalXP: number;
    baseXP: number;
    multiplier: number;
    streakBonus: number;
    criticalHit: boolean;
    bonusMessage?: string;
}

/**
 * Calculate variable XP rewards with randomness to trigger dopamine
 * Based on Nir Eyal's Hook Model - Variable Rewards principle
 */
export function calculateVariableXP(currentStreak: number = 0): VariableReward {
    const baseXP = 10;

    // Random multiplier (0.5x to 2x)
    const multiplier = Math.random() * 1.5 + 0.5; // 0.5 - 2.0x

    // Streak bonus (caps at +5x at 50 day streak)
    const streakBonus = Math.min(currentStreak / 10, 5);

    // Critical Hit! (15% chance for 3x multiplier)
    const criticalHit = Math.random() < 0.15;
    const critMultiplier = criticalHit ? 3 : 1;

    // Calculate total
    const totalXP = Math.floor(baseXP * multiplier * (1 + streakBonus / 5) * critMultiplier);

    // Generate motivational message
    let bonusMessage;
    if (criticalHit) {
        bonusMessage = '⚡ CRITICAL HIT!';
    } else if (multiplier > 1.7) {
        bonusMessage = '🔥 GRAN PREMIO!';
    } else if (streakBonus > 2) {
        bonusMessage = `🏆 RACHA x${currentStreak}!`;
    }

    return {
        totalXP,
        baseXP,
        multiplier,
        streakBonus,
        criticalHit,
        bonusMessage
    };
}

/**
 * Award XP to user with variable rewards
 * @param userId - User ID
 * @param currentStreak - Current streak value
 * @returns Reward details
 */
export async function awardVariableXP(userId: string, currentStreak: number): Promise<VariableReward> {
    const reward = calculateVariableXP(currentStreak);

    // Update user XP in database
    const { error } = await supabase.rpc('add_xp', {
        user_id: userId,
        xp_amount: reward.totalXP
    });

    if (error) {
        console.error('Error awarding XP:', error);
        // Return reward anyway for optimistic UI
    }

    return reward;
}

/**
 * Get progress to next level (0-100%)
 */
export function getProgressToNextLevel(currentXP: number): number {
    const xpForNextLevel = 100;
    return (currentXP % xpForNextLevel) / xpForNextLevel * 100;
}

/**
 * Calculate level from total XP
 */
export function getLevelFromXP(xp: number): number {
    return Math.floor(xp / 100) + 1;
}

/**
 * Check if user leveled up after gaining XP
 */
export function didLevelUp(oldXP: number, newXP: number): boolean {
    return getLevelFromXP(oldXP) < getLevelFromXP(newXP);
}

/**
 * Get daily progress stats (for daily mission bars)
 */
export interface DailyProgress {
    completedToday: number;
    targetGoal: number;
    progressPercent: number;
    isComplete: boolean;
}

export async function getDailyProgress(userId: string): Promise<DailyProgress> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('logs')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'completed')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

    const completedToday = data?.length || 0;
    const targetGoal = 5; // Default daily goal

    return {
        completedToday,
        targetGoal,
        progressPercent: Math.min((completedToday / targetGoal) * 100, 100),
        isComplete: completedToday >= targetGoal
    };
}
