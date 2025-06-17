// Configuració de tema centralitzada
export const THEME_VARIANTS = {
  // Tema 1: Rosa-Lila (original)
  pastel_pink: {
    name: "Pastel Pink",
    icon: "🌸",
    colors: {
      main: "bg-pink-50",
      login: "bg-purple-50",
      dashboard: "bg-pink-50",
      admin: "bg-orange-50",
      petDetail: "bg-green-50",
      register: "bg-cyan-50",
    },
    gradients: {
      main: "from-pink-50 via-purple-25 to-cyan-50",
      login: "from-purple-50 via-pink-25 to-cyan-50",
      dashboard: "from-pink-50 via-purple-25 to-cyan-50",
      admin: "from-orange-50 via-red-25 to-pink-50",
      petDetail: "from-green-100 via-emerald-50 to-lime-50",
      register: "from-cyan-50 via-purple-25 to-pink-50",
    },
    // ⬅️ MODIFICADO: Colors plans per botons (color del mig del gradient)
    ui: {
      primary: {
        bg: "bg-purple-125", // ⬅️ Color pla del mig
        bgHover: "bg-purple-175", // ⬅️ Una mica més fosc per hover
        text: "text-purple-500",
        textLight: "text-purple-400",
        textOnBg: "text-purple-700", // ⬅️ Text més fosc per contrast sobre el botó
        border: "border-purple-150",
        borderFocus: "border-purple-300",
      },
      secondary: {
        bg: "bg-pink-125",
        bgHover: "bg-pink-175",
        text: "text-pink-500",
        textLight: "text-pink-400",
        textOnBg: "text-pink-700",
        border: "border-pink-150",
        borderFocus: "border-pink-300",
      },
      accent: {
        bg: "bg-cyan-125",
        bgHover: "bg-cyan-175",
        text: "text-cyan-500",
        textLight: "text-cyan-400",
        textOnBg: "text-cyan-700",
        border: "border-cyan-150",
        borderFocus: "border-cyan-300",
      },
      header: {
        bg: "from-purple-100 to-pink-100", // ⬅️ Mantenir gradient per headers
        text: "text-purple-600",
        border: "border-purple-150",
      },
    },
  },

  // Tema 2: Blau-Verd
  pastel_blue: {
    name: "Ocean Breeze",
    icon: "🌊",
    colors: {
      main: "bg-blue-50",
      login: "bg-sky-50",
      dashboard: "bg-blue-50",
      admin: "bg-indigo-50",
      petDetail: "bg-teal-50",
      register: "bg-cyan-50",
    },
    gradients: {
      main: "from-blue-50 via-sky-25 to-teal-50",
      login: "from-sky-50 via-blue-25 to-cyan-50",
      dashboard: "from-blue-50 via-sky-25 to-teal-50",
      admin: "from-indigo-50 via-blue-25 to-sky-50",
      petDetail: "from-teal-100 via-emerald-50 to-green-50",
      register: "from-cyan-50 via-sky-25 to-blue-50",
    },
    // ⬅️ MODIFICADO: Colors plans per botons
    ui: {
      primary: {
        bg: "bg-blue-125",
        bgHover: "bg-blue-175",
        text: "text-blue-500",
        textLight: "text-blue-400",
        textOnBg: "text-blue-700",
        border: "border-blue-150",
        borderFocus: "border-blue-300",
      },
      secondary: {
        bg: "bg-teal-125",
        bgHover: "bg-teal-175",
        text: "text-teal-500",
        textLight: "text-teal-400",
        textOnBg: "text-teal-700",
        border: "border-teal-150",
        borderFocus: "border-teal-300",
      },
      accent: {
        bg: "bg-sky-125",
        bgHover: "bg-sky-175",
        text: "text-sky-500",
        textLight: "text-sky-400",
        textOnBg: "text-sky-700",
        border: "border-sky-150",
        borderFocus: "border-sky-300",
      },
      header: {
        bg: "from-blue-100 to-teal-100",
        text: "text-blue-600",
        border: "border-blue-150",
      },
    },
  },

  // Tema 3: Verd-Groc
  pastel_green: {
    name: "Spring Garden",
    icon: "🌿",
    colors: {
      main: "bg-green-50",
      login: "bg-emerald-50",
      dashboard: "bg-green-50",
      admin: "bg-yellow-50",
      petDetail: "bg-lime-50",
      register: "bg-teal-50",
    },
    gradients: {
      main: "from-green-50 via-emerald-25 to-lime-50",
      login: "from-emerald-50 via-green-25 to-teal-50",
      dashboard: "from-green-50 via-emerald-25 to-lime-50",
      admin: "from-yellow-50 via-amber-25 to-orange-50",
      petDetail: "from-lime-100 via-green-50 to-emerald-50",
      register: "from-teal-50 via-emerald-25 to-green-50",
    },
    // ⬅️ MODIFICADO: Colors plans per botons
    ui: {
      primary: {
        bg: "bg-green-125",
        bgHover: "bg-green-175",
        text: "text-green-500",
        textLight: "text-green-400",
        textOnBg: "text-green-700",
        border: "border-green-150",
        borderFocus: "border-green-300",
      },
      secondary: {
        bg: "bg-emerald-125",
        bgHover: "bg-emerald-175",
        text: "text-emerald-500",
        textLight: "text-emerald-400",
        textOnBg: "text-emerald-700",
        border: "border-emerald-150",
        borderFocus: "border-emerald-300",
      },
      accent: {
        bg: "bg-lime-125",
        bgHover: "bg-lime-175",
        text: "text-lime-500",
        textLight: "text-lime-400",
        textOnBg: "text-lime-700",
        border: "border-lime-150",
        borderFocus: "border-lime-300",
      },
      header: {
        bg: "from-green-100 to-emerald-100",
        text: "text-green-600",
        border: "border-green-150",
      },
    },
  },
} as const

