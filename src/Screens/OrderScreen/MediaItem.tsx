import React, { useState } from "react"
import { Dimensions, View } from "react-native"
import { Attachment } from "../../types/server/class/Order"
import { Menu, Surface, TouchableRipple } from "react-native-paper"
import { Image, ImageStyle } from "expo-image"

interface MediaItemProps {
    item: Attachment
    onPress: () => void
    onDelete: (item: Attachment) => void
}

export const MediaItem: React.FC<MediaItemProps> = (props) => {
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9
    const media_style: ImageStyle = { width: image_width, height: max_image_height, borderRadius: 8 }

    const [showingMenu, setShowingMenu] = useState(false)

    const openMenu = () => {
        setShowingMenu(true)
    }

    const closeMenu = () => {
        setShowingMenu(false)
    }

    const onDelete = () => {
        closeMenu()
        props.onDelete(props.item)
    }

    return (
        <Menu
            visible={showingMenu}
            onDismiss={closeMenu}
            contentStyle={[{ marginTop: 50 }]}
            anchor={
                <Surface style={{ borderRadius: 8 }}>
                    <TouchableRipple borderless style={{ borderRadius: 8 }} onPress={props.onPress} onLongPress={openMenu}>
                        <Image
                            source={props.item.url}
                            contentFit="contain"
                            placeholderContentFit="cover"
                            style={[media_style, { aspectRatio: props.item.width / props.item.height, width: undefined }]}
                        />
                    </TouchableRipple>
                </Surface>
            }
        >
            <Menu.Item leadingIcon={'delete'} onPress={onDelete} title="Excluir" />
        </Menu>
    )
}
