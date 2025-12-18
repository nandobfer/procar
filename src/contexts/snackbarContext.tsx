import { createContext, useState } from "react"
import React from "react"

interface SnackbarContextValue {
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>

    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

interface SnackbarProviderProps {
    children: React.ReactNode
}

const SnackbarContext = createContext<SnackbarContextValue>({} as SnackbarContextValue)

export default SnackbarContext

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
    const [text, setText] = useState<string>("")

    const [visible, setVisible] = useState(false)

    return <SnackbarContext.Provider value={{ text, setText, visible, setVisible }}>{children}</SnackbarContext.Provider>
}
