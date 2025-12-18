import { useState } from "react"
import { Item } from "../types/server/class/Item"
import { Order } from "../types/server/class/Order"
import { api } from "../backend/api"

export const useProduct = (product: Item, order: Order) => {
    const [deleting, setDeleting] = useState(false)

    const deleteProduct = async () => {
        setDeleting(true)
        try {
            await api.delete(`/order/item`, { params: { item_id: product.id, order_id: order.id } })
        } catch (error) {
            console.log("Error deleting product:", error)
        } finally {
            setDeleting(false)
        }
    }

    return { deleting, deleteProduct }
}
