import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

interface ToastNotificationProps {
    message: string;
    duration?: number;
    onHide?: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
    message,
    duration = 3000,
    onHide,
}) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-50));

    useEffect(() => {
        if (message) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 50, // Move down to visible area
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.timing(slideAnim, {
                            toValue: -50,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                    ]).start(() => onHide?.());
                }, duration);
            });
        }
    }, [message]);

    if (!message) return null;

    return (
        <Animated.View style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
            <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: width * 0.1,
        width: width * 0.8,
        backgroundColor: '#1E1E24', // Dark grey/blue
        borderColor: '#D4AF37', // Gold border
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        zIndex: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    messageText: {
        color: '#F4F4F5',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Ideally use app font
        fontWeight: '600',
        textAlign: 'center',
    },
});
