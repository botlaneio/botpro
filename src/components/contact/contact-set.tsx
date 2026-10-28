"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, CircleHelp, Radio, Sparkles, Workflow } from "lucide-react"

import { sendBrief, type ContactState } from "@/app/contact/actions"
import { NAV_ICONS } from "@/components/site/nav-icons"
import { HONEYPOT, contactSchema, type ContactField, type FieldErrors, type NeedId } from "@/lib/contact"
import { cn } from "@/lib/utils"

import type { NeedOption } from "./contact-form"

type Values = Record<ContactField, string>

/** The four steps, one question each. The service is chosen on its own card, any time before sending. */
const STEPS = [
  { f: "name", label: "Your name", place: "Jane Miller", type: "text", auto: "name" },
  { f: "email", label: "Your email", place: "jane@company.com", type: "email", auto: "email" },
  { f: "brief", label: "Your project", place: "What it is, who it's for, and what a good result looks like." },
  { f: "company", label: "Your company · optional", place: "Northstar", type: "text", auto: "organization" },
] as const

// What the last step also checks: the service, chosen on the services card.
const CHECKS: ContactField[][] = [["name"], ["email"], ["brief"], ["company", "need"]]

// One line under each service, in the visitor's terms.
const NEED_LINE: Record<NeedId, string> = {
  website: "Core, Ascend and Apex",
  "web-app": "From a scoping sprint to a full build",
  care: "Hosting, updates and small edits",
  assistant: "Answers visitors, day and night",
  custom: "Automation and document processing",
  "not-sure": "We'll help you choose",
}
const NEED_ICON: Partial<Record<NeedId, React.ComponentType<{ className?: string }>>> = { custom: Workflow, "not-sure": Sparkles }

function check(fields: ContactField[], values: Values): FieldErrors {
  const pick = Object.fromEntries(fields.map((f) => [f, true])) as Partial<Record<ContactField, true>>
  const r = contactSchema.pick(pick).safeParse(values)
  if (r.success) return {}
  const out: FieldErrors = {}
  for (const i of r.error.issues) {
    const f = i.path[0] as ContactField
    if (!out[f]) out[f] = i.message
  }
  return out
}

/** How much of the brief is answered: a quarter for each of name, email, project and service. */
function progress(v: Values) {
  const ok = [v.name.trim().length > 0, /^\S+@\S+\.\S+$/.test(v.email.trim()), v.brief.trim().length >= 20, v.need !== ""]
  return ok.filter(Boolean).length * 25
}

/** A number that runs to its new value rather than jumping. */
function useRunning(to: number) {
  const [now, setNow] = useState(to)
  const from = useRef(to)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 700)
      const v = Math.round(a + (to - a) * (1 - (1 - k) ** 3))
      setNow(v)
      from.current = v
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return now
}

/** A row of stacked lines, the mark beside the heading. */
function Rungs() {
  return (
    <span aria-hidden className="mt-1.5 grid w-4 gap-[3px]">
      {Array.from({ length: 11 }, (_, i) => <span key={i} className="h-[2px] rounded-full bg-white/80" />)}
    </span>
  )
}

/**
 * The bar that moves the brief on: a white pill joined to a round counter at each end by a liquid neck, the
 * step on the left and the steps done on the right. The shapes are fused by an SVG "goo" filter; the words
 * sit on a layer above it so they stay crisp.
 */
function StepBar({ step, done, label, disabled }: { step: number; done: number; label: React.ReactNode; disabled: boolean }) {
  return (
    <div className="group/bar relative h-[5.25rem] select-none">
      <svg aria-hidden className="absolute size-0">
        <filter id="set-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9" />
        </filter>
      </svg>
      <div aria-hidden className="absolute inset-0 [filter:url(#set-goo)]">
        <span className="absolute top-0 left-0 size-[5.25rem] rounded-full bg-white" />
        <span className="absolute inset-y-[0.3rem] right-[5.6rem] left-[5.6rem] rounded-full bg-white transition-[left,right] duration-500 ease-(--ease-lift) group-hover/bar:right-[5.4rem] group-hover/bar:left-[5.4rem]" />
        <span className="absolute top-0 right-0 size-[5.25rem] rounded-full bg-white" />
      </div>
      <span aria-hidden className="absolute top-0 left-0 grid size-[5.25rem] place-content-center text-center text-black">
        <span key={step} className="text-[1.9rem] leading-none font-light tabular-nums [animation:set-in_400ms_var(--ease-lift)_both]">{step}</span>
        <span className="mt-1 text-[11px] text-black/45">Step</span>
      </span>
      <span aria-hidden className="absolute top-0 right-0 grid size-[5.25rem] place-content-center text-center text-black">
        <span key={done} className="text-[1.9rem] leading-none font-light tabular-nums [animation:set-in_400ms_var(--ease-lift)_both]">{done}</span>
        <span className="mt-1 text-[11px] text-black/45">Done</span>
      </span>
      <button
        type="submit"
        disabled={disabled}
        className="absolute inset-y-[0.3rem] right-[5.6rem] left-[5.6rem] rounded-full text-[1.3rem] font-medium text-black outline-offset-4 transition-[scale] duration-150 active:scale-[0.985] disabled:opacity-70"
      >
        {label}
      </button>
    </div>
  )
}

