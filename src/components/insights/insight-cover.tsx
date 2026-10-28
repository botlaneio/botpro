import type { Post } from "@/lib/insights"
import { cn } from "@/lib/utils"

const ink = (a: number) => ({ stroke: `rgb(var(--ink) / ${a})` })

/**
 * A post's cover: no photograph, a small hairline composition in the site's finishes, with the page's red
 * ambient light falling across it. "grid" is a scope laid out in squares with one lit, "lines" is many paths gathering
 * into one, "orbit" is rings round a point. Decorative; the post's title says what it is.
 */
export function InsightCover({ variant, topic, className }: { variant: Post["cover"]; topic: string; className?: string }) {
  return (
    <div aria-hidden className={cn("relative isolate overflow-hidden rounded-2xl border border-[rgb(var(--ink)/var(--edge-alpha))] bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)]", className)}>
      {/* A dot grid, faded towards the edges. */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(var(--ink)/0.13)_1px,transparent_1.2px)] [background-size:14px_14px] [mask-image:radial-gradient(75%_75%_at_50%_45%,#000,transparent)]" />
      {/* The page's red light, falling from the upper right. */}
      <div className="absolute -top-1/3 -right-1/4 -z-10 h-[90%] w-[80%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--ambient)_calc(var(--glow)*30%),transparent),transparent)] blur-2xl" />

      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" fill="none">
        {variant === "grid" && <Grid />}
        {variant === "lines" && <Lines />}
        {variant === "orbit" && <Orbit />}
      </svg>

      <span className="label-mono absolute bottom-4 left-5 text-[10.5px]">{topic.toUpperCase()}</span>
    </div>
  )
}

/** A scope in squares: four by three, each drawn in hairline, one lit in the accent with a tick. */
function Grid() {
  const cols = 4, rows = 3, size = 74, gap = 14
  const x0 = 400 - (cols * size + (cols - 1) * gap) / 2, y0 = 250 - (rows * size + (rows - 1) * gap) / 2
  return (
    <g strokeWidth={1}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = x0 + (i % cols) * (size + gap), y = y0 + Math.floor(i / cols) * (size + gap)
        const lit = i === 6
        return lit ? (
          <g key={i}>
            <rect x={x} y={y} width={size} height={size} rx={14} style={{ fill: "color-mix(in oklch, var(--brand) 18%, transparent)", stroke: "var(--brand)" }} />
            <path d={`M${x + 26} ${y + 38} l8 8 l15 -17`} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--brand)" }} />
          </g>
        ) : (
          <rect key={i} x={x} y={y} width={size} height={size} rx={14} style={{ fill: "var(--background)", ...ink(i % 3 === 0 ? 0.2 : 0.12) }} />
        )
      })}
      {/* A line under the grid, like a total. */}
      <path d={`M${x0} ${y0 + rows * (size + gap) + 10} H${800 - x0}`} style={ink(0.22)} />
      <path d={`M${800 - x0 - 90} ${y0 + rows * (size + gap) + 10} H${800 - x0}`} strokeWidth={2} style={{ stroke: "var(--brand)" }} />
    </g>
  )
}

/** Many paths from the left, gathering into one point on the right, which glows. */
function Lines() {
  const ends = [70, 130, 190, 250, 310, 370, 430]
  return (
    <g strokeWidth={1}>
      {ends.map((y, i) => (
        <path key={y} d={`M-10 ${y} C 260 ${y}, 360 250, 560 250`} style={ink(i === 3 ? 0 : 0.1 + Math.abs(3 - i) * 0.03)} />
      ))}
      <path d="M-10 250 C 260 250, 360 250, 560 250" strokeWidth={1.6} style={{ stroke: "var(--brand)" }} />
      <path d="M560 250 H810" strokeWidth={1.6} style={{ stroke: "var(--brand)", opacity: 0.55 }} />
      <circle cx={560} cy={250} r={26} style={{ fill: "color-mix(in oklch, var(--brand) 16%, transparent)" }} />
      <circle cx={560} cy={250} r={7} style={{ fill: "var(--brand)" }} />
    </g>
  )
}

/** Rings round a point, with one small body on the outer ring. */
function Orbit() {
  return (
    <g strokeWidth={1}>
      {[60, 110, 170, 240].map((r, i) => <circle key={r} cx={400} cy={250} r={r} style={ink(0.2 - i * 0.035)} />)}
      <circle cx={400} cy={250} r={10} style={{ fill: "var(--brand)" }} />
      <circle cx={570} cy={80} r={6} style={{ fill: "var(--foreground)" }} />
    </g>
  )
}
