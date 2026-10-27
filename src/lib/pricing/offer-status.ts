/**
 * Whether an offer can still be claimed, and how many places are left.
 * Stripe is the authority: the offer's coupon counts every use, so the site
 * never keeps its own tally. Call `offerStatus` from server code only; it
 * reads STRIPE_SECRET_KEY.
 */
import { offerOpen } from "./index.ts"
import type { Offer } from "./types.ts"

/** The fields of a Stripe coupon this file reads. */
export interface StripeCoupon {
  valid: boolean
  max_redemptions: number | null
  times_redeemed: number
}

export interface OfferStatus {
  open: boolean
  /** Places left, or null when Stripe couldn't be asked (the page then shows the offer without a count). */
  placesLeft: number | null
}

/** Today's date in India, where the offer's end date is set, as YYYY-MM-DD. */
export const todayInIndia = (now: Date = new Date()): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(now)

/** Combines the offer's end date with what its Stripe coupon reports. */
export function statusFrom(offer: Offer, coupon: StripeCoupon | null, today: string): OfferStatus {
  const dateOpen = offerOpen(offer, today)
  if (!coupon) return { open: dateOpen, placesLeft: null }
  const limit = coupon.max_redemptions ?? offer.places
  const placesLeft = Math.max(0, limit - coupon.times_redeemed)
  return { open: dateOpen && coupon.valid && placesLeft > 0, placesLeft }
}

/** Asks Stripe for the offer's coupon, at most every five minutes. */
export async function offerStatus(offer: Offer, now: Date = new Date()): Promise<OfferStatus> {
  return statusFrom(offer, await fetchCoupon(offer.stripeCouponId), todayInIndia(now))
}

async function fetchCoupon(id: string | undefined): Promise<StripeCoupon | null> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!id || !key) return null
  try {
    const res = await fetch(`https://api.stripe.com/v1/coupons/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 300 },
    } as RequestInit)
    if (res.status === 404) return { valid: false, max_redemptions: 0, times_redeemed: 0 }
    if (!res.ok) return null
    return (await res.json()) as StripeCoupon
  } catch {
    return null
  }
}
