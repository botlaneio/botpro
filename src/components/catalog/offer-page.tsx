import Link from "next/link"
import { ArrowDown, ArrowRight, ArrowUpRight, ChartNoAxesColumn, Check, Component, Gauge, Languages, Layers, Library, Mail, Palette, PenLine, Plug, Search, Smartphone, Sparkles } from "lucide-react"

import { FINISH_CLASS } from "@/components/pricing/finish"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { categoryById, findOffer, offerHref, offerPrice, offersIn, type Offer, type OutcomeIcon } from "@/lib/catalog"
import { plan } from "@/lib/pricing"
import { STEPS } from "@/lib/process"
import { cn } from "@/lib/utils"

import { OFFER_ICONS } from "./offer-icons"
import { SiteShowcase } from "./site-showcase"
import { StackLogos } from "./stack-logos"

// How many of the three columns the price card takes, by how many outcome cards share its row.
const PRICE_SPAN = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-1"]

const OUTCOME_ICONS: Record<OutcomeIcon, React.ComponentType<{ className?: string }>> = {
  design: Palette,
  mobile: Smartphone,
  search: Search,
  enquiries: Mail,
  analytics: ChartNoAxesColumn,
  foundation: Layers,
  system: Component,
  editor: PenLine,
  integrations: Plug,
  motion: Sparkles,
  structure: Library,
  languages: Languages,
  performance: Gauge,
}

// The closing line for each category, matched to how it's sold.
const CLOSE: Record<Offer["category"], string> = {
  websites: "We'll confirm the scope and the fixed price before any work starts.",
  "web-apps": "We'll start with a scoping sprint and give you a fixed quote for the build.",
  "custom-solutions": "A short call to understand how you work, then a written scope and a quote.",
}

/**
 * A dedicated page for one option, after the page structure in the research: a headline on the problem it
 * solves, the price and the main action up front, everything included, how we build it, our own work as
 * proof, and a call to action named for the option. Web-app stages after scoping point back to the sprint.
 */
