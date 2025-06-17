"use client"

import { useTheme } from "@/hooks/use-theme"
import { getUIColors } from "@/config/theme"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface ThemedCardProps {
  children: ReactNode
  title?: string | ReactNode
  description?: string
  headerGradient?: boolean
  className?: string
}

export default function ThemedCard({
  children,
  title,
  description,
  headerGradient = false,
  className = "",
}: ThemedCardProps) {
  const { currentTheme, isLoaded } = useTheme()
  const uiColors = getUIColors(isLoaded ? currentTheme : "pastel_pink")

  return (
    <Card className={`border-4 ${uiColors.primary.border} shadow-xl bg-white/90 backdrop-blur-sm ${className}`}>
      {(title || description) && (
        <CardHeader
          className={`text-center ${headerGradient ? `bg-gradient-to-r ${uiColors.header.bg} rounded-t-lg` : ""}`}
        >
          {title && (
            <CardTitle className={headerGradient ? uiColors.header.text : uiColors.primary.text}>
              {typeof title === "string" ? <span className="text-2xl font-bold">{title}</span> : title}
            </CardTitle>
          )}
          {description && (
            <CardDescription
              className={headerGradient ? `${uiColors.header.text} opacity-80` : uiColors.primary.textLight}
            >
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}
