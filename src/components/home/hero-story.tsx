"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

// One pass of the story, in seconds: Build, then Launch, then Care, then everything clears and it starts again.
const T = 20
// The still frame shown under reduced motion: the site built, the checks done.
const STILL_AT = 7.6

const ink = (a: number) => ({ stroke: `rgb(var(--ink) / ${a})` })
const label = "font-mono text-[11px] tracking-[0.04em]"

/** A pill-shaped card on the right: a spinner while it works, then a tick. */
function Task({ y, text, at, done, out }: { y: number; text: string; at: number; done: number; out: number }) {
  return (
    <g data-in={`${at} ${at + 0.5}`} data-out={`${out} ${out + 0.6}`} data-rise="">
      <rect x={1110} y={y} width={230} height={34} rx={17} strokeWidth={1} style={{ fill: "var(--background)", ...ink(0.14) }} />
      <g data-in={`${at} ${at + 0.2}`} data-out={`${done} ${done + 0.15}`}>
        <circle cx={1131} cy={y + 17} r={6} fill="none" strokeWidth={1.4} strokeDasharray="22 40" className="[animation:story-spin_0.9s_linear_infinite] [transform-box:fill-box] [transform-origin:center]" style={ink(0.45)} />
      </g>
      <path d={`M1126 ${y + 17} l3.5 3.5 l6.5 -7`} pathLength={1} fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" data-in={`${done} ${done + 0.35}`} data-draw="" style={{ stroke: "var(--brand)" }} />
      <text x={1148} y={y + 21} className={label} style={{ fill: "var(--muted-foreground)" }}>{text}</text>
    </g>
  )
}

/** A small check that settles beside the Care ring. */
function Check({ x, y, text, at }: { x: number; y: number; text: string; at: number }) {
  return (
    <g data-in={`${at} ${at + 0.5}`} data-out={`${T - 1} ${T - 0.3}`} data-rise="">
      <rect x={x} y={y} width={text.length * 7 + 40} height={28} rx={14} strokeWidth={1} style={{ fill: "var(--background)", ...ink(0.14) }} />
      <path d={`M${x + 13} ${y + 14} l3 3 l6 -6.5`} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--brand)" }} />
      <text x={x + 30} y={y + 18} className={label} style={{ fill: "var(--muted-foreground)" }}>{text}</text>
    </g>
  )
}

/**
 * The hero's background story, after the animated hero on Mosey's site: a small silent film of how we work,
 * drawn in hairlines on either side of the prompt bar. Build: a brief arrives, a site assembles itself, and
 * its tasks tick off. Launch: a ring counts to 100% and the site goes live. Care: checks settle round the
 * ring while a dot keeps watch. Tabs along the bottom follow the acts. Every line and card runs on one
 * timeline; it pauses off screen and in a hidden tab, and holds one finished frame under reduced motion.
 */
