import type { LaneId } from "@/lib/lanes"

/*
 * Small drawings for the Products menu, one per product, in the product's own colour (the card sets --h-solid
 * and friends through data-hue). Decorative: the card's words say what each product is. They brighten when
 * their card is hovered (group/p).
 */

/** Syncc: a week of slots, one booked and glowing. */
function Calendar() {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from({ length: 15 }, (_, i) => (
        <span
          key={i}
          className={i === 6 ? "nav-art-lit size-5 rounded-md" : "size-5 rounded-md bg-foreground/[0.07] transition-colors duration-500 group-hover/p:bg-foreground/[0.1]"}
          style={i === 6 ? undefined : { transitionDelay: `${(i % 5) * 30}ms` }}
        />
      ))}
    </div>
  )
}

/** Scriblane: a page turning into checked fields. */
function Document() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-[4.5rem] w-14 content-start gap-1.5 rounded-md border border-foreground/15 bg-foreground/[0.06] p-2">
        {[100, 70, 100, 55, 85].map((w, i) => <span key={i} className="h-[3px] rounded-full bg-foreground/25" style={{ width: `${w}%` }} />)}
      </span>
      <svg viewBox="0 0 26 14" className="w-6 text-(--h-text) transition-transform duration-500 ease-(--ease-lift) group-hover/p:translate-x-1" fill="none"><path d="M0 7h22M17 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      <span className="grid gap-1.5">
        <span className="nav-art-lit h-3.5 w-16 rounded" />
        <span className="h-3.5 w-16 rounded bg-foreground/[0.08]" />
        <span className="h-3.5 w-16 rounded bg-foreground/[0.08]" />
      </span>
    </div>
  )
}

/** Flowlane: one trigger, two paths, one result. */
function Flow() {
  return (
    <svg viewBox="0 0 200 90" className="w-44" fill="none">
      <path d="M30 45 C 70 45, 70 15, 100 15 M30 45 C 70 45, 70 75, 100 75 M100 15 C 130 15, 130 45, 170 45 M100 75 C 130 75, 130 45, 170 45" stroke="var(--h-text)" strokeOpacity="0.55" strokeWidth="1.5" />
      <path d="M30 45 C 70 45, 70 15, 100 15 C 130 15, 130 45, 170 45" pathLength={1} stroke="var(--h-solid)" strokeWidth="2" strokeLinecap="round" className="nav-art-run" />
      <circle cx="30" cy="45" r="8" fill="var(--popover)" stroke="var(--h-text)" />
      <circle cx="100" cy="15" r="8" fill="var(--popover)" stroke="currentColor" strokeOpacity="0.3" />
      <circle cx="100" cy="75" r="8" fill="var(--popover)" stroke="currentColor" strokeOpacity="0.3" />
      <circle cx="170" cy="45" r="8" fill="var(--h-solid)" />
    </svg>
  )
}

export function ProductArt({ id }: { id: LaneId }) {
  return id === "syncc" ? <Calendar /> : id === "scriblane" ? <Document /> : <Flow />
}
