"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

/**
 * The page's own motion, mounted once in the layout:
 *
 * 1. Smooth scrolling (Lenis) for mouse wheels and trackpads. Touch keeps the phone's native scroll.
 *    It stops while a dialog or sheet locks the page, honours scroll-margin on anchor links, and
 *    leaves scrollable panels inside the page (menus, dialogs) to scroll on their own.
 *
 * 2. Reveal on scroll. No markup needed: every top-level section, nav and article in <main>, and the
 *    footer, is a group, and the group's children rise into place one after another as the group
 *    enters the viewport. Anything with `data-stagger` also staggers its own children (a grid of
 *    cards). `data-reveal="off"` opts a group out. Each element reveals once.
 *
 * Without JavaScript, or under reduced motion, everything simply shows: nothing is hidden until this
 * has run, and what is already on screen when it runs is never hidden at all.
 */

const GROUPS = "main section, main nav, main article, body > footer, footer[data-site-footer]"
const STEP = 90 // ms between siblings
const MAX_DELAY = 450

function groupsIn(root: ParentNode) {
  const all = Array.from(root.querySelectorAll<HTMLElement>(GROUPS))
  // Only the outermost: a section inside a section reveals with its parent.
  return all.filter((el) => {
    if (el.dataset.reveal === "off" || el.closest("header, [data-reveal='off']")) return false
    const parent = el.parentElement?.closest(GROUPS)
    return !parent || !all.includes(parent as HTMLElement)
  })
}

export function ScrollMotion() {
  const pathname = usePathname()

  // Smooth scroll, once for the life of the page.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      prevent: (node) => node.closest?.("[data-lenis-prevent], [role='dialog'], [data-radix-popper-content-wrapper]") != null,
    })
    // Radix marks <body> while a dialog, sheet or select holds the page still.
    const body = document.body
    const sync = () => (body.hasAttribute("data-scroll-locked") ? lenis.stop() : lenis.start())
    const mo = new MutationObserver(sync)
    mo.observe(body, { attributes: true, attributeFilter: ["data-scroll-locked"] })
    return () => { mo.disconnect(); lenis.destroy() }
  }, [])

  // Reveal on scroll, re-scanned on every route.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const root = document.documentElement
    let io: IntersectionObserver | undefined
    let cleanup = () => {}

    const frame = requestAnimationFrame(() => {
      const units: HTMLElement[] = []
      const mark = (el: HTMLElement, delay: number) => {
        if (el.dataset.reveal != null) return
        el.dataset.reveal = ""
        el.style.setProperty("--reveal-delay", `${Math.min(delay, MAX_DELAY)}ms`)
        units.push(el)
      }

      for (const group of groupsIn(document)) {
        const kids = Array.from(group.children).filter((c): c is HTMLElement => c instanceof HTMLElement)
        const parts = kids.length ? kids : [group]
        parts.forEach((el, i) => {
          if (el.matches("[data-stagger]")) {
            Array.from(el.children).forEach((c, j) => c instanceof HTMLElement && mark(c, (i + j) * STEP))
          } else {
            mark(el, i * STEP)
          }
        })
        // Lists nested deeper that ask to stagger.
        group.querySelectorAll<HTMLElement>("[data-stagger]").forEach((list) => {
          if (list.dataset.reveal != null) return
          Array.from(list.children).forEach((c, j) => c instanceof HTMLElement && mark(c, j * STEP))
        })
      }

      // What is already on screen stays put; only what is below the fold waits to rise.
      const vh = window.innerHeight
      for (const el of units) {
        if (el.getBoundingClientRect().top < vh * 0.92) el.dataset.revealed = "done"
      }
      root.classList.add("reveal-on")

      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            const el = e.target as HTMLElement
            io!.unobserve(el)
            el.dataset.revealed = ""
            // Children run animations of their own; only the reveal itself finishes the element.
            const done = (ev: AnimationEvent) => {
              if (ev.target !== el) return
              el.dataset.revealed = "done"
              el.removeEventListener("animationend", done)
            }
            el.addEventListener("animationend", done)
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0 },
      )
      units.forEach((el) => el.dataset.revealed == null && io!.observe(el))

      // At the very foot of the page, whatever is still waiting (a last line hugging the bottom edge) shows.
      const atEnd = () => {
        if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 4) return
        units.forEach((el) => { if (el.dataset.revealed == null) { io!.unobserve(el); el.dataset.revealed = "done" } })
      }
      window.addEventListener("scroll", atEnd, { passive: true })
      cleanup = () => window.removeEventListener("scroll", atEnd)
    })

    return () => { cancelAnimationFrame(frame); io?.disconnect(); cleanup() }
  }, [pathname])

  return null
}
