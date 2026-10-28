import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { FINISH_CLASS } from "@/components/pricing/finish"
import { categoryById, offerHref, offerPrice, type Offer } from "@/lib/catalog"
import { plan } from "@/lib/pricing"
import { cn } from "@/lib/utils"

import { OFFER_ICONS } from "./offer-icons"

/**
 * One option on its category's hub: what it is, who it's for, its price (or that it's quoted), the first
 * few things included, and a button through to its own page.
 */
export function OfferCard({ offer, step }: { offer: Offer; step?: string }) {
  const cat = categoryById(offer.category)
  const p = offer.planId ? plan(offer.planId) : null
  const Icon = OFFER_ICONS[offer.icon]
  const included = (p?.includes ?? offer.deliverables ?? []).slice(0, 4)
  const finish = p?.finish ?? "glass"

  return (
    <article className={cn("flex flex-col gap-5 p-6", FINISH_CLASS[finish])}>
      <header className="grid gap-3">
        <div className="flex items-center gap-3">
          <span className={cn("tile-depth size-10 shrink-0", cat.tone)}><Icon className="size-[18px]" /></span>
          <div className="grid">
            {step && <span className="label-mono text-[11px]">{step}</span>}
            <h3 className="text-lg font-medium tracking-tight">{offer.name}</h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{p?.bestFor ?? offer.pain}</p>
      </header>

      <div className="grid gap-1">
        <span className="text-2xl font-medium tracking-tight">{offerPrice(offer)}</span>
        {p?.specs?.Timeline && <span className="label-mono">{p.specs.Timeline}</span>}
        {p?.terms && <span className="text-sm text-foreground/85">{p.terms}</span>}
      </div>

      <ul className="grid gap-2 text-sm">
        {included.map((item) => (
          <li key={item} className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{item}</li>
        ))}
      </ul>

      <Link href={offerHref(offer)} className="btn-light mt-auto inline-flex h-10 items-center justify-center gap-1.5 px-4 text-sm font-medium">
        Learn more and view details <ArrowRight className="size-4" />
      </Link>
    </article>
  )
}
