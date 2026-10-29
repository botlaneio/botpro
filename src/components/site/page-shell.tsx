import Link from "next/link"
import { ArrowRight, ArrowUpRight, LayoutGrid } from "lucide-react"

import { NAV_ICON_TONES, NAV_ICONS } from "@/components/site/nav-icons"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { LANES } from "@/lib/lanes"
import { SOLUTIONS } from "@/lib/nav"

const priceOf = (icon: string) => SOLUTIONS.flatMap((g) => g.items).find((i) => i.icon === icon)?.price ?? ""

// The four parts of Botlane, for the row of links near the foot of each page.
const MORE = [
  { href: "/websites", title: "Websites", meta: priceOf("websites"), Icon: NAV_ICONS.websites, tone: NAV_ICON_TONES.websites },
  { href: "/web-apps", title: "Web Apps", meta: priceOf("apps"), Icon: NAV_ICONS.apps, tone: NAV_ICON_TONES.apps },
  { href: "/custom-solutions", title: "Custom Solutions", meta: "Quoted after a call", Icon: NAV_ICONS.assistant, tone: "text-(--violet-text)" },
  { href: "/products", title: "Our products", meta: LANES.map((l) => l.name).join(" · "), Icon: LayoutGrid, tone: "text-foreground/70" },
]

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
export function PageShell({ eyebrow, title, intro, banner, actions, aside, current, cta, children }: {
  eyebrow: string
  title: string
  intro: string
  banner?: React.ReactNode
  /** Buttons under the intro. */
  actions?: React.ReactNode
  /** A visual beside the title block from lg, below it on smaller screens. Without one the title block runs alone. */
  aside?: React.ReactNode
  /** The page's own section, by its href: "/websites", "/web-apps", "/custom-solutions" or "/products". */
  current?: string
  /** The closing call to action, when the page has a more specific one than starting a project. */
  cta?: { title: string; body: string; label: string; href: string }
  children: React.ReactNode
}) {
  const others = MORE.filter((i) => i.href !== current)
  const close = cta ?? { title: "Tell us what you're building.", body: "We'll reply with a plan, a timeline and a fixed price.", label: "Start a project", href: "/contact" }
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6">
        {aside ? (
          <header className="glow-brand grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
            <div className="grid justify-items-start gap-5">
              {banner}
              <span className="label-mono">{eyebrow}</span>
              <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-[3.4rem] sm:leading-[1.05]">{title}</h1>
              <p className="max-w-xl text-lg text-muted-foreground">{intro}</p>
              {actions && <div className="mt-2 flex flex-wrap items-center gap-3">{actions}</div>}
            </div>
            {aside}
          </header>
        ) : (
          <header className="glow-brand grid max-w-3xl justify-items-start gap-5 py-12 sm:py-20">
            {banner}
            <span className="label-mono">{eyebrow}</span>
            <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">{title}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">{intro}</p>
            {actions && <div className="mt-2 flex flex-wrap items-center gap-3">{actions}</div>}
          </header>
        )}

        {children}

        {current && (
          <nav aria-labelledby="more-title" className="grid gap-5 border-t border-border/60 py-12 sm:py-16">
            <h2 id="more-title" className="label-mono">MORE FROM BOTLANE</h2>
            <ul data-stagger className="grid gap-3 sm:grid-cols-3">
              {others.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="surface-hairline group/o flex h-full items-start gap-3 p-4 transition-colors hover:bg-foreground/[0.03]">
                    <span className={`tile-depth size-9 shrink-0 ${i.tone}`}><i.Icon className="size-4" /></span>
                    <span className="grid gap-0.5">
                      <span className="font-medium">{i.title}</span>
                      <span className="label-mono text-[11px]">{i.meta}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="ml-auto size-4 shrink-0 opacity-50 transition-[opacity,transform] group-hover/o:translate-x-0.5 group-hover/o:-translate-y-0.5 group-hover/o:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <section aria-labelledby="cta-title" className="surface-glass mb-16 flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="grid gap-2">
            <h2 id="cta-title" className="text-2xl font-medium tracking-tight">{close.title}</h2>
            <p className="text-muted-foreground">{close.body}</p>
          </div>
          <Link href={close.href} className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">{close.label} <ArrowRight className="size-4" /></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
