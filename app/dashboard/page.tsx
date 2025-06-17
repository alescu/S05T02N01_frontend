"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import PetCard from "@/components/pets/pet-card"
import CreatePetForm from "@/components/pets/create-pet-form"
import Footer from "@/components/ui/footer"
import BackgroundWrapper from "@/components/ui/background-wrapper"
import ThemedHeader from "@/components/ui/themed-header"
import ThemedCard from "@/components/ui/themed-card"
import ThemedButton from "@/components/ui/themed-button"
import type { Pet } from "@/types/pet"
import { apiService } from "@/lib/api-service"
import { Plus, LogOut, Settings, Bug, TestTube, Globe, Shield, RefreshCw } from "lucide-react"
import { useTokenValidator } from "@/hooks/use-token-validator"
import { useTheme } from "@/hooks/use-theme"
import { getUIColors } from "@/config/theme"
import { useLanguage } from "@/hooks/use-language"

export default function DashboardPage() {
  const { user, logout, loading, refreshUserPets } = useAuth()
  const { currentTheme, isLoaded } = useTheme()
  const { t } = useLanguage()
  const router = useRouter()

  // ⬅️ NUEVO: Validació automàtica del token
  useTokenValidator()

  const [pets, setPets] = useState<Pet[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loadingPets, setLoadingPets] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")

  const uiColors = getUIColors(isLoaded ? currentTheme : "pastel_pink")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/")
      return
    }

    if (mounted && user) {
      console.log("🐾 Dashboard loaded for user:", user.username)
      setPets(user.pets || [])
      apiService.debugState()
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading || !user) {
    return (
      <BackgroundWrapper page="dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${uiColors.primary.text.replace("text-", "").replace("-600", "-600")}`}
          ></div>
        </div>
      </BackgroundWrapper>
    )
  }

  // ... (resta de funcions igual)

  const loadUserPets = async () => {
    if (!user) return

    console.log(`🔄 Refreshing pets for user: ${user.username}`)
    setLoadingPets(true)
    setError("")

    try {
      const userPets = await refreshUserPets()
      console.log("✅ Refreshed pets:", userPets)
      setPets(userPets)
    } catch (error) {
      console.error("❌ Failed to refresh pets:", error)
      setError("Failed to load pets. Please check your connection.")
    } finally {
      setLoadingPets(false)
    }
  }

  const handleCreatePet = async (petData: { petName: string; petType: string }) => {
    if (!user) {
      throw new Error("User not authenticated")
    }

    console.log(`🎉 Starting pet creation for ${user.username}:`, petData)

    const currentToken = localStorage.getItem("token")
    if (!currentToken) {
      console.error("❌ No token in localStorage")
      throw new Error("Authentication required. Please login again.")
    }

    apiService.setToken(currentToken)
    setError("")

    try {
      const createResponse = await apiService.createPet(user.username, petData)
      console.log("✅ Pet created successfully:", createResponse)

      await loadUserPets()
      console.log("✅ Pet creation process completed")
    } catch (error) {
      console.error("❌ Failed to create pet:", error)

      if (error instanceof Error && (error.message.includes("401") || error.message.includes("Authentication"))) {
        console.log("🚪 Authentication error, logging out...")
        logout()
        router.push("/")
        return
      }

      throw error
    }
  }

  const handleDeletePet = async (petName: string) => {
    if (!user) return

    const currentToken = localStorage.getItem("token")
    if (!currentToken) {
      logout()
      router.push("/")
      return
    }

    apiService.setToken(currentToken)
    setError("")

    try {
      await apiService.deletePet(user.username, petName)
      await loadUserPets()
    } catch (error) {
      console.error("❌ Failed to delete pet:", error)

      if (error instanceof Error && error.message.includes("401")) {
        logout()
        router.push("/")
        return
      }

      setError("Failed to delete pet. Please try again.")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    setError("")
  }

  const handleDebugComplete = () => {
    console.log("🔍 COMPLETE DEBUG SESSION:")
    apiService.debugState()
  }

  const handleTestAuth = async () => {
    console.log("🧪 Testing authenticated request...")

    const currentToken = localStorage.getItem("token")
    if (!currentToken) {
      console.error("❌ No token for test")
      return
    }

    apiService.setToken(currentToken)

    try {
      await apiService.getUserPets(user.username)
      console.log("✅ Auth test successful")
    } catch (error) {
      console.error("❌ Auth test failed:", error)
    }
  }

  const handleTestCors = async () => {
    console.log("🌐 Testing CORS configuration...")

    try {
      const corsResult = await apiService.testCors()
      console.log("🌐 CORS Test Result:", corsResult)

      if (!corsResult.corsConfigured) {
        setError("CORS no está configurado correctamente en el backend")
      } else if (!corsResult.authorizationAllowed) {
        setError("El header Authorization no está permitido por CORS")
      } else {
        setError("")
        console.log("✅ CORS configurado correctamente")
      }
    } catch (error) {
      console.error("❌ CORS test failed:", error)
      setError("Error probando configuración CORS")
    }
  }

  const handleTestAuthHeader = async () => {
    console.log("🛡️ Testing if Authorization header reaches backend...")

    const currentToken = localStorage.getItem("token")
    if (!currentToken) {
      console.error("❌ No token for test")
      setError("No token available for test")
      return
    }

    apiService.setToken(currentToken)

    try {
      const result = await apiService.testAuthHeader()
      console.log("🛡️ Auth Header Test Result:", result)

      if (result.success) {
        setError("")
        console.log("✅ Authorization header reaches backend correctly")
      } else {
        setError(`Authorization header test failed: ${result.error}`)
      }
    } catch (error) {
      console.error("❌ Auth header test failed:", error)
      setError("Error testing Authorization header")
    }
  }

  return (
    <BackgroundWrapper page="dashboard">
      {/* Header */}
      <ThemedHeader>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${uiColors.primary.text}`}>{t("dashboard", "title")}</h1>
              <p className={`${uiColors.primary.textLight}`}>
                {t("dashboard", "welcome", { username: user.username })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Debug buttons - NOMÉS PER ADMINISTRADORS */}
              {(user.role === "ROLE_ADMIN" || user.role === "ROLE_SUB_ADMIN") && (
                <>
                  <ThemedButton onClick={handleDebugComplete} variant="outline" size="sm">
                    <Bug className="h-4 w-4 mr-1" />
                    Debug
                  </ThemedButton>

                  <ThemedButton onClick={handleTestAuth} variant="outline" size="sm">
                    <TestTube className="h-4 w-4 mr-1" />
                    Test Auth
                  </ThemedButton>

                  <ThemedButton onClick={handleTestCors} variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Test CORS
                  </ThemedButton>

                  <ThemedButton onClick={handleTestAuthHeader} variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Test Header
                  </ThemedButton>

                  <ThemedButton onClick={loadUserPets} disabled={loadingPets} variant="outline" size="sm">
                    <RefreshCw className={`h-4 w-4 mr-1 ${loadingPets ? "animate-spin" : ""}`} />
                    {t("common", "refresh")}
                  </ThemedButton>

                  {/* Botó Admin Panel - NOMÉS PER ADMINISTRADORS */}
                  <ThemedButton
                    onClick={() => {
                      console.log("🔧 Admin Panel button clicked, navigating to /admin")
                      router.push("/admin")
                    }}
                    variant="accent"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </ThemedButton>
                </>
              )}

              {/* Botó Logout - SEMPRE VISIBLE */}
              <ThemedButton onClick={handleLogout} variant="destructive">
                <LogOut className="h-4 w-4 mr-2" />
                {t("common", "logout")}
              </ThemedButton>
            </div>
          </div>
        </div>
      </ThemedHeader>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <ThemedCard className="border-red-200">
                <div className="text-red-600 text-center font-medium">{error}</div>
              </ThemedCard>
            </div>
          )}

          {/* Create Pet Section */}
          <div className="mb-8">
            <ThemedCard
              title={
                <div className="flex items-center gap-2">
                  <Plus className="h-6 w-6" />
                  {t("dashboard", "createPetTitle")}
                </div>
              }
              description={t("dashboard", "createPetSubtitle")}
              headerGradient={true}
            >
              {!showCreateForm ? (
                <ThemedButton
                  onClick={() => setShowCreateForm(true)}
                  variant="secondary"
                  className="w-full py-4 text-lg"
                >
                  {t("dashboard", "createPetButton")}
                </ThemedButton>
              ) : (
                <CreatePetForm
                  onSubmit={async (petData) => {
                    await handleCreatePet(petData)
                    handleCreateSuccess()
                  }}
                  onCancel={() => setShowCreateForm(false)}
                />
              )}
            </ThemedCard>
          </div>

          {/* Pets Grid */}
          <div className="mb-8">
            <h2 className={`text-3xl font-bold ${uiColors.primary.text} mb-6 text-center`}>
              {t("dashboard", "petFamilyTitle")}
            </h2>
            <div className="mb-4 text-center">
              <p className={uiColors.primary.textLight}>
                {t("dashboard", "petCount", { count: pets.length })}
                {pets.length > 0 && (
                  <span className="ml-2">
                    <ThemedButton
                      onClick={loadUserPets}
                      disabled={loadingPets}
                      variant="outline"
                      size="sm"
                      className="hover:bg-gray-50"
                    >
                      (Click to refresh)
                    </ThemedButton>
                  </span>
                )}
              </p>
            </div>

            {loadingPets ? (
              <div className="text-center py-8">
                <div
                  className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${uiColors.primary.text.replace("text-", "").replace("-600", "-600")} mx-auto`}
                ></div>
                <p className={`${uiColors.primary.text} mt-4`}>{t("dashboard", "loadingPets")}</p>
              </div>
            ) : pets.length === 0 ? (
              <ThemedCard className="border-yellow-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">🐕🐱</div>
                  <h3 className="text-2xl font-bold text-yellow-600 mb-2">{t("dashboard", "noPetsTitle")}</h3>
                  <p className="text-yellow-500">{t("dashboard", "noPetsMessage")}</p>
                </div>
              </ThemedCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet, index) => (
                  <PetCard
                    key={pet.id || pet.petName || index}
                    pet={pet}
                    onDelete={() => handleDeletePet(pet.petName)}
                    onPlay={() => router.push(`/pet/${pet.petName}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </BackgroundWrapper>
  )
}
