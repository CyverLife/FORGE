import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card = ({ children, className, ...props }: ViewProps) => {
    return (
        <View className={`bg-smoke border border-white/5 rounded-2xl p-4 ${className}`} {...props}>
            {children}
        </View>
    );
};
