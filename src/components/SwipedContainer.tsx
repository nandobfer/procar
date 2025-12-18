import { RectButton } from "react-native-gesture-handler"
import { ActivityIndicator, Text } from "react-native-paper"

export const SwipedContainer: React.FC<{ label: string; color: string; direction: "left" | "right", loading?: boolean }> = ({ label, color, direction, loading }) => (
    <RectButton
        style={{
            flex: 1,
            backgroundColor: color,
            justifyContent: "center",
            paddingHorizontal: 20,
            alignItems: direction === "left" ? "flex-start" : "flex-end",
            borderRadius: 8,
            gap: 10,
        }}
    >
        {loading && <ActivityIndicator color="white"  />}
        {!loading && <Text style={{ color: "white", fontWeight: "bold" }}>{label}</Text>}
    </RectButton>
)
