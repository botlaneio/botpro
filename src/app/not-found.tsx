import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { BotlaneMark } from "@/components/site/botlane-mark"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Not found · Botlane",
}

/** Any address that doesn't exist: the mark alone in the dark, and three ways back. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="glow-brand mx-auto grid min-h-[70svh] max-w-6xl place-content-center justify-items-start gap-6 px-6 py-24 text-left sm:justify-items-center sm:text-center">
        <BotlaneMark size={120} id="not-found-mark" />
        <span className="label-mono">404</span>
        <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">Nothing here but the dark.</h1>
        <p className="max-w-md text-lg text-muted-foreground">This page doesn&apos;t exist, or it moved when we rebuilt the site.</p>
        <div className="flex items-center gap-2 sm:flex-wrap sm:justify-center sm:gap-3">
          <Link href="/" className="btn-light inline-flex h-10 shrink-0 items-center px-4 text-sm font-medium whitespace-nowrap sm:px-5">Back to the homepage</Link>
          <Link href="/solutions" className="hidden h-10 items-center px-3 text-sm text-muted-foreground hover:text-foreground sm:inline-flex">Solutions</Link>
          <Link href="/contact" className="group/c inline-flex h-10 shrink-0 items-center gap-1.5 px-2 text-sm whitespace-nowrap sm:px-3 text-muted-foreground hover:text-foreground">
            Start a project <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover/c:translate-x-0.5" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