export type ThemeVariant = keyof typeof THEME_VARIANTS

export const THEME = {
  // Paleta de colors principal
  colors: {
    primary: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
    },
    secondary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
  },

  // Configuració de backgrounds
  backgrounds: {
    useImages: false, // Canvia a false per usar només gradients
    useGradients: true, // Canvia a false per usar colors plans
    overlay: "bg-black/20", // Overlay sobre les imatges
    fallbackGradient: "from-pink-50 via-purple-25 to-cyan-50",
  },

  // Efectes i animacions
  effects: {
    blur: "backdrop-blur-sm",
    shadow: "shadow-xl",
    borderRadius: "rounded-lg",
    transition: "transition-all duration-300",
  },
} as const

// Funció helper per obtenir el background complet
export function getBackgroundStyle(
  page: keyof typeof THEME_VARIANTS.pastel_pink.gradients,
  variant: ThemeVariant = "pastel_pink",
): string {
  const selectedTheme = THEME_VARIANTS[variant]

  if (THEME.backgrounds.useImages) {
    // Si volem usar imatges, retornem una classe que combina imatge + overlay
    return `bg-gradient-to-br ${selectedTheme.gradients[page]} bg-cover bg-center bg-no-repeat`
  } else if (THEME.backgrounds.useGradients) {
    // Si volem gradients
    return `bg-gradient-to-br ${selectedTheme.gradients[page]}`
  } else {
    // Si volem colors plans
    return selectedTheme.colors[page]
  }
}

// ⬅️ NUEVO: Funció per obtenir colors d'UI segons el tema
export function getUIColors(variant: ThemeVariant = "pastel_pink") {
  return THEME_VARIANTS[variant].ui
}

// Funció per obtenir el tema actual des de localStorage (amb fallback segur)
export function getCurrentTheme(): ThemeVariant {
  if (typeof window === "undefined") return "pastel_pink"

  try {
    const saved = localStorage.getItem("pet-academy-theme")
    if (saved && saved in THEME_VARIANTS) {
      return saved as ThemeVariant
    }
  } catch (error) {
    console.warn("Error reading theme from localStorage:", error)
  }
  return "pastel_pink"
}

// Funció per guardar el tema
export function saveTheme(variant: ThemeVariant): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("pet-academy-theme", variant)
      console.log("🎨 Theme saved to localStorage:", variant)
    } catch (error) {
      console.warn("Error saving theme to localStorage:", error)
    }
  }
}
