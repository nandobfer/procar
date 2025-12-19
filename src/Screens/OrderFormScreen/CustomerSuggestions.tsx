import React from "react"
import { View } from "react-native"
import { ProgressBar, Surface, Text, useTheme } from "react-native-paper"
import { Customer } from "../../types/server/class/Customer"
import { CustomerSuggestionCard } from "./CustomerSuggestionCard"

interface CustomerSuggestionsProps {
    customers: Customer[]
    loading: boolean
    onSelect: (customer: Customer) => void
}

export const CustomerSuggestions: React.FC<CustomerSuggestionsProps> = (props) => {
    const theme = useTheme()

    return (
        <Surface
            style={{
                position: "absolute",
                top: 70,
                width: "100%",
                backgroundColor: theme.colors.elevation.level5,
                borderRadius: 8,
                paddingVertical: 10,
                zIndex: 90,
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
            {!props.loading && props.customers.length === 0 && (
                <Text style={[{ paddingHorizontal: 10, paddingVertical: 5 }]}>Digite para buscar</Text>
            )}
            {props.loading && <ProgressBar indeterminate color={theme.colors.primary} />}
            {props.customers.map((item, index) => (
                <CustomerSuggestionCard key={item.id} customer={item} index={index} onSelect={props.onSelect} />
            ))}
        </Surface>
    )
}
