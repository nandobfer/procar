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
        data: order,
        refetch,
        isFetching,
    } = useQuery<Order>({
        queryKey: ["orderDetails"],
        queryFn: async () => (await api.get(`/order`, { params: { order_id: props.route.params?.order?.id } })).data,
        initialData: props.route.params?.order as Order,
    })

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
        totalValue,
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

                    {order.customer.company_name && <Text variant="titleMedium">{order.customer.company_name}</Text>}

                    {order.customer.cnpj && (
                        <IconedText variant="titleMedium" icon={"domain"}>
                            {order.customer.cnpj}
                        </IconedText>
                    )}

                    {order.customer.phone && (
                        <IconedText variant="titleMedium" icon={"phone"}>
                            {order.customer.phone}
                        </IconedText>
                    )}

                    {order.customer.state_registration && <Text variant="titleMedium">Insc. Estadual: {order.customer.state_registration}</Text>}

                    <Divider />

                    <IconedText variant="titleSmall" icon="map-marker">
                        {order.customer.street || "Localização"}
                    </IconedText>
                    <Text variant="titleSmall"> {[order.customer.neighborhood, order.customer.city, stateName?.label].join(", ")} </Text>

                    {(order.delivery_date?.from || order.delivery_date?.to) && (
                        <>
                            <Divider />
                            <IconedText icon="truck-delivery" variant="titleLarge">
                                Entrega
                            </IconedText>
                        </>
                    )}
                    {order.delivery_date?.from && (
                        <Text variant="titleMedium">A partir de: {new Date(order.delivery_date.from).toLocaleDateString("pt-br")}</Text>
                    )}
                    {order.delivery_date?.to && (
                        <Text variant="titleMedium">Até: {new Date(order.delivery_date.to).toLocaleDateString("pt-br")}</Text>
                    )}

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

                    {order.observations && (
                        <Text numberOfLines={4} variant="titleMedium">
                            {order.observations}
                        </Text>
                    )}

                    <MediaList order={order} refetch={refetch} gallery={gallery} orderHook={orderHook} />

                    <Divider />

                    <IconedText icon="receipt" variant="titleLarge">
                        Produtos
                    </IconedText>
                    {order.items.length > 0 && (
                        <Text variant="titleSmall">Arraste um produto para a esquerda para editar e para a direita para excluir</Text>
                    )}

                    <NewProductButton order={order} onSubmit={refetch} />
                </View>
            }
            ListFooterComponent={
                <View style={[{ gap: 10, marginBottom: 10 }]}>
                    <Divider />

                    <IconedText icon="cash-multiple" variant="titleLarge">
                        {currencyMask(totalValue)}
                    </IconedText>
                    {order.payment_terms && <Text variant="titleSmall">Condições de pagamento: {order.payment_terms}</Text>}
                </View>
            }
        />
    )
}
