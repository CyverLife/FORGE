import { Canvas, Image, Mask, Path, Skia, useImage } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View } from "react-native";

interface SkiaHexagonAvatarProps {
    url?: string | null;
    size: number;
    borderColor?: string;
    borderWidth?: number;
}

export const SkiaHexagonAvatar: React.FC<SkiaHexagonAvatarProps> = ({
    url,
    size,
    borderColor = "#F97316",
    borderWidth = 2
}) => {
    const defaultAvatar = require('@/assets/images/icon.png'); // Fallback
    const image = useImage(url || defaultAvatar);

    // Calculate Hexagon Path
    const path = useMemo(() => {
        const p = Skia.Path.Make();
        const radius = size / 2;
        const center = size / 2;

        for (let i = 0; i < 6; i++) {
            const angle = (i * 60 - 30) * (Math.PI / 180); // Rotate to point up
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            if (i === 0) p.moveTo(x, y);
            else p.lineTo(x, y);
        }
        p.close();
        return p;
    }, [size]);

    if (!image) {
        return <View style={{ width: size, height: size }} />;
    }

    return (
        <Canvas style={{ width: size, height: size }}>
            <Mask
                mask={<Path path={path} color="white" />}
            >
                <Image
                    image={image}
                    x={0}
                    y={0}
                    width={size}
                    height={size}
                    fit="cover"
                />
            </Mask>
            {/* Stroke Border */}
            <Path
                path={path}
                style="stroke"
                strokeWidth={borderWidth}
                color={borderColor}
            />
        </Canvas>
    );
};
