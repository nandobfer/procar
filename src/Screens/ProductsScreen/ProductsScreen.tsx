import React, { useCallback } from "react"
import { FlatList, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { ProductCard } from "../OrderScreen/ProductCard"
import { Text, TextInput } from "react-native-paper"
import { FormText } from "../../components/FormText"
import { NewProductButton } from "../OrderScreen/NewProductButton"
import { useProductList } from "../../hooks/useProductList"

interface ProductsScreenProps {}

export const ProductsScreen: React.FC<ProductsScreenProps> = (props) => {
    const { products, isFetching, refetch, formik, insertProduct, removeProduct } = useProductList()

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [])
    )

    return (
        <FlatList
            data={products}
            renderItem={({ item }) => <ProductCard product={item} onSubmit={insertProduct} onDelete={removeProduct} />}
            ListEmptyComponent={ isFetching ? null : 
                <View>
                    <Text>Nenhum item para mostrar</Text>
                </View>
            }
            contentContainerStyle={{ padding: 20, gap: 20 }}
            refreshing={isFetching}
            onRefresh={refetch}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
                <View style={[{ gap: 10 }]}>
                    <FormText
                        label={"Pesquisar produtos ou serviços"}
                        formik={formik}
                        name="search"
                        placeholder="Digite para buscar"
                        left={<TextInput.Icon icon="magnify" />}
                        right={<TextInput.Icon icon="close" onPress={() => formik.resetForm()} />}
                    />
                    {products.length > 0 && <Text variant="titleSmall">Arraste um item para a esquerda para editar ou para a direita para excluir</Text>}

                    <NewProductButton onSubmit={insertProduct} />
                </View>
            }
        />
    )
}
