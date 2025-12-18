import { useContext } from "react"
import UserContext from "../contexts/userContext"
import { User } from "../types/server/class"
import { useNavigation } from "@react-navigation/native"
import { api } from "../backend/api"
import { Notification } from "../types/server/class/Notification"

export const useUser = () => {
    const context = useContext(UserContext)
    const navigation = useNavigation<any>()

    const onLogin = (user: User, externalRoute?: { path: string; query: any }) => {
        context.setUser(user)

        navigation.navigate("mainscreen")

        if (externalRoute) {
            setTimeout(() => navigation.push(externalRoute.path, externalRoute.query), 200)
        }
    }

    const logout = async () => {
        if (!context.user?.expoPushToken) return

        navigation.navigate("home")
        context.setUser(null)
        try {
            const response = await api.patch("/user", {
                id: context.user.id,
                expoPushToken: context.user.expoPushToken.filter((item) => item != context.expoPushToken),
            })
        } catch (error) {
            console.log(error)
        }
    }

    const refresh = async () => {
        try {
            const response = await api.get("/user", { params: { id: context.user?.id } })
            context.setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refreshNotifications = async () => {
        if (!context.user) return
        try {
            const response = await api.get("/user/notifications", { params: { user_id: context.user.id } })
            // @ts-ignore
            context.setUser((user) => ({ ...user, notifications: response.data }))
        } catch (error) {
            console.log(error)
        }
    }

    const sendViewedNotification = async (notification_id: string) => {
        try {
            const response = await api.post("/notification/viewed", { id: notification_id })
            context.updateNotification(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return { ...context, onLogin, logout, refresh, sendViewedNotification, refreshNotifications }
}
