"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { siCalendly, siHubspot, siMailchimp } from "simple-icons"

import { BotlaneMark } from "@/components/site/botlane-mark"
import { appTile } from "@/lib/app-tile"
import { cn } from "@/lib/utils"

/*
 * Small drawings for the package pages' feature tiles, one per thing a package adds. Each is decorative (the
 * tile's own words say what it is), drawn in the site's hairlines with the blue light, and quiet under reduced
 * motion. They sit in a tile's upper half, centred.
 */

const frame = "relative grid h-full w-full place-items-center overflow-hidden"

/** A design system: a type specimen between a row of swatches and a spacing scale. */
export function SystemVisual() {
  return (
    <div aria-hidden className={frame}>
      <div className="grid justify-items-center gap-5">
        <div className="flex gap-2">
          {["#0B1424", "#2C57A5", "#8FB4F2", "#E9EDF0", "#192C36"].map((c, i) => (
            <span key={c} className="pk-rise size-9 rounded-xl border border-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]" style={{ background: c, animationDelay: `${i * 90}ms` }} />
          ))}
        </div>
        <div className="flex items-end gap-6">
          <span className="text-6xl leading-none font-medium tracking-[-0.05em]">Aa</span>
          <span className="grid gap-1 pb-1.5 text-left">
            <span className="label-mono text-[10px]">DISPLAY · 64</span>
            <span className="label-mono text-[10px]">BODY · 16</span>
          </span>
        </div>
        <div className="flex items-end gap-1.5">
          {[4, 8, 12, 16, 24, 32, 48].map((h) => <span key={h} className="w-2.5 rounded-sm bg-foreground/15" style={{ height: h }} />)}
        </div>
      </div>
    </div>
  )
}

/** A content editor: a field being typed into, then published, with a toast to say so. */
export function EditorVisual() {
  const words = "Advice for what comes next."
  const [n, setN] = useState(0)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { const t = window.setTimeout(() => setN(words.length + 30), 0); return () => window.clearTimeout(t) }
    const id = window.setInterval(() => setN((v) => (v > words.length + 40 ? 0 : v + 1)), 90)
    return () => window.clearInterval(id)
  }, [])
  const typed = words.slice(0, Math.min(n, words.length))
  const live = n > words.length + 8
  return (
    <div aria-hidden className={frame}>
      <div className="w-[min(19rem,86%)] rounded-2xl border border-border bg-background/70 p-4 shadow-[0_24px_50px_-28px_var(--float-shadow)] backdrop-blur">
        <div className="flex items-center justify-between">
          <span className="label-mono text-[10px]">PAGES / HOME</span>
          <span className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-foreground/20" />)}</span>
        </div>
        <span className="mt-3 block text-[11px] text-muted-foreground">Headline</span>
        <div className="mt-1.5 min-h-[2.6rem] rounded-lg border border-foreground/15 bg-background px-3 py-2 text-[15px] leading-snug">
          {typed}<span className="pk-caret ml-px inline-block h-4 w-px translate-y-0.5 bg-foreground" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Draft saved</span>
          <span className={cn("rounded-full px-3 py-1 text-[12px] font-medium transition-colors duration-300", live ? "bg-[#8FB4F2] text-[#061B41]" : "bg-foreground text-background")}>{live ? "Published" : "Publish"}</span>
        </div>
      </div>
      <span className={cn("absolute top-[12%] right-[10%] inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1.5 text-[11px] backdrop-blur transition-[opacity,translate] duration-500 ease-(--ease-lift)", live ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0")}>
        <Check className="size-3 text-[#8FB4F2]" /> Live on your site
      </span>
    </div>
  )
}

function Logo({ icon, className }: { icon: { path: string; hex: string; title: string }; className?: string }) {
  return (
    <span className={cn("tile-app size-14 rounded-2xl", className)} style={appTile(icon.hex)}>
      <svg viewBox="0 0 24 24" className="size-6" fill="currentColor"><path d={icon.path} /></svg>
    </span>
  )
}

/** Integrations: the site in the middle, booking, CRM and newsletter around it, with enquiries flowing out. */
export function IntegrationsVisual() {
  const spots = [
    { icon: siCalendly, x: "18%", y: "30%" },
    { icon: siHubspot, x: "82%", y: "30%" },
    { icon: siMailchimp, x: "50%", y: "84%" },
  ]
  return (
    <div aria-hidden className={frame}>
      <svg viewBox="0 0 400 240" preserveAspectRatio="none" className="absolute inset-0 size-full" fill="none">
        {[["200 110", "72 72"], ["200 110", "328 72"], ["200 110", "200 202"]].map(([a, b]) => (
          <g key={b}>
            <path d={`M${a} L${b}`} stroke="rgb(var(--ink) / 0.14)" strokeDasharray="2 5" />
            <path d={`M${a} L${b}`} pathLength={1} stroke="#8FB4F2" strokeWidth={2} strokeLinecap="round" className="pk-flow" style={{ filter: "drop-shadow(0 0 4px #8FB4F2)" }} />
          </g>
        ))}
      </svg>
      <span className="absolute top-[46%] left-1/2 grid size-[4.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.4rem] border border-white/15 bg-[#0b1424] shadow-[0_0_40px_-6px_rgb(58_100_184/0.7)]">
        <BotlaneMark size={34} id="pk-int-mark" />
      </span>
      {spots.map((s) => <span key={s.icon.title} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: s.x, top: s.y }}><Logo icon={s.icon} /></span>)}
    </div>
  )
}

