import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HeroPrompt } from "@/components/home/hero-prompt"
import { HeroStory } from "@/components/home/hero-story"
import { PetalReveal } from "@/components/home/petal-reveal"
import { ProductCards } from "@/components/home/product-cards"
import { StackOrbit } from "@/components/home/stack-orbit"
import { StatCards, type Stat } from "@/components/home/stat-cards"
import { ServiceBlocks } from "@/components/home/service-blocks"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { HeroMark } from "@/components/site/hero-mark"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { ProcessWheel } from "@/components/process/process-wheel"
import { SOLUTIONS } from "@/lib/nav"
import { LANES } from "@/lib/lanes"
import { OFFERS } from "@/lib/pricing"
import { PRODUCT_NUMBERS } from "@/lib/products"

export const metadata: Metadata = {
  title: "Botlane · Websites and web apps, built properly",
  description: "We design and build websites and web apps to the standard of the best software companies, at a fixed price agreed before we start.",
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
  const solutions = SOLUTIONS.flatMap((g) => g.items)
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        <header className="glow-brand relative isolate grid min-h-[72svh] content-center sm:min-h-[calc(100svh-var(--header-h))] justify-items-center gap-5 py-10 text-center sm:gap-6">
          {/* Build, Launch, Care, played in hairlines either side of the prompt. Wide screens only: narrower,
              the sides are too small to keep clear of it. */}
          <HeroStory className="absolute bottom-0 left-1/2 -z-10 hidden h-full w-screen -translate-x-1/2 xl:block" />
          {/* A little more dark in the top-right corner, fading out well before the prompt. Dark theme only. */}
          <div aria-hidden className="pointer-events-none absolute top-[calc(-1*var(--header-h))] left-1/2 -z-10 hidden h-[calc(100%+var(--header-h))] w-screen -translate-x-1/2 bg-[radial-gradient(60%_70%_at_100%_0%,rgb(0_0_0/0.55),transparent_70%)] dark:block" />
          <HeroMark size={88} />
          <h1 className="sr-only">Botlane: websites and web apps, built properly</h1>
          <div className="mt-2 w-full"><HeroPrompt /></div>
        </header>

        {/* What we do: the words and the main action on the left, four service blocks on the right. */}
        <section id="build" aria-labelledby="build-title" className="grid scroll-mt-20 items-center gap-10 border-t border-border/60 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className="grid max-w-md content-start gap-4">
            <span className="label-mono">WHAT WE BUILD</span>
            <h2 id="build-title" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">Websites, web apps, and the care after launch.</h2>
            <p className="text-lg text-muted-foreground">Designed and built by us to the standard of the best software companies, at a fixed price agreed before we start.</p>
            <Link href="/contact" className="btn-light mt-2 inline-flex h-10 w-fit items-center gap-1.5 px-5 text-sm font-medium">Start a project <ArrowRight className="size-4" /></Link>
          </div>
          <ServiceBlocks items={solutions} />
        </section>

        {/* Works with your stack: the words in a row above, the orbit full width below. */}
        <section id="stack" aria-labelledby="stack-title" className="grid scroll-mt-20 gap-8 border-t border-border/60 py-14 sm:gap-10 sm:py-20">
          <div className="grid items-end gap-4 lg:grid-cols-2">
            <div className="grid gap-3">
              <span className="label-mono">WORKS WITH YOUR STACK</span>
              <h2 id="stack-title" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">Connected to the tools you already run.</h2>
            </div>
            <div className="grid gap-3 lg:justify-items-end lg:text-right">
              <p className="max-w-md text-muted-foreground text-pretty">We connect your site and systems to the apps your team already uses: Gmail, Stripe, HubSpot, Notion, Google Calendar, Meet and Zoom, and 700+ more through Flowlane, our own automation platform.</p>
              <Link href="/custom-solutions/workflow-automation" className="group/a inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                About workflow automation <ArrowRight className="size-3.5 transition-transform group-hover/a:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <StackOrbit />
        </section>

        <Section
          id="products"
          eyebrow="OUR OWN PRODUCTS"
          title="We build software for ourselves, too."
          intro="We're a new studio, so there's no client work to show yet. Instead, here is what we've built and run ourselves, to the same standard."
        >
          <ProductCards />
          <StatCards stats={STATS} />
        </Section>

        <Section id="process" eyebrow="HOW WE WORK" title="From first call to launch, at one fixed price.">
          <ProcessWheel />
        </Section>

        <section aria-labelledby="cta-title" className="my-14 sm:my-20">
          {/* The petals, washed out, with boxes opening onto them in colour; the panel floats in the clear middle. */}
          <PetalReveal className="grid min-h-[34rem] place-items-center rounded-[1.6rem] p-4 sm:aspect-[16/9] sm:min-h-0 sm:p-10">
            <div className="surface-frosted grid max-w-xl justify-items-center gap-5 p-6 text-center sm:p-10">
              <FoundingBanner />
              <h2 id="cta-title" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">Tell us what you&apos;re building.</h2>
              <p className="max-w-md text-muted-foreground">We read every brief ourselves, and we&apos;ll tell you honestly whether we&apos;re the right fit.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/contact" className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">Start a project <ArrowRight className="size-4" /></Link>
                <Link href="/solutions" className="inline-flex h-10 items-center px-3 text-sm text-muted-foreground hover:text-foreground">See solutions and prices</Link>
              </div>
            </div>
          </PetalReveal>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
