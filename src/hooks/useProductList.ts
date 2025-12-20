import { useEffect, useState } from "react"
import { Order } from "../types/server/class/Order"
import { Item } from "../types/server/class/Item"
import { useFormik } from "formik"
import { useDebounce } from "use-debounce"
import { useQuery } from "@tanstack/react-query"
import { api } from "../backend/api"
import { animate } from "../tools/animate"

export const useProductList = (order?: Order) => {
    const [products, setProducts] = useState<Item[]>(order?.items || [])

    const formik = useFormik({ initialValues: { search: "" }, onSubmit: () => {} })

    const [debouncedValue] = useDebounce(formik.values.search, 300)

    const {
        data: items,
        isFetching,
        refetch,
    } = useQuery<Item[]>({
        initialData: products,
        queryKey: ["items", debouncedValue],
        queryFn: async () => {
            const response = await api.get<Item[]>("/order/item", {
                params: { query: debouncedValue },
            })
            return response.data
        },
        enabled: !order,
    })

    const subtotal = products.reduce((acc, item) => acc + item.quantity * item.unit_price, 0)

    const insertProduct = (item: Item) => {
        animate()
        setProducts((prevProducts) => [item, ...prevProducts.filter((i) => i.id !== item.id)])
    }

    const removeProduct = (itemId: string) => {
        animate()
        setProducts((prevProducts) => prevProducts.filter((i) => i.id !== itemId))
    }

    useEffect(() => {
        // animate()
        setProducts(items)
    }, [items])

    useEffect(() => {
        if (order) {
            // animate()
            setProducts(order.items)
        }
    }, [order])

    return { products, isFetching, refetch, formik, insertProduct, removeProduct, subtotal }
}
