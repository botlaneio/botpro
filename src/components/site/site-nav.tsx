"use client"

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, ChevronDown, FileText, Workflow } from "lucide-react"

import { OFFER_ICONS } from "@/components/catalog/offer-icons"
import type { OfferIcon } from "@/lib/catalog"
import type { LaneId } from "@/lib/lanes"
import { cn } from "@/lib/utils"

import { BotlaneMark } from "./botlane-mark"
import { ThemeSwitch } from "./theme-switch"

/** One card in a section: a lit visual with its icon, then a name, one line and a price or status. */
export interface NavCard {
  href: string
  title: string
  body: string
  meta: string
  icon: OfferIcon | LaneId
  /** The colour its visual is lit with, as a CSS colour. */
  glow: string
  /** Its icon's colour class. */
  tone: string
  soon?: boolean
}

/** One item in the pill: a section of cards, and a link to the section's own page. */
export interface NavSection {
  label: string
  href: string
  all: string
  cards: NavCard[]
}

const LANE_ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = { syncc: CalendarDays, scriblane: FileText, flowlane: Workflow }
const isOffer = (k: NavCard["icon"]): k is OfferIcon => k in OFFER_ICONS

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}
const scrolled = () => window.scrollY > 4

// The panel's spring: a soft settle with a little overshoot, after the reference's 0.5s spring at 0.1 bounce.
const SPRING = "cubic-bezier(0.22, 1.12, 0.36, 1)"
const MORPH_MS = 480
// The pill's own height, and the panel's padding round the cards.
const PILL_H = 40, PAD = 12

function Card({ card, onNavigate }: { card: NavCard; onNavigate: () => void }) {
  const Icon = isOffer(card.icon) ? OFFER_ICONS[card.icon] : LANE_ICONS[card.icon]
  return (
    <Link href={card.href} onClick={onNavigate} className="group/c grid w-[13.5rem] content-start gap-3 rounded-[1.1rem] p-1.5 pb-3 transition-colors duration-200 hover:bg-foreground/[0.05]">
      {/* The visual: the card's colour lighting a dot grid from above, with its icon set in the light. */}
      <span aria-hidden className="relative grid h-32 place-items-center overflow-hidden rounded-[0.8rem] border border-[rgb(var(--ink)/var(--edge-alpha))] bg-background">
        <span className="absolute inset-0 bg-[radial-gradient(rgb(var(--ink)/0.12)_1px,transparent_1.2px)] [background-size:12px_12px] [mask-image:radial-gradient(80%_80%_at_50%_30%,#000,transparent)]" />
        <span className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover/c:opacity-100" style={{ background: `radial-gradient(90% 75% at 50% -10%, color-mix(in oklch, ${card.glow} 42%, transparent), transparent 70%)` }} />
        <span className={cn("tile-depth relative size-12 rounded-[0.9rem]! transition-transform duration-300 ease-(--ease-lift) group-hover/c:-translate-y-0.5", card.tone)}>
          <Icon className="size-5" />
        </span>
      </span>
      <span className="grid gap-1 px-1.5">
        <span className="flex items-center gap-2 text-[14px] font-medium text-foreground">
          {card.title}
          {card.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px] leading-4">SOON</span>}
        </span>
        <span className="text-[12.5px] leading-snug text-muted-foreground">{card.body}</span>
        <span className="label-mono mt-0.5 text-[11px]">{card.meta}</span>
      </span>
    </Link>
  )
}

function Burger({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-2.5 w-4">
      <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-[top,transform] duration-300 ease-(--ease-lift)", open ? "top-1 rotate-45" : "top-0")} />
      <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-[top,transform] duration-300 ease-(--ease-lift)", open ? "top-1 -rotate-45" : "top-2")} />
    </span>
  )
}

/**
 * The site's navigation, after the Morphing Mega Menu shared as a reference: a pill in the middle of the
 * bar with each section's name. Hovering one grows the pill itself into a panel round that section's cards;
 * moving to another section springs the panel to the new size while the cards slide in from the side you
 * moved toward. One section at a time, as lit cards, instead of every link at once. On a phone the menu
 * button opens a full-height sheet of the same sections. The bar is clear at the top of the page and takes a
 * background once the page scrolls beneath it. Its height is --header-h.
 */
