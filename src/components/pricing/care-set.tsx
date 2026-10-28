"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { BigPrice } from "@/components/pricing/plan-card"
import { MoneyText } from "@/components/pricing/region"
import { BotlaneMark } from "@/components/site/botlane-mark"
import { needForPlan } from "@/lib/contact"
import { plan } from "@/lib/pricing"
import { cn } from "@/lib/utils"

const PLANS = ["care", "care-plus"] as const
const SITE_CHECKS = ["Core, Ascend or Apex", "Custom design, no templates", "Mobile-ready and fast-loading", "Launch support"]

/**
 * Care, sold the way a subscription is: a dark card floating at an angle over the left panel, the plan
 * on the right (Care or Care Plus, switched in place), and a bar beneath for anyone who needs the site
 * built first. The card settles into its angle as it arrives and straightens a little under the pointer.
 */
export function CareSet() {
  const [picked, setPicked] = useState<(typeof PLANS)[number]>("care")
  const p = plan(picked)
  const site = plan("website-core")

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Left: the floating card over a panel. */}
        <div className="surface-glass relative grid content-end gap-4 p-6 pt-[15.5rem] sm:p-8 sm:pt-[17rem]">
          <div className="care-float absolute -top-5 -left-2 w-[min(100%,24rem)] sm:-top-7 sm:-left-5">
            <div className="relative isolate aspect-[1.6] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[linear-gradient(160deg,#17181b,#060607_70%)] p-5 text-white shadow-[0_30px_60px_-24px_rgb(0_0_0/0.75),0_10px_24px_-12px_rgb(0_0_0/0.6)] sm:p-6">
              <div aria-hidden className="absolute right-4 bottom-3 -z-10 opacity-90 sm:right-5">
                <BotlaneMark size={104} id="care-card-mark" />
              </div>
              <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_90%_100%,rgb(255_255_255/0.07),transparent_70%)]" />
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[12px] font-medium text-black">Monthly · after launch</span>
              <p className="absolute bottom-5 left-5 max-w-[15rem] text-[19px] leading-snug font-medium tracking-tight sm:bottom-6 sm:left-6">
                <span className="text-white/55">Your site, looked after</span><br />every single month.
              </p>
            </div>
          </div>

          <span className="label-mono inline-flex w-fit items-center gap-2 rounded-full border border-border px-2.5 py-1 text-[11px]">
            <span aria-hidden className="size-1.5 rounded-full bg-foreground/80 shadow-[0_0_8px_var(--foreground)]" />
            UPTIME MONITORED
          </span>
          <h3 className="text-3xl font-medium tracking-tight">Launched. Then looked after.</h3>
          <p className="max-w-sm text-muted-foreground">Hosting, updates, backups and small edits, handled every month, so the site stays fast, safe and current.</p>
        </div>

        {/* Right: the plan, Care or Care Plus. */}
        <div className="surface-glass grid content-start gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="grid gap-1.5">
              <h3 className="text-3xl font-medium tracking-tight">{p.name}</h3>
              <p className="max-w-md text-muted-foreground">{p.bestFor}</p>
            </div>
            <div role="tablist" aria-label="Care plans" className="inline-flex rounded-full border border-border p-1">
              {PLANS.map((id) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={picked === id}
                  onClick={() => setPicked(id)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm transition-[background-color,color] duration-200",
                    picked === id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {plan(id).name}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-border/70" />
          <div key={picked} className="grid gap-6 [animation:care-swap_420ms_var(--ease-lift)_both]">
            <BigPrice charge={p.charges[0]} />
            <ul className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
              {p.includes?.map((item) => (
                <li key={item} className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" />{item}</li>
              ))}
            </ul>
          </div>
          <Link href={`/contact?need=${needForPlan(p.id)}`} className="btn-light inline-flex h-10 w-fit items-center gap-1.5 px-5 text-sm font-medium">
            Add {p.name} <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Beneath: for anyone who needs the site first. Black in both themes, so its colours are set here
          rather than read from the theme. */}
      <div className="grid items-center gap-6 rounded-[calc(var(--radius)*1.4)] border border-white/10 bg-[#08090a] p-6 text-white shadow-[var(--shadow-lift)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="grid gap-1.5">
          <h3 className="text-2xl font-medium tracking-tight">Need the site first?</h3>
          <p className="text-white/60">Websites from <span className="text-white"><MoneyText amounts={site.charges[0].amounts} /></span>, one-time. Add Care when it launches.</p>
        </div>
        <ul className="grid gap-x-6 gap-y-2 text-sm text-white/90 sm:grid-cols-2">
          {SITE_CHECKS.map((c) => (
            <li key={c} className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-white/50" />{c}</li>
          ))}
        </ul>
        <Link href="/websites" className="inline-flex h-10 w-fit items-center gap-1.5 rounded-[var(--radius)] bg-white px-5 text-sm font-medium text-black shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)] transition-[filter,transform] duration-150 hover:brightness-95 active:translate-y-px active:scale-[0.97]">
          See websites <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}

