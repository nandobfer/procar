import React, { useState } from "react"
import { Order } from "../../types/server/class/Order"
import { ActivityIndicator, IconButton, Menu } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { StackNavigation } from "../../Routes"
import { useOrder } from "../../hooks/useOrder"
import { Linking } from "react-native"

interface OrderMenuProps {
    order: Order
}

export const OrderMenu: React.FC<OrderMenuProps> = (props) => {
    const { deleteOrder, deleting, generatePdf, generatingPdf } = useOrder(props.order)
    const navigation = useNavigation<StackNavigation>()
    const [visible, setVisible] = useState(false)

    const closeMenu = () => setVisible(false)

    const handleEditPress = () => {
        navigation.navigate("OrderForm", { order: props.order })
        closeMenu()
    }

    const handleDeletePress = async () => {
        await deleteOrder()
        navigation.goBack()
        closeMenu()
    }

    const handlePdfPress = async () => {
        const url = await generatePdf()
        if (url) {
            Linking.openURL(url + `?timestamp=${Date.now()}`)
        }
        closeMenu()
    }

    return (
        <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={<IconButton icon="dots-vertical" onPress={() => setVisible(true)} />}
            contentStyle={[{ marginTop: 80 }]}
        >
            <Menu.Item leadingIcon={"download"} onPress={handlePdfPress} title={generatingPdf ? <ActivityIndicator /> : "Gerar PDF"} />
            <Menu.Item leadingIcon={"pencil"} onPress={handleEditPress} title="Editar" />
            {/* <Menu.Item leadingIcon={"share-variant"} onPress={handleSharePress} title="Compartilhar" />
            <Menu.Item leadingIcon={'download'} onPress={() => {}} title="Baixar PDF" /> */}
            <Menu.Item leadingIcon={"delete"} onPress={handleDeletePress} title={deleting ? <ActivityIndicator /> : "Excluir"} />
        </Menu>
    )
}
