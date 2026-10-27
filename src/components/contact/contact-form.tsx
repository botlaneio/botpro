"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, CircleHelp } from "lucide-react"

import { sendBrief, type ContactState } from "@/app/contact/actions"
import { NAV_ICONS } from "@/components/site/nav-icons"
import { HONEYPOT, STEPS, checkStep, needLabel, type ContactField, type FieldErrors, type NeedId } from "@/lib/contact"
import type { NavIcon } from "@/lib/nav"
import { cn } from "@/lib/utils"

/** One choice on the "what do you need" step, with its starting price when it has one. */
export interface NeedOption {
  id: NeedId
  label: string
  price?: string
  icon?: NavIcon
}

type Values = Record<ContactField, string>

// Ways in, for a visitor staring at an empty box. Each one starts the sentence; they finish it.
const STARTERS = ["A website for my ", "A client portal where ", "A booking system for ", "An internal tool that "]

const field =
  "w-full rounded-xl border border-border bg-background/60 px-3.5 text-[15px] text-foreground shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:ring-4 focus:ring-foreground/[0.06] aria-invalid:border-[color-mix(in_oklch,var(--brand)_70%,transparent)]"

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="text-[13px] text-brand-text">{message}</p> : null
}

/**
 * The contact form: four short steps on one glass card. Every answer stays in the one form, so the last
 * step sends it all to the server action, which checks it again. Each step is checked before moving on.
 */
