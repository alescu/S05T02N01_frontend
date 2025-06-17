"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { apiService } from "@/lib/api-service"
import { RefreshCw, ArrowLeft, Shield } from "lucide-react"

interface PasswordRenewalFormProps {
  initialUsername?: string // ⬅️ OPCIONAL: Username inicial si ve de login
  onSuccess: () => void
  onCancel: () => void
}

export default function PasswordRenewalForm({ initialUsername = "", onSuccess, onCancel }: PasswordRenewalFormProps) {
  const [username, setUsername] = useState(initialUsername)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    console.log("🔄 Iniciando renovación de contraseña para usuario:", username)

    // Validacions
    if (!username.trim()) {
      setError("El nom d'usuari és obligatori.")
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("La nova contrasenya ha de tenir almenys 8 caràcters.")
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les contrasenyes noves no coincideixen.")
      setLoading(false)
      return
    }

    try {
      // ⬅️ MODIFICAT: Usar el nou endpoint /auth/userRenewPassword
      console.log("🔄 Llamando a userRenewPassword...")
      const response = await apiService.userRenewPassword(username.trim(), newPassword)
      console.log("✅ Contrasenya renovada correctament")

      // ⬅️ Si retorna token, podríem fer login automàtic
      if (response.token) {
        console.log("🔑 Token rebut, renovació amb credencials completada")
      }

      // Mostrar missatge d'èxit i redirigir
      onSuccess()
    } catch (err) {
      console.error("❌ Error en renovació de contrasenya:", err)

      if (err instanceof Error) {
        if (err.message.includes("403") || err.message.includes("Not marked for renewal")) {
          setError("Aquest usuari no està marcat per renovació.\nContacti amb l'administrador.")
        } else if (err.message.includes("404")) {
          setError("Usuari no trobat.")
        } else if (err.message.includes("400")) {
          setError("Dades invàlides. Si us plau, reviseu els camps.")
        } else if (err.message.includes("401")) {
          setError(
            "No teniu permisos per renovar aquesta contrasenya.\nL'usuari ha de estar marcat per l'administrador.",
          )
        } else {
          setError("Error en renovar la contrasenya.\nSi us plau, intenteu-ho de nou.")
        }
      } else {
        setError("Error en renovar la contrasenya.\nSi us plau, intenteu-ho de nou.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-4 border-orange-200 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <RefreshCw className="h-6 w-6" />
            Renovació de Contrasenya
            <Shield className="h-6 w-6" />
          </CardTitle>
          <CardDescription className="text-orange-100">
            Renoveu la vostra contrasenya si heu estat marcat per l'administrador
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-700 text-sm text-center">
              <strong>Instruccions:</strong>
            </p>
            <p className="text-orange-600 text-xs text-center mt-1">
              Introduïu el vostre nom d'usuari i la nova contrasenya. Aquesta opció només funciona si heu estat marcat
              per renovació per un administrador.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-orange-700 font-medium">
                Nom d'usuari
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                placeholder="Introduïu el vostre nom d'usuari"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-orange-700 font-medium">
                Nova Contrasenya
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                placeholder="Introduïu la nova contrasenya (mínim 8 caràcters)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-orange-700 font-medium">
                Confirmar Nova Contrasenya
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="border-2 border-orange-200 focus:border-orange-400 rounded-lg"
                placeholder="Confirmeu la nova contrasenya"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200 whitespace-pre-line">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading || !username.trim() || !newPassword || !confirmPassword}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Renovant...
                  </>
                ) : (
                  "🔄 Renovar Contrasenya"
                )}
              </Button>

              <Button
                type="button"
                onClick={onCancel}
                disabled={loading}
                variant="outline"
                className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Tornar
              </Button>
            </div>
          </form>

          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-xs text-center">
              <strong>Consells de seguretat:</strong>
            </p>
            <ul className="text-blue-600 text-xs mt-1 space-y-1">
              <li>• Utilitzeu almenys 8 caràcters</li>
              <li>• Combineu lletres, números i símbols</li>
              <li>• No reutilitzeu contrasenyes anteriors</li>
              <li>• Aquesta renovació només funciona si heu estat marcat per l'administrador</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
