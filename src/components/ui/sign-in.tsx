"use client"

import { useId, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Check, Eye, EyeOff, FileText, LockKeyhole, PanelsTopLeft, Workflow } from "lucide-react"

import { BotlaneMark } from "@/components/site/botlane-mark"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  accountErrors,
  accountReady,
  emptyAccountFields,
  firstAccountError,
  PASSWORD_MIN,
  type AccountErrors,
  type AccountField,
  type AccountFields,
  type AccountMode,
} from "@/lib/account-form"
import { cn } from "@/lib/utils"

import "./sign-in.css"

export interface SignInPageProps {
  title?: ReactNode
  description?: ReactNode
  mode?: AccountMode
  onSignIn?: (event: FormEvent<HTMLFormElement>) => void
  onResetPassword?: () => void
  onCreateAccount?: () => void
  onSwitchToSignIn?: () => void
  notice?: ReactNode
}

const inputClass =
  "h-11 rounded-xl border-border bg-neutral-2 px-3.5 text-base shadow-none placeholder:text-muted-foreground md:text-base dark:border-input dark:bg-neutral-4"

const focusLink =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"

/** What an account is for. Lines are the product's own, not a customer quote. */
const PRODUCTS: {
  href: string
  name: string
  line: string
  scope?: string
  soon?: boolean
  Icon: typeof PanelsTopLeft
}[] = [
  { href: "/websites", name: "Websites", line: "Fixed price, with the scope agreed before we start.", Icon: PanelsTopLeft },
  { href: "/products/syncc", name: "Syncc", line: "Share one link. People pick a time, and it lands in your calendar.", scope: "lane-teal", Icon: CalendarDays },
  { href: "/products/scriblane", name: "Scriblane", line: "Invoices, scans and Office files in. Clean, checked data out.", scope: "lane-violet", Icon: FileText },
  { href: "/products/flowlane", name: "Flowlane", line: "Automate the busywork between your tools, your team and your clients.", scope: "lane-orchid", soon: true, Icon: Workflow },
]

const CHIPS = ["Preview only", "Nothing is sent", "No tracking cookies"]

export function SignInPage({
  title,
  description,
  mode = "signin",
  onSignIn,
  onResetPassword,
  onCreateAccount,
  onSwitchToSignIn,
  notice,
}: SignInPageProps) {
  const signup = mode === "signup"
  return (
    <div className="auth-page relative min-h-dvh text-foreground" data-reveal="off">
      {signup ? (
        <SignUp
          title={title}
          description={description}
          onSignIn={onSignIn}
          onSwitchToSignIn={onSwitchToSignIn}
          notice={notice}
        />
      ) : (
        <SignIn
          title={title}
          description={description}
          onSignIn={onSignIn}
          onResetPassword={onResetPassword}
          onCreateAccount={onCreateAccount}
          notice={notice}
        />
      )}
    </div>
  )
}

