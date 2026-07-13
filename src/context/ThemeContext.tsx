import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { loadValue, saveValue, STORAGE_KEYS } from "@/lib/storage"

type Theme = "light" | "dark"

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => loadValue<Theme>(STORAGE_KEYS.theme, "light"))

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", theme === "dark")
    saveValue(STORAGE_KEYS.theme, theme)
  }, [theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme: () => setTheme((t) => (t === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
