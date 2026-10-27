import { CalendarCheck, CalendarDays, Check, ChevronRight, FileText, Search, Workflow } from "lucide-react"

import { LANES, type Lane, type LaneId } from "@/lib/lanes"
import { cn } from "@/lib/utils"

import { ProductFan } from "./product-fan"

const ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = {
  syncc: CalendarDays,
  scriblane: FileText,
  flowlane: Workflow,
}

// The lower half of each card fades into the card, so the visual reads as a window onto the product.
const fadeOut = "[mask-image:linear-gradient(180deg,#000_62%,transparent)]"

/** Syncc: a month tilted into the light, and a booking landing on top of it. */
function SynccVisual() {
  const days = Array.from({ length: 21 }, (_, i) => i + 12)
  return (
    <div className={cn("relative h-full", fadeOut)}>
      <div className="surface-hairline absolute top-4 left-6 w-[78%] -rotate-[5deg] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="label-mono text-[10px]">OCTOBER</span>
          <span className="label-mono text-[10px]">← →</span>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-[11px] tabular-nums text-muted-foreground">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i} className="text-[9px] opacity-60">{d}</span>)}
          {days.map((d) => (
            <span key={d} className={cn("mx-auto grid size-6 place-items-center rounded-md", d === 28 && "bg-[color-mix(in_oklch,var(--lane)_30%,transparent)] text-foreground")}>{d}</span>
          ))}
        </div>
      </div>
      <div className="absolute right-3 bottom-10 left-10 flex items-center gap-3 rounded-xl border border-[color-mix(in_oklch,var(--lane)_40%,transparent)] bg-[color-mix(in_oklch,var(--lane)_14%,var(--background))] p-3 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.5)] [animation:float-y_5s_ease-in-out_infinite]">
        <span className="tile-depth size-9 shrink-0"><CalendarCheck className="size-4" /></span>
        <span className="grid min-w-0">
          <span className="truncate text-[13px] font-medium">A good time to connect</span>
          <span className="label-mono text-[10px]">10:00 – 10:30</span>
        </span>
        <Check className="ml-auto size-4 shrink-0 text-(--lane-text)" />
      </div>
    </div>
  )
}

/** Scriblane: a stack of documents, one clause lit as the search finds it. */
function ScriblaneVisual() {
  return (
    <div className={cn("relative h-full", fadeOut)}>
      {[2, 1, 0].map((k) => (
        <div key={k} className="surface-hairline absolute left-1/2 w-[64%] p-4" style={{ top: 12 + k * 10, transform: `translateX(-50%) rotate(${(k - 1) * 3}deg)`, opacity: 1 - k * 0.25 }}>
          {k === 0 && (
            <div className="grid gap-2">
              <span className="label-mono text-[10px]">MASTER SERVICES AGREEMENT</span>
              {[92, 80, 86].map((w, i) => <span key={i} className="h-1.5 rounded-full bg-foreground/10" style={{ width: `${w}%` }} />)}
              <span className="relative overflow-hidden rounded-md bg-[color-mix(in_oklch,var(--lane)_22%,transparent)] px-2 py-1 text-[11px] text-foreground">
                12.3 Indemnity. Each party shall indemnify…
                <span aria-hidden className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent [animation:sweep-x_3.2s_ease-in-out_infinite]" />
              </span>
              {[74, 88].map((w, i) => <span key={i} className="h-1.5 rounded-full bg-foreground/10" style={{ width: `${w}%` }} />)}
            </div>
          )}
          {k > 0 && <div className="h-36" />}
        </div>
      ))}
      <div className="absolute right-4 bottom-9 left-4 flex items-center gap-2.5 rounded-xl border border-[color-mix(in_oklch,var(--lane)_40%,transparent)] bg-[color-mix(in_oklch,var(--lane)_12%,var(--background))] px-3.5 py-2.5 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.5)]">
        <Search className="size-4 text-muted-foreground" />
        <span className="text-[13px]">Find the indemnity clause<span className="ml-px inline-block h-3.5 w-px translate-y-0.5 bg-foreground [animation:caret-blink_1.1s_steps(1)_infinite]" /></span>
        <span className="label-mono ml-auto text-[10px]">⌘K</span>
      </div>
    </div>
  )
}

