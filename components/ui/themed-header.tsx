"use client"

import { useTheme } from "@/hooks/use-theme"
import { getUIColors } from "@/config/theme"
import type { ReactNode } from "react"

interface ThemedHeaderProps {
  children: ReactNode
  className?: string
}

export default function ThemedHeader({ children, className = "" }: ThemedHeaderProps) {
  const { currentTheme, isLoaded } = useTheme()
  const uiColors = getUIColors(isLoaded ? currentTheme : "pastel_pink")

  return (
    <div className={`bg-white/80 backdrop-blur-sm border-b-4 ${uiColors.header.border} shadow-lg ${className}`}>
      {children}
    </div>
  )
}
