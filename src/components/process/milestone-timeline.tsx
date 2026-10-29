"use client"

import { useEffect, useRef } from "react"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

/*
 * How a project runs, as a milestone timeline, after Framer's Timeline Slider (Matthias Ölschlegel): a thread of
 * light runs down the rail at the reading position, and when it reaches a step's dot the dot lights up and the
 * step's card grows out of it, first as a slim bud, then to its full width, while its text arrives. The cards
 * opening push the later steps down. Scrolling back past a dot folds its card again (with a little slack, so it
 * doesn't flicker at the edge). Any card can be opened or closed by click, tap or keyboard.
 *
 * One scroll handler writes the light's length and each step's state as data attributes and a custom property:
 * no React renders while scrolling. Under reduced motion every card is open and the rail fully lit.
 */

export type Milestone = { title: string; body: string; tags?: readonly string[]; note?: string }

// How far the light must fall back behind a dot before its card folds again, in px.
const SLACK = 14

export function MilestoneTimeline({ steps, className }: { steps: readonly Milestone[]; className?: string }) {
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const el = list.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"))
    const dots = items.map((it) => it.querySelector<HTMLElement>("[data-dot]")!)
    // A click overrides the scroll for that step until the light next crosses its dot.
    const manual = new Map<number, boolean>()

    const setOpen = (i: number, open: boolean) => {
      const it = items[i]
      it.dataset.open = open ? "1" : ""
      it.querySelector("button")?.setAttribute("aria-expanded", String(open))
    }

    const clicks = items.map((it, i) => {
      const b = it.querySelector("button")!
      const on = () => {
        const open = it.dataset.open !== "1"
        manual.set(i, open)
        setOpen(i, open)
      }
      b.addEventListener("click", on)
      return () => b.removeEventListener("click", on)
    })

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--tl-reach", "100%")
      items.forEach((it, i) => { it.dataset.lit = "1"; setOpen(i, true) })
      el.dataset.ready = "1"
      return () => clicks.forEach((off) => off())
    }

    let raf = 0
    const frame = () => {
      raf = 0
      const top = el.getBoundingClientRect().top
      // The reading position: a little below the middle of the screen.
      const line = window.innerHeight * 0.58
      const centres = dots.map((d) => { const r = d.getBoundingClientRect(); return r.top + r.height / 2 - top })
      const last = centres[centres.length - 1]
      const reach = Math.max(0, Math.min(last, line - top))
      el.style.setProperty("--tl-reach", `${reach.toFixed(1)}px`)
      el.style.setProperty("--tl-end", `${last.toFixed(1)}px`)
      items.forEach((it, i) => {
        const was = it.dataset.lit === "1"
        const lit = was ? reach > centres[i] - SLACK : reach >= centres[i] - 1
        if (lit !== was) { it.dataset.lit = lit ? "1" : ""; manual.delete(i) }
        setOpen(i, manual.get(i) ?? lit)
      })
    }
    const ask = () => { if (!raf) raf = requestAnimationFrame(frame) }
    frame()
    el.dataset.ready = "1"
    window.addEventListener("scroll", ask, { passive: true })
    window.addEventListener("resize", ask)
    // Cards opening and closing change the dots' places; follow them while they move.
    const ro = new ResizeObserver(ask)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", ask)
      window.removeEventListener("resize", ask)
      ro.disconnect()
      clicks.forEach((off) => off())
    }
  }, [])

  return (
    <ol ref={list} className={cn("tl relative grid", className)}>
      {/* The rail, and the light running down it to the reading position. */}
      <span aria-hidden className="tl-rail" />
      <span aria-hidden className="tl-light" />
      <span aria-hidden className="tl-head" />
      {steps.map((s, i) => {
        const n = String(i + 1).padStart(2, "0")
        return (
          <li key={s.title} data-step="" className="tl-step grid grid-cols-[var(--tl-col)_1fr] sm:grid-cols-[3.5rem_var(--tl-col)_1fr]">
            <span className="tl-num label-mono hidden pt-[1.15rem] text-right text-[11px] sm:block">{n}</span>
            <span className="relative flex justify-center pt-[1.3rem]"><span data-dot="" className="tl-dot" /></span>
            <div className="tl-card relative pb-4">
              <span aria-hidden className="tl-bg" />
              <button type="button" aria-expanded="false" className="relative flex min-h-14 w-full items-center gap-3 rounded-2xl px-5 text-left">
                <span className="label-mono text-[10.5px] sm:hidden">{n}</span>
                <span className="tl-title flex-1 text-[17px] font-medium tracking-tight">{s.title}</span>
                <Plus aria-hidden className="tl-plus size-4 shrink-0 text-muted-foreground" />
              </button>
              <div className="tl-body grid">
                <div className="min-h-0 overflow-hidden">
                  <div className="tl-text grid gap-3 px-5 pb-5">
                    <p className="max-w-prose text-[15px] leading-relaxed text-foreground/72">{s.body}</p>
                    {(s.tags?.length || s.note) && (
                      <div className="flex flex-wrap gap-1.5">
                        {s.note && <span className="tl-note label-mono rounded-full px-2.5 text-[10px] leading-6">{s.note.toUpperCase()}</span>}
                        {s.tags?.map((t) => <span key={t} className="rounded-full border border-border px-2.5 text-xs leading-6 text-muted-foreground">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
