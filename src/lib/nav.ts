/**
 * The site's navigation: what the Solutions menu offers, with prices read from the price book.
 * Server-side, so the menu ships plain strings and no price book to the browser.
 */
import { chargeLabel, money, offering, plan } from "./pricing/index.ts"

const REGION = "US" as const

export type NavIcon = "websites" | "apps" | "care" | "assistant"

export interface NavItem {
  href: string
  title: string
  body: string
  price: string
  icon: NavIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

const lowest = (offeringId: string) => Math.min(...offering(offeringId).plans.map((p) => p.charges[0].amounts[REGION]))

export const SOLUTIONS: NavGroup[] = [
  {
    label: "Build",
    items: [
      {
        href: "/websites",
        title: "Websites",
        body: "Core, Ascend and Apex. Custom design, no templates.",
        price: `From ${money(lowest("websites"), REGION)}`,
        icon: "websites",
      },
      {
        href: "/web-apps",
        title: "Web apps",
        body: "Plan it, prove it, then build it. Fixed price per stage.",
        price: `Scoping ${money(plan("app-scoping").charges[0].amounts[REGION], REGION)}`,
        icon: "apps",
      },
    ],
  },
  {
    label: "After launch",
    items: [
      {
        href: "/care",
        title: "Care",
        body: "Hosting, security updates and small edits, handled.",
        price: `From ${chargeLabel(plan("care").charges[0], REGION)}`,
        icon: "care",
      },
      {
        href: "/custom-solutions/ai-assistant",
        title: "AI Assistant",
        body: "Answers visitors' questions, trained on your business.",
        price: chargeLabel(plan("ai-assistant").charges[0], REGION),
        icon: "assistant",
      },
    ],
  },
]

