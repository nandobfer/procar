import React from "react"
import { View } from "react-native"
import { Portal, ProgressBar, Surface, Text, useTheme } from "react-native-paper"
import { Item } from "../../types/server/class/Item"
import { ProductSuggestionCard } from "./ProductSuggestionCard"

interface ProductsSuggestionsProps {
    products: Item[]
    loading: boolean
    onSelect: (product: Item) => void
    anchorPosition?: { top: number; left: number; width: number }
}

export const ProductsSuggestions: React.FC<ProductsSuggestionsProps> = (props) => {
    const theme = useTheme()

    const content = (
        <Surface
            style={{
                position: "absolute",
                top: props.anchorPosition ? props.anchorPosition.top : 70,
                left: props.anchorPosition?.left,
                width: props.anchorPosition?.width || "100%",
                backgroundColor: theme.colors.elevation.level5,
                borderRadius: 8,
                paddingVertical: 10,
                zIndex: 9999,
                elevation: 24,
            }}
        >
            <View
                style={{
                    borderTopWidth: 0,
                    width: 0,
                    height: 0,
                    position: "absolute",
                    left: 15,
                    top: -10,
                    borderBottomColor: theme.colors.elevation.level5,
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderBottomWidth: 10,
                    borderRightWidth: 10,
                    borderLeftWidth: 10,
                }}
            />
            {!props.loading && props.products.length === 0 && <Text style={[{ paddingHorizontal: 10, paddingVertical: 5 }]}>Digite para buscar</Text>}
            {props.loading && <ProgressBar indeterminate color={theme.colors.primary} />}
            {props.products.map((item, index) => (
                <ProductSuggestionCard key={item.id} product={item} index={index} onSelect={props.onSelect} />
            ))}
        </Surface>
    )

    // Use Portal to render outside FlatList's stacking context
    return props.anchorPosition ? <Portal>{content}</Portal> : content
}
