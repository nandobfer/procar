import React, { useCallback, useEffect, useRef, useState } from "react"
import { Pressable, ScrollView, View } from "react-native"
import { SelectComponent } from "../../components/SelectComponent"
import { useFormik } from "formik"
import { Order, OrderForm, OrderType } from "../../types/server/class/Order"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { FormText } from "../../components/FormText"
import { Button, Text, TextInput } from "react-native-paper"
import DatePicker from "react-native-date-picker"
import { estados } from "../../tools/estadosBrasil"
import { StackNavigation, StackRoute } from "../../Routes"
import { Customer } from "../../types/server/class/Customer"
import { useDebounce } from "use-debounce"
import { CustomerSuggestions } from "./CustomerSuggestions"
import { TextInput as NativeInput } from "react-native"
import * as yup from "yup"
import { useFocusEffect } from "@react-navigation/native"

interface OrderFormScreenProps {
    navigation: StackNavigation
    route: StackRoute
}

const orderTypes: { value: OrderType; label: string }[] = [
    { label: "Orçamento", value: "budget" },
    { label: "Pedido", value: "order" },
]

const initialCustomer: Customer = { id: "", name: "" }

const validation = yup.object().shape({
    number: yup.number().required("O número do pedido é obrigatório").typeError("O número do pedido deve ser um número"),
    type: yup.mixed<OrderType>().oneOf(["budget", "order"]).required("O tipo é obrigatório"),
    customer: yup.object().shape({
        name: yup.string().required("O nome fantasia é obrigatório"),
    }),
})

