"use client"

import { useTheme } from "@/hooks/use-theme"
import { getUIColors } from "@/config/theme"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface ThemedButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "accent" | "outline" | "destructive"
  size?: "sm" | "default" | "lg"
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

export default function ThemedButton({
  children,
  onClick,
  variant = "primary",
  size = "default",
  disabled = false,
  className = "",
  type = "button",
}: ThemedButtonProps) {
  const { currentTheme, isLoaded } = useTheme()
  const uiColors = getUIColors(isLoaded ? currentTheme : "pastel_pink")

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return `${uiColors.primary.bg} hover:${uiColors.primary.bgHover} ${uiColors.primary.textOnBg} font-bold shadow-lg transform hover:scale-105 transition-all duration-200`
      case "secondary":
        return `${uiColors.secondary.bg} hover:${uiColors.secondary.bgHover} ${uiColors.secondary.textOnBg} font-bold shadow-lg transform hover:scale-105 transition-all duration-200`
      case "accent":
        return `${uiColors.accent.bg} hover:${uiColors.accent.bgHover} ${uiColors.accent.textOnBg} font-bold shadow-lg transform hover:scale-105 transition-all duration-200`
      case "outline":
        // ⬅️ ARREGLAT: Forçar els estils per evitar conflictes amb shadcn
        return `
          border-2 border-gray-200 
          ${uiColors.primary.text} 
          bg-white/90 
          hover:border-purple-300
          hover:bg-white/90
          hover:${uiColors.primary.text}
          shadow-sm 
          font-medium
          transition-all duration-200
        `
          .replace(/\s+/g, " ")
          .trim()
      case "destructive":
        return `bg-red-125 hover:bg-red-175 text-red-700 font-bold shadow-lg transform hover:scale-105 transition-all duration-200`
      default:
        return `${uiColors.primary.bg} hover:${uiColors.primary.bgHover} ${uiColors.primary.textOnBg} font-bold shadow-lg transform hover:scale-105 transition-all duration-200`
    }
  }

  return (
    <Button
      onClick={onClick}
      size={size}
      disabled={disabled}
      type={type}
      variant="ghost" // ⬅️ IMPORTANT: Usar variant="ghost" per evitar estils per defecte
      className={`${getVariantClasses()} ${disabled ? "opacity-50 transform-none" : ""} ${className}`}
    >
      {children}
    </Button>
  )
}
