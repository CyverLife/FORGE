
const habitCompletionMessages = [
    "¡El Simio ha sido derrotado!",
    "Punto para el Ángel. Sigue forjando.",
    "Una batalla ganada. La guerra continúa.",
    "Tu voluntad se fortalece. Otro hábito forjado.",
    "El camino del Ángel se ilumina con tu acción.",
];

const streakAchievedMessages = (days: number) => [
    `\${days} días forjando tu destino. ¡Imparable!`,
    `Tu Ángel sonríe. \${days} victorias consecutivas.`,
    `La racha del Ángel: \${days} días de disciplina.`,
    `Cada día, un paso más cerca de tu mejor versión. (\${days} días)`,
];

const streakBrokenMessages = [
    "El Simio ha ganado esta ronda. Levántate y vuelve a la forja.",
    "Un tropiezo no es una caída. Tu Ángel te espera.",
    "La disciplina es un músculo. Hoy descansa, mañana entrena más fuerte.",
    "No es el fin, es un nuevo comienzo. Forja de nuevo.",
];

const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
};

export const getForgeMessage = (eventType: 'HABIT_COMPLETION' | 'STREAK_ACHIEVED' | 'STREAK_BROKEN', data?: { days?: number }) => {
    switch (eventType) {
        case 'HABIT_COMPLETION':
            return getRandomMessage(habitCompletionMessages);
        case 'STREAK_ACHIEVED':
            if (data?.days) {
                return getRandomMessage(streakAchievedMessages(data.days));
            }
            return "¡Racha alcanzada!";
        case 'STREAK_BROKEN':
            return getRandomMessage(streakBrokenMessages);
        default:
            return "";
    }
};
