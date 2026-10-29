/**
 * What Botlane offers, as the site lays it out: three categories, each with a hub page that compares its
 * options and a dedicated page per option, named by what the client needs rather than by tier. The mega
 * menu, the hubs and the dedicated pages all read from here. Prices come from the price book; an option
 * with no plan is quoted after a call.
 */
import { chargeLabel, plan } from "./pricing/index.ts"

export type CategoryId = "websites" | "web-apps" | "custom-solutions"

export type OfferIcon = "business" | "company" | "brand" | "scoping" | "mvp" | "full" | "assistant" | "automation" | "documents"

export interface Category {
  id: CategoryId
  label: string
  href: string
  eyebrow: string
  title: string
  intro: string
  /** The main action on every page in the category. */
  cta: { label: string; need: "website" | "web-app" | "assistant" | "custom" }
  /** The tone class for its icons. */
  tone: string
}

export interface Offer {
  slug: string
  category: CategoryId
  icon: OfferIcon
  /** The option's name in the menu and on its card. */
  name: string
  /** One short line for the menu. */
  menu: string
  /** The price-book plan behind it, if it has a public price. */
  planId?: string
  headline: string
  /** The problem it solves, in the client's words. */
  pain: string
  /** What's included, for options without a plan. Options with a plan use the plan's own list. */
  deliverables?: string[]
  timeline?: string
  /** What we typically build it with. */
  stack?: Tool[]
  /** Our own work that shows we can do it. */
  proof: { text: string; href: string; label: string }
  /**
   * What each included item does for the client, in their terms. When set, the option's page uses the
   * fuller layout: an example of the work beside the headline, these as cards, then the plan as a timeline.
   * One per included item, in the same order, and no claims the plan doesn't make.
   */
  outcomes?: { icon: OutcomeIcon; title: string; body: string }[]
  /** Which example site the fuller page shows: a small clinic (with a phone) or a firm (with an editor). */
  showcase?: "clinic" | "firm" | "launch"
}

/** A tool we build with, shown by its logo. */
export type ToolId = "nextjs" | "react" | "typescript" | "tailwind" | "vercel" | "postgresql" | "stripe"
export interface Tool {
  id: ToolId
  /** When it applies, if not always. */
  note?: string
}

export type OutcomeIcon = "design" | "mobile" | "search" | "enquiries" | "analytics" | "foundation" | "system" | "editor" | "integrations" | "motion" | "structure" | "languages" | "performance"

export const CATEGORIES: Category[] = [
  {
    id: "websites",
    label: "Websites",
    href: "/websites",
    eyebrow: "WEBSITES · FIXED PRICE",
    title: "Websites, at a fixed price.",
    intro: "Three packages, by what your business needs. Each has a clear scope: pages, revisions and a timeline, agreed before we start.",
    cta: { label: "Get started", need: "website" },
    tone: "text-(--blue-text)",
  },
  {
    id: "web-apps",
    label: "Web apps",
    href: "/web-apps",
    eyebrow: "WEB APPS · BY STAGE",
    title: "Web apps, from first plan to full product.",
    intro: "Apps carry more unknowns than websites, so every one starts with a short scoping sprint that ends in a fixed quote. The prices below are where each stage starts.",
    cta: { label: "Book a scoping call", need: "web-app" },
    tone: "text-(--ember-text)",
  },
  {
    id: "custom-solutions",
    label: "Custom solutions",
    href: "/custom-solutions",
    eyebrow: "CUSTOM SOLUTIONS · QUOTED",
    title: "AI and automation, built around how you work.",
    intro: "Built on the same engines that run our own products. Every business works differently, so we scope and quote after a short call.",
    cta: { label: "Schedule a strategy call", need: "custom" },
    tone: "text-(--violet-text)",
  },
]

