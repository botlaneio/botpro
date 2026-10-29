"use client"

import { useEffect, useRef, useState } from "react"

import { BotlaneMark } from "@/components/site/botlane-mark"
import { cn } from "@/lib/utils"

/*
 * The homepage hero, after Mosey's: one illustrated scene with no frame round it, told in three acts (Build,
 * Launch, Care) that play on their own and can be picked from the tabs underneath. Each act is one or two
 * scenes, each named by a caption above the tabs. Everything runs on one clock: elements carry the seconds
 * they arrive and leave in data attributes, and a camera zooms the scene in for the build and out for Care.
 * It pauses off screen and in a hidden tab; under reduced motion each tab shows one finished frame.
 */

// The stage the scene is drawn in. It is scaled to fit the hero; the centre of the action is (600, 400).
const W = 1200, H = 760, CX = 600, CY = 400

const ACTS = [
  { name: "Build", start: 0, end: 12, still: 10.8 },
  { name: "Launch", start: 12, end: 19, still: 17.6 },
  { name: "Care", start: 19, end: 29, still: 27.4 },
] as const
// After the last act: the scene clears and the closing line and call to action arrive; the clock stops here.
const END = 30.2

// Cubic-bezier easing, the way CSS and After Effects define it.
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1
  const c = (p1: number) => 3 * p1
  const at = (t: number, p1: number, p2: number) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t
  const slope = (t: number, p1: number, p2: number) => 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1)
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 6; i++) {
      const s = slope(t, x1, x2)
      if (Math.abs(s) < 1e-6) break
      t -= (at(t, x1, x2) - x) / s
    }
    return at(t, y1, y2)
  }
}
// Entrances land softly; exits leave quickly; the camera starts slowly and brakes hard.
const enter = bezier(0.17, 0.17, 0.21, 1)
const exit = bezier(0.49, 0, 0.83, 0.83)
const brake = bezier(0.82, 0, 0.22, 1)

// The camera: [second, zoom, x, y] — the point at (x, y) sits at the centre of the action at that zoom.
type Key = [number, number, number, number]
const camera = (compact: boolean, phone: boolean): Key[] => phone ? [
  // Phones: no zoom while the site is the subject; for Care, pulled back and lifted so the three sites fill the band.
  [0, 1, CX, CY], [19, 1, CX, CY], [20.6, 0.41, CX, 233],
] : [
  [0, 1, CX, CY], [5.6, 1, CX, CY], [6.9, compact ? 1 : 1.14, CX, compact ? CY : 410], [11.5, compact ? 1 : 1.14, CX, compact ? CY : 410], [12.6, 1, CX, CY],
  [19, 1, CX, CY], [20.6, compact ? 0.6 : 0.56, CX, CY],
]

const span = (s: number, len = 0.5) => `${s} ${s + len}`

// In the compact layout, the band of the stage that holds every scene, top to bottom, in stage units.
const COMPACT = { top: 110, bottom: 750 }
// On phones, a narrower and shorter band (x from 400 to 800): the pieces are stacked tight round the site, at their
// p places, so the scene can be drawn nearly the width of the screen.
const PHONE = { top: 210, bottom: 726, width: 400 }
// Care sites left out of the compact layout, so three sites sit in a triangle round the hub.
const COMPACT_SKIP = new Set([1, 4])

