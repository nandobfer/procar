import React, { useRef } from "react"
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
import { Button, Text, TextInput } from "react-native-paper"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import { TextInput as NativeInput } from "react-native"
import { ProductsSuggestions } from "../ProductsScreen/ProductsSuggestions"

interface ProductFormProps {
    order?: Order
    product?: Item
    onSubmit: (item: Item) => void
    onCancel: () => void
}

const validation = Yup.object().shape({
    description: Yup.string().required("A discriminação é obrigatória"),
    quantity: Yup.number().min(1, "A quantidade mínima é 1").required("A quantidade é obrigatória").typeError("A quantidade deve ser um número"),
    unit_price: Yup.number().min(0, "O preço mínimo é 0").required("O preço unitário é obrigatório").typeError("O preço unitário deve ser um número"),
})

export const ProductForm: React.FC<ProductFormProps> = (props) => {
    const productNameRef = useRef<NativeInput>(null)
    const initialProduct = props.product
    const order_id = props.order?.id
    const formik = useFormik<Item>({
        initialValues: initialProduct || { description: "", quantity: 1, unit_price: 0, id: "" },
        async onSubmit(values, formikHelpers) {
            const productToAdd: Item = {
                ...values,
                id: values.id || uid(),
            }
            try {
                const response = initialProduct
                    ? await api.put("/order/item", productToAdd, { params: { order_id, product_id: initialProduct.id } })
                    : await api.post<Order>("/order/item", productToAdd, { params: { order_id } })
                props.onSubmit(response.data)
            } catch (error) {
                console.log(error)
            }
        },
        validationSchema: validation,
    })

    const [debouncedProductDescription] = useDebounce(formik.values.description, 300)

    const { data: products, isFetching: isFetchingProducts } = useQuery<Item[]>({
        initialData: [],
        queryKey: ["items", debouncedProductDescription],
        queryFn: async () => {
            if (!debouncedProductDescription.trim()) return []

            const response = await api.get<Item[]>("/order/item", {
                params: { query: debouncedProductDescription },
            })
            return response.data
        },
        enabled: !formik.values.id && debouncedProductDescription.trim().length > 0,
    })

    const onSelectProductSuggestion = (product: Item) => {
        formik.setFieldValue("id", product.id)
        formik.setFieldValue("description", product.description)
        formik.setFieldValue("unit_price", product.unit_price)
        productNameRef.current?.blur()
    }

    const clearSuggestions = () => {
        formik.setFieldValue("id", "")
        formik.setFieldValue("description", "")
        formik.setFieldValue("unit_price", "")
    }

    return (
        <View style={[{ flex: 1, gap: 10 }]}>
            <View style={{ position: "relative" }}>
                <FormText
                    label="Discriminação"
                    ref={productNameRef}
                    formik={formik}
                    name="description"
                    placeholder="Nome ou descrição do produto ou serviço"
                    onSubmitEditing={() => productNameRef.current?.blur()}
                    right={formik.values.id ? <TextInput.Icon onPress={clearSuggestions} icon={"close"} /> : undefined}
                />
                {productNameRef.current?.isFocused() && !formik.values.id && (
                    <ProductsSuggestions products={products} loading={isFetchingProducts} onSelect={onSelectProductSuggestion} />
                )}
            </View>

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                {props.order && (
                    <FormText
                        label={"Quantidade"}
                        name="quantity"
                        formik={formik}
                        flex={1}
                        keyboardType="numeric"
                        placeholder="Mínimo de 1 unidade"
                    />
                )}
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

            {props.order && (
                <Text style={[{ alignSelf: "flex-end" }]}>Subtotal: {currencyMask(formik.values.quantity * formik.values.unit_price)}</Text>
            )}

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
