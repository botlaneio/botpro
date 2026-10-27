"use client"

import { useEffect, useId, useRef } from "react"

import { cn } from "@/lib/utils"

import { CREASE, EYES, SHELL } from "./botlane-mark"

// The mark's centre, and how far the light sits from it, in the mark's 24-unit space.
const CX = 12, CY = 11.8, REACH = 10.2
// The passing line: a slanted band that crosses the helmet every few seconds and shows its whole outline.
const PASS_FROM = -4, PASS_TO = 28, PASS_MS = 1900, PASS_EVERY = 6500
// The eyes look toward the pointer, but never further than this.
const GAZE = 0.42

const ease = (k: number) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2)

/**
 * The homepage mark, alive. The edge of light round the helmet turns toward the pointer and the eyes look at it;
 * every few seconds a line of light passes over and shows the whole helmet, then it fades back into the dark.
 * Without a pointer (phones) only the passing light runs. Under reduced motion it is the still mark. The loop
 * writes straight to the SVG, never re-renders, and sleeps while the mark is off screen or the tab is hidden.
 */
export function HeroMark({ size = 88, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "")
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = svg.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const fall = el.querySelector<SVGRadialGradientElement>(`#${id}-fall`)!
    const look = el.querySelector<SVGGElement>("[data-look]")!
    const band = el.querySelectorAll<SVGElement>("[data-band]")
    const edge = el.querySelector<SVGGElement>("[data-edge]")!
    const hover = window.matchMedia("(hover: hover)").matches

    // Springs for where the light and the gaze are heading; the angle is unwrapped so it turns the short way.
    const s = { a: 0, va: 0, ta: 0, gx: 0, vgx: 0, tgx: 0, gy: 0, vgy: 0, tgy: 0 }
    const spring = (x: number, v: number, t: number, dt: number) => {
      const acc = 90 * (t - x) - 16 * v
      v += acc * dt
      return [x + v * dt, v] as const
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
      let ta = Math.atan2(dy, dx)
      while (ta - s.a > Math.PI) ta -= Math.PI * 2
      while (ta - s.a < -Math.PI) ta += Math.PI * 2
      s.ta = ta
      const d = Math.hypot(dx, dy) || 1, reach = Math.min(1, d / 260) * GAZE
      s.tgx = (dx / d) * reach
      s.tgy = (dy / d) * reach * 0.6
    }
    const onLeave = () => {
      s.ta = Math.round(s.a / (Math.PI * 2)) * Math.PI * 2   // back to the right, the short way round
      s.tgx = 0; s.tgy = 0
    }
    if (hover) {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.documentElement.addEventListener("pointerleave", onLeave)
    }

    let raf = 0, last = performance.now(), visible = true
    const t0 = performance.now()
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ;[s.a, s.va] = spring(s.a, s.va, s.ta, dt)
      ;[s.gx, s.vgx] = spring(s.gx, s.vgx, s.tgx, dt)
      ;[s.gy, s.vgy] = spring(s.gy, s.vgy, s.tgy, dt)
      fall.setAttribute("cx", (CX + REACH * Math.cos(s.a)).toFixed(3))
      fall.setAttribute("cy", (CY + REACH * 0.92 * Math.sin(s.a)).toFixed(3))
      look.setAttribute("transform", `translate(${s.gx.toFixed(3)} ${s.gy.toFixed(3)})`)

      const p = (now - t0) % PASS_EVERY
      const on = p < PASS_MS
      const x = on ? PASS_FROM + (PASS_TO - PASS_FROM) * ease(p / PASS_MS) : PASS_FROM
      const centre = Math.exp(-(((x - 12) / 7) ** 2))
      band.forEach((b) => b.setAttribute("transform", `translate(${x.toFixed(3)} 0) skewX(-16)`))
      edge.setAttribute("opacity", on ? (0.5 + 0.45 * centre).toFixed(3) : "0")

      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0
    }
    const wake = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake() })
    io.observe(el)
    document.addEventListener("visibilitychange", wake)
    wake()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener("visibilitychange", wake)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [id])

  const eyes = EYES.large
  return (
    <svg ref={svg} width={size} height={size} viewBox="1 1 22 22" role="img" aria-label="Botlane" className={cn("shrink-0 overflow-visible", className)}>
      <defs>
        <radialGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" cx={CX + REACH} cy={CY} r="11">
          <stop offset="0.1" stopColor="#fff" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-rim`} maskUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
          <rect x="-2" y="-2" width="28" height="28" fill={`url(#${id}-fall)`} />
        </mask>
        <linearGradient id={`${id}-band`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-pass`} maskUnits="userSpaceOnUse" x="-12" y="-12" width="48" height="48">
          <rect data-band x="-1.6" y="-8" width="3.2" height="40" fill={`url(#${id}-band)`} transform={`translate(${PASS_FROM} 0) skewX(-16)`} />
        </mask>
        <linearGradient id={`${id}-eye`} gradientUnits="userSpaceOnUse" x1="0" y1={eyes.y[0]} x2="0" y2={eyes.y[1]}>
          <stop offset="0" style={{ stopColor: "var(--mark-eye-edge)" }} />
          <stop offset="0.42" style={{ stopColor: "var(--mark-eye-core)" }} />
          <stop offset="1" style={{ stopColor: "var(--mark-eye-base)" }} />
        </linearGradient>
        <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" x="-2" y="-2" width="28" height="28">
          <feGaussianBlur stdDeviation={0.36} />
        </filter>
      </defs>
      <g fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ stroke: "var(--mark-rim)" }}>
        {/* The passing line: the whole outline, seen only where the band is. */}
        <g data-edge mask={`url(#${id}-pass)`} opacity="0">
          <path d={CREASE} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ stroke: "var(--mark-crease)" }} />
          <path d={SHELL} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        </g>
        {/* The edge of light, wherever it is pointing. */}
        <g mask={`url(#${id}-rim)`}>
          <path d={CREASE} strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ stroke: "var(--mark-crease)" }} />
          <path d={SHELL} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </g>
      </g>
      <g data-look>
        <path d={eyes.d} filter={`url(#${id}-glow)`} style={{ fill: "var(--mark-eye-edge)", opacity: "var(--mark-glow)" }} />
        <path d={eyes.d} fill={`url(#${id}-eye)`} />
      </g>
    </svg>
  )
}
