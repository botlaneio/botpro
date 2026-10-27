import type { Metadata } from "next"

import { ContactForm } from "@/components/contact/contact-form"
import { FoundingBanner } from "@/components/pricing/founding-banner"
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
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8 lg:py-24">
        <section className="glow-brand grid content-start justify-items-start gap-5 sm:gap-6">
          <FoundingBanner />
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">Tell us what you&apos;re building.</h1>
          <p className="max-w-md text-lg text-muted-foreground">
            We read every brief ourselves, and we&apos;ll reply with honest advice on whether we&apos;re the right fit. No sales call unless you want one.
          </p>
        </section>

        <section aria-label="Contact form" className="relative isolate lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {/* Light behind the glass, so it has something to frost: teal from above, a cool steel from below. */}
          <div aria-hidden className="pointer-events-none absolute -inset-8 -z-10">
            <div className="absolute top-0 left-[12%] size-72 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--brand)_42%,transparent),transparent_68%)] blur-2xl" />
            <div className="absolute right-[4%] bottom-[6%] size-80 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--neutral-9)_32%,transparent),transparent_68%)] blur-2xl" />
          </div>
          <ContactForm needs={NEED_OPTIONS} initial={initial} />
        </section>

        <section aria-label="What happens next" className="lg:col-start-1 lg:row-start-2">
          <ol className="grid w-full gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {AFTER.map((s, i) => (
              <li key={s.n} className={`${i === 0 ? "surface-spotlight" : "surface-hairline"} grid content-start gap-2 p-4`}>
                <span className="label-mono text-[11px]">{s.n}</span>
                <span className="font-medium">{s.title}</span>
                <span className="text-[13px] text-muted-foreground">{s.body}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
