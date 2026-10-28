"use client"

import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { discounted, isPlaceholder, plan, priceParts, PLACEHOLDER_LABEL, type Charge, type Offer } from "@/lib/pricing"
import { FINISH_CLASS } from "./finish"
import { ChargeText, useRegion } from "./region"

/** The badge every stand-in price carries, so nobody mistakes it for a final one. */
export function PlaceholderBadge() {
  return (
    <Badge variant="outline" className="border-dashed border-warning/60 text-warning">
      {PLACEHOLDER_LABEL}
    </Badge>
  )
}

/** A price set large: the amount big, the interval small. With an offer, the list price is struck through. */
export function BigPrice({ charge, offer, perMonthOf }: { charge: Charge; offer?: Offer | null; perMonthOf?: Charge }) {
  const { region } = useRegion()
  // A yearly plan shown per month: "$7/month", from its $84 yearly charge.
  const shown = perMonthOf ? { ...perMonthOf, interval: "month" as const } : charge
  const amount = perMonthOf ? Math.round(perMonthOf.amounts[region] / 12) : charge.amounts[region]
  const list = priceParts(shown, region, amount)
  const deal = offer ? priceParts(shown, region, discounted(amount, offer)) : null

  return (
    <div className="grid gap-1">
      <p className="flex flex-wrap items-baseline gap-x-2">
        {list.from && <span className="text-sm text-muted-foreground">From</span>}
        <span className="text-3xl font-medium tracking-tight tabular-nums">{deal ? deal.amount : list.amount}</span>
        <span className="text-sm text-muted-foreground">{list.suffix.trim()}</span>
      </p>
      {deal && (
        <p className="label-mono">
          <s className="decoration-muted-foreground/60">{list.amount}</s> · {Math.round(offer!.discount * 100)}% off for the Founding Ten
        </p>
      )}
    </div>
  )
}

export interface PlanCardProps {
  planId: string
  /** Set off with the lane's tinted finish. */
  featured?: boolean
  /** The open offer that applies to this plan, if any. */
  offer?: Offer | null
  /** Show a yearly plan's price per month. */
  perMonth?: boolean
  cta: string
  /** Where the button goes: a product's own sign-up, or the contact form. */
  href?: string
  note?: React.ReactNode
}

export function PlanCard({ planId, featured, offer, perMonth, cta, href, note }: PlanCardProps) {
  const p = plan(planId)
  const [main, ...extras] = p.charges
  const placeholder = isPlaceholder(planId)

  return (
    <article className={cn("flex flex-col gap-5 p-6", p.finish ? FINISH_CLASS[p.finish] : featured ? "surface-tinted" : "surface-glass")}>
      <header className="flex flex-wrap items-center gap-2">
        <span className="size-1.5 rounded-full bg-lane" aria-hidden />
        <h3 className="font-medium">{p.name}</h3>
        {placeholder && <PlaceholderBadge />}
      </header>

      <BigPrice charge={main} offer={offer} perMonthOf={perMonth && main.interval === "year" ? main : undefined} />
      {note && <p className="-mt-3 text-sm text-muted-foreground">{note}</p>}

      {(p.allowance || p.includes || extras.length > 0) && (
        <ul className="grid gap-2 text-sm">
          {p.allowance && (
            <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-lane-text" />
              {p.allowance.amount.toLocaleString("en-US")} {p.allowance.unit} a {p.allowance.per}
            </li>
          )}
          {p.includes?.map((item) => (
            <li key={item} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-lane-text" />{item}</li>
          ))}
          {extras.map((c) => (
            <li key={c.label} className="flex gap-2 text-muted-foreground">
              <span className="mt-0.5 size-4 shrink-0 text-center">+</span>
              <span>{c.label}: <ChargeText charge={c} />{c.optional ? ", optional" : ""}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        className={cn("mt-auto h-9 w-full", featured ? (p.finish ? "btn-light" : "btn-lane text-lane-ink") : "")}
        variant={featured ? "default" : "outline"}
        disabled={placeholder || !href}
        asChild={!placeholder && !!href}
      >
        {placeholder ? "Not on sale yet" : href ? <a href={href}>{cta}</a> : cta}
      </Button>
    </article>
  )
}
