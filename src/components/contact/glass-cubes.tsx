import { cn } from "@/lib/utils"

const COLS = 11
const ROWS = 9
// Where the light falls on the field of cubes, in tiles: a bright pool right of centre, a softer one lower left.
const LIGHTS = [
  { c: 7.2, r: 3.2, s: 3.4, k: 1 },
  { c: 2.4, r: 6.2, s: 2.8, k: 0.6 },
]

const lightAt = (c: number, r: number) =>
  Math.min(1, LIGHTS.reduce((sum, l) => sum + l.k * Math.exp(-((c - l.c) ** 2 + (r - l.r) ** 2) / (2 * l.s ** 2)), 0))

/**
 * A field of frosted glass cubes seen from above at an angle, lit red from within: the backdrop of the
 * contact page. Drawn in CSS: a tilted plane of rounded tiles, each with a lit top face and a dark side,
 * brighter where the light pools, under two slow-drifting glows. Decorative; still under reduced motion.
 */
export function GlassCubes({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("cubes pointer-events-none overflow-hidden", className)}>
      <div className="cubes-plane">
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS
          const r = Math.floor(i / COLS)
          return <span key={i} className="cubes-tile" style={{ "--l": lightAt(c, r).toFixed(3) } as React.CSSProperties} />
        })}
      </div>
      <span className="cubes-glow cubes-glow-a" />
      <span className="cubes-glow cubes-glow-b" />
      <span className="cubes-vignette" />
    </div>
  )
}
