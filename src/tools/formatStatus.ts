import { colors } from "../style/colors"
import { Status } from "../types/server/class/Course"

export const formatStatus = (status: Status) => {
    const formats = {
        active: "Ativo",
        pending: "Pendente",
        disabled: "Inativo",
        declined: "Recusado",
    }

    return formats[status]
}

export const formatStatusColor = (status: Status) => {
    const formats = {
        active: colors.success,
        pending: colors.warning,
        disabled: colors.disabled,
        declined: colors.error,
    }

    return formats[status]
}
