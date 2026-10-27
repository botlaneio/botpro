import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { LANES } from "@/lib/lanes"
import { SOLUTIONS } from "@/lib/nav"

import { AmbientLight } from "./ambient-light"
import { BotlaneMark } from "./botlane-mark"

const STUDIO = [
  { href: "/solutions#process", label: "How we work" },
  { href: "/solutions#faq", label: "Questions" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
]

const heading = "label-mono text-[11px]"
const link = "text-sm text-muted-foreground transition-colors hover:text-foreground"

/**
 * The foot of every page: the mark and one line, the whole site in three columns, and the wordmark set
 * very large and very faint along the bottom edge, cut off by it.
 */
export function SiteFooter() {
  const solutions = SOLUTIONS.flatMap((g) => g.items)
  return (
    <footer className="relative overflow-hidden border-t border-border/60">
      <AmbientLight className="bottom-0 h-[34rem] [mask-image:linear-gradient(0deg,#000_25%,transparent)]" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-6 pt-14 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-12 md:pt-16">
        <div className="col-span-2 grid content-start justify-items-start gap-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <BotlaneMark size={30} id="footer-mark" />
            <span className="text-lg font-semibold tracking-[-0.035em]">botlane</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">Websites and web apps, built properly, at a fixed price agreed before we start.</p>
          <Link href="/contact" className="group/cta inline-flex items-center gap-1.5 text-sm font-medium">
            Start a project
            <ArrowRight aria-hidden className="size-3.5 transition-transform duration-300 ease-(--ease-lift) group-hover/cta:translate-x-0.5" />
          </Link>
        </div>

        <nav aria-labelledby="footer-solutions" className="grid content-start gap-3">
          <span id="footer-solutions" className={heading}>SOLUTIONS</span>
          {solutions.map((s) => <Link key={s.title} href={s.href} className={link}>{s.title}</Link>)}
        </nav>

        <nav aria-labelledby="footer-products" className="grid content-start gap-3">
          <span id="footer-products" className={heading}>PRODUCTS</span>
          {LANES.map((l) =>
            l.status === "live" ? (
              <a key={l.id} href={`https://${l.host}`} className={`${link} group/p inline-flex items-center gap-1`}>
                {l.name}
                <ArrowUpRight aria-hidden className="size-3 opacity-0 transition-opacity group-hover/p:opacity-100" />
              </a>
            ) : (
              <span key={l.id} className="inline-flex items-center gap-2 text-sm text-muted-foreground/70">
                {l.name} <span className="label-mono rounded-full border border-border px-1.5 text-[9px]">SOON</span>
              </span>
            ),
          )}
        </nav>

        <nav aria-labelledby="footer-studio" className="grid content-start gap-3">
          <span id="footer-studio" className={heading}>STUDIO</span>
          {STUDIO.map((s) => <Link key={s.href} href={s.href} className={link}>{s.label}</Link>)}
        </nav>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border/60 px-6 py-6 text-[13px] text-muted-foreground sm:px-6">
        <span>© {new Date().getFullYear()} Botlane</span>
        <span className="label-mono text-[11px]">FIXED PRICES · US DOLLARS</span>
      </div>

      {/* The wordmark, huge and faint, sitting on the bottom edge so its feet are cut off. */}
      <div aria-hidden className="pointer-events-none -mb-[0.24em] text-center text-[clamp(5rem,22vw,17rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-transparent select-none bg-[linear-gradient(180deg,color-mix(in_oklch,var(--foreground)_12%,transparent),transparent_85%)] bg-clip-text [-webkit-background-clip:text]">
        botlane
      </div>
    </footer>
  )
}
