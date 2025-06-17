"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import type { Pet } from "@/types/pet"
import { apiService } from "@/lib/api-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Footer from "@/components/ui/footer"
import { ArrowLeft, Heart, Zap, Smile, Shield, Home, TreePine, Sun, Settings } from "lucide-react"
import { useTokenValidator } from "@/hooks/use-token-validator"
import { useLanguage } from "@/hooks/use-language"

export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()

  // ⬅️ NUEVO: Validació automàtica del token
  useTokenValidator()

  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedToys, setSelectedToys] = useState<string[]>([]) // ⬅️ CAMBIAR: Array de toys

  const petName = params.petName as string

  useEffect(() => {
    setMounted(true)
  }, [])

  // ⬅️ MOVER LA FUNCIÓN loadPet AQUÍ, DENTRO DEL useEffect
  useEffect(() => {
    const loadPet = async () => {
      if (!user || !petName) return

      console.log(`🐾 Loading pet: ${petName} for user: ${user.username}`)

      // Asegurar que tenemos token
      const currentToken = localStorage.getItem("token")
      if (!currentToken) {
        console.error("❌ No token available")
        router.push("/dashboard")
        return
      }

      apiService.setToken(currentToken)

      try {
        const petData = await apiService.getPet(user.username, petName)
        console.log("✅ Pet loaded successfully:", petData)
        console.log("🔍 Pet type:", petData?.petType)
        console.log("🔍 Pet name:", petData?.petName)
        setPet(petData)

        // ⬅️ INICIALIZAR TOYS SELECCIONADOS
        if (petData?.objects && Array.isArray(petData.objects)) {
          setSelectedToys(petData.objects)
          console.log("🎾 Loaded toys:", petData.objects)
        }
      } catch (error) {
        console.error("❌ Failed to load pet:", error)
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    if (mounted && user && petName) {
      loadPet()
    }
  }, [user, petName, mounted, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const updatePetValues = async (updates: Partial<Pet>) => {
    if (!user || !pet || !pet.petName) {
      console.error("❌ Missing user, pet, or petName for update")
      return
    }

    console.log(`🔄 Updating pet ${pet.petName} with:`, updates)

    // Asegurar que tenemos token
    const currentToken = localStorage.getItem("token")
    if (!currentToken) {
      console.error("❌ No token available for update")
      router.push("/dashboard")
      return
    }

    apiService.setToken(currentToken)
    setUpdating(true)

    try {
      // ⬅️ USAR pet.petName EN LUGAR DE SOLO petName
      await apiService.updatePet(user.username, pet.petName, updates)
      setPet((prev) => (prev ? { ...prev, ...updates } : null))
      console.log("✅ Pet updated successfully")
    } catch (error) {
      console.error("❌ Failed to update pet:", error)

      if (error instanceof Error && error.message.includes("401")) {
        router.push("/dashboard")
        return
      }
    } finally {
      setUpdating(false)
    }
  }

  const handleFeed = () => {
    if (!pet) return
    console.log("🍖 Feeding pet...")
    const newHunger = Math.min(10, pet.hunger + 2)
    const newHappiness = Math.min(10, pet.happiness + 1)
    const newHygiene = Math.max(0, (pet.hygiene || 5) - 1) // ⬅️ NUEVO: Menjar embruta
    updatePetValues({ hunger: newHunger, happiness: newHappiness, hygiene: newHygiene })
  }

  const handlePlay = () => {
    if (!pet) return
    console.log("🎾 Playing with pet...")
    const newHappiness = Math.min(10, pet.happiness + 3)
    const newEnergy = Math.max(0, pet.energy - 1)
    const newHunger = Math.max(0, pet.hunger - 1) // ⬅️ NUEVO: Jugar da hambre
    const newHygiene = Math.max(0, (pet.hygiene || 5) - 1) // ⬅️ NUEVO: Jugar embruta
    updatePetValues({ happiness: newHappiness, energy: newEnergy, hunger: newHunger, hygiene: newHygiene })
  }

  const handleRest = () => {
    if (!pet) return
    console.log("😴 Pet is resting...")
    const newEnergy = Math.min(10, pet.energy + 3)
    const newHealth = Math.min(10, pet.health + 1)
    updatePetValues({ energy: newEnergy, health: newHealth })
  }

  const handleClean = () => {
    if (!pet) return
    console.log("🛁 Cleaning pet...")
    const newHygiene = Math.min(10, (pet.hygiene || 5) + 3)
    const newHappiness = Math.min(10, pet.happiness + 1)
    updatePetValues({ hygiene: newHygiene, happiness: newHappiness })
  }

  const handleLocation = (location: string) => {
    if (!pet) return
    console.log(`🌍 Moving pet to: ${location}`)
    let updates: Partial<Pet> = { background: location }

    switch (location) {
      case "park":
        updates = {
          ...updates,
          happiness: Math.min(10, pet.happiness + 2),
          energy: Math.max(0, pet.energy - 1),
          hunger: Math.max(0, pet.hunger - 1), // ⬅️ NUEVO: Ir al parque da hambre
          hygiene: Math.max(0, (pet.hygiene || 5) - 1), // ⬅️ NUEVO: El parque embruta
        }
        break
      case "jungle":
        updates = {
          ...updates,
          energy: Math.min(10, pet.energy + 1),
          health: Math.min(10, pet.health + 1),
          hygiene: Math.max(0, (pet.hygiene || 5) - 2), // ⬅️ NUEVO: La selva embruta més
        }
        break
      case "desert":
        updates = {
          ...updates,
          energy: Math.max(0, pet.energy - 2),
          hunger: Math.max(0, pet.hunger - 2), // ⬅️ MODIFICADO: El desierto da más hambre
          hygiene: Math.max(0, (pet.hygiene || 5) - 1), // ⬅️ NUEVO: El desert embruta (pols)
        }
        break
      case "home":
        updates = {
          ...updates,
          happiness: Math.min(10, pet.happiness + 1),
          hygiene: Math.min(10, (pet.hygiene || 5) + 1), // ⬅️ MANTENER: Casa neteja
        }
        break
    }

    // ⬅️ GUARDAR LA LOCATION EN EL BACKEND
    updatePetValues(updates)
  }

  // ⬅️ MODIFICAR: Manejar selección de múltiples joguinas
  const handleToySelect = (toyType: string) => {
    console.log(`🎾 Selected toy: ${toyType}`)
    setSelectedToys((prev) => {
      if (prev.includes(toyType)) {
        // Si ya está seleccionado, lo quitamos
        const newToys = prev.filter((toy) => toy !== toyType)
        console.log(`🎾 Removing toy: ${toyType}, new toys:`, newToys)
        updatePetValues({ objects: newToys })
        return newToys
      } else {
        // Si no está seleccionado, lo añadimos
        const newToys = [...prev, toyType]
        console.log(`🎾 Adding toy: ${toyType}, new toys:`, newToys)
        updatePetValues({ objects: newToys })
        return newToys
      }
    })
  }

  // ⬅️ NUEVA FUNCIÓN: Obtener emoji de la joguina
  const getToyEmoji = (toyType: string) => {
    switch (toyType) {
      case "ball":
        return "⚽"
      case "mouse":
        return "🧸"
      default:
        return ""
    }
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-cyan-100 flex items-center justify-center">
        <Card className="border-4 border-red-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{t("errors", "petNotFound")}</h2>
            <p className="text-red-500 mb-4">{t("errors", "couldNotLoad", { petName })}</p>
            <Button onClick={() => router.push("/dashboard")}>{t("errors", "backToDashboard")}</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getPetEmoji = (type: string | undefined) => {
    if (!type) {
      console.warn("⚠️ Pet type is undefined, defaulting to dog")
      return "🐶"
    }
    return type.toLowerCase() === "cat" ? "🐱" : "🐶"
  }

  const getBackgroundGradient = (background: string | null) => {
    switch (background) {
      case "park":
        return "from-green-200 via-emerald-100 to-lime-200"
      case "jungle":
        return "from-green-300 via-emerald-200 to-teal-200"
      case "desert":
        return "from-yellow-200 via-orange-100 to-amber-200"
      case "home":
        return "from-blue-200 via-indigo-100 to-purple-200"
      default:
        return "from-pink-100 via-purple-50 to-cyan-100"
    }
  }

  const characteristics = [
    { name: t("petDetail", "characteristicsHunger"), value: pet.hunger, icon: Heart, color: "text-red-500" },
    { name: t("petDetail", "characteristicsHappiness"), value: pet.happiness, icon: Smile, color: "text-yellow-500" },
    { name: t("petDetail", "characteristicsEnergy"), value: pet.energy, icon: Zap, color: "text-blue-500" },
    { name: t("petDetail", "characteristicsHealth"), value: pet.health, icon: Shield, color: "text-green-500" },
    { name: t("petDetail", "characteristicsHygiene"), value: pet.hygiene || 5, icon: Heart, color: "text-purple-500" },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(pet.background)} flex flex-col`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b-4 border-purple-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common", "back")}
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-purple-600">
                  {t("petDetail", "playingWith", { petName: pet.petName })}
                </h1>
                <p className="text-purple-500 capitalize">
                  {t("petDetail", "currentlyAt", {
                    petType: pet?.petType || "Unknown",
                    location: pet?.background || "home",
                  })}
                </p>
              </div>
            </div>
            {/* Botó Admin Panel - NOMÉS PER ADMINISTRADORS */}
            {user && (user.role === "ROLE_ADMIN" || user.role === "ROLE_SUB_ADMIN") && (
              <Button
                onClick={() => {
                  console.log("🔧 Admin Panel button clicked from pet page, navigating to /admin")
                  router.push("/admin")
                }}
                className="bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-500 hover:to-red-500 text-white font-bold"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pet Display */}
            <div className="lg:col-span-2">
              <Card className="border-4 border-pink-200 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-t-lg">
                  {/* ⬅️ MODIFICADO: Pet y joguinas juntos */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-8xl animate-bounce">{getPetEmoji(pet?.petType)}</div>
                    {selectedToys.length > 0 && (
                      <div className="flex gap-2">
                        {selectedToys.map((toy, index) => (
                          <div key={index} className="text-6xl animate-pulse">
                            {getToyEmoji(toy)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-3xl font-bold">{pet.petName}</CardTitle>
                  {selectedToys.length > 0 && (
                    <p className="text-pink-100 mt-2">
                      {t("petDetail", "playingWithToys", {
                        toys: selectedToys.map((toy) => t("petDetail", `toys.${toy}`)).join(", "),
                      })}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {characteristics.map((char) => {
                      const Icon = char.icon
                      return (
                        <div key={char.name} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-5 w-5 ${char.color}`} />
                              <span className="font-bold text-gray-700 text-lg">{char.name}</span>
                            </div>
                            <span className="font-bold text-gray-800 text-xl">{char.value}/10</span>
                          </div>
                          <Progress value={(char.value / 10) * 100} className="h-4" />
                        </div>
                      )
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <Button
                      onClick={handleFeed}
                      disabled={updating}
                      className="bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white font-bold py-4 shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                    >
                      {updating ? "..." : t("petDetail", "actionsFeed")}
                    </Button>
                    <Button
                      onClick={handlePlay}
                      disabled={updating}
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                    >
                      {updating ? "..." : t("petDetail", "actionsPlay")}
                    </Button>
                    <Button
                      onClick={handleRest}
                      disabled={updating}
                      className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                    >
                      {updating ? "..." : t("petDetail", "actionsRest")}
                    </Button>
                    <Button
                      onClick={handleClean}
                      disabled={updating}
                      className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                    >
                      {updating ? "..." : t("petDetail", "actionsClean")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Locations */}
              <Card className="border-4 border-green-200 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-400 to-cyan-400 text-white rounded-t-lg">
                  <CardTitle className="text-xl font-bold">{t("petDetail", "locationsTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <Button
                    onClick={() => handleLocation("home")}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    {t("petDetail", "locationsHome")}
                  </Button>
                  <Button
                    onClick={() => handleLocation("park")}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    <TreePine className="h-4 w-4 mr-2" />
                    {t("petDetail", "locationsPark")}
                  </Button>
                  <Button
                    onClick={() => handleLocation("jungle")}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    <TreePine className="h-4 w-4 mr-2" />
                    {t("petDetail", "locationsJungle")}
                  </Button>
                  <Button
                    onClick={() => handleLocation("desert")}
                    disabled={updating}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    {t("petDetail", "locationsDesert")}
                  </Button>
                </CardContent>
              </Card>

              {/* Objects/Toys */}
              <Card className="border-4 border-yellow-200 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-t-lg">
                  <CardTitle className="text-xl font-bold">{t("petDetail", "toysTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {/* ⬅️ MODIFICADO: Botons amb estat seleccionat/no seleccionat */}
                  <Button
                    onClick={() => handleToySelect("ball")}
                    disabled={updating}
                    className={`w-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 ${
                      selectedToys.includes("ball")
                        ? "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white"
                        : "bg-gray-400 hover:bg-gray-500 text-white"
                    }`}
                  >
                    <div className="text-2xl">⚽</div>
                    <span>{t("petDetail", "toysBall")}</span>
                  </Button>
                  <Button
                    onClick={() => handleToySelect("mouse")}
                    disabled={updating}
                    className={`w-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2 ${
                      selectedToys.includes("mouse")
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white"
                        : "bg-gray-400 hover:bg-gray-500 text-white"
                    }`}
                  >
                    <div className="text-2xl">🧸</div>
                    <span>{t("petDetail", "toysMouse")}</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* ⬅️ NUEVO: Footer */}
      <Footer />
    </div>
  )
}
