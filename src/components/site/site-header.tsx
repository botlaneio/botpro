import Link from "next/link"

import { BotlaneMark } from "./botlane-mark"
import { ThemeSwitch } from "./theme-switch"

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/services#products", label: "Our products" },
  { href: "/contact", label: "Contact" },
]

/** The bar across the top of every page: the wordmark, the sections, and the main action. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <BotlaneMark size={26} id="header-mark" />
          <span className="font-semibold tracking-[-0.035em]">botlane</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-foreground">{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <Link href="/contact" className="btn-light inline-flex h-8 items-center px-3 text-sm font-medium">
            Start a project
          </Link>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-sm text-muted-foreground sm:px-6">
        <span>© {new Date().getFullYear()} Botlane</span>
        <nav aria-label="Footer" className="flex gap-5">
          {NAV.map((n) => <Link key={n.href} href={n.href} className="hover:text-foreground">{n.label}</Link>)}
        </nav>
      </div>
    </footer>
  )
}
