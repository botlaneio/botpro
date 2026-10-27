"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { REGIONS, chargeLabel, money, type Charge, type Region } from "@/lib/pricing"

const RegionContext = React.createContext<{ region: Region; setRegion: (r: Region) => void } | null>(null)

/** Holds the visitor's pricing region. The server picks the first one from their country. */
export function RegionProvider({ initial, children }: { initial: Region; children: React.ReactNode }) {
  const [region, setRegion] = React.useState<Region>(initial)
  const value = React.useMemo(() => ({ region, setRegion }), [region])
  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const ctx = React.useContext(RegionContext)
  if (!ctx) throw new Error("useRegion needs a RegionProvider")
  return ctx
}

const OPTIONS: { region: Region; label: string }[] = [
  { region: "US", label: "USD $" },
  { region: "IN", label: "INR ₹" },
]

/** A two-way switch between dollar and rupee prices. */
export function RegionSwitch({ className }: { className?: string }) {
  const { region, setRegion } = useRegion()
  return (
    <div role="radiogroup" aria-label="Currency" className={cn("inline-flex rounded-lg border border-border bg-muted/40 p-0.5", className)}>
      {OPTIONS.map((o) => (
        <button
          key={o.region}
          type="button"
          role="radio"
          aria-checked={region === o.region}
          onClick={() => setRegion(o.region)}
          className="rounded-md px-3 py-1 text-sm text-muted-foreground transition-colors aria-checked:bg-background aria-checked:text-foreground aria-checked:shadow-sm"
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** A price in the visitor's region: "$449/month", "From ₹4,00,000 one-time". */
export function ChargeText({ charge }: { charge: Charge }) {
  const { region } = useRegion()
  return <>{chargeLabel(charge, region)}</>
}

/** A bare amount in the visitor's region: "$2,000". */
export function MoneyText({ amounts }: { amounts: Record<Region, number> }) {
  const { region } = useRegion()
  return <>{money(amounts[region], region)}</>
}

/** "Prices exclude 18% GST." for India, nothing elsewhere. */
export function TaxNote({ className }: { className?: string }) {
  const { region } = useRegion()
  const note = REGIONS[region].taxNote
  return note ? <p className={className}>{note}</p> : null
}
