"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Footer from "@/components/ui/footer"
import { apiService } from "@/lib/api-service"
import type { User, Pet } from "@/types/pet"
import { Users, Crown, Plus, LogOut } from "lucide-react"
import { useTokenValidator } from "@/hooks/use-token-validator"

export default function AdminPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  // ⬅️ NUEVO: Validació automàtica del token
  useTokenValidator()

  const [users, setUsers] = useState<User[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filterPets = useCallback(() => {
    let filtered = pets

    if (selectedUser && selectedUser !== "all") {
      filtered = filtered.filter((pet) => pet.userName === selectedUser)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.userName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredPets(filtered)
  }, [pets, selectedUser, searchTerm])

  useEffect(() => {
    console.log("🔍 ADMIN PAGE: useEffect triggered")
    console.log("🔍 ADMIN PAGE: mounted:", mounted)
    console.log("🔍 ADMIN PAGE: loading:", loading)
    console.log("🔍 ADMIN PAGE: user:", user)
    console.log("🔍 ADMIN PAGE: user role:", user?.role)

    if (mounted && !loading && (!user || (user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUB_ADMIN"))) {
      console.log("❌ ADMIN PAGE: User not admin, redirecting to dashboard")
      router.push("/dashboard")
      return
    }

    // ⬅️ AFEGIR MÉS LOGS AQUÍ
    if (mounted && user && (user.role === "ROLE_ADMIN" || user.role === "ROLE_SUB_ADMIN")) {
      console.log("✅ ADMIN PAGE: Admin user detected, calling loadAdminData...")
      console.log("✅ ADMIN PAGE: User role confirmed:", user.role)
      loadAdminData()
    } else {
      console.log("⚠️ ADMIN PAGE: Conditions not met for loading admin data:")
      console.log("  - mounted:", mounted)
      console.log("  - user exists:", !!user)
      console.log("  - user role:", user?.role)
      console.log("  - is admin role:", user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUB_ADMIN")
    }
  }, [user, loading, router, mounted])

  useEffect(() => {
    filterPets()
  }, [pets, selectedUser, searchTerm, filterPets])

  if (!mounted || loading || !user) {
    console.log("🔍 ADMIN PAGE: Showing loading screen")
    console.log("  - mounted:", mounted)
    console.log("  - loading:", loading)
    console.log("  - user:", !!user)

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const loadAdminData = async () => {
    console.log("🔄 ADMIN PAGE: loadAdminData() STARTED")
    setLoadingData(true)

    // ⬅️ ASEGURAR TOKEN
    const currentToken = localStorage.getItem("token")
    console.log("🔑 ADMIN PAGE: Token from localStorage:", currentToken ? "EXISTS" : "NULL")

    if (!currentToken) {
      console.error("❌ ADMIN PAGE: No token available for admin data")
      router.push("/dashboard")
      return
    }

    console.log("🔑 ADMIN PAGE: Setting token in apiService...")
    apiService.setToken(currentToken)

    try {
      console.log("📡 ADMIN PAGE: About to fetch users and pets using ADMIN endpoints...")
      console.log("📡 ADMIN PAGE: Calling Promise.all with getAllUsers() and getAllPets()...")

      // ⬅️ CRIDAR INDIVIDUALMENT PER VEURE QUIN FALLA
      console.log("📡 ADMIN PAGE: Step 1 - Calling getAllUsers()...")
      const usersData = await apiService.getAllUsers()
      console.log("✅ ADMIN PAGE: getAllUsers() completed, result:", usersData)

      console.log("📡 ADMIN PAGE: Step 2 - Calling getAllPets()...")
      const petsData = await apiService.getAllPets()
      console.log("✅ ADMIN PAGE: getAllPets() completed, result:", petsData)

      // ⬅️ ASSEGURAR QUE SÓN ARRAYS
      const safeUsers = Array.isArray(usersData) ? usersData : []
      const safePets = Array.isArray(petsData) ? petsData : []

      console.log("✅ ADMIN PAGE: Both API calls completed successfully")
      console.log("✅ Users loaded via /admin/users:", safeUsers.length)
      console.log("✅ Pets loaded via /admin/pets:", safePets.length)

      setUsers(safeUsers)
      // ⬅️ NUEVO: Logs específics per veure els rols
      console.log("🔍 ADMIN PAGE: Checking users with roles:")
      safeUsers.forEach((user) => {
        console.log(`  - User ${user.userName}:`, {
          role: user.role || "null",
          accountLockedAt: user.accountLockedAt || "null",
          accountBlockedAt: user.accountBlockedAt || "null",
        })
      })
      setPets(safePets)
    } catch (error) {
      console.error("❌ ADMIN PAGE: Failed to load admin data:", error)
      console.error("❌ ADMIN PAGE: Error details:", error.message)
      console.error("❌ ADMIN PAGE: Error stack:", error.stack)

      // Si hay error de autenticación, redirigir
      if (error instanceof Error && error.message.includes("401")) {
        console.log("🚪 ADMIN PAGE: Authentication error, redirecting...")
        router.push("/dashboard")
        return
      }
    } finally {
      console.log("🏁 ADMIN PAGE: loadAdminData() FINISHED")
      setLoadingData(false)
    }
  }

  const handleMarkUser = async (userName: string) => {
    try {
      await apiService.markUserForRenewal(userName)
      await loadAdminData()
    } catch (error) {
      console.error("Failed to mark user:", error)
    }
  }

  const handleBlockUser = async (userName: string) => {
    try {
      await apiService.blockUser(userName)
      await loadAdminData()
    } catch (error) {
      console.error("Failed to block user:", error)
    }
  }

  const handleUnmarkUser = async (userName: string) => {
    try {
      await apiService.unmarkUser(userName)
      await loadAdminData()
    } catch (error) {
      console.error("Failed to unmark user:", error)
    }
  }

  const handleUnblockUser = async (userName: string) => {
    try {
      await apiService.unblockUser(userName)
      await loadAdminData()
    } catch (error) {
      console.error("Failed to unblock user:", error)
    }
  }

  const handleChangeRole = async (userName: string) => {
    try {
      console.log(`🔄 Changing role for user: ${userName}`)
      await apiService.changeUserRole(userName)
      console.log(`✅ Role changed successfully for user: ${userName}`)
      await loadAdminData()
    } catch (error) {
      console.error("Failed to change user role:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // ⬅️ CORREGIDO: Usar el camp "role" que ve del backend
  const getUserRole = (userData: User): string => {
    return userData.role || "ROLE_USER"
  }

  // ⬅️ CORREGIDO: Función para determinar si es admin
  const isUserAdmin = (userData: User): boolean => {
    const userRole = getUserRole(userData)
    return userRole === "ROLE_ADMIN" || userRole === "ROLE_SUB_ADMIN"
  }

  // ⬅️ NUEVO: Función para mostrar el rol de forma limpia
  const getDisplayRole = (userData: User): string => {
    const userRole = getUserRole(userData)
    if (userRole === "ROLE_ADMIN") return "ADMIN"
    if (userRole === "ROLE_SUB_ADMIN") return "SUB_ADMIN"
    return "USER"
  }

  if (user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUB_ADMIN") {
    console.log("❌ ADMIN PAGE: Access denied for user role:", user.role)
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <Card className="border-4 border-red-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-red-500 mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  console.log("🎨 ADMIN PAGE: Rendering admin interface")
  console.log("🎨 ADMIN PAGE: loadingData:", loadingData)
  console.log("🎨 ADMIN PAGE: users.length:", users.length)
  console.log("🎨 ADMIN PAGE: pets.length:", pets.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-pink-100 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b-4 border-orange-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-orange-600 flex items-center gap-2">
                  <Crown className="h-8 w-8" />
                  Pet Academy Admin Panel ({user.role})
                </h1>
                <p className="text-orange-500">Manage users and pets - Welcome {user.username}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Botó per anar a crear animals */}
              <Button
                onClick={() => {
                  console.log("🐾 My Pets button clicked, navigating to /dashboard")
                  router.push("/dashboard")
                }}
                className="bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 text-white font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                My Pets
              </Button>

              {/* Botó Logout */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Debug Button */}
          <div className="mb-4 flex gap-2">
            <Button
              onClick={() => {
                console.log("🔍 MANUAL DEBUG: Calling loadAdminData manually...")
                loadAdminData()
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              🔍 Manual Load Admin Data (Debug)
            </Button>

            <Button
              onClick={async () => {
                console.log("🔍 MANUAL DEBUG: Testing changeRole function...")
                try {
                  // Selecciona el primer usuari disponible
                  if (users.length > 0) {
                    const testUser = users[0].userName || users[0].username
                    console.log(`🧪 Testing changeRole with user: ${testUser}`)
                    console.log(`🧪 Current role: ${getUserRole(users[0])}`)
                    await apiService.changeUserRole(testUser)
                    console.log("✅ changeRole test completed, reloading data...")
                    await loadAdminData()
                  } else {
                    console.log("❌ No users available for testing")
                  }
                } catch (error) {
                  console.error("❌ changeRole test failed:", error)
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              🧪 Test Change Role Function
            </Button>
          </div>

          {loadingData ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-orange-600 mt-4">Loading admin data...</p>
            </div>
          ) : (
            <>
              {/* Debug Info */}
              <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-yellow-800">
                  <strong>Debug:</strong> Users: {users.length}, Pets: {pets.length}, Role: {user.role}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users Section */}
                <Card className="border-4 border-blue-200 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                      <Users className="h-6 w-6" />
                      All Users ({users.length})
                    </CardTitle>
                    <CardDescription className="text-blue-100">Manage user accounts and permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {!Array.isArray(users) || users.length === 0 ? (
                      <div className="text-center py-8 text-blue-600">
                        <p>No users found or failed to load users.</p>
                        <Button onClick={loadAdminData} className="mt-4">
                          Retry Loading
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Array.isArray(users) &&
                          users.slice(0, 10).map((userData) => {
                            const isAdmin = isUserAdmin(userData)
                            const displayRole = getDisplayRole(userData)

                            return (
                              <div
                                key={userData.userName}
                                className="border-2 border-blue-100 rounded-lg p-4 bg-blue-50"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="font-bold text-blue-800">{userData.userName}</h3>
                                  <span className="text-sm text-blue-600">{userData.email}</span>
                                </div>
                                <div className="text-sm text-blue-600 mb-3">
                                  <div>Created: {new Date(userData.createdAt).toLocaleDateString()}</div>
                                  <div>Email: {userData.email}</div>
                                  {/* ⬅️ CORREGIDO: Mostrar el rol correctamente */}
                                  <div
                                    className={`font-bold text-lg ${isAdmin ? "text-purple-600" : "text-green-600"}`}
                                  >
                                    Role: {displayRole}
                                  </div>
                                  {userData.fullName && <div>Full Name: {userData.fullName}</div>}
                                  {userData.city && userData.country && (
                                    <div>
                                      Location: {userData.city}, {userData.country}
                                    </div>
                                  )}

                                  {/* ⬅️ NUEVO: Mostrar dates de bloqueig i renovació */}
                                  {userData.accountLockedAt && (
                                    <div className="text-orange-600 font-medium">
                                      🔒 Marked for Renewal: {new Date(userData.accountLockedAt).toLocaleString()}
                                    </div>
                                  )}
                                  {userData.accountBlockedAt && (
                                    <div className="text-red-600 font-medium">
                                      🚫 Blocked: {new Date(userData.accountBlockedAt).toLocaleString()}
                                    </div>
                                  )}
                                </div>

                                {/* ⬅️ NUEVO: Botons condicionals segons l'estat */}
                                <div className="flex gap-2 flex-wrap">
                                  {!userData.accountLockedAt && !userData.accountBlockedAt && (
                                    <>
                                      <Button
                                        onClick={() => handleMarkUser(userData.userName)}
                                        size="sm"
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                      >
                                        Mark for Renewal
                                      </Button>
                                      <Button
                                        onClick={() => handleBlockUser(userData.userName)}
                                        size="sm"
                                        variant="destructive"
                                      >
                                        Block User
                                      </Button>
                                    </>
                                  )}

                                  {userData.accountLockedAt && (
                                    <Button
                                      onClick={() => handleUnmarkUser(userData.userName)}
                                      size="sm"
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                      ✅ Unmark User
                                    </Button>
                                  )}

                                  {userData.accountBlockedAt && (
                                    <Button
                                      onClick={() => handleUnblockUser(userData.userName)}
                                      size="sm"
                                      className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      🔓 Unblock User
                                    </Button>
                                  )}

                                  {/* ⬅️ CORREGIDO: Botó de canvi de rol amb text dinàmic */}
                                  <Button
                                    onClick={() => handleChangeRole(userData.userName)}
                                    size="sm"
                                    className={`${
                                      isAdmin ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"
                                    } text-white`}
                                  >
                                    {isAdmin ? "Make User" : "Make Admin"}
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        {users.length > 10 && (
                          <div className="text-center py-2 text-blue-600 text-sm">
                            Showing 10 of {users.length} users
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Pets Section */}
                <Card className="border-4 border-green-200 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold">🐾 All Pets ({filteredPets.length})</CardTitle>
                    <CardDescription className="text-green-100">View and filter all user pets</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Filters */}
                    <div className="space-y-4 mb-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Search pets or users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-2 border-green-200 focus:border-green-400"
                          />
                        </div>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                          <SelectTrigger className="w-48 border-2 border-green-200 focus:border-green-400">
                            <SelectValue placeholder="Filter by user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            {users.map((userData) => (
                              <SelectItem key={userData.userName} value={userData.userName}>
                                {userData.userName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Pets List */}
                    {pets.length === 0 ? (
                      <div className="text-center py-8 text-green-600">
                        <p>No pets found or failed to load pets.</p>
                        <Button onClick={loadAdminData} className="mt-4">
                          Retry Loading
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredPets.slice(0, 10).map((pet) => (
                          <div key={pet.id} className="border-2 border-green-100 rounded-lg p-4 bg-green-50">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{pet.petType === "cat" ? "🐱" : "🐶"}</span>
                                <h3 className="font-bold text-green-800">{pet.petName}</h3>
                              </div>
                              <span className="text-sm text-green-600">Owner: {pet.userName}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2 text-sm mb-2">
                              <div className="text-center">
                                <div className="font-medium text-red-600">Hunger</div>
                                <div className="font-bold">{pet.hunger}/10</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-yellow-600">Happy</div>
                                <div className="font-bold">{pet.happiness}/10</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-blue-600">Energy</div>
                                <div className="font-bold">{pet.energy}/10</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-green-600">Health</div>
                                <div className="font-bold">{pet.health}/10</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-purple-600">Hygiene</div>
                                <div className="font-bold">{pet.hygiene || 5}/10</div>
                              </div>
                            </div>
                            {pet.background && <div className="text-sm text-green-600">Location: {pet.background}</div>}
                            {pet.objects && pet.objects.length > 0 && (
                              <div className="text-sm text-blue-600">Toys: {pet.objects.join(", ")}</div>
                            )}
                          </div>
                        ))}
                        {filteredPets.length > 10 && (
                          <div className="text-center py-2 text-green-600 text-sm">
                            Showing 10 of {filteredPets.length} pets
                          </div>
                        )}
                        {filteredPets.length === 0 && pets.length > 0 && (
                          <div className="text-center py-8 text-green-600">No pets found matching your criteria.</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ⬅️ NUEVO: Footer */}
      <Footer />
    </div>
  )
}
