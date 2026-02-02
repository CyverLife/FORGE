import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ONBOARDING_CARDS = [
    {
        title: 'FORJA TU\nDESTINO',
        description: 'Cada hábito que completas te transforma. De la roca sin cincelar al monumento forjado.',
        icon: 'flame.fill',
        color: '#F97316',
    },
    {
        title: 'PROTOCOLOS\nDIARIOS',
        description: 'Crea rutinas inquebrantables. Cada protocolo fortalece un atributo: Hierro, Fuego, Acero o Foco.',
        icon: 'list.bullet',
        color: '#EF4444',
    },
    {
        title: 'TU TOTEM\nEVOLUCIONA',
        description: 'Observa tu progreso visual. Tu totem crece contigo, reflejando tu transformación.',
        icon: 'eye',
        color: '#22C55E',
    },
    {
        title: 'MANTÉN\nEL CALOR',
        description: 'Cada día consecutivo aumenta tu racha. La consistencia es tu arma más poderosa.',
        icon: 'bolt.fill',
        color: '#FACC15',
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentCard = ONBOARDING_CARDS[currentIndex];
    const isLastCard = currentIndex === ONBOARDING_CARDS.length - 1;

    const handleNext = () => {
        if (isLastCard) {
            router.replace('/login');
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleSkip = () => {
        router.replace('/login');
    };

    return (
        <SafeAreaView className="flex-1 bg-deep-black">
            {/* Premium Grid Background */}
            <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                {/* Vertical Lines */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <View
                        key={`v-${i}`}
                        style={{
                            position: 'absolute',
                            left: `${(i + 1) * 12.5}%`,
                            top: 0,
                            bottom: 0,
                            width: 1,
                            backgroundColor: 'rgba(255,255,255,0.03)'
                        }}
                    />
                ))}
                {/* Horizontal Lines */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <View
                        key={`h-${i}`}
                        style={{
                            position: 'absolute',
                            top: `${(i + 1) * 8.33}%`,
                            left: 0,
                            right: 0,
                            height: 1,
                            backgroundColor: 'rgba(255,255,255,0.03)'
                        }}
                    />
                ))}
            </View>

            {/* Skip Button */}
            <View className="absolute top-12 right-6 z-10">
                <TouchableOpacity onPress={handleSkip} className="active:scale-97">
                    <Text className="text-text-secondary text-sm font-bold uppercase tracking-wider">
                        SALTAR
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Card Content */}
            <View className="flex-1 justify-center items-center px-8">
                <Animated.View
                    key={currentIndex}
                    entering={FadeInRight.springify()}
                    exiting={FadeOutLeft.springify()}
                    className="items-center"
                >
                    {/* Icon */}
                    <View
                        className="w-32 h-32 rounded-premium items-center justify-center mb-8"
                        style={{ backgroundColor: `${currentCard.color}15` }}
                    >
                        <IconSymbol name={currentCard.icon as any} size={64} color={currentCard.color} />
                    </View>

                    {/* Title */}
                    <Text
                        className="text-text-primary font-black text-4xl text-center mb-6 font-display leading-tight"
                        style={{ letterSpacing: 2 }}
                    >
                        {currentCard.title}
                    </Text>

                    {/* Description */}
                    <Text className="text-text-secondary text-center text-lg leading-relaxed max-w-sm">
                        {currentCard.description}
                    </Text>
                </Animated.View>
            </View>

            {/* Bottom Section */}
            <View className="px-8 pb-8">
                {/* Progress Dots */}
                <View className="flex-row justify-center gap-2 mb-8">
                    {ONBOARDING_CARDS.map((_, index) => (
                        <View
                            key={index}
                            className="h-2 rounded-full"
                            style={{
                                width: index === currentIndex ? 24 : 8,
                                backgroundColor: index === currentIndex ? '#F97316' : '#2A2A2A',
                            }}
                        />
                    ))}
                </View>

                {/* CTA Button */}
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-forge-orange py-4 rounded-premium active:scale-97"
                    style={{ elevation: 8, shadowColor: '#F97316', shadowOpacity: 0.3, shadowRadius: 12 }}
                >
                    <Text className="text-deep-black font-black text-center text-lg uppercase tracking-widest">
                        {isLastCard ? 'COMENZAR MI TRANSFORMACIÓN' : 'SIGUIENTE'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
