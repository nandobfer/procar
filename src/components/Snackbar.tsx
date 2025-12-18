import React, { useContext } from "react"
import { Snackbar as PaperSnackbar } from "react-native-paper"
import SnackbarContext from "../contexts/snackbarContext"

interface snackbarProps {}

export const Snackbar: React.FC<snackbarProps> = ({}) => {
    const snackbar = useContext(SnackbarContext)

    return (
        <PaperSnackbar visible={snackbar.visible} onDismiss={() => snackbar.setVisible(false)}>
            {snackbar.text}
        </PaperSnackbar>
    )
}
