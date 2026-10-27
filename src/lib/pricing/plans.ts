/**
 * Botlane's price book: the single source of truth for every price on the site.
 * Pricing cards, comparison tables, FAQs, the signup form, emails and checkout
 * all read from here. Change a price in this file and nowhere else.
 *
 * Sources, October 2026:
 *   - neural_substrate/plans.ts (central price book): Buildlane, AI Intake & Booking, Scriblane, add-ons
 *   - syncc/pricing.js: the standalone Syncc scheduling app
 */
import type { Offer, Offering } from "./types.ts"

export const OFFERINGS: readonly Offering[] = [
  {
    id: "buildlane-websites",
    lane: "buildlane",
    name: "Websites",
    kind: "service",
    notes: ["Website prices are one-time."],
    plans: [
      { id: "website-starter", name: "Starter website", founding: true, charges: [{ amounts: { US: 2500, IN: 50000 }, interval: "one-time" }] },
      { id: "website-business", name: "Business website", founding: true, charges: [{ amounts: { US: 4900, IN: 110000 }, interval: "one-time" }] },
      { id: "website-pro", name: "Pro website", founding: true, charges: [{ amounts: { US: 7900, IN: 190000 }, interval: "one-time" }] },
    ],
  },
  {
    id: "buildlane-apps",
    lane: "buildlane",
    name: "Web apps",
    kind: "service",
    notes: ["App builds are subject to scoping."],
    plans: [
      { id: "app-scoping", name: "App scoping sprint", founding: true, charges: [{ amounts: { US: 1500, IN: 30000 }, interval: "one-time" }] },
      { id: "app-prototype", name: "App prototype", founding: true, charges: [{ amounts: { US: 9500, IN: 210000 }, interval: "one-time" }] },
      { id: "app-full", name: "Full application build", founding: true, charges: [{ amounts: { US: 18000, IN: 400000 }, interval: "one-time", from: true }] },
    ],
  },
  {
    id: "buildlane-care",
    lane: "buildlane",
    name: "Care and add-ons",
    kind: "add-on",
    plans: [
      { id: "ai-assistant", name: "AI Assistant add-on", charges: [{ amounts: { US: 2500, IN: 50000 }, interval: "one-time" }] },
      { id: "care", name: "Care", charges: [{ amounts: { US: 99, IN: 2999 }, interval: "month" }] },
      { id: "care-plus", name: "Care Plus", charges: [{ amounts: { US: 199, IN: 4999 }, interval: "month" }] },
      { id: "extra-work", name: "Additional work", charges: [{ amounts: { US: 110, IN: 2500 }, interval: "hour" }] },
    ],
  },
  {
    // The standalone scheduling app at syncc.botlane.io.
    id: "syncc",
    lane: "syncc",
    name: "Syncc",
    kind: "product",
    plans: [
      {
        id: "syncc-cloud-annual",
        name: "Cloud, billed yearly",
        includes: ["One owner calendar", "Unlimited event types", "Unlimited bookings"],
        charges: [{ amounts: { US: 84, IN: 5988 }, interval: "year" }],
      },
      {
        id: "syncc-cloud-monthly",
        name: "Cloud, billed monthly",
        includes: ["One owner calendar", "Unlimited event types", "Unlimited bookings"],
        charges: [{ amounts: { US: 9, IN: 599 }, interval: "month" }],
      },
      {
        id: "syncc-self-hosted",
        name: "Self-hosted licence",
        includes: ["One owner calendar", "Unlimited event types", "Unlimited bookings", "12 months of updates", "Email support"],
        charges: [
          { amounts: { US: 99, IN: 7999 }, interval: "one-time" },
          { label: "Updates after year one", amounts: { US: 39, IN: 2999 }, interval: "year", optional: true },
        ],
      },
    ],
  },
  {
    // The managed AI intake, qualification, follow-up and booking system.
    // The central price book files it under Syncc; it is a different offering
    // from the Syncc app above and must never share a pricing table with it.
    id: "ai-intake",
    lane: "syncc",
    name: "AI Intake & Booking",
    kind: "service",
    plans: [
      {
        id: "intake-own",
        name: "Own It",
        charges: [
          { amounts: { US: 2490, IN: 35000 }, interval: "one-time" },
          { label: "Ongoing upkeep", amounts: { US: 149, IN: 2999 }, interval: "month", optional: true },
        ],
      },
      {
        id: "intake-managed",
        name: "We Run It",
        charges: [
          { amounts: { US: 499, IN: 7999 }, interval: "month" },
          { label: "Managed setup", amounts: { US: 990, IN: 20000 }, interval: "one-time" },
        ],
      },
    ],
  },
  {
    id: "scriblane",
    lane: "scriblane",
    name: "Scriblane",
    kind: "product",
    plans: [
      { id: "scriblane-starter", name: "Starter", allowance: { unit: "pages", amount: 500, per: "month" }, charges: [{ amounts: { US: 199, IN: 3499 }, interval: "month" }] },
      { id: "scriblane-growth", name: "Growth", allowance: { unit: "pages", amount: 2000, per: "month" }, charges: [{ amounts: { US: 449, IN: 7999 }, interval: "month" }] },
    ],
  },
]

export const OFFERS: readonly Offer[] = [
  {
    id: "founding-ten",
    name: "Founding Ten",
    discount: 0.2,
    endsOn: "2027-03-31",
    places: 10,
    appliesTo: OFFERINGS.flatMap((o) => o.plans).filter((p) => p.founding).map((p) => p.id),
  },
]
