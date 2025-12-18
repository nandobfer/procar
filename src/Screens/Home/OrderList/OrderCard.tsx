import React, { useRef } from "react"
import { View } from "react-native"
import { Order } from "../../../types/server/class/Order"
import { Button, Icon, Surface, Text } from "react-native-paper"
import { currencyMask } from "../../../tools/currencyMask"
import { useNavigation } from "@react-navigation/native"
import { StackNavigation } from "../../../Routes"
import { Swipeable } from "react-native-gesture-handler"
import { SwipedContainer } from "../../../components/SwipedContainer"
import { colors } from "../../../style/colors"
import { useOrder } from "../../../hooks/useOrder"
import { IconedText } from "../../../components/IconedText"

interface OrderCardProps {
    order: Order
    onDelete: () => void
}

export const OrderCard: React.FC<OrderCardProps> = (props) => {
    const swipeableRef = useRef<Swipeable>(null)
    const totalValue = props.order.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0)
    const navigation = useNavigation<StackNavigation>()
    const { deleteOrder, deleting } = useOrder(props.order)

    const handleSwipe = async (direction: "left" | "right") => {
        if (direction === "right") {
            await deleteOrder()
            props.onDelete()
        } else {
            navigation.navigate("OrderForm", { order: props.order })
        }
        swipeableRef.current?.close()
    }

    return (
        <Swipeable
            ref={swipeableRef}
            renderLeftActions={() => <SwipedContainer label="Editar" color={colors.info} direction="left" />}
            renderRightActions={() => <SwipedContainer label="Excluir" color={colors.error} direction="right" loading={deleting} />}
            onSwipeableOpen={handleSwipe}
            overshootRight={false}
            overshootLeft={false}
            friction={2}
            leftThreshold={100}
            rightThreshold={100}
            containerStyle={{ overflow: "visible" }}
        >
            <Surface style={[{ padding: 20, borderRadius: 8, gap: 10 }]}>
                <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
                    <IconedText variant="titleLarge" icon={"pound"}>
                        {props.order.number}
                    </IconedText>

                    <IconedText variant="titleSmall" icon="calendar">
                        {new Date(props.order.order_date).toLocaleDateString("pt-br")}
                    </IconedText>
                </View>

                <IconedText variant="titleMedium" icon={"card-account-details"}>
                    {props.order.customer.name}
                </IconedText>

                {props.order.customer.cnpj && (
                    <IconedText variant="titleMedium" icon={"domain"}>
                        {props.order.customer.cnpj}
                    </IconedText>
                )}

                <View style={[{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }]}>
                    <IconedText size={20} variant="titleLarge" icon="cash-multiple">
                        {currencyMask(totalValue)}
                    </IconedText>
                    <Button mode="contained" onPress={() => navigation.navigate("Order", { order: props.order })}>
                        Ver detalhes
                    </Button>
                </View>
            </Surface>
        </Swipeable>
    )
}
