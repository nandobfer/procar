import { Platform } from "react-native"

export const web = Platform.OS === "web"
export const mobile = Platform.OS !== "web"
export const ios = Platform.OS === "ios"
export const android = Platform.OS === "android"
