import React from "react"
import { FlatList, View } from "react-native"
import { Order } from "../../../types/server/class/Order"
import { OrderCard } from "./OrderCard"
import { Text, TextInput } from "react-native-paper"
import { useFormik } from "formik"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../../backend/api"
import { FormText } from "../../../components/FormText"

interface OrderListProps {
    orders: Order[]
    isFetching: boolean
    refetch: () => void
}

export const OrderList: React.FC<OrderListProps> = (props) => {
    const formik = useFormik({ initialValues: { search: "" }, onSubmit: () => {} })

    const [debouncedValue] = useDebounce(formik.values.search, 300)

    const { data: orders, isFetching: isFetchingOrders } = useQuery<Order[]>({
        initialData: props.orders,
        queryKey: ["orders", debouncedValue, props.orders],
        queryFn: async () => {
            if (!debouncedValue.trim()) return props.orders

            const response = await api.get<Order[]>("/order/query", {
                params: { query: debouncedValue },
            })
            return response.data.filter((order) => props.orders.some((o) => o.id === order.id)) // Ensure we only return orders in the current list
        },
    })

    return (
        <FlatList
            data={orders.sort((a, b) => Number(b.number) - Number(a.number))}
            renderItem={({ item }) => <OrderCard order={item} onDelete={props.refetch} />}
            ListEmptyComponent={
                <View>
                    <Text>Nenhum pedido para mostrar</Text>
                </View>
            }
            contentContainerStyle={{ padding: 20, gap: 20 }}
            refreshing={props.isFetching || isFetchingOrders}
            onRefresh={props.refetch}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
                <View style={[{ gap: 10 }]}>
                    <FormText
                        label={"Filtar por nome fantasia ou número do pedido"}
                        formik={formik}
                        name="search"
                        placeholder="Digite para buscar"
                        left={<TextInput.Icon icon="magnify" />}
                        right={<TextInput.Icon icon="close" onPress={() => formik.resetForm()} />}
                    />
                    {orders.length > 0 && (
                        <Text variant="titleSmall">Arraste um pedido para a esquerda para editar e para a direita para excluir</Text>
                    )}
                </View>
            }
        />
    )
}
