"use client"

import { plan } from "@/lib/pricing"
import { ChargeText } from "@/components/pricing/region"

/** Plans compared row by row: price, then each of their `specs` in order. */
export function SpecsTable({ planIds, caption }: { planIds: string[]; caption: string }) {
  const plans = planIds.map(plan)
  const rows = [...new Set(plans.flatMap((p) => Object.keys(p.specs ?? {})))]

  return (
    <div className="surface-hairline overflow-x-auto">
      <table className="w-full min-w-[36rem] text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border">
            <td className="px-5 py-3.5" />
            {plans.map((p) => <th key={p.id} scope="col" className="px-5 py-3.5 text-left font-medium">{p.name}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <th scope="row" className="px-5 py-3 text-left font-normal text-muted-foreground">Price</th>
            {plans.map((p) => <td key={p.id} className="px-5 py-3 tabular-nums"><ChargeText charge={p.charges[0]} /></td>)}
          </tr>
          {rows.map((row) => (
            <tr key={row}>
              <th scope="row" className="px-5 py-3 text-left font-normal text-muted-foreground">{row}</th>
              {plans.map((p) => <td key={p.id} className="px-5 py-3">{p.specs?.[row] ?? "—"}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
