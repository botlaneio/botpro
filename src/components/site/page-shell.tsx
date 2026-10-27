import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { NAV_ICONS } from "@/components/site/nav-icons"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { SOLUTIONS } from "@/lib/nav"

/** A titled band of a page, with a hairline above it. */
export function PageSection({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-20 gap-8 border-t border-border/60 py-12 sm:py-16">
      <div className="grid max-w-2xl gap-3">
        <span className="label-mono">{eyebrow}</span>
        <h2 id={`${id}-title`} className="text-3xl font-medium tracking-tight text-balance">{title}</h2>
        {intro && <p className="text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  )
}

/**
 * The frame every solution page shares: the header, a title block, the page's own content, links to the
 * other solutions, and the call to action. `current` is the page's own link, left out of the others.
 */
export function PageShell({ eyebrow, title, intro, banner, current, children }: {
  eyebrow: string
  title: string
  intro: string
  banner?: React.ReactNode
  current?: string
  children: React.ReactNode
}) {
  const others = SOLUTIONS.flatMap((g) => g.items).filter((i) => i.href !== current)
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        <header className="glow-brand grid max-w-3xl justify-items-start gap-5 py-12 sm:py-20">
          {banner}
          <span className="label-mono">{eyebrow}</span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">{title}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{intro}</p>
        </header>

        {children}

        {current && (
          <nav aria-labelledby="more-title" className="grid gap-5 border-t border-border/60 py-12 sm:py-16">
            <h2 id="more-title" className="label-mono">MORE FROM BOTLANE</h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {others.map((i) => {
                const Icon = NAV_ICONS[i.icon]
                return (
                  <li key={i.href}>
                    <Link href={i.href} className="surface-hairline group/o flex h-full items-start gap-3 p-4 transition-colors hover:bg-foreground/[0.03]">
                      <span className="tile-depth size-9 shrink-0"><Icon className="size-4" /></span>
                      <span className="grid gap-0.5">
                        <span className="font-medium">{i.title}</span>
                        <span className="label-mono text-[11px]">{i.price}</span>
                      </span>
                      <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 opacity-50 transition-[opacity,transform] group-hover/o:translate-x-0.5 group-hover/o:-translate-y-0.5 group-hover/o:opacity-100" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}

        <section aria-labelledby="cta-title" className="surface-glass mb-16 flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="grid gap-2">
            <h2 id="cta-title" className="text-2xl font-medium tracking-tight">Tell us what you&apos;re building.</h2>
            <p className="text-muted-foreground">We&apos;ll reply with a plan, a timeline and a fixed price.</p>
          </div>
          <Link href="/contact" className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">Start a project <ArrowRight className="size-4" /></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
