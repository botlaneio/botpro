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

// Three things that hold for every project, beside the questions.
const FACTS = [
  ["Fixed price", "agreed in writing before work starts."],
  ["Yours to keep", "the site is yours after launch."],
  ["Straight answers", "we'll say so if we're not the right fit."],
]

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
      <section id="faq" aria-labelledby="faq-title" className="grid scroll-mt-20 gap-10 border-t border-border/60 py-12 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-16">
        <div className="grid content-start justify-items-start gap-5">
          <span className="text-lg font-medium text-(--red-text)">Questions</span>
          <h2 id="faq-title" className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">What people ask before they hire us.</h2>
          <p className="max-w-md text-muted-foreground">Open a question for the straight answer. Anything else, ask us in your brief.</p>
          <dl className="mt-4 grid gap-2.5 text-[15px]">
            {FACTS.map(([term, detail]) => (
              <div key={term}>
                <dt className="inline font-semibold">{term}: </dt>
                <dd className="inline text-muted-foreground">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ServicesFaq />
      </section>
    </PageShell>
  )
}
