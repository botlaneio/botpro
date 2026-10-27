import type { Metadata } from "next"

import { ContactForm } from "@/components/contact/contact-form"
import { FlutedGlass } from "@/components/contact/fluted-glass"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { NEEDS } from "@/lib/contact"
import { NEED_OPTIONS } from "@/lib/contact-options"

export const metadata: Metadata = {
  title: "Start a project · Botlane",
  description: "Tell us what you're building. We read every brief ourselves and reply with honest advice.",
}

// What happens after the brief is sent. The first is what the visitor is doing now.
const AFTER = [
  { n: "01", title: "Send your brief", body: "A few lines about what you're building. Two minutes." },
  { n: "02", title: "A call and a fixed quote", body: "We talk it through, then send a written scope and one price." },
  { n: "03", title: "We build it", body: "Design, build and launch, with progress shared as we go." },
]

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ""

export default async function Contact({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // A brief can arrive pre-filled, from the homepage's prompt bar or a "Start a project" link on a solution.
  const q = await searchParams
  const need = one(q.need)
  const initial = {
    brief: one(q.brief).slice(0, 4000),
    need: NEEDS.some((n) => n.id === need) ? need : "",
  }

  return (
    <>
      <SiteHeader />
      {/* On a phone: the pitch, then the form, then what happens next. From lg: pitch and steps left, form right. */}
      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:grid-rows-[auto_1fr] lg:gap-x-24 lg:gap-y-12 lg:py-24">
        <section className="glow-brand grid content-start justify-items-start gap-5">
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">Tell us what you&apos;re building.</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            We read every brief ourselves, and we&apos;ll reply with honest advice on whether we&apos;re the right fit. No sales call unless you want one.
          </p>
        </section>

        <section aria-label="Contact form" className="relative isolate lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {/* A window onto petals through fluted glass, a little larger than the form, which floats over it frosted. */}
          <FlutedGlass src="/images/petals.webp" fallback="/images/petals.jpg" focus={[0.28, 0.5]} className="absolute -inset-3 -z-10 rounded-[1.9rem] sm:-inset-7 sm:rounded-[2.3rem]" />
          <ContactForm needs={NEED_OPTIONS} initial={initial} surface="surface-frosted" />
        </section>

        <section aria-labelledby="next-title" className="grid content-start gap-4 lg:col-start-1 lg:row-start-2">
          <h2 id="next-title" className="label-mono text-[11px]">WHAT HAPPENS NEXT</h2>
          <ol className="grid max-w-md">
            {AFTER.map((s) => (
              <li key={s.n} className="grid grid-cols-[2rem_1fr] gap-x-2 border-t border-border/60 py-3.5">
                <span className="label-mono pt-px text-[11px]">{s.n}</span>
                <span className="grid gap-0.5">
                  <span className="text-[15px] font-medium">{s.title}</span>
                  <span className="text-[13px] text-muted-foreground">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
