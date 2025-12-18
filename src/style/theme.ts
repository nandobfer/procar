import { MD3LightTheme as DefaultTheme, MD3Theme, configureFonts } from "react-native-paper"
import { DefaultTheme as NavigationTheme } from "@react-navigation/native"
import { colors } from "./colors"

export const paper_theme: MD3Theme = {
    ...DefaultTheme,

    // Font configuration

    // Roundness
    roundness: 8,

    // Animation
    animation: {
        scale: 1.0,
    },

    // Complete color mapping
    colors: {
        ...DefaultTheme.colors,

        // Primary colors
        primary: colors.primary,
        onPrimary: colors.onPrimary,
        primaryContainer: colors.surfaceVariant,
        onPrimaryContainer: colors.primary,

        // Secondary colors
        secondary: colors.secondary,
        onSecondary: colors.onSecondary,
        secondaryContainer: colors.surfaceVariant,
        onSecondaryContainer: colors.secondary,

        // Tertiary colors
        tertiary: colors.tertiary,
        onTertiary: colors.onBackground,
        tertiaryContainer: colors.surfaceVariant,
        onTertiaryContainer: colors.tertiary,

        // Background colors
        background: colors.background,
        onBackground: colors.onBackground,

        // Surface colors
        surface: colors.surface,
        onSurface: colors.onSurface,
        surfaceVariant: colors.surfaceVariant,
        onSurfaceVariant: colors.onSurfaceVariant,

        // Outline colors
        outline: colors.outline,
        outlineVariant: colors.outlineVariant,

        // Error colors
        error: colors.error,
        onError: colors.onPrimary,
        errorContainer: "#FDEDE8",
        onErrorContainer: colors.error,

        // Disabled state
        surfaceDisabled: colors.surfaceDisabled,
        onSurfaceDisabled: colors.onSurfaceVariant,

        // Inverse colors
        inverseSurface: colors.inverseSurface,
        inverseOnSurface: colors.inverseOnSurface,
        inversePrimary: colors.inversePrimary,

        // Elevation colors
        elevation: {
            ...DefaultTheme.colors.elevation,
            ...colors.elevation,
        },

        // Other colors
        shadow: colors.shadow,
        scrim: colors.scrim,
        backdrop: colors.backdrop,
    },
}

// Enhanced Navigation theme - properly mapped
export const navigation_theme = {
    ...NavigationTheme,
    ...paper_theme,

    colors: {
        ...NavigationTheme.colors,

        // Map Paper theme colors to Navigation theme colors
        primary: paper_theme.colors.primary,
        background: paper_theme.colors.background,
        card: paper_theme.colors.surface,
        text: paper_theme.colors.onBackground,
        border: paper_theme.colors.outline,
        notification: paper_theme.colors.error,

        // Additional mappings for better integration
        primaryContainer: paper_theme.colors.primaryContainer,
        onPrimary: paper_theme.colors.onPrimary,
        onBackground: paper_theme.colors.onBackground,
        onSurface: paper_theme.colors.onSurface,
    },

    // Fonts for navigation (if needed)
    fonts: paper_theme.fonts,
}