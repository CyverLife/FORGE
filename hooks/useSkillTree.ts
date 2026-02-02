import { SkillNode } from '@/types';
import { useState } from 'react';

// Mock Data: The Tree of Duality
// "Forjado en el Dolor" narrative
const INITIAL_TREE: SkillNode[] = [
    // CORE TRUNK
    {
        id: 'core_awakening',
        title: 'DESPERTAR',
        description: 'Reconocer la existencia de las dos voces.',
        branch: 'CORE',
        status: 'MASTERED',
        cost: 0,
        required_nodes: [],
        conflicts_with: [],
        x: 0.5,
        y: 0.9,
    },
    // ANGEL BRANCH (Right - Order/Discipline)
    {
        id: 'angel_focus_1',
        title: 'FOCO DE HIERRO',
        description: 'Capacidad de trabajar 30min sin distracción.',
        branch: 'ANGEL',
        status: 'AVAILABLE',
        cost: 100,
        required_nodes: ['core_awakening'],
        conflicts_with: ['ape_distraction_1'], // Blocks "Doomscrolling Mastery"
        x: 0.7,
        y: 0.7,
    },
    {
        id: 'angel_fasting_1',
        title: 'AYUNO DE DOPAMINA',
        description: 'Eliminar fuentes de placer instantáneo por 24h.',
        branch: 'ANGEL',
        status: 'LOCKED',
        cost: 300,
        required_nodes: ['angel_focus_1'],
        conflicts_with: [],
        x: 0.8,
        y: 0.5,
    },
    // APE BRANCH (Left - Chaos/Pleasure)
    {
        id: 'ape_distraction_1',
        title: 'NAVEGANTE DEL CAOS',
        description: 'Maestría en multitarea y consumo rápido.',
        branch: 'APE',
        status: 'AVAILABLE',
        cost: 50, // Cheaper, easier
        required_nodes: ['core_awakening'],
        conflicts_with: ['angel_focus_1'], // Blocks "Iron Focus"
        x: 0.3,
        y: 0.7,
    },
    {
        id: 'ape_indulgence_1',
        title: 'REY DE LA FIESTA',
        description: 'Maximizar el placer social sin culpa.',
        branch: 'APE',
        status: 'LOCKED',
        cost: 150,
        required_nodes: ['ape_distraction_1'],
        conflicts_with: [],
        x: 0.2,
        y: 0.5,
    }
];

export function useSkillTree() {
    const [nodes, setNodes] = useState<SkillNode[]>(INITIAL_TREE);

    const unlockNode = (nodeId: string) => {
        setNodes(prev => prev.map(node => {
            if (node.id === nodeId && node.status === 'AVAILABLE') {
                // Check if any conflicting node is already unlocked
                const conflicts = node.conflicts_with;
                const hasConflict = prev.some(n => conflicts.includes(n.id) && (n.status === 'UNLOCKED' || n.status === 'MASTERED'));

                if (hasConflict) {
                    // In a real app, we'd show an error/warning
                    return node;
                }

                return { ...node, status: 'UNLOCKED' };
            }
            return node;
        }));
    };

    return {
        nodes,
        unlockNode
    };
}
