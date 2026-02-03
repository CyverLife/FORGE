import { Canvas, Image, Mask, Path, Skia, useImage } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import { View } from "react-native";

interface HexagonBadgeProps {
    imageSource: any;
    size: number;
    color?: string;
    locked?: boolean;
}

export const HexagonBadge: React.FC<HexagonBadgeProps> = ({
    imageSource,
    size,
    color = "#F97316",
    locked = false
}) => {
    const image = useImage(imageSource);

    // Calculate Hexagon Path
    const path = useMemo(() => {
        const p = Skia.Path.Make();
        const radius = size / 2;
        const center = size / 2;

        for (let i = 0; i < 6; i++) {
            const angle = (i * 60 - 30) * (Math.PI / 180);
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
        <Canvas style={{ width: size, height: size, opacity: locked ? 0.3 : 1 }}>
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
            <Path
                path={path}
                style="stroke"
                strokeWidth={2}
                color={color}
            />
        </Canvas>
    );
};
