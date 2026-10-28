import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ArrowUpRight, Check } from "lucide-react"

import { ProductVisual } from "@/components/home/product-cards"
import { Comparison } from "@/components/pricing/comparison"
import { PlanCard } from "@/components/pricing/plan-card"
import { SynccPlans } from "@/components/pricing/syncc-plans"
import { PageSection, PageShell } from "@/components/site/page-shell"
import { LANES, type Lane, type LaneId } from "@/lib/lanes"
import { PRODUCT_PAGES } from "@/lib/products"
import { cn } from "@/lib/utils"

// Where each product sends someone who'd rather have it built or set up for them.
const RELATED: Partial<Record<LaneId, { href: string; text: string }>> = {
  scriblane: { href: "/custom-solutions/document-processing", text: "Want it wired into your own systems? We set it up as a custom solution." },
  flowlane: { href: "/custom-solutions/workflow-automation", text: "Can't wait for it to open? We build automations on the same engine today." },
}

const laneFor = (slug: string): Lane | undefined => LANES.find((l) => l.id === slug)

export const dynamicParams = false

export function generateStaticParams() {
  return LANES.map((l) => ({ slug: l.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lane = laneFor((await params).slug)
  return lane ? { title: `${lane.name} · Botlane`, description: lane.tagline } : {}
}

/**
 * One product's own page, in its lane colour: what it does, everything it does, how it compares, what it
 * costs, and what it doesn't do yet. Live products link out to their site; one opening soon points to the
 * custom solution built on the same engine.
 */
export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const lane = laneFor((await params).slug)
  if (!lane) notFound()
  const page = PRODUCT_PAGES[lane.id]
  const live = lane.status === "live"
  const related = RELATED[lane.id]
  const visit = { label: `Visit ${lane.name}`, href: `https://${lane.host}` }

  return (
    <PageShell
      current="/products"
      eyebrow={`OUR PRODUCTS · ${lane.name.toUpperCase()} · ${live ? "LIVE" : "OPENING SOON"}`}
      title={lane.tagline}
      intro={`${lane.name} is software we build and run ourselves, to the same standard as the work we do for clients.`}
      cta={live
        ? { title: `Try ${lane.name}.`, body: `It lives at ${lane.host}.`, label: visit.label, href: visit.href }
        : { title: "Want this working for you now?", body: related?.text ?? "Tell us what you'd use it for.", label: "Talk to us", href: related?.href ?? "/contact" }}
    >
      <section aria-label={lane.name} className={cn(lane.scope, "surface-product mb-12 grid overflow-hidden lg:grid-cols-[1fr_1.1fr]")}>
        <div className="grid content-center justify-items-start gap-5 p-6 sm:p-10">
          <span className="label-mono">{live ? `LIVE · ${lane.host.toUpperCase()}` : "OPENING SOON"}</span>
          <h2 className="text-3xl font-medium tracking-tight">{lane.name}</h2>
          <ul className="grid gap-2.5">
            {page.features.slice(0, 3).map((f) => (
              <li key={f} className="flex gap-2.5 text-[15px]"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-(--lane-text)" />{f}</li>
            ))}
          </ul>
          {live
            ? <a href={visit.href} className="btn-light mt-2 inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">{visit.label} <ArrowUpRight className="size-4" /></a>
            : related && <Link href={related.href} className="btn-light mt-2 inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">Automate with us today <ArrowRight className="size-4" /></Link>}
        </div>
        <div aria-hidden className="relative h-72 lg:h-auto lg:min-h-80">
          <ProductVisual id={lane.id} />
        </div>
      </section>

      <PageSection id="features" eyebrow="WHAT IT DOES" title={`Everything ${lane.name} does today.`}>
        <ul className={cn(lane.scope, "grid gap-3 sm:grid-cols-2")}>
          {page.features.map((f) => (
            <li key={f} className="flex gap-2.5 text-[15px]"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-(--lane-text)" />{f}</li>
          ))}
        </ul>
      </PageSection>

      {page.compare && (
        <PageSection id="compare" eyebrow={`${lane.name} VS ${page.compare.against}`.toUpperCase()} title={`How it compares with ${page.compare.against}.`}>
          <div className="surface-hairline overflow-x-auto p-5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th scope="col" className="pb-3 font-normal" />
                  <th scope="col" className="pb-3 font-medium text-foreground">{lane.name}</th>
                  <th scope="col" className="pb-3 font-normal">{page.compare.against}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {page.compare.rows.map(([label, ours, theirs]) => (
                  <tr key={label}>
                    <th scope="row" className="py-3 pr-4 font-normal text-muted-foreground">{label}</th>
                    <td className="py-3 pr-4">{ours}</td>
                    <td className="py-3 text-muted-foreground">{theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">{page.compare.source}</p>
          </div>
        </PageSection>
      )}

      {lane.id === "syncc" && (
        <PageSection id="pricing" eyebrow="PRICING" title="One flat price, never per seat.">
          <div className={lane.scope}><SynccPlans /></div>
        </PageSection>
      )}
      {lane.id === "scriblane" && (
        <PageSection id="pricing" eyebrow="PRICING" title="Priced by the pages you process.">
          <div className={cn(lane.scope, "grid gap-5")}>
            <div className="grid gap-5 md:grid-cols-2">
              <PlanCard planId="scriblane-starter" cta="Start with Starter" />
              <PlanCard planId="scriblane-growth" featured cta="Start with Growth" />
            </div>
            <Comparison planIds={["scriblane-starter", "scriblane-growth"]} caption="Scriblane plans compared" />
          </div>
        </PageSection>
      )}

      <PageSection id="limits" eyebrow="WHAT IT DOESN'T DO YET" title="The honest part.">
        <div className="surface-hairline grid gap-3 p-5">
          <p className="text-muted-foreground">{page.limit}</p>
          {live && related && (
            <Link href={related.href} className="inline-flex items-center gap-1.5 text-sm font-medium">{related.text} <ArrowRight className="size-3.5" /></Link>
          )}
        </div>
      </PageSection>
    </PageShell>
  )
}
