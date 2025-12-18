import React from "react"
import { DimensionValue, View } from "react-native"
import { Surface, useTheme } from "react-native-paper"

export interface TrianguloMiseravelProps {
    color?: string
    top?: DimensionValue
    left?: DimensionValue
    right?: DimensionValue
    bottom?: DimensionValue
}

export const TrianguloMiseravel: React.FC<TrianguloMiseravelProps> = (props) => {
    const theme = useTheme()
    return (
        <View
            style={{
                borderTopWidth: 0,
                width: 0,
                height: 0,
                position: "absolute",
                right: props.right || 15,
                top: props.top || -10,
                left: props.left || undefined,
                bottom: props.bottom || undefined,
                borderBottomColor: props.color || theme.colors.elevation.level2,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomWidth: 10,
                borderRightWidth: 10,
                borderLeftWidth: 10,
            }}
        ></View>
    )
}
