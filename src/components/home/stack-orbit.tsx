"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { siGmail, siGooglecalendar, siGooglemeet, siHubspot, siNotion, siStripe, siZoom, type SimpleIcon } from "simple-icons"

import { BotlaneMark } from "@/components/site/botlane-mark"
import { appTile } from "@/lib/app-tile"
import { cn } from "@/lib/utils"

// Only apps our work really connects to: the automation service names Gmail, Stripe, HubSpot and Notion,
// and Syncc syncs Google Calendar with Meet or Zoom links. Seven, one for each place on the track below.
// Logos from Simple Icons; each mark belongs to its owner.
const APPS: SimpleIcon[] = [siGmail, siStripe, siHubspot, siGooglecalendar, siNotion, siZoom, siGooglemeet]

// How long each app stays connected before the next one moves in.
const STEP_MS = 1800

// The track is one arc of a circle whose centre sits above the stage, in units of --u from the stage's
// centre: it passes through the capsule's lower slot at its lowest point. Each place is an angle on it,
// and an app moves by turning its angle, so it travels along the curve rather than across it.
const ARC = { cy: -33.2, r: 35.9 }
// 0 is the capsule's slot; ±1 and ±2 sit on the arc either side; ±3 are just past the ends, where an app
// fades in or out.
const TRACK: Record<number, { deg: number; show: number; scale: number }> = {
  [-3]: { deg: -62, show: 0, scale: 0.8 },
  [-2]: { deg: -42, show: 0.75, scale: 0.9 },
  [-1]: { deg: -22, show: 1, scale: 1 },
  0: { deg: 0, show: 1, scale: 1 },
  1: { deg: 22, show: 1, scale: 1 },
  2: { deg: 42, show: 0.75, scale: 0.9 },
  3: { deg: 62, show: 0, scale: 0.8 },
}

// The arc as a path, between ±75° so its ends run off the stage: one curve, no joins.
const arcPoint = (deg: number) => {
  const a = (deg * Math.PI) / 180
  return `${(ARC.r * Math.sin(a)).toFixed(2)} ${(ARC.cy + ARC.r * Math.cos(a)).toFixed(2)}`
}
const ARC_PATH = `M ${arcPoint(-75)} A ${ARC.r} ${ARC.r} 0 0 0 ${arcPoint(75)}`

/** Where an app sits on the arc at angle `deg`, in units of --u from the stage's centre. */
const at = (deg: number) => {
  const a = (deg * Math.PI) / 180
  return [ARC.r * Math.sin(a), ARC.cy + ARC.r * Math.cos(a)] as const
}
const place = (deg: number) => {
  const [x, y] = at(deg)
  return `calc(-50% + var(--u) * ${x.toFixed(3)}) calc(-50% + var(--u) * ${y.toFixed(3)})`
}
// The 700ms lift every discrete move on the site uses: quick away, long soft landing.
const lift = (t: number) => {
  // cubic-bezier(0.32, 0.72, 0, 1), solved for x by Newton's method.
  const bx = (u: number) => 3 * 0.32 * u * (1 - u) ** 2 + 3 * 0 * u * u * (1 - u) + u ** 3
  const by = (u: number) => 3 * 0.72 * u * (1 - u) ** 2 + 3 * 1 * u * u * (1 - u) + u ** 3
  let u = t
  for (let i = 0; i < 6; i++) {
    const d = (bx(u + 1e-4) - bx(u - 1e-4)) / 2e-4
    if (Math.abs(d) < 1e-6) break
    u = Math.min(1, Math.max(0, u - (bx(u) - t) / d))
  }
  return by(u)
}
const MOVE_MS = 700

/** Where app `i` sits at step `step`: the one at 0 is in the capsule, the rest wrap round the track. */
const placeOf = (i: number, step: number) => ((((i - step) % APPS.length) + APPS.length + 3) % APPS.length) - 3

/**
 * Our work and the apps it connects to, after the "Works With Your Existing Stack" reference: a capsule in
 * the middle holds the Botlane mark above a slot, and the apps travel along one hairline arc, one at a
 * time moving into the slot and lighting the capsule's edge as it lands. Decorative: the words beside it
 * name the apps. Pauses off screen and in a hidden tab, and holds still under reduced motion. Sized by --u.
 */
