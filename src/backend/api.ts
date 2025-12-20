import axios from "axios"

// export const url = "https://api-procar.nandoburgos.dev"
// export const url = "http://192.168.0.89:4545"
export const url = "http://192.168.100.77:4545"

export const api = axios.create({ baseURL: url })
