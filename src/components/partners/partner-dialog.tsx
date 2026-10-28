"use client"

import { useActionState, useEffect, useState } from "react"
import { ArrowRight, Check } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CLIENT_RANGES, PARTNER_HONEYPOT, PARTNER_TERMS, REFERRAL } from "@/lib/partners"
import { cn } from "@/lib/utils"

import { applyToPartner, type PartnerState } from "./actions"

const HASH = "#partners"

const field =
  "w-full rounded-xl border border-border bg-background/60 px-3.5 text-base sm:text-[15px] text-foreground shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:ring-4 focus:ring-foreground/[0.06] aria-invalid:border-destructive/70"

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-[13px] text-muted-foreground">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="text-[13px] text-destructive">{error}</p>}
    </div>
  )
}

/**
 * The partner programme: a link in the footer that opens a dialog with the terms and a short application.
 * It also opens from #partners on any page, so /partners (which redirects there) and shared links still work.
 */
export function PartnerDialog({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<PartnerState, FormData>(applyToPartner, { status: "idle" })
  const e = state.errors ?? {}

  useEffect(() => {
    const sync = () => window.location.hash === HASH && setOpen(true)
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  const change = (next: boolean) => {
    setOpen(next)
    // Clear #partners on close, so the back button and a reload don't reopen it.
    if (!next && window.location.hash === HASH) history.replaceState(null, "", window.location.pathname + window.location.search)
  }

  return (
    <>
      <a href={HASH} onClick={(ev) => { ev.preventDefault(); change(true) }} className={cn("inline-flex items-center gap-2", className)}>
        Partners
        <span className="label-mono rounded-full border border-border px-1.5 text-[9px]">{REFERRAL.share * 100}%</span>
      </a>

      <Dialog open={open} onOpenChange={change}>
        <DialogContent className="surface-frosted max-h-[90dvh] gap-6 overflow-y-auto p-6 sm:max-w-lg sm:p-8">
          <DialogHeader className="gap-3 text-left">
            <span className="label-mono text-[11px]">PARTNER PROGRAMME</span>
            <DialogTitle className="text-2xl font-medium tracking-tight">Refer a client. Earn {REFERRAL.share * 100}% for a year.</DialogTitle>
            <DialogDescription>For agencies, freelancers and consultants whose clients need a website, a web app or an automation.</DialogDescription>
          </DialogHeader>

          <ul className="grid gap-2.5 text-sm">
            {PARTNER_TERMS.map((t) => (
              <li key={t} className="flex gap-2.5"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-text" />{t}</li>
            ))}
          </ul>

          {state.status === "sent" ? (
            <div role="status" className="surface-hairline grid gap-1.5 p-5">
              <p className="font-medium">Application received.</p>
              <p className="text-sm text-muted-foreground">We’ll reply within two working days with the next steps.</p>
            </div>
          ) : (
            <form action={action} className="grid gap-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="partner-name" label="Your name" error={e.name}>
                  <input id="partner-name" name="name" autoComplete="name" required aria-invalid={!!e.name} className={cn(field, "h-11")} />
                </Field>
                <Field id="partner-agency" label="Agency or business" error={e.agency}>
                  <input id="partner-agency" name="agency" autoComplete="organization" required aria-invalid={!!e.agency} className={cn(field, "h-11")} />
                </Field>
                <Field id="partner-email" label="Email" error={e.email}>
                  <input id="partner-email" name="email" type="email" autoComplete="email" required aria-invalid={!!e.email} className={cn(field, "h-11")} />
                </Field>
                <Field id="partner-website" label="Website (optional)">
                  <input id="partner-website" name="website" type="url" inputMode="url" placeholder="https://" className={cn(field, "h-11")} />
                </Field>
              </div>
              <Field id="partner-clients" label="How many clients do you work with?" error={e.clients}>
                <select id="partner-clients" name="clients" required defaultValue="" aria-invalid={!!e.clients} className={cn(field, "h-11")}>
                  <option value="" disabled>Choose a range</option>
                  {CLIENT_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field id="partner-message" label="Anything we should know? (optional)">
                <textarea id="partner-message" name="message" rows={3} className={cn(field, "py-2.5")} />
              </Field>
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>Leave this empty <input name={PARTNER_HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" /></label>
              </div>
              {state.status === "error" && state.message && <p role="alert" className="text-sm text-destructive">{state.message}</p>}
              <button type="submit" disabled={pending} className="btn-light inline-flex h-11 items-center justify-center gap-1.5 font-medium disabled:opacity-60">
                {pending ? "Sending…" : <>Apply to partner <ArrowRight className="size-4" /></>}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
