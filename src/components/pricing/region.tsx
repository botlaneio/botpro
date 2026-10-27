"use client"

import { chargeLabel, money, type Charge, type Region } from "@/lib/pricing"

/** botlane.io sells in US dollars only. The price book keeps other regions' amounts for invoicing. */
export const SITE_REGION: Region = "US"

export function useRegion() {
  return { region: SITE_REGION }
}

/** A price as the site shows it: "$449/month", "From $18,000 one-time". */
export function ChargeText({ charge }: { charge: Charge }) {
  return <>{chargeLabel(charge, SITE_REGION)}</>
}

/** A bare amount: "$2,000". */
export function MoneyText({ amounts }: { amounts: Record<Region, number> }) {
  return <>{money(amounts[SITE_REGION], SITE_REGION)}</>
}
