export interface Frame {
    id: string;
    label: string;
    image: any; // Require path
    unlockCondition: {
        type: 'level' | 'streak' | 'rank';
        value: number | string;
    };
    description: string;
}

export const FRAMES: Frame[] = [
    {
        id: 'default',
        label: 'Minimalista',
        image: null, // No frame
        unlockCondition: { type: 'level', value: 0 },
        description: 'La esencia pura. Sin adornos.'
    },
    // Rank Frames
    {
        id: 'frame_bronze',
        label: 'Marco de Bronce',
        image: require('@/assets/frames/frame_bronze.png'),
        unlockCondition: { type: 'rank', value: 'BRONZE' },
        description: 'Forjado en las primeras pruebas.'
    },
    {
        id: 'frame_silver',
        label: 'Marco de Plata',
        image: require('@/assets/frames/frame_silver.png'),
        unlockCondition: { type: 'rank', value: 'SILVER' },
        description: 'Brillo de la constancia.'
    },
    {
        id: 'frame_gold',
        label: 'Marco de Oro',
        image: require('@/assets/frames/frame_gold.png'),
        unlockCondition: { type: 'rank', value: 'GOLD' },
        description: 'Maestría sobre el impulso.'
    },
    {
        id: 'frame_infinite',
        label: 'Marco Infinito',
        image: require('@/assets/frames/frame_infinite.png'),
        unlockCondition: { type: 'rank', value: 'INFINITE' },
        description: 'Eternidad alcanzada.'
    },
    // Streak Frames
    {
        id: 'frame_streak_7',
        label: 'Iniciad@',
        image: require('@/assets/frames/frame_streak_7.png'),
        unlockCondition: { type: 'streak', value: 7 },
        description: '7 días de consistencia.'
    },
    {
        id: 'frame_streak_30',
        label: 'Habitual',
        image: require('@/assets/frames/frame_streak_30.png'),
        unlockCondition: { type: 'streak', value: 30 },
        description: '30 días de disciplina.'
    },
    {
        id: 'frame_streak_100',
        label: 'Centurión',
        image: require('@/assets/frames/frame_streak_100.png'),
        unlockCondition: { type: 'streak', value: 100 },
        description: '100 días de voluntad de hierro.'
    },
    // Special Event Frames
    {
        id: 'frame_founder',
        label: 'Fundador',
        image: require('@/assets/frames/frame_founder.png'),
        unlockCondition: { type: 'level', value: 999 }, // Special condition to keep it locked for now or use specific logic
        description: 'Exclusivo para los primeros miembros.'
    },
    {
        id: 'frame_event_beta',
        label: 'Beta Tester',
        image: require('@/assets/frames/frame_event_beta.png'),
        unlockCondition: { type: 'level', value: 0 }, // Everyone gets it for now in beta
        description: 'Participante de la fase Beta.'
    }
];
