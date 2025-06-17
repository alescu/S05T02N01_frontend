"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/lib/api-service"
import { Heart, Star, RefreshCw } from "lucide-react"
import ThemedCard from "@/components/ui/themed-card"
import ThemedButton from "@/components/ui/themed-button"
import { useTheme } from "@/hooks/use-theme"
import { getUIColors } from "@/config/theme"
import { useLanguage } from "@/hooks/use-language"

export default function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const { currentTheme, isLoaded } = useTheme()
  const router = useRouter()
  const { t } = useLanguage()

  const uiColors = getUIColors(isLoaded ? currentTheme : "pastel_pink")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("🔐 Iniciando login para usuario:", username)

    try {
      // ⬅️ SIMPLIFICAT: Primer verificar l'estat de l'usuari
      console.log("🔍 Verificando estado del usuario antes del login...")

      try {
        const userStatus = await apiService.checkUserStatus(username)
        console.log("🔍 Estado del usuario:", userStatus)

        if (userStatus.requiresPasswordRenewal) {
          console.log("🔄 Usuario requiere renovación de contraseña, redirigiendo...")
          router.push(`/password-renewal?username=${encodeURIComponent(username)}&adminMarked=true`)
          return
        }
      } catch (statusError) {
        console.log("⚠️ No se pudo verificar el estado del usuario, continuando con login normal")
        // Continuar amb el login normal si no es pot verificar l'estat
      }

      // Continuar amb el login normal
      await login(username, password)
      console.log("✅ Login exitoso, redirigiendo al dashboard")
      router.push("/dashboard")
    } catch (err) {
      console.error("❌ Error en login:", err)

      if (err instanceof Error) {
        if (err.message.includes("Session expired") || err.message.includes("sessió ha expirat")) {
          setError("La sessió ha expirat.\nSi us plau, torneu a iniciar sessió.")
        } else if (err.message.includes("Credencials invàlides") || err.message.includes("bloquejat")) {
          setError(err.message)
        } else if (err.message.includes("Account locked") || err.message.includes("renewal required")) {
          console.log("🔄 Account locked detected, redirecting to password renewal...")
          router.push(`/password-renewal?username=${encodeURIComponent(username)}&adminMarked=true`)
          return
        } else {
          setError("Error d'autenticació.\nSi us plau, intenteu-ho de nou.")
        }
      } else {
        setError("Error d'autenticació.\nSi us plau, intenteu-ho de nou.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <ThemedCard
        title={
          <div className="flex items-center justify-center gap-2">
            <Heart className="h-6 w-6" />
            {t("auth", "loginTitle")}
            <Star className="h-6 w-6" />
          </div>
        }
        description={t("auth", "loginSubtitle")}
        headerGradient={true}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className={`${uiColors.primary.text} font-medium`}>
              {t("auth", "username")}
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`border-2 ${uiColors.primary.border} focus:${uiColors.primary.borderFocus} rounded-lg`}
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={`${uiColors.primary.text} font-medium`}>
              {t("auth", "password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`border-2 ${uiColors.primary.border} focus:${uiColors.primary.borderFocus} rounded-lg`}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200 whitespace-pre-line">
              {error}
            </div>
          )}

          <ThemedButton type="submit" disabled={loading} variant="primary" className="w-full py-3 text-lg">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                {t("auth", "loggingIn")}
              </>
            ) : (
              t("auth", "loginButton")
            )}
          </ThemedButton>
        </form>

        {/* ⬅️ LINK FIX DE RENOVACIÓ */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/password-renewal")}
            className={`${uiColors.accent.text} hover:${uiColors.accent.text.replace("-700", "-800")} underline text-sm font-medium flex items-center justify-center gap-1 transition-colors mx-auto`}
          >
            <RefreshCw className="h-3 w-3" />
            {t("auth", "renewPassword")}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className={`${uiColors.primary.text} mb-2`}>{t("auth", "noAccount")}</p>
          {/* ⬅️ CORREGIDO: Usar ThemedButton en lugar de Button */}
          <ThemedButton onClick={() => router.push("/register")} variant="secondary">
            {t("auth", "createAccount")}
          </ThemedButton>
        </div>
      </ThemedCard>
    </div>
  )
}
