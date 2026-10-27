"use client"

import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

// Whether the page has scrolled past the top. Read from the scroll position itself, so a reload mid-page is right too.
const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}
const scrolled = () => window.scrollY > 4

/**
 * The header's shell: clear at the top of the page, so the page runs right up to the top edge, and frosted
 * with a hairline once the page scrolls beneath it. It is sticky throughout; at the top that is invisible.
 */
export function HeaderBar({ children }: { children: React.ReactNode }) {
  const isScrolled = useSyncExternalStore(subscribe, scrolled, () => false)
  return (
    <header
      data-scrolled={isScrolled}
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-(--ease-soft)",
        isScrolled
          ? "border-border/60 bg-background/75 shadow-[0_8px_24px_-16px_rgb(0_0_0/0.25)] backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      {children}
    </header>
  )
}
