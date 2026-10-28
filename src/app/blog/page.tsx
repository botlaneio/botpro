import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PenLine } from "lucide-react"

import { InsightsIndex } from "@/components/insights/insights-index"
import { PageShell } from "@/components/site/page-shell"
import { formatDate, postsByDate, readingMinutes } from "@/lib/insights"

export const metadata: Metadata = {
  title: "Insights · Botlane",
  description: "Practical notes on websites, booking, automation, and the work behind them.",
}

/** The notes, newest first, and an invitation to ask about anything they don't cover. */
export default function Blog() {
  const posts = postsByDate().map((p) => ({ slug: p.slug, title: p.title, dek: p.dek, topic: p.topic, date: formatDate(p.date), minutes: readingMinutes(p), cover: p.cover }))
  return (
    <PageShell
      eyebrow="INSIGHTS"
      title="Notes from the studio."
      intro="Practical notes on websites, booking, automation, and the work behind them."
    >
      <section aria-label="Notes" className="grid gap-16 pb-12 sm:pb-16">
        <InsightsIndex posts={posts} />

        <div className="surface-hairline grid gap-5 p-6 sm:flex sm:items-center sm:p-8">
          <span className="tile-depth size-11 shrink-0 text-foreground"><PenLine className="size-5" /></span>
          <p className="max-w-lg text-muted-foreground sm:flex-1">
            Something you&apos;d like us to write about, or a question about your own project? Ask us directly.
          </p>
          <Link href="/contact" className="btn-light inline-flex h-10 w-fit items-center gap-1.5 px-5 text-sm font-medium">Ask us <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </PageShell>
  )
}
