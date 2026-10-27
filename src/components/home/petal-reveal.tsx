"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

// The pair is one photograph twice, aligned to the pixel: washed out, and in full colour.
const MUTED = "/images/petals-muted"
const VIVID = "/images/petals"
const W = 1672, H = 941

// Where the boxes open, in the photograph's pixels: on petals, clear of the panel in the middle. Listed
// in the order they first open.
const BOXES: [x: number, y: number, w: number, h: number][] = [
  [30, 70, 200, 170],
  [1100, 60, 320, 220],
  [10, 660, 320, 250],
  [190, 420, 280, 200],
  [1190, 300, 230, 200],
  [1230, 690, 300, 190],
  [560, 640, 260, 190],
  [1480, 560, 192, 160],
]
const CYCLE_S = 14

const pct = (v: number, of: number) => `${(v / of) * 100}%`

function Photo({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img src={`${src}.jpg`} alt="" draggable={false} decoding="async" loading="lazy" className={cn("absolute inset-0 size-full object-cover select-none", className)} style={style} />
    </picture>
  )
}

function Brackets() {
  return (
    <>
      {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
        <span key={c} className={cn("absolute size-3 border-white/90", c)} />
      ))}
    </>
  )
}

/**
 * The petals, washed out, with boxes opening onto them in full colour, after the detection-box reveal
 * shared as a reference. Each box is a full-colour copy clipped to its rectangle, so the colour lines up
 * with the photograph beneath. A box marked CURSOR follows a mouse. Every so often the whole picture
 * floods with colour, then falls back. Under reduced motion three boxes stay open and nothing moves.
 */
export function PetalReveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null)

  const follow = (e: React.PointerEvent) => {
    const el = frame.current
    if (!el || e.pointerType !== "mouse") return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--cx", `${e.clientX - r.left}px`)
    el.style.setProperty("--cy", `${e.clientY - r.top}px`)
    el.dataset.cursor = "on"
  }

  return (
    <div
      ref={frame}
      onPointerMove={follow}
      onPointerLeave={() => { if (frame.current) frame.current.dataset.cursor = "" }}
      className={cn("group/reveal relative isolate overflow-hidden [--cx:-999px] [--cy:-999px]", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Photo src={MUTED} />
        <Photo src={VIVID} className="reveal-flood" />

        {BOXES.map(([x, y, w, h], i) => {
          const inset = `inset(${pct(y, H)} ${pct(W - x - w, W)} ${pct(H - y - h, H)} ${pct(x, W)})`
          const delay = `${-CYCLE_S + (i * CYCLE_S) / BOXES.length}s`
          return (
            <div key={i} className="reveal-box" data-still={i % 3 === 0 ? "" : undefined} style={{ animationDelay: delay }}>
              <Photo src={VIVID} style={{ clipPath: inset }} />
              <div className="absolute" style={{ left: pct(x, W), top: pct(y, H), width: pct(w, W), height: pct(h, H) }}>
                <Brackets />
                <span className="label-mono absolute top-1.5 left-1.5 rounded-[3px] bg-white/90 px-1 py-px text-[9px] leading-tight whitespace-nowrap text-neutral-900!">
                  OBJ {String(i + 1).padStart(2, "0")} · X{Math.round(x + w / 2)} Y{Math.round(y + h / 2)}
                </span>
              </div>
            </div>
          )
        })}

        {/* The cursor's box: a mouse only, and only while it is over the picture. */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-data-[cursor=on]/reveal:opacity-100 motion-reduce:hidden">
          <Photo src={VIVID} style={{ clipPath: "inset(calc(var(--cy) - 55px) calc(100% - var(--cx) - 75px) calc(100% - var(--cy) - 55px) calc(var(--cx) - 75px))" }} />
          <div className="absolute h-[110px] w-[150px] -translate-x-1/2 -translate-y-1/2" style={{ left: "var(--cx)", top: "var(--cy)" }}>
            <Brackets />
            <span className="label-mono absolute top-1.5 left-1.5 rounded-[3px] bg-white/90 px-1 py-px text-[9px] leading-tight text-neutral-900!">CURSOR</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
