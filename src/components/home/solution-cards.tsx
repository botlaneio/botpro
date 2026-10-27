import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { NavItem } from "@/lib/nav"
import { cn } from "@/lib/utils"

/**
 * A card's colours. Every panel is dark, whatever the page's theme; the light in the band above alternates
 * red and silver, so the row has a rhythm and neither colour takes over.
 */
interface Tone {
  frame: string
  panel: string
  ink: string
  muted: string
  light: string
}

// Red and silver, alternating. The second of each comes from the other side, so neighbours never repeat.
const TONES: Tone[] = [
  { frame: "#050506", panel: "#0E0F12", ink: "#EDEEF0", muted: "#8B919C", light: "radial-gradient(120% 140% at 0% 0%, #FF8A8A 0%, #C93636 32%, #2C0B0C 68%, #0E0F12 100%)" },
  { frame: "#050506", panel: "#121418", ink: "#EDEEF0", muted: "#8B919C", light: "radial-gradient(90% 130% at 60% 0%, #DCE6F5 0%, #7E8CA3 30%, #262B33 64%, #121418 100%)" },
  { frame: "#050506", panel: "#101114", ink: "#EDEEF0", muted: "#8B919C", light: "radial-gradient(120% 140% at 100% 0%, #FFA3A3 0%, #D94545 30%, #300C0E 66%, #101114 100%)" },
  { frame: "#050506", panel: "#111316", ink: "#EDEEF0", muted: "#8B919C", light: "radial-gradient(110% 140% at 10% 0%, #EEF2F8 0%, #9AA6B8 28%, #2A3038 62%, #111316 100%)" },
]

// Film grain over the light, so the gradients read as light rather than as flat fills.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E")`

function FolderCard({ item, n, tone }: { item: NavItem; n: number; tone: Tone }) {
  return (
    <Link
      href={item.href}
      className="group/f block w-[78%] shrink-0 snap-start rounded-[1.6rem] p-2.5 sm:w-auto shadow-[0_24px_48px_-28px_rgb(0_0_0/0.45)] transition-transform duration-500 ease-(--ease-lift) outline-none hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/60"
      style={{ background: tone.frame }}
    >
      <div className="relative h-[20rem] overflow-hidden rounded-[1.1rem] sm:h-[23rem]" style={{ background: tone.panel }}>
        {/* The light above the folder, with grain. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-[42%]" style={{ background: tone.light }} />
        <div aria-hidden className="absolute inset-x-0 top-0 h-[42%] opacity-40 mix-blend-overlay" style={{ backgroundImage: GRAIN }} />

        {/* The folder's front: a tab on the left, a curved shoulder, then the panel. It drops a little on hover, as if opening. */}
        <div className="absolute inset-x-0 top-[30%] bottom-0 transition-transform duration-500 ease-(--ease-lift) group-hover/f:translate-y-2" style={{ color: tone.panel }}>
          <div aria-hidden className="absolute -top-7 left-0 h-7 w-[42%] rounded-tl-[1.1rem]" style={{ background: tone.panel }} />
          <svg aria-hidden viewBox="0 0 44 28" preserveAspectRatio="none" className="absolute -top-7 left-[calc(42%-1px)] h-7 w-11">
            <path d="M0 0 C 18 0, 20 28, 44 28 L 0 28 Z" fill="currentColor" />
          </svg>
          <div className="absolute inset-0 flex flex-col rounded-tr-[1.1rem] p-6 pt-3" style={{ background: tone.panel, color: tone.ink }}>
            <div className="flex items-start justify-between">
              <span className="text-6xl font-medium tracking-[-0.04em] tabular-nums">{String(n).padStart(2, "0")}</span>
              <ArrowUpRight aria-hidden className="mt-2 size-5 transition-transform duration-500 ease-(--ease-lift) group-hover/f:translate-x-0.5 group-hover/f:-translate-y-0.5" />
            </div>
            <div className="mt-auto grid gap-1.5">
              <span className="text-lg font-medium">{item.title}</span>
              <span className={cn("text-sm leading-snug text-pretty")} style={{ color: tone.muted }}>{item.body}</span>
              <span className="label-mono mt-1 text-[11px]" style={{ color: tone.muted }}>{item.price}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/** What we build, as four numbered folders, after the folder cards shared as a reference. */
export function SolutionCards({ items }: { items: NavItem[] }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
      {items.map((item, i) => <FolderCard key={item.title} item={item} n={i + 1} tone={TONES[i % TONES.length]} />)}
    </div>
  )
}
