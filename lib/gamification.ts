export const calculateLevel = (xp: number) => {
    // Constant logic: Level = Floor(SquareRoot(XP / 100)) + 1
    // Or simple progressive curve
    return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const calculateNextLevelXp = (level: number) => {
    return Math.pow(level, 2) * 100;
};

export const getProgressToNextLevel = (xp: number) => {
    const currentLevel = calculateLevel(xp);
    const nextLevelXp = calculateNextLevelXp(currentLevel);
    const prevLevelXp = calculateNextLevelXp(currentLevel - 1);

    return (xp - prevLevelXp) / (nextLevelXp - prevLevelXp);
};
