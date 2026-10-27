"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Bot, ChevronDown, Compass, LifeBuoy, Receipt, ShieldCheck } from "lucide-react"

import { ChargeText } from "@/components/pricing/region"
import { OFFERS, plan } from "@/lib/pricing"
import { cn } from "@/lib/utils"

const founding = OFFERS.find((o) => o.id === "founding-ten")!

interface Question {
  icon: React.ComponentType<{ className?: string }>
  q: string
  a: React.ReactNode
}

// Questions about working with Botlane, answered from the price book.
const QUESTIONS: Question[] = [
  {
    icon: ShieldCheck,
    q: "You're new. Why should we trust you with our site?",
    a: (
      <>
        We are new, and we won&apos;t pretend otherwise. What we can show you is the software we&apos;ve built for ourselves, this website,
        and a fixed scope and price before any work starts. Our first {founding.places} clients also get {Math.round(founding.discount * 100)}% off.
      </>
    ),
  },
  { icon: Receipt, q: "Are website prices one-time or monthly?", a: "One-time. You pay once for the build. Care plans are separate and optional." },
  {
    icon: Compass,
    q: "Does the scoping sprint cost extra if we go ahead with the app?",
    a: <>No. The sprint fee of <ChargeText charge={plan("app-scoping").charges[0]} /> is credited towards your build if you go ahead.</>,
  },
  {
    icon: LifeBuoy,
    q: "What happens after launch?",
    a: "The site is yours. If you'd like us to look after it, Care covers hosting, updates, monitoring, backups and an hour of small edits a month. Care Plus adds more hours, faster replies, a monthly report and a quarterly design review.",
  },
  {
    icon: Bot,
    q: "What is the AI Assistant trained on?",
    a: "Your website and your business: your services, prices, policies and common questions. It answers visitors and hands the conversation to you when a person is needed.",
  },
]

const RADIUS = 22, GAP = 12
// A spring with a little overshoot, so cards settle rather than stop.
const SPRING = "cubic-bezier(0.34, 1.36, 0.64, 1)"

/**
 * The questions as one dark card, after the split FAQ shared as a reference: opening a question splits it
 * into a card of its own, and the questions either side regroup around it. Every row is its own block; the
 * cards are drawn by rounding and spacing the rows at the split, so the change can spring. Dark on the light
 * theme; a flat raised tone on the dark one, flat so the rows join without seams.
 */
export function ServicesFaq({ className }: { className?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  const last = QUESTIONS.length - 1
  const list = useRef<HTMLDivElement>(null)
  const [reserve, setReserve] = useState<number>()

  // Hold the list at its tallest: every question closed, plus the longest answer, the two splits either side
  // of it and the padding those splits add. Opening a different question then never moves what follows.
  useEffect(() => {
    const el = list.current
    if (!el) return
    const measure = () => {
      const heads = Array.from(el.querySelectorAll<HTMLElement>("[data-q]")).reduce((h, b) => h + b.offsetHeight, 0)
      const longest = Math.max(...Array.from(el.querySelectorAll<HTMLElement>("[data-a]")).map((p) => p.offsetHeight))
      setReserve(heads + 16 + longest + GAP * 2 + 8 * 4)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={list} className={cn("grid content-start", className)} style={{ minHeight: reserve }}>
      {QUESTIONS.map(({ icon: Icon, q, a }, i) => {
        const on = open === i
        // A row starts or ends a card at the list's ends and on either side of the open question.
        const top = i === 0 || on || (open !== null && i === open + 1)
        const bottom = i === last || on || (open !== null && i === open - 1)
        const split = (on && i > 0) || (open !== null && i === open + 1)
        return (
          <div
            key={q}
            className="bg-neutral-950 text-neutral-100 dark:bg-[color-mix(in_oklch,var(--foreground)_7%,var(--background))] dark:text-foreground"
            style={{
              marginTop: split ? GAP : 0,
              borderTopLeftRadius: top ? RADIUS : 0,
              borderTopRightRadius: top ? RADIUS : 0,
              borderBottomLeftRadius: bottom ? RADIUS : 0,
              borderBottomRightRadius: bottom ? RADIUS : 0,
              paddingTop: top ? 8 : 0,
              paddingBottom: bottom ? 8 : 0,
              transition: `margin 520ms ${SPRING}, border-radius 520ms ${SPRING}, padding 520ms ${SPRING}`,
            }}
          >
            <h3>
              <button
                type="button"
                data-q=""
                id={`${base}-q${i}`}
                aria-expanded={on}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center gap-3.5 rounded-2xl px-5 py-3.5 text-left text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:px-6"
              >
                <Icon className="size-[18px] shrink-0 opacity-70" />
                <span className="flex-1">{q}</span>
                <ChevronDown aria-hidden className={cn("size-4 shrink-0 opacity-70 transition-transform duration-500", on && "rotate-180")} style={{ transitionTimingFunction: SPRING }} />
              </button>
            </h3>
            <div
              id={`${base}-a${i}`}
              role="region"
              aria-labelledby={`${base}-q${i}`}
              inert={!on}
              className="grid transition-[grid-template-rows,opacity] duration-500"
              style={{ gridTemplateRows: on ? "1fr" : "0fr", opacity: on ? 1 : 0, transitionTimingFunction: SPRING }}
            >
              <div className="overflow-hidden">
                <p data-a="" className="px-5 pb-4 pl-[3.25rem] text-[14px] leading-relaxed text-neutral-400 sm:px-6 sm:pl-[3.5rem] dark:text-muted-foreground">{a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
