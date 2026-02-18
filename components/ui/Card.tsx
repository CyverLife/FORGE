import React from 'react';
import { View, ViewProps } from 'react-native';

export const Card = ({ children, className, ...props }: ViewProps) => {
    return (
        <View className={`glass-card p-4 rounded-3xl ${className}`} {...props}>
            {children}
        </View>
    );
};
