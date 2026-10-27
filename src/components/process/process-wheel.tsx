"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { Exploded, Format, Keyboard, Laptop, Phone } from "@lucasmarkes/hairline/react"

import { STEPS } from "@/lib/process"
import { cn } from "@/lib/utils"

// Each step's object, drawn in hairline: a figure that acts the step out, and answers the pointer.
const FIGURES = [Phone, Format, Exploded, Keyboard, Laptop]

// The wheel, in its own 400 × 800 space: a large circle mostly off the left edge, its rightmost point mid-height.
const R = 560, CX = 200 - R, CY = 400, GAP = 13 * (Math.PI / 180)
const at = (a: number) => [CX + R * Math.cos(a), CY + R * Math.sin(a)] as const
const pad = (i: number) => String(i + 1).padStart(2, "0")

// Under reduced motion, or on a narrow screen, the steps are a list: nothing pins, nothing turns.
const listQuery = "(prefers-reduced-motion: reduce), (max-width: 767px)"
const subscribeList = (cb: () => void) => {
  const m = window.matchMedia(listQuery)
  m.addEventListener("change", cb)
  return () => m.removeEventListener("change", cb)
}
const useList = () => useSyncExternalStore(subscribeList, () => window.matchMedia(listQuery).matches, () => false)

/** Where the page is through the pinned section, as a step position from 0 to the last step. */
function useStepProgress(section: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const read = () => {
      frame = 0
      const el = section.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const travel = r.height - window.innerHeight
      const t = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0
      setP(t * (STEPS.length - 1))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [section, enabled])
  return p
}

/** The arc of numbered rings. The current step sits at the right-hand point; the line traces the steps done. */
function Wheel({ p }: { p: number }) {
  const angle = (i: number) => (p - i) * GAP
  const from = at(angle(0)), to = at(0)
  const active = Math.round(p)
  return (
    <svg viewBox="0 0 400 800" className="h-full w-auto overflow-visible" aria-hidden>
      <circle cx={CX} cy={CY} r={R} fill="none" className="stroke-border" strokeWidth={1.2} />
      {p > 0.01 && (
        <path d={`M${from[0]} ${from[1]} A${R} ${R} 0 0 0 ${to[0]} ${to[1]}`} fill="none" className="stroke-foreground" strokeWidth={2.4} strokeLinecap="round" />
      )}
      {STEPS.map((_, i) => {
        const a = angle(i)
        if (Math.abs(a) > Math.PI / 2.4) return null
        const [x, y] = at(a)
        const on = i === active
        const r = on ? 34 : 27
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI})`} className="transition-opacity duration-300" opacity={1 - Math.min(0.75, Math.abs(p - i) * 0.18)}>
            <circle r={r} className={cn("transition-[fill,stroke] duration-300", on ? "fill-foreground stroke-foreground" : "fill-background stroke-border")} strokeWidth={1.2} style={on ? { filter: "drop-shadow(0 10px 18px rgb(0 0 0 / 0.25))" } : undefined} />
            <text textAnchor="middle" dominantBaseline="central" className={cn("font-mono text-[17px] tabular-nums", on ? "fill-background" : "fill-foreground")}>{pad(i)}</text>
          </g>
        )
      })}
    </svg>
  )
}

/** One step's words: the number, the title, one sentence, and its tags. */
function Words({ i, className, style }: { i: number; className?: string; style?: React.CSSProperties }) {
  const s = STEPS[i]
  return (
    <div className={cn("grid content-start gap-4", className)} style={style}>
      <span className="label-mono">STEP {pad(i)}</span>
      <h3 className="text-4xl font-medium tracking-tight text-balance lg:text-5xl">{s.title}</h3>
      <p className="max-w-md text-lg text-muted-foreground">{s.body}</p>
      <ul className="flex flex-wrap gap-2">
        {s.tags.map((t) => <li key={t} className="rounded-full border border-border px-3 py-1 text-[13px] text-muted-foreground">{t}</li>)}
      </ul>
    </div>
  )
}

/**
 * How we work, as a wheel: the section pins while the page scrolls through it, the arc turns one step per
 * screen, the words cross-fade, and each step's hairline object acts itself out. It is ordinary scrolling,
 * never hijacked. Under reduced motion or on a phone it is a plain list.
 */
export function ProcessWheel() {
  const section = useRef<HTMLDivElement>(null)
  const list = useList()
  const p = useStepProgress(section, !list)
  const active = Math.round(p)

  if (list) {
    return (
      <ol className="grid gap-12">
        {STEPS.map((s, i) => {
          const Figure = FIGURES[i]
          return (
            <li key={s.title} className="grid items-center gap-6 sm:grid-cols-[1fr_14rem]">
              <Words i={i} />
              <Figure className="w-full max-w-56" label={`${s.title}: an illustration`} />
            </li>
          )
        })}
      </ol>
    )
  }

  return (
    <div ref={section} className="relative" style={{ height: `calc(100svh + ${(STEPS.length - 1) * 75}svh)` }}>
      <div className="sticky top-14 grid h-[calc(100svh-3.5rem)] grid-cols-[minmax(9rem,16rem)_1fr_minmax(16rem,26rem)] items-center gap-8 overflow-hidden">
        <div className="h-full py-6"><Wheel p={p} /></div>

        {/* The words for every step share one place; each fades and slides by how far the page is from it. */}
        <div className="relative h-80" aria-live="polite">
          {STEPS.map((s, i) => {
            const d = p - i
            return (
              <Words
                key={s.title}
                i={i}
                className="absolute inset-x-0 top-0"
                style={{ opacity: Math.max(0, 1 - Math.abs(d) * 1.8), transform: `translateY(${-d * 28}px)`, visibility: Math.abs(d) > 0.6 ? "hidden" : "visible" }}
              />
            )
          })}
        </div>

        <div className="relative aspect-[5/4] w-full">
          {STEPS.map((s, i) => {
            const Figure = FIGURES[i]
            const d = p - i
            return (
              <div key={s.title} className="absolute inset-0" style={{ opacity: Math.max(0, 1 - Math.abs(d) * 1.8), transform: `scale(${1 - Math.min(0.08, Math.abs(d) * 0.08)})`, visibility: Math.abs(d) > 0.6 ? "hidden" : "visible" }}>
                <Figure className="w-full" label={`${s.title}: an illustration`} play={i === active} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
