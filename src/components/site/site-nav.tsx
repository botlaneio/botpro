"use client"

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, ChevronDown, FileText, Workflow } from "lucide-react"

import { OFFER_ICONS } from "@/components/catalog/offer-icons"
import type { OfferIcon } from "@/lib/catalog"
import type { LaneId } from "@/lib/lanes"
import { cn } from "@/lib/utils"

import { ActivityBadge } from "./activity-badge"
import { BotlaneMark } from "./botlane-mark"
import { ThemeSwitch } from "./theme-switch"

/** One item in a section: a name, one line and a price or status, with the icon the phone menu shows. */
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

/** A group of items within a menu, with a link to the group's own page. */
export interface NavSection {
  label: string
  href: string
  all: string
  cards: NavCard[]
}

/** One menu in the bar: its sections, shown side by side in the panel when it opens. */
export interface NavMenu {
  label: string
  sections: NavSection[]
}

const LANE_ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = { syncc: CalendarDays, scriblane: FileText, flowlane: Workflow }
const isOffer = (k: NavCard["icon"]): k is OfferIcon => k in OFFER_ICONS

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}
const scrolled = () => window.scrollY > 4

// How long the panel waits before closing once the pointer leaves, so it can cross from a tab to the panel.
const GRACE_MS = 180

const AVAILABILITY = "Taking new projects"

