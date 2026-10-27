"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/** Dark is the default look; the class on <html> switches the token set in globals.css. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  )
}
