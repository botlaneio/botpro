import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"

import { AmbientLight } from "@/components/site/ambient-light"
import { ScrollMotion } from "@/components/site/scroll-motion"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

// Self-hosted from npm (@fontsource-variable) so builds never depend on reaching Google Fonts.
const inter = localFont({
  variable: "--font-inter",
  src: [
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
})
const jetbrains = localFont({
  variable: "--font-jetbrains",
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
})

// The colour phones paint their browser bar: the site opens in the dark theme.
export const viewport: Viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark light",
}

export const metadata: Metadata = {
  // Resolves canonical links and social preview images to botlane.io, never www or a preview URL.
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "./" },
  title: "Botlane",
  description: "Ultra-premium websites and web apps, and the Lane products: Syncc, Scriblane and Flowlane.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="relative">
        <AmbientLight />
        {/* Light theme: hairline rails down the content's edges (materials.css). */}
        <div aria-hidden className="page-rails hidden lg:block"><div /></div>
        <ScrollMotion />
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
