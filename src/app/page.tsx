import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HeroPrompt } from "@/components/home/hero-prompt"
import { ProductCards } from "@/components/home/product-cards"
import { SolutionCards } from "@/components/home/solution-cards"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { BotlaneMark } from "@/components/site/botlane-mark"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { ProcessWheel } from "@/components/process/process-wheel"
import { SOLUTIONS } from "@/lib/nav"

export const metadata: Metadata = {
  title: "Botlane · Websites and web apps, built properly",
  description: "We design and build websites and web apps to the standard of the best software companies, at a fixed price agreed before we start.",
}

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
        <header className="glow-brand grid justify-items-center gap-5 pt-14 pb-16 text-center sm:gap-6 sm:pt-28 sm:pb-24">
          <BotlaneMark size={88} id="hero-mark" />
          <h1 className="text-[2.75rem] leading-[1.05] font-medium tracking-[-0.035em] text-balance sm:text-7xl">What are you building?</h1>
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            We design and build websites and web apps to the standard of the best software companies, at a fixed price agreed before we start.
          </p>
          <div className="mt-4 w-full"><HeroPrompt /></div>
        </header>

        <Section id="build" eyebrow="WHAT WE BUILD" title="Websites, web apps, and the care after launch.">
          <SolutionCards items={solutions} />
        </Section>

        <Section
          id="products"
          eyebrow="OUR OWN PRODUCTS"
          title="We build software for ourselves, too."
          intro="We're a new studio, so there's no client work to show yet. Instead, here is what we've built and run ourselves, to the same standard."
        >
          <ProductCards />
        </Section>

        <Section id="process" eyebrow="HOW WE WORK" title="From first call to launch, at one fixed price.">
          <ProcessWheel />
        </Section>

        <section aria-labelledby="cta-title" className="surface-glass my-14 grid justify-items-start gap-5 p-6 sm:my-20 sm:p-12">
          <FoundingBanner />
          <h2 id="cta-title" className="max-w-xl text-3xl font-medium tracking-tight text-balance sm:text-4xl">Tell us what you&apos;re building.</h2>
          <p className="max-w-lg text-muted-foreground">We read every brief ourselves, and we&apos;ll tell you honestly whether we&apos;re the right fit.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/contact" className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">Start a project <ArrowRight className="size-4" /></Link>
            <Link href="/solutions" className="inline-flex h-10 items-center px-3 text-sm text-muted-foreground hover:text-foreground">See solutions and prices</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