/** One item in a column: its name and one line. */
function Item({ card, onNavigate }: { card: NavCard; onNavigate: () => void }) {
  return (
    <Link href={card.href} onClick={onNavigate} className="group/i grid content-start gap-0.5 rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-foreground/[0.06]">
      <span className="flex items-center gap-2 text-[14px] font-medium text-foreground">
        {card.title}
        {card.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px] leading-4">SOON</span>}
      </span>
      <span className="text-[12.5px] leading-snug text-muted-foreground transition-colors group-hover/i:text-foreground/75">{card.body}</span>
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

/** A menu's panel content at its natural size: its sections side by side, or a lone section's items in a row. */
function MenuBody({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  const lone = menu.sections.length === 1
  return (
    <div className="flex w-max [animation:pill-fade_220ms_var(--ease-soft)_both]">
      {menu.sections.map((s) => (
        <div key={s.label} className="grid content-start gap-1 border-l border-border/50 p-2.5 pt-3.5 first:border-l-0">
          <span className="px-3 pb-1 text-[12px] text-muted-foreground">{s.label}</span>
          <div className={cn("grid gap-0.5", lone ? "grid-cols-3 [&>*]:w-56" : "[&>*]:w-60")}>
            {s.cards.map((c) => <Item key={c.title} card={c} onNavigate={onNavigate} />)}
          </div>
          <Link href={s.href} onClick={onNavigate} className="group/a mt-0.5 inline-flex w-fit items-center gap-1.5 px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            {s.all}
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover/a:translate-x-0.5" />
          </Link>
        </div>
      ))}
    </div>
  )
}

/** Whether someone is taking on work, as a green pulse and a few words. */
function Availability({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[12.5px] whitespace-nowrap text-muted-foreground", className)}>
      <ActivityBadge />
      {AVAILABILITY}
    </span>
  )
}

/**
 * The site's navigation, after Framer's Pill Dropdown Nav. On wide screens the tabs sit in a floating glass
 * pill in the middle of the bar; a soft highlight glides under whichever tab the pointer or focus is on, and
 * Solutions and Products open one rounded panel beneath the pill that resizes as it moves between them.
 * Insights is a plain link. On the right: a pulse saying we're taking on projects, the theme switch, and the
 * call to start one. On phones and tablets the same glass is a round button that opens the menus in a panel
 * floating under the bar. The bar itself has no surface; once the page scrolls beneath it, a soft fade keeps
 * the logo legible. Its height is --header-h.
 */
export function SiteNav({ menus, links }: { menus: NavMenu[]; links: { href: string; label: string }[] }) {
  const root = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLElement | null)[]>([])
  const body = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(-1)
  // The menu the panel shows: the open one, or the last one while the panel fades out.
  const [shown, setShown] = useState(0)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  // The tab the highlight sits under, and where that is in the pill.
  const [lit, setLit] = useState(-1)
  const [spot, setSpot] = useState<{ x: number; w: number } | null>(null)
  const [sheet, setSheet] = useState(false)
  const [row, setRow] = useState(-1)
  const isScrolled = useSyncExternalStore(subscribe, scrolled, () => false)
  const hoverable = useRef(false)
  const leave = useRef(0)

  useEffect(() => {
    hoverable.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(-1); setSheet(false); setLit(-1) } }
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) { setOpen(-1); setSheet(false); setLit(-1) } }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown) }
  }, [])

  // The panel takes the size of the menu it shows, so it grows and shrinks between menus rather than jumping.
  useLayoutEffect(() => {
    const el = body.current
    if (!el) return
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [shown])

  // The highlight follows the lit tab; where that tab sits is read from the page after it lays out.
  useLayoutEffect(() => {
    const el = lit > -1 ? tabs.current[lit] : null
    if (el) setSpot({ x: el.offsetLeft, w: el.offsetWidth })
  }, [lit])

  // The phone menu covers the page, so the page underneath must not scroll. The lock goes on the root, not the
  // body: the body clips sideways overflow (decorative glows wider than a phone), and overflow:hidden there
  // would replace that clip, letting a phone widen the page and slide the view sideways under the menu.
  useEffect(() => {
    if (!sheet) return
    const doc = document.documentElement
    const { overflow } = doc.style
    doc.style.overflow = "hidden"
    return () => { doc.style.overflow = overflow }
  }, [sheet])

  const show = (i: number) => { setOpen(i); if (i > -1) { setShown(i); setLit(i) } }
  const close = () => { setOpen(-1); setSheet(false); setLit(-1) }
  const hover = (i: number) => { if (!hoverable.current) return; window.clearTimeout(leave.current); show(i) }
  const stay = () => window.clearTimeout(leave.current)
  const unhover = () => {
    if (!hoverable.current) return
    window.clearTimeout(leave.current)
    leave.current = window.setTimeout(() => { setOpen(-1); setLit(-1) }, GRACE_MS)
  }
  // Leaving the pill without a menu open lets the highlight go; with one open it settles back under its tab.
  const leavePill = () => { if (open > -1) { setLit(open); unhover() } else setLit(-1) }

  const tab = "relative z-10 inline-flex h-[2.3rem] items-center gap-1 rounded-full px-4 text-[13.5px] whitespace-nowrap transition-colors duration-200"

  return (
    <header
      ref={root}
      style={{ viewTransitionName: "site-header" }}
      className="sticky top-0 z-40 h-(--header-h)"
    >
      {/* Once the page scrolls under the bar, a fade behind it keeps the logo and buttons legible. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--header-h)+1.25rem)] bg-linear-to-b from-background from-55% via-background/80 to-transparent transition-opacity duration-300 ease-(--ease-soft)",
          isScrolled || sheet ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative mx-auto flex h-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" onClick={close} onMouseEnter={unhover} className="flex items-center gap-2 lg:flex-1">
          <BotlaneMark size={26} id="nav-mark" />
          <span className="font-semibold tracking-[-0.035em]">botlane</span>
        </Link>

        {/* The pill: the tabs, then the panel they share, then the plain links. That's also the order Tab follows. */}
        <div className="relative hidden lg:block" onMouseLeave={unhover}>
          <nav aria-label="Main" onMouseLeave={leavePill} className="surface-pill relative flex items-center gap-0.5 rounded-full p-1">
            <span
              aria-hidden
              className={cn(
                "absolute top-1 left-0 h-[2.3rem] rounded-full bg-foreground/[0.08] transition-[translate,width,opacity] duration-500 ease-(--ease-lift)",
                lit > -1 && spot ? "opacity-100" : "opacity-0",
              )}
              style={spot ? { width: spot.w, translate: `${spot.x}px 0` } : undefined}
            />
            {menus.map((m, i) => (
              <button
                key={m.label}
                ref={(el) => { tabs.current[i] = el }}
                type="button"
                aria-expanded={open === i}
                aria-controls="nav-panel"
                onMouseEnter={() => hover(i)}
                onFocus={() => setLit(i)}
                onClick={() => show(open === i ? -1 : i)}
                className={cn(tab, lit === i ? "text-foreground" : "text-foreground/65 hover:text-foreground")}
              >
                {m.label}
                <ChevronDown aria-hidden className={cn("size-3.5 opacity-55 transition-transform duration-300 ease-(--ease-lift)", open === i && "rotate-180")} />
              </button>
            ))}
            {links.map((l, j) => {
              const i = menus.length + j
              return (
                <Link
                  key={l.href}
                  ref={(el) => { tabs.current[i] = el }}
                  href={l.href}
                  onClick={close}
                  onMouseEnter={() => { unhover(); if (hoverable.current) setLit(i) }}
                  onFocus={() => setLit(i)}
                  className={cn(tab, lit === i ? "text-foreground" : "text-foreground/65 hover:text-foreground")}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>

          {/* The panel hangs under the pill, centred on it. Its padding on top bridges the gap, so the pointer
              never leaves it on the way down. It sizes itself to the menu inside and eases between sizes. */}
          <div
            id="nav-panel"
            inert={open < 0}
            onMouseEnter={stay}
            onMouseLeave={unhover}
            className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 pt-2.5 transition-[opacity,scale,translate] duration-300 ease-(--ease-lift) origin-top",
              open > -1 ? "scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.97] opacity-0",
            )}
          >
            <div
              className="surface-pill-panel overflow-hidden rounded-[1.4rem] transition-[width,height] duration-500 ease-(--ease-lift)"
              style={size ? { width: size.w, height: size.h } : undefined}
            >
              <div ref={body} className="w-max">
                {menus[shown] && <MenuBody key={shown} menu={menus[shown]} onNavigate={close} />}
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center justify-end gap-2 lg:ml-0 lg:flex-1" onMouseEnter={unhover}>
          <Availability className="mr-2 hidden xl:inline-flex" />
          <ThemeSwitch />
          <Link href="/contact" onClick={close} className="btn-light hidden h-9 items-center px-4 text-sm font-medium sm:inline-flex">Start a project</Link>
          <button
            type="button"
            aria-label={sheet ? "Close menu" : "Open menu"}
            aria-expanded={sheet}
            aria-controls="nav-sheet"
            onClick={() => setSheet(!sheet)}
            className="surface-pill relative grid size-11 shrink-0 place-items-center rounded-full transition-[scale] duration-200 ease-(--ease-lift) active:scale-95 lg:hidden"
          >
            <Burger open={sheet} />
          </button>
        </div>
      </div>

      {/* Phones and tablets: the menus in a glass panel floating under the bar, over a dimmed page. */}
      {sheet && (
        <>
          <div aria-hidden onClick={close} className="fixed inset-0 top-(--header-h) z-30 bg-background/40 backdrop-blur-[2px] [animation:pill-fade_200ms_var(--ease-soft)_both] lg:hidden" />
          <div
            id="nav-sheet"
            className="surface-pill-sheet fixed inset-x-3 top-[calc(var(--header-h)-0.25rem)] z-40 max-h-[calc(100dvh-var(--header-h)-0.75rem)] origin-top-right overflow-y-auto overscroll-contain rounded-[1.6rem] px-5 pt-2 pb-5 [animation:pill-pop_320ms_var(--ease-lift)_both] sm:left-auto sm:w-[26rem] sm:right-6 lg:hidden"
          >
            {menus.map((m, i) => (
              <div key={m.label} className="border-b border-border/60">
                <button type="button" aria-expanded={row === i} onClick={() => setRow(row === i ? -1 : i)} className="flex w-full items-center justify-between py-3.5 text-left text-[17px] font-medium">
                  {m.label}
                  <ChevronDown aria-hidden className={cn("size-4 opacity-60 transition-transform duration-300 ease-(--ease-lift)", row === i && "rotate-180")} />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300 ease-(--ease-lift)", row === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div inert={row !== i} className="overflow-hidden">
                    <div className="grid gap-4 pb-4">
                      {m.sections.map((s) => (
                        <div key={s.label} className="grid gap-0.5">
                          {m.sections.length > 1 && <span className="label-mono px-1 pb-1 text-[11px]">{s.label.toUpperCase()}</span>}
                          {s.cards.map((c) => {
                            const Icon = isOffer(c.icon) ? OFFER_ICONS[c.icon] : LANE_ICONS[c.icon]
                            return (
                              <Link key={c.title} href={c.href} onClick={close} className="flex items-center gap-3 rounded-xl px-1 py-2">
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {links.map((l) => (
              <Link key={l.label} href={l.href} onClick={close} className="flex items-center justify-between border-b border-border/60 py-3.5 text-[17px] font-medium">
                {l.label} <ArrowRight className="size-4 opacity-60" />
              </Link>
            ))}
            <Availability className="mt-5 px-1" />
            <Link href="/contact" onClick={close} className="btn-light mt-3 flex h-12 items-center justify-center gap-1.5 font-medium">
              Start a project <ArrowRight className="size-4" />
            </Link>
          </div>
        </>
      )}
    </header>
  )
}