export function StackOrbit({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const apps = useRef<(HTMLDivElement | null)[]>([])
  const angle = useRef<number[]>(APPS.map((_, i) => TRACK[placeOf(i, 0)].deg))
  const [step, setStep] = useState(0)

  // Each move turns every app along the arc, frame by frame, writing its position directly. Safari doesn't redraw
  // a position computed from an animating custom property, so the curve is walked here instead of in CSS. A layout
  // effect, and the first frame drawn at once, so each app is back at its old place before the browser paints.
  useLayoutEffect(() => {
    const from = angle.current.slice()
    const to = APPS.map((_, i) => TRACK[placeOf(i, step)].deg)
    let raf = 0
    const start = performance.now()
    const frame = (now: number) => {
      const k = lift(Math.min(1, (now - start) / MOVE_MS))
      APPS.forEach((_, i) => {
        // An app wrapping from one end to the other does so while hidden, at once.
        const deg = to[i] > from[i] ? to[i] : from[i] + (to[i] - from[i]) * k
        angle.current[i] = deg
        const el = apps.current[i]
        if (el) el.style.translate = place(deg)
      })
      if (k < 1) raf = requestAnimationFrame(frame)
    }
    frame(start)
    return () => cancelAnimationFrame(raf)
  }, [step])

  useEffect(() => {
    const el = root.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer = 0, visible = false
    const run = () => {
      window.clearInterval(timer)
      if (visible && !document.hidden) timer = window.setInterval(() => setStep((s) => s + 1), STEP_MS)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run() })
    io.observe(el)
    document.addEventListener("visibilitychange", run)
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", run); window.clearInterval(timer) }
  }, [])

  return (
    <div
      ref={root}
      aria-hidden
      className={cn("relative isolate h-[calc(var(--u)*26)] w-full overflow-hidden [--u:0.5rem] sm:[--u:0.72rem] lg:[--u:1rem]", className)}
    >
      {/* One stage, 72 by 26 units, centred: the hairlines and the apps share its coordinates at every size. */}
      <div className="absolute inset-y-0 left-1/2 w-[calc(var(--u)*72)] -translate-x-1/2">
      {/* Light behind: two soft diagonal streaks of the accent, fading out at the edges, as in the tool cluster. */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(closest-side,#000,transparent)]">
        <div className="absolute top-[26%] left-[18%] h-[22%] w-[70%] -rotate-[18deg] rounded-full bg-[color-mix(in_oklch,var(--brand)_calc(var(--glow)*55%),transparent)] blur-3xl" />
        <div className="absolute top-[52%] left-[30%] h-[12%] w-[55%] -rotate-[18deg] rounded-full bg-[color-mix(in_oklch,var(--brand)_calc(var(--glow)*35%),transparent)] blur-2xl" />
      </div>

      {/* The hairline the apps travel along: one arc through every place, passing behind the capsule. */}
      <svg viewBox="-36 -13 72 26" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 -z-10 size-full" fill="none" strokeWidth={0.07}>
        <path d={ARC_PATH} style={{ stroke: "rgb(var(--ink) / 0.16)" }} />
      </svg>

      {/* The capsule: a glass pill with an accent edge and a dashed inner line, the mark above the slot. */}
      <div className="absolute top-1/2 left-1/2 -z-[5] h-[calc(var(--u)*11.6)] w-[calc(var(--u)*5.8)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_oklch,var(--brand)_55%,transparent)] bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha)),0_0_40px_-12px_color-mix(in_oklch,var(--brand)_calc(var(--glow)*80%),transparent),var(--shadow-lift)]">
        <span className="absolute inset-[calc(var(--u)*0.4)] rounded-full border border-dashed border-[color-mix(in_oklch,var(--brand)_35%,transparent)]" />
        {/* A flash of the accent round the edge each time an app lands; restarted by its key. */}
        <span key={step} className="absolute -inset-px rounded-full border border-[var(--brand)] opacity-0 [animation:orbit-land_900ms_var(--ease-soft)_300ms] motion-reduce:hidden" />
        {/* The mark's button stays dark with the light mark in both themes: `dark` scopes the dark tokens to it. */}
        <span className="dark tile-depth absolute top-[calc(var(--u)*1.4)] left-1/2 size-[calc(var(--u)*3.4)] -translate-x-1/2 rounded-full!">
          <BotlaneMark size={30} id="orbit-mark" className="size-[52%]" />
        </span>
      </div>

      {/* The apps, each on its place on the track. The one wrapping from end to end does so while hidden. */}
      {APPS.map((app, i) => {
        const p = placeOf(i, step)
        const spot = TRACK[p]
        const docked = p === 0
        return (
          <div
            key={app.slug}
            ref={(el) => { apps.current[i] = el }}
            className="absolute top-1/2 left-1/2 grid size-[calc(var(--u)*5)] place-items-center rounded-full transition-[scale,opacity] duration-700 ease-(--ease-lift)"
            style={{
              // Its place on the arc. The effect above moves it between places; this is where it starts.
              translate: place(spot.deg),
              scale: spot.scale,
              opacity: spot.show,
              transitionDuration: p === 3 ? "0ms" : undefined,
            }}
          >
            <span data-lit={docked ? "" : undefined} className="tile-app size-[calc(var(--u)*3.6)] rounded-full [--tile-base:var(--background)]" style={appTile(app.hex)}>
              <svg viewBox="0 0 24 24" className="size-[42%]">
                <path d={app.path} />
              </svg>
            </span>
          </div>
        )
      })}
      </div>
    </div>
  )
}
