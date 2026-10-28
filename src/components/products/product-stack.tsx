"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"

import { ICONS, ProductVisual } from "@/components/home/product-cards"
import { LANES } from "@/lib/lanes"
import { PRODUCT_FEATURES } from "@/lib/products"
import { cn } from "@/lib/utils"

// Stacking runs from md up, with motion allowed. Below that, or under reduced motion, it is a plain list.
const stackQuery = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"

/**
 * The three products as cards that stack while the page scrolls: each one slides up over the last, the
 * one beneath settles back (a little smaller, dimmer, softly blurred), and the light behind the stack
 * turns to the colour of the card in front. On phones and under reduced motion it is a list, and the
 * page scrolls normally throughout: nothing pins the scroll or takes it over.
 */
export function ProductStack() {
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ol = list.current
    if (!ol) return
    const mq = window.matchMedia(stackQuery)
    const cards = Array.from(ol.querySelectorAll<HTMLElement>("[data-card]"))
    const items = Array.from(ol.children) as HTMLElement[]
    let frame = 0

    const clear = () => cards.forEach((c) => c.style.removeProperty("--cover"))
    const read = () => {
      frame = 0
      let front = 0
      items.forEach((li, i) => {
        const next = items[i + 1]
        if (!next) return
        const stick = parseFloat(getComputedStyle(li).top) || 0
        const h = cards[i].offsetHeight || 1
        // How far the next card has slid over this one: 0 apart, 1 fully over.
        const cover = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - stick) / h))
        cards[i].style.setProperty("--cover", cover.toFixed(3))
        if (cover > 0.5) front = i + 1
      })
      setActive(front)
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    const sync = () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (!mq.matches) { clear(); setActive(0); return }
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
      onScroll()
    }
    sync()
    mq.addEventListener("change", sync)
    return () => {
      mq.removeEventListener("change", sync)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="relative">
      {/* The light behind the stack, one layer per lane, crossfading to the card in front. Rides along
          with the stack and spans the full width of the window. */}
      <div aria-hidden className="pointer-events-none sticky top-0 -z-10 -mb-[100svh] hidden h-[100svh] md:block">
        {LANES.map((l, i) => (
          <div
            key={l.id}
            className={cn(l.scope, "absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 transition-opacity duration-700 ease-(--ease-soft)", active === i ? "opacity-100" : "opacity-0")}
            style={{ background: "radial-gradient(60% 55% at 50% 58%, color-mix(in oklch, var(--lane) calc(var(--glow) * 26%), transparent), transparent 72%)" }}
          />
        ))}
      </div>

      <ol ref={list} className="grid gap-6 md:gap-[22svh]">
        {LANES.map((lane, i) => {
          const Icon = ICONS[lane.id]
          const live = lane.status === "live"
          return (
            <li key={lane.id} className="md:sticky" style={{ top: `calc(var(--header-h) + 2rem + ${i * 1.1}rem)` }}>
              <article
                data-card
                className={cn(
                  lane.scope,
                  "surface-product grid origin-top overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
                  "[--cover:0] md:[transform:scale(calc(1-var(--cover)*0.06))] md:[filter:brightness(calc(1-var(--cover)*0.45))_blur(calc(var(--cover)*3px))]",
                )}
              >
                <div className="grid content-start gap-5 p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="tile-depth size-11 shrink-0"><Icon className="size-5" /></span>
                    <h3 className="text-2xl font-medium tracking-tight">{lane.name}</h3>
                    <span className="label-mono ml-auto text-[11px] tabular-nums">{String(i + 1).padStart(2, "0")} / {String(LANES.length).padStart(2, "0")}</span>
                  </div>
                  <span className="label-mono w-fit rounded-full border border-(--lane-border) px-2.5 py-0.5 text-[10px] text-(--lane-text)">
                    {live ? `LIVE · ${lane.host.toUpperCase()}` : "OPENING SOON"}
                  </span>
                  <p className="text-xl leading-snug text-pretty text-foreground/90">{lane.tagline}</p>
                  <ul className="grid gap-2.5">
                    {PRODUCT_FEATURES[lane.id].map((f) => (
                      <li key={f} className="flex gap-2.5 text-[14.5px] leading-snug text-foreground/85">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-(--lane-text)" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <Link href={`/products/${lane.id}`} className="btn-lane inline-flex h-10 items-center gap-1.5 px-4 text-sm font-medium">
                      About {lane.name} <ArrowRight className="size-4" />
                    </Link>
                    {live && (
                      <a href={`https://${lane.host}`} className="inline-flex h-10 items-center gap-1 px-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        Visit {lane.host} <ArrowUpRight className="size-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <div aria-hidden className="relative hidden min-h-72 md:block">
                  <ProductVisual id={lane.id} />
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
