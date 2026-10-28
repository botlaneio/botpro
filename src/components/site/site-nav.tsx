"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, ChevronDown, FileText, Workflow } from "lucide-react"

import { OFFER_ICONS } from "@/components/catalog/offer-icons"
import type { OfferIcon } from "@/lib/catalog"
import type { LaneId } from "@/lib/lanes"
import { cn } from "@/lib/utils"

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

// How long the panel waits before closing once the pointer leaves, so it can cross from a trigger to the panel.
const GRACE_MS = 180

/** One item in a column: its name and one line, as in Cloudflare's product menu. */
function Item({ card, onNavigate }: { card: NavCard; onNavigate: () => void }) {
  return (
    <Link href={card.href} onClick={onNavigate} className="group/i grid gap-0.5 rounded-lg px-3 py-2 transition-colors duration-150 hover:bg-foreground/[0.06]">
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

/** A menu's panel content: its sections side by side, or a lone section's items across the panel. */
function MenuBody({ menu, onNavigate }: { menu: NavMenu; onNavigate: () => void }) {
  const lone = menu.sections.length === 1
  return (
    <div className={cn("grid", lone ? "grid-cols-1" : "grid-cols-3")}>
      {menu.sections.map((s) => (
        <div key={s.label} className="grid content-start gap-1 border-l border-border/60 p-3 pt-4 first:border-l-0">
          <span className="px-3 pb-1 text-[12.5px] text-muted-foreground">{s.label}</span>
          <div className={cn("grid gap-1", lone && "grid-cols-3")}>
            {s.cards.map((c) => <Item key={c.title} card={c} onNavigate={onNavigate} />)}
          </div>
          <Link href={s.href} onClick={onNavigate} className="group/a mt-1 inline-flex w-fit items-center gap-1.5 px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
            {s.all}
            <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover/a:translate-x-0.5" />
          </Link>
        </div>
      ))}
    </div>
  )
}

/**
 * The site's navigation: three items in the bar. Solutions and Products open one wide panel below the header,
 * after Cloudflare's: Solutions with Websites, Web apps and Custom solutions side by side, Products with
 * each product across it, a name and a line per item. Insights is a plain link. On a phone the menu button
 * opens a full-height sheet of the same menus. The bar is clear at the top of the page and takes a background
 * once the page scrolls beneath it or a menu opens. Its height is --header-h.
 */
export function SiteNav({ menus, links }: { menus: NavMenu[]; links: { href: string; label: string }[] }) {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(-1)
  // The menu the panel shows: the open one, or the last one while the panel fades out.
  const [shown, setShown] = useState(0)
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

  // The sheet covers the page, so the page underneath must not scroll. The lock goes on the root, not the
  // body: the body clips sideways overflow (decorative glows wider than a phone), and overflow:hidden there
  // would replace that clip, letting a phone widen the page and slide the view sideways under the menu.
  useEffect(() => {
    if (!sheet) return
    const root = document.documentElement
    const { overflow } = root.style
    root.style.overflow = "hidden"
    return () => { root.style.overflow = overflow }
  }, [sheet])

  const show = (i: number) => { setOpen(i); if (i > -1) setShown(i) }
  const close = () => { setOpen(-1); setSheet(false) }
  const hover = (i: number) => { if (!hoverable.current) return; window.clearTimeout(leave.current); show(i) }
  const stay = () => window.clearTimeout(leave.current)
  const unhover = () => { if (!hoverable.current) return; window.clearTimeout(leave.current); leave.current = window.setTimeout(() => setOpen(-1), GRACE_MS) }
  const solid = isScrolled || open > -1 || sheet

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
          <Link href="/" onClick={close} onMouseEnter={unhover} className="flex items-center gap-2">
            <BotlaneMark size={26} id="nav-mark" />
            <span className="font-semibold tracking-[-0.035em]">botlane</span>
          </Link>

          {/* The triggers, then the panel they share, then the plain links: that's also the order Tab follows. */}
          <div className="mx-auto hidden items-center gap-1 lg:flex" onMouseLeave={unhover}>
            <nav aria-label="Main" className="contents">
              {menus.map((m, i) => (
                <button
                  key={m.label}
                  type="button"
                  aria-expanded={open === i}
                  aria-controls="nav-panel"
                  onMouseEnter={() => hover(i)}
                  onClick={() => show(open === i ? -1 : i)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1 rounded-lg border px-3 text-sm whitespace-nowrap transition-colors duration-200",
                    open === i ? "border-border bg-foreground/[0.06] text-foreground" : "border-transparent text-foreground/70 hover:text-foreground",
                  )}
                >
                  {m.label}
                  <ChevronDown aria-hidden className={cn("size-3.5 opacity-60 transition-transform duration-300 ease-(--ease-lift)", open === i && "rotate-180")} />
                </button>
              ))}

              {/* The panel hangs from the header across the content width. Its padding on top bridges the gap
                  under the bar, so the pointer never leaves it on the way down. */}
              <div
                id="nav-panel"
                inert={open < 0}
                onMouseEnter={stay}
                onMouseLeave={unhover}
                className={cn(
                  "absolute inset-x-6 top-[calc(100%-0.5rem)] pt-2 transition-[opacity,translate] duration-200 ease-(--ease-soft)",
                  open > -1 ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                )}
              >
                <div className="overflow-hidden rounded-2xl border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.04))] bg-[color-mix(in_oklch,var(--popover)_96%,transparent)] shadow-[0_30px_70px_-30px_var(--float-shadow),inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha))] backdrop-blur-xl">
                  {menus[shown] && <MenuBody key={shown} menu={menus[shown]} onNavigate={close} />}
                </div>
              </div>

              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={close} onMouseEnter={unhover} className="inline-flex h-8 items-center rounded-lg px-3 text-sm whitespace-nowrap text-foreground/70 transition-colors duration-200 hover:text-foreground">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0" onMouseEnter={unhover}>
            <ThemeSwitch />
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
          {menus.map((m, i) => (
            <div key={m.label} className="border-b border-border/70">
              <button type="button" aria-expanded={row === i} onClick={() => setRow(row === i ? -1 : i)} className="flex w-full items-center justify-between py-4 text-left text-lg font-medium">
                {m.label}
                <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300 ease-(--ease-lift)", row === i && "rotate-180")} />
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-300 ease-(--ease-lift)", row === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div inert={row !== i} className="overflow-hidden">
                  <div className="grid gap-5 pb-5">
                    {m.sections.map((s) => (
                      <div key={s.label} className="grid gap-1">
                        {m.sections.length > 1 && <span className="label-mono px-1 pb-1 text-[11px]">{s.label.toUpperCase()}</span>}
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {links.map((l) => (
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
