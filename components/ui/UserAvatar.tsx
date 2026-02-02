import { Frame } from '@/constants/frames';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface UserAvatarProps {
    url?: string | null;
    frame?: Frame | null;
    size?: number;
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ url, frame, size = 96, className = "" }) => {
    const frameSizeMultiplier = 1.15;
    const avatarSize = size * 0.9;

    return (
        <View
            style={{ width: size, height: size }}
            className={`bg-card-black items-center justify-center relative ${className}`}
        >
            {url ? (
                <Image
                    source={{ uri: url }}
                    style={{ width: avatarSize, height: avatarSize }}
                    contentFit="cover"
                />
            ) : (
                <View
                    style={{ width: avatarSize, height: avatarSize }}
                    className="items-center justify-center bg-white/5"
                >
                    <IconSymbol name="person.fill" size={avatarSize * 0.6} color="rgba(255,255,255,0.2)" />
                </View>
            )}

            {/* Frame Overlay */}
            {frame?.image && (
                <Image
                    source={frame.image}
                    style={{
                        position: 'absolute',
                        top: `-${(frameSizeMultiplier - 1) * 50}%`,
                        left: `-${(frameSizeMultiplier - 1) * 50}%`,
                        width: size * frameSizeMultiplier,
                        height: size * frameSizeMultiplier,
                        zIndex: 10
                    }}
                    contentFit="contain"
                />
            )}
        </View>
    );
};
