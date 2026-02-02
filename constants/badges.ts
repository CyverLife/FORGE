export interface Badge {
    id: string;
    label: string;
    image: any;
    unlockCondition: {
        type: 'level' | 'streak' | 'rank';
        value: number | string;
    };
    description: string;
    type: 'STREAK' | 'RANK' | 'SPECIAL';
}

export const BADGES: Badge[] = [
    // Streak Badges
    {
        id: 'streak_7',
        label: 'Semana de Fuego',
        image: require('@/assets/badges/streak_7.png'),
        unlockCondition: { type: 'streak', value: 7 },
        description: 'Has mantenido el hábito por 7 días.',
        type: 'STREAK'
    },
    {
        id: 'streak_30',
        label: 'Mes de Disciplina',
        image: require('@/assets/badges/streak_30.png'),
        unlockCondition: { type: 'streak', value: 30 },
        description: '30 días de constancia inquebrantable.',
        type: 'STREAK'
    },
    {
        id: 'streak_100',
        label: 'Centurión',
        image: require('@/assets/badges/streak_100.png'),
        unlockCondition: { type: 'streak', value: 100 },
        description: '100 días forjando tu destino.',
        type: 'STREAK'
    },
    {
        id: 'streak_eternal',
        label: 'Llama Eterna',
        image: require('@/assets/badges/streak_eternal.png'),
        unlockCondition: { type: 'streak', value: 365 },
        description: 'Un año de luz inextinguible.',
        type: 'STREAK'
    },
    // Rank Badges
    {
        id: 'badge_bronze',
        label: 'Rango Bronce',
        image: require('@/assets/badges/rank_bronze_badge.png'),
        unlockCondition: { type: 'rank', value: 'BRONZE' },
        description: 'Inicio del camino.',
        type: 'RANK'
    },
    {
        id: 'badge_silver',
        label: 'Rango Plata',
        image: require('@/assets/badges/rank_silver_badge.png'),
        unlockCondition: { type: 'rank', value: 'SILVER' },
        description: 'Progreso sólido.',
        type: 'RANK'
    },
    {
        id: 'badge_gold',
        label: 'Rango Oro',
        image: require('@/assets/badges/rank_gold_badge.png'),
        unlockCondition: { type: 'rank', value: 'GOLD' },
        description: 'Excelencia demostrada.',
        type: 'RANK'
    },
    {
        id: 'badge_infinite',
        label: 'Rango Infinito',
        image: require('@/assets/badges/rank_infinite_badge.png'),
        unlockCondition: { type: 'rank', value: 'INFINITE' },
        description: 'Trascendencia.',
        type: 'RANK'
    }
];
