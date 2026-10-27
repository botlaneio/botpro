import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PenLine } from "lucide-react"

import { PageSection, PageShell } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "Insights · Botlane",
  description: "Notes from the studio on designing, building and looking after websites and web apps.",
}

/** The blog's index. No posts are published yet, so it says so plainly rather than showing placeholders. */
export default function Blog() {
  return (
    <PageShell
      eyebrow="INSIGHTS"
      title="Notes from the studio."
      intro="What we learn designing, building and looking after websites and web apps, written down as we go."
    >
      <PageSection id="posts" eyebrow="LATEST" title="The first posts are on their way.">
        <div className="surface-hairline flex flex-wrap items-center gap-5 p-6 sm:p-8">
          <span className="tile-depth size-11 shrink-0 text-foreground"><PenLine className="size-5" /></span>
          <p className="max-w-lg flex-1 text-muted-foreground">
            We&apos;re writing them now. In the meantime, if there&apos;s something you&apos;d like us to cover, or a question about your own project, ask us directly.
          </p>
          <Link href="/contact" className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">Ask us <ArrowRight className="size-4" /></Link>
        </div>
      </PageSection>
    </PageShell>
  )
}
