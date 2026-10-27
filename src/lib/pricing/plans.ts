/**
 * Botlane's price book: the single source of truth for every price on the site.
 * Pricing cards, comparison tables, FAQs, the signup form, emails and checkout
 * all read from here. Change a price in this file and nowhere else.
 *
 * Sources, October 2026:
 *   - neural_substrate/plans.ts (central price book): services, Scriblane, add-ons
 *   - service details (who it's for, inclusions, timelines) agreed October 2026
 *   - syncc/pricing.js: the standalone Syncc scheduling app
 *
 * Offerings marked `placeholder: true` hold stand-in prices: shown with a
 * "Placeholder price" label, never sold. Syncc is one of them until its
 * prices are confirmed.
 */
import type { Offer, Offering } from "./types.ts"

export const OFFERINGS: readonly Offering[] = [
  {
    id: "websites",
    lane: "botlane",
    name: "Websites",
    kind: "service",
    notes: ["Website prices are one-time."],
    plans: [
      {
        id: "website-core",
        name: "Core",
        founding: true,
        bestFor: "A new business, a consultant or a single product getting online properly.",
        specs: { Pages: "Up to 5", Design: "Custom, no templates", Editing: "Text changes made by us", Timeline: "2–3 weeks", Revisions: "2 rounds" },
        includes: ["Custom design, no templates", "Mobile-ready and fast-loading", "Basic SEO", "Contact form", "Analytics"],
        examples: ["Personal brand", "Local business", "A landing page with a few pages"],
        charges: [{ amounts: { US: 2500, IN: 50000 }, interval: "one-time" }],
      },
      {
        id: "website-ascend",
        name: "Ascend",
        founding: true,
        bestFor: "An established business that needs a full company site it can update itself.",
        specs: { Pages: "Up to 12", Design: "Custom design system across every page", Editing: "Content editor for pages and blog", Timeline: "3–5 weeks", Revisions: "3 rounds" },
        includes: ["Everything in Core", "A design system across every page", "Content editor for pages and blog", "Integrations: booking, CRM, newsletter"],
        examples: ["Agency", "Clinic", "Law or accounting firm", "SaaS company site"],
        charges: [{ amounts: { US: 4900, IN: 110000 }, interval: "one-time" }],
      },
      {
        id: "website-apex",
        name: "Apex",
        founding: true,
        bestFor: "A brand where the website is part of the product experience.",
        specs: { Pages: "Scoped to your needs", Design: "Custom, with signature motion and interactions", Editing: "Content editor with structured content", Timeline: "5–8 weeks", Revisions: "4 rounds" },
        includes: ["Everything in Ascend", "Signature motion and interactions", "Structured content: case studies, docs, changelog", "Advanced SEO", "Multiple languages if needed", "A performance budget"],
        examples: ["Product launch site", "Premium brand", "Flagship company site"],
        charges: [{ amounts: { US: 7900, IN: 190000 }, interval: "one-time" }],
      },
    ],
  },
  {
    id: "web-apps",
    lane: "botlane",
    name: "Web apps",
    kind: "service",
    notes: ["Apps are priced by stage: plan, prove, then build."],
    plans: [
      {
        id: "app-scoping",
        name: "Scoping sprint",
        founding: true,
        bestFor: "Anyone with an app idea who needs a clear plan and a fixed quote.",
        specs: { Timeline: "1–2 weeks" },
        includes: ["Requirements and user flows", "Clickable wireframes", "A technical plan", "A fixed quote for the build"],
        terms: "Credited towards your build if you go ahead.",
        charges: [{ amounts: { US: 1500, IN: 30000 }, interval: "one-time" }],
      },
      {
        id: "app-prototype",
        name: "Prototype",
        founding: true,
        bestFor: "Testing the idea with real users or investors.",
        specs: { Timeline: "4–6 weeks" },
        includes: ["The core workflow, working end to end", "Sign-in and real data", "Deployed for real users"],
        charges: [{ amounts: { US: 9500, IN: 210000 }, interval: "one-time" }],
      },
      {
        id: "app-full",
        name: "Full build",
        founding: true,
        bestFor: "Launching a production product.",
        specs: { Timeline: "Set during scoping" },
        includes: ["A complete, secure app", "Accounts and roles", "Payments, if you need them", "An admin panel", "Testing and launch support"],
        charges: [{ amounts: { US: 18000, IN: 400000 }, interval: "one-time", from: true }],
      },
    ],
  },
  {
    id: "care",
    lane: "botlane",
    name: "Care and add-ons",
    kind: "add-on",
    plans: [
      {
        id: "care",
        name: "Care",
        bestFor: "Keeping a finished site secure, backed up and up to date.",
        includes: ["Hosting, SSL and deployments managed for you", "Security and dependency updates", "Uptime monitoring", "Monthly backups", "Up to 1 hour of small edits a month", "Email support, reply within 2 business days"],
        charges: [{ amounts: { US: 99, IN: 2999 }, interval: "month" }],
      },
      {
        id: "care-plus",
        name: "Care Plus",
        bestFor: "A site that keeps changing and needs a team on call.",
        includes: ["Everything in Care", "Up to 3 hours of edits a month", "Priority support, reply within 1 business day", "Monthly performance and SEO report", "A quarterly design review"],
        charges: [{ amounts: { US: 199, IN: 4999 }, interval: "month" }],
      },
      {
        id: "ai-assistant",
        name: "AI Assistant",
        bestFor: "Answering visitors' questions about your business, day and night.",
        includes: ["An assistant on your website", "Trained on your website and your business: services, prices, policies, FAQs", "Hands enquiries to you when a person is needed"],
        charges: [{ amounts: { US: 2500, IN: 50000 }, interval: "one-time" }],
      },
      {
        id: "extra-work",
        name: "Additional work",
        bestFor: "Changes outside a project's scope or a Care plan's monthly hours.",
        charges: [{ amounts: { US: 110, IN: 2500 }, interval: "hour" }],
      },
    ],
  },
  {
    // The standalone scheduling app at syncc.botlane.io.
    // PLACEHOLDER: these figures come from syncc/pricing.js and are not final.
    id: "syncc",
    lane: "syncc",
    name: "Syncc",
    kind: "product",
    placeholder: true,
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
    // 20% off, once, at most 10 uses, redeemable until 31 March 2027 (end of day, India time).
    stripeCouponId: "FOUNDING10",
  },
]
