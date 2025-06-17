"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiService } from "@/lib/api-service"
import { getUserRoleFromToken, decodeJWT } from "@/lib/jwt-utils"
import type { Pet } from "@/types/pet"

interface User {
  username: string
  email: string
  role: string
  pets?: Pet[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, userType: string) => Promise<void>
  logout: () => void
  refreshUserPets: () => Promise<Pet[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // ⬅️ NUEVO: Registrar callback de logout automàtic
    apiService.setLogoutCallback(() => {
      console.log("🚪 Token expirat detectat, netejant sessió...")
      setUser(null)
      // No cal netejar localStorage aquí perquè ja ho fa apiService

      // Redirigir al login si no hi som ja
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/"
      }
    })

    console.log("🔄 Verificando sesión almacenada...")

    // Check for existing token on mount
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    console.log("🔑 Token almacenado:", token ? `${token.substring(0, 30)}...` : "Ninguno")
    console.log("👤 Usuario almacenado:", userData ? "Encontrado" : "Ninguno")

    if (token && userData && token.trim() !== "") {
      try {
        const parsedUser = JSON.parse(userData)

        // ⬅️ VERIFICAR EL ROL DEL TOKEN ACTUAL
        console.log("🔍 Verificant rol del token emmagatzemat...")
        const tokenRole = getUserRoleFromToken(token)
        console.log("🎭 Rol del token:", tokenRole)
        console.log("🎭 Rol emmagatzemat:", parsedUser.role)

        // Si el rol del token és diferent, actualitzar
        if (tokenRole !== parsedUser.role) {
          console.log("🔄 Actualitzant rol d'usuari del token")
          parsedUser.role = tokenRole
          localStorage.setItem("user", JSON.stringify(parsedUser))
        }

        setUser(parsedUser)

        // CRÍTICO: Solo establecer el token si es válido
        apiService.setToken(token)
        console.log("✅ Sesión restaurada para usuario:", parsedUser.username, "con rol:", parsedUser.role)
      } catch (error) {
        console.error("❌ Error al restaurar la sesión:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        apiService.setToken("") // Limpiar token corrupto
      }
    } else {
      console.log("❌ No se encontró sesión válida")
      apiService.setToken("") // Asegurar que no hay token residual
    }

    setLoading(false)
  }, [mounted])

  const login = async (username: string, password: string) => {
    console.log("🔐 Iniciando proceso de login para:", username)

    try {
      const response = await apiService.login(username, password)

      console.log("✅ Login exitoso para:", username)
      console.log("🔑 Token recibido:", response.token ? `${response.token.substring(0, 30)}...` : "Ninguno")

      // ⬅️ NUEVO: Verificar si l'usuari està marcat per renovació
      if (response.accountLockedAt) {
        console.log("🔄 Usuario marcado para renovación, lanzando error específico")
        throw new Error("Account locked for renewal. Password renewal required.")
      }

      // Verificar que el token es válido antes de continuar
      if (!response.token || response.token.trim() === "") {
        throw new Error("Token inválido recibido del servidor")
      }

      // ⬅️ EXTREURE EL ROL DEL TOKEN JWT
      console.log("🔍 Extraient rol del token JWT...")
      const tokenRole = getUserRoleFromToken(response.token)
      console.log("🎭 Rol extret del token:", tokenRole)

      // També mostrar el contingut complet del token per debug
      const decodedToken = decodeJWT(response.token)
      console.log("🔍 Token JWT complet decodificat:", decodedToken)

      const userData = {
        username: response.authUsername,
        email: "",
        role: tokenRole, // ⬅️ USAR EL ROL DEL TOKEN
        pets: response.pets || [],
      }

      console.log("👤 Estableciendo datos de usuario:", userData)

      // Guardar en localStorage
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(userData))

      // Establecer en el estado
      setUser(userData)

      // CRÍTICO: Asegurar que el token está en el servicio
      apiService.setToken(response.token)
      console.log("✅ Login completado, token establecido en servicio")

      // Verificación final
      const storedToken = localStorage.getItem("token")
      console.log("🔍 Verificación final - token en localStorage:", storedToken ? "✅" : "❌")
    } catch (error) {
      console.error("❌ Error durante el login:", error)

      // ⬅️ NUEVO: Gestió específica d'errors d'autenticació
      if (error instanceof Error) {
        if (error.message.includes("Session expired")) {
          // Ja s'ha gestionat l'expiració, només propagar l'error
          throw new Error("La sessió ha expirat. Si us plau, torneu a iniciar sessió.")
        } else if (error.message.includes("Account locked") || error.message.includes("renewal required")) {
          // Propagar l'error de renovació perquè el component pugui gestionar-lo
          throw error
        } else if (error.message.includes("401")) {
          throw new Error("Credencials invàlides o usuari bloquejat.\nContacti amb l'administrador.")
        }
      }

      throw error
    }
  }

  const register = async (username: string, email: string, password: string, userType: string) => {
    console.log("📝 Iniciando proceso de registro para:", username)

    try {
      const response = await apiService.register(username, email, password, userType)

      console.log("✅ Registro exitoso para:", username)
      console.log("🔑 Token recibido:", response.token ? `${response.token.substring(0, 30)}...` : "Ninguno")

      // Verificar que el token es válido antes de continuar
      if (!response.token || response.token.trim() === "") {
        throw new Error("Token inválido recibido del servidor")
      }

      // ⬅️ EXTREURE EL ROL DEL TOKEN JWT
      console.log("🔍 Extraient rol del token JWT...")
      const tokenRole = getUserRoleFromToken(response.token)
      console.log("🎭 Rol extret del token:", tokenRole)

      const userData = {
        username: response.authUsername,
        email,
        role: tokenRole, // ⬅️ USAR EL ROL DEL TOKEN
        pets: response.pets || [],
      }

      console.log("👤 Estableciendo datos de usuario:", userData)

      // Guardar en localStorage
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(userData))

      // Establecer en el estado
      setUser(userData)

      // CRÍTICO: Asegurar que el token está en el servicio
      apiService.setToken(response.token)
      console.log("✅ Registro completado, token establecido en servicio")

      // Verificación final
      const storedToken = localStorage.getItem("token")
      console.log("🔍 Verificación final - token en localStorage:", storedToken ? "✅" : "❌")
    } catch (error) {
      console.error("❌ Error durante el registro:", error)
      throw error
    }
  }

  const refreshUserPets = async (): Promise<Pet[]> => {
    if (!user) {
      console.log("❌ No hay usuario disponible para actualizar mascotas")
      return []
    }

    console.log("🔄 Actualizando mascotas para usuario:", user.username)

    // Verificar que tenemos token antes de hacer la petición
    const currentToken = localStorage.getItem("token")
    if (!currentToken || currentToken.trim() === "") {
      console.error("❌ No hay token disponible para actualizar mascotas")
      throw new Error("Se requiere autenticación")
    }

    // Asegurar que el token está en el servicio
    apiService.setToken(currentToken)
    console.log("🔑 Token verificado para actualización de mascotas")

    try {
      const pets = await apiService.getUserPets(user.username)

      // Actualizamos el usuario con las nuevas mascotas
      const updatedUser = { ...user, pets }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      console.log("✅ Mascotas actualizadas correctamente:", pets.length)
      return pets
    } catch (error) {
      console.error("❌ Error al actualizar mascotas:", error)
      return user.pets || []
    }
  }

  const logout = () => {
    console.log("🚪 Cerrando sesión...")
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    apiService.setToken("") // Limpiar el token del servicio
    console.log("✅ Sesión cerrada correctamente")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUserPets }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
