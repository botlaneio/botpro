"use client"

import { Children, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface FanItem {
  title: string
  note: string
}

// Where a card sits, by its distance from the centre: upright in the middle, the rest fanned out behind.
const SPREAD = 58, TILT = 7, SHRINK = 0.12, MOVE_MS = 650
// On its own, the fan moves one place every few seconds; a person moving it starts the count again.
const AUTO_MS = 3000

/**
 * A fan of cards, after the carousel shared as a reference: one upright in the middle, the others fanned
 * behind it. Moving one place shifts the whole fan, and the two cards trading places melt into soft shapes
 * as they pass. Buttons, arrow keys, a swipe, or a tap on a side card move it. Only the centre card can be
 * reached with Tab; the others are inert until they come round.
 *
 * Left alone, it turns one place every five seconds, gliding without the melt, while a hairline under the
 * name fills to show the next move coming. It holds while a mouse is over it, while it has keyboard focus, while it
 * is off screen or the tab is hidden, and never moves on its own under reduced motion.
 */
export function ProductFan({ items, children }: { items: FanItem[]; children: React.ReactNode }) {
  const cards = Children.toArray(children)
  const n = cards.length
  const [index, setIndex] = useState(0)
  const [melting, setMelting] = useState<number[]>([])
  const timer = useRef(0)
  const start = useRef<number | null>(null)
  const region = useRef<HTMLDivElement>(null)
  const [held, setHeld] = useState({ hover: false, focus: false, away: true, still: true })
  const playing = !held.hover && !held.focus && !held.away && !held.still

  const go = (to: number) => {
    const next = ((to % n) + n) % n
    if (next === index) return
    setMelting([index, next])
    setIndex(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMelting([]), MOVE_MS)
  }

  // Whether the fan may move on its own: on screen, in a visible tab, and motion allowed.
  useEffect(() => {
    const el = region.current
    if (!el) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)")
    let onScreen = false
    const sync = () => setHeld((h) => ({ ...h, away: !onScreen || document.hidden, still: still.matches }))
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync() }, { threshold: 0.4 })
    io.observe(el)
    document.addEventListener("visibilitychange", sync)
    still.addEventListener("change", sync)
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); still.removeEventListener("change", sync) }
  }, [])

  // One step after a full count; any move, by hand or on its own, restarts it.
  useEffect(() => {
    if (!playing || n < 2) return
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % n), AUTO_MS)
    return () => window.clearTimeout(t)
  }, [index, playing, n])

  // The shortest way round the fan from the centre, so the cards wrap.
  const offset = (i: number) => {
    const d = (((i - index) % n) + n) % n
    return d > n / 2 ? d - n : d
  }

  return (
    <div
      ref={region}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our products"
      className="-mx-4 grid min-w-0 touch-pan-y touch-pinch-zoom gap-8 overflow-x-clip py-2 outline-none sm:mx-0"
      tabIndex={0}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHeld((h) => ({ ...h, hover: true })) }}
      onPointerLeave={() => setHeld((h) => ({ ...h, hover: false }))}
      onFocus={(e) => { if (e.target.matches(":focus-visible")) setHeld((h) => ({ ...h, focus: true })) }}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHeld((h) => ({ ...h, focus: false })) }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1) }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1) }
      }}
      onPointerDown={(e) => { start.current = e.clientX }}
      onPointerCancel={() => { start.current = null }}
      onPointerUp={(e) => {
        if (start.current === null) return
        const dx = e.clientX - start.current
        start.current = null
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
      }}
    >
      <div className="grid place-items-center [--fan-blur:2.5px] [perspective:1600px] sm:[--fan-blur:0px]">
        {cards.map((card, i) => {
          const d = offset(i)
          const far = Math.abs(d)
          return (
            <div
              key={i}
              onClick={d !== 0 ? () => go(i) : undefined}
              className={cn(
                "w-[min(22rem,calc(100vw-3rem))] transition-[transform,opacity,filter] ease-(--ease-lift) [grid-area:1/1]",
                d !== 0 && "cursor-pointer",
                melting.includes(i) && "[&>*>*]:[animation:fan-melt_650ms_var(--ease-lift)]",
              )}
              style={{
                transitionDuration: `${MOVE_MS}ms`,
                transform: `translateX(${d * SPREAD}%) translateY(${far * 3}%) rotate(${d * TILT}deg) scale(${1 - far * SHRINK})`,
                zIndex: 10 - far,
                opacity: far > 2 ? 0 : 1,
                // Behind cards dim; on a phone, where they run off the screen, they blur too so cut-off text reads as shape.
                filter: d === 0 ? "none" : `brightness(calc(1 - ${far} * var(--fan-dim))) blur(var(--fan-blur))`,
              }}
            >
              {/* The contents are inert while off-centre, so Tab skips them; the tap still lands on this layer. */}
              <div inert={d !== 0} aria-hidden={d !== 0}>{card}</div>
            </div>
          )
        })}
      </div>

      <div className="mx-auto flex w-full max-w-sm items-center justify-between gap-4 px-6 sm:px-0">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous product" className="key-physical grid size-11 shrink-0 place-items-center rounded-full!">
          <ChevronLeft className="size-4" />
        </button>
        <div className="grid min-w-0 flex-1 justify-items-center overflow-hidden text-center" aria-live="polite">
          <span className="font-medium">{items[index]?.title}</span>
          <span className="label-mono w-full truncate text-center text-[11px]">{items[index]?.note}</span>
          {/* The count to the next move, as a hairline filling under the name. Keyed so it restarts each move. */}
          <span aria-hidden className="mt-2 block h-px w-16 overflow-hidden rounded-full bg-foreground/10">
            {playing && <span key={index} className="block h-full origin-left bg-foreground/40" style={{ animation: `fan-count ${AUTO_MS}ms linear both` }} />}
          </span>
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next product" className="key-physical grid size-11 shrink-0 place-items-center rounded-full!">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