export function OfferPage({ offer }: { offer: Offer }) {
  if (offer.outcomes) return <ShowcaseOfferPage offer={offer} />
  const cat = categoryById(offer.category)
  const p = offer.planId ? plan(offer.planId) : null
  const Icon = OFFER_ICONS[offer.icon]
  const included = p?.includes ?? offer.deliverables ?? []
  const specs = Object.entries(p?.specs ?? (offer.timeline ? { Timeline: offer.timeline } : {}))
  const contact = `/contact?need=${cat.cta.need}`
  const sprint = offer.category === "web-apps" && offer.slug !== "scoping-sprint" ? findOffer("web-apps", "scoping-sprint") : undefined

  return (
    <PageShell
      current={cat.href}
      banner={p?.founding ? <FoundingBanner /> : undefined}
      eyebrow={`${cat.label} · ${offer.name}`.toUpperCase()}
      title={offer.headline}
      intro={offer.pain}
      cta={{ title: `Let's talk about your ${offer.category === "websites" ? `${offer.name} site` : offer.name.toLowerCase()}.`, body: CLOSE[offer.category], label: cat.cta.label, href: contact }}
    >
      <section aria-label="Price and next step" className="surface-glass mb-12 flex flex-wrap items-center gap-x-8 gap-y-5 p-6 sm:p-8">
        <span className={cn("tile-depth size-12 shrink-0", cat.tone)}><Icon className="size-5" /></span>
        <div className="grid gap-1">
          <span className="label-mono">{p ? p.name.toUpperCase() : offer.name.toUpperCase()}</span>
          <span className="text-3xl font-medium tracking-tight">{offerPrice(offer)}</span>
          {p?.terms && <span className="text-sm text-foreground/85">{p.terms}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
          <Link href={contact} className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">{cat.cta.label} <ArrowRight className="size-4" /></Link>
          <Link href={cat.href} className="inline-flex h-10 items-center px-3 text-sm text-muted-foreground hover:text-foreground">Compare all {cat.label.toLowerCase()}</Link>
        </div>
      </section>

      <PageSection id="included" eyebrow="WHAT YOU GET" title="Everything that's included.">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex gap-2.5 text-[15px]"><Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", cat.tone)} />{item}</li>
            ))}
          </ul>
          <div className="grid content-start gap-6">
            {specs.length > 0 && (
              <dl className="surface-hairline grid divide-y divide-border/70 px-5">
                {specs.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {p?.examples && (
              <div className="grid gap-2">
                <span className="label-mono text-[11px]">GOOD FOR</span>
                <div className="flex flex-wrap gap-1.5">
                  {p.examples.map((e) => <span key={e} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">{e}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageSection>

      {offer.stack && (
        <PageSection id="stack" eyebrow="HOW WE BUILD IT" title="The tools we usually build it with." intro="Chosen to fit your project; these are what we reach for first.">
          <StackLogos tools={offer.stack} />
        </PageSection>
      )}

      {sprint && (
        <PageSection id="start" eyebrow="WHERE IT STARTS" title="Every app starts with a scoping sprint.">
          <Link href={offerHref(sprint)} className="surface-hairline group/s flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-foreground/[0.03]">
            <span className="grid gap-1">
              <span className="font-medium">{sprint.name} · {offerPrice(sprint)}</span>
              <span className="text-sm text-muted-foreground">{plan("app-scoping").terms} It ends with a technical plan and a fixed quote for this build.</span>
            </span>
            <ArrowUpRight aria-hidden className="ml-auto size-4 opacity-60 transition-transform group-hover/s:translate-x-0.5 group-hover/s:-translate-y-0.5" />
          </Link>
        </PageSection>
      )}

      <Proof offer={offer} />
      <Others offer={offer} />
    </PageShell>
  )
}

/** Our own work as proof, and, on the fuller pages, the tools we usually build with by their logos. */
function Proof({ offer, stack = false }: { offer: Offer; stack?: boolean }) {
  return (
    <PageSection id="proof" eyebrow="PROOF" title="Our own work, not promises.">
      <div className="surface-hairline flex flex-wrap items-center gap-4 p-5">
        <p className="max-w-xl flex-1 text-muted-foreground">{offer.proof.text}</p>
        <Link href={offer.proof.href} className="inline-flex items-center gap-1.5 text-sm font-medium">{offer.proof.label} <ArrowRight className="size-3.5" /></Link>
      </div>
      {stack && offer.stack && (
        <div className="grid gap-4 pt-2">
          <span className="label-mono text-[11px]">WHAT WE USUALLY BUILD IT WITH</span>
          <StackLogos tools={offer.stack} size="sm" />
        </div>
      )}
    </PageSection>
  )
}

/** The other options in the same category. */
function Others({ offer }: { offer: Offer }) {
  const cat = categoryById(offer.category)
  const siblings = offersIn(offer.category).filter((o) => o.slug !== offer.slug)
  return (
    <PageSection id="other" eyebrow={`OTHER ${cat.label.toUpperCase()}`} title={`Not quite right? Compare the other ${cat.label.toLowerCase()}.`}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {siblings.map((o) => {
          const SiblingIcon = OFFER_ICONS[o.icon]
          return (
            <li key={o.slug}>
              <Link href={offerHref(o)} className="surface-hairline group/o flex h-full items-start gap-3 p-4 transition-colors hover:bg-foreground/[0.03]">
                <span className={cn("tile-depth size-9 shrink-0", cat.tone)}><SiblingIcon className="size-4" /></span>
                <span className="grid gap-0.5">
                  <span className="font-medium">{o.name}</span>
                  <span className="label-mono text-[11px]">{offerPrice(o)}</span>
                </span>
                <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 opacity-50 transition-[opacity,transform] group-hover/o:translate-x-0.5 group-hover/o:-translate-y-0.5 group-hover/o:opacity-100" />
              </Link>
            </li>
          )
        })}
      </ul>
    </PageSection>
  )
}

/**
 * The fuller page, for options with outcomes written for them. An example of the work beside the
 * headline; what each included item does for the client as cards, with the price as the last card, so
 * the value comes before the number; then how the project runs, as a timeline built from the shared
 * process steps and the plan's own timeline and revisions. Proof, the tools on one line, and the other
 * options close it, as on every offer page.
 */
function ShowcaseOfferPage({ offer }: { offer: Offer }) {
  const cat = categoryById(offer.category)
  const p = offer.planId ? plan(offer.planId) : null
  const Icon = OFFER_ICONS[offer.icon]
  const contact = `/contact?need=${cat.cta.need}`
  const specs = p?.specs ?? {}
  const timeline = specs.Timeline ?? offer.timeline
  // Whether the outcomes fill whole rows, so the price card has a row of its own.
  const full = offer.outcomes!.length % 3 === 0
  // What the timeline adds to a step: the plan's revision rounds on Design.
  const notes: Record<string, string | undefined> = { Design: specs.Revisions ? `${specs.Revisions} of revisions` : undefined }

  return (
    <PageShell
      current={cat.href}
      banner={p?.founding ? <FoundingBanner /> : undefined}
      eyebrow={`${cat.label} · ${offer.name}`.toUpperCase()}
      title={offer.headline}
      intro={offer.pain}
      actions={
        <>
          <Link href={contact} className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">{cat.cta.label} <ArrowRight className="size-4" /></Link>
          <Link href="#included" className="group/a inline-flex h-10 items-center gap-1.5 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            What&apos;s included <ArrowDown className="size-3.5 transition-transform group-hover/a:translate-y-0.5" />
          </Link>
        </>
      }
      aside={<SiteShowcase example={offer.showcase} />}
      cta={{ title: `Let's talk about your ${offer.category === "websites" ? `${offer.name} site` : offer.name.toLowerCase()}.`, body: CLOSE[offer.category], label: cat.cta.label, href: contact }}
    >
      <PageSection id="included" eyebrow="WHAT YOU GET" title="What your site will do for you.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {offer.outcomes!.map((o) => {
            const OutcomeIcon = OUTCOME_ICONS[o.icon]
            return (
              <li key={o.title} className="surface-hairline grid content-start gap-4 p-6">
                <span className={cn("tile-depth size-10", cat.tone)}><OutcomeIcon className="size-[18px]" /></span>
                <span className="grid gap-1.5">
                  <span className="text-[17px] font-medium tracking-tight">{o.title}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground text-pretty">{o.body}</span>
                </span>
              </li>
            )
          })}
          {/* The price, last: by now the reader knows what it buys. It fills the rest of the last row. */}
          <li
            className={cn(
              "grid content-between gap-6 p-6",
              FINISH_CLASS[p?.finish ?? "glass"],
              offer.outcomes!.length % 2 ? "sm:col-span-1" : "sm:col-span-2",
              PRICE_SPAN[offer.outcomes!.length % 3],
              // Across a whole row, the price and its details sit left and the actions right.
              full && "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10 lg:p-8",
            )}
          >
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <span className={cn("tile-depth size-10", cat.tone)}><Icon className="size-[18px]" /></span>
                <span className="label-mono">{p ? p.name.toUpperCase() : offer.name.toUpperCase()}</span>
              </div>
              <div className="grid gap-1">
                <span className="text-3xl font-medium tracking-tight">{offerPrice(offer)}</span>
                {p?.terms && <span className="text-sm text-foreground/85">{p.terms}</span>}
              </div>
              {Object.keys(specs).length > 0 && (
                <dl className={cn("grid gap-1.5 text-sm", full && "lg:mt-2 lg:flex lg:flex-wrap lg:gap-x-10 lg:gap-y-3")}>
                  {Object.entries(specs).filter(([k]) => k !== "Timeline" && k !== "Revisions").map(([k, v]) => (
                    <div key={k} className={cn("flex justify-between gap-4", full && "lg:grid lg:justify-start lg:gap-0.5")}>
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className={cn("text-right", full && "lg:text-left")}>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={contact} className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">{cat.cta.label} <ArrowRight className="size-4" /></Link>
              <Link href={cat.href} className="inline-flex h-10 items-center text-sm text-muted-foreground hover:text-foreground">Compare all {cat.label.toLowerCase()}</Link>
            </div>
          </li>
        </ul>
      </PageSection>

      <PageSection
        id="plan"
        eyebrow="HOW IT RUNS"
        title={timeline ? `Built in ${timeline}, at one fixed price.` : "One fixed price, agreed before we start."}
        intro="The scope, timeline and price are agreed in writing before any work starts."
      >
        <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
          {/* The track: a hairline through the step markers, from lg. */}
          <span aria-hidden className="absolute top-4 right-[10%] left-[10%] hidden h-px bg-[linear-gradient(90deg,transparent,rgb(var(--ink)/0.18)_12%,rgb(var(--ink)/0.18)_88%,transparent)] lg:block" />
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 lg:grid-cols-1 lg:justify-items-center lg:text-center">
              <span className="label-mono row-span-2 grid size-8 place-items-center rounded-full border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.06))] bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] text-[11px] text-foreground lg:row-span-1 lg:mb-2">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-medium">{step.title}</span>
              <span className="text-sm leading-relaxed text-muted-foreground text-pretty">{step.body}</span>
              {notes[step.title] && <span className="label-mono col-start-2 mt-1 w-fit rounded-full border border-border px-2 text-[10px] leading-5 lg:col-start-1">{notes[step.title]!.toUpperCase()}</span>}
            </li>
          ))}
        </ol>
        {p?.examples && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-mono mr-1 text-[11px]">GOOD FOR</span>
            {p.examples.map((e) => <span key={e} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{e}</span>)}
          </div>
        )}
      </PageSection>

      <Proof offer={offer} stack />
      <Others offer={offer} />
    </PageShell>
  )
}
