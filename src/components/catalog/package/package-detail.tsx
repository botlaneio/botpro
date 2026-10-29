import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react"

import { FoundingBanner } from "@/components/pricing/founding-banner"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { offerHref, offerPrice, offersIn, type Offer } from "@/lib/catalog"
import { plan } from "@/lib/pricing"
import { STEPS } from "@/lib/process"
import { MilestoneTimeline } from "@/components/process/milestone-timeline"
import { cn } from "@/lib/utils"

import { ArtPanel } from "@/components/art/art-panel"

import { CoreHeroPreview } from "../core-hero-preview"
import { SiteShowcase } from "../site-showcase"

/** One thing a package adds: its drawing above, its words below. `wide` takes half a row, else a third. */
export interface PackageFeature {
  title: string
  body: string
  visual: React.ReactNode
  wide?: boolean
}

/** Everything a package page says, in the order it says it. The layout is shared; the words and drawings aren't. */
export interface PackageContent {
  planId: string
  kicker: string
  title: [string, string]
  intro: string
  cta: string
  example: "firm" | "launch"
  /** Two notes floating either side of the stage on wide screens: [label, value]. */
  notes: [[string, string], [string, string]]
  stats: [string, string][]
  addsTitle: string
  addsIntro: string
  features: PackageFeature[]
  /** What the package builds on, shown under the features: the tier below's name and what it already includes. */
  builds?: { name: string; items: string[] }
  faq: [string, string][]
  close: [string, string]
  closeBody: string
}

const LADDER = ["website-core", "website-ascend", "website-apex"]

/** The three website packages as a row of tabs, the current one lit. */
export function TierLadder({ current }: { current?: string }) {
  const offers = offersIn("websites")
  return (
    <nav aria-label="Website packages" className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-foreground/[0.03] p-1 backdrop-blur">
      {LADDER.map((id, i) => {
        const o = offers.find((x) => x.planId === id)
        if (!o) return null
        const on = id === current
        return (
          <Link
            key={id}
            href={offerHref(o)}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm transition-colors duration-300",
              on ? "bg-foreground text-background shadow-[0_0_24px_-4px_rgb(143_180_242/0.55)]" : "text-foreground/65 hover:text-foreground",
            )}
          >
            <span className="font-mono text-[10px] opacity-60">0{i + 1}</span>
            {o.name}
          </Link>
        )
      })}
    </nav>
  )
}

/** A soft pool of the blue light, for behind a block. */
function Pool({ className }: { className?: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(58_100_184/0.38),rgb(44_87_165/0.12)_55%,transparent)] blur-2xl", className)} />
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="label-mono flex items-center justify-center gap-3 text-[11px]">
      <span aria-hidden className="h-px w-8 bg-[linear-gradient(90deg,transparent,rgb(var(--ink)/0.35))]" />
      {children}
      <span aria-hidden className="h-px w-8 bg-[linear-gradient(90deg,rgb(var(--ink)/0.35),transparent)]" />
    </span>
  )
}

/**
 * A website package's page, centred and symmetrical: the ladder of packages, a large title, the example site
 * on a lit stage with a note either side, the numbers, what the package adds as a grid of drawn tiles, where it
 * sits beside the others, the path to launch, the price, questions, and the close.
 */
