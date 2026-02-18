import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface DailyProgressBarProps {
    completed: number;
    total: number;
}

export function DailyProgressBar({ completed, total }: DailyProgressBarProps) {
    const progress = total > 0 ? completed / total : 0;
    const isComplete = progress >= 1;
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withSpring(progress, { damping: 15 });
    }, [progress]);

    const animatedProgressStyle = useAnimatedStyle(() => ({
        width: `${animatedProgress.value * 100}%`,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>PROGRESO PROTOCOLOS</Text>
                <Text style={styles.count}>{completed}/{total}</Text>
            </View>

            <View style={styles.track}>
                <Animated.View
                    style={[
                        styles.progress,
                        isComplete ? styles.completeGlow : {},
                        animatedProgressStyle
                    ]}
                >
                    <LinearGradient
                        colors={isComplete ? ['#22C55E', '#4ADE80'] : ['#3B82F6', '#60A5FA']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    />
                </Animated.View>
            </View>

            {isComplete && (
                <Text style={styles.victoryText}>OBJETIVO CUMPLIDO 🔥</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 6,
    },
    label: {
        fontSize: 9,
        fontWeight: '900',
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: 1.5,
    },
    count: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
        opacity: 0.6,
    },
    track: {
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        borderRadius: 2,
    },
    gradient: {
        flex: 1,
    },
    completeGlow: {
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    victoryText: {
        fontSize: 8,
        fontWeight: '900',
        color: '#22C55E',
        marginTop: 4,
        letterSpacing: 2,
        textAlign: 'right',
    }
});
