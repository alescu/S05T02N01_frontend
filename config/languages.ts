// Configuració d'idiomes i traduccions
export const SUPPORTED_LANGUAGES = {
  ca: {
    name: "Català",
    flag: "🇪🇸",
    code: "ca",
  },
  es: {
    name: "Castellano",
    flag: "🇪🇸",
    code: "es",
  },
  en: {
    name: "English",
    flag: "🇬🇧",
    code: "en",
  },
  fr: {
    name: "Français",
    flag: "🇫🇷",
    code: "fr",
  },
} as const

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES

// Traduccions organitzades per secció
export const TRANSLATIONS = {
  // Navegació i elements comuns
  common: {
    loading: {
      ca: "Carregant...",
      es: "Cargando...",
      en: "Loading...",
      fr: "Chargement...",
    },
    save: {
      ca: "Guardar",
      es: "Guardar",
      en: "Save",
      fr: "Sauvegarder",
    },
    cancel: {
      ca: "Cancel·lar",
      es: "Cancelar",
      en: "Cancel",
      fr: "Annuler",
    },
    delete: {
      ca: "Eliminar",
      es: "Eliminar",
      en: "Delete",
      fr: "Supprimer",
    },
    edit: {
      ca: "Editar",
      es: "Editar",
      en: "Edit",
      fr: "Modifier",
    },
    back: {
      ca: "Tornar",
      es: "Volver",
      en: "Back",
      fr: "Retour",
    },
    refresh: {
      ca: "Actualitzar",
      es: "Actualizar",
      en: "Refresh",
      fr: "Actualiser",
    },
    logout: {
      ca: "Tancar sessió",
      es: "Cerrar sesión",
      en: "Logout",
      fr: "Déconnexion",
    },
  },

  // Autenticació
  auth: {
    loginTitle: {
      ca: "Entra a Pet Academy",
      es: "Entra a Pet Academy",
      en: "Login to Pet Academy",
      fr: "Connexion à Pet Academy",
    },
    loginSubtitle: {
      ca: "Entra a la teva acadèmia màgica de mascotes!",
      es: "¡Entra a tu academia mágica de mascotas!",
      en: "Enter your magical academy of pets!",
      fr: "Entrez dans votre académie magique d'animaux !",
    },
    username: {
      ca: "Nom d'usuari",
      es: "Nombre de usuario",
      en: "Username",
      fr: "Nom d'utilisateur",
    },
    password: {
      ca: "Contrasenya",
      es: "Contraseña",
      en: "Password",
      fr: "Mot de passe",
    },
    loginButton: {
      ca: "🌟 Entra a Pet Academy 🌟",
      es: "🌟 Entra a Pet Academy 🌟",
      en: "🌟 Enter Pet Academy 🌟",
      fr: "🌟 Entrer à Pet Academy 🌟",
    },
    loggingIn: {
      ca: "Entrant...",
      es: "Entrando...",
      en: "Logging in...",
      fr: "Connexion...",
    },
    noAccount: {
      ca: "No tens compte?",
      es: "¿No tienes cuenta?",
      en: "Don't have an account?",
      fr: "Vous n'avez pas de compte ?",
    },
    createAccount: {
      ca: "Crear nou compte",
      es: "Crear nueva cuenta",
      en: "Create New Account",
      fr: "Créer un nouveau compte",
    },
    renewPassword: {
      ca: "Renovar contrasenya",
      es: "Renovar contraseña",
      en: "Renew password",
      fr: "Renouveler le mot de passe",
    },
    authError: {
      ca: "Error d'autenticació.\nSi us plau, intenteu-ho de nou.",
      es: "Error de autenticación.\nPor favor, inténtalo de nuevo.",
      en: "Authentication error.\nPlease try again.",
      fr: "Erreur d'authentification.\nVeuillez réessayer.",
    },
  },

  // Registre
  register: {
    title: {
      ca: "🌟 Uneix-te a Pet Academy 🌟",
      es: "🌟 Únete a Pet Academy 🌟",
      en: "🌟 Join Pet Academy 🌟",
      fr: "🌟 Rejoignez Pet Academy 🌟",
    },
    subtitle: {
      ca: "Crea el teu compte màgic!",
      es: "¡Crea tu cuenta mágica!",
      en: "Create your magical account!",
      fr: "Créez votre compte magique !",
    },
    createAccountTitle: {
      ca: "Crear Compte",
      es: "Crear Cuenta",
      en: "Create Account",
      fr: "Créer un Compte",
    },
    createAccountSubtitle: {
      ca: "Escull el teu tipus d'aventura!",
      es: "¡Elige tu tipo de aventura!",
      en: "Choose your adventure type!",
      fr: "Choisissez votre type d'aventure !",
    },
    email: {
      ca: "Correu electrònic",
      es: "Correo electrónico",
      en: "Email",
      fr: "E-mail",
    },
    confirmPassword: {
      ca: "Confirmar contrasenya",
      es: "Confirmar contraseña",
      en: "Confirm Password",
      fr: "Confirmer le mot de passe",
    },
    createButton: {
      ca: "🎉 Crear el meu compte 🎉",
      es: "🎉 Crear mi cuenta 🎉",
      en: "🎉 Create My Account 🎉",
      fr: "🎉 Créer mon compte 🎉",
    },
    creating: {
      ca: "Creant compte...",
      es: "Creando cuenta...",
      en: "Creating Account...",
      fr: "Création du compte...",
    },
    alreadyHaveAccount: {
      ca: "Ja tens compte?",
      es: "¿Ya tienes cuenta?",
      en: "Already have an account?",
      fr: "Vous avez déjà un compte ?",
    },
    backToLogin: {
      ca: "Tornar al login",
      es: "Volver al login",
      en: "Back to Login",
      fr: "Retour à la connexion",
    },
  },

  // Dashboard
  dashboard: {
    title: {
      ca: "🐾 Tauler de Pet Academy",
      es: "🐾 Panel de Pet Academy",
      en: "🐾 Pet Academy Dashboard",
      fr: "🐾 Tableau de bord Pet Academy",
    },
    welcome: {
      ca: "Benvingut de nou, {username}! 🌟",
      es: "¡Bienvenido de nuevo, {username}! 🌟",
      en: "Welcome back, {username}! 🌟",
      fr: "Bon retour, {username} ! 🌟",
    },
    createPetTitle: {
      ca: "Crear Nova Mascota",
      es: "Crear Nueva Mascota",
      en: "Create New Pet",
      fr: "Créer un Nouvel Animal",
    },
    createPetSubtitle: {
      ca: "Afegeix un nou amic pelut a la teva col·lecció!",
      es: "¡Añade un nuevo amigo peludo a tu colección!",
      en: "Add a new furry friend to your collection!",
      fr: "Ajoutez un nouvel ami à fourrure à votre collection !",
    },
    createPetButton: {
      ca: "🎉 Crear la teva mascota 🎉",
      es: "🎉 Crear tu mascota 🎉",
      en: "🎉 Create Your Pet 🎉",
      fr: "🎉 Créer votre animal 🎉",
    },
    petFamilyTitle: {
      ca: "🏠 La teva família de mascotes 🏠",
      es: "🏠 Tu familia de mascotas 🏠",
      en: "🏠 Your Pet Family 🏠",
      fr: "🏠 Votre famille d'animaux 🏠",
    },
    petCount: {
      ca: "Tens {count} mascota|Tens {count} mascotes",
      es: "Tienes {count} mascota|Tienes {count} mascotas",
      en: "You have {count} pet|You have {count} pets",
      fr: "Vous avez {count} animal|Vous avez {count} animaux",
    },
    noPetsTitle: {
      ca: "Encara no tens mascotes!",
      es: "¡Aún no tienes mascotas!",
      en: "No Pets Yet!",
      fr: "Pas encore d'animaux !",
    },
    noPetsMessage: {
      ca: "Crea la teva primera mascota per començar la teva aventura!",
      es: "¡Crea tu primera mascota para comenzar tu aventura!",
      en: "Create your first pet to start your adventure!",
      fr: "Créez votre premier animal pour commencer votre aventure !",
    },
    loadingPets: {
      ca: "Carregant les teves mascotes...",
      es: "Cargando tus mascotas...",
      en: "Loading your pets...",
      fr: "Chargement de vos animaux...",
    },
  },

  // Creació de mascotes
  petCreation: {
    petName: {
      ca: "Nom de la mascota",
      es: "Nombre de la mascota",
      en: "Pet Name",
      fr: "Nom de l'animal",
    },
    petType: {
      ca: "Tipus de mascota",
      es: "Tipo de mascota",
      en: "Pet Type",
      fr: "Type d'animal",
    },
    petNamePlaceholder: {
      ca: "Dona un nom bonic a la teva mascota!",
      es: "¡Dale un nombre bonito a tu mascota!",
      en: "Give your pet a cute name!",
      fr: "Donnez un joli nom à votre animal !",
    },
    petTypePlaceholder: {
      ca: "Escull el tipus de mascota",
      es: "Elige el tipo de mascota",
      en: "Choose your pet type",
      fr: "Choisissez le type d'animal",
    },
    cat: {
      ca: "🐱 Gat",
      es: "🐱 Gato",
      en: "🐱 Cat",
      fr: "🐱 Chat",
    },
    dog: {
      ca: "🐶 Gos",
      es: "🐶 Perro",
      en: "🐶 Dog",
      fr: "🐶 Chien",
    },
    createButton: {
      ca: "🎉 Crear mascota 🎉",
      es: "🎉 Crear mascota 🎉",
      en: "🎉 Create Pet 🎉",
      fr: "🎉 Créer l'animal 🎉",
    },
    creating: {
      ca: "Creant...",
      es: "Creando...",
      en: "Creating...",
      fr: "Création...",
    },
  },

  // Detalls de mascota
  petDetail: {
    playingWith: {
      ca: "Jugant amb {petName}",
      es: "Jugando con {petName}",
      en: "Playing with {petName}",
      fr: "Jouer avec {petName}",
    },
    currentlyAt: {
      ca: "{petType} • Actualment a {location}",
      es: "{petType} • Actualmente en {location}",
      en: "{petType} • Currently at {location}",
      fr: "{petType} • Actuellement à {location}",
    },
    characteristicsHunger: { ca: "Gana", es: "Hambre", en: "Hunger", fr: "Faim" },
    characteristicsHappiness: { ca: "Felicitat", es: "Felicidad", en: "Happiness", fr: "Bonheur" },
    characteristicsEnergy: { ca: "Energia", es: "Energía", en: "Energy", fr: "Énergie" },
    characteristicsHealth: { ca: "Salut", es: "Salud", en: "Health", fr: "Santé" },
    characteristicsHygiene: { ca: "Higiene", es: "Higiene", en: "Hygiene", fr: "Hygiène" },

    actionsFeed: { ca: "🍖 Alimentar", es: "🍖 Alimentar", en: "🍖 Feed", fr: "🍖 Nourrir" },
    actionsPlay: { ca: "🎾 Jugar", es: "🎾 Jugar", en: "🎾 Play", fr: "🎾 Jouer" },
    actionsRest: { ca: "😴 Descansar", es: "😴 Descansar", en: "😴 Rest", fr: "😴 Repos" },
    actionsClean: { ca: "🛁 Netejar", es: "🛁 Limpiar", en: "🛁 Clean", fr: "🛁 Nettoyer" },

    locationsTitle: { ca: "🌍 Ubicacions", es: "🌍 Ubicaciones", en: "🌍 Locations", fr: "🌍 Emplacements" },
    locationsHome: { ca: "🏠 Casa", es: "🏠 Casa", en: "🏠 Home", fr: "🏠 Maison" },
    locationsPark: { ca: "🌳 Parc", es: "🌳 Parque", en: "🌳 Park", fr: "🌳 Parc" },
    locationsJungle: { ca: "🌿 Selva", es: "🌿 Selva", en: "🌿 Jungle", fr: "🌿 Jungle" },
    locationsDesert: { ca: "🏜️ Desert", es: "🏜️ Desierto", en: "🏜️ Desert", fr: "🏜️ Désert" },

    toysTitle: { ca: "🎾 Joguines", es: "🎾 Juguetes", en: "🎾 Toys", fr: "🎾 Jouets" },
    toysBall: { ca: "Pilota", es: "Pelota", en: "Ball", fr: "Balle" },
    toysMouse: { ca: "Ratolí de joguina", es: "Ratón de juguete", en: "Toy Mouse", fr: "Souris jouet" },
    playingWithToys: {
      ca: "Jugant amb {toys}!",
      es: "¡Jugando con {toys}!",
      en: "Playing with {toys}!",
      fr: "Jouer avec {toys} !",
    },
  },

  // Admin
  admin: {
    title: {
      ca: "🔧 Panell d'Administració de Pet Academy ({role})",
      es: "🔧 Panel de Administración de Pet Academy ({role})",
      en: "🔧 Pet Academy Admin Panel ({role})",
      fr: "🔧 Panneau d'administration Pet Academy ({role})",
    },
    subtitle: {
      ca: "Gestiona usuaris i mascotes - Benvingut {username}!",
      es: "Gestiona usuarios y mascotas - ¡Bienvenido {username}!",
      en: "Manage users and pets - Welcome {username}!",
      fr: "Gérer les utilisateurs et les animaux - Bienvenue {username} !",
    },
    myPets: {
      ca: "Les meves mascotes",
      es: "Mis mascotas",
      en: "My Pets",
      fr: "Mes animaux",
    },
    usersSection: {
      ca: "Tots els usuaris ({count})",
      es: "Todos los usuarios ({count})",
      en: "All Users ({count})",
      fr: "Tous les utilisateurs ({count})",
    },
    usersDescription: {
      ca: "Gestiona comptes d'usuari i permisos",
      es: "Gestiona cuentas de usuario y permisos",
      en: "Manage user accounts and permissions",
      fr: "Gérer les comptes d'utilisateurs et les autorisations",
    },
    petsSection: {
      ca: "Totes les mascotes ({count})",
      es: "Todas las mascotas ({count})",
      en: "All Pets ({count})",
      fr: "Tous les animaux ({count})",
    },
    petsDescription: {
      ca: "Visualitza i filtra totes les mascotes dels usuaris",
      es: "Visualiza y filtra todas las mascotas de los usuarios",
      en: "View and filter all user pets",
      fr: "Voir et filtrer tous les animaux des utilisateurs",
    },
  },

  // Temes
  themes: {
    chooseTheme: {
      ca: "Escull tema",
      es: "Elegir tema",
      en: "Choose Theme",
      fr: "Choisir le thème",
    },
    current: {
      ca: "Actual: {theme}",
      es: "Actual: {theme}",
      en: "Current: {theme}",
      fr: "Actuel : {theme}",
    },
    saved: {
      ca: "Tema guardat automàticament",
      es: "Tema guardado automáticamente",
      en: "Theme saved automatically",
      fr: "Thème sauvegardé automatiquement",
    },
  },

  // Idiomes
  languages: {
    chooseLanguage: {
      ca: "Escull idioma",
      es: "Elegir idioma",
      en: "Choose Language",
      fr: "Choisir la langue",
    },
    current: {
      ca: "Actual: {language}",
      es: "Actual: {language}",
      en: "Current: {language}",
      fr: "Actuel : {language}",
    },
    saved: {
      ca: "Idioma guardat automàticament",
      es: "Idioma guardado automáticamente",
      en: "Language saved automatically",
      fr: "Langue sauvegardée automatiquement",
    },
  },

  // Errors
  errors: {
    petNotFound: {
      ca: "Mascota no trobada",
      es: "Mascota no encontrada",
      en: "Pet Not Found",
      fr: "Animal non trouvé",
    },
    couldNotLoad: {
      ca: 'No s\'ha pogut carregar la mascota "{petName}"',
      es: 'No se pudo cargar la mascota "{petName}"',
      en: 'Could not load pet "{petName}"',
      fr: 'Impossible de charger l\'animal "{petName}"',
    },
    accessDenied: {
      ca: "Accés denegat",
      es: "Acceso denegado",
      en: "Access Denied",
      fr: "Accès refusé",
    },
    noPermission: {
      ca: "No tens permisos per accedir a aquesta pàgina.",
      es: "No tienes permisos para acceder a esta página.",
      en: "You don't have permission to access this page.",
      fr: "Vous n'avez pas la permission d'accéder à cette page.",
    },
    backToDashboard: {
      ca: "Tornar al tauler",
      es: "Volver al panel",
      en: "Back to Dashboard",
      fr: "Retour au tableau de bord",
    },
  },
} as const

