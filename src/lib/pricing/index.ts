/**
 * Reading the price book: lookups, regions and display strings.
 * Components never format a price themselves; they call these.
 */
import { OFFERINGS, OFFERS } from "./plans.ts"
import { REGIONS, type Charge, type Interval, type Offer, type Offering, type Plan, type Region } from "./types.ts"

export * from "./types.ts"
export { OFFERINGS, OFFERS }

export function offering(id: string): Offering {
  const o = OFFERINGS.find((x) => x.id === id)
  if (!o) throw new Error(`Unknown offering: ${id}`)
  return o
}

export function plan(id: string): Plan {
  return planWithOffering(id).plan
}

function planWithOffering(id: string): { plan: Plan; offering: Offering } {
  for (const o of OFFERINGS) {
    const p = o.plans.find((x) => x.id === id)
    if (p) return { plan: p, offering: o }
  }
  throw new Error(`Unknown plan: ${id}`)
}

/** Whether a plan's prices are stand-ins. Pages show PLACEHOLDER_LABEL next to them. */
export const isPlaceholder = (id: string): boolean => !!planWithOffering(id).offering.placeholder

/** Whether checkout may sell a plan: its prices are final and Stripe knows it in this region. */
export function purchasable(id: string, region: Region): boolean {
  const { plan: p, offering: o } = planWithOffering(id)
  return !o.placeholder && p.charges.every((c) => c.optional || !!c.stripePriceId?.[region])
}

/**
 * The region a visitor is priced in, from the country their host reports
 * (Vercel's x-vercel-ip-country, Cloudflare's cf-ipcountry). India is priced
 * in rupees; everyone else in US dollars.
 */
export const regionFor = (country: string | null | undefined): Region => (country?.toUpperCase() === "IN" ? "IN" : "US")

/** A whole amount in the region's currency: $2,490 or ₹1,10,000. */
export function money(amount: number, region: Region): string {
  const { currency, locale } = REGIONS[region]
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount)
}

const SUFFIX: Record<Interval, string> = { "one-time": " one-time", month: "/month", year: "/year", hour: "/hour" }

/** One charge as shown on a card: "$9/month", "From ₹4,00,000 one-time". */
export function chargeLabel(charge: Charge, region: Region): string {
  const { from, amount, suffix } = priceParts(charge, region)
  return (from ? "From " : "") + amount + suffix
}

/** The pieces of a price, for setting the amount large and the rest small. */
export function priceParts(charge: Charge, region: Region, amount = charge.amounts[region]) {
  return { from: !!charge.from, amount: money(amount, region), suffix: SUFFIX[charge.interval] }
}

/** A yearly charge expressed per month, for "$7/month, billed yearly". Whole units only. */
export function perMonth(charge: Charge, region: Region): number {
  if (charge.interval !== "year") throw new Error("perMonth only applies to yearly charges")
  return Math.round(charge.amounts[region] / 12)
}

/** The price after an offer, rounded to whole units. */
export const discounted = (amount: number, offer: Offer): number => Math.round(amount * (1 - offer.discount))

/** Whether an offer can still be claimed on a date (ISO, inclusive). Places left come from the database, not here. */
export const offerOpen = (offer: Offer, today: string): boolean => today <= offer.endsOn
