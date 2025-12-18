import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View, TextInput } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import lodash from "lodash"
import { TextInputProps } from "react-native-paper"
import { FormikBundle } from "../types/FormikBundle"
import { colors } from "../style/colors"
import { mobile } from "../tools/platforms"

export const dropdown_styles = StyleSheet.create({
    dropdown: {
        flex: mobile ? undefined : 1,
        minHeight: 48,
        maxHeight: 48,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 15,
        borderColor: "#222",
    },
    placeholderStyle: {
        fontSize: (14),
        color: "#49454F",
    },
    selectedTextStyle: {
        fontSize: (14),
        color: "#1C1B1F",
    },
    highlightedItem: {
        // backgroundColor: colors.secondary,
    },
})

interface SelectComponentProps<T> extends TextInputProps {
    formik: FormikBundle<T>
    data: {
        id?: number
        value: string | number
        label: string
    }[]
    name: string
    flex?: number
    search?: boolean
    searchPlaceholder?: string
    beforeChange?: () => void
    handleSearch?: (text: string) => void
}

export const SelectComponent = <T,>({
    formik,
    data,
    placeholder,
    name,
    label,
    flex,
    search = false,
    searchPlaceholder,
    beforeChange,
    ...props
}: SelectComponentProps<T>) => {
    const [value, setValue] = useState<null | { id?: number; value: string | number; label: string }>(null)
    const [isFocus, setIsFocus] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [filteredData, setFilteredData] = useState(data)
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
    const searchInputRef = useRef<TextInput>(null)
    const dropdownRef = useRef<any>(null)

    const errorColor = "#B3261E"
    const error = !!(lodash.get(formik.touched, name) && lodash.get(formik.errors, name))
    const error_text = lodash.get(formik.errors, name) as string

    const findSelectedOption = (val: string | number | null | undefined) => {
        if (val === null || val === undefined) return null
        return data.find((option) => option.value === val) || null
    }

    const selectOption = (selectedValue: string | number) => {
        const selectedOption = findSelectedOption(selectedValue)
        formik.setFieldValue(name, selectedOption ? selectedOption.value : null)
        setValue(selectedOption)
        setIsFocus(false)
        setSearchText("")
        if (dropdownRef.current) {
            dropdownRef.current.close()
        }
    }

    useEffect(() => {
        const selectedOption = findSelectedOption(lodash.get(formik.values, name))
        setValue(selectedOption)
    }, [formik.values, name, data])

    useEffect(() => {
        setFilteredData(data)
    }, [data])

    useEffect(() => {
        const selectedOption = findSelectedOption(lodash.get(formik.values, name))

        let indexToHighlight: number | null = 0

        if (selectedOption) {
            indexToHighlight = filteredData.findIndex((item) => item.value === selectedOption.value)
            // Se não encontrado, findIndex retorna -1, que não é válido
            if (indexToHighlight === -1) indexToHighlight = 0
        }

        setHighlightedIndex(indexToHighlight)
    }, [filteredData])

    const handleFocus = () => {
        setIsFocus(true)
        setFilteredData(data)
        setSearchText("")

        const selectedOption = findSelectedOption(lodash.get(formik.values, name))

        let indexToHighlight: number | null = null

        if (data.length === 1) {
            indexToHighlight = 0
        } else if (selectedOption) {
            indexToHighlight = data.findIndex((item) => item.value === selectedOption.value)
            if (indexToHighlight === -1) indexToHighlight = null
        }

        setHighlightedIndex(indexToHighlight)

        if (search) {
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 150)
        }
    }

    const handleSearch = (text: string) => {
        setSearchText(text)

        if (props.handleSearch) {
            props.handleSearch(text)
            return
        }

        if (text) {
            const filtered = data.filter((item) => item.label.toLowerCase().includes(text.toLowerCase()))
            setFilteredData(filtered)
        } else {
            setFilteredData(data)
        }
    }

    const handleKeyPress = ({ nativeEvent }: any) => {
        if (!search) return

        if (nativeEvent.key === "Enter") {
            // Seleciona o item atualmente engatilhado, se existir
            if (filteredData.length > 0 && highlightedIndex !== null && highlightedIndex >= 0 && highlightedIndex < filteredData.length) {
                if (beforeChange) beforeChange()
                selectOption(filteredData[highlightedIndex].value)
            } else {
                selectOption("")
                setIsFocus(false)
                if (dropdownRef.current) {
                    dropdownRef.current.close()
                }
            }
        }

        // todo falta fazer um auto-scroll para poder usar as teclas direcionais

        // else if (nativeEvent.key === "ArrowDown") {
        //     if (filteredData.length > 0) {
        //         const newIndex = (highlightedIndex + 1) % filteredData.length
        //         setHighlightedIndex(newIndex)
        //     }
        //     nativeEvent.preventDefault() // Previne o comportamento padrão de rolagem da página
        // } else if (nativeEvent.key === "ArrowUp") {
        //     if (filteredData.length > 0) {
        //         const newIndex = highlightedIndex === 0 ? filteredData.length - 1 : highlightedIndex - 1
        //         setHighlightedIndex(newIndex)
        //     }
        //     nativeEvent.preventDefault() // Previne o comportamento padrão de rolagem da página
        // }
    }

    const renderItem = (item: any, selected: boolean | undefined) => {
        const highlight = search && highlightedIndex !== null && filteredData[highlightedIndex]?.value === item.value

        return (
            <View
                style={[
                    {
                        padding: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    },
                    highlight && dropdown_styles.highlightedItem,
                ]}
            >
                <Text
                    style={{
                        fontSize: (16),
                        fontFamily: "Lato_400Regular",
                        fontWeight: highlight ? "bold" : "normal",
                    }}
                >
                    {item.label}
                </Text>
                {selected && <Text style={{ fontSize: (12), color: colors.primary }}>✓</Text>}
            </View>
        )
    }

    return (
        <View
            style={{
                flex: mobile ? flex || undefined : flex || 1,
            }}
        >
            <Text
                style={{
                    fontSize: (14),
                    fontFamily: "Lato_400Regular",
                    color: "#1c1b1f",
                    marginBottom: 4,
                }}
                ellipsizeMode={mobile ? "tail" : undefined}
                numberOfLines={mobile ? 1 : undefined}
            >
                {label}
            </Text>

            <Dropdown
                ref={dropdownRef}
                style={[
                    dropdown_styles.dropdown,
                    isFocus && { borderWidth: 2, borderColor: colors.primary },
                    error && { borderColor: errorColor, borderWidth: 2 },
                    !!flex && { flex: flex },
                ]}
                placeholderStyle={dropdown_styles.placeholderStyle}
                selectedTextStyle={dropdown_styles.selectedTextStyle}
                containerStyle={{ backgroundColor: "#F8F8F8" }}
                activeColor="#e1dee3"
                data={filteredData}
                fontFamily="Lato_400Regular"
                placeholder={placeholder}
                labelField="label"
                valueField="value"
                value={value}
                onFocus={handleFocus}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    if (beforeChange) beforeChange()
                    selectOption(item.value)
                }}
                search={search}
                searchField="label"
                searchPlaceholder={searchPlaceholder}
                renderItem={renderItem}
                renderInputSearch={(onSearch) => (
                    <TextInput
                        ref={searchInputRef}
                        style={{ padding: 8 }}
                        placeholder={searchPlaceholder}
                        autoFocus
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                        value={searchText}
                        onChangeText={(text) => {
                            handleSearch(text)
                            onSearch(text)
                        }}
                        onKeyPress={handleKeyPress}
                    />
                )}
            />

            {error && (
                <Text
                    style={{
                        fontFamily: "Lato_400Regular",
                        color: errorColor,
                    }}
                >
                    {error_text}
                </Text>
            )}
        </View>
    )
}