export const OrderFormScreen: React.FC<OrderFormScreenProps> = ({ navigation, route }) => {
    const customerNameRef = useRef<NativeInput>(null)
    const [selectDate, setSelectDate] = useState<"order_date" | "delivery_date_from" | "delivery_date_to" | null>(null)
    const [posting, setPosting] = useState(false)

    const initialOrder = route.params?.order

    const {
        data: nextAvailableNumber,
        isFetching: isFetchingNextAvailableNumber,
        refetch: refetchNumber,
    } = useQuery<number>({
        initialData: initialOrder ? Number(initialOrder.number) : 0,
        queryKey: ["nextNumber", initialOrder],
        queryFn: async () => (await api.get("/order/next-available-number")).data,
        enabled: !initialOrder,
    })

    const formik = useFormik<OrderForm>({
        initialValues: initialOrder || {
            type: "budget",
            number: nextAvailableNumber.toString(),
            items: [],
            customer: initialCustomer,
            order_date: Date.now(),
        },
        async onSubmit(values, formikHelpers) {
            if (posting) return
            setPosting(true)
            try {
                if (values.number !== initialOrder?.number) {
                    const response = await api.get<boolean>("/order/validate-number", { params: { number: values.number } })
                    if (!response.data) {
                        formikHelpers.setFieldError("number", "Número do pedido já está em uso")
                        setPosting(false)
                        return
                    }
                }

                const response = initialOrder
                    ? await api.put<Order>(`/order`, values, { params: { order_id: initialOrder.id } })
                    : await api.post<Order>("/order", values)
                navigation.navigate("Home")
                setTimeout(() => navigation.navigate("Order", { order: response.data }), 500)
            } catch (error) {
                console.log(error)
            } finally {
                setPosting(false)
            }
        },
        validationSchema: validation,
    })

    const [debouncedCustomerName] = useDebounce(formik.values.customer.name, 300)

    const { data: customers, isFetching: isFetchingCustomers } = useQuery<Customer[]>({
        initialData: [],
        queryKey: ["customers", debouncedCustomerName],
        queryFn: async () => {
            if (!debouncedCustomerName.trim()) return []

            const response = await api.get<Customer[]>("/order/query-customer", {
                params: { query: debouncedCustomerName },
            })
            return response.data
        },
        enabled: !formik.values.customer.id && debouncedCustomerName.trim().length > 0,
    })

    const onSelectCustomerSuggestion = (customer: Customer) => {
        formik.setFieldValue("customer", customer)
        customerNameRef.current?.blur()
    }

    useFocusEffect(
        useCallback(() => {
            if (!initialOrder) refetchNumber()
        }, [initialOrder])
    )

    useEffect(() => {
        formik.setFieldValue("number", nextAvailableNumber.toString())
    }, [nextAvailableNumber])

    return (
        <ScrollView style={[{ flex: 1 }]} contentContainerStyle={[{ padding: 20, gap: 10 }]} keyboardShouldPersistTaps="handled">
            <FormText label="Número" formik={formik} name="number" keyboardType="numeric" flex={1} left={<TextInput.Icon icon={"pound"} />} />
            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <SelectComponent label="Tipo" flex={1} data={orderTypes} formik={formik} name="type" />
                <Pressable onPress={() => setSelectDate("order_date")} style={{ flex: 1 }}>
                    <FormText
                        label={"Data do pedido"}
                        name="order_date"
                        formik={formik}
                        readOnly
                        flex={1}
                        right={<TextInput.Icon icon={"calendar-range"} pointerEvents="none" />}
                        value={formik.values.order_date ? new Date(Number(formik.values.order_date)).toLocaleDateString("pt-br") : ""}
                    />
                </Pressable>
            </View>

            <View style={{ position: "relative" }}>
                <FormText
                    ref={customerNameRef}
                    label="Nome fantasia"
                    formik={formik}
                    name="customer.name"
                    onSubmitEditing={() => customerNameRef.current?.blur()}
                    right={
                        formik.values.customer.id ? (
                            <TextInput.Icon onPress={() => formik.setFieldValue("customer", initialCustomer)} icon={"close"} />
                        ) : undefined
                    }
                />
                {customerNameRef.current?.isFocused() && !formik.values.customer.id && (
                    <CustomerSuggestions customers={customers} loading={isFetchingCustomers} onSelect={onSelectCustomerSuggestion} />
                )}
            </View>
            <FormText label="Razão social" formik={formik} name="customer.company_name" />

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <FormText label={"CNPJ"} name="customer.cnpj" formik={formik} flex={1} mask="99.999.999/9999-99" keyboardType="numeric" />
                <FormText label={"Inscrição estadual"} name="customer.state_registration" formik={formik} flex={1} keyboardType="numeric" />
            </View>

            <FormText label="Endereço" formik={formik} name="customer.street" />
            <FormText label="Bairro" formik={formik} name="customer.neighborhood" />

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <FormText label={"Cidade"} name="customer.city" formik={formik} flex={1} />
                <SelectComponent
                    label="Estado"
                    flex={1}
                    data={estados}
                    formik={formik}
                    name="customer.state"
                    search
                    searchPlaceholder="Digite para filtrar"
                    placeholder="Selecione"
                />
            </View>

            <FormText label="Telefone" formik={formik} name="customer.phone" mask="(99) 9 9999-9999" keyboardType="phone-pad" />
            <FormText label="Condições de pagamento" formik={formik} name="payment_terms" />

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <Pressable onPress={() => setSelectDate("delivery_date_from")} style={{ flex: 1 }}>
                    <FormText
                        label={"Entrega a partir de"}
                        name="delivery_date.from"
                        formik={formik}
                        readOnly
                        flex={1}
                        right={<TextInput.Icon icon={"calendar-range"} pointerEvents="none" />}
                        value={formik.values.delivery_date?.from ? new Date(formik.values.delivery_date.from).toLocaleDateString("pt-br") : ""}
                    />
                </Pressable>
                <Pressable onPress={() => setSelectDate("delivery_date_to")} style={{ flex: 1 }}>
                    <FormText
                        label={"Entrega até"}
                        name="delivery_date.to"
                        formik={formik}
                        readOnly
                        flex={1}
                        right={<TextInput.Icon icon={"calendar-range"} pointerEvents="none" />}
                        value={formik.values.delivery_date?.to ? new Date(formik.values.delivery_date.to).toLocaleDateString("pt-br") : ""}
                    />
                </Pressable>
            </View>

            <FormText label="Observações" formik={formik} name="observations" multiline numberOfLines={4} textAlignVertical="top" />

            <Button
                mode="contained"
                onPress={() => formik.handleSubmit()}
                loading={posting}
                disabled={isFetchingNextAvailableNumber || posting}
                style={{ marginTop: 20 }}
            >
                Salvar
            </Button>

            <DatePicker
                modal
                open={!!selectDate}
                date={
                    selectDate === "order_date"
                        ? new Date(formik.values.order_date)
                        : selectDate === "delivery_date_from"
                        ? new Date(formik.values.delivery_date?.from || Date.now())
                        : new Date(formik.values.delivery_date?.to || Date.now())
                }
                onConfirm={(date) => {
                    formik.setFieldValue(
                        selectDate === "delivery_date_from"
                            ? "delivery_date.from"
                            : selectDate === "delivery_date_to"
                            ? "delivery_date.to"
                            : "order_date",
                        date.getTime()
                    )
                    setSelectDate(null)
                }}
                onCancel={() => setSelectDate(null)}
                mode="date"
                locale="pt-BR"
                title={"Data do pedido"}
                cancelText="Cancelar"
                confirmText="Confirmar"
                theme="light"
            />
        </ScrollView>
    )
}
