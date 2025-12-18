import React, { useLayoutEffect, useRef, useState } from "react"
import { FlatList, LayoutChangeEvent, View } from "react-native"
import { StackNavigation, StackRoute } from "../../../Routes"
import ViewShot, { captureRef } from "react-native-view-shot"
import { Button, IconButton, Surface, Text } from "react-native-paper"
import { CanvasContainer } from "./CanvasContainer"
import { useDraw } from "../../../hooks/useDraw"
import { Slider } from "@miblanchard/react-native-slider"
import { colors } from "../../../style/colors"
import { drawingColors } from "./drawingColors"
import Svg, { Circle } from "react-native-svg"
import { useOrder } from "../../../hooks/useOrder"
import { uid } from "uid"

interface DrawProps {
    navigation: StackNavigation
    route: StackRoute
}

export const DrawScreen: React.FC<DrawProps> = (props) => {
    const order = props.route.params?.order!
    const shotRef = useRef<ViewShot>(null)
    const draw = useDraw()
    const { uploadImages, uploadingImages } = useOrder(order)
    const [viewShotSize, setViewShotSize] = useState({ width: 0, height: 0 })

    const onSave = async () => {
        const uri = await captureRef(shotRef, {
            format: "jpg",
            quality: 1,
            result: "tmpfile",
        })

        await uploadImages(
            [{ uri, mimeType: "image/jpeg" }],
            [{ filename: `${uid()}.jpg`, url: uri, id: uid(), width: viewShotSize.width, height: viewShotSize.height }]
        )

        props.navigation.goBack()
    }

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout
        setViewShotSize({ width, height })
    }

    useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <View style={[{ flexDirection: "row" }]}>
                    <IconButton icon="undo" onPress={() => draw.setShouldUndo(true)} disabled={draw.paths.length === 0 || uploadingImages} />
                    <IconButton icon="content-save" onPress={onSave} disabled={uploadingImages} loading={uploadingImages} />
                </View>
            ),
        })
    }, [props.navigation, order, uploadingImages, draw.paths])

    return (
        <View style={[{ flex: 1 }]}>
            <ViewShot onLayout={onLayout} ref={shotRef} style={[{ flex: 0.85, backgroundColor: "white" }]}>
                <CanvasContainer draw={draw} />
            </ViewShot>
            <Surface
                style={{
                    flexDirection: "row",
                    flex: 0.08,
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 20,
                    paddingRight: 10,
                    // borderTopColor: colors.disabled,
                    // borderTopWidth: 1,
                }}
            >
                <Text style={{ textAlign: "center" }}>{draw.stroke.toFixed(0)}</Text>

                <Slider
                    value={draw.stroke}
                    onValueChange={(value) => draw.setStroke(value[0])}
                    maximumValue={50}
                    minimumValue={1}
                    containerStyle={{ backgroundColor: "transparent", flex: 1 }}
                    thumbStyle={{ backgroundColor: colors.primary }}
                    trackStyle={{ backgroundColor: colors.disabled }}
                    minimumTrackTintColor={colors.primary}
                />
                <IconButton
                    mode={draw.updateColor === "white" ? "contained" : undefined}
                    icon="eraser"
                    onPress={() => draw.setUpdateColor("white")}
                />
            </Surface>

            <Surface style={{ flex: 0.07 }}>
                <FlatList
                    horizontal
                    data={drawingColors}
                    renderItem={({ item }) => (
                        <Svg key={item} width={30} height={30} onPress={() => draw.setUpdateColor(item)}>
                            <Circle fill={item} cx={15} cy={15} r={draw.updateColor === item ? 15 : 10} />
                        </Svg>
                    )}
                    contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
                />
            </Surface>
        </View>
    )
}
