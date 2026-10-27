"use client"

import { Check, Minus } from "lucide-react"

import { plan } from "@/lib/pricing"
import { ChargeText } from "./region"

/**
 * Plans side by side: price, allowance, then every included item as a row.
 * Rows come from the price book only, so a table is as complete as its plans' `includes`.
 */
export function Comparison({ planIds, caption }: { planIds: string[]; caption: string }) {
  const plans = planIds.map(plan)
  const rows = [...new Set(plans.flatMap((p) => p.includes ?? []))]
  const allowances = plans.some((p) => p.allowance)

  return (
    <div className="surface-hairline overflow-x-auto">
      <table className="w-full min-w-[28rem] text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="px-5 py-3.5 text-left font-normal text-muted-foreground">Plan</th>
            {plans.map((p) => <th key={p.id} scope="col" className="px-5 py-3.5 text-left font-medium">{p.name}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <th scope="row" className="px-5 py-3 text-left font-normal text-muted-foreground">Price</th>
            {plans.map((p) => <td key={p.id} className="px-5 py-3 tabular-nums"><ChargeText charge={p.charges[0]} /></td>)}
          </tr>
          {allowances && (
            <tr>
              <th scope="row" className="px-5 py-3 text-left font-normal text-muted-foreground">Included</th>
              {plans.map((p) => (
                <td key={p.id} className="px-5 py-3 tabular-nums">
                  {p.allowance ? `${p.allowance.amount.toLocaleString("en-US")} ${p.allowance.unit} a ${p.allowance.per}` : "—"}
                </td>
              ))}
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row}>
              <th scope="row" className="px-5 py-3 text-left font-normal text-muted-foreground">{row}</th>
              {plans.map((p) => (
                <td key={p.id} className="px-5 py-3">
                  {p.includes?.includes(row)
                    ? <Check className="size-4 text-lane-text" aria-label="Included" />
                    : <Minus className="size-4 text-muted-foreground/60" aria-label="Not included" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
