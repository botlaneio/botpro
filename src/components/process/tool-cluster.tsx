import {
  siCloudflare, siDribbble, siFigma, siFramer, siGithub, siGmail, siGoogleanalytics, siGooglecalendar, siGooglechat,
  siGoogledocs, siGooglefonts, siGooglemeet, siGooglesearchconsole, siGooglesheets, siLetsencrypt, siLinear, siLoom,
  siLucide, siMiro, siNextdotjs, siNodedotjs, siNotion, siPostgresql, siReact, siResend, siSentry, siShadcnui, siStripe,
  siSupabase, siTailwindcss, siTrello, siTypescript, siUnsplash, siUptimekuma, siVercel, siVitest, siWhatsapp, siZoom,
  type SimpleIcon,
} from "simple-icons"

import { cn } from "@/lib/utils"

// The tools each step runs on, as nine tiles: five across the top with the step's main tool in the middle,
// four below. Logos from Simple Icons; each mark belongs to its owner.
const SETS: SimpleIcon[][] = [
  [siGmail, siGooglecalendar, siGooglemeet, siZoom, siWhatsapp, siGooglechat, siLoom, siGoogledocs, siNotion],
  [siGooglesheets, siLinear, siNotion, siGoogledocs, siTrello, siMiro, siLoom, siStripe, siGmail],
  [siDribbble, siGooglefonts, siFigma, siFramer, siUnsplash, siLucide, siTailwindcss, siShadcnui, siMiro],
  [siTypescript, siReact, siNextdotjs, siGithub, siPostgresql, siNodedotjs, siTailwindcss, siSupabase, siVitest],
  [siCloudflare, siGoogleanalytics, siVercel, siSentry, siLetsencrypt, siResend, siGooglesearchconsole, siStripe, siUptimekuma],
]

// Near-black marks would vanish on a dark tile, so they take the text colour instead of their own.
function inkFor(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18 ? "currentColor" : `#${hex}`
}

// Where each tile sits, and how far it is from the middle: 0 is the centre, 2 is an edge, faded and blurred.
const SLOTS: { row: 0 | 1; col: number; far: 0 | 1 | 2 }[] = [
  { row: 0, col: 0, far: 2 }, { row: 0, col: 1, far: 1 }, { row: 0, col: 2, far: 0 }, { row: 0, col: 3, far: 1 }, { row: 0, col: 4, far: 2 },
  { row: 1, col: 0.5, far: 2 }, { row: 1, col: 1.5, far: 1 }, { row: 1, col: 2.5, far: 1 }, { row: 1, col: 3.5, far: 2 },
]

const REST = [
  { opacity: 1, filter: "none" },
  { opacity: 0.9, filter: "none" },
  { opacity: 0.32, filter: "blur(3px)" },
]

/**
 * A step's tools as a cluster of app tiles, by their real logos, after the icon dock shared as a reference: the middle ones lit
 * and sharp, the edges fading into blur, with streaks of the accent behind. Every step's cluster is drawn,
 * stacked; changing `step` swaps them tile by tile, rippling out from the centre. Sized by --tile.
 */
export function ToolCluster({ step, className }: { step: number; className?: string }) {
  return (
    <div aria-hidden className={cn("relative isolate [--gap:calc(var(--tile)*0.2)] [--tile:4.5rem]", className)} style={{ height: "calc(var(--tile) * 2 + var(--gap))", width: "calc(var(--tile) * 5 + var(--gap) * 4)" }}>
      {/* Light behind the tiles: two soft diagonal streaks of the accent, fading out at the edges. */}
      <div className="pointer-events-none absolute -inset-[30%] -z-10 [mask-image:radial-gradient(closest-side,#000,transparent)]">
        <div className="absolute top-[18%] left-[30%] h-[22%] w-[90%] -rotate-[35deg] rounded-full bg-[color-mix(in_oklch,var(--brand)_calc(var(--glow)*60%),transparent)] blur-2xl" />
        <div className="absolute top-[46%] left-[8%] h-[12%] w-[80%] -rotate-[35deg] rounded-full bg-[color-mix(in_oklch,var(--brand)_calc(var(--glow)*40%),transparent)] blur-xl" />
      </div>

      {SETS.map((set, s) =>
        SLOTS.map(({ row, col, far }, k) => {
          const logo = set[k]
          const on = s === step
          const centre = far === 0
          return (
            <div
              key={`${s}-${k}`}
              className="absolute grid size-(--tile) place-items-center rounded-[28%] border transition-[opacity,transform,filter] duration-500 ease-(--ease-lift)"
              style={{
                left: `calc(${col} * (var(--tile) + var(--gap)))`,
                top: `calc(${row} * (var(--tile) + var(--gap)))`,
                transitionDelay: on ? `${120 + far * 70}ms` : `${far * 40}ms`,
                transform: on ? "scale(1)" : "scale(0.86)",
                ...(on ? REST[far] : { opacity: 0, filter: "blur(6px)" }),
                borderColor: centre ? "rgb(var(--ink) / calc(var(--edge-alpha) + 0.1))" : "rgb(var(--ink) / calc(var(--edge-alpha) + 0.03))",
                background: "linear-gradient(180deg, var(--glass-top), var(--glass-bottom)), var(--background)",
                boxShadow: centre ? "inset 0 1px 0 rgb(255 255 255 / var(--highlight-alpha)), var(--shadow-lift)" : "inset 0 1px 0 rgb(255 255 255 / var(--highlight-alpha))",
                zIndex: 3 - far,
              }}
            >
              <span className="tile-depth grid size-[66%] place-items-center rounded-[24%]! text-foreground">
                <svg viewBox="0 0 24 24" className={centre ? "size-[52%]" : "size-[46%]"}>
                  <path d={logo.path} fill={inkFor(logo.hex)} />
                </svg>
              </span>
            </div>
          )
        }),
      )}
    </div>
  )
}
