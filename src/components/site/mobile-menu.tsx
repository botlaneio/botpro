"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { NavGroup } from "@/lib/nav"

import { NAV_ICONS } from "./nav-icons"

/** On phones, the whole navigation in a sheet from the top: the solutions, then the other sections. */
export function MobileMenu({ groups, links }: { groups: NavGroup[]; links: { href: string; label: string }[] }) {
  return (
    <Sheet>
      <SheetTrigger className="key-physical grid size-8 place-items-center sm:hidden" aria-label="Open menu">
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="top" className="surface-menu max-h-[90dvh] gap-0 overflow-y-auto rounded-t-none! border-x-0 border-t-0 p-4 pt-3">
        <SheetTitle className="label-mono pt-2 pb-3 text-[11px] font-normal">SOLUTIONS</SheetTitle>
        <div className="grid gap-4">
          {groups.map((g) => (
            <ul key={g.label} className="grid gap-1">
              {g.items.map((item) => {
                const Icon = NAV_ICONS[item.icon]
                return (
                  <li key={item.title}>
                    <SheetClose asChild>
                      <Link href={item.href} className="flex items-center gap-3 rounded-xl p-2 active:bg-foreground/5">
                        <span className="tile-depth size-9 text-foreground/80"><Icon className="size-[17px]" /></span>
                        <span className="grid">
                          <span className="text-sm font-medium">{item.title}</span>
                          <span className="label-mono text-[11px] text-foreground/60">{item.price}</span>
                        </span>
                      </Link>
                    </SheetClose>
                  </li>
                )
              })}
            </ul>
          ))}
        </div>
        <nav aria-label="More" className="mt-4 grid border-t border-border/70 pt-2">
          {links.map((l) => (
            <SheetClose key={l.href} asChild>
              <Link href={l.href} className="rounded-lg px-2 py-2.5 text-sm text-muted-foreground active:bg-foreground/5">{l.label}</Link>
            </SheetClose>
          ))}
        </nav>
        <SheetClose asChild>
          <Link href="/contact" className="btn-light mt-3 inline-flex h-10 items-center justify-center text-sm font-medium">Start a project</Link>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
