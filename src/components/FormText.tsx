import React, { useState, useEffect } from "react"
import { Text, TextInput, TextInputProps, useTheme } from "react-native-paper"
import { DimensionValue, TextInput as OriginalInput, Platform, View } from "react-native"
import { FormikErrors, FormikTouched } from "formik"
import { mask as masked } from "react-native-mask-text"
import { LabeledComponent } from "./LabeledComponent"
import lodash from "lodash"
import { colors } from "../style/colors"

export interface FormTextProps extends TextInputProps {
    name: string
    width?: DimensionValue
    flex?: number
    mask?: string | string[]
    formik: {
        values: any
        errors: FormikErrors<any>
        touched: FormikTouched<any>
        handleChange: (e: React.ChangeEvent<any>) => void
        handleBlur: {
            (e: React.FocusEvent<any, Element>): void
            <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void
        }
        setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<any>>
    }
    transparent?: boolean
    required?: boolean
    forced_error?: string
    innerLabel?: boolean
    password?: boolean
    afterChangeText?: (text: string) => void
}

export const FormText = React.forwardRef<React.ElementRef<typeof OriginalInput>, FormTextProps>((props, ref) => {
    const theme = useTheme()
    const error = !!props.forced_error || !!(lodash.get(props.formik.touched, props.name) && lodash.get(props.formik.errors, props.name))
    const error_text = props.forced_error || (lodash.get(props.formik.errors, props.name) as string)

    const [inputValue, setInputValue] = useState<string>(lodash.get(props.formik.values, props.name) || "")
    const [hiddenPassword, setHiddenPassword] = props.password ? useState(true) : useState(false)

    const onChangeText = (value: string) => {
        const callback =
            Platform.OS === "ios"
                ? (value: string) => {
                      setInputValue(value)
                      if (props.mask) {
                          props.formik.setFieldValue(props.name, masked(value, props.mask))
                      } else {
                          props.formik.setFieldValue(props.name, value)
                      }
                  }
                : props.onChangeText ||
                  (props.mask
                      ? (value) => props.formik.setFieldValue(props.name, masked(value, props.mask))
                      : // @ts-ignore
                        props.formik.handleChange(props.name))

        callback?.(value)
        props.afterChangeText?.(value)
    }

    // Sincroniza o estado local com o valor do Formik caso este seja atualizado externamente
    useEffect(() => {
        const formikValue = lodash.get(props.formik.values, props.name) || ""
        if (formikValue !== inputValue) {
            setInputValue(formikValue)
        }
    }, [props.formik.values, props.name])

    return (
        <View style={{ width: props.width, flex: props.flex }}>
            <LabeledComponent
                label={props.innerLabel ? "" : props.required ? `${props.label} *` : props.label || ""}
                marginBottom={5}
                Component={
                    <TextInput
                        ref={ref}
                        {...props}
                        // right={props.right ? error ? <TextInput.Icon icon={"alert-circle"} color={theme.colors.error} /> : props.right : undefined}
                        right={
                            props.right ? (
                                props.right
                            ) : props.password ? (
                                <TextInput.Icon
                                    icon={!hiddenPassword ? "eye-off" : "eye"}
                                    color={error ? theme.colors.error : colors.disabled}
                                    onPress={() => setHiddenPassword((value) => !value)}
                                />
                            ) : error ? (
                                <TextInput.Icon icon={"alert-circle"} color={theme.colors.error} size={24} />
                            ) : undefined
                        }
                        label={props.innerLabel ? (props.required ? `${props.label} *` : props.label || "") : undefined}
                        mode="outlined"
                        style={[
                            { backgroundColor: "transparent", flexShrink: 0, fontSize: 14 },
                            props.multiline && !props.innerLabel && { paddingVertical: 10 },
                            props.style,
                        ]}
                        outlineStyle={{
                            borderRadius: 5,
                            borderColor: error ? theme.colors.error : undefined,
                        }}
                        dense
                        returnKeyType={props.returnKeyType || "next"}
                        error={error}
                        value={
                            Platform.OS === "ios"
                                ? props.mask
                                    ? masked(inputValue, props.mask)
                                    : inputValue
                                : props.value ||
                                  (props.mask
                                      ? masked(lodash.get(props.formik.values, props.name), props.mask)
                                      : lodash.get(props.formik.values, props.name) || "")
                        }
                        onChangeText={onChangeText}
                        onBlur={
                            // ios
                            //     ? (e) => {
                            //           if (props.onBlur) {
                            //               props.onBlur(e)
                            //           }
                            //           ;(props.formik.handleBlur as (field: string) => (e: any) => void)(props.name)(e)
                            //       }
                            //     :
                            props.onBlur || props.formik.handleBlur(props.name)
                        }
                        secureTextEntry={hiddenPassword}
                    />
                }
            />

            {error && error_text != " " && <Text style={{ color: theme.colors.error, minHeight: 20, fontSize: 14 }}>{error_text}</Text>}
        </View>
    )
})
