import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Check, Minus } from "lucide-react"

import { TierLadder } from "@/components/catalog/package/package-detail"
import { WebsitesShowroom, type ShowroomCard } from "@/components/catalog/package/websites-showroom"
import { FoundingBanner } from "@/components/pricing/founding-banner"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { offerHref, offerPrice, offersIn } from "@/lib/catalog"
import { plan } from "@/lib/pricing"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Websites · Botlane",
  description: "Core, Ascend and Apex: custom websites for getting online properly, for growing companies, and for brands where the site is the experience.",
}

const ORDER = ["website-core", "website-ascend", "website-apex"]

// What each package is, in a line, and where a business is when it's the one to choose.
const WORDS: Record<string, { tagline: string; fit: string; example: ShowroomCard["example"] }> = {
  "website-core": { tagline: "A first website that does the business justice.", fit: "Getting online properly", example: "clinic" },
  "website-ascend": { tagline: "A complete company site, yours to run.", fit: "Growing, and the team needs control", example: "firm" },
  "website-apex": { tagline: "The website as the experience.", fit: "Launching something exceptional", example: "launch" },
}

// The comparison, by theme. Each row is [what, Core, Ascend, Apex]: true, false, or a few words.
const ROWS: [string, [string, boolean | string, boolean | string, boolean | string][]][] = [
  ["Design", [
    ["Custom design, no templates", true, true, true],
    ["Right on every screen, fast-loading", true, true, true],
    ["A design system across every page", false, true, true],
    ["Signature motion and interactions", false, false, true],
  ]],
  ["Content", [
    ["Pages", "Up to 5", "Up to 12", "Scoped to you"],
    ["Who edits it", "We do", "Your team", "Your team"],
    ["Blog", false, true, true],
    ["Structured content: case studies, docs, changelog", false, false, true],
    ["Multiple languages", false, false, "If needed"],
  ]],
  ["Growth", [
    ["Contact form and analytics", true, true, true],
    ["Search essentials", "Basic SEO", "Basic SEO", "Advanced SEO"],
    ["Booking, CRM and newsletter integrations", false, true, true],
    ["A performance budget", false, false, true],
  ]],
  ["The project", [
    ["Timeline", "2–3 weeks", "3–5 weeks", "5–8 weeks"],
    ["Design revisions", "2 rounds", "3 rounds", "4 rounds"],
  ]],
]

