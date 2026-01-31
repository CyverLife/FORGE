export interface User {
    id: string;
    email?: string;
}

export interface Habit {
    id: string;
    title: string;
    description?: string;
    attribute: 'FIRE' | 'ICE' | 'MAGMA' | 'VOID';
    difficulty: number;
    points: number;
    completed_today: boolean;
}

export interface ProfileState {
    level: number;
    xp: number;
    anti_gravity_score: number;
}

export interface Decision {
    id: string;
    type: 'ANGEL' | 'APE';
    context: string;
    created_at: string;
}
