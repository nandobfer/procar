import { LayoutAnimation } from "react-native"

export const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
}