// Utilitat per decodificar JWT tokens
export function decodeJWT(token: string): any {
  try {
    // Un JWT té 3 parts separades per punts: header.payload.signature
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Token JWT invàlid")
    }

    // El payload és la segona part (índex 1)
    const payload = parts[1]

    // Decodificar de base64
    const decoded = atob(payload)

    // Parsejar com JSON
    const parsed = JSON.parse(decoded)

    console.log("🔍 JWT decodificat:", parsed)
    return parsed
  } catch (error) {
    console.error("❌ Error decodificant JWT:", error)
    return null
  }
}

export function extractRolesFromToken(token: string): string[] {
  try {
    const decoded = decodeJWT(token)
    if (!decoded) return []

    // Els rols poden estar en diferents camps segons com es configuri el JWT
    // Provem diferents possibilitats
    const roles = decoded.roles || decoded.authorities || decoded.scope || []

    console.log("🎭 Rols extrets del token:", roles)

    // Assegurar que és un array
    if (Array.isArray(roles)) {
      return roles
    } else if (typeof roles === "string") {
      // Si és un string separat per comes o espais
      return roles.split(/[,\s]+/).filter((role) => role.length > 0)
    }

    return []
  } catch (error) {
    console.error("❌ Error extraient rols del token:", error)
    return []
  }
}

export function getUserRoleFromToken(token: string): string {
  const roles = extractRolesFromToken(token)

  // Prioritzar els rols d'admin
  if (roles.includes("ROLE_ADMIN") || roles.includes("ADMIN")) {
    return "ROLE_ADMIN"
  } else if (roles.includes("ROLE_SUB_ADMIN") || roles.includes("SUB_ADMIN")) {
    return "ROLE_SUB_ADMIN"
  } else if (roles.includes("ROLE_USER") || roles.includes("USER")) {
    return "ROLE_USER"
  }

  // Fallback: si hi ha qualsevol rol, usar el primer
  if (roles.length > 0) {
    const firstRole = roles[0]
    // Assegurar que comença amb ROLE_
    return firstRole.startsWith("ROLE_") ? firstRole : `ROLE_${firstRole}`
  }

  // Default
  return "ROLE_USER"
}
