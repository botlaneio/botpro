import Link from "next/link"

import { SOLUTIONS, SOLUTIONS_MORE } from "@/lib/nav"
import { OFFERS } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"

import { BotlaneMark } from "./botlane-mark"
import { HeaderBar } from "./header-bar"
import { MobileMenu } from "./mobile-menu"
import { SolutionsMenu, type FoundingCard } from "./solutions-menu"
import { ThemeSwitch } from "./theme-switch"

// The plain links beside the Solutions menu, and in the footer with it.
const LINKS = [
  { href: "/#products", label: "Our products" },
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

/** The bar across the top of every page: the mark, the sections, and the main action. Clear until the page scrolls. */
export async function SiteHeader() {
  const card = await foundingCard()
  return (
    <HeaderBar>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-5 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <BotlaneMark size={26} id="header-mark" />
          <span className="font-semibold tracking-[-0.035em]">botlane</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 text-sm sm:flex">
          <SolutionsMenu groups={SOLUTIONS} more={SOLUTIONS_MORE} founding={card} />
          {LINKS.map((n) => (
            <Link key={n.href} href={n.href} className="px-2 text-muted-foreground transition-colors hover:text-foreground">{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <Link href="/contact" className="btn-light hidden h-8 items-center px-3 text-sm font-medium sm:inline-flex">
            Start a project
          </Link>
          <MobileMenu groups={SOLUTIONS} links={[...SOLUTIONS_MORE, ...LINKS]} />
        </div>
      </div>
    </HeaderBar>
  )
}

// The footer lives in its own file; pages import it from here alongside the header.
export { SiteFooter } from "./site-footer"
