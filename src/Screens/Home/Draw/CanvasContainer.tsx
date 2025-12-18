import React, { useEffect, useState } from "react"
import { ColorValue, Dimensions, GestureResponderEvent, Platform, View } from "react-native"
import { StackNavigation } from "../../../Routes"
import { Path, Rect, Svg } from "react-native-svg"
import { useDraw } from "../../../hooks/useDraw"

interface CanvasContainerProps {
    draw: ReturnType<typeof useDraw>
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ draw }) => {
    const { height, width } = Dimensions.get("window")
    const imageHeight = height * 0.7
    const imageWidth = width * 0.9


    return (
        <View style={{ position: "relative" }}>
            <Svg onTouchMove={draw.onTouchMove} onTouchEnd={draw.onTouchEnd}>
                {Platform.OS == "ios" && <Rect width={imageWidth} height={imageHeight} fill={"white"} />}
                {draw.paths.length > 0 &&
                    draw.paths.map((item, index) => (
                        <Path
                            key={`path-${index}`}
                            d={item.path.join("")}
                            stroke={item.color}
                            fill={"transparent"}
                            strokeWidth={item.stroke}
                            strokeLinejoin={"round"}
                            strokeLinecap={"round"}
                            strokeOpacity={1}
                        />
                    ))}
                <Path
                    d={draw.currentPath.join("")}
                    stroke={draw.updateColor}
                    fill={"transparent"}
                    strokeWidth={draw.stroke}
                    strokeLinejoin={"round"}
                    strokeLinecap={"round"}
                    strokeOpacity={1}
                />
            </Svg>
        </View>
    )
}
