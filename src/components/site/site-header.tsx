import { LANES } from "@/lib/lanes"
import { SOLUTIONS } from "@/lib/nav"
import { OFFERS } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"

import { SiteNav, type NavEntry, type NavMenu } from "./site-nav"

// The plain links beside the menus. Contact sits with the actions on the right.
const LINKS = [{ href: "/solutions#process", label: "How we work" }]

const founding = OFFERS.find((o) => o.id === "founding-ten")!

/** The Founding Ten as the menu mentions it, or null once it has closed. */
async function foundingCard(): Promise<{ discount: string; places: number } | null> {
  const s = await offerStatus(founding)
  if (!s.open) return null
  return { discount: `${Math.round(founding.discount * 100)}%`, places: founding.places }
}

/** The navigation on every page: the Solutions and Products menus, How we work, and the main action. */
export async function SiteHeader() {
  const card = await foundingCard()
  const solutions = SOLUTIONS.flatMap((g) => g.items)
  const entry = (i: (typeof solutions)[number]): NavEntry => ({ href: i.href, title: i.title, body: `${i.body} ${i.price}.`, icon: i.icon })
  const lane = (l: (typeof LANES)[number]): NavEntry => ({ href: `https://${l.host}`, title: l.name, body: l.tagline, icon: l.id, external: true, soon: l.status === "soon" })
  const menus: NavMenu[] = [
    {
      label: "Solutions",
      groups: [
        { heading: "Build", entries: solutions.filter((i) => i.icon === "websites" || i.icon === "apps").map(entry) },
        { heading: "After launch", entries: solutions.filter((i) => i.icon === "care" || i.icon === "assistant").map(entry) },
        {
          heading: "Start here",
          entries: [
            { href: "/solutions", title: "All solutions", body: card ? `Every price, fixed. ${card.discount} off for our first ${card.places} clients.` : "Every solution and price on one page.", icon: "all" },
            { href: "/solutions#process", title: "How we work", body: "From first call to launch, at one fixed price.", icon: "process" },
            { href: "/solutions#faq", title: "Questions", body: "What people ask before they hire us.", icon: "faq" },
          ],
        },
      ],
    },
    {
      label: "Products",
      groups: [
        { heading: "Live", entries: LANES.filter((l) => l.status === "live").map(lane) },
        { heading: "Opening soon", entries: LANES.filter((l) => l.status === "soon").map(lane) },
        { heading: "More", entries: [{ href: "/products", title: "All products", body: "What we build and run ourselves, to the same standard.", icon: "all" }] },
      ],
    },
  ]
  return <SiteNav menus={menus} links={LINKS} />
}

// The footer lives in its own file; pages import it from here alongside the header.
export { SiteFooter } from "./site-footer"
