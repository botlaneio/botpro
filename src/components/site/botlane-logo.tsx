import { B, B_VIEWBOX, bOptical } from "./botlane-b"

/**
 * The Botlane logo as a React component: the "b" (botlane-b.ts) alone, or the lockup with the "botLane" name beside it.
 * Everything is drawn in the current text colour, so it follows the theme and any tile it sits on.
 *
 *   <BotlaneLogo />                        lockup, 28px mark
 *   <BotlaneLogo variant="mark" size={16} />  the b alone; below 24px it uses its small optical size
 *   <BotlaneLogo className="text-white" />  any colour, via currentColor
 *
 * `size` is the mark's height in px; the name is set in the site's sans at a size that matches the b's height.
 * The component carries one accessible name (`label`); pass `decorative` when visible text beside it already says it.
 */
export type BotlaneLogoProps = {
  variant?: "mark" | "lockup"
  size?: number
  label?: string
  decorative?: boolean
  className?: string
}

export function BotlaneLogo({ variant = "lockup", size = 28, label = "botLane", decorative = false, className }: BotlaneLogoProps) {
  const a11y = decorative ? { "aria-hidden": true as const } : { role: "img", "aria-label": label }
  const mark = (
    <svg width={size} height={size} viewBox={B_VIEWBOX} className="shrink-0" aria-hidden>
      <path d={B[bOptical(size)]} fill="currentColor" fillRule="evenodd" />
    </svg>
  )

  if (variant === "mark") {
    return (
      <svg width={size} height={size} viewBox={B_VIEWBOX} className={className ? `shrink-0 ${className}` : "shrink-0"} {...a11y}>
        <path d={B[bOptical(size)]} fill="currentColor" fillRule="evenodd" />
      </svg>
    )
  }

  return (
    <span className={className ? `inline-flex items-center ${className}` : "inline-flex items-center"} style={{ gap: Math.round(size * 0.18) }} {...a11y}>
      {mark}
      <span aria-hidden className="font-semibold tracking-[-0.035em]" style={{ fontSize: Math.round(size * 0.82), lineHeight: 1 }}>
        botLane
      </span>
    </span>
  )
}
