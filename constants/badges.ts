export interface Badge {
    id: string;
    label: string;
    image: any;
    unlockCondition: {
        type: 'level' | 'streak' | 'rank' | 'special';
        value: number | string;
    };
    description: string;
    type: 'STREAK' | 'RANK' | 'SPECIAL' | 'MASTERY';
}

export const BADGES: Badge[] = [
    // Special Badges
    {
        id: 'badge_founder',
        label: 'Founder',
        image: require('@/assets/images/badge_founder.png'), // Placeholder
        unlockCondition: { type: 'special', value: 'founder' },
        description: 'Miembro fundador de FORGE.',
        type: 'SPECIAL'
    },
    {
        id: 'badge_beta',
        label: 'Beta Tester',
        image: require('@/assets/images/badge_beta.png'), // Placeholder
        unlockCondition: { type: 'special', value: 'beta_tester' },
        description: 'Pionero en la fase de prueba.',
        type: 'SPECIAL'
    },
    // Streak Badges
    {
        id: 'streak_7',
        label: 'Semana de Fuego',
        image: require('@/assets/images/streak_7.png'),
        unlockCondition: { type: 'streak', value: 7 },
        description: 'Has mantenido el hábito por 7 días.',
        type: 'STREAK'
    },
    {
        id: 'streak_30',
        label: 'Mes de Disciplina',
        image: require('@/assets/images/streak_30.png'),
        unlockCondition: { type: 'streak', value: 30 },
        description: '30 días de constancia inquebrantable.',
        type: 'STREAK'
    },
    {
        id: 'streak_100',
        label: 'Centurión',
        image: require('@/assets/images/streak_100.png'),
        unlockCondition: { type: 'streak', value: 100 },
        description: '100 días forjando tu destino.',
        type: 'STREAK'
    },
    {
        id: 'streak_eternal',
        label: 'Llama Eterna',
        image: require('@/assets/images/streak_eternal.png'),
        unlockCondition: { type: 'streak', value: 365 },
        description: 'Un año de luz inextinguible.',
        type: 'STREAK'
    },
    // Rank Badges
    {
        id: 'badge_bronze',
        label: 'Rango Bronce',
        image: require('@/assets/images/rank_bronze.png'),
        unlockCondition: { type: 'rank', value: 'BRONZE' },
        description: 'Inicio del camino.',
        type: 'RANK'
    },
    {
        id: 'badge_silver',
        label: 'Rango Plata',
        image: require('@/assets/images/rank_silver.png'),
        unlockCondition: { type: 'rank', value: 'SILVER' },
        description: 'Progreso sólido.',
        type: 'RANK'
    },
    {
        id: 'badge_gold',
        label: 'Rango Oro',
        image: require('@/assets/images/rank_gold.png'),
        unlockCondition: { type: 'rank', value: 'GOLD' },
        description: 'Excelencia demostrada.',
        type: 'RANK'
    },
    {
        id: 'badge_infinite',
        label: 'Rango Infinito',
        image: require('@/assets/images/rank_infinite.png'),
        unlockCondition: { type: 'rank', value: 'INFINITE' },
        description: 'Trascendencia.',
        type: 'RANK'
    },
    // Mastery Badges (Nivel)
    {
        id: 'mastery_1',
        label: 'Maestría I',
        image: require('@/assets/images/badge_mastery_1.png'),
        unlockCondition: { type: 'level', value: 10 },
        description: 'Alcanza el nivel 10.',
        type: 'MASTERY' as any
    },
    {
        id: 'mastery_2',
        label: 'Maestría II',
        image: require('@/assets/images/badge_mastery_2.png'),
        unlockCondition: { type: 'level', value: 25 },
        description: 'Alcanza el nivel 25.',
        type: 'MASTERY' as any
    },
    {
        id: 'mastery_3',
        label: 'Maestría III',
        image: require('@/assets/images/badge_mastery_3.png'),
        unlockCondition: { type: 'level', value: 50 },
        description: 'Alcanza el nivel 50.',
        type: 'MASTERY' as any
    },
    {
        id: 'mastery_4',
        label: 'Gran Maestro',
        image: require('@/assets/images/badge_mastery_4.png'),
        unlockCondition: { type: 'level', value: 100 },
        description: 'Alcanza el nivel 100.',
        type: 'MASTERY' as any
    }
];
