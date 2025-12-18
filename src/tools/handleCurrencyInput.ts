export const handleCurrencyInput = (inputed: string, decimalScale?: number) => {
    const digits = inputed.replace(/\D/g, "")

    const value = digits ? Number(digits) / (decimalScale ? decimalScale : 100) : 0
    return value.toString()
}
