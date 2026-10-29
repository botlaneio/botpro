import { categoryById, offerHref, offerPrice, offersIn, type CategoryId, type OfferIcon } from "@/lib/catalog"
import { LANES, type LaneId } from "@/lib/lanes"
import { chargeLabel, plan } from "@/lib/pricing"

import { SiteNav, type Hue, type NavMenu, type NavSection } from "./site-nav"

// The website packages go by their package names in the menu.
const WEBSITE_MENU_NAMES: Record<string, string> = {
  "business-sites": "Core",
  "company-sites": "Ascend",
  "brand-sites": "Apex",
}

// The plain links beside the menus: pages only, never sections of one.
const LINKS = [{ href: "/blog", label: "Insights" }]

// Each offer's own colour, for its icon tile: neighbours never share one, so a column reads as a set.
const OFFER_HUE: Record<OfferIcon, Hue> = {
  business: "teal", company: "blue", brand: "violet",
  scoping: "ember", mvp: "orchid", full: "blue",
  assistant: "violet", automation: "teal", documents: "ember",
}
const LANE_HUE: Record<LaneId, Hue> = { syncc: "teal", scriblane: "violet", flowlane: "orchid" }

// Each category's place in the menu: its colour and icon in the list, a line under its name, and the card beside its offers.
const CATEGORY: Record<CategoryId, { hue: Hue; line: string; feature: (first: string) => NavSection["feature"] }> = {
  websites: {
    hue: "blue",
    line: "Core, Ascend and Apex",
    feature: () => ({ kicker: "COMPARE", title: "Not sure which package fits?", cta: "See them side by side", href: "/websites" }),
  },
  "web-apps": {
    hue: "ember",
    line: "Planned and priced in stages",
    feature: (first) => ({ kicker: "START HERE", title: "A scoping sprint, credited to your build.", cta: "How it works", href: first }),
  },
  "custom-solutions": {
    hue: "violet",
    line: "AI and automation, built around you",
    feature: () => ({ kicker: "TALK TO US", title: "Each one is shaped and quoted after a short call.", cta: "Book an intro", href: "/contact?need=custom" }),
  },
}

// A product's line for its card: shorter than its tagline, so the cards stay even.
const LANE_LINE: Record<LaneId, string> = {
  syncc: "Booking pages on your own domain.",
  scriblane: "Documents in, checked data out.",
  flowlane: "Automation across 700+ apps.",
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

// "$2,500 one-time" → "$2,500"; "Quoted after a short call" → "Quoted".
const compact = (price: string) => (price.startsWith("Quoted") ? "Quoted" : price.replace(/ one-time$/, ""))

/** The navigation on every page: Solutions and Products, which open a panel each, Insights, and the main action. */
export function SiteHeader() {
  const section = (id: CategoryId): NavSection => {
    const cat = categoryById(id)
    const offers = offersIn(id)
    const c = CATEGORY[id]
    return {
      id,
      label: cat.label,
      line: c.line,
      hue: c.hue,
      href: cat.href,
      all: `All ${cat.label}`,
      feature: c.feature(offers[0] ? offerHref(offers[0]) : cat.href),
      cards: offers.map((o) => ({
        href: offerHref(o),
        title: WEBSITE_MENU_NAMES[o.slug] ?? o.name,
        body: cap(id === "websites" ? o.menu.replace(/^[^·]+·\s*/, "") : o.menu),
        meta: compact(offerPrice(o)),
        icon: o.icon,
        hue: OFFER_HUE[o.icon],
      })),
    }
  }
  const menus: NavMenu[] = [
    {
      label: "Solutions",
      line: "Websites, web apps, AI and automation",
      sections: [section("websites"), section("web-apps"), section("custom-solutions")],
      after: { label: "Care", href: "/care", meta: `From ${chargeLabel(plan("care").charges[0], "US")}` },
    },
    {
      label: "Products",
      line: "Syncc, Scriblane, Flowlane",
      sections: [{
        id: "products",
        label: "Built and run by us",
        line: "Software we build and run ourselves.",
        hue: "teal",
        href: "/products",
        all: "All products",
        cards: LANES.map((l) => ({ href: `/products/${l.id}`, title: l.name, body: LANE_LINE[l.id], meta: l.status === "live" ? l.host : "Opening soon", icon: l.id, hue: LANE_HUE[l.id], soon: l.status === "soon" })),
      }],
    },
  ]
  return <SiteNav menus={menus} links={LINKS} />
}

// The footer lives in its own file; pages import it from here alongside the header.
export { SiteFooter } from "./site-footer"
