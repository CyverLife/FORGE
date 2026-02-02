import React from 'react';
import { Image, Text, View } from 'react-native';

interface RankBadgeProps {
    rank: 'BRONZE' | 'SILVER' | 'GOLD' | 'INFINITE';
}

export const RankBadge = ({ rank }: RankBadgeProps) => {
    // Determine styles based on rank rules
    const getRankStyles = () => {
        switch (rank) {
            case 'INFINITE':
                return {
                    bg: ['#000000', '#1a1a1a'],
                    borderColor: '#FF3B2F', // Forge Ember
                    textColor: '#FF3B2F',
                    label: 'INFINITE // TRANSCENDENT',
                    glow: true
                };
            case 'GOLD':
                return {
                    bg: ['#F59E0B', '#B45309'], // Gold -> Dark Gold
                    borderColor: '#F59E0B',
                    textColor: '#FFF',
                    label: 'GOLD // PURPOSE',
                    glow: false
                };
            case 'SILVER':
                return {
                    bg: ['#9CA3AF', '#4B5563'], // Silver -> Gray
                    borderColor: '#9CA3AF',
                    textColor: '#E5E7EB',
                    label: 'SILVER // EGO',
                    glow: false
                };
            case 'BRONZE':
            default:
                return {
                    bg: ['#3E3E42', '#1C1C1E'], // Forge Black/Earth
                    borderColor: '#5D4037', // Bronze/Brown
                    textColor: '#A1887F',
                    label: 'BRONZE // IMPULSE',
                    glow: false
                };
        }
    };

    const getRankImage = () => {
        switch (rank) {
            case 'INFINITE': return require('@/assets/images/rank_4.png');
            case 'GOLD': return require('@/assets/images/rank_3.png');
            case 'SILVER': return require('@/assets/images/rank_2.png');
            case 'BRONZE':
            default: return require('@/assets/images/rank_1.png');
        }
    };

    const styles = getRankStyles();

    return (
        <View className="flex-row items-center gap-2 mt-1">
            <Image
                source={getRankImage()}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
            />
            <View>
                <Text style={{ color: styles.textColor, textShadowColor: styles.glow ? styles.borderColor : undefined, textShadowRadius: styles.glow ? 10 : 0 }} className="font-mono text-[10px] uppercase font-bold tracking-widest leading-none">
                    {styles.label.split(' // ')[0]}
                </Text>
                <Text className="text-white/40 font-mono text-[8px] tracking-wider leading-none">
                    {styles.label.split(' // ')[1]}
                </Text>
            </View>
        </View>
    );
};
