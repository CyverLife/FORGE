import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';

interface ConsciousnessRankBadgeProps {
    rank: 'BRONCE' | 'PLATA' | 'ORO' | 'INFINITO';
    level: number;
    size?: 'small' | 'medium' | 'large';
}

const RANK_CONFIG = {
    BRONCE: {
        label: 'BRONCE',
        subtitle: 'Reactividad',
        colors: ['#CD7F32', '#8B4513'],
        icon: 'bolt.fill' as const,
        iconColor: '#CD7F32',
        description: 'Gratificación inmediata',
    },
    PLATA: {
        label: 'PLATA',
        subtitle: 'Ego',
        colors: ['#C0C0C0', '#808080'],
        icon: 'trophy.fill' as const,
        iconColor: '#C0C0C0',
        description: 'Comparación y estatus',
    },
    ORO: {
        label: 'ORO',
        subtitle: 'Propósito',
        colors: ['#FFD700', '#FFA500'],
        icon: 'star.fill' as const,
        iconColor: '#FFD700',
        description: 'Valores intrínsecos',
    },
    INFINITO: {
        label: 'INFINITO',
        subtitle: 'Desapego',
        colors: ['#E0E7FF', '#A5B4FC'],
        icon: 'infinity' as const,
        iconColor: '#E0E7FF',
        description: 'Placer del camino',
    },
};

export const ConsciousnessRankBadge: React.FC<ConsciousnessRankBadgeProps> = ({
    rank,
    level,
    size = 'medium',
}) => {
    const config = RANK_CONFIG[rank];

    const sizeClasses = {
        small: 'px-3 py-1.5',
        medium: 'px-4 py-2',
        large: 'px-6 py-3',
    };

    const textSizes = {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base',
    };

    const iconSizes = {
        small: 16,
        medium: 20,
        large: 24,
    };

    return (
        <View className="items-center">
            <LinearGradient
                colors={[config.colors[0], config.colors[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className={`rounded-premium ${sizeClasses[size]} flex-row items-center gap-2`}
            >
                <IconSymbol name={config.icon} size={iconSizes[size]} color="#000000" />
                <View>
                    <Text className={`text-deep-black font-black ${textSizes[size]} uppercase tracking-wider`}>
                        {config.label}
                    </Text>
                    {size !== 'small' && (
                        <Text className="text-deep-black/70 text-[10px] uppercase tracking-wider">
                            {config.subtitle}
                        </Text>
                    )}
                </View>
            </LinearGradient>

            {size === 'large' && (
                <Text className="text-text-tertiary text-xs mt-2 text-center">
                    {config.description}
                </Text>
            )}
        </View>
    );
};
