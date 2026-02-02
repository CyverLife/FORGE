// Helper function to calculate consciousness rank based on level
export function getConsciousnessRank(level: number): 'BRONCE' | 'PLATA' | 'ORO' | 'INFINITO' {
    if (level >= 76) return 'INFINITO';
    if (level >= 51) return 'ORO';
    if (level >= 26) return 'PLATA';
    return 'BRONCE';
}

// Helper function to get coherence percentage
export function getCoherence(angelScore: number, simioScore: number): number {
    const total = angelScore + simioScore;
    if (total === 0) return 50; // Neutral start
    return Math.round((angelScore / total) * 100);
}
