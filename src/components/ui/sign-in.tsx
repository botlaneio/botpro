"use client";

import { useId, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { BotlaneMark } from "@/components/site/botlane-mark";

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}
export interface SignInPageProps {
  title?: ReactNode;
  description?: ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  mode?: "signin" | "signup";
  onSignIn?: (event: FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  onSwitchToSignIn?: () => void;
  notice?: ReactNode;
}
const GoogleIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
  </svg>
);
const GlassInputWrapper = ({ children }: { children: ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-brand-text focus-within:ring-2 focus-within:ring-brand/20">{children}</div>
);
const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: number }) => (
  <div style={{ "--auth-delay": `${delay}ms` } as React.CSSProperties} className="auth-testimonial flex w-64 shrink-0 items-start gap-3 rounded-3xl border border-white/15 bg-black/50 p-5 text-white backdrop-blur-xl">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={testimonial.avatarSrc} width={40} height={40} loading="lazy" className="h-10 w-10 rounded-2xl object-cover" alt={testimonial.name} />
    <div className="text-sm leading-snug"><p className="font-medium">{testimonial.name}</p><p className="text-white/75">{testimonial.handle}</p><p className="mt-1 text-white/90">{testimonial.text}</p></div>
  </div>
);

export function SignInPage({ title, description, heroImageSrc, testimonials = [], mode = "signin", onSignIn, onGoogleSignIn, onResetPassword, onCreateAccount, onSwitchToSignIn, notice }: SignInPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState("");
  const id = useId();
  const signup = mode === "signup";
  const submit = (event: FormEvent<HTMLFormElement>) => {
    // Always prevent browser GET submission, including when no integration callback is supplied.
    event.preventDefault();
    if (onSignIn) onSignIn(event);
    else setFallbackNotice("Account access is not connected yet. Nothing was sent or saved.");
  };
  return (
    <div className="auth-page flex min-h-dvh w-full flex-col bg-background font-sans text-foreground md:flex-row" data-reveal="off">
      <section aria-labelledby={`${id}-title`} className="flex min-w-0 flex-1 items-center justify-center px-6 py-10 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 inline-flex min-h-11 items-center gap-2 font-semibold tracking-tight"><BotlaneMark size={25} id="signin-mark" />botlane</Link>
          <div className="flex flex-col gap-6">
            <h1 id={`${id}-title`} className="auth-element text-4xl leading-tight font-semibold md:text-5xl">{title ?? <span className="font-light tracking-tight">{signup ? "Create an account" : "Welcome back"}</span>}</h1>
            <p className="auth-element text-muted-foreground [--auth-delay:80ms]">{description ?? "Your projects, products, and what comes next. All in one place."}</p>
            <form key={mode} className="space-y-5" onSubmit={submit} aria-describedby={`${id}-notice`}>
              <div className="auth-element [--auth-delay:120ms]">
                <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-medium text-muted-foreground">Email address</label>
                <GlassInputWrapper><input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="Enter your email address" className="w-full rounded-2xl bg-transparent p-4 text-base focus:outline-none sm:text-sm" /></GlassInputWrapper>
              </div>
              <div className="auth-element [--auth-delay:160ms]">
                <label htmlFor={`${id}-password`} className="mb-2 block text-sm font-medium text-muted-foreground">Password</label>
                <GlassInputWrapper><div className="relative"><input id={`${id}-password`} name="password" type={showPassword ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} placeholder={signup ? "Create a password" : "Enter your password"} className="w-full rounded-2xl bg-transparent p-4 pr-14 text-base focus:outline-none sm:text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls={`${id}-password`} className="absolute inset-y-0 right-1 grid w-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-foreground">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></GlassInputWrapper>
              </div>
              {!signup && <div className="auth-element flex flex-wrap items-center justify-between gap-3 text-sm [--auth-delay:200ms]"><label className="flex min-h-11 cursor-pointer items-center gap-3"><input type="checkbox" name="rememberMe" className="h-4 w-4 accent-foreground" /><span>Keep me signed in</span></label><button type="button" onClick={onResetPassword} disabled={!onResetPassword} className="min-h-11 text-brand-text transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60">Reset password</button></div>}
              <button type="submit" className="auth-element min-h-12 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground transition-colors hover:bg-primary/90 [--auth-delay:240ms]">{signup ? "Create account" : "Sign in"}</button>
            </form>
            <div className="auth-element relative flex items-center justify-center [--auth-delay:280ms]"><span className="w-full border-t border-border" /><span className="absolute bg-background px-4 text-sm text-muted-foreground">Or continue with</span></div>
            <button type="button" onClick={onGoogleSignIn} disabled={!onGoogleSignIn} className="auth-element flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-border py-4 transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60 [--auth-delay:320ms]"><GoogleIcon />Continue with Google</button>
            <p className="auth-element text-center text-sm text-muted-foreground [--auth-delay:360ms]">{signup ? "Already have an account?" : "New to Botlane?"} <button type="button" onClick={signup ? onSwitchToSignIn : onCreateAccount} disabled={signup ? !onSwitchToSignIn : !onCreateAccount} className="min-h-11 text-brand-text underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60">{signup ? "Sign in" : "Create account"}</button></p>
            <p id={`${id}-notice`} role="status" aria-live="polite" className="text-sm leading-6 text-muted-foreground">{notice ?? fallbackNotice}</p>
          </div>
          <Link href="/" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={15} aria-hidden="true" />Back to Botlane</Link>
        </div>
      </section>
      {heroImageSrc && <section aria-label="Landscape" className="relative hidden min-h-dvh min-w-0 flex-1 p-4 md:block"><div className="auth-image absolute inset-4 overflow-hidden rounded-3xl bg-[#123c50]">
        {/* Blue fallback remains visible when the artwork is unavailable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImageSrc} alt="" width={1536} height={1024} decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#081e35]/50 via-transparent to-transparent" />
      </div>{testimonials.length > 0 && <div className="absolute bottom-8 left-1/2 flex w-full -translate-x-1/2 justify-center gap-4 px-8">{testimonials.slice(0,3).map((t,i) => <div key={`${t.name}-${i}`} className={i === 1 ? "hidden xl:flex" : i === 2 ? "hidden 2xl:flex" : ""}><TestimonialCard testimonial={t} delay={500+i*100} /></div>)}</div>}</section>}
    </div>
  );
}
