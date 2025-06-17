"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/hooks/use-theme"
import { THEME_VARIANTS, type ThemeVariant } from "@/config/theme"
import { Palette, X } from "lucide-react"

export default function ThemeSelector() {
  const { currentTheme, setTheme, isLoaded } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug per veure l'estat del selector
  useEffect(() => {
    console.log("🎨 ThemeSelector state:", { currentTheme, isLoaded, mounted, isOpen })
  }, [currentTheme, isLoaded, mounted, isOpen])

  // No mostrar el selector fins que estigui muntat i carregat
  if (!mounted || !isLoaded) {
    return null
  }

  const handleThemeChange = (newTheme: ThemeVariant) => {
    console.log("🎨 ThemeSelector changing theme to:", newTheme)
    setTheme(newTheme)
    setIsOpen(false)

    // Forçar un re-render de la pàgina per assegurar que els canvis es veuen
    setTimeout(() => {
      console.log("🎨 Theme change completed, current theme:", newTheme)
    }, 100)
  }

  return (
    <>
      {/* Botó flotant per obrir el selector */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-12 h-12 bg-white/90 hover:bg-white border-2 border-purple-200 shadow-lg backdrop-blur-sm"
          variant="outline"
        >
          <Palette className="h-5 w-5 text-purple-600" />
        </Button>
      </div>

      {/* Panel del selector */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <Card className="border-4 border-purple-200 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-purple-700">Choose Theme</h3>
                <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {Object.entries(THEME_VARIANTS).map(([key, theme]) => (
                  <Button
                    key={key}
                    onClick={() => handleThemeChange(key as ThemeVariant)}
                    variant={currentTheme === key ? "default" : "outline"}
                    className={`w-full justify-start gap-2 ${
                      currentTheme === key
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "border-purple-200 text-purple-700 hover:bg-purple-50"
                    }`}
                  >
                    <span className="text-lg">{theme.icon}</span>
                    <span className="text-sm">{theme.name}</span>
                    {currentTheme === key && <span className="ml-auto text-xs">✓</span>}
                  </Button>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-xs text-purple-600 text-center">Current: {THEME_VARIANTS[currentTheme].name}</p>
                <p className="text-xs text-purple-500 text-center">Theme saved automatically</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
