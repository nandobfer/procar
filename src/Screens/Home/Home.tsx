import { useFocusEffect } from "@react-navigation/native"
import React, { useCallback } from "react"
import { BackHandler, LayoutAnimation } from "react-native"
import { OrderList } from "./OrderList/OrderList"
import { useQuery } from "@tanstack/react-query"
import { Order } from "../../types/server/class/Order"
import { api } from "../../backend/api"
import { StackNavigation } from "../../Routes"
import { BottomNavigation } from "react-native-paper"
import { ProductsScreen } from "../ProductsScreen/ProductsScreen"

interface HomeProps {
    navigation: StackNavigation
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [tabIndex, setTabIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: "budgets", title: "Orçamentos", focusedIcon: "clipboard-list", unfocusedIcon: "clipboard-list-outline" },
        { key: "orders", title: "Pedidos", focusedIcon: "archive-check", unfocusedIcon: "archive-check-outline" },
        { key: "products", title: "Produtos", focusedIcon: "cube", unfocusedIcon: "cube-outline" },
    ])

    const { data, isFetching, refetch } = useQuery<Order[]>({
        initialData: [],
        queryKey: ["ordersData"],
        queryFn: async () => (await api.get("/order")).data,
        refetchOnWindowFocus: true,
    })

    const Orders = () => <OrderList orders={data.filter((item) => item.type === "order")} isFetching={isFetching} refetch={refetch} type="order" />
    const Budgets = () => <OrderList orders={data.filter((item) => item.type === "budget")} isFetching={isFetching} refetch={refetch} type="budget" />
    const Products = () => <ProductsScreen />

    const renderScene = BottomNavigation.SceneMap({
        budgets: Budgets,
        orders: Orders,
        products: Products,
    })

    const onTabChange = (index: number) => {
        setTabIndex(index)
    }

    useFocusEffect(
        useCallback(() => {
            refetch()
            const onBackPress = () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                return true
            }
            const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)

            return () => {
                backHandler.remove()
            }
        }, [])
    )

    return (
        <BottomNavigation
            navigationState={{ index: tabIndex, routes }}
            onIndexChange={onTabChange}
            renderScene={renderScene}
            sceneAnimationEnabled
            sceneAnimationType="shifting"
        />
    )
}
