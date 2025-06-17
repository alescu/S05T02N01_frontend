"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Pet } from "@/types/pet"
import { Play, Trash2, Heart, Zap, Smile, Shield } from "lucide-react"

interface PetCardProps {
  pet: Pet
  onDelete: () => void
  onPlay: () => void
}

export default function PetCard({ pet, onDelete, onPlay }: PetCardProps) {
  const getPetEmoji = (type: string) => {
    return type.toLowerCase() === "cat" ? "🐱" : "🐶"
  }

  const getCharacteristicColor = (value: number) => {
    if (value >= 8) return "bg-green-500"
    if (value >= 5) return "bg-yellow-500"
    return "bg-red-500"
  }

  const characteristics = [
    { name: "Hunger", value: pet.hunger, icon: Heart, color: "text-red-500" },
    { name: "Happiness", value: pet.happiness, icon: Smile, color: "text-yellow-500" },
    { name: "Energy", value: pet.energy, icon: Zap, color: "text-blue-500" },
    { name: "Health", value: pet.health, icon: Shield, color: "text-green-500" },
    { name: "Hygiene", value: pet.hygiene || 5, icon: Heart, color: "text-purple-500" },
  ]

  return (
    <Card className="border-4 border-pink-200 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <CardHeader className="text-center bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-t-lg">
        <div className="text-6xl mb-2">{getPetEmoji(pet.petType)}</div>
        <CardTitle className="text-2xl font-bold">{pet.petName}</CardTitle>
        <p className="text-pink-100 capitalize">{pet.petType}</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6">
          {characteristics.map((char) => {
            const Icon = char.icon
            return (
              <div key={char.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${char.color}`} />
                    <span className="font-medium text-gray-700">{char.name}</span>
                  </div>
                  <span className="font-bold text-gray-800">{char.value}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getCharacteristicColor(char.value)}`}
                    style={{ width: `${(char.value / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onPlay}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Play className="h-4 w-4 mr-2" />
            Play
          </Button>
          <Button onClick={onDelete} variant="outline" className="border-2 border-red-300 text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
