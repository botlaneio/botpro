"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

/*
 * Painted panels: generated artwork, not photographs. The painter is the one from botLane UI's GlassFolder
 * (bot_components, MIT): a field of noise, domain-warped twice, normalised to span the palette, then lit as
 * the surface of a liquid. `streak` stretches it into a long exposure, like sky. It paints a small canvas over a
 * few frames, a few milliseconds at a time, and the panel scales it up: soft by design, cheap to make, and
 * shared between every panel that asks for the same picture.
 */

export interface ArtRecipe {
  /** `marble` folds the colours through each other; `streak` pulls them into a long exposure. */
  style: "marble" | "streak"
  /** Two or more colours, in the order they appear through the field. */
  colors: string[]
  /** Size of the forms. Lower is larger and calmer. */
  scale?: number
  /** How hard the field folds into itself. */
  warp?: number
  /** Direction of the flow, in radians. */
  angle?: number
  /** Specular highlight on the liquid surface, 0–1. */
  gloss?: number
}

/** Botlane's skies, from the palette: pale morning azure, and a deeper dusk for darker wells. */
export const SKIES = {
  azure: { style: "streak", colors: ["#EEF3F9", "#D6E2F1", "#A9C4EE", "#5D86CF", "#C5D8EE", "#E6EEF7", "#F7F9FC"], scale: 0.42, warp: 0.85, angle: -0.38, gloss: 0.1 },
  dawn: { style: "streak", colors: ["#F6F8FB", "#E4EBF4", "#C9D9EF", "#EFE7E3", "#B4C9E6", "#E8EEF6", "#FBFCFE"], scale: 0.4, warp: 0.9, angle: 0.28, gloss: 0.08 },
  dusk: { style: "streak", colors: ["#DCE6F3", "#8FB4F2", "#3A64B8", "#1B3C80", "#12306E", "#5D86CF", "#B9CDEA"], scale: 0.45, warp: 0.9, angle: -0.45, gloss: 0.14 },
} satisfies Record<string, ArtRecipe>

export type Sky = keyof typeof SKIES

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "")
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** A small, fast, seedable PRNG (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Seeded gradient noise, summed into fractal octaves with a rotation between each. */
function makeFbm(seed: number): (x: number, y: number, octaves: number) => number {
  const r = rng(seed)
  const perm = new Uint8Array(512)
  const grad = new Float32Array(512)
  const p: number[] = []
  for (let i = 0; i < 256; i++) p.push(i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    const t = p[i]
    p[i] = p[j]
    p[j] = t
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  for (let i = 0; i < 256; i++) {
    const a = r() * Math.PI * 2
    grad[i * 2] = Math.cos(a)
    grad[i * 2 + 1] = Math.sin(a)
  }
  const noise = (x: number, y: number): number => {
    const xi = Math.floor(x), yi = Math.floor(y)
    const xf = x - xi, yf = y - yi
    const X = xi & 255, Y = yi & 255
    const h00 = perm[X + perm[Y]] * 2
    const h10 = perm[X + 1 + perm[Y]] * 2
    const h01 = perm[X + perm[Y + 1]] * 2
    const h11 = perm[X + 1 + perm[Y + 1]] * 2
    const d00 = grad[h00] * xf + grad[h00 + 1] * yf
    const d10 = grad[h10] * (xf - 1) + grad[h10 + 1] * yf
    const d01 = grad[h01] * xf + grad[h01 + 1] * (yf - 1)
    const d11 = grad[h11] * (xf - 1) + grad[h11 + 1] * (yf - 1)
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10)
    return d00 + u * (d10 - d00) + v * (d01 - d00 + u * (d11 - d01 - d10 + d00))
  }
  return (x, y, octaves) => {
    let sum = 0, amp = 0.5
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x, y)
      const nx = 1.6 * x + 1.2 * y + 7.1
      y = -1.2 * x + 1.6 * y + 3.3
      x = nx
      amp *= 0.5
    }
    return sum
  }
}

interface ArtJob { width: number; height: number; pixels: Uint8ClampedArray; step: (rows: number) => boolean }

