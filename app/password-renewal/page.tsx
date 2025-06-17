"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import PasswordRenewalForm from "@/components/auth/password-renewal-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PasswordRenewalPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialUsername, setInitialUsername] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // ⬅️ OPCIONAL: Si ve amb username des del login, usar-lo com a inicial
      const usernameParam = searchParams.get("username")
      if (usernameParam) {
        setInitialUsername(usernameParam)
        console.log("🔄 Password renewal page loaded with initial username:", usernameParam)
      } else {
        console.log("🔄 Password renewal page loaded without initial username")
      }
    }
  }, [mounted, searchParams])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  const handleSuccess = () => {
    console.log("✅ Password renewal successful")
    setShowSuccess(true)
  }

  const handleCancel = () => {
    console.log("🚪 Password renewal cancelled, returning to login")
    router.push("/")
  }

  const handleBackToLogin = () => {
    console.log("🚪 Returning to login after successful renewal")
    router.push("/")
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-cyan-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-green-600 mb-4">✅ Contrasenya Renovada</h1>
            <p className="text-xl text-green-500 font-medium">La vostra contrasenya s'ha actualitzat correctament!</p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border-4 border-green-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-4">Renovació Completada</h2>
                <p className="text-green-700 mb-6">
                  La vostra contrasenya s'ha renovat correctament. Ara podeu iniciar sessió amb la nova contrasenya.
                </p>
                <Button
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  🚪 Anar al Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-orange-600 mb-4">🔄 Renovació de Contrasenya</h1>
          <p className="text-xl text-orange-500 font-medium">
            Renoveu la vostra contrasenya si heu estat marcat per l'administrador
          </p>
        </div>

        <PasswordRenewalForm initialUsername={initialUsername} onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  )
}
