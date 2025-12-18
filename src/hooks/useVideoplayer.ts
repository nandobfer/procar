import { useContext } from "react"
import VideoPlayerContext from "../contexts/videoplayerContext"

export const useVideoPlayer = () => {
    const videoContext = useContext(VideoPlayerContext)

    return { ...videoContext }
}
