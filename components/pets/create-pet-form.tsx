"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/use-language"

interface CreatePetFormProps {
  onSubmit: (petData: { petName: string; petType: string }) => Promise<void>
  onCancel: () => void
}

export default function CreatePetForm({ onSubmit, onCancel }: CreatePetFormProps) {
  const [petName, setPetName] = useState("")
  const [petType, setPetType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!petName.trim()) {
      setError("Pet name is required")
      return
    }

    if (!petType) {
      setError("Pet type is required")
      return
    }

    setLoading(true)
    setError("")

    const petData = {
      petName: petName.trim(),
      petType: petType,
    }

    console.log("🎯 Form submitting pet data:", petData)

    try {
      await onSubmit(petData)
      console.log("✅ Pet creation completed successfully")

      // Reset form only on success
      setPetName("")
      setPetType("")
    } catch (error) {
      console.error("❌ Pet creation failed in form:", error)

      // Mostrar error más específico
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setError("Connection error. Please check if the server is running.")
        } else if (error.message.includes("401")) {
          setError("Authentication error. Please login again.")
        } else if (error.message.includes("400")) {
          setError("Invalid pet data. Please check your input.")
        } else {
          setError(`Error: ${error.message}`)
        }
      } else {
        setError("Failed to create pet. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="petName" className="text-purple-700 font-medium">
            {t("petCreation", "petName")}
          </Label>
          <Input
            id="petName"
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
            disabled={loading}
            className="border-2 border-purple-200 focus:border-purple-400 rounded-lg"
            placeholder={t("petCreation", "petNamePlaceholder")}
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="petType" className="text-purple-700 font-medium">
            {t("petCreation", "petType")}
          </Label>
          <Select value={petType} onValueChange={setPetType} required disabled={loading}>
            <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
              <SelectValue placeholder={t("petCreation", "petTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cat">{t("petCreation", "cat")}</SelectItem>
              <SelectItem value="dog">{t("petCreation", "dog")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading || !petName.trim() || !petType}
            className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t("petCreation", "creating")}
              </>
            ) : (
              t("petCreation", "createButton")
            )}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            disabled={loading}
            variant="outline"
            className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {t("common", "cancel")}
          </Button>
        </div>
      </form>
    </div>
  )
}
