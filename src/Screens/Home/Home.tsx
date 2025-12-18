import { useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useRef } from "react"
import { BackHandler, LayoutAnimation, ScrollView, View } from "react-native"
import { BottomNavigation, FAB } from "react-native-paper"
import { OrderList } from "./OrderList/OrderList"
import { useQuery } from "@tanstack/react-query"
import { Order } from "../../types/server/class/Order"
import { api } from "../../backend/api"
import { StackNavigation } from "../../Routes"

interface HomeProps {
    navigation: StackNavigation
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const [tabIndex, setTabIndex] = React.useState(0)
    const [routes] = React.useState([
        { key: "budgets", title: "Orçamentos", focusedIcon: "clipboard-list", unfocusedIcon: "clipboard-list-outline" },
        { key: "orders", title: "Pedidos", focusedIcon: "archive-check", unfocusedIcon: "archive-check-outline" },
    ])

    const { data, isFetching, refetch } = useQuery<Order[]>({
        initialData: [],
        queryKey: ["ordersData", tabIndex],
        queryFn: async () => (await api.get("/order")).data,
        refetchOnWindowFocus: true,
    })

    const Orders = () => <OrderList orders={data.filter((item) => item.type === "order")} isFetching={isFetching} refetch={refetch} />
    const Budgets = () => <OrderList orders={data.filter((item) => item.type === "budget")} isFetching={isFetching} refetch={refetch} />

    const renderScene = BottomNavigation.SceneMap({
        budgets: Budgets,
        orders: Orders,
    })

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
        <>
            <BottomNavigation navigationState={{ index: tabIndex, routes }} onIndexChange={setTabIndex} renderScene={renderScene} />
            <FAB
                style={[
                    {
                        position: "absolute",
                        right: 15,
                        bottom: 100,
                        borderRadius: 100,
                    },
                ]}
                icon="plus"
                onPress={() => navigation.navigate("OrderForm")}
            />
        </>
    )
}
