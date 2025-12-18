import { api } from "../backend/api"
import { Creator } from "../types/server/class"
import { Category } from "../types/server/class/Category"

const creators = async () => {
    try {
        const response = await api.get("/creator/list")
        const creators = response.data as Creator[]
        return creators
    } catch (error) {
        console.log(error)
    }
    return []
}

const categories = async () => {
    try {
        const response = await api.get("/category/list")
        const categories = response.data as Category[]
        return categories
    } catch (error) {
        console.log(error)
    }
    return []
}

export default { creators, categories }
