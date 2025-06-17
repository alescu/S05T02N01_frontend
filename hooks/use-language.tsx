"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getCurrentLanguage, saveLanguage, getTranslation, type LanguageCode } from "@/config/languages"

interface LanguageContextType {
  currentLanguage: LanguageCode
  setLanguage: (language: LanguageCode) => void
  isLoaded: boolean
  t: (
    section: keyof typeof import("@/config/languages").TRANSLATIONS,
    key: string,
    variables?: Record<string, string | number>,
  ) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("ca")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Carregar l'idioma des de localStorage després de la hidratació
    const savedLanguage = getCurrentLanguage()
    console.log("🌐 LanguageProvider loading saved language:", savedLanguage)
    setCurrentLanguage(savedLanguage)
    setIsLoaded(true)
  }, [])

  const setLanguage = (language: LanguageCode) => {
    console.log("🌐 LanguageProvider changing language from", currentLanguage, "to", language)
    setCurrentLanguage(language)
    saveLanguage(language)
  }

  // Funció helper per traduccions
  const t = (
    section: keyof typeof import("@/config/languages").TRANSLATIONS,
    key: string,
    variables?: Record<string, string | number>,
  ) => {
    return getTranslation(section, key, currentLanguage, variables)
  }

  // Debug per veure l'estat del context
  useEffect(() => {
    console.log("🌐 LanguageProvider state:", { currentLanguage, isLoaded })
  }, [currentLanguage, isLoaded])

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, isLoaded, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    console.warn("⚠️ useLanguage called outside LanguageProvider, returning defaults")
    // Retornar valors per defecte en lloc de llançar error
    return {
      currentLanguage: "ca" as LanguageCode,
      setLanguage: () => {},
      isLoaded: false,
      t: (section: any, key: string) => key, // Fallback que retorna la clau
    }
  }
  return context
}
