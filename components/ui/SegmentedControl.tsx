import React from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface SegmentedControlProps {
    options: string[];
    selectedOption: string;
    onOptionPress: (option: string) => void;
}

export const SegmentedControl = ({ options, selectedOption, onOptionPress }: SegmentedControlProps) => {
    const { width: windowWidth } = useWindowDimensions();
    const containerWidth = windowWidth - 32; // Padding
    const segmentWidth = containerWidth / options.length;

    const selectedIndex = options.indexOf(selectedOption);

    const rStyle = useAnimatedStyle(() => {
        return {
            left: withSpring(selectedIndex * segmentWidth, {
                damping: 20,
                stiffness: 150,
            }),
        };
    }, [selectedIndex, segmentWidth]);

    return (
        <View
            className="h-10 bg-white/5 rounded-xl flex-row items-center border border-white/5 overflow-hidden mb-6"
            style={{ width: containerWidth }}
        >
            {/* Sliding Indicator */}
            <Animated.View
                style={[
                    {
                        width: segmentWidth - 4,
                        height: '80%',
                        position: 'absolute',
                        top: '10%',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 10,
                        marginHorizontal: 2 // Tiny fix for alignment
                    },
                    rStyle
                ]}
            />

            {options.map((option) => {
                const isSelected = option === selectedOption;
                return (
                    <Pressable
                        key={option}
                        style={{ width: segmentWidth }}
                        className="h-full justify-center items-center"
                        onPress={() => onOptionPress(option)}
                    >
                        <Text className={`text-[11px] font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                            {option}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};
