"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { NAV_ICONS } from "@/components/site/nav-icons"
import type { NavItem } from "@/lib/nav"
import { cn } from "@/lib/utils"

/**
 * What we do, as four blocks in a two-by-two grid, after the "Service Blocks" reference: plain hairline
 * cards with a round icon, a name, one line and a price. One block at a time is turned over in the main
 * button's finish (white on dark, near-black on light). It starts on the first and follows the pointer or
 * keyboard focus, and stays on the last one visited, so the grid always has one lit block.
 */
export function ServiceBlocks({ items }: { items: NavItem[] }) {
  const [lit, setLit] = useState(0)
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => {
        const Icon = NAV_ICONS[item.icon]
        const on = lit === i
        return (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={() => setLit(i)}
            onFocus={() => setLit(i)}
            className={cn(
              "group/b relative grid min-h-52 content-between gap-8 rounded-2xl border p-5 outline-none transition-[background-color,border-color,color,box-shadow] duration-300 ease-(--ease-soft) focus-visible:ring-3 focus-visible:ring-ring/60 sm:p-6",
              on
                ? "border-transparent bg-[linear-gradient(180deg,var(--primary-top),var(--primary-bottom))] text-primary-foreground shadow-[inset_0_1px_0_var(--primary-lit),0_0_0_1px_var(--primary-ring),0_24px_50px_-28px_var(--float-shadow)]"
                : "border-[rgb(var(--ink)/var(--edge-alpha))] bg-[color-mix(in_oklch,var(--card)_70%,transparent)] text-foreground",
            )}
          >
            <span className="flex items-start justify-between">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full transition-colors duration-300",
                  on ? "bg-[color-mix(in_oklch,var(--primary-foreground)_10%,transparent)]" : "bg-foreground text-background",
                )}
              >
                <Icon className="size-4" />
              </span>
              <ArrowUpRight
                aria-hidden
                className={cn("size-4 transition-[opacity,translate] duration-300 ease-(--ease-lift)", on ? "translate-x-0 opacity-70" : "-translate-x-1 translate-y-1 opacity-0")}
              />
            </span>
            <span className="grid gap-1.5">
              <span className="text-[17px] font-medium tracking-tight">{item.title}</span>
              <span className={cn("text-sm leading-snug text-pretty transition-colors duration-300", on ? "text-[color-mix(in_oklch,var(--primary-foreground)_68%,transparent)]" : "text-muted-foreground")}>
                {item.body}
              </span>
              <span className={cn("label-mono mt-2 text-[11px] transition-colors duration-300", on && "text-[color-mix(in_oklch,var(--primary-foreground)_60%,transparent)]!")}>{item.price}</span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
