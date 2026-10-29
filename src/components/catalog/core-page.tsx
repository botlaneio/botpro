import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react"

import { FoundingBanner } from "@/components/pricing/founding-banner"
import { SiteHeader, SiteFooter } from "@/components/site/site-header"
import { offerPrice, type Offer } from "@/lib/catalog"
import { plan } from "@/lib/pricing"
import { STEPS } from "@/lib/process"
import { MilestoneTimeline } from "@/components/process/milestone-timeline"
import { CoreHeroPreview } from "./core-hero-preview"
import { CoreWorkShowcase } from "./core-work-showcase"
import { SiteShowcase } from "./site-showcase"

const PAGES = [
  ["01", "Home", "Make the first impression count.", "A clear introduction to your business, what you offer, and the next step."],
  ["02", "About", "Put people behind the business.", "Your story, your approach, and the reasons someone should choose you."],
  ["03", "Services", "Make your offer easy to understand.", "Explain what you do in the language your customers use."],
  ["04", "Your choice", "Room for what makes you different.", "A project, a location, a focused service, or another page your business needs."],
  ["05", "Contact", "Turn interest into a conversation.", "A simple contact form that brings enquiries straight to your inbox."],
]

/** Core has its own composition; other website packages keep their existing pages. */
export function CorePage({ offer }: { offer: Offer }) {
  const p = plan("website-core")
  const contact = "/contact?need=website"
  return <>
    <SiteHeader />
    <main className="mx-auto max-w-6xl px-6">
      <header className="glow-brand relative border-b border-border/70 pt-8 pb-12 sm:pt-12 sm:pb-16">
        <Link href="/websites" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground">Websites <span aria-hidden>/</span> <span className="text-foreground">Core</span></Link>
        <div className="grid items-center gap-12 pt-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="grid justify-items-start gap-6">
            <span className="label-mono flex items-center gap-3"><span className="h-px w-8 bg-brand" />CORE · YOUR FIRST PROPER WEBSITE</span>
            <h1 className="max-w-[12ch] text-5xl leading-[1.03] font-medium tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">Small site.<br />Strong first impression.</h1>
            <p className="max-w-md text-lg leading-relaxed text-foreground/80">A custom website that makes your business clear, credible, and easy to contact. Everything you need to get online properly, in up to five pages.</p>
            <div className="flex flex-wrap gap-3">
              <Link href={contact} className="btn-light inline-flex min-h-11 items-center gap-3 px-5 text-sm font-medium">Start with Core <ArrowUpRight aria-hidden className="size-4" /></Link>
              <Link href="#scope" className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-foreground/80">Explore the package <ArrowDown aria-hidden className="size-4" /></Link>
            </div>
            <p className="text-sm text-muted-foreground">{offerPrice(offer)} <span className="mx-2" aria-hidden>·</span> {p.specs?.Timeline} <span className="mx-2" aria-hidden>·</span> Custom design</p>
          </div>
          <figure className="min-w-0">
            <CoreHeroPreview><SiteShowcase example="clinic" still /></CoreHeroPreview>
            <figcaption className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>One business. Every screen.</span><span>Illustrative design · not client work</span></figcaption>
          </figure>
        </div>
      </header>

      <section id="scope" aria-labelledby="scope-title" className="grid scroll-mt-24 gap-10 border-b border-border/70 py-14 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="label-mono">A SMALL SITE, THOUGHT THROUGH</span>
          <h2 id="scope-title" className="mt-5 text-3xl font-medium tracking-tight text-balance sm:text-4xl">Five pages.<br />One clear story.</h2>
          <p className="mt-5 max-w-sm leading-relaxed text-foreground/80">We plan the pages around your business. Here’s one way a Core site could come together.</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">An example structure, not a template. Your final page list is agreed in the scope.</p>
        </div>
        <ol className="divide-y divide-border/70 border-t border-border/70">
          {PAGES.map(([number, name, title, body]) => <li key={number} className="grid grid-cols-[2rem_1fr] gap-4 py-6 sm:grid-cols-[2rem_6rem_1fr]">
            <span className="label-mono pt-1 text-xs">{number}</span>
            <span className="text-sm font-medium sm:pt-0.5">{name}</span>
            <div className="col-start-2 sm:col-start-auto"><h3 className="text-lg font-medium tracking-tight">{title}</h3><p className="mt-2 text-sm leading-relaxed text-foreground/75">{body}</p></div>
          </li>)}
        </ol>
      </section>

      <section aria-labelledby="included-title" className="grid gap-10 border-b border-border/70 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <span className="label-mono">THE DETAILS THAT MAKE IT WORK</span>
          <h2 id="included-title" className="mt-5 max-w-md text-3xl font-medium tracking-tight text-balance sm:text-4xl">More than a good-looking homepage.</h2>
          <div className="mt-8 divide-y divide-border/70">
            {offer.outcomes?.map((outcome, i) => <article key={outcome.title} className="grid grid-cols-[2rem_1fr] gap-4 py-5">
              <span className="label-mono pt-1 text-xs">0{i + 1}</span><div><h3 className="font-medium">{outcome.title}</h3><p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/75">{outcome.body}</p></div>
            </article>)}
          </div>
        </div>
        <aside aria-label="Core package price and scope" className="surface-glass grid content-start gap-6 self-start p-6 sm:p-8 lg:sticky lg:top-28">
          <div className="flex items-center justify-between"><span className="label-mono">CORE</span><span className="rounded-full border border-border px-3 py-1 text-xs">One-time project</span></div>
          <div><p className="text-4xl font-medium tracking-tight">{offerPrice(offer)}</p><p className="mt-2 text-sm text-muted-foreground">Scope and price agreed before we start.</p></div>
          <dl className="divide-y divide-border/70 border-y border-border/70">{Object.entries(p.specs ?? {}).map(([key, value]) => <div key={key} className="flex justify-between gap-6 py-3 text-sm"><dt className="text-muted-foreground">{key}</dt><dd className="max-w-[60%] text-right">{value}</dd></div>)}</dl>
          <ul className="grid gap-3">{(p.includes ?? []).map(item => <li key={item} className="flex items-start gap-3 text-sm"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-text" />{item}</li>)}</ul>
          <Link href={contact} className="btn-light inline-flex min-h-11 items-center justify-between gap-4 px-5 text-sm font-medium">Let’s plan your website <ArrowRight aria-hidden className="size-4" /></Link>
          {p.founding && <FoundingBanner />}
        </aside>
      </section>

      <section aria-labelledby="process-title" className="py-14 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 sm:items-end"><div><span className="label-mono">FROM FIRST IDEA TO LIVE</span><h2 id="process-title" className="mt-5 text-3xl font-medium tracking-tight sm:text-4xl">A clear path to launch.</h2></div><p className="max-w-md text-foreground/75">{p.specs?.Timeline}, with {p.specs?.Revisions.toLowerCase()} of design revisions. We agree the timeline after reviewing your scope and content.</p></div>
        <MilestoneTimeline className="mt-10 max-w-3xl" steps={STEPS.map((s) => ({ ...s, note: s.title === "Design" && p.specs?.Revisions ? `${p.specs.Revisions} of revisions` : undefined }))} />
      </section>

      <section aria-labelledby="fit-title" className="grid gap-8 border-y border-border/70 py-10 sm:grid-cols-2 sm:gap-16">
        <div><span className="label-mono">IS CORE YOUR FIT?</span><h2 id="fit-title" className="mt-4 text-2xl font-medium tracking-tight">Start focused. Leave room to grow.</h2><p className="mt-4 leading-relaxed text-foreground/75">{p.bestFor}</p></div>
        <div className="grid content-start gap-4 text-sm leading-relaxed"><p className="text-foreground/80">Need a content editor, a blog, or more pages? <Link href="/websites/company-sites" className="underline underline-offset-4">Explore Ascend <span aria-hidden>↗</span></Link></p><p className="text-foreground/80">Hosting, security updates and ongoing edits are available separately through <Link href="/care" className="underline underline-offset-4">Care</Link>.</p><Link href="/websites" className="inline-flex min-h-11 items-center gap-2 font-medium">Compare website packages <ArrowRight aria-hidden className="size-4" /></Link></div>
      </section>

      <CoreWorkShowcase />
      <section aria-labelledby="core-cta" className="glow-brand grid justify-items-start gap-6 py-16 sm:py-24"><span className="label-mono">YOUR NEXT CHAPTER</span><h2 id="core-cta" className="max-w-[18ch] text-4xl font-medium tracking-tight text-balance sm:text-6xl">Give your business a place of its own.</h2><p className="max-w-lg text-lg text-foreground/80">Tell us what you do and what your website needs to achieve. We’ll work out the right scope together.</p><Link href={contact} className="btn-light inline-flex min-h-12 items-center gap-5 px-6 font-medium">Start with Core<ArrowUpRight aria-hidden className="size-4" /></Link></section>
    </main>
    <SiteFooter />
  </>
}