/** Twelve pages: a sitemap, the home page lit, the rest following it in. */
export function PagesVisual({ count = 12 }: { count?: number }) {
  const names = ["Home", "About", "Services", "Team", "Insights", "Careers", "Case studies", "Pricing", "FAQ", "Locations", "Contact", "Legal"]
  return (
    <div aria-hidden className={frame}>
      <div className="grid grid-cols-4 gap-2">
        {names.slice(0, count).map((p, i) => (
          <span key={p} className={cn("pk-rise grid h-12 w-[4.6rem] content-between rounded-lg border p-1.5", i === 0 ? "border-[#8FB4F2]/60 bg-[#2C57A5]/25 shadow-[0_0_24px_-6px_rgb(143_180_242/0.7)]" : "border-border bg-foreground/[0.03]")} style={{ animationDelay: `${i * 60}ms` }}>
            <span className="flex gap-0.5">{[0, 1, 2].map((d) => <span key={d} className="h-0.5 flex-1 rounded-full bg-foreground/15" />)}</span>
            <span className="truncate text-left text-[9px] text-foreground/70">{p}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Signature motion: a curve eased along, with a body riding it and the keyframes marked. */
export function MotionVisual() {
  return (
    <div aria-hidden className={frame}>
      <svg viewBox="0 0 400 240" className="h-full w-full" fill="none">
        <path d="M40 200 H360 M40 200 V40" stroke="rgb(var(--ink) / 0.14)" />
        {[120, 200, 280].map((x) => <path key={x} d={`M${x} 200 V40`} stroke="rgb(var(--ink) / 0.06)" strokeDasharray="2 5" />)}
        <path id="pk-ease" d="M40 200 C 170 200, 150 40, 360 40" stroke="rgb(var(--ink) / 0.35)" strokeWidth={1.5} />
        <path d="M40 200 C 170 200, 150 40, 360 40" pathLength={1} stroke="#8FB4F2" strokeWidth={2.5} strokeLinecap="round" className="pk-draw" style={{ filter: "drop-shadow(0 0 6px #8FB4F2)" }} />
        <circle r={7} fill="#fff" style={{ filter: "drop-shadow(0 0 8px #8FB4F2)" }}>
          <animateMotion dur="3.2s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;0.7;1" calcMode="spline" keySplines="0.32 0.72 0 1;0 0 1 1"><mpath href="#pk-ease" /></animateMotion>
        </circle>
        <circle cx={40} cy={200} r={4} fill="rgb(var(--ink) / 0.5)" />
        <circle cx={360} cy={40} r={4} fill="rgb(var(--ink) / 0.5)" />
        <text x={40} y={222} className="fill-muted-foreground font-mono text-[10px]">0ms</text>
        <text x={318} y={222} className="fill-muted-foreground font-mono text-[10px]">700ms</text>
        <text x={248} y={30} className="fill-muted-foreground font-mono text-[10px]">ease-lift</text>
      </svg>
    </div>
  )
}

/** Structured content: three kinds of page, each with its own fields. */
export function StructureVisual() {
  const kinds = [
    { k: "Case study", f: ["Client", "Challenge", "Outcome"] },
    { k: "Docs", f: ["Section", "Version", "Body"] },
    { k: "Changelog", f: ["Release", "Date", "Notes"] },
  ]
  return (
    <div aria-hidden className={frame}>
      <div className="flex items-center gap-3">
        {kinds.map((c, i) => (
          <div key={c.k} className={cn("pk-rise grid w-[6.75rem] gap-2 rounded-xl border p-3", i === 1 ? "-translate-y-3 border-[#8FB4F2]/50 bg-[#2C57A5]/20 shadow-[0_0_30px_-8px_rgb(143_180_242/0.6)]" : "border-border bg-foreground/[0.03]")} style={{ animationDelay: `${i * 120}ms` }}>
            <span className="text-[12px] font-medium">{c.k}</span>
            {c.f.map((f) => (
              <span key={f} className="grid gap-1">
                <span className="text-[9px] text-muted-foreground">{f}</span>
                <span className="h-1.5 rounded-full bg-foreground/12" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Advanced SEO: a search result in first place, with its sitelinks. */
export function SeoVisual({ query = "premium smart lamp", site = "halo.example › lamp", title = "Halo — light that follows your day", line = "A lamp that tunes itself from dawn to dusk. Ships in 40 countries.", links = ["Specs", "Reviews", "Changelog"] }: { query?: string; site?: string; title?: string; line?: string; links?: string[] }) {
  return (
    <div aria-hidden className={frame}>
      <div className="w-[min(21rem,88%)] rounded-2xl border border-border bg-background/70 p-4 text-left backdrop-blur">
        <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground">
          <span className="size-2.5 rounded-full border border-current" /> {query}
        </div>
        <div className="mt-4 flex items-start gap-3">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#2C57A5] font-mono text-[11px] text-white shadow-[0_0_16px_rgb(58_100_184/0.8)]">1</span>
          <span className="grid gap-1">
            <span className="text-[10px] text-muted-foreground">{site}</span>
            <span className="text-[14px] font-medium text-[#8FB4F2]">{title}</span>
            <span className="text-[11px] leading-snug text-muted-foreground">{line}</span>
            <span className="mt-1 flex flex-wrap gap-1.5">{links.map((s) => <span key={s} className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[10px]">{s}</span>)}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/** Multiple languages: one line, in turn. */
export function LanguagesVisual() {
  const lines = [["EN", "Light that follows your day."], ["FR", "La lumière qui suit votre journée."], ["DE", "Licht, das Ihrem Tag folgt."], ["JA", "あなたの一日に寄り添う光。"]]
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setI((v) => (v + 1) % lines.length), 2200)
    return () => window.clearInterval(id)
  }, [lines.length])
  return (
    <div aria-hidden className={frame}>
      <div className="grid justify-items-center gap-6 px-6 text-center">
        <span className="inline-flex gap-1 rounded-full border border-border p-1">
          {lines.map(([code], j) => <span key={code} className={cn("rounded-full px-3 py-1 font-mono text-[11px] transition-colors duration-300", j === i ? "bg-foreground text-background" : "text-muted-foreground")}>{code}</span>)}
        </span>
        <span key={i} className="pk-swap min-h-[4.5rem] max-w-[18rem] text-[1.6rem] leading-tight font-medium tracking-tight text-balance">{lines[i][1]}</span>
      </div>
    </div>
  )
}

function Gauge({ value, label, unit = "", pct }: { value: string; label: string; unit?: string; pct: number }) {
  return (
    <span className="grid justify-items-center gap-2">
      <span className="relative grid size-[4.75rem] place-items-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 size-full -rotate-90">
          <circle cx="20" cy="20" r="17" fill="none" strokeWidth="2.5" stroke="rgb(var(--ink) / 0.1)" />
          <circle cx="20" cy="20" r="17" fill="none" strokeWidth="2.5" stroke="#8FB4F2" strokeLinecap="round" pathLength={100} strokeDasharray={`${pct} 100`} className="pk-gauge" style={{ filter: "drop-shadow(0 0 4px #8FB4F2)" }} />
        </svg>
        <span className="text-[17px] font-medium tabular-nums">{value}<span className="text-[10px] text-muted-foreground">{unit}</span></span>
      </span>
      <span className="label-mono text-[9.5px]">{label}</span>
    </span>
  )
}

/** A performance budget: the measures it's held to, each inside its limit. */
export function BudgetVisual() {
  return (
    <div aria-hidden className={frame}>
      <div className="grid justify-items-center gap-6">
        <div className="flex gap-5">
          <Gauge value="98" label="PERFORMANCE" pct={98} />
          <Gauge value="1.1" unit="s" label="LCP" pct={78} />
          <Gauge value="0.01" label="CLS" pct={92} />
        </div>
        <span className="grid w-56 gap-1.5">
          <span className="flex justify-between font-mono text-[10px] text-muted-foreground"><span>PAGE WEIGHT</span><span>640 / 900 KB</span></span>
          <span className="h-1.5 overflow-hidden rounded-full bg-foreground/10"><span className="pk-fill block h-full w-[71%] rounded-full bg-[linear-gradient(90deg,#2C57A5,#8FB4F2)]" /></span>
        </span>
      </div>
    </div>
  )
}
