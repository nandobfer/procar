import React from "react"
import { View } from "react-native"
import { Divider, Text, TouchableRipple } from "react-native-paper"
import { IconedText } from "../../components/IconedText"
import { Item } from "../../types/server/class/Item"
import { currencyMask } from "../../tools/currencyMask"

interface ProductSuggestionCardProps {
    product: Item
    index: number
    onSelect: (product: Item) => void
}

export const ProductSuggestionCard: React.FC<ProductSuggestionCardProps> = (props) => {
    return (
        <>
            {props.index !== 0 && <Divider bold />}
            <TouchableRipple
                onPress={() => props.onSelect(props.product)}
                style={{
                    padding: 10,
                    gap: 10,
                }}
            >
                <View>
                    <IconedText variant="titleMedium" icon="cube-outline">
                        {props.product.description}
                    </IconedText>

                    <IconedText variant="titleSmall" icon="cash">
                        {currencyMask(props.product.unit_price)}
                    </IconedText>
                </View>
            </TouchableRipple>
        </>
    )
}
