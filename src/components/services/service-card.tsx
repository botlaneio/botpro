"use client"

import Link from "next/link"
import { Check } from "lucide-react"

import { needForPlan } from "@/lib/contact"
import { cn } from "@/lib/utils"
import { plan, type Offer } from "@/lib/pricing"
import { BigPrice } from "@/components/pricing/plan-card"
import { FINISH_CLASS } from "@/components/pricing/finish"

/** One service tier: who it's for, the price, what's included, and the kinds of project it suits. */
export function ServiceCard({ planId, offer, eyebrow, cta = "Start a project" }: {
  planId: string
  offer?: Offer | null
  /** A short label above the name, e.g. the step in a sequence. */
  eyebrow?: string
  cta?: string
}) {
  const p = plan(planId)
  const finish = p.finish ?? "glass"
  // Spotlight and apex plans are the ones we point people to, so their button is the solid one.
  const featured = finish !== "glass"

  return (
    <article className={cn("flex flex-col gap-5 p-6", FINISH_CLASS[finish])}>
      <header className="grid gap-1.5">
        {eyebrow && <span className="label-mono">{eyebrow}</span>}
        <h3 className="text-lg font-medium tracking-tight">{p.name}</h3>
        {p.bestFor && <p className="text-sm text-muted-foreground">{p.bestFor}</p>}
      </header>

      <div className="grid gap-1.5">
        <BigPrice charge={p.charges[0]} offer={offer} />
        {p.terms && <p className="text-sm text-foreground/85">{p.terms}</p>}
        {p.specs?.Timeline && <p className="label-mono">{p.specs.Timeline}</p>}
      </div>

      {p.includes && (
        <ul className="grid gap-2 text-sm">
          {p.includes.map((item) => (
            <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{item}</li>
          ))}
        </ul>
      )}

      {p.examples && (
        <div className="flex flex-wrap gap-1.5">
          {p.examples.map((e) => (
            <span key={e} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">{e}</span>
          ))}
        </div>
      )}

      <Link
        href={`/contact?need=${needForPlan(p.id)}`}
        className={cn(
          "mt-auto inline-flex h-9 items-center justify-center rounded-[var(--radius)] px-4 text-sm font-medium",
          featured ? "btn-light" : "border border-border hover:bg-muted",
        )}
      >
        {cta}
      </Link>
    </article>
  )
}
