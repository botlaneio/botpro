import { cn } from "@/lib/utils"

export type ActivityTone = "green" | "orange" | "red"

/**
 * A status dot with a ring that pulses out from it, after Framer's ActivityBadge: the dot glows faintly, and
 * every 1.3 seconds a ring of the same colour appears at full size and spreads out as it fades. Green says
 * available, orange busy, red away. The label is read out; pass `label={undefined}` and put visible words beside
 * it instead when there are some. Under reduced motion the ring doesn't pulse.
 */
export function ActivityBadge({ tone = "green", label, className }: { tone?: ActivityTone; label?: string; className?: string }) {
  return (
    <span role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} data-tone={tone} className={cn("activity relative inline-block size-2 shrink-0", className)}>
      <span className="activity-ring absolute inset-0 rounded-full" />
      <span className="activity-dot absolute inset-0 rounded-full" />
    </span>
  )
}
