"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Heart, Star } from "lucide-react"

export default function LoginFormAlternative() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorLines, setErrorLines] = useState<string[]>([])
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorLines([])

    console.log("🔐 Iniciando login para usuario:", username)

    try {
      await login(username, password)
      console.log("✅ Login exitoso, redirigiendo al dashboard")
      router.push("/dashboard")
    } catch (err) {
      console.error("❌ Error en login:", err)
      // Establir les línies d'error com un array
      setErrorLines(["Acreditació inválida o usuari bloquejat.", "Contacti amb l'administrador."])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-4 border-purple-200 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Heart className="h-6 w-6" />
            Login to Pet Academy
            <Star className="h-6 w-6" />
          </CardTitle>
          <CardDescription className="text-purple-100">Enter your magical academy of pets!</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-purple-700 font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-purple-700 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                placeholder="Enter your password"
              />
            </div>
            {errorLines.length > 0 && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">
                {errorLines.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "🌟 Enter Pet Academy 🌟"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-purple-600 mb-2">Don't have an account?</p>
            <Button
              variant="outline"
              onClick={() => router.push("/register")}
              className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 font-medium"
            >
              Create New Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
