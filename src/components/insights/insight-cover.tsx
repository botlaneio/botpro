import type { Post } from "@/lib/insights"
import { cn } from "@/lib/utils"

const LIT = "#A6CDFF"
const glow = (a = 1) => ({ filter: `drop-shadow(0 0 2px rgb(255 255 255 / ${0.5 * a})) drop-shadow(0 0 10px rgb(48 96 176 / ${0.8 * a}))` })
const hair = (a: number) => ({ stroke: `rgb(255 255 255 / ${a})` })

/**
 * A post's cover: no photograph, a hairline composition lit like the hero, white lines glowing blue in the dark.
 * Always dark, in either theme, so the light reads. "grid" is a scope in squares with one lit, "lines" is many
 * paths gathering into one with a glint running along it, "orbit" is rings round a point with a body turning on
 * the outer ring. Decorative; the post's title says what it is. Its parent can mark itself `group/cover` to
 * brighten it on hover.
 */
export function InsightCover({ variant, topic, label = true, side = false, className }: { variant: Post["cover"]; topic: string; label?: boolean; /** From md, draw the art in the right part only, leaving the left for words. */ side?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn("cover dark relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-[#08080a]", className)}>
      {/* The blue light, pooling from the upper right, and a softer one low on the left. */}
      <div className="cover-light absolute -top-[35%] -right-[20%] -z-10 h-[110%] w-[80%] rounded-full bg-[radial-gradient(closest-side,rgb(48_96_176/0.55),rgb(15_39_80/0.2)_60%,transparent)] blur-2xl transition-opacity duration-700" />
      <div className="absolute -bottom-[40%] -left-[15%] -z-10 h-[80%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(26_63_120/0.35),transparent)] blur-2xl" />
      {/* A fine dot grid, faded towards the edges. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1.2px)] [background-size:16px_16px] [mask-image:radial-gradient(70%_70%_at_50%_45%,#000,transparent)]" />

      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className={cn("absolute inset-0 size-full transition-transform", side && "max-md:top-[-18%] max-md:h-[70%] md:left-auto md:w-[58%]", " duration-[1200ms] ease-(--ease-lift) group-hover/cover:scale-[1.04]")} fill="none">
        {variant === "grid" && <Grid />}
        {variant === "lines" && <Lines />}
        {variant === "orbit" && <Orbit />}
      </svg>

      {/* A sheen across the glass, and a hairline highlight on the top edge. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgb(255_255_255/0.05)_50%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.25),transparent)]" />

      {label && <span className="label-mono absolute bottom-4 left-5 text-[10.5px] text-white/55">{topic.toUpperCase()}</span>}
    </div>
  )
}

/** A scope in squares: five by three in hairline, one lit and glowing, with a tick. */
function Grid() {
  const cols = 5, rows = 3, size = 70, gap = 14
  const x0 = 400 - (cols * size + (cols - 1) * gap) / 2, y0 = 240 - (rows * size + (rows - 1) * gap) / 2
  const lit = 7
  return (
    <g strokeWidth={1}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = x0 + (i % cols) * (size + gap), y = y0 + Math.floor(i / cols) * (size + gap)
        return i === lit ? (
          <g key={i} className="cover-pulse" style={glow()}>
            <rect x={x} y={y} width={size} height={size} rx={16} style={{ fill: "rgb(48 96 176 / 0.28)", stroke: LIT }} strokeWidth={1.4} />
            <path d={`M${x + 24} ${y + 36} l8 8 l15 -17`} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" stroke="#fff" />
          </g>
        ) : (
          <rect key={i} x={x} y={y} width={size} height={size} rx={16} style={{ fill: "rgb(255 255 255 / 0.015)", ...hair(i % 4 === 0 ? 0.2 : 0.11) }} />
        )
      })}
      {/* A line under the grid, like a total, with its end lit. */}
      <path d={`M${x0} ${y0 + rows * (size + gap) + 12} H${800 - x0}`} style={hair(0.18)} />
      <path d={`M${800 - x0 - 110} ${y0 + rows * (size + gap) + 12} H${800 - x0}`} strokeWidth={1.8} stroke="#fff" strokeLinecap="round" style={glow()} />
    </g>
  )
}

/** Many paths from the left, gathering into one glowing point; a glint runs along the one that carries on. */
function Lines() {
  const ends = [60, 120, 180, 250, 320, 380, 440]
  const main = "M-10 250 C 260 250, 360 250, 560 250 H 820"
  return (
    <g strokeWidth={1}>
      {ends.map((y, i) => (
        y !== 250 && <path key={y} d={`M-10 ${y} C 260 ${y}, 360 250, 560 250`} style={hair(0.08 + (3 - Math.abs(3 - i)) * 0.035)} />
      ))}
      <path d={main} strokeWidth={1.6} stroke="rgb(225 238 255 / 0.75)" strokeLinecap="round" style={glow(0.8)} />
      <path d={main} pathLength={1} strokeWidth={2.6} stroke="#fff" strokeLinecap="round" className="cover-glint" style={glow()} />
      <circle cx={560} cy={250} r={34} style={{ fill: "rgb(48 96 176 / 0.22)" }} />
      <circle cx={560} cy={250} r={7} fill="#fff" style={glow()} />
    </g>
  )
}

/** Rings round a lit point, with one small body turning on the outer ring. */
function Orbit() {
  return (
    <g strokeWidth={1}>
      {[60, 112, 172, 240].map((r, i) => <circle key={r} cx={400} cy={250} r={r} style={hair(0.22 - i * 0.04)} strokeDasharray={i === 2 ? "2 6" : undefined} />)}
      <circle cx={400} cy={250} r={30} style={{ fill: "rgb(48 96 176 / 0.25)" }} />
      <circle cx={400} cy={250} r={9} fill="#fff" style={glow()} />
      <g className="cover-turn" style={{ transformOrigin: "400px 250px" }}>
        <circle cx={400} cy={10} r={6} fill={LIT} style={glow()} />
      </g>
    </g>
  )
}
