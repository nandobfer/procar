import React, { useRef, useState } from "react"
import { View } from "react-native"
import { Item } from "../../types/server/class/Item"
import { Divider, Surface, Text } from "react-native-paper"
import { currencyMask } from "../../tools/currencyMask"
import Swipeable from "react-native-gesture-handler/Swipeable"
import { colors } from "../../style/colors"
import { SwipedContainer } from "../../components/SwipedContainer"
import { Order } from "../../types/server/class/Order"
import { useProduct } from "../../hooks/useProduct"
import { ProductForm } from "./ProductForm"
import { animate } from "../../tools/animate"
import { IconedText } from "../../components/IconedText"

interface ProductItemProps {
    product: Item
    order?: Order
    onDelete: (itemId: string) => void
    onSubmit: (item: Item) => void
}

export const ProductCard: React.FC<ProductItemProps> = (props) => {
    const swipeableRef = useRef<Swipeable>(null)
    const [editing, setEditing] = useState(false)

    const { deleting, deleteProduct } = useProduct(props.product, props.order)

    const handleSwipe = async (direction: "left" | "right") => {
        if (direction === "right") {
            await deleteProduct()
            props.onDelete(props.product.id)
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

    const finishEditing = (item: Item) => {
        closeForm()
        props.onSubmit(item)
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
                <IconedText icon="cube-outline" numberOfLines={3} variant="titleMedium">
                    {props.product.description}
                </IconedText>

                <Divider />

                <IconedText icon="cash" variant="titleSmall">
                    {currencyMask(props.product.unit_price)}
                </IconedText>

                {props.order && (
                    <>
                        <Divider />
                        <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
                            <IconedText icon="cart-arrow-down" variant="titleMedium">
                                Qtd: {props.product.quantity}
                            </IconedText>
                            <Text variant="titleMedium">Subtotal: {currencyMask(props.product.quantity * props.product.unit_price)}</Text>
                        </View>
                    </>
                )}
            </Surface>
        </Swipeable>
    )
}
