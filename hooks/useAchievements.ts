import { useMemo } from 'react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    condition: (stats: any) => boolean;
}

const ACHIEVEMENTS_LIST: Achievement[] = [
    {
        id: 'first_step',
        title: 'Primer Paso',
        description: 'Completa tu primer hábito',
        icon: 'foot.fill', // hypothetical SF symbol
        condition: (stats) => stats.totalCompletions >= 1
    },
    {
        id: 'on_fire',
        title: 'Fuego Iniciado',
        description: 'Alcanza una racha de 3 días',
        icon: 'flame.fill',
        condition: (stats) => stats.streak >= 3
    },
    {
        id: 'eternal_flame',
        title: 'Llama Eterna',
        description: 'Mantén una racha de 7 días',
        icon: 'flame.circle.fill',
        condition: (stats) => stats.streak >= 7
    },
    {
        id: 'level_5',
        title: 'Veterano',
        description: 'Alcanza el nivel 5',
        icon: 'star.circle.fill',
        condition: (stats) => stats.level >= 5
    },
    {
        id: 'sharp_shooter',
        title: 'Francotirador',
        description: '100% Precisión semanal',
        icon: 'scope',
        condition: (stats) => stats.accuracy >= 1
    },
    {
        id: 'guardian',
        title: 'Ángel Guardián',
        description: '10 decisiones Ángel tomadas (Essence)',
        icon: 'wings', // Custom or fallback
        condition: (stats) => stats.angelScore >= 10
    }
];

export const useAchievements = (stats: {
    totalCompletions: number;
    streak: number;
    level: number;
    accuracy: number;
    angelScore: number;
}) => {
    const achievements = useMemo(() => {
        return ACHIEVEMENTS_LIST.map(a => ({
            ...a,
            unlocked: a.condition(stats)
        }));
    }, [stats]);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const nextAchievement = achievements.find(a => !a.unlocked);

    return { achievements, unlockedCount, nextAchievement };
};
