import type { Metadata } from "next"

import { FoundingBanner } from "@/components/pricing/founding-banner"
import { ServiceCard } from "@/components/services/service-card"
import { SpecsTable } from "@/components/services/specs-table"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { OFFERS } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"

export const metadata: Metadata = {
  title: "Websites · Botlane",
  description: "Core, Ascend and Apex: custom-designed websites at a fixed price agreed before we start.",
}

const founding = OFFERS.find((o) => o.id === "founding-ten")!
const TIERS = ["website-core", "website-ascend", "website-apex"]

export default async function Websites() {
  const status = await offerStatus(founding)
  const offerFor = (id: string) => (status.open && founding.appliesTo.includes(id) ? founding : null)
  return (
    <PageShell
      current="/websites"
      banner={<FoundingBanner status={status} />}
      eyebrow="WEBSITES · ONE-TIME"
      title="Websites, designed for your business."
      intro="Custom design, no templates. Three tiers, by what your business needs, each at a fixed price agreed before we start."
    >
      <PageSection id="tiers" eyebrow="THE TIERS" title="Core, Ascend and Apex.">
        <div className="grid gap-5 lg:grid-cols-3">
          {TIERS.map((id) => <ServiceCard key={id} planId={id} offer={offerFor(id)} />)}
        </div>
      </PageSection>
      <PageSection id="compare" eyebrow="SIDE BY SIDE" title="What changes from tier to tier.">
        <SpecsTable planIds={TIERS} caption="Website tiers compared" />
      </PageSection>
    </PageShell>
  )
}
