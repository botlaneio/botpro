import type { Metadata } from "next"

import { FoundingBanner } from "@/components/pricing/founding-banner"
import { ServiceCard } from "@/components/services/service-card"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { OFFERS } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"

export const metadata: Metadata = {
  title: "Web apps · Botlane",
  description: "Client portals, booking systems, internal tools and SaaS products, priced by stage: plan it, prove it, then build it.",
}

const founding = OFFERS.find((o) => o.id === "founding-ten")!

export default async function WebApps() {
  const status = await offerStatus(founding)
  const offerFor = (id: string) => (status.open && founding.appliesTo.includes(id) ? founding : null)
  return (
    <PageShell
      current="/web-apps"
      banner={<FoundingBanner status={status} />}
      eyebrow="WEB APPS · BY STAGE"
      title="Plan it, prove it, then build it."
      intro="We price apps by stage, not by type. Client portals, booking systems, internal tools, dashboards, SaaS products and marketplaces all go through the same three steps, each at a fixed price."
    >
      <PageSection id="stages" eyebrow="THE STAGES" title="Three steps, and you can stop after any of them.">
        <div className="grid gap-5 lg:grid-cols-3">
          <ServiceCard planId="app-scoping" eyebrow="01 · PLAN" offer={offerFor("app-scoping")} cta="Book a sprint" />
          <ServiceCard planId="app-prototype" eyebrow="02 · PROVE" offer={offerFor("app-prototype")} cta="Talk to us" />
          <ServiceCard planId="app-full" eyebrow="03 · BUILD" offer={offerFor("app-full")} cta="Talk to us" />
        </div>
      </PageSection>
    </PageShell>
  )
}