function SignUp({ title, description, onSignIn, onSwitchToSignIn, notice }: Omit<SignInPageProps, "mode">) {
  const uid = useId()
  const form = useAccountForm("signup", onSignIn)
  return (
    <div className="relative lg:grid lg:grid-cols-2">
      <div className="auth-col relative px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="auth-wash absolute -top-16 -left-24 h-[34rem] w-[34rem] rounded-full blur-2xl" />
          <div className="auth-wash-soft absolute bottom-0 left-[12%] h-[22rem] w-[26rem] rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto w-full max-w-[28rem]">
          <Logo id={`${uid}-mark`} className="auth-rise mb-5" />
          <div className="auth-rise rounded-[1.5rem] border border-border/80 bg-card px-5 py-6 shadow-[var(--shadow-lift)] sm:px-7 sm:py-8 [--auth-delay:60ms]">
            <h1 id={`${uid}-title`} className="text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">
              {title ?? "Get started"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {description ?? "Your projects, products, and what comes next."}
            </p>
            <form className="mt-6 grid gap-4" method="post" noValidate onSubmit={form.submit} aria-describedby={`${uid}-notice`}>
              <TextField
                id={`${uid}-email`}
                label="Work email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder="you@company.com"
                value={form.fields.email}
                error={form.shown.email}
                onChange={(value) => form.set("email", value)}
                onBlur={() => form.touch("email")}
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  id={`${uid}-given`}
                  label="First name"
                  name="given-name"
                  autoComplete="given-name"
                  placeholder="Ada"
                  value={form.fields.firstName}
                  error={form.shown.firstName}
                  onChange={(value) => form.set("firstName", value)}
                  onBlur={() => form.touch("firstName")}
                />
                <TextField
                  id={`${uid}-family`}
                  label="Last name"
                  name="family-name"
                  autoComplete="family-name"
                  placeholder="Lovelace"
                  value={form.fields.lastName}
                  error={form.shown.lastName}
                  onChange={(value) => form.set("lastName", value)}
                  onBlur={() => form.touch("lastName")}
                />
              </div>
              <TextField
                id={`${uid}-password`}
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={form.fields.password}
                error={form.shown.password}
                hint={form.shown.password ? undefined : `At least ${PASSWORD_MIN} characters.`}
                onChange={(value) => form.set("password", value)}
                onBlur={() => form.touch("password")}
                revealed={form.revealed}
                onToggleReveal={() => form.setRevealed((open) => !open)}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <Button variant="outline" className="h-11 px-4" asChild>
                  <Link href="/"><ArrowLeft aria-hidden />Back</Link>
                </Button>
                <Button type="submit" className="btn-light h-11 px-5" disabled={!form.ready}>
                  Create account
                </Button>
              </div>
              <Notice id={`${uid}-notice`} notice={notice || form.fallback} />
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={onSwitchToSignIn} disabled={!onSwitchToSignIn} className={cn("font-medium text-foreground underline underline-offset-4 hover:text-foreground/80 disabled:cursor-not-allowed disabled:opacity-60", focusLink)}>
                Sign in
              </button>
            </p>
          </div>
          <Legal className="auth-rise mt-6 [--auth-delay:140ms]" />
          <Chips className="auth-rise mt-4 [--auth-delay:180ms]" />
        </div>
      </div>

      <aside aria-labelledby={`${uid}-aside`} className="auth-col px-4 pt-4 pb-64 sm:px-8 sm:pb-48 lg:px-12 lg:pt-12 lg:pb-12">
        <div className="auth-rise mx-auto w-full max-w-lg [--auth-delay:120ms]">
          <h2 id={`${uid}-aside`} className="text-balance text-3xl leading-[1.15] font-medium tracking-tight xl:text-[2.65rem] xl:leading-[1.12]">
            <span className="text-foreground">Projects, products, and what comes next.</span>{" "}
            <span className="font-normal text-muted-foreground">Websites and web apps from the studio, plus Syncc, Scriblane and Flowlane.</span>
          </h2>
          <ul aria-label="Botlane products" className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border min-[420px]:grid-cols-2 sm:mt-10">
            {PRODUCTS.map((product) => (
              <li key={product.href} className="bg-background">
                <Link href={product.href} className="flex h-full min-h-24 flex-col gap-2 p-4 transition-colors hover:bg-foreground/[0.03] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ring">
                  <span className="flex items-center gap-2">
                    <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg bg-neutral-3", product.scope)}>
                      <product.Icon aria-hidden className={cn("size-4", product.scope ? "text-lane-text" : "text-brand-text")} />
                    </span>
                    <span className="text-sm font-medium">{product.name}</span>
                    {product.soon && <span className="label-mono rounded-full border border-border px-1.5 text-[9px] leading-4">SOON</span>}
                  </span>
                  <span className="text-[13px] leading-5 text-muted-foreground">{product.line}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

function SignIn({ title, description, onSignIn, onResetPassword, onCreateAccount, notice }: Omit<SignInPageProps, "mode">) {
  const uid = useId()
  const form = useAccountForm("signin", onSignIn)
  return (
    <div className="auth-col relative px-4 py-8 sm:py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="auth-ribbon absolute top-1/2 left-1/2 h-[140%] w-[min(1100px,150%)] -translate-x-1/2 -translate-y-1/2" viewBox="0 0 800 640" fill="none">
          <path d="M-60 460C80 300 160 120 320 168C500 222 460 470 640 390C760 338 860 180 940 60" stroke="currentColor" strokeWidth="64" strokeLinecap="round" />
          <path d="M-40 520C140 390 220 210 390 260C570 314 540 500 720 430" stroke="currentColor" strokeWidth="28" strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>
      <div className="relative mx-auto flex w-full max-w-[26.5rem] flex-col items-center">
        <Logo id={`${uid}-mark`} className="auth-rise mb-8" />
        <div className="w-full">
          <Link href="/" className={cn("surface-pill auth-rise mb-3 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm text-foreground/80 [--auth-delay:40ms]", focusLink)}>
            <ArrowLeft aria-hidden className="size-3.5" />
            Back
          </Link>
          <div className="auth-rise rounded-[1.5rem] border border-border/80 bg-card px-5 py-6 shadow-[var(--shadow-lift)] sm:px-7 sm:py-8 [--auth-delay:80ms]">
            <h1 id={`${uid}-title`} className="text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">
              {title ?? "Sign in to Botlane"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description ?? "Your projects, products, and what comes next."}
            </p>
            <form className="mt-6 grid gap-4" method="post" noValidate onSubmit={form.submit} aria-describedby={`${uid}-notice`}>
              <TextField
                id={`${uid}-email`}
                label="Work email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                placeholder="you@company.com"
                value={form.fields.email}
                error={form.shown.email}
                onChange={(value) => form.set("email", value)}
                onBlur={() => form.touch("email")}
              />
              <TextField
                id={`${uid}-password`}
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.fields.password}
                error={form.shown.password}
                onChange={(value) => form.set("password", value)}
                onBlur={() => form.touch("password")}
                revealed={form.revealed}
                onToggleReveal={() => form.setRevealed((open) => !open)}
              />
              <Button type="submit" className="btn-light mt-1 h-11 w-full">Sign in</Button>
              <button type="button" onClick={onResetPassword} disabled={!onResetPassword} className={cn("justify-self-center text-sm text-foreground underline underline-offset-4 hover:text-foreground/80 disabled:cursor-not-allowed disabled:opacity-60", focusLink)}>
                Forgot password?
              </button>
              <Notice id={`${uid}-notice`} notice={notice || form.fallback} />
            </form>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              New to Botlane?{" "}
              <button type="button" onClick={onCreateAccount} disabled={!onCreateAccount} className={cn("font-medium text-foreground underline underline-offset-4 hover:text-foreground/80 disabled:cursor-not-allowed disabled:opacity-60", focusLink)}>
                Create an account
              </button>
            </p>
          </div>
        </div>
        <p className="auth-rise mt-6 inline-flex max-w-sm items-start gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-left text-[13px] leading-5 text-muted-foreground [--auth-delay:140ms]">
          <LockKeyhole aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>Nothing you type is sent or saved.</span>
        </p>
        <Chips className="auth-rise mt-4 [--auth-delay:180ms]" />
        <Legal className="auth-rise mt-4 [--auth-delay:220ms]" />
      </div>
    </div>
  )
}

function useAccountForm(mode: AccountMode, onSignIn?: (event: FormEvent<HTMLFormElement>) => void) {
  const [fields, setFields] = useState<AccountFields>(emptyAccountFields)
  const [errors, setErrors] = useState<AccountErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [touched, setTouched] = useState<Partial<Record<AccountField, boolean>>>({})
  const [revealed, setRevealed] = useState(false)
  const [fallback, setFallback] = useState("")

  const shown: AccountErrors = {}
  for (const key of Object.keys(errors) as AccountField[]) {
    if (attempted || touched[key]) shown[key] = errors[key]
  }

  const set = (key: AccountField, value: string) => {
    const next = { ...fields, [key]: value }
    setFields(next)
    if (attempted || touched[key]) setErrors(accountErrors(mode, next))
  }

  const touch = (key: AccountField) => {
    setTouched((current) => ({ ...current, [key]: true }))
    setErrors(accountErrors(mode, fields))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next = accountErrors(mode, fields)
    setAttempted(true)
    setErrors(next)
    const invalid = firstAccountError(mode, next)
    if (invalid) {
      document.getElementById(fieldId(event.currentTarget, invalid))?.focus()
      return
    }
    if (onSignIn) onSignIn(event)
    else setFallback("Account access is not connected yet. Nothing was sent or saved.")
  }

  return { fields, set, touch, shown, revealed, setRevealed, submit, ready: accountReady(mode, fields), fallback }
}

/** Ids are useId-prefixed; the suffix is stable so a failed submit can focus the field. */
function fieldId(form: HTMLFormElement, key: AccountField) {
  const name = key === "firstName" ? "given-name" : key === "lastName" ? "family-name" : key
  const input = form.elements.namedItem(name)
  return input instanceof HTMLInputElement ? input.id : ""
}

function TextField({
  id, label, name, type = "text", autoComplete, inputMode, spellCheck, placeholder, value, error, hint, onChange, onBlur, revealed, onToggleReveal,
}: {
  id: string
  label: string
  name: string
  type?: "text" | "email" | "password"
  autoComplete: string
  inputMode?: "email"
  spellCheck?: boolean
  placeholder: string
  value: string
  error?: string
  hint?: string
  onChange: (value: string) => void
  onBlur: () => void
  revealed?: boolean
  onToggleReveal?: () => void
}) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const described = error ? errorId : hint ? hintId : undefined
  const inputType = type === "password" && revealed ? "text" : type
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          inputMode={inputMode}
          spellCheck={spellCheck}
          autoCapitalize={type === "email" ? "none" : undefined}
          placeholder={placeholder}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={described}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className={cn(inputClass, type === "password" && "pr-12")}
        />
        {type === "password" && onToggleReveal && (
          <button
            id={`${id}-reveal`}
            type="button"
            onClick={onToggleReveal}
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            aria-controls={id}
            className={cn("absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-muted-foreground hover:text-foreground", focusLink)}
          >
            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error ? <p id={errorId} role="alert" className="auth-error text-sm leading-5">{error}</p> : hint ? <p id={hintId} className="text-sm leading-5 text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function Logo({ id, className }: { id: string; className?: string }) {
  return (
    <Link href="/" className={cn("surface-pill inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold tracking-tight", focusLink, className)}>
      <BotlaneMark size={22} id={id} />
      botlane
    </Link>
  )
}

function Notice({ id, notice }: { id: string; notice?: ReactNode }) {
  if (!notice) return null
  return (
    <p id={id} role="status" aria-live="polite" className="text-sm leading-6 text-muted-foreground">{notice}</p>
  )
}

function Legal({ className }: { className?: string }) {
  return (
    <p className={cn("text-center text-xs leading-5 text-muted-foreground", className)}>
      This page does not create an account or sign you in.{" "}
      <Link href="/contact" className={cn("text-foreground underline underline-offset-4", focusLink)}>Contact the studio</Link>
      {" "}if you need a hand.
    </p>
  )
}

function Chips({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {CHIPS.map((chip) => (
        <li key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
          <Check aria-hidden className="size-3.5 text-foreground/70" />
          {chip}
        </li>
      ))}
    </ul>
  )
}
