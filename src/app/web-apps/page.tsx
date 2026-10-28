import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { OfferCard } from "@/components/catalog/offer-card"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { categoryById, offersIn } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Web apps · Botlane",
  description: "Client portals, booking systems, internal tools and SaaS products: a scoping sprint, an MVP, then the full product, each at a fixed price.",
}

const cat = categoryById("web-apps")
const STEPS = ["01 · PLAN", "02 · PROVE", "03 · BUILD"]

/** The web apps hub: the three stages side by side, and how pricing works. */
export default function WebApps() {
  return (
    <PageShell current={cat.href} banner={<FoundingBanner />} eyebrow={cat.eyebrow} title={cat.title} intro={cat.intro}>
      <PageSection id="stages" eyebrow="THE STAGES" title="Plan it, prove it, then build it.">
        <div className="grid gap-5 lg:grid-cols-3">
          {offersIn("web-apps").map((o, i) => <OfferCard key={o.slug} offer={o} step={STEPS[i]} />)}
        </div>
      </PageSection>
      <PageSection
        id="pricing"
        eyebrow="HOW PRICING WORKS"
        title="A fixed quote before the build, not a guess."
        intro="Client portals, booking systems, internal tools, dashboards, SaaS products and marketplaces all go through the same stages. The sprint is credited towards your build, and you can stop after any stage."
      >
        <Link href="/care" className="surface-hairline flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-foreground/[0.03]">
          <span className="max-w-xl flex-1 text-muted-foreground">After launch, Care keeps the app hosted, updated and backed up, with hours for small changes each month.</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">About Care <ArrowRight className="size-3.5" /></span>
        </Link>
      </PageSection>
    </PageShell>
  )
}