export function PackageDetail({ offer, c }: { offer: Offer; c: PackageContent }) {
  const p = plan(c.planId)
  const contact = "/contact?need=website"
  const price = offerPrice(offer)
  const siblings = offersIn("websites").filter((o) => o.planId && LADDER.includes(o.planId)).sort((a, b) => LADDER.indexOf(a.planId!) - LADDER.indexOf(b.planId!))

  return (
    <>
      <SiteHeader />
      <main className="relative isolate overflow-x-clip">
        {/* The opening: centred, the stage beneath it. */}
        <header className="relative isolate mx-auto grid max-w-6xl justify-items-center px-5 pt-10 text-center sm:px-6 sm:pt-14">
          <Pool className="-top-40 left-1/2 h-[42rem] w-[70rem] -translate-x-1/2 opacity-80" />
          <TierLadder current={c.planId} />
          <div className="mt-10 grid justify-items-center gap-6 sm:mt-14">
            <Eyebrow>{c.kicker}</Eyebrow>
            <h1 className="max-w-[16ch] text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.055em] text-balance">
              {c.title[0]}{" "}
              <span className="bg-[linear-gradient(100deg,var(--foreground)_0%,rgb(var(--ink)/0.42)_80%)] bg-clip-text text-transparent">{c.title[1]}</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-foreground/72 text-pretty">{c.intro}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <Link href={contact} className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground pr-2 pl-5 text-[15px] font-medium text-background transition-[gap] duration-300 hover:gap-3">
                {c.cta}
                <span className="grid size-8 place-items-center rounded-full bg-background text-foreground"><ArrowUpRight className="size-4" /></span>
              </Link>
              <Link href="#adds" className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-[15px] text-foreground/80 transition-colors hover:bg-foreground/[0.04]">
                What&apos;s inside <ArrowDown className="size-4" />
              </Link>
            </div>
            <p className="label-mono text-[11px]">{price.toUpperCase()} · {p.specs?.Timeline?.toUpperCase()}</p>
          </div>

          {/* The stage: the example site, lit, with a note floating either side. */}
          <div className="relative mt-12 w-full max-w-5xl sm:mt-16">
            <Pool className="inset-x-[-10%] top-[20%] bottom-[-20%] opacity-90" />
            {/* By day the stage is a painted sky, the site floating on it; by night the blue light does that. */}
            <ArtPanel sky={c.example === "launch" ? "dusk" : "azure"} seed={c.example === "launch" ? 5 : 9} className="absolute inset-x-0 top-[8%] bottom-[6%] rounded-[2rem] border border-[rgb(var(--ink)/0.06)] dark:hidden" />
            <CoreHeroPreview><SiteShowcase example={c.example} className="max-w-[54rem]" /></CoreHeroPreview>
            {c.notes.map(([label, value], i) => (
              <span
                key={label}
                aria-hidden
                className={cn(
                  "pk-float absolute top-[38%] hidden min-w-40 rounded-2xl border border-white/12 bg-[#0b1424]/80 px-4 py-3 text-left text-white shadow-[0_24px_50px_-20px_rgb(0_0_0/0.8),0_0_30px_-10px_rgb(58_100_184/0.6)] backdrop-blur-md xl:grid",
                  i === 0 ? "-left-16" : "late -right-16",
                )}
              >
                <span className="label-mono text-[9.5px] text-white/55">{label}</span>
                <span className="mt-1 text-[15px] font-medium">{value}</span>
              </span>
            ))}
            <p className="mt-2 text-xs text-muted-foreground">Illustrative design · not client work</p>
          </div>
        </header>

        {/* The numbers, in a band. */}
        <section aria-label={`${offer.name} at a glance`} className="mx-auto mt-16 max-w-6xl px-5 sm:mt-24 sm:px-6">
          <dl className="grid grid-cols-2 border-y border-border md:grid-cols-4">
            {c.stats.map(([v, l], i) => (
              <div key={l} className={cn("grid justify-items-center gap-1.5 px-4 py-8 text-center", i % 2 === 1 && "border-l border-border", i >= 2 && "max-md:border-t md:border-l")}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">{v}</dd>
                <dd className="text-sm text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* What the package adds, as a grid of drawn tiles. */}
        <section id="adds" aria-labelledby="adds-title" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto grid max-w-2xl justify-items-center gap-5 text-center">
            <Eyebrow>WHAT {offer.name.toUpperCase()} ADDS</Eyebrow>
            <h2 id="adds-title" className="text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-balance sm:text-5xl">{c.addsTitle}</h2>
            <p className="max-w-lg text-foreground/70 text-pretty">{c.addsIntro}</p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-6">
            {c.features.map((f) => (
              <article key={f.title} className={cn("group relative grid overflow-hidden rounded-[1.6rem] border border-border bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom))] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha))]", f.wide ? "md:col-span-3" : "md:col-span-2")}>
                <Pool className="-top-1/3 left-1/2 h-2/3 w-3/4 -translate-x-1/2 opacity-0 transition-opacity duration-700 group-hover:opacity-70" />
                <div className="h-60 border-b border-border/70 [mask-image:linear-gradient(180deg,#000_80%,transparent)]">{f.visual}</div>
                <div className="grid gap-2 p-6 sm:p-7">
                  <h3 className="text-xl font-medium tracking-tight">{f.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground text-pretty">{f.body}</p>
                </div>
              </article>
            ))}
          </div>
          {c.builds && (
            <div className="mt-4 grid items-center gap-5 rounded-[1.6rem] border border-dashed border-border px-6 py-6 sm:px-8 md:grid-cols-[auto_1fr]">
              <span className="text-[15px] font-medium">Everything in {c.builds.name}, included</span>
              <ul className="flex flex-wrap gap-2 md:justify-end">
                {c.builds.items.map((i) => (
                  <li key={i} className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3 py-1.5 text-[13px] text-foreground/80"><Check className="size-3.5 text-[#8FB4F2]" />{i}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Where it sits: the three packages, side by side, this one raised and lit. */}
        <section aria-labelledby="ladder-title" className="relative border-y border-border bg-foreground/[0.015]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto grid max-w-2xl justify-items-center gap-5 text-center">
              <Eyebrow>THREE PACKAGES, ONE STANDARD</Eyebrow>
              <h2 id="ladder-title" className="text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-balance sm:text-5xl">Where {offer.name} sits.</h2>
            </div>
            <div className="mt-14 grid items-stretch gap-4 lg:grid-cols-3">
              {siblings.map((o) => {
                const sp = plan(o.planId!)
                const on = o.planId === c.planId
                return (
                  <Link
                    key={o.slug}
                    href={offerHref(o)}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "group relative grid content-start gap-5 overflow-hidden rounded-[1.6rem] border p-7 transition-[translate,border-color] duration-500 ease-(--ease-lift)",
                      on ? "border-[#8FB4F2]/45 bg-[#0b1424] text-white shadow-[0_40px_80px_-40px_rgb(58_100_184/0.8)] lg:-translate-y-3" : "border-border hover:-translate-y-1 hover:border-foreground/25",
                    )}
                  >
                    {on && <Pool className="-top-1/2 left-1/2 h-full w-full -translate-x-1/2 opacity-90" />}
                    <span className="flex items-center justify-between">
                      <span className="text-2xl font-medium tracking-tight">{o.name}</span>
                      {on ? <span className="label-mono rounded-full border border-white/20 px-2.5 py-1 text-[9.5px] text-white/80">YOU&apos;RE HERE</span> : <ArrowUpRight className="size-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
                    </span>
                    <span className={cn("text-[15px] leading-relaxed", on ? "text-white/70" : "text-muted-foreground")}>{sp.bestFor}</span>
                    <span className="grid gap-1">
                      <span className="text-3xl font-medium tracking-[-0.03em]">{offerPrice(o)}</span>
                      <span className={cn("label-mono text-[10.5px]", on && "text-white/55")}>{sp.specs?.Pages?.toUpperCase()} · {sp.specs?.Timeline?.toUpperCase()}</span>
                    </span>
                    <ul className={cn("grid gap-2.5 border-t pt-5 text-[14px]", on ? "border-white/12" : "border-border")}>
                      {(sp.includes ?? []).slice(0, 4).map((x) => <li key={x} className="flex gap-2.5"><Check className={cn("mt-0.5 size-4 shrink-0", on ? "text-[#8FB4F2]" : "text-foreground/50")} />{x}</li>)}
                    </ul>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* The path to launch, as a milestone timeline that lights up as it is read. */}
        <section aria-labelledby="path-title" className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto grid max-w-2xl justify-items-center gap-5 text-center">
            <Eyebrow>FROM FIRST CALL TO LIVE</Eyebrow>
            <h2 id="path-title" className="text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-balance sm:text-5xl">{p.specs?.Timeline}, start to finish.</h2>
            <p className="max-w-md text-foreground/70">With {p.specs?.Revisions?.toLowerCase()} of design revisions along the way. The timeline is agreed once we&apos;ve seen your scope and content.</p>
          </div>
          <MilestoneTimeline className="mx-auto mt-14 max-w-2xl" steps={STEPS.map((s) => ({ ...s, note: s.title === "Design" && p.specs?.Revisions ? `${p.specs.Revisions} of revisions` : undefined }))} />
        </section>

        {/* The price, centred. */}
        <section aria-labelledby="price-title" className="relative isolate mx-auto max-w-4xl px-5 pb-20 sm:px-6 sm:pb-28">
          <Pool className="inset-x-0 top-1/4 bottom-0 opacity-70" />
          <div className="dark relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070a12] p-7 text-center text-white shadow-[0_50px_100px_-50px_rgb(58_100_184/0.9)] sm:p-12">
            <Pool className="-top-1/2 left-1/2 h-full w-[80%] -translate-x-1/2" />
            <div className="grid justify-items-center gap-4">
              <span className="label-mono text-[11px] text-white/55">{offer.name.toUpperCase()} · ONE-TIME PROJECT</span>
              <h2 id="price-title" className="text-6xl font-medium tracking-[-0.05em] sm:text-7xl">{price.replace(/ one-time$/, "")}</h2>
              <p className="max-w-md text-white/65">{p.bestFor}</p>
            </div>
            <dl className="mx-auto mt-9 grid max-w-3xl grid-cols-2 border-y border-white/10 sm:grid-cols-5">
              {Object.entries(p.specs ?? {}).map(([k, v], i) => (
                <div key={k} className={cn("grid content-start gap-1 px-3 py-4", i > 0 && "sm:border-l sm:border-white/10")}>
                  <dt className="label-mono text-[9.5px] text-white/45">{k.toUpperCase()}</dt>
                  <dd className="text-[13px] leading-snug text-white/85">{v}</dd>
                </div>
              ))}
            </dl>
            <ul className="mx-auto mt-8 grid max-w-2xl gap-x-8 gap-y-3 text-left text-[15px] sm:grid-cols-2">
              {(p.includes ?? []).map((x) => <li key={x} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-[#8FB4F2]" />{x}</li>)}
            </ul>
            <Link href={contact} className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white pr-2 pl-5 text-[15px] font-medium text-black transition-[gap] duration-300 hover:gap-3">
              {c.cta}
              <span className="grid size-8 place-items-center rounded-full bg-black text-white"><ArrowUpRight className="size-4" /></span>
            </Link>
            <p className="mt-5 text-[13px] text-white/45">Hosting, updates and edits after launch are available through <Link href="/care" className="underline underline-offset-4 hover:text-white/80">Care</Link>.</p>
          </div>
          {p.founding && <div className="mx-auto mt-6 flex max-w-xl justify-center"><FoundingBanner /></div>}
        </section>

        {/* Questions. */}
        <section aria-labelledby="faq-title" className="mx-auto max-w-3xl px-5 pb-20 sm:px-6 sm:pb-28">
          <div className="grid justify-items-center gap-5 text-center">
            <Eyebrow>BEFORE WE BEGIN</Eyebrow>
            <h2 id="faq-title" className="text-4xl font-medium tracking-[-0.04em] sm:text-5xl">Good questions.</h2>
          </div>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {c.faq.map(([q, a]) => (
              <details key={q} className="group py-1">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-lg font-normal transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="pr-12 pb-6 leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* The close. */}
        <section aria-labelledby="close-title" className="relative isolate overflow-hidden border-t border-border">
          <Pool className="top-0 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 opacity-80" />
          <div className="mx-auto grid max-w-4xl justify-items-center gap-7 px-5 py-24 text-center sm:px-6 sm:py-32">
            <h2 id="close-title" className="text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] font-medium tracking-[-0.055em] text-balance">
              {c.close[0]} <span className="text-foreground/40">{c.close[1]}</span>
            </h2>
            <p className="max-w-lg text-lg text-foreground/70">{c.closeBody}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={contact} className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground pr-2 pl-5 text-[15px] font-medium text-background transition-[gap] duration-300 hover:gap-3">
                {c.cta}
                <span className="grid size-8 place-items-center rounded-full bg-background text-foreground"><ArrowUpRight className="size-4" /></span>
              </Link>
              <Link href="/websites" className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-5 text-[15px] text-foreground/80 hover:bg-foreground/[0.04]">
                Compare packages <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