/** Flowlane: one trigger, and the steps it sets off, fading as they queue. */
function FlowlaneVisual() {
  const steps = [
    { t: "Contact created", n: "02" },
    { t: "Follow-up queued", n: "03" },
  ]
  return (
    <div className={cn("relative h-full", fadeOut)}>
      <div aria-hidden className="absolute top-6 left-1/2 size-56 -translate-x-1/2 rounded-full border border-[color-mix(in_oklch,var(--lane)_22%,transparent)]" />
      <div className="absolute top-8 right-0 left-4 flex items-center gap-3 rounded-xl border border-[color-mix(in_oklch,var(--lane)_40%,transparent)] bg-[color-mix(in_oklch,var(--lane)_14%,var(--background))] p-3 shadow-[0_16px_40px_-16px_rgb(0_0_0/0.5)] [animation:float-y_5s_ease-in-out_infinite]">
        <span className="tile-depth size-9 shrink-0"><Workflow className="size-4" /></span>
        <span className="grid min-w-0">
          <span className="truncate text-[13px] font-medium">Lead captured</span>
          <span className="text-[11px] text-muted-foreground">Ready for the next step</span>
        </span>
        <Check className="mr-3 ml-auto size-4 shrink-0 text-(--lane-text)" />
      </div>
      {steps.map((s, i) => (
        <div key={s.n} className="surface-hairline absolute right-0 flex items-center gap-3 px-4 py-3" style={{ top: 92 + i * 52, left: 24 + i * 16, opacity: 0.75 - i * 0.3 }}>
          <span className="size-1.5 rounded-full bg-(--lane)" />
          <span className="text-[13px] text-muted-foreground">{s.t}</span>
          <span className="label-mono mr-3 ml-auto text-[10px]">{s.n}</span>
        </div>
      ))}
    </div>
  )
}

const VISUALS: Record<LaneId, () => React.ReactElement> = { syncc: SynccVisual, scriblane: ScriblaneVisual, flowlane: FlowlaneVisual }

function ProductCard({ lane }: { lane: Lane }) {
  const Icon = ICONS[lane.id]
  const Visual = VISUALS[lane.id]
  const live = lane.status === "live"
  return (
    <article className={cn(lane.scope, "surface-product group/card flex flex-col overflow-hidden")}>
      <div className="flex items-center gap-3 p-5 pb-0">
        <span className="tile-depth size-11 shrink-0"><Icon className="size-5" /></span>
        <h3 className="text-lg font-medium">{lane.name}</h3>
        {live ? (
          <a href={`https://${lane.host}`} aria-label={`Visit ${lane.name}`} className="key-physical ml-auto grid size-10 place-items-center transition-transform duration-300 ease-(--ease-lift) group-hover/card:-translate-y-0.5">
            <ChevronRight className="size-4" />
          </a>
        ) : (
          <span className="label-mono ml-auto rounded-full border border-border px-2 py-0.5 text-[10px]">SOON</span>
        )}
      </div>
      <p className="px-5 pt-5 text-[17px] leading-snug text-pretty text-foreground/90">{lane.tagline}</p>
      <div className="mx-5 mt-6 border-t border-[color-mix(in_oklch,var(--lane)_18%,var(--border))]" />
      <div className="relative h-72" aria-hidden>
        <Visual />
      </div>
    </article>
  )
}

/** The three Lane products, as proof of what we build: a fan of cards, each a small window onto the product. */
export function ProductCards() {
  const items = LANES.map((l) => ({ title: l.name, note: l.status === "live" ? `LIVE · ${l.host.toUpperCase()}` : "OPENING SOON" }))
  return (
    <ProductFan items={items}>
      {LANES.map((l) => <ProductCard key={l.id} lane={l} />)}
    </ProductFan>
  )
}