export function HeroStory({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const root = svg.current
    if (!root) return
    const span = (v: string | null) => (v ? v.split(" ").map(Number) : null)
    const parts = Array.from(root.querySelectorAll<SVGElement>("[data-in], [data-count]")).map((el) => ({
      el,
      inn: span(el.getAttribute("data-in")),
      out: span(el.getAttribute("data-out")),
      count: span(el.getAttribute("data-count")),
    }))
    const ease = (x: number) => x * x * (3 - 2 * x)
    const at = ([s, e]: number[], t: number) => ease(Math.min(1, Math.max(0, (t - s) / (e - s))))
    const paint = (t: number) => {
      for (const { el, inn, out, count } of parts) {
        if (inn) el.style.setProperty("--story-in", String(at(inn, t)))
        if (out) el.style.setProperty("--story-out", String(1 - at(out, t)))
        if (count) el.textContent = `${Math.round(at(count, t) * 100)}%`
      }
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(STILL_AT)
      return
    }
    let raf = 0, last = 0, clock = 0, visible = false
    const tick = (now: number) => {
      if (last) clock = (clock + (now - last) / 1000) % T
      last = now
      paint(clock)
      raf = requestAnimationFrame(tick)
    }
    const run = () => {
      cancelAnimationFrame(raf)
      last = 0
      if (visible && !document.hidden) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run() })
    io.observe(root)
    document.addEventListener("visibilitychange", run)
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", run); cancelAnimationFrame(raf) }
  }, [])

  return (
    <svg
      ref={svg}
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMax slice"
      className={cn("story pointer-events-none select-none", className)}
    >
      {/* Terrain: still hairlines along the bottom edge. */}
      <g fill="none" strokeWidth={1}>
        <path d="M-20 820 C 140 820 180 760 300 760 S 460 830 600 830 S 820 740 960 760 S 1240 840 1460 800" style={ink(0.1)} />
        <path d="M-20 850 C 200 850 260 800 420 805 S 700 870 860 850 S 1120 790 1280 805 S 1400 850 1460 845" style={ink(0.07)} />
        <path d="M-20 790 C 100 800 220 860 380 850 S 640 780 760 790 S 1000 870 1180 860 S 1380 780 1460 770" style={ink(0.06)} />
      </g>

      {/* Act tabs, with an underline that draws across each act. */}
      {([["BUILD", 650, 0, 8], ["LAUNCH", 720, 8, 13], ["CARE", 790, 13, T - 0.4]] as const).map(([name, x, s, e]) => (
        <g key={name}>
          <text x={x} y={872} textAnchor="middle" className={label} style={{ fill: "var(--muted-foreground)" }}>{name}</text>
          <line x1={x - 26} x2={x + 26} y1={884} y2={884} strokeWidth={1} style={ink(0.1)} />
          <line x1={x - 26} x2={x + 26} y1={884} y2={884} pathLength={1} strokeWidth={1.4} data-in={`${s} ${e}`} data-out={`${e} ${e + 0.3}`} data-draw="" style={ink(0.6)} />
        </g>
      ))}

      {/* Act 1 · Build: the brief, a winding line to a browser window, and the window assembling. */}
      <g data-out={`${T - 1} ${T - 0.3}`}>
        <path d="M-10 720 C 90 720 30 620 70 590 S 150 540 110 505 S 80 482 100 470" pathLength={1} fill="none" strokeWidth={1.2} data-in="0.3 2.2" data-draw="" style={ink(0.4)} />
        <g data-in="1.6 2.3" data-rise="">
          <rect x={100} y={244} width={228} height={28} rx={14} style={{ fill: "var(--foreground)" }} />
          <text x={214} y={262} textAnchor="middle" className={label} style={{ fill: "var(--background)" }}>NEW BRIEF · A BOOKING SITE</text>
        </g>
        <g fill="none" strokeWidth={1.2} style={ink(0.4)}>
          <rect x={100} y={296} width={230} height={174} rx={10} pathLength={1} data-in="2.2 3.1" data-draw="" />
          <path d="M100 322 H330" pathLength={1} data-in="3.0 3.4" data-draw="" />
          <rect x={116} y={338} width={198} height={48} rx={5} pathLength={1} data-in="3.4 3.9" data-draw="" />
          {[116, 185, 254].map((x, i) => (
            <rect key={x} x={x} y={400} width={60} height={54} rx={5} pathLength={1} data-in={`${3.9 + i * 0.25} ${4.4 + i * 0.25}`} data-draw="" />
          ))}
        </g>
        {[110, 120, 130].map((x, i) => <circle key={x} cx={x} cy={309} r={2.4} data-in={`${3.1 + i * 0.08} ${3.4 + i * 0.08}`} data-fade="" style={{ fill: `rgb(var(--ink) / ${i === 0 ? 0.5 : 0.25})` }} />)}
        {/* Launch: the site goes live. */}
        <g data-in="11.5 12.1" data-rise="">
          <rect x={176} y={486} width={78} height={26} rx={13} style={{ fill: "var(--background)", ...ink(0.16) }} strokeWidth={1} />
          <circle cx={194} cy={499} r={3.5} style={{ fill: "var(--brand)" }} />
          <text x={204} y={503} className={label} style={{ fill: "var(--foreground)" }}>LIVE</text>
        </g>
      </g>

      {/* Act 1 · Build, right: a red line arrives, and the work ticks off. */}
      <path d="M1460 470 C 1400 470 1420 380 1385 330 S 1352 272 1340 266" pathLength={1} fill="none" strokeWidth={1.4} data-in="4.5 5.3" data-out="7.9 8.5" data-draw="" style={{ stroke: "var(--brand)" }} />
      <Task y={249} text="Scope agreed" at={5.0} done={6.0} out={8.0} />
      <Task y={295} text="Fixed price set" at={5.5} done={6.6} out={8.1} />
      <Task y={341} text="Design approved" at={6.0} done={7.2} out={8.2} />

      {/* Act 2 · Launch: a ring counts to 100%. Act 3 · Care: it keeps watch. */}
      <g data-out={`${T - 1} ${T - 0.3}`}>
        <circle cx={1225} cy={540} r={64} fill="none" strokeWidth={1} data-in="8.4 9.0" data-fade="" style={ink(0.12)} />
        <circle cx={1225} cy={540} r={64} fill="none" strokeWidth={2} strokeLinecap="round" pathLength={1} data-in="9.0 11.5" data-draw="" className="[transform:rotate(-90deg)] [transform-box:fill-box] [transform-origin:center]" style={{ stroke: "var(--brand)" }} />
        <g data-in="9.0 9.4" data-out="12.9 13.4">
          <text x={1225} y={545} textAnchor="middle" data-count="9.0 11.5" className="font-mono text-[22px] tabular-nums" style={{ fill: "var(--foreground)" }}>0%</text>
          <text x={1225} y={568} textAnchor="middle" className={label} style={{ fill: "var(--muted-foreground)" }}>LAUNCH</text>
        </g>
        <g data-in="13.0 13.5">
          <text x={1225} y={545} textAnchor="middle" className={label} style={{ fill: "var(--muted-foreground)" }}>CARE</text>
          <g className="[animation:story-orbit_6s_linear_infinite] [transform-origin:1225px_540px]">
            <circle cx={1225} cy={476} r={3.5} style={{ fill: "var(--brand)" }} />
          </g>
        </g>
      </g>
      <Check x={1292} y={448} text="Uptime" at={13.6} />
      <Check x={1298} y={596} text="Backup" at={14.6} />
      <Check x={1128} y={622} text="Security update" at={15.6} />
    </svg>
  )
}
