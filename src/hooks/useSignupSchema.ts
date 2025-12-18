import { useValidateCPF } from "burgos-documents"
import * as Yup from "yup"
import { validationErrors } from "../tools/validationErrors"
export const useSignupSchema = () => {
    const validateCPF = useValidateCPF()

    const required_message = validationErrors.required

    return Yup.object().shape({
        bio: Yup.string().max(300, "Bio pode ter no máximo 300 caracteres"),

        birth: Yup.string().test("birth-valid", "Data inválida", (value) => {
            if (!value) return true
            const max = new Date()
            const date = new Date(Number(value))
            return date <= max
        }),

        cover: Yup.mixed().nullable(),

        cpf: Yup.string()
            .required(required_message)
            .test("cpf-valid", "CPF inválido", (value) => {
                console.log("Testing CPF:", value) // Check what value is being tested
                const isValid = validateCPF(value || "")
                console.log("Is Valid:", isValid) // See the result
                return isValid
            }),

        creator: Yup.boolean().nullable(),

        email: Yup.string().email("E-mail inválido").required(required_message),

        google_id: Yup.string().nullable(),
        google_token: Yup.string().nullable(),
        image: Yup.mixed().nullable(),

        instagram: Yup.string()
            .matches(/^[a-zA-Z0-9_.]+$/, "nomes de usuário do Instagram não podem conter caracteres especiais")
            .nullable(),

        name: Yup.string().min(3, "Insira um nome válido").required(required_message),

        password: Yup.string()
            .min(8, "Senha precisa ter pelo menos 8 caracteres")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                "Senha precisa conter pelo menos uma letra maiúscula, uma letra minúscula e um número ."
            )
            .required(required_message),

        payment_cards: Yup.array()
            .of(
                Yup.object().shape({
                    card_number: Yup.string().required(required_message),
                    expiry_date: Yup.string().required(required_message),
                    cvv: Yup.string().required(required_message),
                })
            )
            .nullable(),

        phone: Yup.string().matches(/^\(\d{2}\) \d \d{4}-\d{4}$/, "Telefone inválido"),

        profession: Yup.string().nullable(),
        pronoun: Yup.string().nullable(),
        student: Yup.boolean(),

        tiktok: Yup.string()
            .matches(/^[a-zA-Z0-9_.]+$/, "nome de usuário TikTok não pode conter caracteres especiais")
            .nullable(),

        uf: Yup.string().length(2).nullable(),
        username: Yup.string().matches(/^\w+$/, "nome de usuário só pode conter letras, números e underline").required(required_message),

        confirm_email: Yup.string()
            .required(required_message)
            .test("emails-match", "E-mail não confere", function (value) {
                return this.parent.email === value
            }),
        confirm_password: Yup.string()
            .required(required_message)
            .test("passwords-match", "Senhas não conferem", function (value) {
                return this.parent.password === value
            }),
    })
}
