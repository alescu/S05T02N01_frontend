"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getCurrentTheme, saveTheme, type ThemeVariant } from "@/config/theme"

interface ThemeContextType {
  currentTheme: ThemeVariant
  setTheme: (theme: ThemeVariant) => void
  isLoaded: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeVariant>("pastel_pink")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Carregar el tema des de localStorage després de la hidratació
    const savedTheme = getCurrentTheme()
    console.log("🎨 ThemeProvider loading saved theme:", savedTheme)
    setCurrentTheme(savedTheme)
    setIsLoaded(true)
  }, [])

  const setTheme = (theme: ThemeVariant) => {
    console.log("🎨 ThemeProvider changing theme from", currentTheme, "to", theme)
    setCurrentTheme(theme)
    saveTheme(theme)
  }

  // Debug per veure l'estat del context
  useEffect(() => {
    console.log("🎨 ThemeProvider state:", { currentTheme, isLoaded })
  }, [currentTheme, isLoaded])

  return <ThemeContext.Provider value={{ currentTheme, setTheme, isLoaded }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    console.warn("⚠️ useTheme called outside ThemeProvider, returning defaults")
    // Retornar valors per defecte en lloc de llançar error
    return {
      currentTheme: "pastel_pink" as ThemeVariant,
      setTheme: () => {},
      isLoaded: false,
    }
  }
  return context
}
