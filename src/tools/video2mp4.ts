import { FFmpegKit } from "ffmpeg-kit-react-native"
import * as FileSystem from "expo-file-system"

export const video2mp4 = async (uri: string, name: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<string> => {
    try {
        const outputUri = `${FileSystem.cacheDirectory}/${name}.mp4`
        const command = `-i ${uri} -c:v h264 -b:v 10M -c:a aac -b:a 128k ${outputUri}`

        setLoading(true)

        // Return a promise that resolves only after the video conversion completes
        return new Promise((resolve, reject) => {
            FFmpegKit.executeAsync(
                command,
                async (session) => {
                    const returnCode = await session.getReturnCode()
                    setLoading(false)
                    if (returnCode.isValueSuccess()) {
                        console.log("Video converted successfully")
                        resolve(outputUri) // Resolve with the output URI after conversion
                    } else {
                        console.error("Video conversion failed", returnCode)
                        reject(new Error("Video conversion failed"))
                    }
                },
                (log) => {
                    // You can handle logs here if needed
                    // console.log(log.getMessage())
                },
                (statistics) => {
                    // Progress tracking here if needed
                }
            )
        })
    } catch (error) {
        console.log(error)
        setLoading(false) // Ensure loading is turned off in case of error
        throw error
    }
}
