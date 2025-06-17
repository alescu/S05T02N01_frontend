"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Sparkles } from "lucide-react"
import BackgroundWrapper from "@/components/ui/background-wrapper"
import ThemedCard from "@/components/ui/themed-card"
import ThemedButton from "@/components/ui/themed-button"
import { useTheme } from "@/hooks/use-theme"
import { getUIColors } from "@/config/theme"
import { useLanguage } from "@/hooks/use-language"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const { register } = useAuth()
  const { currentTheme, isLoaded } = useTheme()
  const { t } = useLanguage()
  const router = useRouter()

  const uiColors = getUIColors(isLoaded ? currentTheme : "pastel_pink")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("📝 Iniciando registro para usuario:", formData.username)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      setLoading(false)
      return
    }

    try {
      await register(formData.username, formData.email, formData.password, "user")
      console.log("✅ Registro exitoso, redirigiendo al dashboard")
      router.push("/dashboard")
    } catch (err) {
      console.error("❌ Error en registro:", err)
      setError("Error en el registro. Por favor, inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!mounted) {
    return (
      <BackgroundWrapper page="register">
        <div className="flex items-center justify-center min-h-screen">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${uiColors.primary.border}`}></div>
        </div>
      </BackgroundWrapper>
    )
  }

  return (
    <BackgroundWrapper page="register">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className={`text-5xl font-bold ${uiColors.primary.text} mb-4`}>{t("register", "title")}</h1>
          <p className={`text-xl ${uiColors.primary.textLight} font-medium`}>{t("register", "subtitle")}</p>
        </div>

        <div className="max-w-md mx-auto">
          <ThemedCard
            title={
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6" />
                {t("register", "createAccountTitle")}
                <Sparkles className="h-6 w-6" />
              </div>
            }
            description={t("register", "createAccountSubtitle")}
            headerGradient={true}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className={`${uiColors.primary.text} font-medium`}>
                  {t("auth", "username")}
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                  className={`border-2 ${uiColors.primary.border} focus:${uiColors.primary.borderFocus} rounded-lg`}
                  placeholder="Choose a cool username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={`${uiColors.primary.text} font-medium`}>
                  {t("register", "email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className={`border-2 ${uiColors.primary.border} focus:${uiColors.primary.borderFocus} rounded-lg`}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={`${uiColors.primary.text} font-medium`}>
                  {t("auth", "password")}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  className={`border-2 ${uiColors.primary.border} focus:${uiColors.primary.borderFocus} rounded-lg`}
                  placeholder="Create a strong password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`${uiColors.primary.text} font-medium`}>
                  {t("register", "confirmPassword")}
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  className={`border-2 ${uiColors.primary.border} focus:${uiColors.primary.borderFocus} rounded-lg`}
                  placeholder="Confirm your password"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <ThemedButton type="submit" disabled={loading} variant="accent" className="w-full py-3 text-lg">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    {t("register", "creating")}
                  </>
                ) : (
                  t("register", "createButton")
                )}
              </ThemedButton>
            </form>

            <div className="mt-6 text-center">
              <p className={`${uiColors.primary.text} mb-2`}>{t("register", "alreadyHaveAccount")}</p>
              <ThemedButton onClick={() => router.push("/")} variant="outline">
                {t("register", "backToLogin")}
              </ThemedButton>
            </div>
          </ThemedCard>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
