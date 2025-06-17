const API_BASE_URL = "http://localhost:8081"

class ApiService {
  private token = ""
  private logoutCallback: (() => void) | null = null

  setToken(token: string) {
    if (token === "") {
      console.log("🧹 Limpiando token (estableciendo vacío)")
      this.token = ""
      return
    }

    if (!token || token.trim() === "") {
      console.error("❌ Intentando establecer un token inválido:", token)
      this.token = ""
      return
    }

    this.token = token
    console.log("🔑 Token establecido correctamente:", `${token.substring(0, 30)}...`)
  }

  setLogoutCallback(callback: () => void) {
    this.logoutCallback = callback
  }

  // Test específico para verificar que el header llega al backend
  async testAuthHeader() {
    console.log("🧪 Probando si el header Authorization llega al backend...")

    if (!this.token) {
      console.error("❌ No hay token para probar")
      return { success: false, error: "No token available" }
    }

    try {
      // Hacer una petición simple que requiera autenticación
      const response = await fetch(`${API_BASE_URL}/user/test/pet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        mode: "cors",
        credentials: "omit",
      })

      console.log("📊 Estado de respuesta:", response.status)
      console.log("📊 Headers de respuesta:", Object.fromEntries(response.headers.entries()))

      if (response.status === 401) {
        console.error("❌ 401 - El header Authorization NO llegó al backend o el token es inválido")
        return { success: false, error: "Authorization header not received by backend" }
      }

      if (response.status === 404) {
        console.log("✅ 404 - El header Authorization SÍ llegó al backend (endpoint no existe pero pasó autenticación)")
        return { success: true, message: "Authorization header received by backend" }
      }

      if (response.ok) {
        console.log("✅ 200 - El header Authorization llegó correctamente")
        return { success: true, message: "Authorization header working correctly" }
      }

      return { success: false, error: `Unexpected status: ${response.status}` }
    } catch (error) {
      console.error("❌ Error probando header Authorization:", error)
      return { success: false, error: error.message }
    }
  }

  // Método para probar CORS específicamente
  async testCors() {
    console.log("🧪 Probando configuración CORS...")

    try {
      // Primero, hacer una petición OPTIONS (preflight)
      const optionsResponse = await fetch(`${API_BASE_URL}/user/test/pet`, {
        method: "OPTIONS",
        headers: {
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "Authorization, Content-Type",
        },
        mode: "cors",
        credentials: "omit",
      })

      console.log("✅ Respuesta OPTIONS (preflight):", optionsResponse.status)
      console.log("📋 Headers de respuesta OPTIONS:", Object.fromEntries(optionsResponse.headers.entries()))

      const allowedHeaders = optionsResponse.headers.get("Access-Control-Allow-Headers")
      const allowedMethods = optionsResponse.headers.get("Access-Control-Allow-Methods")
      const allowedOrigin = optionsResponse.headers.get("Access-Control-Allow-Origin")
      const allowCredentials = optionsResponse.headers.get("Access-Control-Allow-Credentials")

      console.log("🔍 CORS Headers:")
      console.log("  Allow-Headers:", allowedHeaders)
      console.log("  Allow-Methods:", allowedMethods)
      console.log("  Allow-Origin:", allowedOrigin)
      console.log("  Allow-Credentials:", allowCredentials)

      // Verificar si Authorization está permitido
      const authAllowed = allowedHeaders?.includes("Authorization") || allowedHeaders?.includes("*")
      console.log("🔑 Authorization header permitido:", authAllowed ? "✅ SÍ" : "❌ NO")

      // Verificar compatibilidad credentials
      const credentialsCompatible = allowCredentials === "false" || allowCredentials === null
      console.log("🔐 Credentials compatible:", credentialsCompatible ? "✅ SÍ" : "❌ NO")

      return {
        corsConfigured: optionsResponse.ok,
        authorizationAllowed: authAllowed,
        credentialsCompatible,
        allowedHeaders,
        allowedMethods,
        allowedOrigin,
        allowCredentials,
      }
    } catch (error) {
      console.error("❌ Error probando CORS:", error)
      return {
        corsConfigured: false,
        authorizationAllowed: false,
        credentialsCompatible: false,
        error: error.message,
      }
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    // Construir headers de forma muy explícita
    const headers: Record<string, string> = {}

    // Headers básicos
    headers["Content-Type"] = "application/json"
    headers["Accept"] = "application/json"

    // CRÍTICO: Agregar Authorization header si tenemos token
    if (this.token && this.token.trim() !== "") {
      headers["Authorization"] = `Bearer ${this.token}`
      console.log("🔑 Authorization header añadido:", `Bearer ${this.token.substring(0, 30)}...`)
    } else {
      console.log("❌ No hay token disponible - Header Authorization NO establecido")
    }

    // Agregar headers adicionales del options
    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    console.log(`🌐 Petición API: ${options.method || "GET"} ${url}`)
    console.log(`📋 Headers que se enviarán:`, headers)

    if (options.body) {
      console.log(`📦 Cuerpo de la petición:`, options.body)
    }

    try {
      const fetchOptions: RequestInit = {
        method: options.method || "GET",
        headers: headers,
        body: options.body,
        mode: "cors",
        credentials: "omit",
      }

      console.log(`🚀 Enviando petición con fetch...`)

      const response = await fetch(url, fetchOptions)

      console.log(`📊 Estado de respuesta: ${response.status}`)

      // ⬅️ NUEVO: Detectar token expirat o invàlid
      if (response.status === 401) {
        console.error(`🚫 401 No autorizado - Token expirado o inválido`)
        console.error(`🔍 El backend dice que no hay autenticación válida`)

        // Netejar token i fer logout automàtic
        this.token = ""
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        // Cridar el callback de logout si està disponible
        if (this.logoutCallback) {
          console.log("🚪 Ejecutando logout automático por token expirado")
          this.logoutCallback()
        }

        throw new Error("Session expired. Please login again.")
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Error API: ${response.status} - ${response.statusText}`)
        console.error(`❌ Cuerpo del error:`, errorText)
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }

      const text = await response.text()
      console.log(`✅ Respuesta API exitosa`)

      if (!text || text.trim() === "") {
        return {}
      }

      try {
        const parsed = JSON.parse(text)
        return parsed
      } catch (parseError) {
        return text
      }
    } catch (error) {
      console.error(`🚨 Error de red:`, error)
      throw error
    }
  }

  async login(username: string, password: string) {
    console.log("🔐 Iniciando proceso de login para usuario:", username)

    this.setToken("")

    try {
      const loginBody = {
        username: username,
        password: password,
      }

      const response = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginBody),
      })

      const token = response["jwt-token"]
      if (!token) {
        throw new Error("No token received from login")
      }

      this.setToken(token)

      return {
        token: token,
        authUsername: response.authUsername,
        pets: response.pets || [],
        accountLockedAt: response.accountLockedAt || null, // ⬅️ NUEVO: Incloure accountLockedAt
      }
    } catch (error) {
      console.error("❌ Error durante el login:", error)
      throw error
    }
  }

  // ⬅️ ENDPOINT ORIGINAL: Renovació normal (amb contrasenya actual)
  async renewPassword(username: string, currentPassword: string, newPassword: string) {
    console.log("🔄 Iniciando renovación normal de contraseña para usuario:", username)

    // No establir token perquè aquest endpoint no requereix autenticació
    this.setToken("")

    try {
      const renewBody = {
        username: username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      }

      const response = await this.request("/auth/renewPassword", {
        method: "POST",
        body: JSON.stringify(renewBody),
      })

      console.log("✅ Contrasenya renovada correctament (renovació normal)")
      return response
    } catch (error) {
      console.error("❌ Error durante la renovación normal de contraseña:", error)
      throw error
    }
  }

  // ⬅️ MODIFICAT: Usar l'endpoint correcte /auth/userRenewPassword
  async userRenewPassword(username: string, newPassword: string) {
    console.log("🔄 Iniciando renovación de usuario para:", username)

    // No establir token perquè aquest endpoint no requereix autenticació prèvia
    this.setToken("")

    try {
      const renewBody = {
        username: username,
        password: newPassword, // ⬅️ Usar 'password' com en el registre
      }

      console.log("📦 Enviando datos de renovación:", renewBody)

      const response = await this.request("/auth/userRenewPassword", {
        method: "POST",
        body: JSON.stringify(renewBody),
      })

      console.log("✅ Contrasenya renovada correctament (userRenewPassword)")

      // ⬅️ Si retorna token com el registre, establir-lo
      const token = response["jwt-token"]
      if (token) {
        console.log("🔑 Token rebut després de renovació:", `${token.substring(0, 30)}...`)
        this.setToken(token)

        return {
          token: token,
          authUsername: response.authUsername,
          pets: response.pets || [],
        }
      }

      return response
    } catch (error) {
      console.error("❌ Error durante userRenewPassword:", error)
      throw error
    }
  }

  // ⬅️ VERIFICAR estat de l'usuari (si està marcat per renovació)
  async checkUserStatus(username: string) {
    console.log("🔍 Verificando estado del usuario:", username)

    try {
      const response = await this.request(`/auth/userStatus/${username}`, {
        method: "GET",
      })

      return {
        accountLockedAt: response.accountLockedAt || null,
        accountBlockedAt: response.accountBlockedAt || null,
        requiresPasswordRenewal: !!response.accountLockedAt,
      }
    } catch (error) {
      console.error("❌ Error verificando estado del usuario:", error)
      throw error
    }
  }

  async register(username: string, email: string, password: string, userType: string) {
    this.setToken("")

    const endpoint = userType === "admin" ? "/auth/registerStaff" : "/auth/register"

    const requestBody = {
      username,
      email: email,
      password,
    }

    const response = await this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
    })

    const token = response["jwt-token"]
    if (!token) {
      throw new Error("No token received from registration")
    }

    this.setToken(token)

    return {
      token: token,
      authUsername: response.authUsername,
      pets: response.pets || [],
    }
  }

  async getUserPets(username: string) {
    console.log(`🐾 Obteniendo mascotas para usuario: ${username}`)

    const response = await this.request(`/user/${username}/pet`, {
      method: "GET",
    })

    // ⬅️ ACTUALIZADO: Extraer de "pets"
    if (response.pets && Array.isArray(response.pets)) {
      return response.pets
    }

    // Fallback por si acaso
    if (Array.isArray(response)) {
      return response
    }

    return response.pets || response.result || []
  }

  async getPet(username: string, petName: string) {
    console.log(`🐾 Obteniendo mascota específica: ${petName} para usuario: ${username}`)

    const response = await this.request(`/user/${username}/pet/${petName}`, {
      method: "GET",
    })

    // ⬅️ YA ESTÁ CORRECTO: Extraer de "pet"
    return response.pet || response
  }

  async createPet(username: string, petData: { petName: string; petType: string }) {
    console.log(`🎉 Creando mascota para usuario: ${username}`)

    if (!this.token || this.token.trim() === "") {
      throw new Error("No hay token de autenticación disponible")
    }

    const response = await this.request(`/user/${username}/pet`, {
      method: "POST",
      body: JSON.stringify(petData),
    })

    return response
  }

  async updatePet(username: string, petName: string, updates: any) {
    console.log(`🔄 Updating pet ${petName} for user ${username} with:`, updates)

    const response = await this.request(`/user/${username}/pet/${petName}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })

    // ⬅️ ACTUALIZADO: Extraer de "pet" si existe
    return response.pet || response
  }

  async deletePet(username: string, petName: string) {
    console.log(`🗑️ Eliminando mascota: ${petName} para usuario: ${username}`)

    const response = await this.request(`/user/${username}/pet/${petName}`, {
      method: "DELETE",
    })

    return response
  }

  async getAllUsers() {
    console.log("🔍 ADMIN: Calling getAllUsers() - endpoint: /admin/users")
    const response = await this.request("/admin/users", {
      method: "GET",
    })
    console.log("🔍 ADMIN: getAllUsers raw response:", response)

    // ⬅️ MANEJAR DIFERENTS FORMATS DE RESPOSTA
    let users = []

    if (Array.isArray(response)) {
      users = response
    } else if (response.result && Array.isArray(response.result)) {
      users = response.result
    } else if (response.users && Array.isArray(response.users)) {
      users = response.users
    } else if (response.data && Array.isArray(response.data)) {
      users = response.data
    } else {
      console.warn("⚠️ ADMIN: Unexpected users response format:", response)
      users = []
    }

    // Verificar que tenim les propietats accountLockedAt i accountBlockedAt
    users.forEach((user) => {
      console.log(`🔍 ADMIN: User ${user.userName || user.username}:`, {
        accountLockedAt: user.accountLockedAt || "null",
        accountBlockedAt: user.accountBlockedAt || "null",
      })
    })

    console.log("🔍 ADMIN: Processed users array:", users)
    return users
  }

  async getAllPets() {
    console.log("🔍 ADMIN: Calling getAllPets() - endpoint: /admin/pets")
    const response = await this.request("/admin/pets", {
      method: "GET",
    })
    console.log("🔍 ADMIN: getAllPets response:", response)

    // ⬅️ MANEJAR DIFERENTS FORMATS DE RESPOSTA
    let pets = []

    if (Array.isArray(response)) {
      pets = response
    } else if (response.pets && Array.isArray(response.pets)) {
      pets = response.pets
    } else if (response.result && Array.isArray(response.result)) {
      pets = response.result
    } else if (response.data && Array.isArray(response.data)) {
      pets = response.data
    } else {
      console.warn("⚠️ ADMIN: Unexpected pets response format:", response)
      pets = []
    }

    console.log("🔍 ADMIN: Processed pets array:", pets)
    return pets
  }

  async markUserForRenewal(username: string) {
    // Obtenir l'usuari administrador actual del localStorage
    const userData = localStorage.getItem("user")
    if (!userData) {
      throw new Error("No admin user data available")
    }

    const adminUser = JSON.parse(userData).username
    console.log(
      `🔍 ADMIN: Calling markUserForRenewal(${username}) - Admin: ${adminUser} - endpoint: /admin/${adminUser}/markUser?userName=${username}`,
    )

    try {
      const response = await this.request(`/admin/${adminUser}/markUser?userName=${username}`, {
        method: "PUT",
      })
      console.log(`✅ ADMIN: markUserForRenewal response:`, response)
      return response
    } catch (error) {
      console.error(`❌ ADMIN: markUserForRenewal error:`, error)
      throw error
    }
  }

  async blockUser(username: string) {
    // Obtenir l'usuari administrador actual del localStorage
    const userData = localStorage.getItem("user")
    if (!userData) {
      throw new Error("No admin user data available")
    }

    const adminUser = JSON.parse(userData).username
    console.log(
      `🔍 ADMIN: Calling blockUser(${username}) - Admin: ${adminUser} - endpoint: /admin/${adminUser}/blockUser?userName=${username}`,
    )

    return await this.request(`/admin/${adminUser}/blockUser?userName=${username}`, {
      method: "PUT",
    })
  }

  async unmarkUser(username: string) {
    // Obtenir l'usuari administrador actual del localStorage
    const userData = localStorage.getItem("user")
    if (!userData) {
      throw new Error("No admin user data available")
    }

    const adminUser = JSON.parse(userData).username
    console.log(
      `🔍 ADMIN: Calling unmarkUser(${username}) - Admin: ${adminUser} - endpoint: /admin/${adminUser}/unmarkUser?userName=${username}`,
    )

    try {
      const response = await this.request(`/admin/${adminUser}/unmarkUser?userName=${username}`, {
        method: "PUT",
      })
      console.log(`✅ ADMIN: unmarkUser response:`, response)
      return response
    } catch (error) {
      console.error(`❌ ADMIN: unmarkUser error:`, error)
      throw error
    }
  }

  async unblockUser(username: string) {
    // Obtenir l'usuari administrador actual del localStorage
    const userData = localStorage.getItem("user")
    if (!userData) {
      throw new Error("No admin user data available")
    }

    const adminUser = JSON.parse(userData).username
    console.log(
      `🔍 ADMIN: Calling unblockUser(${username}) - Admin: ${adminUser} - endpoint: /admin/${adminUser}/unblockUser?userName=${username}`,
    )

    return await this.request(`/admin/${adminUser}/unblockUser?userName=${username}`, {
      method: "PUT",
    })
  }

  async changeUserRole(username: string) {
    // Obtenir l'usuari administrador actual del localStorage
    const userData = localStorage.getItem("user")
    if (!userData) {
      throw new Error("No admin user data available")
    }

    const adminUser = JSON.parse(userData).username
    console.log(
      `🔍 ADMIN: Calling changeUserRole(${username}) - Admin: ${adminUser} - endpoint: /admin/${adminUser}/changeRole?userName=${username}`,
    )

    try {
      const response = await this.request(`/admin/${adminUser}/changeRole?userName=${username}`, {
        method: "PUT",
      })
      console.log(`✅ ADMIN: changeUserRole response:`, response)
      return response
    } catch (error) {
      console.error(`❌ ADMIN: changeUserRole error:`, error)
      throw error
    }
  }

  debugState() {
    console.log("🔍 ApiService Debug Completo:")
    console.log("  Token existe:", !!this.token)
    console.log("  Longitud del token:", this.token ? this.token.length : 0)
    console.log("  Vista previa del token:", this.token ? `${this.token.substring(0, 50)}...` : "Ninguno")
    console.log("  Token comienza con 'eyJ':", this.token ? this.token.startsWith("eyJ") : false)
    console.log("  Token en localStorage:", localStorage.getItem("token") ? "Existe" : "Ninguno")

    const lsToken = localStorage.getItem("token")
    if (lsToken) {
      console.log("  Longitud del token en LS:", lsToken.length)
      console.log("  Vista previa del token en LS:", `${lsToken.substring(0, 50)}...`)
      console.log("  Los tokens coinciden:", this.token === lsToken)
    }
  }
}

export const apiService = new ApiService()
