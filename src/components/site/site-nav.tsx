"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, ChevronDown, CircleHelp, FileText, LayoutGrid, Route, Workflow } from "lucide-react"

import type { LaneId } from "@/lib/lanes"
import type { NavIcon } from "@/lib/nav"
import { cn } from "@/lib/utils"

import { BotlaneMark } from "./botlane-mark"
import { NAV_ICON_TONES, NAV_ICONS } from "./nav-icons"
import { ThemeSwitch } from "./theme-switch"

type ExtraIcon = "all" | "process" | "faq"

/** One row in a menu panel: an icon, a title and one line about it. */
export interface NavEntry {
  href: string
  title: string
  body: string
  icon: NavIcon | LaneId | ExtraIcon
  external?: boolean
  soon?: boolean
}

/** A menu in the bar. Its panel shows each group as a column under a small heading. */
export interface NavMenu {
  label: string
  groups: { heading: string; entries: NavEntry[] }[]
}

const LANE_ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = { syncc: CalendarDays, scriblane: FileText, flowlane: Workflow }
const LANE_TONES: Record<LaneId, string> = { syncc: "text-(--teal-text)", scriblane: "text-(--violet-text)", flowlane: "text-(--orchid-text)" }
const EXTRA_ICONS: Record<ExtraIcon, React.ComponentType<{ className?: string }>> = { all: LayoutGrid, process: Route, faq: CircleHelp }

const isSolution = (k: NavEntry["icon"]): k is NavIcon => k in NAV_ICONS
const isLane = (k: NavEntry["icon"]): k is LaneId => k in LANE_ICONS

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}
const scrolled = () => window.scrollY > 4

