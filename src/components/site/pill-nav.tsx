"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, FileText, Workflow } from "lucide-react"

import type { LaneId } from "@/lib/lanes"
import type { NavIcon } from "@/lib/nav"
import { cn } from "@/lib/utils"

import { BotlaneMark } from "./botlane-mark"
import { NAV_ICON_TONES, NAV_ICONS } from "./nav-icons"
import { ThemeSwitch } from "./theme-switch"

/** One link in a menu's panel. */
export interface PillLink {
  href: string
  title: string
  body: string
  meta?: string
  icon: NavIcon | LaneId
  external?: boolean
  soon?: boolean
}

/** A menu in the bar: its panel has a short aside on the left and its links in a grid on the right. */
export interface PillMenu {
  label: string
  eyebrow: string
  blurb: string
  all: { href: string; label: string }
  links: PillLink[]
}

const LANE_ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = { syncc: CalendarDays, scriblane: FileText, flowlane: Workflow }
const LANE_TONES: Record<LaneId, string> = { syncc: "text-(--teal-text)", scriblane: "text-(--violet-text)", flowlane: "text-(--orchid-text)" }
const isSolution = (k: PillLink["icon"]): k is NavIcon => k in NAV_ICONS

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true })
  return () => window.removeEventListener("scroll", onChange)
}
const scrolled = () => window.scrollY > 4

function PanelLink({ link, onNavigate }: { link: PillLink; onNavigate: () => void }) {
  const k = link.icon
  const Icon = isSolution(k) ? NAV_ICONS[k] : LANE_ICONS[k]
  const inner = (
    <>
      <span className={cn("tile-depth size-9 shrink-0", isSolution(k) ? NAV_ICON_TONES[k] : LANE_TONES[k])}><Icon className="size-4" /></span>
      <span className="grid min-w-0 gap-0.5">
        <span className="flex items-center gap-2 text-[14px] font-medium text-foreground">
          {link.title}
          {link.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px]">SOON</span>}
        </span>
        <span className="text-[13px] leading-snug text-muted-foreground">{link.body}</span>
        {link.meta && <span className="label-mono mt-0.5 text-[11px]">{link.meta}</span>}
      </span>
      <ArrowUpRight aria-hidden className="ml-auto size-3.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover/l:opacity-70" />
    </>
  )
  const className = "group/l flex items-start gap-3 rounded-2xl p-3 transition-colors duration-200 hover:bg-foreground/[0.05]"
  if (link.soon) return <span className={cn(className, "opacity-70")}>{inner}</span>
  return link.external
    ? <a href={link.href} className={className} onClick={onNavigate}>{inner}</a>
    : <Link href={link.href} className={className} onClick={onNavigate}>{inner}</Link>
}

/**
 * The site's navigation as a floating pill, after the Navbar Pill component shared as a reference: the mark,
 * the menus in the middle, and the main action filled in the accent. A menu opens a panel the width of the
 * pill, with a short aside and its links in a grid; hover opens it on a mouse, a click anywhere else. On a
 * phone a burger opens the same menus as a drawer of accordion rows. The pill is faint glass at the top of
 * the page and firms up once the page scrolls beneath it.
 */
