import React from "react"
import { View } from "react-native"
import { Customer } from "../../types/server/class/Customer"
import { Divider, Text, TouchableRipple } from "react-native-paper"
import { IconedText } from "../../components/IconedText"

interface CustomerSuggestionCardProps {
    customer: Customer
    index: number
    onSelect: (customer: Customer) => void
}

export const CustomerSuggestionCard: React.FC<CustomerSuggestionCardProps> = (props) => {
    return (
        <>
            {props.index !== 0 && <Divider bold />}
            <TouchableRipple
                onPress={() => props.onSelect(props.customer)}
                style={{
                    padding: 10,
                    gap: 10,
                }}
            >
                <View>
                    <IconedText variant="titleMedium" icon="card-account-details">
                        {props.customer.name}
                    </IconedText>
                    {props.customer.cnpj && (
                        <IconedText variant="titleSmall" icon="domain">
                            {props.customer.cnpj}
                        </IconedText>
                    )}
                </View>
            </TouchableRipple>
        </>
    )
}
