import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { ThemeProvider } from "@/hooks/use-theme"
import ThemeSelector from "@/components/ui/theme-selector"
import { LanguageProvider } from "@/hooks/use-language"
import LanguageSelector from "@/components/ui/language-selector"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pet Academy - Virtual Pet Game",
  description: "A magical virtual pet academy for children",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <ThemeSelector />
              <LanguageSelector />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
