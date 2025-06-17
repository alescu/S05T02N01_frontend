// Configuració centralitzada d'imatges
export const IMAGES = {
  // Backgrounds principals
  backgrounds: {
    main: "/img/backgrounds/main-bg.jpg",
    login: "/img/backgrounds/login-bg.jpg",
    dashboard: "/img/backgrounds/dashboard-bg.jpg",
    admin: "/img/backgrounds/admin-bg.jpg",
    petDetail: "/img/backgrounds/pet-detail-bg.jpg",
    register: "/img/backgrounds/register-bg.jpg",
  },

  // Backgrounds per ubicacions de mascotes
  petLocations: {
    home: "/img/locations/home-bg.jpg",
    park: "/img/locations/park-bg.jpg",
    jungle: "/img/locations/jungle-bg.jpg",
    desert: "/img/locations/desert-bg.jpg",
  },

  // Imatges de mascotes (opcionals, si vols substituir els emojis)
  pets: {
    cat: "/img/pets/cat.png",
    dog: "/img/pets/dog.png",
  },

  // Icones i decoracions
  decorations: {
    logo: "/img/decorations/logo.png",
    stars: "/img/decorations/stars.png",
    hearts: "/img/decorations/hearts.png",
  },

  // Imatges per joguines (opcionals)
  toys: {
    ball: "/img/toys/ball.png",
    mouse: "/img/toys/mouse.png",
  },
} as const

// Funció helper per obtenir imatges amb fallback
export function getImageUrl(category: keyof typeof IMAGES, key: string, fallback?: string): string {
  const categoryImages = IMAGES[category] as Record<string, string>
  return categoryImages?.[key] || fallback || ""
}

// Funció per verificar si una imatge existeix
export function hasImage(category: keyof typeof IMAGES, key: string): boolean {
  const categoryImages = IMAGES[category] as Record<string, string>
  return Boolean(categoryImages?.[key])
}
