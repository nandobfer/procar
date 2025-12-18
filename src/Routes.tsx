import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "./Screens/Home/Home"
import { default_navigator_options } from "./tools/default_navigator_options"
import { OrderFormScreen } from "./Screens/OrderFormScreen/OrderFormScreen"
import { NavigationProp, RouteProp } from "@react-navigation/native"
import { OrderScreen } from "./Screens/OrderScreen/OrderScreen"
import { Order } from "./types/server/class/Order"
import { DrawScreen } from "./Screens/Home/Draw/DrawScreen"

interface RoutesProps {}

export type RoutePaylod = { id?: string; order?: Order } | undefined
export type ScreenNames = ["Home", "OrderForm", "Order", "Draw"]
export type RootStackParamList = Record<ScreenNames[number], RoutePaylod>
export type StackNavigation = NavigationProp<RootStackParamList>
export type StackRoute = RouteProp<RootStackParamList, ScreenNames[number]>

const Stack = createNativeStackNavigator<RootStackParamList>()

export const Routes: React.FC<RoutesProps> = ({}) => {
    return (
        <Stack.Navigator
            screenOptions={{
                ...default_navigator_options,
                // headerTitle: ios ? undefined : () => <Header />,
                // header: ios ? () => <HeaderIos /> : undefined,
            }}
        >
            <Stack.Screen name="Home" component={Home} options={{ title: "Pedidos e Orçamentos" }} />
            <Stack.Screen name="OrderForm" component={OrderFormScreen} options={{ title: "Formulário de Pedido" }} />
            <Stack.Screen name="Order" component={OrderScreen} options={{ title: "Pedido" }} />
            <Stack.Screen name="Draw" component={DrawScreen} options={{ title: "Desenhar" }} />
        </Stack.Navigator>
    )
}
