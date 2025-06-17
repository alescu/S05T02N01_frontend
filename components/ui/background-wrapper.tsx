"use client"

import { useEffect, useState } from "react"
import { getImageUrl } from "@/config/images"
import { THEME, getBackgroundStyle, getCurrentTheme } from "@/config/theme"
import { useTheme } from "@/hooks/use-theme"
import type { ReactNode } from "react"

interface BackgroundWrapperProps {
  page: keyof typeof THEME.backgrounds
  children: ReactNode
  className?: string
}

export default function BackgroundWrapper({ page, children, className = "" }: BackgroundWrapperProps) {
  const { currentTheme, isLoaded } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Usar directament currentTheme del context quan estigui carregat
  const activeTheme = mounted && isLoaded ? currentTheme : getCurrentTheme()

  const backgroundImage = getImageUrl("backgrounds", page)

  const backgroundStyle =
    THEME.backgrounds.useImages && backgroundImage
      ? {
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {}

  // Generar les classes de background basades en el tema actiu
  const backgroundClasses = getBackgroundStyle(page as any, activeTheme)

  // Debug per veure els canvis
  useEffect(() => {
    console.log("🎨 BackgroundWrapper theme change:", {
      page,
      activeTheme,
      isLoaded,
      mounted,
      backgroundClasses,
    })
  }, [activeTheme, page, isLoaded, mounted, backgroundClasses])

  return (
    <div className={`min-h-screen ${backgroundClasses} ${className}`} style={backgroundStyle}>
      {/* Overlay opcional si usem imatges */}
      {THEME.backgrounds.useImages && backgroundImage && (
        <div className={`absolute inset-0 ${THEME.backgrounds.overlay}`} />
      )}

      {/* Contingut */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
