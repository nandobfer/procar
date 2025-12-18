import React from "react"
import { Image, ImageStyle } from "expo-image"
import { ColorValue } from "react-native"

interface LogoProps {
    size?: number
    tintColor?: ColorValue
    style?: ImageStyle
    contentFit?: "contain" | "cover" | "fill"
}

export const Logo: React.FC<LogoProps> = ({ size = 200, tintColor = "white", style, contentFit }) => {
    return (
        <Image
            source={require("../../assets/logo.webp")}
            style={[{ width: size, height: size, tintColor: tintColor }, style]}
            contentFit={contentFit}
        />
    )
}
