import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, FileText, Workflow } from "lucide-react"

import { FoundingBanner } from "@/components/pricing/founding-banner"
import { PriceList } from "@/components/pricing/price-list"
import { ServiceCard } from "@/components/services/service-card"
import { ServicesFaq } from "@/components/services/services-faq"
import { SpecsTable } from "@/components/services/specs-table"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { ProcessWheel } from "@/components/process/process-wheel"
import { LANES, type LaneId } from "@/lib/lanes"
import { OFFERS } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"

export const metadata: Metadata = {
  title: "Solutions · Botlane",
  description: "Websites and web apps, designed and built end to end. Clear, fixed prices in US dollars.",
}

const founding = OFFERS.find((o) => o.id === "founding-ten")!

const PRODUCT_ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = {
  syncc: CalendarDays,
  scriblane: FileText,
  flowlane: Workflow,
}


function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-20 gap-8 border-t border-border/60 py-12 sm:py-16">
      <div className="grid max-w-2xl gap-3">
        <span className="label-mono">{eyebrow}</span>
        <h2 id={`${id}-title`} className="text-3xl font-medium tracking-tight text-balance">{title}</h2>
        {intro && <p className="text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

export default async function Solutions() {
  const status = await offerStatus(founding)
  const offerFor = (id: string) => (status.open && founding.appliesTo.includes(id) ? founding : null)

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="glow-brand flex flex-wrap items-end justify-between gap-6 py-12 sm:py-20">
          <div className="grid max-w-3xl justify-items-start gap-5">
            <FoundingBanner status={status} />
            <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">Websites and web apps, built properly.</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              We design and build every project end to end, to the standard of the best software companies. Every price is fixed
              before we start.
            </p>
          </div>
        </header>

        <Section id="websites" eyebrow="WEBSITES · ONE-TIME" title="Three kinds of website, by what your business needs.">
          <div className="grid gap-5 lg:grid-cols-3">
            <ServiceCard planId="website-core" offer={offerFor("website-core")} />
            <ServiceCard planId="website-ascend" offer={offerFor("website-ascend")} />
            <ServiceCard planId="website-apex" offer={offerFor("website-apex")} />
          </div>
          <SpecsTable planIds={["website-core", "website-ascend", "website-apex"]} caption="Website tiers compared" />
        </Section>

        <Section
          id="apps"
          eyebrow="WEB APPS · BY STAGE"
          title="Plan it, prove it, then build it."
          intro="We price apps by stage, not by type. Client portals, booking systems, internal tools, dashboards, SaaS products and marketplaces all go through the same three steps."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <ServiceCard planId="app-scoping" eyebrow="01 · PLAN" offer={offerFor("app-scoping")} cta="Book a sprint" />
            <ServiceCard planId="app-prototype" eyebrow="02 · PROVE" offer={offerFor("app-prototype")} cta="Talk to us" />
            <ServiceCard planId="app-full" eyebrow="03 · BUILD" offer={offerFor("app-full")} cta="Talk to us" />
          </div>
        </Section>

        <Section id="care" eyebrow="AFTER LAUNCH" title="Care, and an assistant that knows your business.">
          <div className="grid gap-5 lg:grid-cols-3">
            <ServiceCard planId="care" cta="Add Care" />
            <ServiceCard planId="care-plus" cta="Add Care Plus" />
            <ServiceCard planId="ai-assistant" cta="Add the assistant" />
          </div>
          <PriceList offeringId="care" only={["extra-work"]} />
        </Section>

        <Section id="process" eyebrow="HOW WE WORK" title="From first call to launch.">
          <ProcessWheel />
        </Section>

        <Section
          id="products"
          eyebrow="OUR OWN PRODUCTS"
          title="We build software for ourselves, too."
          intro="We're a new studio, so we don't have client work to show yet. Instead, here is what we've built for ourselves, to the same standard."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {LANES.map((l) => {
              const Icon = PRODUCT_ICONS[l.id]
              return (
                <article key={l.id} className={`${l.scope} surface-tinted flex flex-col gap-4 p-5`}>
                  <div className="flex items-center gap-3">
                    <span className="tile-depth size-10"><Icon className="size-[18px]" /></span>
                    <h3>{l.name}</h3>
                    {l.status === "soon" && <span className="label-mono ml-auto">soon</span>}
                  </div>
                  <p className="text-sm text-foreground/85">{l.tagline}</p>
                </article>
              )
            })}
          </div>
        </Section>

        <Section id="faq" eyebrow="QUESTIONS" title="What people ask before they hire us.">
          <ServicesFaq />
        </Section>

        <section aria-labelledby="cta-title" className="surface-glass my-16 flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="grid gap-2">
            <h2 id="cta-title" className="text-2xl font-medium tracking-tight">Tell us what you&apos;re building.</h2>
            <p className="text-muted-foreground">We&apos;ll reply with a plan, a timeline and a fixed price.</p>
          </div>
          <Link href="/contact" className="btn-light inline-flex h-10 items-center px-5 text-sm font-medium">Start a project</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
