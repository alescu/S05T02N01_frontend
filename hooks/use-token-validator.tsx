"use client"

import { useEffect } from "react"
import { useAuth } from "./use-auth"
import { decodeJWT } from "@/lib/jwt-utils"

export function useTokenValidator() {
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) return

    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token")
      if (!token) {
        console.log("🚪 No token found, logging out...")
        logout()
        return
      }

      try {
        const decoded = decodeJWT(token)
        if (!decoded || !decoded.exp) {
          console.log("🚪 Invalid token format, logging out...")
          logout()
          return
        }

        const currentTime = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = decoded.exp - currentTime

        console.log(`🕐 Token expires in ${timeUntilExpiry} seconds`)

        if (timeUntilExpiry <= 0) {
          console.log("🚪 Token expired, logging out...")
          logout()
          return
        }

        // Si queden menys de 5 minuts, mostrar advertència
        if (timeUntilExpiry <= 300) {
          console.warn("⚠️ Token expires in less than 5 minutes")
        }
      } catch (error) {
        console.error("❌ Error checking token expiration:", error)
        logout()
      }
    }

    // Verificar immediatament
    checkTokenExpiration()

    // Verificar cada 60 segons
    const interval = setInterval(checkTokenExpiration, 60000)

    return () => clearInterval(interval)
  }, [user, logout])
}