export function SiteNav({ sections, links }: { sections: NavSection[]; links: { href: string; label: string }[] }) {
  const root = useRef<HTMLElement>(null)
  const pill = useRef<HTMLDivElement>(null)
  const panes = useRef<(HTMLDivElement | null)[]>([])
  const [open, setOpen] = useState(-1)
  const [from, setFrom] = useState(-1)
  const [sizes, setSizes] = useState<{ w: number; h: number }[]>([])
  const [pillW, setPillW] = useState(0)
  const [sheet, setSheet] = useState(false)
  const [row, setRow] = useState(-1)
  const isScrolled = useSyncExternalStore(subscribe, scrolled, () => false)
  const hoverable = useRef(false)
  const leave = useRef(0)

  useEffect(() => {
    hoverable.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(-1); setSheet(false) } }
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) setOpen(-1) }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown) }
  }, [])

  // Every section's size, measured once laid out and again whenever it changes, so the panel can morph to it.
  useLayoutEffect(() => {
    const measure = () => {
      setSizes(panes.current.map((p) => ({ w: p?.offsetWidth ?? 0, h: p?.offsetHeight ?? 0 })))
      setPillW(pill.current?.offsetWidth ?? 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    panes.current.forEach((p) => p && ro.observe(p))
    if (pill.current) ro.observe(pill.current)
    return () => ro.disconnect()
  }, [sections.length])

  // The sheet covers the page, so the page underneath must not scroll.
  useEffect(() => {
    if (!sheet) return
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = overflow }
  }, [sheet])

  const show = (i: number) => { setFrom(open); setOpen(i) }
  const close = () => { setOpen(-1); setSheet(false) }
  // A short grace period, so a pointer crossing from the pill to the panel doesn't close it.
  const hover = (i: number) => { if (!hoverable.current) return; window.clearTimeout(leave.current); if (i !== open) show(i) }
  const unhover = () => { if (!hoverable.current) return; window.clearTimeout(leave.current); leave.current = window.setTimeout(() => setOpen(-1), 160) }
  const solid = isScrolled || open > -1 || sheet

  // The panel's shape: the pill's own when closed, the open section's when open.
  const size = open > -1 ? sizes[open] : undefined
  const panelW = size ? Math.max(pillW, size.w + PAD * 2) : pillW
  const panelH = size ? PILL_H + size.h + PAD * 2 : PILL_H

  return (
    <>
      <header
        ref={root}
        className={cn(
          "sticky top-0 z-40 h-(--header-h) border-b transition-[background-color,border-color,box-shadow] duration-300 ease-(--ease-soft)",
          solid ? "border-border/60 bg-background/85 shadow-[0_8px_24px_-16px_var(--float-shadow)] backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      >
        <div className="relative mx-auto flex h-full max-w-6xl items-center gap-6 px-6">
          <Link href="/" onClick={close} className="flex items-center gap-2">
            <BotlaneMark size={26} id="nav-mark" />
            <span className="font-semibold tracking-[-0.035em]">botlane</span>
          </Link>

          {/* The pill, and the panel it grows into. The panel sits behind the pill and starts at its exact size. */}
          <div className="relative mx-auto hidden lg:block" onMouseLeave={unhover}>
            <div
              aria-hidden={open < 0}
              className="absolute top-0 left-1/2 -translate-x-1/2 overflow-hidden border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.04))] bg-[color-mix(in_oklch,var(--popover)_94%,transparent)] backdrop-blur-xl"
              style={{
                width: panelW || undefined,
                height: panelH,
                borderRadius: open > -1 ? 22 : PILL_H / 2,
                opacity: open > -1 ? 1 : 0,
                boxShadow: open > -1 ? "0 30px 70px -30px var(--float-shadow), inset 0 1px 0 rgb(255 255 255 / var(--highlight-alpha))" : "none",
                transition: `width ${MORPH_MS}ms ${SPRING}, height ${MORPH_MS}ms ${SPRING}, border-radius ${MORPH_MS}ms ${SPRING}, opacity 200ms ease, box-shadow 300ms ease`,
              }}
            >
              <div className="absolute inset-x-0" style={{ top: PILL_H + PAD }}>
                {sections.map((s, i) => {
                  const on = open === i
                  // Cards arrive from the side the pointer came from, and leave towards the other.
                  const dx = on ? 0 : (from > -1 && open > -1 ? (i < open ? -1 : 1) : 0) * 28
                  return (
                    <div
                      key={s.label}
                      ref={(el) => { panes.current[i] = el }}
                      inert={!on}
                      className="absolute top-0 left-1/2 grid w-max gap-2"
                      style={{
                        transform: `translateX(calc(-50% + ${dx}px))`,
                        opacity: on ? 1 : 0,
                        transition: `transform ${MORPH_MS}ms ${SPRING}, opacity ${on ? 260 : 160}ms ease ${on ? 80 : 0}ms`,
                      }}
                    >
                      <div className="flex gap-1">
                        {s.cards.map((c) => <Card key={c.title} card={c} onNavigate={close} />)}
                      </div>
                      <Link href={s.href} onClick={close} className="group/a mx-1.5 flex items-center justify-between border-t border-border/60 px-1.5 pt-3 pb-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                        {s.all}
                        <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover/a:translate-x-0.5" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>

            <div ref={pill} className={cn("relative flex h-10 items-center gap-0.5 rounded-full p-1 transition-colors duration-300", open > -1 ? "bg-transparent" : "bg-foreground/[0.05]")}>
              <nav aria-label="Main" className="contents">
                {sections.map((s, i) => (
                  <button
                    key={s.label}
                    type="button"
                    aria-expanded={open === i}
                    onMouseEnter={() => hover(i)}
                    onClick={() => (open === i ? setOpen(-1) : show(i))}
                    className={cn(
                      "inline-flex h-8 items-center gap-1 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors duration-200",
                      open === i ? "bg-foreground/[0.08] text-foreground" : "text-foreground/70 hover:text-foreground",
                    )}
                  >
                    {s.label}
                    <ChevronDown aria-hidden className={cn("size-3.5 opacity-60 transition-transform duration-300 ease-(--ease-lift)", open === i && "rotate-180")} />
                  </button>
                ))}
                {links.map((l) => (
                  <Link key={l.href} href={l.href} onClick={close} onMouseEnter={unhover} className="inline-flex h-8 items-center rounded-full px-3.5 text-sm whitespace-nowrap text-foreground/70 transition-colors duration-200 hover:text-foreground">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <ThemeSwitch />
            <Link href="/contact" onClick={close} className="hidden h-9 items-center rounded-lg px-3 text-sm text-foreground/70 transition-colors hover:text-foreground xl:inline-flex">Contact</Link>
            <Link href="/contact" onClick={close} className="btn-light hidden h-9 items-center px-4 text-sm font-medium sm:inline-flex">Start a project</Link>
            <button
              type="button"
              aria-label={sheet ? "Close menu" : "Open menu"}
              aria-expanded={sheet}
              aria-controls="nav-sheet"
              onClick={() => setSheet(!sheet)}
              className="relative grid size-9 place-items-center rounded-lg transition-colors hover:bg-foreground/[0.07] lg:hidden"
            >
              <Burger open={sheet} />
            </button>
          </div>
        </div>
      </header>

      {/* Outside the header: its blur would otherwise make it the frame this fixed sheet is placed in. */}
      {sheet && (
        <div id="nav-sheet" className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto border-t border-border/60 bg-background px-6 pt-2 pb-8 [animation:nav-in_260ms_var(--ease-lift)_both] lg:hidden">
          {sections.map((s, i) => (
            <div key={s.label} className="border-b border-border/70">
              <button type="button" aria-expanded={row === i} onClick={() => setRow(row === i ? -1 : i)} className="flex w-full items-center justify-between py-4 text-left text-lg font-medium">
                {s.label}
                <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300 ease-(--ease-lift)", row === i && "rotate-180")} />
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-300 ease-(--ease-lift)", row === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div inert={row !== i} className="overflow-hidden">
                  <div className="grid gap-1 pb-4">
                    {s.cards.map((c) => {
                      const Icon = isOffer(c.icon) ? OFFER_ICONS[c.icon] : LANE_ICONS[c.icon]
                      return (
                        <Link key={c.title} href={c.href} onClick={close} className="flex items-center gap-3 rounded-xl px-1 py-2.5">
                          <span className={cn("tile-depth size-9 shrink-0 rounded-[0.6rem]!", c.tone)}><Icon className="size-4" /></span>
                          <span className="grid min-w-0">
                            <span className="flex items-center gap-2 font-medium">
                              {c.title}
                              {c.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px] leading-4">SOON</span>}
                            </span>
                            <span className="label-mono text-[11px]">{c.meta}</span>
                          </span>
                        </Link>
                      )
                    })}
                    <Link href={s.href} onClick={close} className="inline-flex items-center gap-1.5 px-1 py-2 text-sm text-muted-foreground">{s.all} <ArrowRight className="size-3.5" /></Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {[...links, { href: "/contact", label: "Contact" }].map((l) => (
            <Link key={l.label} href={l.href} onClick={close} className="flex items-center justify-between border-b border-border/70 py-4 text-lg font-medium">
              {l.label} <ArrowRight className="size-4 opacity-60" />
            </Link>
          ))}
          <Link href="/contact" onClick={close} className="btn-light mt-6 flex h-12 items-center justify-center gap-1.5 font-medium">
            Start a project <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </>
  )
}
