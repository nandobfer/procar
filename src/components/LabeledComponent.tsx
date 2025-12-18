import React from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"
import { TextInputLabelProp } from "react-native-paper/lib/typescript/components/TextInput/types"

interface LabeledComponentProps {
    label: TextInputLabelProp
    Component: React.ReactNode
    marginBottom?: number
}

export const LabeledComponent: React.FC<LabeledComponentProps> = ({ label, Component, marginBottom }) => {
    return (
        <View style={{ flex: 1 }}>
            <Text variant="bodySmall" style={{ marginLeft: 5, marginBottom }}>
                {label}
            </Text>
            {Component}
        </View>
    )
}
