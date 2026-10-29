import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { InsightsIndex } from "@/components/insights/insights-index"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { formatDate, postsByDate, readingMinutes } from "@/lib/insights"

export const metadata: Metadata = {
  title: "Insights · Botlane",
  description: "Practical notes on websites, booking, automation, and the work behind them.",
}

/** The journal: a masthead, the notes, and an invitation to ask about anything they don't cover. */
export default function Blog() {
  const all = postsByDate()
  const posts = all.map((p) => ({ slug: p.slug, title: p.title, dek: p.dek, topic: p.topic, date: formatDate(p.date), minutes: readingMinutes(p), cover: p.cover }))
  const topics = new Set(all.map((p) => p.topic)).size
  const updated = all[0] ? formatDate(all[0].date) : ""

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        {/* The masthead: a rule with the journal's count, then the title set very large. */}
        <header className="grid gap-10 pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20">
          <div className="label-mono flex items-center gap-4 text-[11px]">
            <span className="text-foreground">INSIGHTS</span>
            <span aria-hidden className="h-px flex-1 bg-[linear-gradient(90deg,rgb(var(--ink)/0.25),rgb(var(--ink)/0.06))]" />
            <span>{all.length} NOTES · {topics} TOPICS</span>
          </div>
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
            <h1 className="text-[clamp(3.4rem,10.5vw,8.75rem)] leading-[0.88] font-medium tracking-[-0.055em]">
              Notes from
              <br />
              <span className="bg-[linear-gradient(100deg,var(--foreground)_10%,rgb(var(--ink)/0.35)_75%)] bg-clip-text text-transparent">the studio.</span>
            </h1>
            <div className="grid gap-4 border-l border-border pl-5 lg:mb-3">
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                Practical notes on websites, booking, automation, and the work behind them. Written by the people who build them.
              </p>
              {updated && <span className="label-mono text-[11px]">UPDATED {updated.toUpperCase()}</span>}
            </div>
          </div>
        </header>

        <section aria-label="Notes" className="pb-20 sm:pb-28">
          <InsightsIndex posts={posts} />
        </section>

        {/* The close: a question we haven't answered yet. */}
        <section aria-labelledby="ask-title" className="group/cover relative mb-20 overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-[#08080a] sm:mb-28">
          <div aria-hidden className="absolute -top-1/2 right-[-10%] h-[160%] w-[60%] rounded-full bg-[radial-gradient(closest-side,rgb(50_94_181/0.5),transparent)] blur-2xl" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1.2px)] [background-size:16px_16px] [mask-image:radial-gradient(60%_80%_at_80%_50%,#000,transparent)]" />
          <div className="dark relative grid gap-8 p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-16">
            <div className="grid gap-4">
              <span className="label-mono text-[11px] text-white/55">ASK THE STUDIO</span>
              <h2 id="ask-title" className="max-w-2xl text-4xl leading-[1.05] font-medium tracking-[-0.035em] text-balance sm:text-5xl">
                Have a question we haven&apos;t written about yet?
              </h2>
              <p className="max-w-lg text-white/65">Ask us about your own project, or suggest a note. We read every message ourselves.</p>
            </div>
            <Link href="/contact" className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white pr-2 pl-5 text-[15px] font-medium text-black transition-[gap] duration-300 hover:gap-3">
              Ask us
              <span className="grid size-8 place-items-center rounded-full bg-black text-white"><ArrowRight className="size-4" /></span>
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
