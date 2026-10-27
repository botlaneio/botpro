/**
 * The shape of Botlane's price book. Every price exists once per region, in
 * whole units of that region's currency (no cents or paise anywhere in the book).
 */

export type Region = "US" | "IN"
export type Currency = "USD" | "INR"

export const REGIONS: Record<Region, { currency: Currency; locale: string; taxNote: string | null }> = {
  US: { currency: "USD", locale: "en-US", taxNote: null },
  IN: { currency: "INR", locale: "en-IN", taxNote: "Prices exclude 18% GST." },
}

/** How a charge repeats. "one-time" is paid once; the rest recur. */
export type Interval = "one-time" | "month" | "year" | "hour"

/** One amount per region, e.g. { US: 199, IN: 3499 }. */
export type Amounts = Record<Region, number>

export interface Charge {
  /** What this charge is, when a plan has more than one ("Updates after year one"). */
  label?: string
  amounts: Amounts
  interval: Interval
  /** "From $18,000": the amount is a floor, the final price comes from scoping. */
  from?: boolean
  /** A charge the buyer may decline, such as renewing updates. */
  optional?: boolean
  /** Filled in when Stripe products exist; checkout reads it. */
  stripePriceId?: Partial<Record<Region, string>>
}

export interface Plan {
  id: string
  name: string
  summary?: string
  charges: Charge[]
  /** Usage included per interval, e.g. { pages: 500 }. */
  allowance?: { unit: string; amount: number; per: Interval }
  includes?: string[]
  /** Eligible for the Founding Ten offer. */
  founding?: boolean
}

/** A group of plans that are sold, priced and shown together. */
export interface Offering {
  id: string
  /** The lane whose colour and pages it lives in. */
  lane: "buildlane" | "syncc" | "scriblane" | "flowlane"
  name: string
  kind: "service" | "product" | "add-on"
  /**
   * Set while the prices are stand-ins. Pages show PLACEHOLDER_LABEL beside
   * every price in the offering, and checkout refuses to sell it.
   */
  placeholder?: boolean
  plans: Plan[]
  notes?: string[]
}

export interface Offer {
  id: string
  name: string
  /** Fraction off, e.g. 0.2 for 20%. */
  discount: number
  /** Last day the offer can be claimed, inclusive, as an ISO date. */
  endsOn: string
  places: number
  /** Plan ids it applies to. */
  appliesTo: string[]
  /** The Stripe coupon that applies the discount and counts the places taken. */
  stripeCouponId?: string
}

/** What a page shows beside a price that isn't final. */
export const PLACEHOLDER_LABEL = "Placeholder price"