const SITE_STACK: Tool[] = [{ id: "nextjs" }, { id: "react" }, { id: "typescript" }, { id: "tailwind" }, { id: "vercel" }]
const APP_STACK: Tool[] = [{ id: "nextjs" }, { id: "typescript" }, { id: "postgresql" }, { id: "stripe", note: "If you take payments" }, { id: "vercel" }]
const OUR_APPS = { text: "We build and run our own apps to the same standard: Syncc for scheduling and Scriblane for documents.", href: "/products", label: "See our products" }
const OUR_SITE = { text: "This website is our own work, designed and built in-house to the standard we build for clients.", href: "/products", label: "See what else we've built" }

export const OFFERS: Offer[] = [
  {
    slug: "business-sites",
    category: "websites",
    icon: "business",
    name: "Core",
    menu: "Business sites · up to 5 pages",
    planId: "website-core",
    headline: "A proper website for a new business.",
    pain: "You need to look established from day one, on a site that's yours, not a template that looks like everyone else's.",
    stack: SITE_STACK,
    proof: OUR_SITE,
    outcomes: [
      { icon: "design", title: "Designed around your business", body: "Drawn from a blank page around what you do, so it looks like you and no one else." },
      { icon: "mobile", title: "Right on every phone", body: "Laid out for small screens as carefully as large ones, and built to load fast." },
      { icon: "search", title: "Ready to be found", body: "The search basics set up from day one, so search engines can read and list every page." },
      { icon: "enquiries", title: "Enquiries straight to you", body: "A contact form that sends every enquiry to your inbox." },
      { icon: "analytics", title: "See who visits", body: "Analytics set up, so you can see how many people come and what they read." },
    ],
    showcase: "clinic",
  },
  {
    slug: "company-sites",
    category: "websites",
    icon: "company",
    name: "Ascend",
    menu: "Company sites · up to 12 pages",
    planId: "website-ascend",
    headline: "A full company site your team can update.",
    pain: "Your business has outgrown its website, and every change means waiting on someone else.",
    stack: SITE_STACK,
    proof: OUR_SITE,
    outcomes: [
      { icon: "foundation", title: "Everything in Core", body: "A custom design, right on every phone, ready to be found, with enquiries to your inbox and analytics." },
      { icon: "system", title: "One look across every page", body: "A design system of type, colour and components, so every page reads as one site." },
      { icon: "editor", title: "Your team makes the changes", body: "A content editor for your pages and blog, so an update no longer means waiting on someone else." },
      { icon: "integrations", title: "Connected to how you work", body: "Booking, CRM and newsletter integrations, so enquiries and sign-ups land where your team already works." },
    ],
    showcase: "firm",
  },
  {
    slug: "brand-sites",
    category: "websites",
    icon: "brand",
    name: "Apex",
    menu: "Brand sites · signature motion",
    planId: "website-apex",
    headline: "A website that's part of the product.",
    pain: "For a launch or a premium brand, the site is the first thing people experience. It has to feel as good as what you sell.",
    stack: SITE_STACK,
    proof: OUR_SITE,
    outcomes: [
      { icon: "foundation", title: "Everything in Ascend", body: "One design system across every page, a content editor your team uses, and your booking, CRM and newsletter tools connected." },
      { icon: "motion", title: "Motion that's yours", body: "Signature motion and interactions, designed around your brand, so the site feels like the thing you sell." },
      { icon: "structure", title: "Content with a shape", body: "Structured content for case studies, docs and a changelog, so each kind of page stays consistent as it grows." },
      { icon: "search", title: "Found, beyond the basics", body: "Advanced SEO, going further than the basics in our other packages." },
      { icon: "languages", title: "In the languages you need", body: "Multiple languages, if your audience needs them." },
      { icon: "performance", title: "Fast, and held to it", body: "A performance budget: set limits on page weight and load time that the site is built to stay within." },
    ],
    showcase: "launch",
  },
  {
    slug: "scoping-sprint",
    category: "web-apps",
    icon: "scoping",
    name: "Scoping sprint",
    menu: "A plan and a fixed quote",
    planId: "app-scoping",
    headline: "Know exactly what you're building, and what it costs.",
    pain: "You have an app idea, but no clear plan, and every estimate you've had is a guess.",
    proof: OUR_APPS,
  },
  {
    slug: "mvp",
    category: "web-apps",
    icon: "mvp",
    name: "MVP development",
    menu: "Prove it with real users",
    planId: "app-prototype",
    headline: "An MVP real people can sign in to.",
    pain: "You need to prove the idea with real users or investors, without paying for a full build to find out.",
    stack: APP_STACK,
    proof: OUR_APPS,
  },
  {
    slug: "full-product",
    category: "web-apps",
    icon: "full",
    name: "Full product build",
    menu: "Production-ready, end to end",
    planId: "app-full",
    headline: "A complete product, ready to launch.",
    pain: "You know what to build. Now it needs accounts, roles, payments, an admin panel and the testing to go live with confidence.",
    stack: APP_STACK,
    proof: OUR_APPS,
  },
  {
    slug: "ai-assistant",
    category: "custom-solutions",
    icon: "assistant",
    name: "AI website assistant",
    menu: "Answers visitors, day and night",
    planId: "ai-assistant",
    headline: "An assistant that knows your business.",
    pain: "Visitors ask the same questions at all hours, and the ones nobody answers go elsewhere.",
    proof: { text: "We build AI into our own products, and the assistant is set up and tuned by the same team.", href: "/products", label: "See our products" },
  },
  {
    slug: "workflow-automation",
    category: "custom-solutions",
    icon: "automation",
    name: "Workflow automation",
    menu: "Connect your tools, end the busywork",
    headline: "Your tools, finally working together.",
    pain: "Your team copies the same data between apps by hand: leads into the CRM, invoices into accounts, updates into Slack.",
    deliverables: [
      "A map of the workflows worth automating, and what each one saves",
      "Automations across 700+ apps, from Gmail, Slack and Stripe to HubSpot and Notion",
      "AI steps where judgement is needed, briefed in plain language",
      "A history of every run, so you can see what happened and when",
      "Runs on our platform or on your own server, so your data stays with you",
      "A handover your team can follow",
    ],
    timeline: "Set after the call",
    proof: { text: "Built on Flowlane, our own automation platform, with 700+ integrations.", href: "/products/flowlane", label: "About Flowlane" },
  },
  {
    slug: "document-processing",
    category: "custom-solutions",
    icon: "documents",
    name: "Document processing",
    menu: "Invoices and forms into your systems",
    headline: "Documents in, clean data out.",
    pain: "Someone on your team types invoices and forms into another system, and mistakes slip through.",
    deliverables: [
      "Fields read from invoices, scans, photos and Office files, each with a confidence score",
      "The maths checked automatically: line items, subtotal, tax and total",
      "A review queue for anything that doesn't add up, with the reasons",
      "Data sent where you need it: your accounts, a spreadsheet or an API",
      "No third-party AI: extraction runs on our servers or yours",
      "Tuned to your own document layouts during setup",
    ],
    timeline: "Set after the call",
    proof: { text: "Built on Scriblane, our own document processing product, which reads 14 file types.", href: "/products/scriblane", label: "About Scriblane" },
  },
]

export const categoryById = (id: CategoryId): Category => CATEGORIES.find((c) => c.id === id)!
export const offersIn = (id: CategoryId): Offer[] => OFFERS.filter((o) => o.category === id)
export const offerHref = (o: Offer): string => `${categoryById(o.category).href}/${o.slug}`
export const findOffer = (category: CategoryId, slug: string): Offer | undefined => OFFERS.find((o) => o.category === category && o.slug === slug)

/** An option's price as the site shows it: the price book's own label, or quoted after a call. */
export const offerPrice = (o: Offer): string => (o.planId ? chargeLabel(plan(o.planId).charges[0], "US") : "Quoted after a short call")
