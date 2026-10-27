import type { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"
import { CalendarDays, FileText, Workflow } from "lucide-react"

import { FoundingBanner } from "@/components/pricing/founding-banner"
import { PriceList } from "@/components/pricing/price-list"
import { RegionProvider, RegionSwitch, TaxNote } from "@/components/pricing/region"
import { ServiceCard } from "@/components/services/service-card"
import { ServicesFaq } from "@/components/services/services-faq"
import { SpecsTable } from "@/components/services/specs-table"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { LANES, type LaneId } from "@/lib/lanes"
import { OFFERS, regionFor } from "@/lib/pricing"
import { offerStatus } from "@/lib/pricing/offer-status"

export const metadata: Metadata = {
  title: "Services · Botlane",
  description: "Websites and web apps, designed and built end to end. Clear prices in dollars and rupees.",
}

const founding = OFFERS.find((o) => o.id === "founding-ten")!

const PRODUCT_ICONS: Record<LaneId, React.ComponentType<{ className?: string }>> = {
  syncc: CalendarDays,
  scriblane: FileText,
  flowlane: Workflow,
}

// What happens from first call to launch. Order matters, so the steps are numbered.
const STEPS = [
  { title: "Intro call", body: "You tell us what you need. We tell you honestly whether we're the right fit." },
  { title: "Scope and fixed quote", body: "A written scope, a timeline and one price, agreed before any work starts." },
  { title: "Design", body: "A custom design you review in rounds, on real content, not lorem ipsum." },
  { title: "Build", body: "We build it, share progress as we go, and test it on every screen size." },
  { title: "Launch", body: "We put it live, hand over everything, and stay on with Care if you want us to." },
]

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-20 gap-8 border-t border-border/60 py-16">
      <div className="grid max-w-2xl gap-3">
        <span className="label-mono">{eyebrow}</span>
        <h2 id={`${id}-title`} className="text-3xl font-medium tracking-tight text-balance">{title}</h2>
        {intro && <p className="text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

export default async function Services() {
  const h = await headers()
  const region = regionFor(h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry"))
  const status = await offerStatus(founding)
  const offerFor = (id: string) => (status.open && founding.appliesTo.includes(id) ? founding : null)

  return (
    <RegionProvider initial={region}>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="flex flex-wrap items-end justify-between gap-6 py-20">
          <div className="grid max-w-3xl gap-4">
            <span className="label-mono">SERVICES</span>
            <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">Websites and web apps, built properly.</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              We design and build every project end to end, to the standard of the best software companies. Every price is fixed
              before we start.
            </p>
          </div>
          <RegionSwitch />
        </header>

        <FoundingBanner status={status} />

        <Section id="websites" eyebrow="WEBSITES · ONE-TIME" title="Three kinds of website, by what your business needs.">
          <div className="grid gap-5 lg:grid-cols-3">
            <ServiceCard planId="website-starter" offer={offerFor("website-starter")} />
            <ServiceCard planId="website-business" offer={offerFor("website-business")} featured />
            <ServiceCard planId="website-pro" offer={offerFor("website-pro")} />
          </div>
          <SpecsTable planIds={["website-starter", "website-business", "website-pro"]} caption="Website tiers compared" />
        </Section>

        <Section
          id="apps"
          eyebrow="WEB APPS · BY STAGE"
          title="Plan it, prove it, then build it."
          intro="We price apps by stage, not by type. Client portals, booking systems, internal tools, dashboards, SaaS products and marketplaces all go through the same three steps."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <ServiceCard planId="app-scoping" eyebrow="01 · PLAN" offer={offerFor("app-scoping")} cta="Book a sprint" />
            <ServiceCard planId="app-prototype" eyebrow="02 · PROVE" offer={offerFor("app-prototype")} featured cta="Talk to us" />
            <ServiceCard planId="app-full" eyebrow="03 · BUILD" offer={offerFor("app-full")} cta="Talk to us" />
          </div>
        </Section>

        <Section id="care" eyebrow="AFTER LAUNCH" title="Care, and an assistant that knows your business.">
          <div className="grid gap-5 lg:grid-cols-3">
            <ServiceCard planId="care" cta="Add Care" />
            <ServiceCard planId="care-plus" featured cta="Add Care Plus" />
            <ServiceCard planId="ai-assistant" cta="Add the assistant" />
          </div>
          <PriceList offeringId="care" only={["extra-work"]} />
        </Section>

        <Section id="process" eyebrow="HOW WE WORK" title="From first call to launch.">
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid content-start gap-2">
                <span className="label-mono">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
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
          <TaxNote className="label-mono" />
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
    </RegionProvider>
  )
}