function Cell({ v, lit }: { v: boolean | string; lit?: boolean }) {
  if (v === true) return <Check aria-label="Included" className={cn("mx-auto size-[18px]", lit ? "text-[#8FB4F2]" : "text-foreground/80")} />
  if (v === false) return <Minus aria-label="Not included" className="mx-auto size-4 text-foreground/25" />
  return <span className="text-[13.5px] text-foreground/85">{v}</span>
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

/** The websites hub: a centred opening, the three packages as a showroom with a picker, a full comparison, and the close. */
export default function Websites() {
  const offers = offersIn("websites").filter((o) => o.planId && ORDER.includes(o.planId)).sort((a, b) => ORDER.indexOf(a.planId!) - ORDER.indexOf(b.planId!))
  const cards: ShowroomCard[] = offers.map((o) => {
    const p = plan(o.planId!)
    const w = WORDS[o.planId!]
    return {
      id: o.planId!, name: o.name, href: offerHref(o), tagline: w.tagline, fit: w.fit, example: w.example,
      bestFor: p.bestFor ?? "", price: offerPrice(o), meta: `${p.specs?.Pages?.toUpperCase()} · ${p.specs?.Timeline?.toUpperCase()}`,
      includes: (p.includes ?? []).slice(0, 4),
    }
  })

  return (
    <>
      <SiteHeader />
      <main className="relative isolate overflow-x-clip">
        <header className="relative isolate mx-auto grid max-w-6xl justify-items-center px-5 pt-12 text-center sm:px-6 sm:pt-16">
          <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[40rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(58_100_184/0.35),transparent)] blur-2xl" />
          <TierLadder />
          <div className="mt-10 grid justify-items-center gap-6 sm:mt-14">
            <Eyebrow>WEBSITES</Eyebrow>
            <h1 className="max-w-[14ch] text-[clamp(2.9rem,8.5vw,7rem)] leading-[0.94] font-medium tracking-[-0.055em] text-balance">
              Three ways <span className="bg-[linear-gradient(100deg,var(--foreground)_0%,rgb(var(--ink)/0.42)_80%)] bg-clip-text text-transparent">to be seen.</span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-foreground/72 text-pretty">
              Every one designed from a blank page around your business, built to load fast and read beautifully on every screen. The difference is how far it goes.
            </p>
          </div>
        </header>

        <section aria-label="The packages" className="mx-auto max-w-6xl px-5 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
          <WebsitesShowroom cards={cards} />
          <div className="mt-8 flex justify-center"><FoundingBanner /></div>
        </section>

        {/* Every difference, row by row. */}
        <section aria-labelledby="compare-title" className="border-y border-border bg-foreground/[0.015]">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto grid max-w-2xl justify-items-center gap-5 text-center">
              <Eyebrow>SIDE BY SIDE</Eyebrow>
              <h2 id="compare-title" className="text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-balance sm:text-5xl">Every difference, in one place.</h2>
            </div>
            <div className="mt-14 overflow-x-auto [scrollbar-width:thin]">
              <table className="w-full min-w-[36rem] border-separate border-spacing-0 text-center">
                <caption className="sr-only">Core, Ascend and Apex compared</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[40%] pb-6 text-left"><span className="sr-only">Feature</span></th>
                    {offers.map((o, i) => (
                      <th key={o.slug} scope="col" className={cn("px-3 pb-6 align-bottom", i === 2 && "rounded-t-2xl bg-[#0b1424] pt-6 text-white")}>
                        <Link href={offerHref(o)} className="grid justify-items-center gap-1 hover:opacity-80">
                          <span className="text-xl font-medium tracking-tight">{o.name}</span>
                          <span className={cn("label-mono text-[10.5px]", i === 2 && "text-white/55")}>{offerPrice(o).replace(" one-time", "").toUpperCase()}</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                {ROWS.map(([group, rows]) => (
                  <tbody key={group}>
                    <tr>
                      <th colSpan={4} scope="colgroup" className="border-b border-border pt-8 pb-3 text-left">
                        <span className="label-mono text-[11px] text-foreground">{group.toUpperCase()}</span>
                      </th>
                    </tr>
                    {rows.map(([what, ...vals]) => (
                      <tr key={what}>
                        <th scope="row" className="sticky left-0 z-10 border-b border-border/70 bg-background py-4 pr-4 text-left text-[14.5px] font-normal text-foreground/85 md:static md:bg-transparent">{what}</th>
                        {vals.map((v, i) => (
                          <td key={i} className={cn("border-b px-3 py-4", i === 2 ? "border-white/[0.07] bg-[#0b1424] text-white [&_svg]:text-[#8FB4F2]" : "border-border/70")}>
                            <Cell v={v} lit={i === 2} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ))}
                <tfoot>
                  <tr>
                    <td />
                    {offers.map((o, i) => (
                      <td key={o.slug} className={cn("px-3 pt-6 pb-6", i === 2 && "rounded-b-2xl bg-[#0b1424]")}>
                        <Link href={offerHref(o)} className={cn("inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13.5px] font-medium", i === 2 ? "bg-white text-black" : "border border-border hover:bg-foreground/[0.04]")}>
                          {o.name} <ArrowUpRight className="size-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* After launch, and the close. */}
        <section aria-labelledby="close-title" className="relative isolate mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="dark relative isolate grid content-between gap-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#070a12] p-8 text-white sm:p-10">
              <div aria-hidden className="absolute -top-1/2 -right-1/4 -z-10 h-[140%] w-[90%] rounded-full bg-[radial-gradient(closest-side,rgb(58_100_184/0.55),transparent)] blur-2xl" />
              <div className="grid gap-4">
                <span className="label-mono text-[11px] text-white/55">NOT SURE YET?</span>
                <h2 id="close-title" className="text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-balance">Tell us about the business. We&apos;ll point you to the right one.</h2>
              </div>
              <Link href="/contact?need=website" className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white pr-2 pl-5 text-[15px] font-medium text-black transition-[gap] duration-300 hover:gap-3">
                Start a project
                <span className="grid size-8 place-items-center rounded-full bg-black text-white"><ArrowUpRight className="size-4" /></span>
              </Link>
            </div>
            <Link href="/care" className="group relative grid content-between gap-10 overflow-hidden rounded-[1.75rem] border border-border p-8 transition-colors hover:border-foreground/25 sm:p-10">
              <div className="grid gap-4">
                <span className="label-mono text-[11px]">AFTER LAUNCH</span>
                <p className="text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-balance">Care keeps it fast, safe and current.</p>
                <p className="max-w-sm text-muted-foreground">Hosting, security updates, backups and small edits, handled every month. Optional, and separate from the build.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[15px] font-medium">About Care <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
