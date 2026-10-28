import type { Metadata } from "next"

import { PriceList } from "@/components/pricing/price-list"
import { CareSet } from "@/components/pricing/care-set"
import { PageSection, PageShell } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "Care · Botlane",
  description: "Hosting, security updates, backups and small edits for your site, handled every month.",
}

export default function Care() {
  return (
    <PageShell
      current="/care"
      eyebrow="AFTER LAUNCH · MONTHLY"
      title="Care for your site after launch."
      intro="Hosting, security updates, backups and small edits, handled every month, so the site stays fast, safe and current."
    >
      <PageSection id="plans" eyebrow="THE PLANS" title="Care and Care Plus.">
        <CareSet />
      </PageSection>
      <PageSection id="extra" eyebrow="BEYOND THE PLAN" title="Work outside your monthly hours.">
        <PriceList offeringId="care" only={["extra-work"]} />
      </PageSection>
    </PageShell>
  )
}
