"use client"

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { AppWindow, ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, FileText, PanelsTopLeft, Sparkles, Workflow, X } from "lucide-react"

import { OFFER_ICONS } from "@/components/catalog/offer-icons"
import type { OfferIcon } from "@/lib/catalog"
import type { LaneId } from "@/lib/lanes"
import { cn } from "@/lib/utils"

import { ActivityBadge } from "./activity-badge"
import { BotlaneMark } from "./botlane-mark"
import { ProductArt } from "./nav-art"
import { ThemeSwitch } from "./theme-switch"

/** A colour from the palette, for an icon tile (materials.css sets it from data-hue). */
export type Hue = "blue" | "ember" | "teal" | "violet" | "orchid"

/** One item in a section: a name, one line, and a price or status. */
export interface NavCard {
  href: string
  title: string
  body: string
  meta: string
  icon: OfferIcon | LaneId
  hue: Hue
  soon?: boolean
}

/** A group within a menu: a category of Solutions, or the products. */
export interface NavSection {
  id: string
  label: string
  /** One line under its name in the category list. */
  line: string
  hue: Hue
  href: string
  all: string
  /** The lit card beside its offers: a nudge towards the next step. */
  feature?: { kicker: string; title: string; cta: string; href: string }
  cards: NavCard[]
}

/** One menu in the bar. Several sections become a list to choose from; one becomes a row of cards. */
export interface NavMenu {
  label: string
  /** One line under its name on phones. */
  line: string
  sections: NavSection[]
  /** A link at the foot of the category list. */
  after?: { label: string; href: string; meta: string }
}

const LANE_ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = { syncc: CalendarDays, scriblane: FileText, flowlane: Workflow }
const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = { websites: PanelsTopLeft, "web-apps": AppWindow, "custom-solutions": Sparkles }
const isOffer = (k: NavCard["icon"]): k is OfferIcon => k in OFFER_ICONS

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}
const scrolled = () => window.scrollY > 4

// How long the panel waits before closing once the pointer leaves, so it can cross from a tab to the panel.
const GRACE_MS = 180
// How far a phone's drawer must be dragged to the right before letting go closes it.
const SWIPE_CLOSE = 80

const AVAILABILITY = "Taking new projects"

// A few pages that aren't in either menu, as small links at the foot of the phone's drawer.
const EXTRAS = [{ href: "/care", label: "Care" }, { href: "/solutions#process", label: "How we work" }, { href: "/contact", label: "Contact" }]

function CardIcon({ icon, className }: { icon: NavCard["icon"]; className?: string }) {
  const Icon = isOffer(icon) ? OFFER_ICONS[icon] : LANE_ICONS[icon]
  return <Icon aria-hidden className={className} />
}

