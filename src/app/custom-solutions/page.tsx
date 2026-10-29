import type { Metadata } from "next"

import { OfferCard } from "@/components/catalog/offer-card"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { categoryById, offersIn } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Custom Solutions · Botlane",
  description: "AI website assistants, workflow automation and document processing, built on the engines behind our own products and quoted after a short call.",
}

const cat = categoryById("custom-solutions")

// How a custom project runs, in three plain steps.
const HOW = [
  { n: "01", title: "A strategy call", body: "We learn how your team works today and where the time goes." },
  { n: "02", title: "A written scope and quote", body: "What we'll build, what it should save, and one price." },
  { n: "03", title: "Build and handover", body: "Set up, tuned to your data, and handed over so your team can run it." },
]

/** The custom solutions hub: three options built on our own products' engines, and how a project runs. */
export default function CustomSolutions() {
  return (
    <PageShell
      current={cat.href}
      eyebrow={cat.eyebrow}
      title={cat.title}
      intro={cat.intro}
      cta={{ title: "Tell us where the time goes.", body: "A short call to understand how you work, then a written scope and a quote.", label: cat.cta.label, href: `/contact?need=${cat.cta.need}` }}
    >
      <PageSection id="options" eyebrow="THE OPTIONS" title="Three ways we take work off your team's plate.">
        <div className="grid gap-5 lg:grid-cols-3">
          {offersIn("custom-solutions").map((o) => <OfferCard key={o.slug} offer={o} />)}
        </div>
      </PageSection>
      <PageSection id="how" eyebrow="HOW IT WORKS" title="From a short call to a working system.">
        <ol className="grid gap-3 sm:grid-cols-3">
          {HOW.map((s) => (
            <li key={s.n} className="surface-hairline grid content-start gap-2 p-5">
              <span className="label-mono text-[11px]">{s.n}</span>
              <span className="font-medium">{s.title}</span>
              <span className="text-sm text-muted-foreground">{s.body}</span>
            </li>
          ))}
        </ol>
      </PageSection>
    </PageShell>
  )
}
