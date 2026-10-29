"use client"

import { useEffect, useState } from "react"
import { Cookie } from "lucide-react"

const KEY = "botlane-cookie-note"

/**
 * The cookie note, in the frosted card of Framer's Cookie Consent Banner. botlane.io sets no tracking or
 * advertising cookies and embeds nothing that does, so there is nothing to consent to: rather than a consent
 * dialog with toggles for cookies that don't exist, it says so, once, in the corner, without blocking the page.
 * The browser keeps only the light or dark choice, and that the note was read. Add analytics or embeds and this
 * becomes a consent dialog.
 */
export function CookieNote() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let seen = false
    try { seen = localStorage.getItem(KEY) === "1" } catch {}
    if (seen) return
    // Once the visitor scrolls past most of the first screen, so it never covers the hero or its animation.
    const check = () => { if (window.scrollY > window.innerHeight * 0.6) { setShown(true); window.removeEventListener("scroll", check) } }
    window.addEventListener("scroll", check, { passive: true })
    check()
    return () => window.removeEventListener("scroll", check)
  }, [])

  if (!shown) return null

  const close = () => {
    try { localStorage.setItem(KEY, "1") } catch {}
    setShown(false)
  }

  return (
    <section
      role="region" aria-label="Cookies"
      className="frost cookie-note fixed bottom-4 left-4 right-4 z-30 max-w-[22.5rem] rounded-2xl p-5 sm:bottom-6 sm:left-6 sm:right-auto sm:p-6"
    >
      <div className="flex items-center gap-2.5">
        <Cookie aria-hidden className="size-[18px] text-foreground/80" strokeWidth={1.75} />
        <h2 className="text-[15px] font-semibold tracking-tight">Cookies? None here.</h2>
      </div>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-foreground/70">
        We don&apos;t track you or show you ads. Your browser only keeps your light or dark setting, and that you&apos;ve read this.
      </p>
      <button type="button" onClick={close} className="btn-light mt-4 inline-flex h-10 w-full items-center justify-center text-sm font-medium">
        Got it
      </button>
    </section>
  )
}
