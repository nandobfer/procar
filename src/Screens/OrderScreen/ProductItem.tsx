import React, { useRef, useState } from "react"
import { View } from "react-native"
import { Item } from "../../types/server/class/Item"
import { Surface, Text } from "react-native-paper"
import { currencyMask } from "../../tools/currencyMask"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { colors } from "../../style/colors"
import { SwipedContainer } from "../../components/SwipedContainer"
import { Order } from "../../types/server/class/Order"
import { useProduct } from "../../hooks/useProduct"
import { useNavigation } from "@react-navigation/native"
import { StackNavigation } from "../../Routes"
import { ProductForm } from "./ProductForm"
import { animate } from "../../tools/animate"

interface ProductItemProps {
    product: Item
    order: Order
    onDelete: () => void
}

export const ProductItem: React.FC<ProductItemProps> = (props) => {
    const swipeableRef = useRef<Swipeable>(null)
    const navigation = useNavigation<StackNavigation>()
    const [editing, setEditing] = useState(false)

    const { deleting, deleteProduct } = useProduct(props.product, props.order)

    const handleSwipe = async (direction: "left" | "right") => {
        if (direction === "right") {
            await deleteProduct()
            props.onDelete()
        } else {
            openForm()
        }
        swipeableRef.current?.close()
    }

    const openForm = () => {
        animate()
        setEditing(true)
    }

    const closeForm = () => {
        animate()
        setEditing(false)
    }

    const finishEditing = () => {
        closeForm()
        props.onDelete()
    }

    return editing ? (
        <ProductForm product={props.product} order={props.order} onSubmit={finishEditing} onCancel={closeForm} />
    ) : (
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
            <Surface style={[{ padding: 10, borderRadius: 8, gap: 10, opacity: deleting ? 0.5 : 1 }]} pointerEvents={deleting ? "none" : "auto"}>
                <Text numberOfLines={3} variant="titleLarge">
                    {props.product.description}
                </Text>
                <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
                    <Text variant="titleMedium">
                        {props.product.quantity}x {currencyMask(props.product.unit_price)}
                    </Text>
                    <Text variant="titleMedium">Subtotal: {currencyMask(props.product.quantity * props.product.unit_price)}</Text>
                </View>
            </Surface>
        </Swipeable>
    )
}
