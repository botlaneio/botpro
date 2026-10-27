import { LANES } from "@/lib/lanes"
import { SOLUTIONS } from "@/lib/nav"
import { OFFERS } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"

import { PillNav, type PillMenu } from "./pill-nav"
import type { FoundingCard } from "./solutions-menu"

// The plain links beside the menus.
const LINKS = [
  { href: "/solutions#process", label: "How we work" },
  { href: "/contact", label: "Contact" },
]

const founding = OFFERS.find((o) => o.id === "founding-ten")!

/** The Founding Ten as the menu shows it, from the live count, or null once it has closed. */
async function foundingCard(): Promise<FoundingCard | null> {
  const s = await offerStatus(founding)
  if (!s.open) return null
  return {
    discount: `${Math.round(founding.discount * 100)}%`,
    places: founding.places,
    placesLeft: s.placesLeft,
    endsOn: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${founding.endsOn}T00:00:00Z`)),
  }
}

/** The navigation on every page: a floating pill with the Solutions and Products menus and the main action. */
export async function SiteHeader() {
  const card = await foundingCard()
  const menus: PillMenu[] = [
    {
      label: "Solutions",
      eyebrow: "Solutions",
      blurb: card
        ? `Websites and web apps at a fixed price agreed before we start. Founding Ten: ${card.discount} off for our first ${card.places} clients.`
        : "Websites and web apps at a fixed price agreed before we start, and the care after launch.",
      all: { href: "/solutions", label: "All solutions" },
      links: SOLUTIONS.flatMap((g) => g.items).map((i) => ({ href: i.href, title: i.title, body: i.body, meta: i.price, icon: i.icon })),
    },
    {
      label: "Products",
      eyebrow: "Our products",
      blurb: "Software we build and run ourselves, to the same standard as client work.",
      all: { href: "/products", label: "All products" },
      links: LANES.map((l) => ({ href: `https://${l.host}`, title: l.name, body: l.tagline, icon: l.id, external: true, soon: l.status === "soon" })),
    },
  ]
  return <PillNav menus={menus} links={LINKS} />
}

// The footer lives in its own file; pages import it from here alongside the header.
export { SiteFooter } from "./site-footer"
