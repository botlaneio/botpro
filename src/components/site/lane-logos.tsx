import type { LaneId } from "@/lib/lanes"

import { CAL, CAL_VIEWBOX, SLOT_LIGHT } from "./slotlane-cal"
import { D, D_VIEWBOX, ORCHID, dOptical } from "./dotlane-d"
import { P, P_VIEWBOX, VIOLET, pOptical } from "./spotlane-p"

/**
 * The three product logos as React components, with the same API and proportions as BotlaneLogo:
 *
 *   <LaneLogo id="spotlane" />                      lockup, 28px mark
 *   <LaneLogo id="dotlane" variant="mark" size={20} />  the mark alone
 *   <SlotlaneMark className="size-5" />              one mark, sized by CSS (drop-in for an icon)
 *
 * Letters and outlines use the current text colour; each accent uses its lane token, falling back to the brand hex,
 * so the logos follow the theme. `size` is the mark's height in px and picks the optical size (below 24px: small).
 */
type MarkProps = { size?: number; className?: string; label?: string; decorative?: boolean }

const a11yOf = (label: string, decorative?: boolean) => (decorative ? { "aria-hidden": true as const } : { role: "img", "aria-label": label })
const cls = (className?: string) => (className ? `shrink-0 ${className}` : "shrink-0")

export function SlotlaneMark({ size = 20, className, label = "slotLane", decorative = true }: MarkProps) {
  const f = CAL.frame
  return (
    <svg width={size} height={size} viewBox={CAL_VIEWBOX} className={cls(className)} {...a11yOf(label, decorative)}>
      <rect x={f.x} y={f.y} width={f.width} height={f.height} rx={f.rx} fill="none" stroke="currentColor" strokeWidth={f.strokeWidth} />
      {CAL.rings.map((r) => <rect key={r.x} {...r} fill="currentColor" />)}
      <rect {...CAL.slot} style={{ fill: `var(--slotlane-slot, ${SLOT_LIGHT})` }} />
    </svg>
  )
}

export function SpotlaneMark({ size = 20, className, label = "spotLane", decorative = true }: MarkProps) {
  const p = P[pOptical(size)]
  return (
    <svg width={size} height={size} viewBox={P_VIEWBOX} className={cls(className)} {...a11yOf(label, decorative)}>
      <path d={p.letter} fill="currentColor" fillRule="evenodd" />
      <path d={p.square} style={{ fill: `var(--violet-solid, ${VIOLET})` }} />
    </svg>
  )
}

export function DotlaneMark({ size = 20, className, label = "dotLane", decorative = true }: MarkProps) {
  const d = D[dOptical(size)]
  return (
    <svg width={size} height={size} viewBox={D_VIEWBOX} className={cls(className)} {...a11yOf(label, decorative)}>
      <path d={d.letter} fill="currentColor" fillRule="evenodd" />
      <circle cx={d.dot.cx} cy={d.dot.cy} r={d.dot.r} style={{ fill: `var(--orchid-solid, ${ORCHID})` }} />
    </svg>
  )
}

/** Each lane's mark, keyed like LANES: a drop-in for the icon maps that used to stand in for them. */
export const LANE_MARKS: Record<LaneId, React.ComponentType<MarkProps>> = {
  slotlane: SlotlaneMark,
  spotlane: SpotlaneMark,
  dotlane: DotlaneMark,
}
const NAMES: Record<LaneId, string> = { slotlane: "slotLane", spotlane: "spotLane", dotlane: "dotLane" }

export function LaneLogo({ id, variant = "lockup", size = 28, label = NAMES[id], decorative = false, className }: { id: LaneId; variant?: "mark" | "lockup"; size?: number; label?: string; decorative?: boolean; className?: string }) {
  const Mark = LANE_MARKS[id]
  if (variant === "mark") return <Mark size={size} className={className} label={label} decorative={decorative} />
  return (
    <span className={className ? `inline-flex items-center ${className}` : "inline-flex items-center"} style={{ gap: Math.round(size * 0.18) }} {...a11yOf(label, decorative)}>
      <Mark size={size} />
      <span aria-hidden className="font-semibold tracking-[-0.035em]" style={{ fontSize: Math.round(size * 0.82), lineHeight: 1 }}>
        {NAMES[id]}
      </span>
    </span>
  )
}
