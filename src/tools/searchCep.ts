import axios from "axios"
import { CepResult } from "../types/CepResult"

export const searchCep = async (cep: string) => {
    try {
        const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`)
        const result = response.data as CepResult
        return result
    } catch (error) {
        console.log(error)
        throw error
    }
}
