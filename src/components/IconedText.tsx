import React from "react"
import { View } from "react-native"
import { Icon, Text, TextProps } from "react-native-paper"

interface IconedTextProps extends TextProps<never> {
    size?: number
    icon: string
}

export const IconedText: React.FC<IconedTextProps> = ({ size = 20, ...props }) => {

    return (
        <View style={[{ flexDirection: "row", gap: 5, alignItems: "center" }]}>
            <Icon size={size} source={props.icon} />
            <Text {...props} />
        </View>
    )
}
