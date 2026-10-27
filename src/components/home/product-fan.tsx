"use client"

import { Children, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface FanItem {
  title: string
  note: string
}

// Where a card sits, by its distance from the centre: upright in the middle, the rest fanned out behind.
const SPREAD = 58, TILT = 7, SHRINK = 0.12, MOVE_MS = 650

/**
 * A fan of cards, after the carousel shared as a reference: one upright in the middle, the others fanned
 * behind it. Moving one place shifts the whole fan, and the two cards trading places melt into soft shapes
 * as they pass. Buttons, arrow keys, a swipe, or a tap on a side card move it. Only the centre card can be
 * reached with Tab; the others are inert until they come round.
 */
export function ProductFan({ items, children }: { items: FanItem[]; children: React.ReactNode }) {
  const cards = Children.toArray(children)
  const n = cards.length
  const [index, setIndex] = useState(0)
  const [melting, setMelting] = useState<number[]>([])
  const timer = useRef(0)
  const start = useRef<number | null>(null)

  const go = (to: number) => {
    const next = ((to % n) + n) % n
    if (next === index) return
    setMelting([index, next])
    setIndex(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMelting([]), MOVE_MS)
  }

  // The shortest way round the fan from the centre, so the cards wrap.
  const offset = (i: number) => {
    const d = (((i - index) % n) + n) % n
    return d > n / 2 ? d - n : d
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Our products"
      className="-mx-6 grid gap-8 overflow-x-clip py-2 outline-none sm:mx-0"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1) }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1) }
      }}
      onPointerDown={(e) => { start.current = e.clientX }}
      onPointerUp={(e) => {
        if (start.current === null) return
        const dx = e.clientX - start.current
        start.current = null
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
      }}
    >
      <div className="grid place-items-center [perspective:1600px]">
        {cards.map((card, i) => {
          const d = offset(i)
          const far = Math.abs(d)
          return (
            <div
              key={i}
              onClick={d !== 0 ? () => go(i) : undefined}
              className={cn(
                "w-[min(22rem,78vw)] transition-[transform,opacity,filter] ease-(--ease-lift) [grid-area:1/1]",
                d !== 0 && "cursor-pointer",
                melting.includes(i) && "[&>*>*]:[animation:fan-melt_650ms_var(--ease-lift)]",
              )}
              style={{
                transitionDuration: `${MOVE_MS}ms`,
                transform: `translateX(${d * SPREAD}%) translateY(${far * 3}%) rotate(${d * TILT}deg) scale(${1 - far * SHRINK})`,
                zIndex: 10 - far,
                opacity: far > 2 ? 0 : 1,
                filter: d === 0 ? "none" : `brightness(calc(1 - ${far} * var(--fan-dim)))`,
              }}
            >
              {/* The contents are inert while off-centre, so Tab skips them; the tap still lands on this layer. */}
              <div inert={d !== 0} aria-hidden={d !== 0}>{card}</div>
            </div>
          )
        })}
      </div>

      <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-4 px-6 sm:px-0">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous product" className="key-physical grid size-10 shrink-0 place-items-center rounded-full!">
          <ChevronLeft className="size-4" />
        </button>
        <div className="grid min-w-0 justify-items-center text-center" aria-live="polite">
          <span className="font-medium">{items[index]?.title}</span>
          <span className="label-mono truncate text-[11px]">{items[index]?.note}</span>
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next product" className="key-physical grid size-10 shrink-0 place-items-center rounded-full!">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
