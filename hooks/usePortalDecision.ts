import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useAuth } from './useAuth';

export type PortalDecisionType = 'BRIGHTEN' | 'DARKEN';

interface PortalDecision {
    id: string;
    user_id: string;
    habit_id?: string;
    type: 'ANGEL' | 'APE';
    context?: string;
    created_at: string;
}

export const usePortalDecision = () => {
    const { session } = useAuth();
    const [isRecording, setIsRecording] = useState(false);

    const recordDecision = async (
        decisionType: PortalDecisionType,
        habitId?: string,
        context?: string
    ): Promise<{ success: boolean; error?: string }> => {
        if (!session?.user?.id) {
            return { success: false, error: 'No user session' };
        }

        setIsRecording(true);

        try {
            const { data, error } = await supabase
                .from('portal_decisions')
                .insert({
                    user_id: session.user.id,
                    habit_id: habitId,
                    type: decisionType === 'BRIGHTEN' ? 'ANGEL' : 'APE', // Map Frontend 'BRIGHTEN/DARKEN' to DB 'ANGEL/APE'
                    context: context || null,
                })
                .select()
                .single();

            if (error) {
                console.error('Error recording portal decision:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (err) {
            console.error('Unexpected error:', err);
            return { success: false, error: 'Unexpected error occurred' };
        } finally {
            setIsRecording(false);
        }
    };

    const getRecentDecisions = async (limit: number = 10): Promise<PortalDecision[]> => {
        if (!session?.user?.id) return [];

        const { data, error } = await supabase
            .from('portal_decisions')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching decisions:', error);
            return [];
        }

        return data || [];
    };

    const getDecisionStats = async (): Promise<{
        brighten: number;
        darken: number;
        coherence: number;
    }> => {
        if (!session?.user?.id) {
            return { brighten: 0, darken: 0, coherence: 50 };
        }

        const { data, error } = await supabase
            .from('portal_decisions')
            .select('type')
            .eq('user_id', session.user.id);

        if (error || !data) {
            return { brighten: 0, darken: 0, coherence: 50 };
        }

        const brighten = data.filter(d => d.type === 'ANGEL').length;
        const darken = data.filter(d => d.type === 'APE').length;
        const total = brighten + darken;
        const coherence = total > 0 ? Math.round((brighten / total) * 100) : 50;

        return { brighten, darken, coherence };
    };

    return {
        recordDecision,
        getRecentDecisions,
        getDecisionStats,
        isRecording,
    };
};
