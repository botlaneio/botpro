"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"

import { LANES } from "@/lib/lanes"
import type { NavItem } from "@/lib/nav"
import { cn } from "@/lib/utils"

const row = "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors"
const sub = "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[14px] text-muted-foreground transition-colors active:bg-foreground/5 hover:text-foreground"

/** One section of the menu: a row that opens to show its links, one section at a time. */
function Group({ id, label, open, onToggle, children }: { id: string; label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <li>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className={cn(row, open ? "bg-foreground/[0.06] text-foreground" : "text-foreground/85")}>
        {label}
        <ChevronDown aria-hidden className={cn("size-4 text-muted-foreground transition-transform duration-300 ease-(--ease-lift)", open && "rotate-180")} />
      </button>
      {/* Height animates by grid rows, 0fr to 1fr, which every browser can transition. */}
      <div id={id} className="grid transition-[grid-template-rows] duration-400 ease-(--ease-lift)" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden" inert={!open}>
          <ul className="grid gap-0.5 px-1 pt-1 pb-2">{children}</ul>
        </div>
      </div>
    </li>
  )
}

/**
 * The menu on phones, after the shared reference: the button grows into a compact panel from its own corner,
 * and each section opens like an accordion, one at a time. Escape, a tap outside or choosing a link closes it.
 */
export function MobileMenu({ solutions, studio }: { solutions: NavItem[]; studio: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState<string | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const ids = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  const close = () => setOpen(false)
  const toggle = (s: string) => setSection((cur) => (cur === s ? null : s))

  return (
    <div ref={root} className="relative size-8 sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${ids}-panel`}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className={cn("absolute top-0 right-0 z-20 grid size-8 place-items-center rounded-lg transition-colors", open ? "text-foreground" : "key-physical")}
      >
        <Menu aria-hidden className={cn("absolute size-4 transition-[opacity,rotate] duration-300", open ? "rotate-90 opacity-0" : "opacity-100")} />
        <X aria-hidden className={cn("absolute size-4 transition-[opacity,rotate] duration-300", open ? "opacity-100" : "-rotate-90 opacity-0")} />
      </button>

      {/* The panel is always there; a clip that starts as the button's own square grows it out from the corner. */}
      <div className="absolute top-0 right-0 z-10 drop-shadow-[0_24px_40px_var(--float-shadow)]">
        <nav
          id={`${ids}-panel`}
          aria-label="Menu"
          inert={!open}
          className="surface-menu max-h-[calc(100dvh-1.5rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto p-2 pt-11 transition-[clip-path,opacity] duration-500 ease-(--ease-lift)"
          style={{
            clipPath: open ? "inset(0 0 0 0 round 1.1rem)" : "inset(0 0 calc(100% - 2rem) calc(100% - 2rem) round 0.5rem)",
            opacity: open ? 1 : 0,
          }}
        >
          <ul className="grid gap-0.5">
            <Group id={`${ids}-solutions`} label="Solutions" open={section === "solutions"} onToggle={() => toggle("solutions")}>
              {solutions.map((s) => (
                <li key={s.title}>
                  <Link href={s.href} onClick={close} className={sub}>
                    {s.title}
                    <span className="label-mono text-[10px] whitespace-nowrap">{s.price}</span>
                  </Link>
                </li>
              ))}
            </Group>
            <Group id={`${ids}-products`} label="Products" open={section === "products"} onToggle={() => toggle("products")}>
              {LANES.map((l) => (
                <li key={l.id}>
                  {l.status === "live" ? (
                    <a href={`https://${l.host}`} onClick={close} className={sub}>
                      {l.name}
                      <ArrowUpRight aria-hidden className="size-3.5" />
                    </a>
                  ) : (
                    <span className={cn(sub, "opacity-60")}>
                      {l.name}
                      <span className="label-mono text-[10px]">SOON</span>
                    </span>
                  )}
                </li>
              ))}
            </Group>
            <Group id={`${ids}-studio`} label="Studio" open={section === "studio"} onToggle={() => toggle("studio")}>
              {studio.map((s) => (
                <li key={s.href}><Link href={s.href} onClick={close} className={sub}>{s.label}</Link></li>
              ))}
            </Group>
            <li>
              <Link href="/contact" onClick={close} className={cn(row, "text-foreground/85")}>Contact</Link>
            </li>
          </ul>
          <Link href="/contact" onClick={close} className="btn-light mt-2 flex h-10 items-center justify-center text-sm font-medium">Start a project</Link>
        </nav>
      </div>
    </div>
  )
}
