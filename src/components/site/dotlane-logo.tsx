import { D, D_VIEWBOX, ORCHID, dOptical } from "./dotlane-d"

/**
 * The dotLane logo as a React component: the "d" (dotlane-d.ts) alone, or the lockup with the "dotLane" name beside it.
 * Same API and proportions as BotlaneLogo, so the two sit side by side. The letter and the name use the current text
 * colour; the dot uses the orchid lane token (--orchid-solid), falling back to the brand orchid.
 *
 *   <DotlaneLogo />                          lockup, 28px mark
 *   <DotlaneLogo variant="mark" size={16} />  the d alone; below 24px it uses its small optical size
 *
 * `size` is the mark's height in px. The component carries one accessible name (`label`); pass `decorative` when
 * visible text beside it already says it.
 */
export type DotlaneLogoProps = {
  variant?: "mark" | "lockup"
  size?: number
  label?: string
  decorative?: boolean
  className?: string
}

function Mark({ size, className, a11y }: { size: number; className?: string; a11y: Record<string, unknown> }) {
  const d = D[dOptical(size)]
  return (
    <svg width={size} height={size} viewBox={D_VIEWBOX} className={className ? `shrink-0 ${className}` : "shrink-0"} {...a11y}>
      <path d={d.letter} fill="currentColor" fillRule="evenodd" />
      <circle cx={d.dot.cx} cy={d.dot.cy} r={d.dot.r} style={{ fill: `var(--orchid-solid, ${ORCHID})` }} />
    </svg>
  )
}

export function DotlaneLogo({ variant = "lockup", size = 28, label = "dotLane", decorative = false, className }: DotlaneLogoProps) {
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "img", "aria-label": label }

  if (variant === "mark") return <Mark size={size} className={className} a11y={a11y} />

  return (
    <span className={className ? `inline-flex items-center ${className}` : "inline-flex items-center"} style={{ gap: Math.round(size * 0.18) }} {...a11y}>
      <Mark size={size} a11y={{ "aria-hidden": true }} />
      <span aria-hidden className="font-semibold tracking-[-0.035em]" style={{ fontSize: Math.round(size * 0.82), lineHeight: 1 }}>
        dotLane
      </span>
    </span>
  )
}
