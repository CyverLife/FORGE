import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useAuth } from './useAuth';

export function useDecisions() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);

    const logDecision = async (type: 'ANGEL' | 'APE', context: string = '') => {
        if (!session?.user) return;

        setLoading(true);
        // 1. Log the decision
        const { error: decisionError } = await supabase
            .from('decisions')
            .insert([{ user_id: session.user.id, type, context }]);

        if (decisionError) {
            console.error('Error logging decision:', decisionError);
            setLoading(false);
            return;
        }

        // 2. Update Anti-Gravity Score (simplistic client-side logic for now)
        // Ideally this should be a DB trigger or Edge Function
        const scoreChange = type === 'ANGEL' ? 10 : -5;

        // Optimistic update or fetch current profile
        // For now we just assume the trigger works or we do it manual if needed.
        // Let's rely on the Realtime (Phase 3 task) or just fetch for now.

        setLoading(false);
    };

    return { logDecision, loading };
}
