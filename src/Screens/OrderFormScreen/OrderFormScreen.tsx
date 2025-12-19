import React, { useCallback, useEffect, useRef, useState } from "react"
import { Pressable, ScrollView, View } from "react-native"
import { SelectComponent } from "../../components/SelectComponent"
import { useFormik } from "formik"
import { Order, OrderForm } from "../../types/server/class/Order"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { FormText } from "../../components/FormText"
import { Button, ProgressBar, Text, TextInput } from "react-native-paper"
import DatePicker from "react-native-date-picker"
import { estados } from "../../tools/estadosBrasil"
import { StackNavigation, StackRoute } from "../../Routes"
import { Customer } from "../../types/server/class/Customer"
import { useDebounce } from "use-debounce"
import { CustomerSuggestions } from "./CustomerSuggestions"
import { TextInput as NativeInput } from "react-native"
import * as yup from "yup"
import { useFocusEffect } from "@react-navigation/native"
import { searchCep } from "../../tools/searchCep"
import { currencyMask } from "../../tools/currencyMask"
import { handleCurrencyInput } from "../../tools/handleCurrencyInput"

interface OrderFormScreenProps {
    navigation: StackNavigation
    route: StackRoute
}

const initialCustomer: Customer = { id: "", name: "" }

const validation = yup.object().shape({
    number: yup.number().required("O número do pedido é obrigatório").typeError("O número do pedido deve ser um número"),
    customer: yup.object().shape({
        name: yup.string().required("O nome fantasia é obrigatório"),
        email: yup.string().email("E-mail inválido"),
    }),
})

export const OrderFormScreen: React.FC<OrderFormScreenProps> = ({ navigation, route }) => {
    const customerNameRef = useRef<NativeInput>(null)
    const [selectDate, setSelectDate] = useState<"order_date" | "validity" | null>(null)
    const [posting, setPosting] = useState(false)
    const [documentMask, setdocumentMask] = useState<string>()
    const [searchingCep, setSearchingCep] = useState(false)

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
            number: nextAvailableNumber.toString(),
            items: [],
            customer: initialCustomer,
            order_date: Date.now(),
            additional_charges: 0,
            discount: 0,
            notes: "",
            payment_terms: "",
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

                values.discount = Number(values.discount)
                values.additional_charges = Number(values.additional_charges)
                console.log(values)

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

    const isCPF = (value: string) => {
        if (value.length < 15) {
            setdocumentMask("999.999.999-99")
            formik.setFieldValue("is_physical_person", true)
        } else {
            setdocumentMask("99.999.999/9999-99")
            formik.setFieldValue("is_physical_person", false)
        }
        formik.setFieldValue("customer.cpf_cnpj", value)
    }

    const handleCepSearch = async (cep: string) => {
        if (searchingCep || !(cep.length === 10)) return
        setSearchingCep(true)

        try {
            const result = await searchCep(cep)
            if (result) {
                formik.setFieldValue("customer.address", result.street)
                formik.setFieldValue("customer.neighborhood", result.neighborhood)
                formik.setFieldValue("customer.city", result.city)
                const uf = estados.find((item) => item.value.toLowerCase() === result?.state.toLowerCase())?.value
                if (uf) {
                    formik.setFieldValue("customer.state", uf)
                }
            }
        } catch (error) {
            console.log(error)
            formik.setFieldError("customer.cep", "Cep inválido")
        } finally {
            setTimeout(() => setSearchingCep(false), 200)
        }
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
                <Pressable onPress={() => setSelectDate("validity")} style={{ flex: 1 }}>
                    <FormText
                        label={"Valido até"}
                        name="validity"
                        formik={formik}
                        readOnly
                        flex={1}
                        right={<TextInput.Icon icon={"calendar-range"} pointerEvents="none" />}
                        value={formik.values.validity ? new Date(Number(formik.values.validity)).toLocaleDateString("pt-br") : ""}
                    />
                </Pressable>
            </View>

            <View style={{ position: "relative" }}>
                <FormText
                    ref={customerNameRef}
                    label="Nome"
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

            <FormText label="E-mail" formik={formik} name="customer.email" keyboardType="email-address" />

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <FormText
                    label={"CPF / CNPJ"}
                    name="customer.cpf_cnpj"
                    formik={formik}
                    flex={1}
                    keyboardType="numeric"
                    mask={documentMask}
                    onChangeText={(value) => isCPF(value)}
                />
                <FormText label={"RG / Inscrição estadual"} name="customer.rg_ie" formik={formik} flex={1} keyboardType="numeric" />
            </View>

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <FormText label="Telefone" flex={1} formik={formik} name="customer.phone" mask="(99) 9 9999-9999" keyboardType="phone-pad" />
                <FormText
                    label="CEP"
                    flex={1}
                    formik={formik}
                    name="customer.cep"
                    mask="999.99-999"
                    keyboardType="numeric"
                    afterChangeText={handleCepSearch}
                    disabled={searchingCep}
                />
            </View>

            {searchingCep && <ProgressBar indeterminate style={{ marginVertical: 5 }} />}

            <FormText label="Endereço" formik={formik} name="customer.address" disabled={searchingCep} />
            <FormText label="Bairro" formik={formik} name="customer.neighborhood" disabled={searchingCep} />

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <FormText label={"Cidade"} name="customer.city" formik={formik} flex={1} disabled={searchingCep} />
                <SelectComponent
                    label="Estado"
                    flex={1}
                    data={estados}
                    formik={formik}
                    name="customer.state"
                    search
                    searchPlaceholder="Digite para filtrar"
                    placeholder="Selecione"
                    disabled={searchingCep}
                />
            </View>

            <FormText label="Condições de pagamento" formik={formik} name="payment_terms" />

            <View style={[{ flexDirection: "row", gap: 10 }]}>
                <FormText
                    label={"Desconto"}
                    name="discount"
                    formik={formik}
                    flex={1}
                    keyboardType="numeric"
                    value={currencyMask(formik.values.discount)}
                    onChangeText={(text) => formik.setFieldValue("discount", handleCurrencyInput(text))}
                />
                <FormText
                    label={"Acréscimos"}
                    name="additional_charges"
                    formik={formik}
                    flex={1}
                    keyboardType="numeric"
                    value={currencyMask(formik.values.additional_charges)}
                    onChangeText={(text) => formik.setFieldValue("additional_charges", handleCurrencyInput(text))}
                />
            </View>

            <FormText label="Observações" formik={formik} name="notes" multiline numberOfLines={4} textAlignVertical="top" />

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
                date={selectDate === "order_date" ? new Date(formik.values.order_date) : new Date(formik.values.validity || Date.now())}
                onConfirm={(date) => {
                    formik.setFieldValue(selectDate === "validity" ? "validity" : "order_date", date.getTime())
                    setSelectDate(null)
                }}
                onCancel={() => setSelectDate(null)}
                mode="date"
                locale="pt-BR"
                title={selectDate === "order_date" ? "Data do pedido" : "Valido até"}
                cancelText="Cancelar"
                confirmText="Confirmar"
                theme="light"
            />
        </ScrollView>
    )
}
