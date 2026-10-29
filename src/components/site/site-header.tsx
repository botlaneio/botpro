import { categoryById, offerHref, offerPrice, offersIn, type CategoryId } from "@/lib/catalog"
import { LANES, type LaneId } from "@/lib/lanes"

import { SiteNav, type NavMenu, type NavSection } from "./site-nav"

// The plain links beside the menus: pages only, never sections of one. Contact sits with the actions on the right.
const WEBSITE_MENU_NAMES: Record<string, string> = {
  "business-sites": "Core",
  "company-sites": "Ascend",
  "brand-sites": "Apex",
}

const LINKS = [{ href: "/blog", label: "Insights" }]

// Each category's light, for its cards in the menu.
const GLOW: Record<CategoryId, string> = { websites: "var(--blue-solid)", "web-apps": "var(--ember-solid)", "custom-solutions": "var(--violet-solid)" }
// Each product's light and icon colour, from its lane.
const LANE_GLOW: Record<LaneId, string> = { syncc: "var(--teal-solid)", scriblane: "var(--violet-solid)", flowlane: "var(--orchid-solid)" }
const LANE_TONE: Record<LaneId, string> = { syncc: "text-(--teal-text)", scriblane: "text-(--violet-text)", flowlane: "text-(--orchid-text)" }
// A product's line for its card: shorter than its tagline, so the cards stay even.
const LANE_LINE: Record<LaneId, string> = {
  syncc: "Booking pages on your own domain.",
  scriblane: "Documents in, checked data out.",
  flowlane: "Automation across 700+ apps.",
}

/** The navigation on every page: Solutions and Products, which open one wide panel, Insights, and the main action. */
export function SiteHeader() {
  const section = (id: CategoryId): NavSection => {
    const cat = categoryById(id)
    return {
      label: cat.label,
      href: cat.href,
      all: `All ${cat.label.toLowerCase()}`,
      cards: offersIn(id).map((o) => ({ href: offerHref(o), title: WEBSITE_MENU_NAMES[o.slug] ?? o.name, body: id === "websites" ? o.menu.replace(/^[^·]+·\s*/, "") : o.menu, meta: offerPrice(o), icon: o.icon, glow: GLOW[id], tone: cat.tone })),
    }
  }
  const menus: NavMenu[] = [
    { label: "Solutions", sections: [section("websites"), section("web-apps"), section("custom-solutions")] },
    {
      label: "Products",
      sections: [{
        label: "Built and run by us",
        href: "/products",
        all: "All products",
        cards: LANES.map((l) => ({ href: `/products/${l.id}`, title: l.name, body: LANE_LINE[l.id], meta: l.status === "live" ? `LIVE · ${l.host.toUpperCase()}` : "OPENING SOON", icon: l.id, glow: LANE_GLOW[l.id], tone: LANE_TONE[l.id], soon: l.status === "soon" })),
      }],
    },
  ]
  return <SiteNav menus={menus} links={LINKS} />
}

// The footer lives in its own file; pages import it from here alongside the header.
export { SiteFooter } from "./site-footer"
