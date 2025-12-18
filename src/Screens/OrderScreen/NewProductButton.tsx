import React, { useState } from "react"
import { LayoutAnimation, View } from "react-native"
import { Button } from "react-native-paper"
import { Order } from "../../types/server/class/Order"
import { ProductForm } from "./ProductForm"
import { animate } from "../../tools/animate"

interface NewProductButtonProps {
    order: Order
    onSubmit: () => void
}

export const NewProductButton: React.FC<NewProductButtonProps> = (props) => {
    const [showingForm, setShowingForm] = useState(false)

    const finishSubmit = () => {
        closeForm()
        props.onSubmit()
    }

    const showForm = () => {
        animate()
        setShowingForm(true)
    }

    const closeForm = () => {
        animate()
        setShowingForm(false)
    }

    return showingForm ? (
        <ProductForm order={props.order} onCancel={closeForm} onSubmit={finishSubmit} />
    ) : (
        <Button
            mode="outlined"
            style={[{ borderRadius: 8, borderStyle: "dashed", borderWidth: 2, justifyContent: "center" }]}
            labelStyle={[{ fontSize: 16, paddingVertical: 12 }]}
            onPress={showForm}
        >
            Adicionar produto
        </Button>
    )
}
