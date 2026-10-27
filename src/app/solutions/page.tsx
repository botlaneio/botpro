import type { Metadata } from "next"

import { SolutionFlow } from "@/components/home/solution-flow"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { ProcessWheel } from "@/components/process/process-wheel"
import { ServicesFaq } from "@/components/services/services-faq"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { SOLUTIONS } from "@/lib/nav"

export const metadata: Metadata = {
  title: "Solutions · Botlane",
  description: "Websites and web apps, designed and built end to end, and the care after launch. Clear, fixed prices in US dollars.",
}

/** Every solution at a glance, each linking to its own page, then how we work and what people ask. */
export default function Solutions() {
  return (
    <PageShell
      banner={<FoundingBanner />}
      eyebrow="SOLUTIONS"
      title="Websites and web apps, built properly."
      intro="We design and build every project end to end, to the standard of the best software companies. Every price is fixed before we start."
    >
      <PageSection id="all" eyebrow="WHAT WE BUILD" title="From your brief to the care after launch.">
        <SolutionFlow items={SOLUTIONS.flatMap((g) => g.items)} />
      </PageSection>
      <PageSection id="process" eyebrow="HOW WE WORK" title="From first call to launch.">
        <ProcessWheel />
      </PageSection>
      <PageSection id="faq" eyebrow="QUESTIONS" title="What people ask before they hire us.">
        <ServicesFaq />
      </PageSection>
    </PageShell>
  )
}
