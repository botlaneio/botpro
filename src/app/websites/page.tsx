import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { OfferCard } from "@/components/catalog/offer-card"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { SpecsTable } from "@/components/services/specs-table"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { categoryById, offersIn } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Websites · Botlane",
  description: "Core, Ascend and Apex websites: custom-designed, at a fixed price agreed before we start.",
}

const cat = categoryById("websites")
const offers = offersIn("websites")

/** The websites hub: the three packages side by side, a full comparison, and the care after launch. */
export default function Websites() {
  return (
    <PageShell current={cat.href} banner={<FoundingBanner />} eyebrow={cat.eyebrow} title={cat.title} intro={cat.intro}>
      <PageSection id="packages" eyebrow="THE PACKAGES" title="Pick the one that fits where your business is.">
        <div className="grid gap-5 lg:grid-cols-3">
          {offers.map((o) => <OfferCard key={o.slug} offer={o} />)}
        </div>
      </PageSection>
      <PageSection id="compare" eyebrow="SIDE BY SIDE" title="What changes from package to package.">
        <SpecsTable planIds={offers.flatMap((o) => (o.planId ? [o.planId] : []))} caption="Website packages compared" />
      </PageSection>
      <PageSection id="after" eyebrow="AFTER LAUNCH" title="Care keeps it fast, safe and current.">
        <Link href="/care" className="surface-hairline flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-foreground/[0.03]">
          <span className="max-w-xl flex-1 text-muted-foreground">Hosting, security updates, backups and small edits, handled every month. Optional, and separate from the build.</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">About Care <ArrowRight className="size-3.5" /></span>
        </Link>
      </PageSection>
    </PageShell>
  )
}
