import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline';
    title: string;
}

export const Button = ({ variant = 'primary', title, className, ...props }: ButtonProps) => {
    const baseStyle = "py-4 rounded-xl items-center justify-center";
    const variants = {
        primary: "bg-molten-core shadow-lg shadow-molten-core/40",
        secondary: "bg-obsidian-plate/50 border border-white/10",
        outline: "border border-molten-core bg-transparent",
    };
    const textStyles = {
        primary: "text-white font-bold tracking-widest font-display",
        secondary: "text-white font-medium font-body",
        outline: "text-molten-core font-bold tracking-widest font-display",
    };

    return (
        <TouchableOpacity className={`${baseStyle} ${variants[variant]} ${className} z-50`} {...props}>
            <Text className={`${textStyles[variant]} text-lg`}>{title}</Text>
        </TouchableOpacity>
    );
};