// Funció helper per obtenir una traducció
export function getTranslation(
  section: keyof typeof TRANSLATIONS,
  key: string,
  language: LanguageCode = "ca",
  variables?: Record<string, string | number>,
): string {
  try {
    // Navegar per la estructura de traduccions
    const sectionTranslations = TRANSLATIONS[section] as any
    if (!sectionTranslations) {
      console.warn(`Translation section "${section}" not found`)
      return key
    }

    const keyTranslations = sectionTranslations[key]
    if (!keyTranslations) {
      console.warn(`Translation key "${key}" not found in section "${section}"`)
      return key
    }

    let translation = keyTranslations[language]
    if (!translation) {
      // Fallback al català si no existeix la traducció
      translation = keyTranslations.ca || key
      console.warn(`Translation for "${key}" not found in language "${language}", using Catalan fallback`)
    }

    // Substituir variables si n'hi ha
    if (variables) {
      Object.entries(variables).forEach(([varName, value]) => {
        translation = translation.replace(new RegExp(`\\{${varName}\\}`, "g"), String(value))
      })
    }

    // Gestionar plurals (format: "singular|plural")
    if (variables && variables.count !== undefined) {
      const parts = translation.split("|")
      if (parts.length === 2) {
        translation = Number(variables.count) === 1 ? parts[0] : parts[1]
      }
    }

    return translation
  } catch (error) {
    console.error(`Error getting translation for ${section}.${key}:`, error)
    return key
  }
}

// Funció per obtenir l'idioma actual des de localStorage
export function getCurrentLanguage(): LanguageCode {
  if (typeof window === "undefined") return "ca"

  try {
    const saved = localStorage.getItem("pet-academy-language")
    if (saved && saved in SUPPORTED_LANGUAGES) {
      return saved as LanguageCode
    }
  } catch (error) {
    console.warn("Error reading language from localStorage:", error)
  }
  return "ca"
}

// Funció per guardar l'idioma
export function saveLanguage(language: LanguageCode): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("pet-academy-language", language)
      console.log("🌐 Language saved to localStorage:", language)
    } catch (error) {
      console.warn("Error saving language to localStorage:", error)
    }
  }
}
