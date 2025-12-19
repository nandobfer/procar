import { useEffect, useState } from "react"
import { Attachment, Order } from "../types/server/class/Order"
import { api } from "../backend/api"
import * as ImagePicker from "expo-image-picker"
import { getFilename, pickMedia } from "../tools/pickMedia"
import { uid } from "uid"
import { animate } from "../tools/animate"
import { estados } from "../tools/estadosBrasil"
import { AxiosError } from "axios"
import { useNavigation } from "@react-navigation/native"
import { StackNavigation } from "../Routes"

export const useOrder = (_order: Order) => {
    const [order, setOrder] = useState(_order)
    const [deleting, setDeleting] = useState(false)
    const [generatingPdf, setGeneratingPdf] = useState(false)
    const [viewingMediaMenu, setViewingMediaMenu] = useState(false)
    const [gallery, setGallery] = useState(order.attachments)
    const [uploadingImages, setUploadingImages] = useState(false)
    const [status, requestPermission] = ImagePicker.useCameraPermissions()
    const [patchingOrder, setPatchingOrder] = useState(false)

    const navigation = useNavigation<StackNavigation>()
    const stateName = estados.find((item) => item.value === order.customer.state)
    const subtotal = order.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0)
    const total = subtotal + order.additional_charges - order.discount

    const uploadImages = async (images: { uri: string; mimeType?: string }[], attachments: Attachment[]) => {
        if (uploadingImages) return
        setUploadingImages(true)
        try {
            const formData = new FormData()
            images.forEach((image, index) => {
                formData.append(`file${index}`, { uri: image.uri, type: image.mimeType, name: attachments[index].filename } as any)
            })

            formData.append("data", JSON.stringify(attachments))
            const response = await api.post("/order/attachment", formData, {
                params: { order_id: order.id },
                headers: { "Content-Type": "multipart/form-data" },
            })
            console.log(response.data)
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(JSON.stringify(error, null, 4))
            }

            console.log(error)
        } finally {
            setUploadingImages(false)
        }
    }

    const handleImagePickerAsset = async (result: ImagePicker.ImagePickerAsset[]) => {
        const attachments: Attachment[] = []
        result.forEach(async (media, index) => {
            const filename = getFilename(media)
            attachments.push({
                filename,
                url: media.uri,
                height: media.height,
                width: media.width,
                id: uid(),
            })
        })
        console.log(attachments)
        animate()
        setGallery([...gallery, ...attachments])

        // send to backend
        await uploadImages(result, attachments)
    }

    const deleteImage = async (attachment: Attachment) => {
        animate()
        setGallery((prev) => prev.filter((item) => item.id !== attachment.id))
        try {
            await api.delete("/order/attachment", { params: { order_id: order.id, attachment_id: attachment.id } })
        } catch (error) {
            console.log("Error deleting image:", error)
        }
    }

    const handleCameraPress = async () => {
        if (!status?.granted) {
            const permission = await requestPermission()
            if (!permission.granted) {
                return
            }
        }
        setViewingMediaMenu(false)
        try {
            const result = (await ImagePicker.launchCameraAsync({ allowsEditing: true })).assets
            if (result) {
                handleImagePickerAsset(result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleGalleryPress = async () => {
        setViewingMediaMenu(false)
        try {
            const result = (
                await ImagePicker.launchImageLibraryAsync({
                    allowsMultipleSelection: true,
                })
            ).assets

            if (result) {
                handleImagePickerAsset(result)
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(JSON.stringify(error, null, 4))
            }
            console.log(error)
        }
    }

    const handleDrawPress = () => {
        setViewingMediaMenu(false)
        navigation.navigate("Draw", { order })
    }

    const deleteOrder = async () => {
        setDeleting(true)
        try {
            await api.delete(`/order`, { params: { order_id: order.id } })
        } catch (error) {
            console.log("Error deleting order:", error)
        } finally {
            setDeleting(false)
        }
    }

    const generatePdf = async () => {
        if (generatingPdf) return
        setGeneratingPdf(true)
        try {
            const response = await api.get<string>("/order/pdf", {
                params: { order_id: order.id },
            })

            console.log("PDF generated:", response.data)
            return response.data
        } catch (error) {
            console.log("Error generating PDF:", error)
        } finally {
            setGeneratingPdf(false)
        }
    }

    const patchOrder = async (data: Partial<Order>) => {
        if (patchingOrder) return
        setPatchingOrder(true)
        try {
            const response = await api.put<Order>(`/order`, data, { params: { order_id: order.id } })
            console.log("Order patched:", response.data)
            setOrder(response.data)
            return response.data
        } catch (error) {
            console.log("Error patching order:", error)
        } finally {
            setPatchingOrder(false)
        }
    }

    useEffect(() => {
        setGallery(order.attachments)
    }, [order.attachments])

    return {
        deleting,
        deleteOrder,
        viewingMediaMenu,
        setViewingMediaMenu,
        gallery,
        setGallery,
        uploadingImages,
        uploadImages,
        handleCameraPress,
        handleGalleryPress,
        handleDrawPress,
        stateName,
        subtotal,
        total,
        deleteImage,
        setUploadingImages,
        generatingPdf,
        generatePdf,
        patchOrder,
        patchingOrder,
    }
}
