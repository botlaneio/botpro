"use client"

import { offering } from "@/lib/pricing"
import { ChargeText } from "./region"

/** A compact list of an offering's plans and prices, for add-ons that don't need a card each. `only` limits it to some plans. */
export function PriceList({ offeringId, only }: { offeringId: string; only?: string[] }) {
  const o = offering(offeringId)
  const plans = only ? o.plans.filter((p) => only.includes(p.id)) : o.plans
  return (
    <ul className="surface-hairline divide-y divide-border">
      {plans.map((p) => (
        <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-3.5 text-sm">
          <span>{p.name}</span>
          <span className="tabular-nums text-muted-foreground">
            {p.charges.map((c, i) => <ChargeText key={i} charge={c} />)}
          </span>
        </li>
      ))}
    </ul>
  )
}
