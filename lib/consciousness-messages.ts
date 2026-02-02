import { ProfileState } from '@/types';

type ConsciousnessRank = ProfileState['consciousness_rank'];
type MessageContext = 'HABIT_COMPLETION' | 'PORTAL_DECISION' | 'RECALIBRATION' | 'IDLE';

interface Message {
    text: string;
    author?: string; // Optional: "Marco Aurelio", "Seneca", or "System"
}

const MESSAGES: Record<ConsciousnessRank, Record<MessageContext, Message[]>> = {
    'BRONCE': {
        'HABIT_COMPLETION': [
            { text: "Un pequeño paso fuera del caos." },
            { text: "La repetición crea al maestro." },
            { text: "No es magia, es disciplina." },
        ],
        'PORTAL_DECISION': [
            { text: "¿Placer ahora o poder mañana?" },
            { text: "Tu futuro te está mirando." },
            { text: "El Simio quiere descansar. El Ángel quiere volar." },
        ],
        'RECALIBRATION': [
            { text: "Recalculando ruta..." },
            { text: "No es un fallo, es un ajuste de coordenadas." },
            { text: "GPS Emocional activado: Retomando rumbo." },
        ],
        'IDLE': [
            { text: "Estás dormido. Despierta." },
            { text: "El mundo te empuja. Empuja tú también." },
        ]
    },
    'PLATA': {
        'HABIT_COMPLETION': [
            { text: "Estás construyendo algo sólido." },
            { text: "Tu voluntad es más fuerte que tu entorno." },
        ],
        'PORTAL_DECISION': [
            { text: "¿Para quién haces esto? ¿Para ti o para ellos?" },
            { text: "El estatus es humo. La esencia es fuego." },
        ],
        'RECALIBRATION': [
            { text: "Acepta el desvío. Vuelve al camino." },
            { text: "La consciencia no juzga, solo observa y corrige." },
            { text: "Recalibrando sistema de valores." }
        ],
        'IDLE': [
            { text: "Has despertado, pero sigues soñando." },
            { text: "No busques aplausos, busca verdad." },
        ]
    },
    'ORO': {
        'HABIT_COMPLETION': [
            { text: "Actúas porque es tu naturaleza." },
            { text: "El resultado es irrelevante. La acción es todo." },
        ],
        'PORTAL_DECISION': [
            { text: "Honor sobre placer." },
            { text: "Sirve a tu propósito, no a tu ego." },
        ],
        'RECALIBRATION': [
            { text: "El obstáculo es el camino." },
            { text: "Todo sucede para tu beneficio. Intégralo." },
            { text: "Nada se pierde. Todo se transforma." }
        ],
        'IDLE': [
            { text: "Eres el arquitecto de tu realidad." },
            { text: "La paz es el premio." },
        ]
    },
    'INFINITO': {
        'HABIT_COMPLETION': [
            { text: "Fluye." },
            { text: "Sin esfuerzo." },
        ],
        'PORTAL_DECISION': [
            { text: "Ya eres." },
            { text: "Todo es uno." },
        ],
        'RECALIBRATION': [
            { text: "No hay error." },
            { text: "Danza con el caos." },
            { text: "Silencio y retorno." }
        ],
        'IDLE': [
            { text: "Estás más allá." },
            { text: "Silencio." },
        ]
    }
};

export function getConsciousnessMessage(rank: ConsciousnessRank, context: MessageContext): string {
    const rankMessages = MESSAGES[rank] || MESSAGES['BRONCE'];
    const contextMessages = rankMessages[context] || rankMessages['IDLE'];

    if (contextMessages.length === 0) return "Despierta.";

    const randomIndex = Math.floor(Math.random() * contextMessages.length);
    return contextMessages[randomIndex].text;
}
