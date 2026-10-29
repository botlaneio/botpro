"use client";

import { useId, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { siApple, siGoogle } from "simple-icons";
import { BotlaneMark } from "@/components/site/botlane-mark";

/** UI preview only. Credentials are never sent or persisted before auth is connected. */
export default function AuthSectionThree() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [notice, setNotice] = useState("");
  const reduced = useReducedMotion();
  const signingUp = mode === "signup";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("This is a preview. Sign-in and account creation are not connected yet. Your details have not been sent or saved.");
  }
  return (
    <section aria-labelledby="auth-heading" className="min-h-svh bg-white p-3 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white">
      <div className="grid min-h-[calc(100svh-1.5rem)] gap-3 lg:grid-cols-[0.94fr_1.06fr] lg:gap-6">
        <div className="flex items-center justify-center rounded-md border border-black/10 bg-white px-6 py-10 dark:border-white/10 dark:bg-[#0a0a0c] lg:px-12 lg:py-16 xl:px-20">
          <div className="mx-auto w-full max-w-[460px]">
            <Link href="/" className="mb-12 inline-flex min-h-11 items-center gap-2 font-semibold tracking-tight"><BotlaneMark size={25} id="auth-mark" />botlane</Link>
            <h1 id="auth-heading" className="text-3xl font-medium tracking-tight text-black sm:text-4xl dark:text-white">{signingUp ? "Create an account" : "Welcome back"}</h1>
            <p className="mt-3 text-sm leading-6 text-black/65 dark:text-white/65">One place for your projects, products, and what comes next.</p>
            <p id="auth-preview" className="mt-5 rounded-lg border border-black/10 px-3 py-2.5 text-xs leading-5 text-black/70 dark:border-white/15 dark:text-white/70">Interface preview — sign-in and account creation are not available yet. Please use sample details only.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[siGoogle, siApple].map((icon) => <button key={icon.slug} type="button" disabled aria-describedby="auth-preview" className="flex min-h-11 w-full min-w-0 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-3 text-sm font-medium text-black/65 disabled:opacity-65 dark:border-white/15 dark:bg-white/5 dark:text-white/65"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0"><path d={icon.path} /></svg><span className="whitespace-nowrap">{signingUp ? "Sign up" : "Sign in"} with {icon.title}</span></button>)}
            </div>
            <div className="my-6 flex items-center gap-4 text-xs text-black/60 dark:text-white/60"><div className="h-px flex-1 bg-black/10 dark:bg-white/10" /><span>or use your email</span><div className="h-px flex-1 bg-black/10 dark:bg-white/10" /></div>
            <form key={mode} onSubmit={submit} aria-describedby="auth-preview" className="space-y-4">
              {signingUp && <div className="grid gap-4 sm:grid-cols-2"><InputField label="First name" name="given-name" placeholder="First name" autoComplete="given-name" /><InputField label="Last name" name="family-name" placeholder="Last name" autoComplete="family-name" /></div>}
              <InputField label="Email" name="email" placeholder="you@company.com" type="email" autoComplete="email" />
              <InputField label="Password" name="password" placeholder={signingUp ? "Create a password" : "Enter your password"} type="password" autoComplete={signingUp ? "new-password" : "current-password"} />
              {signingUp && <div className="pt-2 text-xs leading-5 text-black/65 sm:text-[13px] dark:text-white/65"><CheckboxLine>Send me occasional Botlane product news and updates.</CheckboxLine></div>}
              <button type="submit" className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg border border-black/40 bg-black text-sm font-medium text-white transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85 dark:focus-visible:outline-white">Preview {signingUp ? "sign up" : "sign in"}</button>
              <p role="status" aria-live="polite" className="text-sm leading-6 text-black/70 dark:text-white/70">{notice}</p>
            </form>
            <p className="mt-6 text-center text-sm text-black/65 dark:text-white/65">{signingUp ? "Already have an account?" : "New to Botlane?"} <button type="button" onClick={() => { setMode(signingUp ? "signin" : "signup"); setNotice(""); }} className="min-h-11 font-medium text-black underline underline-offset-4 dark:text-white">{signingUp ? "Sign in" : "Create an account"}</button></p>
            <Link href="/" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"><ArrowLeft size={15} aria-hidden="true" />Back to Botlane</Link>
          </div>
        </div>
        <div className="relative flex min-h-[600px] flex-col overflow-hidden rounded-md bg-[#123c50] p-8 text-white sm:p-12 lg:min-h-0 lg:p-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {/* The blue surface remains visible if the local artwork cannot load. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/daylight/glacial-inlet.webp" alt="" width={1536} height={1024} className="h-full w-full object-cover" decoding="async" />
            <div className="absolute inset-0 bg-linear-to-b from-[#071e34]/90 via-[#0a2947]/55 to-[#061528]/85" />
          </div>
          <div className="relative z-10 flex h-full flex-1 flex-col">
            <motion.div initial={false} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : 0.7 }} className="max-w-[460px] lg:pt-12">
              <span className="inline-flex items-center gap-2 text-sm text-white/75"><LockKeyhole size={16} aria-hidden="true" />Your Botlane workspace</span>
              <h2 className="mt-7 text-3xl font-light leading-tight tracking-[-0.035em] text-white/95 sm:text-4xl">A place for everything you’re building.</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/75">Start a project. Find your next tool. Keep the important details together.</p>
            </motion.div>
            <div className="mt-12 w-full overflow-hidden rounded-2xl border border-white/20 bg-black/80 p-2 shadow-[0_30px_90px_rgba(0,0,0,0.5)] lg:mt-auto lg:-mr-16 lg:translate-x-8 lg:translate-y-20 lg:-rotate-3">
              <div className="overflow-hidden rounded-xl border border-white/15 bg-[#111215]">
                <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3"><span className="size-2 rounded-full bg-white/35" /><span className="size-2 rounded-full bg-white/25" /><span className="size-2 rounded-full bg-white/15" /><span className="ml-3 text-xs text-white/60">Botlane · Workspace preview</span></div>
                <div className="relative h-32 overflow-hidden sm:h-40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/daylight/glacial-inlet.webp" alt="" width={1200} height={800} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
                  <div className="absolute inset-0 bg-linear-to-t from-[#111215] to-transparent" /><h3 className="absolute bottom-5 left-6 text-xl font-medium">Your next chapter starts here.</h3>
                </div>
                <div className="grid gap-0 px-6 pb-6">
                  {[['Start a project', 'From your first idea to launch.', '/contact'], ['Explore products', 'Syncc, Scriblane, and more.', '/products']].map(([title, body, href]) => <Link href={href} key={title} className="group flex min-h-20 items-center gap-3 border-t border-white/10 py-4"><span className="grid min-w-0 flex-1 gap-1"><span className="text-sm font-medium">{title}</span><span className="text-xs text-white/65">{body}</span></span><ArrowUpRight size={18} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>)}
                  <span className="flex items-center gap-2 pt-3 text-xs text-white/65"><Check size={14} aria-hidden="true" />Illustrative preview. No customer data.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function InputField({ label, placeholder, type = "text", name, autoComplete }: { label: string; placeholder: string; type?: "text" | "email" | "password"; name: string; autoComplete: string }) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  return <div className="w-full space-y-1.5 text-left"><label htmlFor={id} className="text-xs font-semibold text-black/70 dark:text-white/70">{label}</label><div className="relative flex min-h-11 items-center rounded-lg border border-black/20 bg-white px-3.5 focus-within:ring-2 focus-within:ring-black/40 dark:border-white/20 dark:bg-white/5 dark:focus-within:ring-white/50"><input id={id} name={name} type={type === "password" && showPassword ? "text" : type} placeholder={placeholder} autoComplete={autoComplete} className="min-h-11 w-full min-w-0 bg-transparent pr-9 text-base text-black outline-none placeholder:text-black/55 sm:text-sm dark:text-white dark:placeholder:text-white/55" />{type === "password" && <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls={id} className="absolute inset-y-0 right-0 grid w-11 cursor-pointer place-items-center rounded-r-lg text-black/65 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 dark:text-white/65 dark:hover:text-white">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>}</div></div>;
}
function CheckboxLine({ children }: { children: ReactNode }) {
  return <label className="flex min-h-11 cursor-pointer items-start gap-3"><input type="checkbox" name="updates" className="mt-1 size-4 shrink-0 cursor-pointer rounded border-black/25 accent-black dark:accent-white" /><span>{children}</span></label>;
}
