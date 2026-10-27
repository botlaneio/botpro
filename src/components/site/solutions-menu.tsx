"use client"

import Link from "next/link"
import { AppWindow, ArrowRight, MessageSquareText, PanelsTopLeft, ShieldCheck } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import type { NavGroup, NavIcon, NavItem } from "@/lib/nav"

export const NAV_ICONS: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  websites: PanelsTopLeft,
  apps: AppWindow,
  care: ShieldCheck,
  assistant: MessageSquareText,
}

/** The Founding Ten card in the menu, or null once the offer has closed. */
export interface FoundingCard {
  discount: string
  places: number
  placesLeft: number | null
  endsOn: string
}

const navText =
  "h-8 rounded-md bg-transparent px-2 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent data-open:bg-transparent data-open:text-foreground data-open:hover:bg-transparent data-open:focus:bg-transparent"

/** One solution: icon tile, name, one line, its starting price, and an arrow that arrives on hover. */
function Item({ item }: { item: NavItem }) {
  const Icon = NAV_ICONS[item.icon]
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className="group/item grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-0.5 rounded-xl p-3 transition-colors duration-200 hover:bg-foreground/[0.045] focus-visible:bg-foreground/[0.045]"
      >
        <span className="tile-depth row-span-2 size-9 text-foreground/80 transition-colors duration-200 group-hover/item:text-foreground">
          <Icon className="size-[17px]" />
        </span>
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {item.title}
          <ArrowRight
            aria-hidden
            className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-[opacity,translate] duration-300 ease-(--ease-lift) group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100"
          />
        </span>
        <span className="grid gap-1.5">
          <span className="text-[13px] leading-snug text-pretty text-muted-foreground">{item.body}</span>
          <span className="label-mono text-[11px] whitespace-nowrap text-foreground/60">{item.price}</span>
        </span>
      </Link>
    </NavigationMenuLink>
  )
}

/** The feature on the right: the Founding Ten while it is open, otherwise a plain invitation to talk. */
function Feature({ founding }: { founding: FoundingCard | null }) {
  return (
    <div className="surface-spotlight relative col-span-2 flex flex-col gap-3 overflow-hidden p-5 lg:col-span-1">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(50%_60%_at_50%_100%,color-mix(in_oklch,var(--brand)_28%,transparent),transparent)]" />
      {founding ? (
        <>
          <span className="relative flex items-center gap-2 text-sm">
            <span aria-hidden className="size-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--brand)]" />
            <span className="font-medium text-brand-text">Founding Ten</span>
          </span>
          <p className="relative text-[15px] leading-snug font-medium text-balance">
            {founding.discount} off website and app builds for our first {founding.places} clients.
          </p>
          <p className="relative text-[13px] text-muted-foreground">Until {founding.endsOn}.</p>
          {founding.placesLeft !== null && (
            <span className="label-mono relative w-fit rounded-full border border-border px-2 py-0.5 text-[11px] tabular-nums">
              {founding.placesLeft} of {founding.places} left
            </span>
          )}
        </>
      ) : (
        <>
          <span className="label-mono relative text-[11px]">NOT SURE WHERE TO START?</span>
          <p className="relative text-[15px] leading-snug font-medium text-balance">Tell us what you&apos;re building. We&apos;ll tell you honestly what fits.</p>
        </>
      )}
      <NavigationMenuLink asChild>
        <Link href="/contact" className="btn-light relative mt-auto inline-flex h-8 w-fit items-center gap-1.5 px-3 text-sm font-medium">
          Start a project <ArrowRight aria-hidden className="size-3.5" />
        </Link>
      </NavigationMenuLink>
    </div>
  )
}

/**
 * The Solutions mega menu: what we build and what we look after, each with its starting price,
 * and the Founding Ten on the right. Radix gives it keyboard support, hover intent and focus handling.
 */
export function SolutionsMenu({
  groups,
  more,
  founding,
}: {
  groups: NavGroup[]
  more: { href: string; label: string }[]
  founding: FoundingCard | null
}) {
  return (
    <NavigationMenu viewport={false} className="hidden sm:flex">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navText}>Solutions</NavigationMenuTrigger>
          <NavigationMenuContent className="absolute! top-full! left-0! mt-3! w-auto! overflow-visible! rounded-none! bg-transparent! p-0! shadow-none! ring-0! data-open:duration-200! data-closed:duration-150!">
            <div className="surface-menu grid w-[min(880px,calc(100vw-12rem))] grid-cols-2 gap-2 p-2 lg:grid-cols-[1fr_1fr_16rem]">
              {groups.map((g) => (
                <div key={g.label} className="grid content-start gap-1">
                  <span className="label-mono px-3 pt-3 pb-1 text-[11px]">{g.label.toUpperCase()}</span>
                  <ul className="grid gap-1">
                    {g.items.map((item) => (
                      <li key={item.title}><Item item={item} /></li>
                    ))}
                  </ul>
                </div>
              ))}
              <Feature founding={founding} />
              <div className="col-span-full flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 px-3 pt-3 pb-1.5 text-[13px]">
                {more.map((m) => (
                  <NavigationMenuLink key={m.href} asChild>
                    <Link href={m.href} className="text-muted-foreground transition-colors hover:text-foreground">{m.label}</Link>
                  </NavigationMenuLink>
                ))}
                <span className="label-mono ml-auto text-[11px]">FIXED PRICES · US DOLLARS</span>
                <NavigationMenuLink asChild>
                  <Link href="/solutions" className="group/all inline-flex items-center gap-1 font-medium text-foreground">
                    All solutions
                    <ArrowRight aria-hidden className="size-3.5 transition-transform duration-300 ease-(--ease-lift) group-hover/all:translate-x-0.5" />
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
