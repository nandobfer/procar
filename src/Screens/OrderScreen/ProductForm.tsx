import React from "react"
import { View } from "react-native"
import * as Yup from "yup"
import { Item } from "../../types/server/class/Item"
import { Order } from "../../types/server/class/Order"
import { useFormik } from "formik"
import { uid } from "uid"
import { api } from "../../backend/api"
import { FormText } from "../../components/FormText"
import { currencyMask } from "../../tools/currencyMask"
import { handleCurrencyInput } from "../../tools/handleCurrencyInput"
import { Button, Text } from "react-native-paper"

interface ProductFormProps {
    order: Order
    product?: Item
    onSubmit: () => void
    onCancel: () => void
}

const validation = Yup.object().shape({
    description: Yup.string().required("A discriminação é obrigatória"),
    quantity: Yup.number().min(1, "A quantidade mínima é 1").required("A quantidade é obrigatória").typeError("A quantidade deve ser um número"),
    unit_price: Yup.number().min(0, "O preço mínimo é 0").required("O preço unitário é obrigatório").typeError("O preço unitário deve ser um número"),
})

export const ProductForm: React.FC<ProductFormProps> = (props) => {
    const initialProduct = props.product
    const order_id = props.order.id as string
    const formik = useFormik<Item>({
        initialValues: initialProduct || { description: "", quantity: 0, unit_price: 0, id: "" },
        async onSubmit(values, formikHelpers) {
            const productToAdd: Item = {
                ...values,
                id: initialProduct?.id || uid(),
            }
            try {
                const response = initialProduct
                    ? await api.put("/order/item", productToAdd, { params: { order_id, product_id: initialProduct.id } })
                    : await api.post<Order>("/order/item", productToAdd, { params: { order_id } })
                console.log(response.data)
                props.onSubmit()
            } catch (error) {
                console.log(error)
            }
        },
        validationSchema: validation,
    })

    return (
        <View style={[{ flex: 1, gap: 10 }]}>
            <FormText label="Discriminação" formik={formik} name="description" placeholder="Nome ou descrição do produto ou serviço" />

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <FormText label={"Quantidade"} name="quantity" formik={formik} flex={1} keyboardType="numeric" placeholder="Mínimo de 1 unidade" />
                <FormText
                    label={"Preço unitário"}
                    name="unit_price"
                    formik={formik}
                    flex={1}
                    keyboardType="numeric"
                    value={currencyMask(formik.values.unit_price)}
                    onChangeText={(text) => formik.setFieldValue("unit_price", handleCurrencyInput(text))}
                    onSubmitEditing={() => formik.handleSubmit()}
                    returnKeyType="done"
                />
            </View>

            <Text style={[{ alignSelf: "flex-end" }]}>Subtotal: {currencyMask(formik.values.quantity * formik.values.unit_price)}</Text>

            <View style={[{ flexDirection: "row", alignSelf: "flex-end", gap: 10 }]}>
                <Button onPress={props.onCancel} disabled={formik.isSubmitting}>
                    Cancelar
                </Button>
                <Button mode="contained" onPress={() => formik.handleSubmit()} loading={formik.isSubmitting} disabled={formik.isSubmitting}>
                    Salvar
                </Button>
            </View>
        </View>
    )
}
