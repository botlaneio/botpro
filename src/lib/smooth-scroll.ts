import type Lenis from "lenis"

/**
 * The page's Lenis instance, registered by ScrollMotion, so code outside it (Lane's guiding) can scroll
 * through Lenis instead of fighting it. Falls back to the browser's own scroll when Lenis is off
 * (touch, reduced motion).
 */
let current: Lenis | null = null

export function setSmoothScroll(lenis: Lenis | null) {
  current = lenis
}

export function scrollToY(y: number) {
  if (current) {
    current.scrollTo(y, { duration: 1.2 })
    return
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" })
}