/**
 * The contact page's form, after a "Get in touch" set: a red glass card asking one thing at a time, a black
 * services card to pick from, and a black card that gathers the answers and counts up to 100% as they come
 * in. It sends through the same server action as before, which checks everything again.
 */
export function ContactSet({ needs, initial }: { needs: NeedOption[]; initial: Partial<Values> }) {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Values>({ brief: "", need: "", name: "", email: "", company: "", ...initial } as Values)
  const [errors, setErrors] = useState<FieldErrors>({})
  const started = useRef<HTMLInputElement>(null)
  const form = useRef<HTMLFormElement>(null)

  const [state, action, pending] = useActionState(async (prev: ContactState, data: FormData) => {
    const next = await sendBrief(prev, data)
    if (next.errors) {
      setErrors(next.errors)
      const at = CHECKS.findIndex((fs) => fs.some((f) => next.errors?.[f]))
      if (at >= 0) setStep(at)
    }
    return next
  }, { status: "idle" })

  useEffect(() => {
    if (started.current) started.current.value = String(Date.now())
  }, [])

  const sent = state.status === "sent"
  const pct = useRunning(sent ? 100 : progress(values))
  const last = STEPS.length - 1

  const set = (f: ContactField, v: string) => {
    setValues((s) => ({ ...s, [f]: v }))
    if (errors[f]) setErrors((e) => ({ ...e, [f]: undefined }))
  }
  const go = (to: number) => {
    setStep(to)
    requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[data-step="${to}"]`)?.focus())
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const found = check(CHECKS[step], values)
    setErrors(found)
    if (Object.keys(found).length || step < last) e.preventDefault()
    if (!Object.keys(found).length && step < last) go(step + 1)
  }
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); form.current?.requestSubmit() }
  }

  const status = sent ? "SENT" : pending ? "SENDING" : pct === 100 ? "READY TO SEND" : pct === 0 ? "WAITING FOR YOUR ANSWERS" : "IN PROGRESS"
  const chosen = needs.find((n) => n.id === values.need)
  const Chosen = chosen ? (NEED_ICON[chosen.id] ?? (chosen.icon ? NAV_ICONS[chosen.icon] : CircleHelp)) : Radio

  // The answers so far, as pills; the next one to give, as an outlined one.
  const pills = [
    { k: "name", v: values.name.trim(), hint: "Your name" },
    { k: "email", v: /^\S+@\S+\.\S+$/.test(values.email.trim()) ? values.email.trim() : "", hint: "Your email" },
    { k: "brief", v: values.brief.trim().length >= 20 ? "Project brief" : "", hint: "Your project" },
    { k: "need", v: chosen?.label ?? "", hint: "A service" },
    { k: "company", v: values.company.trim(), hint: "" },
  ]
  const next = pills.find((p) => !p.v && p.hint)

  return (
    <div className="dark grid gap-4 lg:grid-cols-[1.22fr_1fr] lg:gap-5">
      {/* The ask: one question at a time. */}
      <section aria-label="Send us a brief" className="set-glass relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
        <div className="flex gap-4">
          <Rungs />
          <h1 className="text-[2.1rem] leading-[1.02] font-medium tracking-[-0.02em] uppercase sm:text-[3.2rem]">
            Start a<br />
            <span className="inline-flex items-center gap-3">project <span aria-hidden className="grid size-9 place-items-center rounded-[0.55rem] bg-white/25 shadow-[inset_0_1px_0_rgb(255_255_255/0.4)] backdrop-blur sm:size-11"><ArrowUpRight className="size-5 sm:size-6" /></span></span>
          </h1>
        </div>
        <p className="mt-7 max-w-[30rem] text-[13px] leading-relaxed tracking-[0.04em] text-white/80 uppercase sm:text-sm">
          Tell us about your project. We read every brief ourselves and reply with honest advice.
        </p>

        {sent ? (
          <div role="status" className="mt-12 grid justify-items-start gap-4 [animation:set-in_500ms_var(--ease-lift)_both]">
            <span className="text-[13px] tracking-[0.06em] text-white/70 uppercase">Sent</span>
            <h2 className="text-3xl font-medium tracking-tight text-balance">{state.name ? `Thanks, ${state.name}. We've got your brief.` : "Thanks. We've got your brief."}</h2>
            <p className="max-w-md text-white/75">
              {state.email ? <>A copy is on its way to <span className="text-white">{state.email}</span>. </> : null}
              We&apos;ll reply with honest advice on whether we&apos;re the right fit.
            </p>
            <Link href="/solutions" className="mt-2 inline-flex h-11 items-center gap-1.5 rounded-full bg-white px-5 text-[15px] font-medium text-black">
              See our solutions <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <form id="contact-set" ref={form} action={action} onSubmit={onSubmit} noValidate className="mt-9 grid gap-6 sm:mt-12">
            <div className="flex items-center justify-between">
              <span className="text-[14px] tracking-[0.06em] tabular-nums uppercase">Step {step + 1} / {STEPS.length}</span>
              {step > 0 && (
                <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-1.5 text-[13px] tracking-[0.06em] text-white/70 uppercase hover:text-white">
                  <ArrowLeft className="size-3.5" /> Back
                </button>
              )}
            </div>

            {/* Every answer stays in the form, so the last step sends them all. Only the current one shows. */}
            <div className="min-h-[7.5rem]">
              {STEPS.map((s, i) => {
                const f = s.f as ContactField
                const err = errors[f]
                const common = {
                  id: `set-${f}`,
                  name: f,
                  "data-step": i,
                  value: values[f],
                  placeholder: s.place,
                  "aria-invalid": !!err,
                  "aria-describedby": err ? `set-${f}-error` : undefined,
                  className: "w-full resize-none border-0 border-b border-white/35 bg-transparent px-0 pb-3 text-[1.35rem] text-white outline-none transition-colors duration-200 placeholder:text-white/35 focus:border-white aria-invalid:border-[#ffb4ab] sm:text-[1.6rem]",
                }
                return (
                  <div key={f} hidden={step !== i} className={cn("grid gap-3", step === i && "[animation:set-in_450ms_var(--ease-lift)_both]")}>
                    {f === "brief" ? (
                      <textarea {...common} rows={3} onKeyDown={onKey} onChange={(e) => set(f, e.target.value)} />
                    ) : (
                      <input {...common} type={"type" in s ? s.type : "text"} autoComplete={"auto" in s ? s.auto : undefined} onChange={(e) => set(f, e.target.value)} />
                    )}
                    <label htmlFor={`set-${f}`} className="text-[13px] tracking-[0.06em] text-white/75 uppercase">{s.label}</label>
                    {err && <p id={`set-${f}-error`} className="text-[13px] text-[#ffb4ab]">{err}</p>}
                  </div>
                )
              })}
            </div>

            <input ref={started} type="hidden" name="started_at" defaultValue="" />
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>Leave this empty <input name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" /></label>
            </div>
            {errors.need && <p role="alert" className="text-[13px] text-[#ffb4ab]">{errors.need} Pick one in Services below.</p>}
            {state.status === "error" && !state.errors && <p role="alert" className="text-[13px] text-[#ffb4ab]">{state.message}</p>}

            <StepBar step={step + 1} done={step} disabled={pending} label={step < last ? "Next" : pending ? "Sending…" : "Send brief"} />
          </form>
        )}
      </section>

      {/* The message, gathering: answers as pills, then how far along it is. */}
      <section aria-label="Your message" className="set-black order-3 flex min-h-[26rem] flex-col rounded-[2rem] p-3 sm:p-4 lg:order-none lg:row-span-2 lg:min-h-0">
        <div className="grid gap-4 rounded-[1.6rem] bg-[#161618] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <Radio aria-hidden className="size-5 text-white/85" />
            <span className="text-[1.15rem]">Send us a message</span>
          </div>
          <p className="text-[14px] text-white/70">Four quick steps. Your answers go straight to our inbox.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Your answers so far">
            {pills.filter((p) => p.v).map((p) => (
              <li key={p.k} className="max-w-full truncate rounded-full bg-white px-4 py-2.5 text-[14px] text-black [animation:set-in_400ms_var(--ease-lift)_both]">{p.v}</li>
            ))}
            {next && !sent && <li className="rounded-full border border-white/70 px-5 py-2.5 text-[14px] text-white/90">{next.hint}</li>}
          </ul>
        </div>

        <div className="mx-auto grid w-full max-w-md flex-1 content-center justify-items-center gap-3 px-6 py-10" aria-hidden>
          <span className="text-[13px] tabular-nums">{pct}%</span>
          <span className="relative h-px w-full overflow-hidden bg-white/20">
            <span className="absolute inset-y-0 left-0 bg-white transition-[width] duration-700 ease-(--ease-lift)" style={{ width: `${pct}%` }} />
          </span>
          <span className="text-[13px] tracking-[0.08em]">{status}</span>
        </div>

        <div className="flex items-end justify-between px-4 pb-3 sm:px-6 sm:pb-5">
          <span role="img" aria-label={`${pct}% complete`} className="flex items-start font-serif leading-[0.8] font-light">
            <span className="text-[6.5rem] tabular-nums sm:text-[8.5rem]">{pct}</span>
            <span className="mt-1 text-[1.6rem]">%</span>
          </span>
          <ArrowDownRight aria-hidden strokeWidth={1} className={cn("size-16 transition-[rotate] duration-700 ease-(--ease-lift) sm:size-20", (pct === 100 || sent) && "-rotate-45")} />
        </div>
      </section>

      {/* The services, to pick from at any point. */}
      <section aria-labelledby="set-services" className="set-black order-2 flex gap-4 rounded-[2rem] p-3 sm:gap-6 sm:p-4 lg:order-none">
        <div aria-hidden className="relative hidden aspect-[4/5] w-44 shrink-0 place-items-center overflow-hidden rounded-[1.4rem] bg-[radial-gradient(80%_70%_at_50%_35%,rgb(192_40_42/0.55),transparent_70%),linear-gradient(160deg,#1d1012,#070708)] sm:grid">
          <span className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:22px_22px]" />
          <span key={values.need} className="relative grid size-20 place-items-center rounded-[1.4rem] border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_20px_40px_-12px_rgb(192_40_42/0.8)] backdrop-blur [animation:set-in_450ms_var(--ease-lift)_both]">
            <Chosen className="size-8 text-white" />
          </span>
        </div>
        <div className="grid min-w-0 flex-1 content-start gap-1 py-2 pr-1">
          <h2 id="set-services" className="text-[1.15rem]">Services</h2>
          <p className="text-[14px] text-white/60">Scroll and tap to choose</p>
          <div role="radiogroup" aria-labelledby="set-services" className="mt-3 grid max-h-[9.5rem] snap-y snap-mandatory gap-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:none]">
            {needs.map((n) => {
              const Icon = NEED_ICON[n.id] ?? (n.icon ? NAV_ICONS[n.icon] : CircleHelp)
              const on = values.need === n.id
              return (
                <label key={n.id} className={cn("flex cursor-pointer snap-start items-center gap-4 rounded-2xl p-2 transition-colors duration-200", on ? "bg-white/[0.07]" : "hover:bg-white/[0.04]")}>
                  <input type="radio" form="contact-set" name="need" value={n.id} checked={on} onChange={() => set("need", n.id)} className="peer sr-only" />
                  <span className={cn("grid size-14 shrink-0 place-items-center rounded-xl border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white", on ? "border-white/30 bg-white/15" : "border-white/10 bg-white/[0.04]")}>
                    <Icon className={cn("size-6", on ? "text-white" : "text-white/60")} />
                  </span>
                  <span className="grid min-w-0">
                    <span className={cn("truncate text-[1.15rem] transition-colors sm:text-[1.3rem]", on ? "text-white" : "text-white/70")}>{n.label}</span>
                    <span className="truncate text-[13.5px] text-white/50">{NEED_LINE[n.id]}{n.price ? ` · ${n.price}` : ""}</span>
                  </span>
                  {on && <Check aria-hidden className="ml-auto size-5 shrink-0 text-white" />}
                </label>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
