import React, { useState } from "react"
import { LayoutAnimation, TextStyle, View, ViewStyle } from "react-native"
import { Text, TouchableRipple } from "react-native-paper"

interface ExtendableTextProps {
    text: string
    minLines: number
    textStyle?: TextStyle
    viewStyle?: ViewStyle
    pressableStyle?: ViewStyle
    pressableTextStyle?: TextStyle
}

export const ExtendableText: React.FC<ExtendableTextProps> = (props) => {
    const [extendedText, setExtendedText] = useState(false)

    const extendText = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExtendedText((value) => !value)
    }

    return (
        <View style={[{ position: "relative" }, props.viewStyle]}>
            <Text numberOfLines={!extendedText ? props.minLines : undefined} style={[props.textStyle]}>
                {props.text}
            </Text>
            <TouchableRipple onPress={extendText} style={[{ marginTop: 5, marginLeft: "auto" }, props.pressableStyle]}>
                <Text style={[{ textDecorationLine: "underline" }, props.pressableTextStyle]}>ler {extendedText ? "menos" : "mais"}...</Text>
            </TouchableRipple>
        </View>
    )
}