export function ContactForm({ needs, initial }: { needs: NeedOption[]; initial: Partial<Values> }) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>({ brief: "", need: "", name: "", email: "", company: "", ...initial } as Values)
  const [errors, setErrors] = useState<FieldErrors>({})
  const started = useRef<HTMLInputElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  const [state, action, pending] = useActionState(async (prev: ContactState, form: FormData) => {
    const next = await sendBrief(prev, form)
    if (next.errors) {
      setErrors(next.errors)
      const at = STEPS.findIndex((s) => s.fields.some((f) => next.errors?.[f]))
      if (at >= 0) setStep(at)
    }
    return next
  }, { status: "idle" })

  // When the visitor started, so the server can tell a person from a script.
  useEffect(() => {
    if (started.current) started.current.value = String(Date.now())
  }, [])

  const set = (f: ContactField, v: string) => {
    setValues((s) => ({ ...s, [f]: v }))
    if (errors[f]) setErrors((e) => ({ ...e, [f]: undefined }))
  }
  const go = (to: number) => {
    setStep(to)
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>(`[data-step="${to}"] [data-first]`)?.focus())
  }
  const last = STEPS.length - 1

  // Enter on a step moves on; only the last step sends.
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (step === last) return
    e.preventDefault()
    const found = checkStep(step, values)
    setErrors(found)
    if (!Object.keys(found).length) go(step + 1)
  }

  if (state.status === "sent") {
    return (
      <div className="surface-glass grid justify-items-start gap-5 p-7 sm:p-9" role="status">
        <span className="tile-depth size-11 text-foreground"><Check className="size-5" /></span>
        <h2 className="text-2xl font-medium tracking-tight text-balance">{state.name ? `Thanks, ${state.name}. We've got your brief.` : "Thanks. We've got your brief."}</h2>
        <p className="max-w-md text-muted-foreground">
          {state.email ? <>A copy is on its way to <span className="text-foreground">{state.email}</span>. </> : null}
          We read every brief ourselves, and we&apos;ll reply with honest advice on whether we&apos;re the right fit.
        </p>
        <Link href="/solutions" className="btn-light inline-flex h-9 items-center gap-1.5 px-4 text-sm font-medium">
          See our solutions <ArrowRight className="size-3.5" />
        </Link>
      </div>
    )
  }

  const err = (f: ContactField) => errors[f]
  const described = (f: ContactField) => (err(f) ? `${f}-error` : undefined)

  return (
    <form action={action} onSubmit={onSubmit} noValidate className="surface-glass relative grid gap-6 p-6 sm:p-8">
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <span className="label-mono text-[11px]">SEND US A BRIEF</span>
          <span className="label-mono text-[11px] tabular-nums">STEP {step + 1} / {STEPS.length}</span>
        </div>
        <div className="h-px overflow-hidden rounded-full bg-border" aria-hidden>
          <div className="h-full bg-brand transition-[width] duration-700 ease-(--ease-lift)" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div ref={panel} className="min-h-[18rem]">
        {/* Every step stays in the form, so the last one sends all the answers. Only the current one shows. */}
        <fieldset data-step={0} hidden={step !== 0} className="grid gap-3">
          <legend className="mb-3 text-2xl font-medium tracking-tight">{STEPS[0].title}</legend>
          <textarea
            data-first
            name="brief"
            rows={6}
            value={values.brief}
            onChange={(e) => set("brief", e.target.value)}
            placeholder="What it is, who it's for, and what a good result looks like."
            aria-invalid={!!err("brief")}
            aria-describedby={described("brief")}
            className={cn(field, "resize-none py-3 leading-relaxed")}
          />
          <FieldError id="brief-error" message={err("brief")} />
          {!values.brief && (
            <div className="flex flex-wrap gap-2" aria-label="Ways to start">
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => { set("brief", s); requestAnimationFrame(() => panel.current?.querySelector("textarea")?.focus()) }}
                  className="rounded-full border border-border bg-background/40 px-3 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground">
                  {s.trim()}…
                </button>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset data-step={1} hidden={step !== 1} className="grid gap-2" aria-describedby={described("need")}>
          <legend className="mb-3 text-2xl font-medium tracking-tight">{STEPS[1].title}</legend>
          {needs.map((n, i) => {
            const Icon = n.icon ? NAV_ICONS[n.icon] : CircleHelp
            const on = values.need === n.id
            return (
              <label key={n.id} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-2.5 pr-4 transition-[border-color,background-color] duration-200",
                on ? "border-foreground/25 bg-foreground/[0.05]" : "border-border/70 hover:bg-foreground/[0.03]")}>
                <input type="radio" name="need" value={n.id} checked={on} onChange={() => set("need", n.id)} className="peer sr-only" {...(i === 0 ? { "data-first": true } : {})} />
                <span className="tile-depth size-9 shrink-0 text-foreground/80"><Icon className="size-[17px]" /></span>
                <span className="text-[15px] font-medium">{n.label}</span>
                {n.price && <span className="label-mono ml-auto text-[11px] whitespace-nowrap text-foreground/60">{n.price}</span>}
                <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full border transition-colors", n.price ? "" : "ml-auto", on ? "border-foreground bg-foreground text-background" : "border-border")}>
                  {on && <Check className="size-3" />}
                </span>
              </label>
            )
          })}
          <FieldError id="need-error" message={err("need")} />
        </fieldset>

        <fieldset data-step={2} hidden={step !== 2} className="grid gap-4">
          <legend className="mb-3 text-2xl font-medium tracking-tight">{STEPS[2].title}</legend>
          {([
            { f: "name", label: "Your name", type: "text", auto: "name", place: "Jane Miller" },
            { f: "email", label: "Email", type: "email", auto: "email", place: "jane@company.com" },
            { f: "company", label: "Company · optional", type: "text", auto: "organization", place: "Northstar" },
          ] as const).map(({ f, label, type, auto, place }, i) => (
            <label key={f} className="grid gap-1.5">
              <span className="text-[13px] text-muted-foreground">{label}</span>
              <input
                {...(i === 0 ? { "data-first": true } : {})}
                name={f}
                type={type}
                autoComplete={auto}
                value={values[f]}
                onChange={(e) => set(f, e.target.value)}
                placeholder={place}
                aria-invalid={!!err(f)}
                aria-describedby={described(f)}
                className={cn(field, "h-11")}
              />
              <FieldError id={`${f}-error`} message={err(f)} />
            </label>
          ))}
        </fieldset>

        <fieldset data-step={3} hidden={step !== 3} className="grid gap-1">
          <legend data-first tabIndex={-1} className="mb-3 text-2xl font-medium tracking-tight outline-none">{STEPS[3].title}</legend>
          {([
            ["What you're building", values.brief, 0],
            ["What you need", values.need ? needLabel(values.need as NeedId) : "", 1],
            ["Reply to", [values.name, values.email].filter(Boolean).join(" · "), 2],
          ] as const).map(([label, value, at]) => (
            <div key={label} className="grid grid-cols-[1fr_auto] gap-x-4 border-t border-border/70 py-3">
              <span className="label-mono text-[11px]">{label.toUpperCase()}</span>
              <button type="button" onClick={() => go(at)} className="row-span-2 self-start text-[13px] text-muted-foreground hover:text-foreground">Edit</button>
              <span className="line-clamp-3 text-[15px] whitespace-pre-wrap">{value}</span>
            </div>
          ))}
        </fieldset>
      </div>

      <input ref={started} type="hidden" name="started_at" defaultValue="" />
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Leave this empty <input name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" /></label>
      </div>

      {state.status === "error" && <p role="alert" className="text-[13px] text-brand-text">{state.message}</p>}

      {/* The control: the step you're on, the action, and how many steps are done. */}
      <div className="grid gap-3">
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} className="inline-flex w-fit items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" /> Back
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <span className="key-physical grid size-12 shrink-0 place-items-center rounded-full! leading-none" aria-hidden>
            <span className="grid justify-items-center gap-0.5"><span className="text-[15px] font-medium tabular-nums">{step + 1}</span><span className="text-[9px] text-muted-foreground">Step</span></span>
          </span>
          <button type="submit" disabled={pending} className="btn-light inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full! text-[15px] font-medium disabled:opacity-70">
            {step < last ? <>Next <ArrowRight className="size-4" /></> : pending ? "Sending…" : <>Send brief <ArrowRight className="size-4" /></>}
          </button>
          <span className="key-physical grid size-12 shrink-0 place-items-center rounded-full! leading-none" aria-hidden>
            <span className="grid justify-items-center gap-0.5"><span className="text-[15px] font-medium tabular-nums">{step}</span><span className="text-[9px] text-muted-foreground">Done</span></span>
          </span>
        </div>
      </div>
    </form>
  )
}
