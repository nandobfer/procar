import React from "react"
import { navigation_theme, paper_theme } from "./style/theme"
import { Snackbar } from "./components/Snackbar"
import { SnackbarProvider } from "./contexts/snackbarContext"
import { PaperProvider, Text } from "react-native-paper"
import constants from "expo-constants"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NavigationContainer } from "@react-navigation/native"
import { MD3LightTheme as DefaultTheme, MD3Theme, configureFonts } from "react-native-paper"
import { DefaultTheme as NavigationTheme } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

interface ProvidersProps {
    children?: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
    return (
        <GestureHandlerRootView>
            <PaperProvider theme={{ dark: false, colors: { ...DefaultTheme.colors, primary: "#426aac" } }}>
                <NavigationContainer
                    theme={{ ...NavigationTheme, colors: { ...NavigationTheme.colors, background: DefaultTheme.colors.background } }}
                >
                    <QueryClientProvider client={new QueryClient()}>
                        <SnackbarProvider>
                            {children}
                            <Snackbar />
                            <Text style={{ position: "absolute", bottom: 5, right: 5, color: "red" }}>{constants.expoConfig?.version}</Text>
                        </SnackbarProvider>
                    </QueryClientProvider>
                </NavigationContainer>
            </PaperProvider>
        </GestureHandlerRootView>
    )
}
