"use client"

import { offering } from "@/lib/pricing"
import { ChargeText } from "./region"

/** A compact list of an offering's plans and prices, for add-ons that don't need a card each. */
export function PriceList({ offeringId }: { offeringId: string }) {
  const o = offering(offeringId)
  return (
    <ul className="surface-hairline divide-y divide-border">
      {o.plans.map((p) => (
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
