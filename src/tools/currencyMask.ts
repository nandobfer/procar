import { numericFormatter } from "react-number-format"

interface Options {
    withoutAffix?: boolean
}

export const currencyMask = (value: number | string, options?: Options) => {
    return numericFormatter(value.toString(), {
        decimalSeparator: ",",
        thousandSeparator: ".",
        prefix: options?.withoutAffix ? "" : "R$ ",
        fixedDecimalScale: true,
        decimalScale: 2,
    })
}
