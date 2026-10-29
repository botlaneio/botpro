"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check } from "lucide-react"

import { cn } from "@/lib/utils"

import { SiteShowcase } from "../site-showcase"

export interface ShowroomCard {
  id: string
  name: string
  href: string
  tagline: string
  bestFor: string
  price: string
  meta: string
  includes: string[]
  example: "clinic" | "firm" | "launch"
  /** Where a business is, in its own words, for the picker. */
  fit: string
}

/**
 * The three packages as a showroom: a picker that asks where the business is, and three cards, each with its
 * example site, that light up to answer. Nothing is picked at first, so all three read equally.
 */
export function WebsitesShowroom({ cards }: { cards: ShowroomCard[] }) {
  const [pick, setPick] = useState<string | null>(null)

  return (
    <div className="grid gap-10">
      <div className="grid justify-items-center gap-4">
        <span className="text-[15px] text-muted-foreground">Where is your business right now?</span>
        <div role="radiogroup" aria-label="Where is your business right now?" className="flex flex-wrap justify-center gap-2">
          {cards.map((c) => {
            const on = pick === c.id
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPick(on ? null : c.id)}
                className={cn(
                  "h-11 rounded-full border px-5 text-[14px] transition-[background-color,border-color,color,box-shadow] duration-300",
                  on ? "border-transparent bg-foreground text-background shadow-[0_0_28px_-6px_rgb(143_180_242/0.7)]" : "border-border text-foreground/75 hover:border-foreground/30 hover:text-foreground",
                )}
              >
                {c.fit}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((c, i) => {
          const on = pick === c.id
          const dim = pick !== null && !on
          const flagship = i === cards.length - 1
          return (
            <Link
              key={c.id}
              href={c.href}
              className={cn(
                "group relative isolate grid content-start overflow-hidden rounded-[1.75rem] border transition-[opacity,translate,border-color,box-shadow] duration-500 ease-(--ease-lift)",
                on ? "-translate-y-2 border-[#8FB4F2]/55 shadow-[0_40px_80px_-40px_rgb(58_100_184/0.9)]" : flagship ? "border-[#8FB4F2]/25" : "border-border",
                dim ? "opacity-45 hover:opacity-80" : "hover:-translate-y-1",
              )}
            >
              {/* The example site, in a lit well. */}
              <div className="relative overflow-hidden border-b border-border/70 bg-[#070a12] px-6 pt-8 pb-2">
                <div aria-hidden className={cn("absolute -top-1/3 left-1/2 -z-0 h-[120%] w-[90%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(58_100_184/0.5),transparent)] blur-2xl transition-opacity duration-700", on || flagship ? "opacity-100" : "opacity-50 group-hover:opacity-90")} />
                <SiteShowcase example={c.example} still panel={false} className="relative pointer-events-none" />
              </div>
              <div className="grid gap-5 p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid gap-1">
                    <span className="font-mono text-[10.5px] text-muted-foreground">0{i + 1}{flagship ? " · THE FLAGSHIP" : ""}</span>
                    <span className="text-3xl font-medium tracking-[-0.03em]">{c.name}</span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-colors duration-300 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <p className="text-[17px] leading-snug font-medium text-balance">{c.tagline}</p>
                <p className="text-[14.5px] leading-relaxed text-muted-foreground">{c.bestFor}</p>
                <div className="grid gap-1 border-t border-border pt-5">
                  <span className="text-2xl font-medium tracking-[-0.03em]">{c.price}</span>
                  <span className="label-mono text-[10.5px]">{c.meta}</span>
                </div>
                <ul className="grid gap-2.5 text-[14px]">
                  {c.includes.map((x) => <li key={x} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-[#8FB4F2]" />{x}</li>)}
                </ul>
                <span className="mt-1 text-[14px] font-medium">Explore {c.name} <span aria-hidden>→</span></span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
