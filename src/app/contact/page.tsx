import type { Metadata } from "next"

import { ContactSet } from "@/components/contact/contact-set"
import { ContactLight } from "@/components/contact/contact-light"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { NEEDS } from "@/lib/contact"
import { NEED_OPTIONS } from "@/lib/contact-options"

export const metadata: Metadata = {
  title: "Start a project · Botlane",
  description: "Tell us what you're building. We read every brief ourselves and reply with honest advice.",
}

// What happens after the brief is sent. The first is what the visitor is doing now.
const AFTER = [
  { n: "01", title: "Send your brief", body: "Four quick steps. Two minutes." },
  { n: "02", title: "A call and a written scope", body: "We talk it through, then send the scope, the timeline and the price." },
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
      <main>
        {/* The form sits on a bed of blue light, dark in either theme. */}
        <section aria-label="Start a project" className="relative isolate overflow-hidden bg-[#050506] py-10 sm:py-16">
          <ContactLight className="inset-0 -z-10" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ContactSet needs={NEED_OPTIONS} initial={initial} />
          </div>
        </section>

        <section aria-labelledby="next-title" className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:py-20">
          <h2 id="next-title" className="label-mono text-[11px]">WHAT HAPPENS NEXT</h2>
          <ol className="grid gap-x-10 sm:grid-cols-3">
            {AFTER.map((s) => (
              <li key={s.n} className="grid grid-cols-[2rem_1fr] gap-x-2 border-t border-border/60 py-4">
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
