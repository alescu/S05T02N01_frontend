"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/use-language"
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/config/languages"
import { Globe, X } from "lucide-react"

export default function LanguageSelector() {
  const { currentLanguage, setLanguage, isLoaded, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug per veure l'estat del selector
  useEffect(() => {
    console.log("🌐 LanguageSelector state:", { currentLanguage, isLoaded, mounted, isOpen })
  }, [currentLanguage, isLoaded, mounted, isOpen])

  // No mostrar el selector fins que estigui muntat i carregat
  if (!mounted || !isLoaded) {
    return null
  }

  const handleLanguageChange = (newLanguage: LanguageCode) => {
    console.log("🌐 LanguageSelector changing language to:", newLanguage)
    setLanguage(newLanguage)
    setIsOpen(false)

    // Forçar un re-render de la pàgina per assegurar que els canvis es veuen
    setTimeout(() => {
      console.log("🌐 Language change completed, current language:", newLanguage)
    }, 100)
  }

  return (
    <>
      {/* Botó flotant per obrir el selector */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-12 h-12 bg-white/90 hover:bg-white border-2 border-blue-200 shadow-lg backdrop-blur-sm"
          variant="outline"
        >
          <Globe className="h-5 w-5 text-blue-600" />
        </Button>
      </div>

      {/* Panel del selector */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50">
          <Card className="border-4 border-blue-200 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-blue-700">{t("languages", "chooseLanguage")}</h3>
                <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, language]) => (
                  <Button
                    key={code}
                    onClick={() => handleLanguageChange(code as LanguageCode)}
                    variant={currentLanguage === code ? "default" : "outline"}
                    className={`w-full justify-start gap-2 ${
                      currentLanguage === code
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "border-blue-200 text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm">{language.name}</span>
                    {currentLanguage === code && <span className="ml-auto text-xs">✓</span>}
                  </Button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-600 text-center">
                  {t("languages", "current", { language: SUPPORTED_LANGUAGES[currentLanguage].name })}
                </p>
                <p className="text-xs text-blue-500 text-center">{t("languages", "saved")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