type At = [number, number]
// Where a piece sits: on wide screens at (x, y), on tablets at m, stacked round the site where it stays readable,
// and on phones at p, inside the phone band.
const pos = (x: number, y: number, m?: At, p?: At) => {
  const mm = m ?? [x, y], pp = p ?? mm
  return { "--dx": `${x}px`, "--dy": `${y}px`, "--mx": `${mm[0]}px`, "--my": `${mm[1]}px`, "--px": `${pp[0]}px`, "--py": `${pp[1]}px` } as React.CSSProperties
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" className="scene-spin absolute inset-0 size-full" aria-hidden>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="20 40" strokeLinecap="round" />
    </svg>
  )
}
function Tick() {
  return (
    <svg viewBox="0 0 16 16" className="scene-tick absolute inset-0 size-full text-brand-text" aria-hidden>
      <path d="M3.5 8.4l3 3 6-6.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** A task that arrives with a spinner and settles with a tick. */
function Chip({ x, y, m, p, at, done, out, children, size = "sm", place = "absolute" }: { x: number; y: number; m?: At; p?: At; at: number; done: number; out: number; children: React.ReactNode; size?: "sm" | "lg"; place?: "absolute" | "static" }) {
  return (
    <div
      data-in={span(at)} data-out={span(out, 0.4)} data-done={done} data-rise="" data-pos={place === "absolute" ? "" : undefined}
      className={cn("scene-chip flex items-center whitespace-nowrap", place === "absolute" ? "absolute" : "relative", size === "lg" ? "scene-chip-lg" : "")}
      style={place === "absolute" ? pos(x, y, m, p) : undefined}
    >
      <span className="relative shrink-0 text-muted-foreground"><Spinner /><Tick /></span>
      {children}
    </div>
  )
}

/** A task card with its status: "To do" until it's done. */
function Task({ x, y, m, p, at, done, out, wide, children }: { x: number; y: number; m?: At; p?: At; at: number; done: number; out: number; wide?: boolean; children: React.ReactNode }) {
  return (
    <div data-in={span(at)} data-out={span(out, 0.4)} data-done={done} data-rise="" data-pos="" className={cn("scene-card absolute flex items-center gap-4", wide && "scene-wide")} style={pos(x, y, m, p)}>
      <span className="text-[15px] whitespace-nowrap">{children}</span>
      <span className="relative ml-auto h-6 w-[74px]">
        <span className="scene-todo absolute inset-0 grid place-items-center rounded-full text-[12px] font-medium">To do</span>
        <span className="scene-doneflag absolute inset-0 grid place-items-center rounded-full text-[12px] font-medium">Done</span>
      </span>
    </div>
  )
}

/** A dotted line drawn from one point to another. */
function Wire({ d, at, out, className }: { d: string; at: number; out: number; className?: string }) {
  return <path d={d} data-in={span(at, 0.6)} data-out={span(out, 0.4)} className={cn("scene-wire scene-wide", className)} />
}

/** The client's site, drawn in hairlines: a browser window with a hero, a button and three service cards. */
function Site({ x, y, w, at, out, glass }: { x: number; y: number; w: number; at: number; out: number; glass?: boolean }) {
  const s = w / 360, h = 240 * s
  return (
    <g data-in={span(at, 0.6)} data-out={span(out, 0.5)}>
      <rect x={x} y={y} width={w} height={h} rx={12 * s} className={cn("scene-window", glass && "glass")} />
      <path d={`M${x} ${y + 26 * s} H${x + w}`} className="scene-line" />
      {[0, 1, 2].map((i) => <circle key={i} cx={x + (16 + i * 11) * s} cy={y + 13 * s} r={3 * s} className="scene-dot" />)}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <text x="24" y="49" fill="var(--foreground)" fontSize="9" fontWeight="600" letterSpacing="1.5">NORTHSIDE / PHYSIO</text>
        <text x="24" y="80" fill="var(--foreground)" fontSize="23" fontWeight="500" letterSpacing="-0.7">Move freely.</text>
        <text x="24" y="107" fill="var(--foreground)" fontSize="23" fontWeight="500" letterSpacing="-0.7">Feel yourself again.</text>
        <text x="24" y="127" fill="var(--muted-foreground)" fontSize="8">Personal care. A plan that moves with you.</text>
        <rect x="24" y="140" width="105" height="24" rx="6" className="scene-brand" />
        <text x="35" y="155" fill="var(--brand-foreground, white)" fontSize="8" fontWeight="500">Book a consultation ↗</text>
        {["Recover", "Strengthen", "Keep moving"].map((label, i) => (
          <g key={label}>
            <rect x={24 + i * 106} y="183" width="96" height="35" rx="6" className="scene-card-fill" />
            <text x={34 + i * 106} y="204" fill="var(--foreground)" fontSize="8.5">{label}</text>
          </g>
        ))}
      </g>
    </g>
  )
}

// Care: the client sites around the hub, on an ellipse round the centre, each with its monthly check.
// When each Care site's check starts and finishes.
const careAt = (i: number) => 21.6 + i * 0.7
const careDone = (i: number) => 22.6 + i * 0.9

const CARE = [
  { x: 600, y: 40, label: "Physio clinic", task: "Uptime checked" },
  { x: 1133, y: 289, label: "Law firm", task: "Backup taken" },
  { x: 929, y: 691, label: "Agency", task: "Security update" },
  { x: 271, y: 691, label: "Accounting firm", task: "Small edit made" },
  { x: 67, y: 289, label: "SaaS company", task: "Dependencies updated" },
]

export function HeroScene({ className }: { className?: string }) {
  const hero = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const cam = useRef<HTMLDivElement>(null)
  const clock = useRef(0)
  const jump = useRef<((t: number) => void) | null>(null)
  const [act, setAct] = useState(0)
  const [ended, setEnded] = useState(false)

  // Fit the stage to the hero. Wide screens: the whole stage, behind the headline. Phones and tablets (compact): only
  // the middle 600 units across, fitted into the space left between the headline and the tabs, so nothing overlaps.
  useEffect(() => {
    const el = hero.current, st = stage.current
    if (!el || !st) return
    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      const compact = width < 1024
      const phone = width < 640
      el.dataset.compact = compact ? "1" : ""
      el.dataset.phone = phone ? "1" : ""
      const top = (el.querySelector("[data-hero-top]") as HTMLElement | null)?.offsetHeight ?? 0
      const bottom = (el.querySelector("[data-hero-bottom]") as HTMLElement | null)?.offsetHeight ?? 0
      const free = Math.max(0, height - top - bottom - 24)
      // Narrower wide screens (a tablet held sideways) keep the scene clear of the headline and the captions.
      const narrow = !compact && width < 1280
      const lift = narrow ? top * 0.4 : 0
      const room = height - lift - (narrow ? bottom * 0.7 : 0)
      const band = phone ? PHONE : { ...COMPACT, width: 600 }
      const k = compact ? Math.min(width / band.width, free / (band.bottom - band.top)) : Math.min(width / W, room / H)
      const tx = width / 2 - CX * k
      const ty = compact
        ? top + 12 + free / 2 - ((band.top + band.bottom) / 2) * k
        : lift + (room - H * k) / 2
      
      st.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${k.toFixed(4)})`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    for (const band of el.querySelectorAll("[data-hero-top], [data-hero-bottom]")) ro.observe(band)
    return () => ro.disconnect()
  }, [])

  // The clock.
  useEffect(() => {
    const root = hero.current, cm = cam.current
    if (!root || !cm) return
    const pair = (v: string | undefined) => (v ? v.split(" ").map(Number) : null)
    const parts = Array.from(root.querySelectorAll<HTMLElement | SVGElement>("[data-in], [data-count], [data-type]")).map((el) => ({
      el,
      inn: pair(el.dataset.in),
      out: pair(el.dataset.out),
      done: el.dataset.done ? Number(el.dataset.done) : null,
      count: pair(el.dataset.count),
      type: pair(el.dataset.type),
      full: el.dataset.text ?? "",
      linear: el.dataset.linear !== undefined,
    }))
    const rings = Array.from(root.querySelectorAll<SVGElement>("[data-ring]"))
    const prog = ([s, e]: number[], t: number) => Math.min(1, Math.max(0, (t - s) / (e - s)))
    const mode = () => `${root.dataset.compact}${root.dataset.phone}`
    let shownMode = mode()
    let keys = camera(root.dataset.compact === "1", root.dataset.phone === "1")
    let shownAct = -1, shownEnd = false

    const paint = (t: number) => {
      for (const p of parts) {
        const { el } = p
        if (p.inn) el.style.setProperty("--in", (p.linear ? prog(p.inn, t) : enter(prog(p.inn, t))).toFixed(3))
        if (p.inn || p.out) el.style.setProperty("--out", p.out ? (1 - exit(prog(p.out, t))).toFixed(3) : "1")
        if (p.done !== null) el.style.setProperty("--done", enter(prog([p.done, p.done + 0.4], t)).toFixed(3))
        if (p.count) el.textContent = `${Math.round((p.linear ? prog(p.count, t) : enter(prog(p.count, t))) * 100)}%`
        if (p.type) el.textContent = p.full.slice(0, Math.round(prog(p.type, t) * p.full.length))
      }
      // The camera, between the two keys either side of now.
      if (mode() !== shownMode) { shownMode = mode(); keys = camera(root.dataset.compact === "1", root.dataset.phone === "1") }
      let i = keys.length - 1
      while (i > 0 && keys[i][0] > t) i--
      const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)]
      const f = b[0] > a[0] ? brake(prog([a[0], b[0]], t)) : 0
      const z = a[1] + (b[1] - a[1]) * f, x = a[2] + (b[2] - a[2]) * f, y = a[3] + (b[3] - a[3]) * f
      cm.style.transform = `translate(${CX - x * z}px, ${CY - y * z}px) scale(${z})`
      cm.style.transformOrigin = "0 0"
      cm.style.setProperty("--zoom", z.toFixed(3))
      // Each tab's ring fills over its act.
      const now = ACTS.findIndex((a) => t < a.end)
      rings.forEach((r, j) => {
        const a = ACTS[j]
        r.style.setProperty("--p", (t >= a.end ? 1 : prog([a.start, a.end], t)).toFixed(3))
      })
      const ending = t >= ACTS[ACTS.length - 1].end
      const actNow = now === -1 ? ACTS.length - 1 : now
      if (actNow !== shownAct) { shownAct = actNow; setAct(actNow) }
      if (ending !== shownEnd) { shownEnd = ending; setEnded(ending) }
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (still) {
      jump.current = (t) => paint(ACTS.find((a) => t >= a.start && t < a.end)?.still ?? ACTS[0].still)
      paint(ACTS[0].still)
      root.dataset.ready = "1"
      return
    }

    let raf = 0, last = 0, visible = false
    const tick = (now: number) => {
      if (last) clock.current = Math.min(END, clock.current + (now - last) / 1000)
      last = now
      paint(clock.current)
      if (clock.current < END) raf = requestAnimationFrame(tick)
    }
    const run = () => {
      cancelAnimationFrame(raf)
      last = 0
      if (visible && !document.hidden) raf = requestAnimationFrame(tick)
    }
    jump.current = (t) => { clock.current = t; paint(t); run() }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run() })
    io.observe(root)
    document.addEventListener("visibilitychange", run)
    paint(0)
    root.dataset.ready = "1"
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", run); cancelAnimationFrame(raf) }
  }, [])

  const go = (t: number) => jump.current?.(t)

  return (
    <div ref={hero} className={cn("scene relative isolate overflow-hidden", className)}>
      {/* The stage: drawn at 1200 × 760 and scaled to the hero. */}
      <div ref={stage} aria-hidden className="pointer-events-none absolute top-0 left-0 origin-top-left" style={{ width: W, height: H }}>
        {/* Build, scene one: a line from the headline winds to the site; another arrives from the right. */}
        <svg viewBox={`0 0 ${W} ${H}`} className="scene-wide absolute inset-0 size-full overflow-visible">
          <path d="M372 150 C 430 150 440 214 380 214 L 150 214 C 70 214 70 330 150 330 L 190 330 C 260 330 250 478 330 478 L 420 478" pathLength={1} fill="none" data-in={span(0.2, 1.6)} data-out={span(5.0, 0.5)} data-draw="" className="scene-path" />
          {/* A glint of light that runs along the line into the site, once the line is drawn. */}
          <path d="M372 150 C 430 150 440 214 380 214 L 150 214 C 70 214 70 330 150 330 L 190 330 C 260 330 250 478 330 478 L 420 478" pathLength={1} fill="none" data-in={span(1.8, 0.5)} data-out={span(5.0, 0.5)} className="scene-sheen" />
          <circle cx={420} cy={478} r={4} data-in={span(1.7, 0.3)} data-out={span(5.0, 0.5)} className="scene-node" />
          <path d="M1260 300 C 1130 300 1090 478 990 478 L 780 478" pathLength={1} fill="none" data-in={span(0.6, 1.4)} data-out={span(5.0, 0.5)} data-draw="" className="scene-path-brand" />
          <circle cx={780} cy={478} r={4.5} data-in={span(1.9, 0.3)} data-out={span(5.0, 0.5)} className="scene-node-ring" />
        </svg>

        <div ref={cam} className="absolute inset-0">
          {/* Phones: lines of their own for the opening, fitted to the phone layout. A line comes down the edge from
              under the intro and kinks into the site; two blue lines curl in from the right, into its top and its
              bottom; and the three decisions hang from it on a dotted spine. They pass under the glass. */}
          <svg viewBox={`0 0 ${W} ${H}`} className="scene-phone absolute inset-0 size-full overflow-visible">
            <path d="M403 196 C 403 228 414 246 407 262 C 400 278 390 272 393 262 C 396 250 410 256 407 284 C 405 306 407 326 402 342 C 397 358 393 372 400 384 C 406 393 413 395 420 398" pathLength={1} fill="none" data-in={span(0.2, 1.4)} data-out={span(5.0, 0.5)} data-draw="" className="scene-path" />
            <path d="M403 196 C 403 228 414 246 407 262 C 400 278 390 272 393 262 C 396 250 410 256 407 284 C 405 306 407 326 402 342 C 397 358 393 372 400 384 C 406 393 413 395 420 398" pathLength={1} fill="none" data-in={span(1.6, 0.5)} data-out={span(5.0, 0.5)} className="scene-sheen" />
            <circle cx={420} cy={398} r={4} data-in={span(1.5, 0.3)} data-out={span(5.0, 0.5)} className="scene-node" />
            <path d="M840 232 C 806 232 800 210 772 216 C 744 222 758 254 732 258 C 712 261 700 250 692 264 C 686 272 688 276 690 280" pathLength={1} fill="none" data-in={span(0.5, 1.3)} data-out={span(5.0, 0.5)} data-draw="" className="scene-path-brand" />
            <circle cx={690} cy={280} r={4.5} data-in={span(1.7, 0.3)} data-out={span(5.0, 0.5)} className="scene-node-ring" />
            <path d="M840 704 C 790 704 772 676 792 650 C 812 624 806 590 772 594 C 742 598 726 582 738 556 C 744 542 736 530 730 520" pathLength={1} fill="none" data-in={span(0.8, 1.4)} data-out={span(5.0, 0.5)} data-draw="" className="scene-path-brand" />
            <circle cx={730} cy={520} r={4.5} data-in={span(2.1, 0.3)} data-out={span(5.0, 0.5)} className="scene-node-ring" />
            <path d="M430 520 C 430 532 406 528 406 546 L 406 661" data-in={span(2.0, 0.6)} data-out={span(5.0, 0.4)} className="scene-wire" />
            <path d="M406 561 L 418 561" data-in={span(2.2, 0.4)} data-out={span(5.0, 0.4)} className="scene-wire" />
            <path d="M406 611 L 418 611" data-in={span(2.6, 0.4)} data-out={span(5.0, 0.4)} className="scene-wire" />
            <path d="M406 661 L 418 661" data-in={span(3.0, 0.4)} data-out={span(5.0, 0.4)} className="scene-wire" />
          </svg>
          {/* The client's site sits on frosted glass (the frost card), drawn behind the drawing of it. */}
          <div data-in={span(0.8, 0.6)} data-out={span(20.0, 0.5)} className="frost scene-frost absolute" style={{ left: 420, top: 280, width: 360, height: 240 }} />
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible">
            {/* Build, scene two, and Launch: an orbit round the site, with faint pieces of work drifting on it. */}
            <circle cx={CX} cy={CY} r={250} data-in={span(6.0, 1.2)} data-out={span(18.4, 0.6)} className="scene-orbit" />
            <circle cx={CX} cy={CY} r={310} data-in={span(6.3, 1.2)} data-out={span(11.4, 0.6)} className="scene-orbit faint" />
            {[[322, 250, 54], [860, 236, 40], [892, 560, 62], [330, 572, 46], [262, 420, 30], [928, 400, 34]].map(([x, y, w], i) => (
              <rect key={i} x={x} y={y} width={w} height={12} rx={6} data-in={span(6.6 + i * 0.15, 0.6)} data-out={span(18.4, 0.6)} className="scene-ghost" />
            ))}

            {/* The client's site, at the centre of every scene until Care zooms out past it. */}
            <Site x={420} y={280} w={360} at={0.8} out={20.0} glass />

            {/* Build, scene two: the progress dial. */}
            <g data-in={span(6.6, 0.6)} data-out={span(11.4, 0.5)} className="scene-dial-g">
              <circle cx={330} cy={420} r={62} className="scene-dial" />
              <circle cx={330} cy={420} r={54} pathLength={1} className="scene-dial-track" />
              <circle cx={330} cy={420} r={54} pathLength={1} data-in={span(7.0, 3.6)} data-linear="" data-draw="" className="scene-dial-arc" style={{ transform: "rotate(-90deg)", transformOrigin: "330px 420px" }} />
              <text x={330} y={396} textAnchor="middle" className="scene-small" data-in={span(6.8, 0.3)} data-out={span(10.5, 0.2)}>In progress</text>
              <text x={330} y={396} textAnchor="middle" className="scene-small" data-in={span(10.6, 0.3)}>Done</text>
              <text x={330} y={430} textAnchor="middle" className="scene-big" data-count={span(7.0, 3.6)} data-linear="">0%</text>
              <text x={330} y={452} textAnchor="middle" className="scene-small">The build</text>
            </g>

            {/* Launch: the address types itself in, and the site goes live. */}
            <g data-in={span(12.8, 0.4)} data-out={span(18.4, 0.6)}>
              <rect x={470} y={288} width={240} height={14} rx={7} className="scene-url" />
              <text x={486} y={299} className="scene-url-text" data-type={span(13.0, 1.2)} data-text="northside.physio">northside.physio</text>
            </g>

            {/* Care: the hub, and the client sites round it, joined by dotted lines. */}
            <g data-in={span(20.6, 0.6)} data-out={span(28.4, 0.6)}>
              {CARE.map((c, i) => (
                <path key={i} d={`M${CX} ${CY} L${CX + (c.x - CX) * 0.62} ${CY + (c.y - CY) * 0.62}`} data-in={span(21 + i * 0.12, 0.7)} className={cn("scene-wire", COMPACT_SKIP.has(i) && "scene-wide")} />
              ))}
            </g>
            {CARE.map((c, i) => (
              <g key={c.label} className={COMPACT_SKIP.has(i) ? "scene-wide" : undefined}>
                <circle cx={c.x} cy={c.y} r={200} data-in={span(19.8 + i * 0.15, 1)} data-out={span(28.4, 0.6)} className="scene-orbit" />
                <Site x={c.x - 130} y={c.y - 112} w={260} at={20 + i * 0.15} out={28.4} />
              </g>
            ))}
          </svg>

          {/* Build, scene one: a new brief, and the first decisions, each settling with a tick. */}
          <div data-in={span(1.6)} data-out={span(5.0, 0.4)} data-rise="" data-pos="" className="scene-person absolute flex items-center gap-3" style={pos(770, 214, [330, 168], [420, 218])}>
            <span className="grid size-9 place-items-center rounded-full bg-foreground/10 text-[13px] font-semibold">MR</span>
            <span className="grid leading-tight"><span className="text-[15px] font-medium">New brief</span><span className="text-[12.5px] text-muted-foreground">Meera Rao, Northside Physio</span></span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible">
            <Wire d="M420 330 L 380 318" at={2.2} out={5.0} />
            <Wire d="M420 410 L 380 418" at={2.6} out={5.0} />
            <Wire d="M780 400 L 830 380" at={3.0} out={5.0} />
            <Wire d="M780 300 L 790 250" at={1.6} out={5.0} />
            <Wire d="M780 320 L 830 300" at={13.9} out={18.4} />
            <Wire d="M780 400 L 830 400" at={14.3} out={18.4} />
            <Wire d="M780 480 L 830 500" at={14.7} out={18.4} />
            <Wire d="M420 400 L 370 400" at={13.4} out={18.4} />
          </svg>
          <Chip x={210} y={298} m={[300, 560]} p={[420, 542]} at={2.2} done={3.3} out={5.0}>Scope agreed</Chip>
          <Chip x={196} y={398} m={[300, 630]} p={[420, 592]} at={2.6} done={3.9} out={5.0}>Proposal signed</Chip>
          <Chip x={834} y={360} m={[620, 560]} p={[420, 642]} at={3.0} done={4.4} out={5.0}>Design approved</Chip>

          {/* Build, scene two: the work, each task moving from to do to done. */}
          <Task x={800} y={296} m={[476, 548]} p={[544, 548]} at={7.2} done={8.4} out={11.4}>Booking flow</Task>
          <Task x={812} y={356} m={[476, 612]} p={[544, 606]} at={7.8} done={9.4} out={11.4}>Payments tested</Task>
          <Task x={420} y={556} at={8.4} done={10.2} out={11.4} wide>Every screen size</Task>

          {/* Launch: live, then the handover. */}
          <div data-in={span(14.4)} data-out={span(18.4, 0.4)} data-pop="" data-pos="" className="scene-live absolute flex items-center gap-2" style={pos(700, 252, [660, 222], [700, 236])}>
            <span className="scene-live-dot size-2 rounded-full bg-brand" />Live
          </div>
          <Chip x={198} y={380} m={[330, 536]} p={[420, 542]} at={13.4} done={14.2} out={18.4}>Domain connected</Chip>
          <Chip x={834} y={300} m={[330, 588]} p={[420, 588]} at={13.9} done={15.0} out={18.4}>Logins handed over</Chip>
          <Chip x={834} y={380} m={[330, 640]} p={[420, 634]} at={14.3} done={15.6} out={18.4}>Editor guide for your team</Chip>
          <Chip x={834} y={482} m={[330, 692]} p={[420, 680]} at={14.7} done={16.2} out={18.4}>Source and design files</Chip>

          {/* Care: the hub at the centre, and each site's monthly check. */}
          <div data-in={span(20.8, 0.6)} data-out={span(28.4, 0.5)} data-pop="" className="scene-hub absolute grid place-items-center" style={{ left: CX - 92, top: CY - 92, width: 184, height: 184 }}><BotlaneMark size={136} optical="small" id="hub-mark" label="Botlane" /></div>
          {CARE.map((c, i) => (
            <div key={c.label} className={cn("absolute grid justify-items-center gap-3", COMPACT_SKIP.has(i) && "scene-wide")} style={{ left: c.x - 200, top: c.y + 84, width: 400 }}>
              <span data-in={span(20.4 + i * 0.15, 0.6)} data-out={span(28.4, 0.5)} className="scene-care-label text-[22px] text-muted-foreground">{c.label}</span>
              <Chip x={0} y={0} at={careAt(i)} done={careDone(i)} out={28.4} size="lg" place="static">{c.task}</Chip>
            </div>
          ))}
        </div>
      </div>

      {/* The headline and the one line under it. */}
      <div data-hero-top className="relative z-10 flex flex-wrap items-start justify-between gap-x-10 gap-y-3 pt-7 sm:gap-y-4 sm:pt-14">
        <h1 className="max-w-[13ch] text-[clamp(1.75rem,7.4vw,2.25rem)] leading-[1.08] font-medium tracking-tight text-balance sm:text-5xl sm:leading-[1.05]">Experiences. Worth putting your name on.</h1>
        <p className="max-w-[19rem] border-l border-border/80 pl-3.5 text-[14px] leading-normal text-foreground/80 sm:pl-4 sm:text-[15px] sm:leading-relaxed">You put care into your business. We bring that same attention to its website and software—from the first design to the final handover.</p>
      </div>

      {/* The scene's captions, the tabs, and the track they sit on. */}
      <div data-hero-bottom className="absolute inset-x-0 bottom-0 z-10 grid justify-items-center gap-3 pb-3 sm:gap-5 sm:pb-6">
        <div aria-live="polite" className="relative h-9 w-full">
          {[["It starts with your idea.", 0.2, 5.2], ["Takes shape, detail by detail.", 5.8, 11.5], ["Launches into the world.", 12.4, 18.6], ["Keeps moving with you.", 19.4, 28.6]].map(([text, a, b]) => (
            <div key={text as string} className="absolute inset-x-0 top-0 flex justify-center px-4">
              <span data-in={span(a as number, 0.4)} data-out={span(b as number, 0.3)} data-rise="" className="scene-caption text-center">{text}</span>
            </div>
          ))}
        </div>
        <div className="relative w-full">
          <div aria-hidden className="absolute top-1/2 right-0 left-0 h-px bg-border/70" />
          <span aria-hidden className="absolute top-1/2 left-0 size-1.5 -translate-y-1/2 rounded-full bg-foreground/50" />
          <span aria-hidden className="absolute top-1/2 right-0 size-1.5 -translate-y-1/2 rounded-full bg-foreground/50" />
          <div role="group" aria-label="How a project runs" className="relative mx-auto grid w-fit grid-cols-3 bg-background">
            {ACTS.map((a, i) => (
              <button
                key={a.name} type="button" onClick={() => go(a.start)} aria-current={i === act && !ended ? "step" : undefined}
                className={cn("flex h-11 items-center justify-center gap-2 px-3 text-sm transition-colors duration-200 sm:px-8", i === act && !ended ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {a.name}
                <svg viewBox="0 0 16 16" className="size-3.5 -rotate-90" aria-hidden>
                  <circle cx="8" cy="8" r="6" fill="none" strokeWidth="1.6" className="stroke-foreground/15" />
                  <circle data-ring="" cx="8" cy="8" r="6" fill="none" strokeWidth="1.6" pathLength={1} className="scene-ring" />
                </svg>
              </button>
            ))}
            <span aria-hidden className="absolute -bottom-px left-0 h-0.5 w-1/3 bg-foreground transition-transform duration-500 ease-(--ease-lift)" style={{ transform: `translateX(${(ended ? ACTS.length - 1 : act) * 100}%)` }} />
          </div>
        </div>
      </div>

      {/* After Care: the closing line and the call to action, framed by two lines sliding in. The brief section
          below asks "What do you have in mind?", so this says something of its own and points there. */}
      {ended && (
        <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center px-6 max-md:items-end max-md:pb-32">
          <span aria-hidden className="scene-cta-line absolute top-1/2 left-0 h-px w-[18%] bg-foreground/20 max-md:hidden" />
          <span aria-hidden className="scene-cta-line right absolute top-1/2 right-0 h-px w-[18%] bg-foreground/20 max-md:hidden" />
          <div className="scene-cta pointer-events-auto grid max-w-md justify-items-center gap-4 text-center">
            <p className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">Yours could be next.</p>
            <p className="text-muted-foreground">From the first idea to launch, and every day after. Tell us what you&apos;re building.</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <a href="#brief" className="btn-light inline-flex h-11 items-center px-5 font-medium">Start a project</a>
              <button type="button" onClick={() => go(0)} className="inline-flex h-11 items-center rounded-(--radius) border border-border px-5 text-sm hover:bg-foreground/5">Watch again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
