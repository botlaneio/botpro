import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HeroPrompt } from "@/components/home/hero-prompt"
import { ProductCards } from "@/components/home/product-cards"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { BotlaneMark } from "@/components/site/botlane-mark"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { NAV_ICONS } from "@/components/site/nav-icons"
import { SOLUTIONS } from "@/lib/nav"
import { STEPS } from "@/lib/process"

export const metadata: Metadata = {
  title: "Botlane · Websites and web apps, built properly",
  description: "We design and build websites and web apps to the standard of the best software companies, at a fixed price agreed before we start.",
}

function Section({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-20 gap-10 border-t border-border/60 py-20">
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
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="glow-brand grid justify-items-center gap-6 pt-20 pb-24 text-center sm:pt-28">
          <BotlaneMark size={88} id="hero-mark" />
          <h1 className="text-5xl font-medium tracking-[-0.035em] text-balance sm:text-7xl">What are you building?</h1>
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            We design and build websites and web apps to the standard of the best software companies, at a fixed price agreed before we start.
          </p>
          <div className="mt-4 w-full"><HeroPrompt /></div>
        </header>

        <Section id="build" eyebrow="WHAT WE BUILD" title="Websites, web apps, and the care after launch.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((s) => {
              const Icon = NAV_ICONS[s.icon]
              return (
                <Link key={s.title} href={s.href} className="surface-glass group/s grid content-start gap-3 p-5 transition-transform duration-300 ease-(--ease-lift) hover:-translate-y-0.5">
                  <span className="tile-depth size-10 text-foreground/85"><Icon className="size-[18px]" /></span>
                  <span className="flex items-center gap-2 font-medium">
                    {s.title}
                    <ArrowRight aria-hidden className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,translate] duration-300 group-hover/s:translate-x-0 group-hover/s:opacity-100" />
                  </span>
                  <span className="text-sm text-muted-foreground">{s.body}</span>
                  <span className="label-mono text-[11px] text-foreground/60">{s.price}</span>
                </Link>
              )
            })}
          </div>
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
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.title} className="grid content-start gap-2 border-t border-border pt-4">
                <span className="label-mono">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <section aria-labelledby="cta-title" className="surface-glass my-20 grid justify-items-start gap-5 p-8 sm:p-12">
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
