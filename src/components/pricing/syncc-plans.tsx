"use client"

import * as React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { plan } from "@/lib/pricing"
import { ChargeText, useRegion } from "./region"
import { PlanCard } from "./plan-card"

/** Syncc's two ways to buy: Cloud, billed monthly or yearly, and a self-hosted licence. */
export function SynccPlans() {
  const { region } = useRegion()
  const [billing, setBilling] = React.useState<"year" | "month">("year")
  const yearly = plan("syncc-cloud-annual").charges[0]
  const monthly = plan("syncc-cloud-monthly").charges[0]
  const saving = Math.round((1 - yearly.amounts[region] / 12 / monthly.amounts[region]) * 100)

  return (
    <div className="grid gap-5">
      <Tabs value={billing} onValueChange={(v) => setBilling(v as "year" | "month")}>
        <TabsList aria-label="Billing">
          <TabsTrigger value="year">Yearly · save {saving}%</TabsTrigger>
          <TabsTrigger value="month">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="grid gap-5 md:grid-cols-2">
        {billing === "year" ? (
          <PlanCard planId="syncc-cloud-annual" perMonth featured cta="Start with Cloud" note={<>Billed yearly at <ChargeText charge={yearly} /></>} />
        ) : (
          <PlanCard planId="syncc-cloud-monthly" featured cta="Start with Cloud" note="Billed monthly." />
        )}
        <PlanCard planId="syncc-self-hosted" cta="Buy a licence" note="Run it on your own server." />
      </div>
    </div>
  )
}
