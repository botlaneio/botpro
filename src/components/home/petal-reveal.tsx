"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

// The pair is one image twice, aligned to the pixel: the flower in X-ray, and the same flower in colour.
// The tracking marks (boxes, labels, corner readouts) are part of the artwork, so both layers carry them.
const MUTED = "/images/flower-xray"
const VIVID = "/images/flower"
const W = 1200, H = 896

// The artwork's own boxes, in its pixels, in the order they open. `still` marks the ones that stay open
// under reduced motion.
const BOXES: { x: number; y: number; w: number; h: number; still?: boolean }[] = [
  { x: 322, y: 268, w: 135, h: 134 }, // OBJ_01
  { x: 463, y: 316, w: 277, h: 267, still: true }, // OBJ_02, stamen group
  { x: 740, y: 108, w: 228, h: 190 }, // OBJ_03, upper petal
  { x: 264, y: 537, w: 185, h: 183, still: true }, // OBJ_04, lower petal
]
const CYCLE_S = 14

const pct = (v: number, of: number) => `${(v / of) * 100}%`

function Photo({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  return (
    <picture>
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img src={`${src}.jpg`} alt="" width={W} height={H} draggable={false} decoding="async" loading="lazy" className={cn("absolute inset-0 size-full select-none", className)} style={style} />
    </picture>
  )
}

function Brackets() {
  return (
    <>
      {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
        <span key={c} className={cn("absolute size-3 border-[#e3ec9a]", c)} />
      ))}
    </>
  )
}

/**
 * A flower in X-ray with its tracked regions opening onto full colour in turn. Each region is a
 * full-colour copy clipped to the artwork's own box, so it lines up with the layer beneath. A box marked
 * CURSOR follows a mouse. Every so often the whole flower floods with colour, then falls back. Under
 * reduced motion two boxes stay open and nothing moves.
 *
 * The artwork sits in a stage of its own aspect, so the clips stay exact at any frame size: on phones it
 * fills the top of the frame, centred; from lg it is full height against the right edge, leaving the
 * left clear for the panel. The frame is black, as is the artwork's ground, so the seams never show.
 */
export function PetalReveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  const follow = (e: React.PointerEvent) => {
    const el = frame.current, st = stage.current
    if (!el || !st || e.pointerType !== "mouse") return
    const r = st.getBoundingClientRect()
    el.style.setProperty("--cx", `${e.clientX - r.left}px`)
    el.style.setProperty("--cy", `${e.clientY - r.top}px`)
    el.dataset.cursor = "on"
  }

  return (
    <div
      ref={frame}
      onPointerMove={follow}
      onPointerLeave={() => { if (frame.current) frame.current.dataset.cursor = "" }}
      className={cn("group/reveal relative isolate overflow-hidden bg-black [--cx:-999px] [--cy:-999px]", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          ref={stage}
          className="absolute top-0 left-1/2 aspect-[1200/896] h-[56%] -translate-x-1/2 lg:left-auto lg:right-0 lg:h-full lg:translate-x-0"
        >
          <Photo src={MUTED} />
          <Photo src={VIVID} className="reveal-flood" />

          {BOXES.map(({ x, y, w, h, still }, i) => (
            <div
              key={i}
              className="reveal-box"
              data-still={still ? "" : undefined}
              style={{ animationDelay: `${-CYCLE_S + (i * CYCLE_S) / BOXES.length}s` }}
            >
              <Photo src={VIVID} style={{ clipPath: `inset(${pct(y, H)} ${pct(W - x - w, W)} ${pct(H - y - h, H)} ${pct(x, W)})` }} />
            </div>
          ))}

          {/* The cursor's box: a mouse only, and only while it is over the picture. */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-data-[cursor=on]/reveal:opacity-100 motion-reduce:hidden">
            <Photo src={VIVID} style={{ clipPath: "inset(calc(var(--cy) - 55px) calc(100% - var(--cx) - 75px) calc(100% - var(--cy) - 55px) calc(var(--cx) - 75px))" }} />
            <div className="absolute h-[110px] w-[150px] -translate-x-1/2 -translate-y-1/2" style={{ left: "var(--cx)", top: "var(--cy)" }}>
              <Brackets />
              <span className="label-mono absolute top-1.5 left-2 text-[9px] leading-tight text-[#e3ec9a]!">CURSOR</span>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
