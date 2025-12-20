import React, { useCallback, useLayoutEffect } from "react"
import { FlatList, View } from "react-native"
import { StackNavigation, StackRoute } from "../../Routes"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { Order } from "../../types/server/class/Order"
import { ProductItem } from "./ProductItem"
import { Button, Divider, Icon, Menu, Text } from "react-native-paper"
import { useFocusEffect } from "@react-navigation/native"
import { IconedText } from "../../components/IconedText"
import { currencyMask } from "../../tools/currencyMask"
import { OrderMenu } from "./OrderMenu"
import { NewProductButton } from "./NewProductButton"
import { MediaList } from "./MediaList"
import { useOrder } from "../../hooks/useOrder"

interface OrderScreenProps {
    navigation: StackNavigation
    route: StackRoute
}

export const OrderScreen: React.FC<OrderScreenProps> = (props) => {
    const {
        data: _order,
        refetch,
        isFetching,
    } = useQuery<Order>({
        queryKey: ["orderDetails"],
        queryFn: async () => (await api.get(`/order`, { params: { order_id: props.route.params?.order?.id } })).data,
        initialData: props.route.params?.order as Order,
    })

    const order = isFetching ? props.route.params?.order! : _order

    const orderHook = useOrder(order)
    const {
        gallery,
        handleCameraPress,
        handleDrawPress,
        handleGalleryPress,
        uploadingImages,
        viewingMediaMenu,
        setViewingMediaMenu,
        stateName,
        subtotal,
        total,
    } = orderHook

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [])
    )

    useLayoutEffect(() => {
        props.navigation.setOptions({
            title: `${order.type === "budget" ? "Orçamento" : "Pedido"} #${order.number}`,
            headerRight: () => <OrderMenu order={order} />,
        })
    }, [props.navigation, order])

    return (
        <FlatList
            scrollEnabled={true}
            data={order.items}
            renderItem={({ item }) => <ProductItem product={item} onDelete={refetch} order={order} />}
            contentContainerStyle={{ gap: 20, padding: 20 }}
            refreshing={isFetching}
            onRefresh={refetch}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
                <View style={[{ gap: 10, flex: 1 }]}>
                    <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
                        <IconedText variant="titleLarge" icon={"card-account-details"}>
                            {order.customer.name}
                        </IconedText>

                        <IconedText variant="titleSmall" icon="calendar">
                            {new Date(order.order_date).toLocaleDateString("pt-br")}
                        </IconedText>
                    </View>

                    {order.customer.cpf_cnpj && (
                        <IconedText variant="titleMedium" icon={order.customer.cpf_cnpj.length === 18 ? "domain" : "account"}>
                            {order.customer.cpf_cnpj}
                        </IconedText>
                    )}

                    {order.customer.rg_ie && <Text variant="titleMedium">RG / Insc. Estadual: {order.customer.rg_ie}</Text>}

                    {order.customer.email && (
                        <IconedText variant="titleMedium" icon={"email"}>
                            {order.customer.email}
                        </IconedText>
                    )}

                    {order.customer.phone && (
                        <IconedText variant="titleMedium" icon={"phone"}>
                            {order.customer.phone}
                        </IconedText>
                    )}

                    <Divider />

                    <IconedText variant="titleSmall" icon="map-marker">
                        {order.customer.address || "Localização"}
                    </IconedText>
                    <Text variant="titleSmall"> {[order.customer.neighborhood, order.customer.city, stateName?.label].join(", ")} </Text>

                    <Divider />

                    <View style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
                        <IconedText icon="receipt" variant="titleLarge">
                            Observações
                        </IconedText>
                        <Menu
                            visible={viewingMediaMenu}
                            onDismiss={() => setViewingMediaMenu(false)}
                            contentStyle={[{ marginTop: 80 }]}
                            anchor={
                                <Button
                                    mode="outlined"
                                    style={[{ borderRadius: 8, borderStyle: "dashed" }]}
                                    onPress={() => setViewingMediaMenu(true)}
                                    loading={uploadingImages}
                                    disabled={uploadingImages}
                                >
                                    Adicionar imagem
                                    <Icon source={"menu-down"} size={20} />
                                </Button>
                            }
                        >
                            <Menu.Item leadingIcon={"camera"} onPress={handleCameraPress} title="Tirar foto" />
                            <Menu.Item leadingIcon={"image"} onPress={handleGalleryPress} title="Escolher da galeria" />
                            <Menu.Item leadingIcon={"draw"} onPress={handleDrawPress} title="Desenhar" />
                        </Menu>
                    </View>

                    {order.notes && (
                        <Text numberOfLines={4} variant="titleMedium">
                            {order.notes}
                        </Text>
                    )}

                    <MediaList order={order} refetch={refetch} gallery={gallery} orderHook={orderHook} />

                    <Divider />

                    {order.validity && (
                        <>
                            <IconedText icon="calendar-check" variant="titleMedium">
                                Válido até: {new Date(order.validity).toLocaleDateString("pt-BR")}
                            </IconedText>
                            <Divider />
                        </>
                    )}

                    <IconedText icon="receipt" variant="titleLarge">
                        Produtos / Serviços
                    </IconedText>
                    {order.items.length > 0 && (
                        <Text variant="titleSmall">Arraste um item para a esquerda para editar e para a direita para excluir</Text>
                    )}

                    <NewProductButton order={order} onSubmit={refetch} />
                </View>
            }
            ListFooterComponent={
                <View style={[{ gap: 10, marginBottom: 10 }]}>
                    <Divider />

                    <IconedText icon="cash" variant="titleMedium">
                        Subtotal: {currencyMask(subtotal)}
                    </IconedText>
                    <IconedText icon="cash-plus" variant="titleMedium">
                        Acréscimos: {currencyMask(order.additional_charges)}
                    </IconedText>
                    <IconedText icon="cash-minus" variant="titleMedium">
                        Descontos: {currencyMask(order.discount)}
                    </IconedText>
                    <IconedText icon="cash-multiple" variant="titleLarge">
                        Total: {currencyMask(total)}
                    </IconedText>
                    {order.payment_terms && <Text variant="titleSmall">Condições de pagamento: {order.payment_terms}</Text>}
                </View>
            }
        />
    )
}
