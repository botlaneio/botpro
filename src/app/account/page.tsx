import type { Metadata } from "next"
import Link from "next/link"

import { SiteFooter, SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Your account · Botlane",
  description: "Botlane account access is coming soon. Explore our products or start a project today.",
  robots: { index: false, follow: true },
}

// The navigation is the first step. Do not collect credentials until authentication is connected.
export default function Account() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <section aria-labelledby="account-title" className="grid min-h-[60svh] max-w-2xl content-center justify-items-start gap-5 py-16 sm:py-24">
          <h1 id="account-title" className="text-4xl font-medium tracking-tight text-balance sm:text-6xl">Your Botlane account.</h1>
          <p className="text-lg text-muted-foreground">Sign-in and account creation are coming soon. Once available, your account will bring your projects, products, and billing together.</p>
          <p className="text-muted-foreground">You can explore our products or start a project today. No account needed.</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/products" className="inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-foreground/[0.05]">Explore products</Link>
            <Link href="/contact" className="btn-light inline-flex min-h-11 items-center px-5 text-sm font-medium">Start a project</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