/** The artwork as a job spread over frames: the field a few rows at a time, then lit and coloured in one pass. */
function createArtJob(w: number, h: number, recipe: ArtRecipe, seed: number): ArtJob {
  const stops = recipe.colors.map((c, i) => ({ t: i / (recipe.colors.length - 1), c: hexToRgb(c) }))
  const scale = recipe.scale ?? 0.7
  const warp = recipe.warp ?? 3
  const gloss = recipe.gloss ?? 0.4
  const streak = recipe.style === "streak"
  const fbm = makeFbm(seed * 977 + 13)
  const r = rng(seed + 1)
  const ox = r() * 50, oy = r() * 50
  const angle = (recipe.angle ?? 0) + (r() - 0.5) * 0.5
  const ca = Math.cos(angle), sa = Math.sin(angle)
  const m = Math.min(w, h)
  const F = new Float32Array(w * h)
  const Q = new Float32Array(w * h)
  const pixels = new Uint8ClampedArray(w * h * 4)
  let row = 0

  const field = (y: number) => {
    for (let x = 0; x < w; x++) {
      const u = (x - w / 2) / m, v = (y - h / 2) / m
      let px = (u * ca - v * sa) * scale
      let py = (u * sa + v * ca) * scale
      if (streak) { px *= 0.14; py *= 2.2 }
      px += ox
      py += oy
      const qx = fbm(px, py, 3), qy = fbm(px + 5.2, py + 1.3, 3)
      const rx = fbm(px + warp * qx + 1.7, py + warp * qy + 9.2, 3)
      const ry = fbm(px + warp * qx + 8.3, py + warp * qy + 2.8, 3)
      F[y * w + x] = fbm(px + warp * rx, py + warp * ry, 4)
      Q[y * w + x] = Math.sqrt(qx * qx + qy * qy)
    }
  }

  const colorize = () => {
    const sample: number[] = []
    const stride = Math.max(1, Math.floor(F.length / 4096))
    for (let i = 0; i < F.length; i += stride) sample.push(F[i])
    sample.sort((a, b) => a - b)
    const lo = sample[Math.floor(sample.length * 0.02)], hi = sample[Math.floor(sample.length * 0.98)]
    const k = 1 / (hi - lo || 1)
    const lx = -0.55, ly = -0.65, lz = 0.52
    const slope = k * m * 0.012
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        let t = (F[i] - lo) * k
        t = t < 0 ? 0 : t > 1 ? 1 : t
        let j = 1
        while (j < stops.length - 1 && stops[j].t < t) j++
        const a = stops[j - 1], b = stops[j]
        let f = (t - a.t) / (b.t - a.t || 1)
        f = f < 0 ? 0 : f > 1 ? 1 : f
        f = f * f * (3 - 2 * f)
        const gx = (F[x < w - 1 ? i + 1 : i] - F[x > 0 ? i - 1 : i]) * slope
        const gy = (F[y < h - 1 ? i + w : i] - F[y > 0 ? i - w : i]) * slope
        const nd = (-gx * lx - gy * ly + lz) / Math.sqrt(gx * gx + gy * gy + 1)
        const spec = Math.pow(nd > 0 ? nd : 0, 24) * gloss * 255
        const silk = 1 + 0.035 * Math.sin(t * 150 + Q[i] * 24)
        const lit = (0.82 + 0.28 * nd) * silk
        pixels[i * 4] = (a.c[0] + (b.c[0] - a.c[0]) * f) * lit + spec
        pixels[i * 4 + 1] = (a.c[1] + (b.c[1] - a.c[1]) * f) * lit + spec
        pixels[i * 4 + 2] = (a.c[2] + (b.c[2] - a.c[2]) * f) * lit + spec
        pixels[i * 4 + 3] = 255
      }
    }
  }

  const step = (rows: number) => {
    if (row >= h) return true
    const end = Math.min(h, row + rows)
    while (row < end) field(row++)
    if (row < h) return false
    colorize()
    return true
  }
  return { width: w, height: h, pixels, step }
}

// One shared painter: every panel queues its picture here, and the queue spends a few milliseconds a frame.
const cache = new Map<string, Promise<string>>()
const queue: { job: ArtJob; done: (url: string) => void }[] = []
let pumping = false

function pump() {
  if (pumping) return
  pumping = true
  const tick = () => {
    const until = performance.now() + 6
    while (queue.length && performance.now() < until) {
      const head = queue[0]
      if (head.job.step(6)) {
        queue.shift()
        const c = document.createElement("canvas")
        c.width = head.job.width
        c.height = head.job.height
        c.getContext("2d")?.putImageData(new ImageData(head.job.pixels as Uint8ClampedArray<ArrayBuffer>, c.width, c.height), 0, 0)
        head.done(c.toDataURL("image/webp", 0.92))
      }
    }
    if (queue.length) requestAnimationFrame(tick)
    else pumping = false
  }
  requestAnimationFrame(tick)
}

function paint(recipe: ArtRecipe, seed: number, w: number, h: number): Promise<string> {
  const key = JSON.stringify([recipe, seed, w, h])
  let p = cache.get(key)
  if (!p) {
    p = new Promise((done) => {
      queue.push({ job: createArtJob(w, h, recipe, seed), done })
      pump()
    })
    cache.set(key, p)
  }
  return p
}

/**
 * A painted panel, filling its box: the sky is painted small (`res` wide, at the box's proportions) and scaled up,
 * so it reads as soft paint. It fades in once painted; until then the box shows a gradient in the same colours,
 * so nothing pops. Decorative. Painting starts when the panel nears the screen.
 */
export function ArtPanel({ sky = "azure", seed = 7, res = 360, className, children }: { sky?: Sky; seed?: number; res?: number; className?: string; children?: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState<string | null>(null)
  const recipe: ArtRecipe = SKIES[sky]

  useEffect(() => {
    const el = box.current
    if (!el) return
    let live = true
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      const ratio = el.offsetHeight / Math.max(1, el.offsetWidth) || 0.6
      const w = res, h = Math.max(48, Math.round(res * Math.min(1.6, Math.max(0.3, ratio))))
      paint(recipe, seed, w, h).then((u) => { if (live) setUrl(u) })
    }, { rootMargin: "400px" })
    io.observe(el)
    return () => { live = false; io.disconnect() }
  }, [recipe, seed, res])

  return (
    <div
      ref={box}
      className={cn("isolate overflow-hidden", !/\b(absolute|fixed)\b/.test(className ?? "") && "relative", className)}
      style={{ background: `linear-gradient(160deg, ${recipe.colors[1]}, ${recipe.colors[2]} 55%, ${recipe.colors[recipe.colors.length - 2]})` }}
    >
      <div
        aria-hidden
        className={cn("absolute inset-0 -z-10 scale-105 bg-cover bg-center transition-opacity duration-1000 ease-(--ease-soft)", url ? "opacity-100" : "opacity-0")}
        style={url ? { backgroundImage: `url(${url})` } : undefined}
      />
      {children}
    </div>
  )
}
