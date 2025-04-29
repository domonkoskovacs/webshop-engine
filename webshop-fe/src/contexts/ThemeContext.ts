import {createContext} from "react";

export type Theme = "dark" | "light" | "system"

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeProviderState>(initialState)


