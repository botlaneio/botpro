"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface Stat {
  value: number
  suffix?: string
  label: string
}

const COUNT_MS = 1500
const easeOut = (k: number) => 1 - (1 - k) ** 3

/**
 * One number that counts up from zero the first time it scrolls into view. The server renders the final
 * value, so it reads correctly without JavaScript and under reduced motion, where it never moves.
 */
function CountUp({ value }: { value: number }) {
  const el = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = el.current
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const format = (n: number) => Math.round(n).toLocaleString("en-US")
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / COUNT_MS)
        node.textContent = format(value * easeOut(k))
        if (k < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, { threshold: 0.6 })
    // Start from zero only while the number is still out of sight, so nobody sees it jump back.
    const r = node.getBoundingClientRect()
    if (r.top > window.innerHeight || r.bottom < 0) node.textContent = "0"
    io.observe(node)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])

  return <span ref={el}>{value.toLocaleString("en-US")}</span>
}

/**
 * A row of numbers, after the rolling number cards shared as a reference: each counts up as it arrives, and
 * a thin arc of the accent runs round each card's edge, offset card to card so they never move in step.
 */
export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.label} className={cn("surface-stat grid content-start gap-2 p-5 sm:p-6")} style={{ animationDelay: `${-i * 2.4}s` }}>
          <dt className="text-sm text-pretty text-muted-foreground">{s.label}</dt>
          {/* The number comes after its label in the markup, as a description list needs, and first on screen. */}
          <dd className="order-first text-4xl font-medium tracking-[-0.04em] tabular-nums sm:text-5xl">
            <CountUp value={s.value} />
            {s.suffix && <span className="text-brand-text">{s.suffix}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
