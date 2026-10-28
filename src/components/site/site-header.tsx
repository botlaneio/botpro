import { categoryById, offerHref, offerPrice, offersIn, type CategoryId } from "@/lib/catalog"
import { LANES } from "@/lib/lanes"

import { SiteNav, type NavEntry, type NavMenu } from "./site-nav"

// The plain links beside the menus: pages only, never sections of one. Contact sits with the actions on the right.
const LINKS = [{ href: "/blog", label: "Insights" }]

/** The navigation on every page: one Solutions menu in four columns, Insights, and the main action. */
export function SiteHeader() {
  const column = (id: CategoryId) => {
    const cat = categoryById(id)
    return { heading: cat.label, href: cat.href, entries: offersIn(id).map((o): NavEntry => ({ href: offerHref(o), title: o.name, body: `${o.menu}. ${offerPrice(o)}.`, icon: o.icon, tone: cat.tone })) }
  }
  const menus: NavMenu[] = [
    {
      label: "Solutions",
      groups: [
        column("websites"),
        column("web-apps"),
        column("custom-solutions"),
        {
          heading: "Products",
          href: "/products",
          entries: LANES.map((l): NavEntry => ({ href: `/products/${l.id}`, title: l.name, body: l.tagline, icon: l.id, soon: l.status === "soon" })),
        },
      ],
    },
  ]
  return <SiteNav menus={menus} links={LINKS} />
}

// The footer lives in its own file; pages import it from here alongside the header.
export { SiteFooter } from "./site-footer"
