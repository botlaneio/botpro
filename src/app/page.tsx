import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HeroPrompt } from "@/components/home/hero-prompt"
import { HeroScene } from "@/components/home/hero-scene"
import { PetalReveal } from "@/components/home/petal-reveal"
import { ProductCards } from "@/components/home/product-cards"
import { StackOrbit } from "@/components/home/stack-orbit"
import { StatCards, type Stat } from "@/components/home/stat-cards"
import { ServiceBlocks } from "@/components/home/service-blocks"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { ProcessWheel } from "@/components/process/process-wheel"
import { SOLUTIONS } from "@/lib/nav"
import { HOME_PROCESS, HOME_PRODUCTS, HOME_SERVICE_COPY } from "@/lib/home-copy"
import { LANES } from "@/lib/lanes"
import { OFFERS } from "@/lib/pricing"
import { PRODUCT_NUMBERS } from "@/lib/products"

export const metadata: Metadata = {
  title: "Botlane · Experiences. Worth putting your name on.",
  description: "Custom websites and software, designed around your business. A clear scope and an agreed price before each project begins.",
}

// Only true numbers: what we have built. The product count and the discount come from the data they describe.
const founding = OFFERS.find((o) => o.id === "founding-ten")!
const STATS: Stat[] = [
  { value: LANES.length, label: "products built and run in-house" },
  { value: PRODUCT_NUMBERS.flowlaneIntegrations, suffix: "+", label: "app integrations in Flowlane" },
  { value: PRODUCT_NUMBERS.scriblaneFileTypes, label: "file types Scriblane can read" },
  { value: Math.round(founding.discount * 100), suffix: "%", label: `off for our first ${founding.places} clients` },
]

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-20 gap-8 border-t border-border/60 py-14 sm:gap-10 sm:py-20">
      <div className="grid max-w-2xl gap-3">
        <span className="label-mono">{eyebrow}</span>
        <h2 id={`${id}-title`} className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">{title}</h2>
        {intro && <p className="text-lg text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

export default function Home() {
  const solutions = SOLUTIONS.flatMap((g) => g.items).map((item) => ({ ...item, ...HOME_SERVICE_COPY[item.icon] }))
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        {/* The hero: one scene, Build, Launch and Care, played round the client's site. */}
        <header className="glow-brand relative">
          <HeroScene className="h-[calc(100svh-var(--header-h))] min-h-[640px] max-h-[920px]" />
        </header>

        {/* The brief: the prompt bar, under the scene that shows what happens next. */}
        <section id="brief" aria-labelledby="brief-title" className="grid scroll-mt-20 justify-items-center gap-6 border-t border-border/60 py-14 text-center sm:py-20">
          <h2 id="brief-title" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">What do you have in mind?</h2>
          <div className="w-full"><HeroPrompt /></div>
        </section>

        {/* What we do: the words and the main action on the left, four service blocks on the right. */}
        <section id="build" aria-labelledby="build-title" className="grid scroll-mt-20 items-center gap-10 border-t border-border/60 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className="grid max-w-md content-start gap-4">
            <span className="label-mono">WHAT WE BUILD</span>
            <h2 id="build-title" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">The right build. For where you’re headed.</h2>
            <p className="text-lg text-muted-foreground">Custom websites, web apps, and ongoing support. A clear scope and an agreed price before each project begins.</p>
            <Link href="/solutions" className="btn-light mt-2 inline-flex h-10 w-fit items-center gap-1.5 px-5 text-sm font-medium">Explore services &amp; pricing <ArrowRight className="size-4" /></Link>
          </div>
          <ServiceBlocks items={solutions} />
        </section>

        {/* Works with your stack: the words in a row above, the orbit full width below. */}
        <section id="stack" aria-labelledby="stack-title" className="grid scroll-mt-20 gap-8 border-t border-border/60 py-14 sm:gap-10 sm:py-20">
          <div className="grid items-end gap-4 lg:grid-cols-2">
            <div className="grid gap-3">
              <span className="label-mono">WORKS WITH YOUR TOOLS</span>
              <h2 id="stack-title" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">A new website. A familiar way of working.</h2>
            </div>
            <div className="grid gap-3 lg:justify-items-end lg:text-right">
              <p className="max-w-md text-muted-foreground text-pretty">Keep the tools your team knows. We connect your website or app to your calendar, payments, CRM, and other business systems, so information gets where it needs to go.</p>
              <Link href="/custom-solutions/workflow-automation" className="group/a inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                Explore workflow automation <ArrowRight className="size-3.5 transition-transform group-hover/a:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <StackOrbit />
        </section>

        <Section
          id="products"
          eyebrow="OUR OWN PRODUCTS"
          title="Our ideas. Out in the world."
          intro="We also design and build our own software. Explore our work in scheduling, document processing, and automation."
        >
          <ProductCards copy={HOME_PRODUCTS} />
          <StatCards stats={STATS} />
        </Section>

        <Section id="process" eyebrow="HOW WE WORK" title="A clear process. Room for your input.">
          <ProcessWheel steps={HOME_PROCESS} />
        </Section>

        <section aria-labelledby="cta-title" className="my-14 sm:my-20">
          {/* The flower in X-ray, with boxes opening onto it in colour. The panel sits under it on phones and
              in the clear black to its left from lg, so the flower is never behind glass. */}
          <PetalReveal className="grid min-h-[48rem] items-end justify-items-center rounded-[1.6rem] p-4 sm:p-10 lg:aspect-[16/9] lg:min-h-0 lg:items-center lg:justify-items-start">
            <div className="surface-frosted grid w-full max-w-md justify-items-start gap-5 p-7 text-left sm:p-9 lg:max-w-[22rem] lg:p-8">
              <FoundingBanner />
              <h2 id="cta-title" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">Let&apos;s make it happen.</h2>
              <p className="max-w-md text-muted-foreground">Tell us what you have in mind. We’ll help you find the right place to start.</p>
              <div className="grid justify-items-start gap-2">
                <Link href="/contact" className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">Start a project <ArrowRight className="size-4" /></Link>
                <Link href="/solutions" className="inline-flex h-10 items-center text-sm text-muted-foreground hover:text-foreground">Explore services &amp; pricing</Link>
              </div>
            </div>
          </PetalReveal>
        </section>
      </main>
      <SiteFooter description="Independent design and engineering. From first idea to life after launch." />
    </>
  )
}
