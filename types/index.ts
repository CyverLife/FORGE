export interface User {
    id: string;
    email?: string;
}

export interface SensorySlideData {
    title: string;
    narrative: string;
    visual_mood?: string;
    sensory_details: {
        sight?: string;
        sound?: string;
        smell?: string;
        touch?: string;
        emotion?: string;
    };
    consciousness_message?: string;
    portal_actions: {
        brighten: string;
        darken: string;
    };
}

export interface Habit {
    id: string;
    title: string;
    description?: string;
    attribute: 'IRON' | 'FIRE' | 'STEEL' | 'FOCUS';
    alignment?: 'CORE' | 'SUPPORT';
    difficulty: number;
    points: number;
    completed_today: boolean;
    streak: number;
    consistency: number;
    xp_reward?: number;
    category?: 'MAIN_QUEST' | 'SIDEQUEST';
    hobby_type?: 'GUITAR' | 'SKATE' | 'SURF' | 'ART' | 'READING' | 'OTHER';
    sensory_slide?: SensorySlideData;
    essence_type?: 'ANGEL' | 'SIMIO' | 'NEUTRAL';
    portal_mantra?: string;
    logs?: { status: string; completed_at: string; }[];
}

export interface ProfileState {
    level: number;
    xp: number;
    anti_gravity_score: number;
    consciousness_rank: 'BRONCE' | 'PLATA' | 'ORO' | 'INFINITO';
    consciousness_level: number;
    angel_score: number;  // Decisiones del Ángel
    simio_score: number;  // Decisiones del Simio
}

export interface Decision {
    id: string;
    type: 'ANGEL' | 'APE';
    context: string;
    created_at: string;
}

export type DualityBranch = 'ANGEL' | 'APE' | 'CORE';

export interface SkillNode {
    id: string;
    title: string;
    description: string;
    branch: DualityBranch;
    status: 'LOCKED' | 'AVAILABLE' | 'UNLOCKED' | 'MASTERED';
    cost: number; // XP Cost
    required_nodes: string[]; // IDs of prerequisites
    conflicts_with: string[]; // IDs of nodes this blocks (The "Tension" mechanic)
    x: number; // Position for custom UI
    y: number;
}

export interface VisionSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image_url?: string;
    theme_color: string;
}

export * from './squad';

