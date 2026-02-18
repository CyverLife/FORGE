import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Squad, SquadActivity, SquadWithMembers } from '@/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useGlobalAlert } from './GlobalAlertContext';

type SquadsContextType = {
    squads: SquadWithMembers[];
    activeSquad: SquadWithMembers | null;
    loading: boolean;
    createSquad: (name: string, avatarUrl?: string) => Promise<Squad | null>;
    joinSquad: (inviteCode: string) => Promise<boolean>;
    leaveSquad: (squadId: string) => Promise<void>;
    setActiveSquad: (squad: SquadWithMembers | null) => void;
    updateSquadHP: (squadId: string, hpChange: number, activityType: SquadActivity['activity_type'], habitTitle?: string) => Promise<void>;
    refreshSquads: () => Promise<void>;
};

const SquadsContext = createContext<SquadsContextType | undefined>(undefined);

export function SquadsProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAuth();
    const { showAlert } = useGlobalAlert();
    const [squads, setSquads] = useState<SquadWithMembers[]>([]);
    const [activeSquad, setActiveSquad] = useState<SquadWithMembers | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch user's squads
    const fetchSquads = useCallback(async () => {
        if (!session?.user) {
            setSquads([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Get squads where user is a member
            const { data: memberData, error: memberError } = await supabase
                .from('squad_members')
                .select('squad_id')
                .eq('user_id', session.user.id);

            if (memberError) throw memberError;

            if (!memberData || memberData.length === 0) {
                setSquads([]);
                setActiveSquad(null);
                setLoading(false);
                return;
            }

            const squadIds = memberData.map(m => m.squad_id);

            // Fetch full squad data with members
            const { data: squadsData, error: squadsError } = await supabase
                .from('squads')
                .select(`
          *,
          members:squad_members(
            id,
            user_id,
            personal_hp,
            joined_at,
            user:user_id(id, email)
          )
        `)
                .in('id', squadIds)
                .order('created_at', { ascending: false });

            if (squadsError) throw squadsError;

            const squadsWithMembers = (squadsData || []).map(squad => ({
                ...squad,
                member_count: squad.members?.length || 0
            })) as SquadWithMembers[];

            setSquads(squadsWithMembers);

            // Set active squad if none is set
            if (!activeSquad && squadsWithMembers.length > 0) {
                setActiveSquad(squadsWithMembers[0]);
            }

        } catch (error: any) {
            console.error('Error fetching squads:', error);
            showAlert('Error', 'Failed to load squads');
        } finally {
            setLoading(false);
        }
    }, [session, activeSquad, showAlert]);

    // Initial fetch
    useEffect(() => {
        fetchSquads();
    }, [session]);

    // Create new squad
    const createSquad = async (name: string, avatarUrl?: string): Promise<Squad | null> => {
        if (!session?.user) {
            showAlert('Error', 'You must be logged in');
            return null;
        }

        if (name.trim().length === 0 || name.length > 30) {
            showAlert('Error', 'Squad name must be 1-30 characters');
            return null;
        }

        try {
            // Create squad
            const { data: squadData, error: squadError } = await supabase
                .from('squads')
                .insert([{
                    name: name.trim(),
                    avatar_url: avatarUrl || null,
                    owner_id: session.user.id
                }])
                .select()
                .single();

            if (squadError) throw squadError;

            // Add creator as first member
            const { error: memberError } = await supabase
                .from('squad_members')
                .insert([{
                    squad_id: squadData.id,
                    user_id: session.user.id
                }]);

            if (memberError) throw memberError;

            // Create join activity
            await supabase
                .from('squad_activity')
                .insert([{
                    squad_id: squadData.id,
                    user_id: session.user.id,
                    activity_type: 'joined',
                    hp_change: 0
                }]);

            // Refresh squads
            await fetchSquads();

            showAlert('Success', `Squad "${name}" created! Invite code: ${squadData.invite_code}`);
            return squadData;

        } catch (error: any) {
            console.error('Error creating squad:', error);
            showAlert('Error', error.message || 'Failed to create squad');
            return null;
        }
    };

    // Join existing squad
    const joinSquad = async (inviteCode: string): Promise<boolean> => {
        if (!session?.user) {
            showAlert('Error', 'You must be logged in');
            return false;
        }

        if (inviteCode.trim().length !== 6) {
            showAlert('Error', 'Invalid invite code');
            return false;
        }

        try {
            // Find squad by invite code
            const { data: squadData, error: squadError } = await supabase
                .from('squads')
                .select('*')
                .eq('invite_code', inviteCode.toUpperCase())
                .single();

            if (squadError || !squadData) {
                showAlert('Error', 'Squad not found');
                return false;
            }

            // Check if already a member
            const { data: existingMember } = await supabase
                .from('squad_members')
                .select('id')
                .eq('squad_id', squadData.id)
                .eq('user_id', session.user.id)
                .single();

            if (existingMember) {
                showAlert('Info', 'You are already a member of this squad');
                return false;
            }

            // Check member count (max 5)
            const { count } = await supabase
                .from('squad_members')
                .select('*', { count: 'exact', head: true })
                .eq('squad_id', squadData.id);

            if (count && count >= 5) {
                showAlert('Error', 'Squad is full (max 5 members)');
                return false;
            }

            // Add as member
            const { error: memberError } = await supabase
                .from('squad_members')
                .insert([{
                    squad_id: squadData.id,
                    user_id: session.user.id
                }]);

            if (memberError) throw memberError;

            // Create join activity
            await supabase
                .from('squad_activity')
                .insert([{
                    squad_id: squadData.id,
                    user_id: session.user.id,
                    activity_type: 'joined',
                    hp_change: 0
                }]);

            // Refresh squads
            await fetchSquads();

            showAlert('Success', `Joined squad "${squadData.name}"!`);
            return true;

        } catch (error: any) {
            console.error('Error joining squad:', error);
            showAlert('Error', error.message || 'Failed to join squad');
            return false;
        }
    };

    // Leave squad
    const leaveSquad = async (squadId: string): Promise<void> => {
        if (!session?.user) return;

        try {
            const squad = squads.find(s => s.id === squadId);
            if (!squad) return;

            // Create leave activity first
            await supabase
                .from('squad_activity')
                .insert([{
                    squad_id: squadId,
                    user_id: session.user.id,
                    activity_type: 'left',
                    hp_change: 0
                }]);

            // Remove member
            const { error } = await supabase
                .from('squad_members')
                .delete()
                .eq('squad_id', squadId)
                .eq('user_id', session.user.id);

            if (error) throw error;

            // If was active squad, clear it
            if (activeSquad?.id === squadId) {
                setActiveSquad(null);
            }

            // Refresh squads
            await fetchSquads();

            showAlert('Success', 'Left squad');

        } catch (error: any) {
            console.error('Error leaving squad:', error);
            showAlert('Error', 'Failed to leave squad');
        }
    };

    // Update squad HP
    const updateSquadHP = async (
        squadId: string,
        hpChange: number,
        activityType: SquadActivity['activity_type'],
        habitTitle?: string
    ): Promise<void> => {
        if (!session?.user) return;

        try {
            // Update squad collective HP
            const { data: currentSquad, error: fetchError } = await supabase
                .from('squads')
                .select('collective_hp')
                .eq('id', squadId)
                .single();

            if (fetchError) throw fetchError;

            const newHP = Math.max(0, Math.min(150, currentSquad.collective_hp + hpChange));

            const { error: updateError } = await supabase
                .from('squads')
                .update({ collective_hp: newHP })
                .eq('id', squadId);

            if (updateError) throw updateError;

            // Create activity entry
            await supabase
                .from('squad_activity')
                .insert([{
                    squad_id: squadId,
                    user_id: session.user.id,
                    activity_type: activityType,
                    habit_title: habitTitle || null,
                    hp_change: hpChange
                }]);

            // Refresh squads to update UI
            await fetchSquads();

        } catch (error: any) {
            console.error('Error updating squad HP:', error);
        }
    };

    const value = React.useMemo(() => ({
        squads,
        activeSquad,
        loading,
        createSquad,
        joinSquad,
        leaveSquad,
        setActiveSquad,
        updateSquadHP,
        refreshSquads: fetchSquads
    }), [squads, activeSquad, loading, fetchSquads]);

    return (
        <SquadsContext.Provider value={value}>
            {children}
        </SquadsContext.Provider>
    );
}

export function useSquadsContext() {
    const context = useContext(SquadsContext);
    if (context === undefined) {
        throw new Error('useSquadsContext must be used within a SquadsProvider');
    }
    return context;
}
