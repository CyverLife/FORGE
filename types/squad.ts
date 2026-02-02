export type Squad = {
    id: string;
    name: string;
    avatar_url: string | null;
    collective_hp: number;
    invite_code: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
};

export type SquadMember = {
    id: string;
    squad_id: string;
    user_id: string;
    personal_hp: number;
    joined_at: string;
};

export type SquadActivity = {
    id: string;
    squad_id: string;
    user_id: string;
    activity_type: 'completed' | 'failed' | 'joined' | 'left' | 'hp_bonus' | 'hp_damage';
    habit_title: string | null;
    hp_change: number;
    created_at: string;
};

export type SquadWithMembers = Squad & {
    members: (SquadMember & {
        user: {
            id: string;
            email?: string;
        };
    })[];
    member_count?: number;
};

export type SquadActivityWithUser = SquadActivity & {
    user: {
        id: string;
        email?: string;
    };
};
