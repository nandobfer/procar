export const unmaskCurrency = (value: string | number) => {
    if (value.toString().length == Number(value.toString().replace(/\D/g, "")).toString().length) {
        return Number(value)
    }

    const decimalSeparator = value.toString().split(",").length == 2 ? "," : "."

    return Number(
        value
            .toString()
            .replace(decimalSeparator == "," ? /[^\d,]/g : /[^\d.]/g, "")
            .replace(",", ".")
    )
}
