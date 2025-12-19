import { useFocusEffect } from "@react-navigation/native"
import React, { useCallback } from "react"
import { BackHandler, LayoutAnimation } from "react-native"
import { OrderList } from "./OrderList/OrderList"
import { useQuery } from "@tanstack/react-query"
import { Order } from "../../types/server/class/Order"
import { api } from "../../backend/api"
import { StackNavigation } from "../../Routes"

interface HomeProps {
    navigation: StackNavigation
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const { data, isFetching, refetch } = useQuery<Order[]>({
        initialData: [],
        queryKey: ["ordersData"],
        queryFn: async () => (await api.get("/order")).data,
        refetchOnWindowFocus: true,
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

    return <OrderList orders={data} isFetching={isFetching} refetch={refetch} />
}