function Entry({ entry, onNavigate }: { entry: NavEntry; onNavigate: () => void }) {
  const k = entry.icon
  const Icon = isSolution(k) ? NAV_ICONS[k] : isLane(k) ? LANE_ICONS[k] : EXTRA_ICONS[k]
  const tone = isSolution(k) ? NAV_ICON_TONES[k] : isLane(k) ? LANE_TONES[k] : "text-foreground/70"
  const inner = (
    <>
      <span className={cn("tile-depth size-8 shrink-0 rounded-[0.6rem]!", tone)}><Icon className="size-[15px]" /></span>
      <span className="grid min-w-0 gap-0.5">
        <span className="flex items-center gap-2 text-[14px] leading-tight font-medium text-foreground">
          {entry.title}
          {entry.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px] leading-4">SOON</span>}
        </span>
        <span className="text-[12.5px] leading-snug text-muted-foreground">{entry.body}</span>
      </span>
    </>
  )
  const className = "-m-2.5 flex items-start gap-3 rounded-xl p-2.5 transition-colors duration-200 hover:bg-foreground/[0.05]"
  if (entry.soon) return <span className={cn(className, "cursor-default opacity-70 hover:bg-transparent")}>{inner}</span>
  return entry.external
    ? <a href={entry.href} onClick={onNavigate} className={className}>{inner}</a>
    : <Link href={entry.href} onClick={onNavigate} className={className}>{inner}</Link>
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
 * The site's navigation, after the Velora navigation shared as a reference: a full-width bar with the mark,
 * the menus beside it, and the actions on the right. A menu opens a wide panel under the bar, each group a
 * column of icon rows under a small heading; hover opens it on a mouse, a click anywhere. On a phone the
 * menu button opens a full-height sheet of the same groups. The bar is clear at the top of the page and
 * takes a background once the page scrolls beneath it. Its height is --header-h.
 */
export function SiteNav({ menus, links }: { menus: NavMenu[]; links: { href: string; label: string }[] }) {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(-1)
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

  // The sheet covers the page, so the page underneath must not scroll.
  useEffect(() => {
    if (!sheet) return
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = overflow }
  }, [sheet])

  const close = () => { setOpen(-1); setSheet(false) }
  // A short grace period, so a pointer crossing the gap between the bar and the panel doesn't close it.
  const hover = (i: number) => { if (!hoverable.current) return; window.clearTimeout(leave.current); setOpen(i) }
  const unhover = () => { if (!hoverable.current) return; window.clearTimeout(leave.current); leave.current = window.setTimeout(() => setOpen(-1), 140) }
  const active = open > -1 ? menus[open] : null
  const solid = isScrolled || open > -1 || sheet

  return (
    <>
      <header
        ref={root}
        onMouseLeave={unhover}
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

          <nav aria-label="Main" className="hidden h-full items-center gap-1 md:flex">
            {menus.map((m, i) => (
              <button
                key={m.label}
                type="button"
                aria-expanded={open === i}
                aria-controls={open === i ? "nav-panel" : undefined}
                onMouseEnter={() => hover(i)}
                onClick={() => setOpen(open === i ? -1 : i)}
                className={cn(
                  "inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm transition-colors duration-200",
                  open === i ? "bg-foreground/[0.07] text-foreground" : "text-foreground/70 hover:text-foreground",
                )}
              >
                {m.label}
                <ChevronDown aria-hidden className={cn("size-3.5 opacity-70 transition-transform duration-300 ease-(--ease-lift)", open === i && "rotate-180")} />
              </button>
            ))}
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} onMouseEnter={unhover} className="inline-flex h-9 items-center rounded-lg px-3 text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2" onMouseEnter={unhover}>
            <ThemeSwitch />
            <Link href="/contact" onClick={close} className="hidden h-9 items-center rounded-lg px-3 text-sm text-foreground/70 transition-colors hover:text-foreground lg:inline-flex">Contact</Link>
            <Link href="/contact" onClick={close} className="btn-light hidden h-9 items-center px-4 text-sm font-medium sm:inline-flex">Start a project</Link>
            <button
              type="button"
              aria-label={sheet ? "Close menu" : "Open menu"}
              aria-expanded={sheet}
              aria-controls="nav-sheet"
              onClick={() => setSheet(!sheet)}
              className="relative grid size-9 place-items-center rounded-lg transition-colors hover:bg-foreground/[0.07] md:hidden"
            >
              <Burger open={sheet} />
            </button>
          </div>

          {active && (
            <div
              id="nav-panel"
              role="region"
              aria-label={`${active.label} menu`}
              onMouseEnter={() => hover(open)}
              className="surface-menu absolute top-[calc(100%+0.5rem)] left-1/2 hidden w-[min(54rem,calc(100vw-3rem))] -translate-x-1/2 rounded-2xl! p-6 [animation:nav-in_260ms_var(--ease-lift)_both] md:block"
            >
              {/* An invisible bridge over the gap, so the pointer can reach the panel from the bar. */}
              <span aria-hidden className="absolute inset-x-0 -top-3 h-3" />
              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${active.groups.length}, minmax(0, 1fr))` }}>
                {active.groups.map((g) => (
                  <div key={g.heading} className="grid content-start gap-4">
                    <span className="label-mono text-[11px] tracking-[0.06em] uppercase">{g.heading}</span>
                    <div className="grid gap-4">
                      {g.entries.map((e) => <Entry key={e.title} entry={e} onNavigate={close} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Outside the header: its blur would otherwise make it the frame this fixed sheet is placed in. */}
      {sheet && (
        <div id="nav-sheet" className="fixed inset-x-0 top-(--header-h) bottom-0 z-40 overflow-y-auto border-t border-border/60 bg-background px-6 pt-2 pb-8 [animation:nav-in_260ms_var(--ease-lift)_both] md:hidden">
          {menus.map((m, i) => (
            <div key={m.label} className="border-b border-border/70">
              <button type="button" aria-expanded={row === i} onClick={() => setRow(row === i ? -1 : i)} className="flex w-full items-center justify-between py-4 text-left text-lg font-medium">
                {m.label}
                <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300 ease-(--ease-lift)", row === i && "rotate-180")} />
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-300 ease-(--ease-lift)", row === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div inert={row !== i} className="overflow-hidden">
                  <div className="grid gap-6 pt-1 pb-5 pl-2.5">
                    {m.groups.map((g) => (
                      <div key={g.heading} className="grid gap-4">
                        <span className="label-mono text-[11px] tracking-[0.06em] uppercase">{g.heading}</span>
                        {g.entries.map((e) => <Entry key={e.title} entry={e} onNavigate={close} />)}
                      </div>
                    ))}
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
