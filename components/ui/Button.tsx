import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline';
    title: string;
}

export const Button = ({ variant = 'primary', title, className, ...props }: ButtonProps) => {
    const baseStyle = "py-4 rounded-xl items-center justify-center";
    const variants = {
        primary: "bg-magma shadow-lg shadow-magma/40",
        secondary: "bg-smoke border border-white/10",
        outline: "border border-magma bg-transparent",
    };
    const textStyles = {
        primary: "text-white font-bold tracking-widest",
        secondary: "text-white font-medium",
        outline: "text-magma font-bold tracking-widest",
    };

    return (
        <TouchableOpacity className={`${baseStyle} ${variants[variant]} ${className} z-50`} {...props}>
            <Text className={`${textStyles[variant]} text-lg`}>{title}</Text>
        </TouchableOpacity>
    );
};