function Burger({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative block h-2.5 w-4">
      <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-[top,transform] duration-300 ease-(--ease-lift)", open ? "top-1 rotate-45" : "top-0")} />
      <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-[top,transform] duration-300 ease-(--ease-lift)", open ? "top-1 -rotate-45" : "top-2")} />
    </span>
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

/** The drawing on a category's feature card: three windows, three stages, or a spark in orbit. */
function FeatureArt({ id }: { id: string }) {
  if (id === "websites") {
    return (
      <span aria-hidden className="absolute inset-x-6 top-6 grid gap-2 transition-transform duration-700 ease-(--ease-lift) group-hover/f:-translate-y-1">
        <span className="h-12 rounded-lg border border-white/15 bg-white/[0.05]" />
        <span className="mx-2.5 h-12 rounded-lg border border-[#8FB4F2]/55 bg-[#2C57A5]/35 shadow-[0_0_24px_rgb(143_180_242/0.35)]" />
        <span className="mx-5 h-12 rounded-lg border border-white/12 bg-white/[0.03]" />
      </span>
    )
  }
  if (id === "web-apps") {
    return (
      <span aria-hidden className="absolute inset-x-6 top-10 flex items-center justify-between">
        <span className="absolute inset-x-3 top-1/2 h-px bg-[linear-gradient(90deg,#8FB4F2,rgb(255_255_255/0.2))]" />
        {["Plan", "Prove", "Build"].map((s, i) => (
          <span key={s} className="relative grid justify-items-center gap-2">
            <span className={cn("size-7 rounded-full border-2 border-[#0b1424]", i === 0 ? "bg-[#8FB4F2] shadow-[0_0_18px_#8FB4F2]" : "bg-white/25")} />
            <span className="label-mono text-[9.5px] text-white/60">{s.toUpperCase()}</span>
          </span>
        ))}
      </span>
    )
  }
  return (
    <span aria-hidden className="absolute top-5 left-1/2 grid size-28 -translate-x-1/2 place-items-center">
      <span className="absolute inset-0 rounded-full border border-white/12" />
      <span className="absolute inset-4 rounded-full border border-dashed border-white/15" />
      <span className="nav-orbit absolute inset-0"><span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-[#8FB4F2] shadow-[0_0_10px_#8FB4F2]" /></span>
      <Sparkles className="size-7 text-white" />
    </span>
  )
}

/** The lit card beside a category's offers. Dark in either theme, so the blue light reads. */
function Feature({ s, onNavigate }: { s: NavSection; onNavigate: () => void }) {
  if (!s.feature) return null
  return (
    <Link
      href={s.feature.href}
      onClick={onNavigate}
      className="group/f dark relative isolate flex w-56 shrink-0 flex-col justify-end gap-1.5 overflow-hidden rounded-[1.1rem] border border-[#8FB4F2]/25 bg-[#0b1424] p-4 text-white shadow-[0_30px_60px_-30px_rgb(58_100_184/0.9)] [animation:pill-fade_380ms_var(--ease-soft)_both]"
    >
      <span aria-hidden className="absolute -top-[30%] -left-[20%] -z-10 h-[90%] w-[140%] rounded-full bg-[radial-gradient(closest-side,rgb(58_100_184/0.65),transparent)] blur-xl transition-transform duration-700 ease-(--ease-lift) group-hover/f:translate-x-[8%] group-hover/f:scale-110" />
      <FeatureArt id={s.id} />
      <span className="label-mono relative pt-36 text-[10px] text-[#a9c4f5]">{s.feature.kicker}</span>
      <span className="relative text-[15.5px] leading-snug font-medium text-balance">{s.feature.title}</span>
      <span className="relative inline-flex items-center gap-1.5 text-[12.5px] text-[#c9d5ea]">
        {s.feature.cta}
        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/f:translate-x-1" />
      </span>
    </Link>
  )
}

/** One offer in the panel: its tile in its colour, its name and line, its price, and an arrow on hover. */
function Offer({ card, i, onNavigate }: { card: NavCard; i: number; onNavigate: () => void }) {
  return (
    <Link
      href={card.href}
      onClick={onNavigate}
      data-hue={card.hue}
      style={{ "--i": i } as React.CSSProperties}
      className="nav-item nav-in group/i flex items-center gap-3.5 rounded-[0.9rem] p-2.5 pr-3 transition-colors duration-200 hover:bg-foreground/[0.05] focus-visible:bg-foreground/[0.05] focus-visible:outline-none"
    >
      <span className="hue-tile size-10 rounded-[0.7rem]"><CardIcon icon={card.icon} className="size-[18px]" /></span>
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="flex items-center gap-2 text-[14.5px] font-medium text-foreground">
          {card.title}
          {card.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px] leading-4">SOON</span>}
        </span>
        <span className="truncate text-[12.5px] text-muted-foreground transition-colors group-hover/i:text-foreground/75">{card.body}</span>
      </span>
      <span className="label-mono rounded-full border border-border px-2.5 py-1 text-[10.5px] whitespace-nowrap text-foreground/80 transition-colors group-hover/i:border-foreground/20 group-hover/i:text-foreground">{card.meta}</span>
      <ArrowRight aria-hidden className="size-4 -translate-x-1 text-foreground/70 opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-lift) group-hover/i:translate-x-0 group-hover/i:opacity-100" />
    </Link>
  )
}

/**
 * The Solutions panel: the categories as a list on the left, a highlight gliding to the one chosen, its offers
 * in the middle arriving one after another, and its lit card on the right. Hovering a category chooses it, as
 * do focus and click. Care sits at the foot of the list.
 */
function Spotlight({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  const [pick, setPick] = useState(0)
  const rows = useRef<(HTMLButtonElement | null)[]>([])
  const [bar, setBar] = useState<{ y: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const el = rows.current[pick]
    if (el) setBar({ y: el.offsetTop, h: el.offsetHeight })
  }, [pick])
  const s = menu.sections[pick]

  return (
    <div className="flex w-[55rem] [animation:pill-fade_220ms_var(--ease-soft)_both]">
      <div className="flex w-64 shrink-0 flex-col border-r border-border/60 bg-foreground/[0.015] p-3">
        <span className="label-mono px-3 pt-1.5 pb-2.5 text-[10.5px]">{menu.label.toUpperCase()}</span>
        <div role="tablist" aria-label={menu.label} aria-orientation="vertical" className="relative grid gap-1">
          <span aria-hidden className="absolute inset-x-0 top-0 rounded-[0.9rem] bg-foreground/[0.07] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha))] transition-[translate,height] duration-500 ease-(--ease-lift)" style={bar ? { height: bar.h, translate: `0 ${bar.y}px` } : { opacity: 0 }} />
          {menu.sections.map((sec, i) => {
            const Icon = SECTION_ICONS[sec.id] ?? Sparkles
            const on = i === pick
            return (
              <button
                key={sec.id}
                ref={(el) => { rows.current[i] = el }}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="nav-spot"
                data-hue={sec.hue}
                onMouseEnter={() => setPick(i)}
                onFocus={() => setPick(i)}
                onClick={() => setPick(i)}
                className={cn("relative flex items-center gap-3 rounded-[0.9rem] p-2.5 text-left outline-none", on && "hue-lit")}
              >
                <span className={cn("hue-tile size-9 rounded-[0.65rem] transition-[filter] duration-300", !on && "saturate-[0.35]")}><Icon className="size-[17px]" /></span>
                <span className="grid gap-0.5">
                  <span className={cn("text-[14px] font-medium transition-colors", on ? "text-foreground" : "text-foreground/75")}>{sec.label}</span>
                  <span className="text-[12px] leading-snug text-muted-foreground">{sec.line}</span>
                </span>
                <ChevronRight aria-hidden className={cn("ml-auto size-4 transition-[opacity,translate] duration-300 ease-(--ease-lift)", on ? "translate-x-0 opacity-60" : "-translate-x-1 opacity-0")} />
              </button>
            )
          })}
        </div>
        {menu.after && (
          <Link href={menu.after.href} onClick={onNavigate} className="group/c mt-auto grid gap-1 rounded-[0.9rem] border-t border-border/60 px-3 pt-4 pb-1.5">
            <span className="label-mono text-[10px]">AFTER LAUNCH</span>
            <span className="flex items-center justify-between text-[13.5px]">
              <span className="font-medium">{menu.after.label}</span>
              <span className="text-muted-foreground transition-colors group-hover/c:text-foreground">{menu.after.meta}</span>
            </span>
          </Link>
        )}
      </div>

      <div id="nav-spot" role="tabpanel" className="flex flex-1 gap-4 p-4 pl-5">
        <div key={s.id} className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="nav-in px-2.5 pt-1 pb-2.5 text-[13px] text-muted-foreground">{s.line}</span>
          {s.cards.map((c, i) => <Offer key={c.title} card={c} i={i + 1} onNavigate={onNavigate} />)}
          <Link href={s.href} onClick={onNavigate} style={{ "--i": s.cards.length + 1 } as React.CSSProperties} className="nav-in group/a mt-auto inline-flex w-fit items-center gap-1.5 px-2.5 pt-3 pb-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            {s.all}
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover/a:translate-x-0.5" />
          </Link>
        </div>
        <Feature key={`f-${s.id}`} s={s} onNavigate={onNavigate} />
      </div>
    </div>
  )
}

/** The Products panel: one card per product, each with its drawing in its own colour. */
function ProductCards({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  const s = menu.sections[0]
  return (
    <div className="grid w-[55rem] gap-4 p-4 [animation:pill-fade_220ms_var(--ease-soft)_both]">
      <span className="flex items-baseline justify-between px-1.5 pt-1">
        <span className="text-[13px] text-muted-foreground">{s.line}</span>
        <Link href={s.href} onClick={onNavigate} className="group/a inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
          {s.all} <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover/a:translate-x-0.5" />
        </Link>
      </span>
      <div className="grid grid-cols-3 gap-3">
        {s.cards.map((c, i) => (
          <Link
            key={c.title}
            href={c.href}
            onClick={onNavigate}
            data-hue={c.hue}
            style={{ "--i": i } as React.CSSProperties}
            className="nav-in group/p flex flex-col overflow-hidden rounded-[1.1rem] border border-border/80 bg-foreground/[0.02] transition-[translate,border-color,box-shadow] duration-500 ease-(--ease-lift) hover:-translate-y-1 hover:border-[color-mix(in_oklch,var(--h-solid)_40%,transparent)] hover:shadow-[0_24px_40px_-24px_color-mix(in_oklch,var(--h-solid)_70%,transparent)]"
          >
            <span aria-hidden className="relative grid h-36 place-items-center overflow-hidden border-b border-border/60 bg-[radial-gradient(80%_100%_at_50%_0%,color-mix(in_oklch,var(--h-solid)_24%,transparent),transparent_70%)] transition-[filter] duration-500 group-hover/p:brightness-110">
              <ProductArt id={c.icon as LaneId} />
            </span>
            <span className="grid gap-1.5 p-4">
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2.5">
                  <span className="hue-tile size-7 rounded-lg"><CardIcon icon={c.icon} className="size-3.5" /></span>
                  <span className="text-[15.5px] font-medium">{c.title}</span>
                </span>
                {c.soon ? (
                  <span className="label-mono rounded-full border border-border px-2 py-0.5 text-[9.5px]">SOON</span>
                ) : (
                  <span className="label-mono inline-flex items-center gap-1.5 text-[9.5px] text-foreground/80"><span className="size-1.5 rounded-full bg-[#31EE33] shadow-[0_0_8px_#31EE33]" />LIVE</span>
                )}
              </span>
              <span className="text-[13px] text-muted-foreground">{c.body}</span>
              <span className="label-mono text-[10.5px]">{c.soon ? "OPENING SOON" : c.meta}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/**
 * The site's navigation. On wide screens the tabs sit in a floating glass pill in the middle of the bar; a soft
 * highlight glides under whichever tab the pointer or focus is on. Solutions opens a spotlight: categories on
 * the left, the chosen one's offers and a lit card beside them. Products opens a row of product cards. The
 * panel grows out of the pill and eases between their sizes. On phones and tablets a round button slides a
 * drawer in from the right, over two thirds of the screen: Solutions and Products drill in to their offers,
 * with a way back, and the drawer can be swiped away. The bar itself has no surface; once the page scrolls
 * beneath it, a soft fade keeps the logo legible. Its height is --header-h.
 */
export function SiteNav({ menus, links }: { menus: NavMenu[]; links: { href: string; label: string }[] }) {
  const root = useRef<HTMLElement>(null)
  const tabs = useRef<(HTMLElement | null)[]>([])
  const body = useRef<HTMLDivElement>(null)
  const burger = useRef<HTMLButtonElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(-1)
  // The menu the panel shows: the open one, or the last one while the panel fades out.
  const [shown, setShown] = useState(0)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  // The tab the highlight sits under, and where that is in the pill.
  const [lit, setLit] = useState(-1)
  const [spot, setSpot] = useState<{ x: number; w: number } | null>(null)
  // The phone's drawer: whether it's out, which menu it has drilled into (and the last one, while sliding back),
  // how many times it has opened (so its rows arrive again each time), and how far it's being dragged.
  const [sheet, setSheet] = useState(false)
  const [sub, setSub] = useState(-1)
  const [subShown, setSubShown] = useState(0)
  const [opens, setOpens] = useState(0)
  const [drag, setDrag] = useState(0)
  const touch = useRef<{ x: number; y: number; on: boolean } | null>(null)
  const isScrolled = useSyncExternalStore(subscribe, scrolled, () => false)
  const hoverable = useRef(false)
  const leave = useRef(0)

  useEffect(() => {
    hoverable.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(-1); setSheet(false); setLit(-1) } }
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) { setOpen(-1); setLit(-1) } }
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

  // While the drawer is out the page underneath must not scroll. The lock goes on the root, not the body: the
  // body clips sideways overflow (decorative glows wider than a phone), and overflow:hidden there would replace
  // that clip. Focus moves into the drawer as it opens and back to the menu button as it closes.
  useEffect(() => {
    if (!sheet) return
    const doc = document.documentElement
    const { overflow } = doc.style
    doc.style.overflow = "hidden"
    const t = window.setTimeout(() => closer.current?.focus({ preventScroll: true }), 60)
    const button = burger.current
    return () => { doc.style.overflow = overflow; window.clearTimeout(t); button?.focus({ preventScroll: true }) }
  }, [sheet])

  const show = (i: number) => { setOpen(i); if (i > -1) { setShown(i); setLit(i) } }
  const close = () => { setOpen(-1); setSheet(false); setLit(-1); setDrag(0) }
  const openSheet = () => { setSub(-1); setOpens((n) => n + 1); setSheet(true) }
  const drill = (i: number) => { setSubShown(i); setSub(i) }
  const hover = (i: number) => { if (!hoverable.current) return; window.clearTimeout(leave.current); show(i) }
  const stay = () => window.clearTimeout(leave.current)
  const unhover = () => {
    if (!hoverable.current) return
    window.clearTimeout(leave.current)
    leave.current = window.setTimeout(() => { setOpen(-1); setLit(-1) }, GRACE_MS)
  }
  // Leaving the pill without a menu open lets the highlight go; with one open it settles back under its tab.
  const leavePill = () => { if (open > -1) { setLit(open); unhover() } else setLit(-1) }

  // Dragging the drawer to the right follows the finger, once the drag is clearly sideways; let go far enough
  // and it closes, otherwise it springs back.
  const onTouchStart = (e: React.PointerEvent) => { if (e.pointerType !== "mouse") touch.current = { x: e.clientX, y: e.clientY, on: false } }
  const onTouchMove = (e: React.PointerEvent) => {
    const t = touch.current
    if (!t) return
    const dx = e.clientX - t.x, dy = e.clientY - t.y
    if (!t.on && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) t.on = true
    if (t.on) setDrag(Math.max(0, dx))
  }
  const onTouchEnd = () => {
    if (touch.current?.on && drag > SWIPE_CLOSE) close()
    else setDrag(0)
    touch.current = null
  }

  const tab = "relative z-10 inline-flex h-[2.3rem] items-center gap-1 rounded-full px-4 text-[13.5px] whitespace-nowrap transition-colors duration-200"
  const subMenu = menus[subShown]

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
          isScrolled ? "opacity-100" : "opacity-0",
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
              className="surface-pill-panel overflow-hidden rounded-[1.5rem] transition-[width,height] duration-500 ease-(--ease-lift)"
              style={size ? { width: size.w, height: size.h } : undefined}
            >
              <div ref={body} className="w-max">
                {menus[shown] && (menus[shown].sections.length > 1
                  ? <Spotlight key={shown} menu={menus[shown]} onNavigate={close} />
                  : <ProductCards key={shown} menu={menus[shown]} onNavigate={close} />)}
              </div>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center justify-end gap-2 lg:ml-0 lg:flex-1" onMouseEnter={unhover}>
          <Availability className="mr-2 hidden xl:inline-flex" />
          <ThemeSwitch />
          <Link href="/contact" onClick={close} className="btn-light hidden h-9 items-center px-4 text-sm font-medium sm:inline-flex">Start a project</Link>
          <button
            ref={burger}
            type="button"
            aria-label="Open menu"
            aria-expanded={sheet}
            aria-controls="nav-sheet"
            onClick={openSheet}
            className="surface-pill relative grid size-11 shrink-0 place-items-center rounded-full transition-[scale] duration-200 ease-(--ease-lift) active:scale-95 lg:hidden"
          >
            <Burger open={sheet} />
          </button>
        </div>
      </div>

      {/* Phones and tablets: a drawer from the right, over a dimmed page. Always in the page, so it can slide
          both ways; inert while it's away. */}
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-[rgb(4_5_8/0.45)] backdrop-blur-[3px] transition-opacity duration-500 ease-(--ease-soft) lg:hidden",
          sheet ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={sheet && drag ? { opacity: Math.max(0.2, 1 - drag / 320) } : undefined}
      />
      <aside
        id="nav-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!sheet}
        onPointerDown={onTouchStart}
        onPointerMove={onTouchMove}
        onPointerUp={onTouchEnd}
        onPointerCancel={onTouchEnd}
        className={cn(
          "surface-pill-sheet fixed top-0 right-0 bottom-0 z-50 flex w-[min(78vw,24rem)] touch-pan-y flex-col overflow-hidden rounded-l-[1.75rem] border-r-0 lg:hidden",
          drag ? "transition-none" : "transition-[translate,box-shadow] duration-500 ease-(--ease-lift)",
          sheet ? "translate-x-0 shadow-[-30px_0_80px_-20px_rgb(0_0_0/0.55)]" : "translate-x-[105%] shadow-none",
        )}
        style={sheet && drag ? { translate: `${drag}px 0` } : undefined}
      >
        {/* The blue light, from the top of the drawer. */}
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-20 h-80 w-[130%] rounded-full bg-[radial-gradient(closest-side,rgb(58_100_184/0.35),transparent)] blur-2xl" />

        <div className="relative flex h-16 shrink-0 items-center justify-between px-4">
          <button
            type="button"
            onClick={() => setSub(-1)}
            tabIndex={sub > -1 ? 0 : -1}
            aria-hidden={sub < 0}
            className={cn("inline-flex h-11 items-center gap-1 pr-3 text-[15px] text-foreground/80 transition-[opacity,translate] duration-400 ease-(--ease-lift)", sub > -1 ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-2 opacity-0")}
          >
            <ChevronLeft className="size-[18px]" /> Menu
          </button>
          <span className={cn("label-mono absolute left-5 text-[10.5px] transition-opacity duration-300", sub > -1 ? "opacity-0" : "opacity-100")}>MENU</span>
          <button ref={closer} type="button" aria-label="Close menu" onClick={close} className="surface-pill grid size-11 place-items-center rounded-full transition-[scale] duration-200 active:scale-95">
            <X className="size-4" />
          </button>
        </div>

        {/* Two panes side by side: the menu, and the menu drilled into. The track slides between them. */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div className={cn("flex h-full w-[200%] transition-[translate] duration-500 ease-(--ease-lift)", sub > -1 ? "-translate-x-1/2" : "translate-x-0")}>
            <nav aria-label="Menu" inert={sub > -1} key={opens} className="flex h-full w-1/2 flex-col overflow-y-auto overscroll-contain px-5 pt-3 pb-4">
              {menus.map((m, i) => (
                <button key={m.label} type="button" onClick={() => drill(i)} style={{ "--i": i } as React.CSSProperties} className="nav-in-x group/m flex items-center justify-between gap-3 border-b border-border/60 py-4 text-left">
                  <span className="grid gap-1">
                    <span className="text-[1.75rem] leading-none font-medium tracking-[-0.035em]">{m.label}</span>
                    <span className="text-[12.5px] text-muted-foreground">{m.line}</span>
                  </span>
                  <ChevronRight aria-hidden className="size-5 text-muted-foreground transition-transform duration-300 group-active/m:translate-x-1" />
                </button>
              ))}
              {links.map((l, j) => (
                <Link key={l.href} href={l.href} onClick={close} style={{ "--i": menus.length + j } as React.CSSProperties} className="nav-in-x flex items-center justify-between gap-3 border-b border-border/60 py-4">
                  <span className="text-[1.75rem] leading-none font-medium tracking-[-0.035em]">{l.label}</span>
                  <ArrowUpRight aria-hidden className="size-5 text-muted-foreground" />
                </Link>
              ))}
              <div style={{ "--i": menus.length + links.length } as React.CSSProperties} className="nav-in-x flex flex-wrap gap-2 pt-5">
                {EXTRAS.map((x) => (
                  <Link key={x.href} href={x.href} onClick={close} className="rounded-full border border-border px-3.5 py-2 text-[13px] text-foreground/80 transition-colors active:bg-foreground/[0.06]">{x.label}</Link>
                ))}
              </div>
            </nav>

            <div inert={sub < 0} className="flex h-full w-1/2 flex-col overflow-y-auto overscroll-contain px-4 pt-1 pb-4">
              {subMenu && (
                <div key={`${subShown}-${sub}`} className="grid gap-5">
                  <span className="nav-in-x px-1 text-[1.75rem] leading-none font-medium tracking-[-0.035em]">{subMenu.label}</span>
                  {subMenu.sections.map((sec, si) => (
                    <div key={sec.id} className="grid gap-0.5">
                      <span style={{ "--i": si * 4 + 1 } as React.CSSProperties} className="nav-in-x label-mono px-1 pb-1.5 text-[10.5px]">{sec.label.toUpperCase()}</span>
                      {sec.cards.map((c, ci) => (
                        <Link
                          key={c.title}
                          href={c.href}
                          onClick={close}
                          data-hue={c.hue}
                          style={{ "--i": si * 4 + ci + 2 } as React.CSSProperties}
                          className="nav-in-x nav-item flex items-center gap-3 rounded-[0.9rem] p-1.5 transition-colors active:bg-foreground/[0.06]"
                        >
                          <span className="hue-tile size-10 rounded-[0.7rem]"><CardIcon icon={c.icon} className="size-[18px]" /></span>
                          <span className="grid min-w-0 flex-1">
                            <span className="flex items-center gap-2 text-[15px] font-medium">
                              {c.title}
                              {c.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px] leading-4">SOON</span>}
                            </span>
                            <span className="truncate text-[12.5px] text-muted-foreground">{c.body}</span>
                          </span>
                          <span className="label-mono shrink-0 text-[10.5px] text-foreground/75">{c.soon || c.meta.length > 8 ? "" : c.meta}</span>
                        </Link>
                      ))}
                      <Link href={sec.href} onClick={close} className="inline-flex w-fit items-center gap-1.5 px-1.5 pt-1.5 text-[13px] text-muted-foreground">{sec.all} <ArrowRight className="size-3.5" /></Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative grid shrink-0 gap-3 border-t border-border/60 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <Availability />
            <ThemeSwitch />
          </div>
          <Link href="/contact" onClick={close} className="flex h-12 items-center justify-between rounded-full bg-foreground pr-1.5 pl-5 text-[15px] font-medium text-background transition-[scale] duration-200 active:scale-[0.98]">
            Start a project
            <span className="grid size-9 place-items-center rounded-full bg-background text-foreground"><ArrowUpRight className="size-4" /></span>
          </Link>
        </div>
      </aside>
    </header>
  )
}
