import React, {  useState } from "react"
import { FlatList } from "react-native"
import { Attachment, Order } from "../../types/server/class/Order"
import ImageView from "react-native-image-viewing"
import { MediaItem } from "./MediaItem"
import { useOrder } from "../../hooks/useOrder"

interface MediaListProps {
    order: Order
    gallery: Attachment[]
    refetch: () => void
    orderHook: ReturnType<typeof useOrder>
}

export const MediaList: React.FC<MediaListProps> = (props) => {
    const [viewingImageIndex, setViewingImageIndex] = useState<number | null>(null)

    return (
        <FlatList
            horizontal
            data={props.gallery}
            renderItem={({ item, index }) => <MediaItem item={item} onPress={() => setViewingImageIndex(index)} onDelete={props.orderHook.deleteImage
            } />}
            ListFooterComponent={
                <ImageView
                    images={props.gallery.map((item) => ({ uri: item.url }))}
                    imageIndex={viewingImageIndex ?? 0}
                    visible={viewingImageIndex !== null}
                    onRequestClose={() => setViewingImageIndex(null)}
                    animationType="slide"
                />
            }
            contentContainerStyle={{gap: 20, padding: 20}}
            style={[{margin: -21}]}
        />
    )
}