export function PillNav({ menus, links }: { menus: PillMenu[]; links: { href: string; label: string }[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(-1)
  const [drawer, setDrawer] = useState(false)
  const [row, setRow] = useState(-1)
  const isScrolled = useSyncExternalStore(subscribe, scrolled, () => false)
  const hoverable = useRef(false)

  useEffect(() => {
    hoverable.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(-1); setDrawer(false) } }
    const onDown = (e: PointerEvent) => { if (root.current && !root.current.contains(e.target as Node)) { setOpen(-1); setDrawer(false) } }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onDown) }
  }, [])

  const close = () => { setOpen(-1); setDrawer(false) }
  const active = open > -1 ? menus[open] : null

  return (
    <header className="sticky top-0 z-40 h-14 px-3 sm:px-6">
      <div ref={root} className="relative mx-auto max-w-5xl pt-1.5" onMouseLeave={() => { if (hoverable.current) setOpen(-1) }}>
        <div
          className={cn(
            "flex h-11 items-center gap-1 rounded-full border p-1 transition-[background-color,border-color,box-shadow] duration-300 ease-(--ease-soft)",
            isScrolled || open > -1 || drawer
              ? "border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.04))] bg-background/80 shadow-[0_2px_6px_rgb(0_0_0/0.06),0_14px_40px_-12px_var(--float-shadow)] backdrop-blur-md"
              : "border-[rgb(var(--ink)/var(--edge-alpha))] bg-background/25 backdrop-blur-sm",
          )}
        >
          <Link href="/" onClick={close} onMouseEnter={() => { if (hoverable.current) setOpen(-1) }} className="flex h-full items-center gap-2 rounded-full pr-3 pl-2.5">
            <BotlaneMark size={24} id="pill-mark" />
            <span className="font-semibold tracking-[-0.035em]">botlane</span>
          </Link>

          <nav aria-label="Main" className="hidden h-full flex-1 items-center justify-center gap-0.5 md:flex">
            {menus.map((m, i) => (
              <button
                key={m.label}
                type="button"
                aria-expanded={open === i}
                aria-controls={open === i ? "pill-panel" : undefined}
                onMouseEnter={() => { if (hoverable.current) setOpen(i) }}
                onClick={() => setOpen(open === i ? -1 : i)}
                className={cn(
                  "inline-flex h-full items-center gap-1.5 rounded-full px-4 text-sm transition-[background-color,color] duration-200",
                  open === i ? "bg-brand text-white" : "text-foreground/75 hover:bg-foreground/[0.07] hover:text-foreground",
                )}
              >
                {m.label}
                <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-300 ease-(--ease-lift)", open === i && "rotate-180")} />
              </button>
            ))}
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} onMouseEnter={() => { if (hoverable.current) setOpen(-1) }}
                className="inline-flex h-full items-center rounded-full px-4 text-sm text-foreground/75 transition-colors duration-200 hover:bg-foreground/[0.07] hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex h-full items-center gap-1" onMouseEnter={() => { if (hoverable.current) setOpen(-1) }}>
            <ThemeSwitch />
            <Link href="/contact" onClick={close} className="hidden h-full items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-medium text-white transition-[filter] hover:brightness-110 sm:inline-flex">
              Start a project
            </Link>
            <button
              type="button"
              aria-label={drawer ? "Close menu" : "Open menu"}
              aria-expanded={drawer}
              aria-controls="pill-drawer"
              onClick={() => setDrawer(!drawer)}
              className={cn("relative grid size-9 place-items-center rounded-full transition-colors md:hidden", drawer ? "bg-brand text-white" : "hover:bg-foreground/[0.07]")}
            >
              <span aria-hidden className="relative block h-2.5 w-4">
                <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-[top,transform] duration-300 ease-(--ease-lift)", drawer ? "top-1 rotate-45" : "top-0")} />
                <span className={cn("absolute inset-x-0 h-[1.5px] rounded-full bg-current transition-[top,transform] duration-300 ease-(--ease-lift)", drawer ? "top-1 -rotate-45" : "top-2")} />
              </span>
            </button>
          </div>
        </div>

        {active && (
          <div id="pill-panel" role="region" aria-label={`${active.label} menu`} className="surface-menu absolute inset-x-0 top-full mt-2 hidden rounded-[1.75rem]! p-7 [animation:pill-in_300ms_var(--ease-lift)_both] md:block">
            <div className="grid grid-cols-[minmax(11rem,15rem)_1fr] gap-10">
              <div className="grid content-start justify-items-start gap-3">
                <span className="text-[11px] font-semibold tracking-[0.12em] text-(--red-text) uppercase">{active.eyebrow}</span>
                <p className="max-w-[28ch] text-sm text-muted-foreground">{active.blurb}</p>
                <Link href={active.all.href} onClick={close} className="mt-1 inline-flex items-center gap-1.5 border-b border-border pb-1.5 text-sm font-medium transition-colors hover:border-(--red-text) hover:text-(--red-text)">
                  {active.all.label} <ArrowRight className="size-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 content-start gap-1">
                {active.links.map((l) => <PanelLink key={l.title} link={l} onNavigate={close} />)}
              </div>
            </div>
          </div>
        )}

        {drawer && (
          <div id="pill-drawer" className="surface-menu absolute inset-x-0 top-full mt-2 max-h-[75svh] overflow-y-auto rounded-[1.75rem]! px-5 pt-1 pb-5 [animation:pill-in_300ms_var(--ease-lift)_both] md:hidden">
            {menus.map((m, i) => (
              <div key={m.label} className="border-b border-border/70">
                <button type="button" aria-expanded={row === i} onClick={() => setRow(row === i ? -1 : i)}
                  className={cn("flex w-full items-center justify-between py-4 text-left font-medium transition-colors", row === i && "text-(--red-text)")}>
                  {m.label}
                  <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300 ease-(--ease-lift)", row === i && "rotate-180")} />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300 ease-(--ease-lift)", row === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div inert={row !== i} className="overflow-hidden">
                    <div className="grid gap-0.5 pb-3">
                      {m.links.map((l) => <PanelLink key={l.title} link={l} onNavigate={close} />)}
                      <Link href={m.all.href} onClick={close} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                        {m.all.label} <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className="flex items-center justify-between border-b border-border/70 py-4 font-medium">
                {l.label} <ArrowRight className="size-4 opacity-60" />
              </Link>
            ))}
            <Link href="/contact" onClick={close} className="mt-5 flex h-12 items-center justify-center gap-1.5 rounded-full bg-brand font-medium text-white">
              Start a project <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
