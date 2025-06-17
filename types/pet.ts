export interface Pet {
  id: string
  petName: string
  petType: string
  userName: string
  hunger: number
  happiness: number
  energy: number
  health: number
  hygiene?: number
  objects: string[]
  background: string | null
}

export interface User {
  userName: string
  email: string
  fullName: string | null
  city: string | null
  country: string | null
  createdAt: string
  accountLockedAt?: string | null
  accountBlockedAt?: string | null
  role: string // ⬅️ CORREGIDO: Només el camp "role" que ve del backend
}
