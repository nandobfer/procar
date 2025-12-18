import { useEffect, useState } from "react"
import { drawingColors } from "../Screens/Home/Draw/drawingColors"
import { ColorValue, GestureResponderEvent } from "react-native"

export const useDraw = () => {
    const [shouldUndo, setShouldUndo] = useState(false)
    const [updateColor, setUpdateColor] = useState(drawingColors[0])
    const [stroke, setStroke] = useState(10)
    const [currentPath, setCurrentPath] = useState<string[]>([])
    const [paths, setPaths] = useState<{ path: string[]; color: ColorValue; stroke: number }[]>([])

    const onTouchMove = (event: GestureResponderEvent) => {
        const newPath = [...currentPath]

        //get current user touches position
        const locationX = event.nativeEvent.locationX
        const locationY = event.nativeEvent.locationY

        // create new point
        const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(0)},${locationY.toFixed(0)} `

        // add the point to older points
        newPath.push(newPoint)
        setCurrentPath(newPath)
    }

    const onTouchEnd = (event: GestureResponderEvent) => {
        const currentPaths = [...paths]
        const newPath = { path: currentPath, color: updateColor, stroke }

        //push new path with old path and clean current path state
        currentPaths.push(newPath)
        setPaths(currentPaths)
        setCurrentPath([])
    }

    const undo = () => {
        setPaths((paths) => paths.slice(0, -1))
    }

    useEffect(() => {
        if (shouldUndo) {
            undo()
            setShouldUndo(false)
        }
    }, [shouldUndo])

    return { shouldUndo, setShouldUndo, updateColor, setUpdateColor, stroke, setStroke, onTouchMove, onTouchEnd, paths, currentPath }
}
