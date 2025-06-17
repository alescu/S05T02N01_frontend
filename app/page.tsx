"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import LoginForm from "@/components/auth/login-form"
import BackgroundWrapper from "@/components/ui/background-wrapper"
import { useTheme } from "@/hooks/use-theme"
import { getUIColors } from "@/config/theme"
import { useLanguage } from "@/hooks/use-language"

export default function HomePage() {
  const { user, loading } = useAuth()
  const { currentTheme, isLoaded } = useTheme()
  const { t } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  const uiColors = getUIColors(isLoaded ? currentTheme : "pastel_pink")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && user) {
      // ⬅️ REDIRIGIR SEGONS EL ROL
      if (user.role === "ROLE_ADMIN" || user.role === "ROLE_SUB_ADMIN") {
        console.log("🔧 Admin user detected, redirecting to admin panel")
        router.push("/admin")
      } else {
        console.log("👤 Regular user detected, redirecting to dashboard")
        router.push("/dashboard")
      }
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <BackgroundWrapper page="login">
        <div className="flex items-center justify-center min-h-screen">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${uiColors.primary.border}`}></div>
        </div>
      </BackgroundWrapper>
    )
  }

  return (
    <BackgroundWrapper page="login">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-6xl font-bold ${uiColors.primary.text} mb-4`}>🐾 Pet Academy 🐾</h1>
          <p className={`text-xl ${uiColors.primary.textLight} font-medium`}>{t("auth", "loginSubtitle")}</p>
        </div>
        <LoginForm />
      </div>
    </BackgroundWrapper>
  )
}
