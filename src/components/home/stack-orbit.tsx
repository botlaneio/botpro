"use client"

import { useEffect, useRef, useState } from "react"
import { siGmail, siGooglecalendar, siGooglemeet, siHubspot, siNotion, siStripe, siZoom, type SimpleIcon } from "simple-icons"

import { BotlaneMark } from "@/components/site/botlane-mark"
import { cn } from "@/lib/utils"

// Only apps our work really connects to: the automation service names Gmail, Stripe, HubSpot and Notion,
// and Syncc syncs Google Calendar with Meet or Zoom links. Seven, one for each place on the track below.
// Logos from Simple Icons; each mark belongs to its owner.
const APPS: SimpleIcon[] = [siGmail, siStripe, siHubspot, siGooglecalendar, siNotion, siZoom, siGooglemeet]

// How long each app stays connected before the next one moves in.
const STEP_MS = 1800

// Near-black marks would vanish on a dark tile, so they take the text colour instead of their own.
function inkFor(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18 ? "currentColor" : `#${hex}`
}

// The track the apps travel along, right to left, in units of --u from the centre. 0 is the capsule's
// lower slot; ±1 and ±2 sit on an arc either side; ±3 are just past the ends, where an app fades in or out.
const TRACK: Record<number, { x: number; y: number; show: number; scale: number }> = {
  [-3]: { x: -31, y: -11, show: 0, scale: 0.8 },
  [-2]: { x: -24, y: -6.5, show: 0.75, scale: 0.9 },
  [-1]: { x: -13.5, y: 2.6, show: 1, scale: 1 },
  0: { x: 0, y: 2.7, show: 1, scale: 1 },
  1: { x: 13.5, y: 2.6, show: 1, scale: 1 },
  2: { x: 24, y: -6.5, show: 0.75, scale: 0.9 },
  3: { x: 31, y: -11, show: 0, scale: 0.8 },
}

/** Where app `i` sits at step `step`: the one at 0 is in the capsule, the rest wrap round the track. */
const placeOf = (i: number, step: number) => ((((i - step) % APPS.length) + APPS.length + 3) % APPS.length) - 3

/**
 * Our work and the apps it connects to, after the "Works With Your Existing Stack" reference: a capsule in
 * the middle holds the Botlane mark above a slot, and the apps travel along an arc of hairlines, one at a
 * time moving into the slot and lighting the capsule's edge as it lands. Decorative: the words beside it
 * name the apps. Pauses off screen and in a hidden tab, and holds still under reduced motion. Sized by --u.
 */
export function StackOrbit({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)

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

      {/* The hairlines the apps travel along, from each end of the arc into the capsule. */}
      <svg viewBox="-36 -13 72 26" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 -z-10 size-full" fill="none" strokeWidth={0.07}>
        <path d="M-24 -6.5 C -20 -1, -17 2.6, -13.5 2.6 S -6 4.5, -2.8 4.5" style={{ stroke: "rgb(var(--ink) / 0.16)" }} />
        <path d="M24 -6.5 C 20 -1, 17 2.6, 13.5 2.6 S 6 4.5, 2.8 4.5" style={{ stroke: "rgb(var(--ink) / 0.16)" }} />
      </svg>

      {/* The capsule: a glass pill with an accent edge and a dashed inner line, the mark above the slot. */}
      <div className="absolute top-1/2 left-1/2 -z-[5] h-[calc(var(--u)*11.6)] w-[calc(var(--u)*5.8)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_oklch,var(--brand)_55%,transparent)] bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha)),0_0_40px_-12px_color-mix(in_oklch,var(--brand)_calc(var(--glow)*80%),transparent),var(--shadow-lift)]">
        <span className="absolute inset-[calc(var(--u)*0.4)] rounded-full border border-dashed border-[color-mix(in_oklch,var(--brand)_35%,transparent)]" />
        {/* A flash of the accent round the edge each time an app lands; restarted by its key. */}
        <span key={step} className="absolute -inset-px rounded-full border border-[var(--brand)] opacity-0 [animation:orbit-land_900ms_var(--ease-soft)_300ms] motion-reduce:hidden" />
        <span className="tile-depth absolute top-[calc(var(--u)*1.4)] left-1/2 size-[calc(var(--u)*3.4)] -translate-x-1/2 rounded-full!">
          <BotlaneMark size={30} id="orbit-mark" className="size-[52%]" />
        </span>
      </div>

      {/* The apps, each on its place on the track. The one wrapping from end to end does so while hidden. */}
      {APPS.map((app, i) => {
        const p = placeOf(i, step)
        const at = TRACK[p]
        const docked = p === 0
        return (
          <div
            key={app.slug}
            className="absolute top-1/2 left-1/2 grid size-[calc(var(--u)*5)] place-items-center rounded-full transition-[translate,scale,opacity] duration-700 ease-(--ease-lift)"
            style={{
              translate: `calc(-50% + var(--u) * ${at.x}) calc(-50% + var(--u) * ${at.y})`,
              scale: at.scale,
              opacity: at.show,
              transitionDuration: p === 3 ? "0ms" : undefined,
            }}
          >
            {/* The well: a glass ring round the tile, which the capsule's own slot replaces once docked. */}
            <span
              className={cn(
                "absolute inset-0 rounded-full border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.03))] bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha))] transition-opacity duration-500",
                docked && "opacity-0",
              )}
            />
            <span className="tile-depth relative size-[calc(var(--u)*3.4)] rounded-full! text-foreground">
              <svg viewBox="0 0 24 24" className="size-[48%]">
                <path d={app.path} fill={inkFor(app.hex)} />
              </svg>
            </span>
          </div>
        )
      })}
      </div>
    </div>
  )
}
