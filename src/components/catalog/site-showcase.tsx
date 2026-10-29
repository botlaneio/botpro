import { cn } from "@/lib/utils"

export type ShowcaseExample = "clinic" | "firm" | "launch"

/**
 * An example of the kind of site we build, for an offer page's hero: a browser window scrolling slowly
 * through a made-up business's site, with a second piece in front that shows what the package is about.
 * "clinic" is a small physio practice with a phone in front (Core: right on every phone);
 * "firm" is an accounting firm with more pages and a blog, with a content editor in front (Ascend:
 * your team edits it); "launch" is a product's launch site, dark and in motion, in several languages, with a
 * journal and a changelog, and its performance budget in front (Apex). Each business is made up and labelled as an example (its address is example.com,
 * reserved for exactly this), with no quotes or reviews, so nothing can pass for client work. Their colours
 * are their own, not ours: the point is a site that looks like its business. Hovering pauses it; it holds
 * still under reduced motion. Decorative, so hidden from screen readers. Sized in container units.
 */
export function SiteShowcase({ example = "clinic", className, still = false, panel = true }: { example?: ShowcaseExample; className?: string; still?: boolean; /** The panel in front (editor, budget); false for small sizes, where it would crowd the window. The clinic's phone always shows. */ panel?: boolean }) {
  return (
    <div aria-hidden className={cn("group/s relative mx-auto w-full max-w-[38rem] pb-8", (panel || example === "clinic") && "sm:pr-10", className)}>
      {/* Light behind the window, as in the lab's other hero pieces. */}
      <div className="pointer-events-none absolute -inset-[12%] -z-10 [mask-image:radial-gradient(closest-side,#000,transparent)]">
        <div className="absolute top-[30%] left-[10%] h-[30%] w-[80%] -rotate-[14deg] rounded-full bg-[color-mix(in_oklch,var(--brand)_calc(var(--glow)*30%),transparent)] blur-3xl" />
      </div>

      {/* The browser window. */}
      <div className="surface-glass relative z-0 overflow-hidden rounded-2xl! p-0!">
        <div className="flex items-center gap-3 border-b border-border/60 px-3.5 py-2.5">
          <span className="flex gap-1.5">
            {[0.5, 0.3, 0.2].map((a) => <span key={a} className="size-2 rounded-full" style={{ background: `rgb(var(--ink) / ${a})` }} />)}
          </span>
          <span className="label-mono mx-auto rounded-md bg-foreground/[0.05] px-3 py-0.5 text-[10.5px]">example.com</span>
          <span className="label-mono rounded-full border border-border px-2 text-[9px] leading-4">EXAMPLE DESIGN</span>
        </div>
        <div className="relative aspect-[16/10.5] overflow-hidden [container-type:inline-size]">
          {/* It scrolls by its own height less the window's (65.6cqw at 16:10.5), so it stops at the footer. */}
          <div style={still ? { animation: "none" } : undefined} className="text-[1.6cqw] [--travel:calc(-100%_+_65.6cqw)] [animation:showcase-scroll_18s_var(--ease-soft)_infinite] group-hover/s:[animation-play-state:paused] motion-reduce:[animation:none]">
            {example === "firm" ? <FirmSite /> : example === "launch" ? <LaunchSite /> : <ClinicSite wide />}
          </div>
        </div>
      </div>

      {example === "firm" ? (panel && <EditorPanel />) : example === "launch" ? (panel && <BudgetPanel />) : <Phone still={still} />}
    </div>
  )
}

/** The phone, in front of the window's lower right: the clinic's site, laid out for a small screen. */
function Phone({ still = false }: { still?: boolean }) {
  return (
      <div className="absolute right-0 bottom-0 z-10 hidden w-[27%] [transform:translateZ(2px)] rounded-[1.4rem] border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.08))] [background:linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] p-[0.35rem] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha)),var(--shadow-lift)] sm:block">
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[1.1rem] [container-type:inline-size]">
          <div style={still ? { animation: "none" } : undefined} className="text-[4.6cqw] [--travel:calc(-100%_+_205.5cqw)] [animation:showcase-scroll_18s_var(--ease-soft)_-4s_infinite] group-hover/s:[animation-play-state:paused] motion-reduce:[animation:none]">
            <ClinicSite />
          </div>
        </div>
      </div>
  )
}

// The example business's own palette: warm paper, dark ink, a sage green.
const C = { paper: "#F5F0E8", card: "#FFFDF9", ink: "#26221D", soft: "#6E665C", line: "#E4DCCF", sage: "#3F6B52", sageSoft: "#DCE7DE" }

/** The clinic's site, in em so it scales with whatever sets its font size. */
export function ClinicSite({ wide = false }: { wide?: boolean }) {
  const pad = wide ? "3.2em" : "1.6em"
  const treatments = [
    ["Sports injuries", "Back on your feet, then back to your sport."],
    ["Back and neck", "Relief for the pain that comes with desk days."],
    ["After surgery", "A steady plan to get your strength back."],
  ]
  return (
    <div style={{ background: C.paper, color: C.ink }} className="font-sans">
      {/* Nav */}
      <div className="flex items-center justify-between" style={{ padding: `1.4em ${pad}` }}>
        <span className="flex items-center gap-[0.5em] font-semibold tracking-tight">
          <span className="grid size-[1.5em] place-items-center rounded-full" style={{ background: C.sage }}>
            <span className="size-[0.6em] rounded-full" style={{ background: C.paper }} />
          </span>
          Juniper Physio
        </span>
        {wide ? (
          <span className="flex items-center gap-[1.6em] text-[0.85em]" style={{ color: C.soft }}>
            <span>Treatments</span><span>About</span><span>Visit</span>
            <span className="rounded-full px-[1em] py-[0.45em] font-medium" style={{ background: C.ink, color: C.paper }}>Book a visit</span>
          </span>
        ) : (
          <span className="grid gap-[0.25em]">{[0, 1].map((i) => <span key={i} className="block h-[0.12em] w-[1.1em] rounded-full" style={{ background: C.ink }} />)}</span>
        )}
      </div>

      {/* Hero */}
      <div className={wide ? "grid grid-cols-[1.1fr_1fr] items-center gap-[2em]" : "grid gap-[1.4em]"} style={{ padding: `2.2em ${pad} 3em` }}>
        <div className="grid justify-items-start gap-[1em]">
          <span className="rounded-full px-[0.8em] py-[0.3em] text-[0.7em] font-medium tracking-wide" style={{ background: C.sageSoft, color: C.sage }}>NOW BOOKING IN THE OLD TOWN</span>
          <span className="text-[2.5em] leading-[1.02] font-semibold tracking-[-0.03em]">Move better. Feel like yourself again.</span>
          <span className="text-[0.95em] leading-[1.45]" style={{ color: C.soft }}>Hands-on physiotherapy with a plan you understand, from your first visit to your last.</span>
          <span className="flex gap-[0.6em] text-[0.85em] font-medium">
            <span className="rounded-full px-[1.1em] py-[0.6em]" style={{ background: C.sage, color: C.paper }}>Book a visit</span>
            <span className="rounded-full border px-[1.1em] py-[0.6em]" style={{ borderColor: C.line }}>Treatments</span>
          </span>
        </div>
        {/* In place of a photo: soft overlapping shapes in the site's colours. */}
        <div className="relative aspect-[5/4] overflow-hidden rounded-[1.2em]" style={{ background: C.sageSoft }}>
          <span className="absolute -right-[12%] -bottom-[30%] aspect-square w-[80%] rounded-full" style={{ background: C.sage, opacity: 0.85 }} />
          <span className="absolute top-[14%] left-[12%] aspect-square w-[34%] rounded-full" style={{ background: C.card }} />
          <span className="absolute top-[40%] left-[38%] aspect-square w-[22%] rounded-full" style={{ background: C.paper, opacity: 0.7 }} />
        </div>
      </div>

      {/* Treatments */}
      <div className="grid gap-[1.2em]" style={{ padding: `0 ${pad} 3.2em` }}>
        <span className="text-[1.5em] font-semibold tracking-[-0.02em]">How we can help</span>
        <div className={wide ? "grid grid-cols-3 gap-[1em]" : "grid gap-[0.8em]"}>
          {treatments.map(([t, b]) => (
            <div key={t} className="grid gap-[0.6em] rounded-[1em] border p-[1.2em]" style={{ background: C.card, borderColor: C.line }}>
              <span className="size-[1.8em] rounded-[0.5em]" style={{ background: C.sageSoft }} />
              <span className="font-semibold">{t}</span>
              <span className="text-[0.85em] leading-[1.4]" style={{ color: C.soft }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Visit */}
      <div className={wide ? "grid grid-cols-2 gap-[2em]" : "grid gap-[1.2em]"} style={{ padding: `2.8em ${pad}`, background: C.ink, color: C.paper }}>
        <div className="grid content-start gap-[0.6em]">
          <span className="text-[1.5em] font-semibold tracking-[-0.02em]">Visit us</span>
          <span className="text-[0.9em] leading-[1.5] opacity-70">Open Monday to Saturday. Early and evening appointments for people who work.</span>
        </div>
        <div className="grid gap-[0.6em]">
          {["Your name", "Email", "What's bothering you?"].map((f) => (
            <span key={f} className="rounded-[0.6em] px-[0.9em] py-[0.7em] text-[0.8em]" style={{ background: "rgb(255 255 255 / 0.08)", color: "rgb(255 255 255 / 0.55)" }}>{f}</span>
          ))}
          <span className="w-fit rounded-full px-[1.1em] py-[0.6em] text-[0.85em] font-medium" style={{ background: C.sage }}>Send</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[0.75em]" style={{ padding: `1.6em ${pad}`, color: C.soft }}>
        <span>Juniper Physio</span>
        <span>example.com</span>
      </div>
    </div>
  )
}

// The firm's own palette: cool paper, deep navy, a brass accent.
const F = { paper: "#F3F2EE", card: "#FFFFFF", ink: "#1B2230", soft: "#5F6675", line: "#E2E0D8", brass: "#A57E45", brassSoft: "#EFE6D6", navy: "#1B2A44" }

/** The firm's site: a fuller company site, with more pages in the nav, services, a blog and the team. */
function FirmSite() {
  const pad = "3.2em"
  const services = [["Tax", "Returns, planning and the deadlines handled."], ["Audit", "Clear, calm year-end audits."], ["Payroll", "Your team paid right, every month."], ["Advisory", "Numbers to plan the next year with."]]
  const notes = [["12 OCT", "A year-end checklist for small companies"], ["28 SEP", "What changes in the new tax year"], ["09 SEP", "Keeping cash flowing in a slow quarter"]]
  return (
    <div style={{ background: F.paper, color: F.ink }} className="font-sans">
      {/* Nav: a fuller site, so more pages. */}
      <div className="flex items-center justify-between border-b" style={{ padding: `1.3em ${pad}`, borderColor: F.line }}>
        <span className="flex items-center gap-[0.55em] font-semibold tracking-tight">
          <span className="grid size-[1.5em] place-items-center rounded-[0.35em] text-[0.8em] font-bold" style={{ background: F.navy, color: F.paper }}>H</span>
          Halden &amp; Moss
        </span>
        <span className="flex items-center gap-[1.3em] text-[0.8em]" style={{ color: F.soft }}>
          <span>Services</span><span>Industries</span><span>Team</span><span>Insights</span><span>Careers</span>
          <span className="rounded-[0.5em] px-[0.9em] py-[0.45em] font-medium" style={{ background: F.navy, color: F.paper }}>Talk to us</span>
        </span>
      </div>

      {/* Hero */}
      <div className="grid grid-cols-[1.2fr_1fr] items-end gap-[2.4em]" style={{ padding: `3.4em ${pad} 3em` }}>
        <div className="grid justify-items-start gap-[1em]">
          <span className="text-[0.72em] font-medium tracking-[0.14em]" style={{ color: F.brass }}>ACCOUNTANTS FOR GROWING COMPANIES</span>
          <span className="text-[2.7em] leading-[1.02] font-semibold tracking-[-0.035em]">Clear numbers, so you can get on with the work.</span>
          <span className="flex gap-[0.6em] text-[0.85em] font-medium">
            <span className="rounded-[0.5em] px-[1.1em] py-[0.6em]" style={{ background: F.navy, color: F.paper }}>Book a call</span>
            <span className="rounded-[0.5em] border px-[1.1em] py-[0.6em]" style={{ borderColor: F.line }}>Our services</span>
          </span>
        </div>
        <span className="text-[0.95em] leading-[1.5]" style={{ color: F.soft }}>Tax, audit, payroll and advice for companies of ten to two hundred people, from one team that knows your business.</span>
      </div>

      {/* Services */}
      <div className="grid grid-cols-4 gap-[0.9em]" style={{ padding: `0 ${pad} 3.4em` }}>
        {services.map(([t, b]) => (
          <div key={t} className="grid gap-[0.7em] rounded-[0.8em] border p-[1.2em]" style={{ background: F.card, borderColor: F.line }}>
            <span className="h-[0.25em] w-[1.6em] rounded-full" style={{ background: F.brass }} />
            <span className="font-semibold">{t}</span>
            <span className="text-[0.8em] leading-[1.4]" style={{ color: F.soft }}>{b}</span>
          </div>
        ))}
      </div>

      {/* The blog, which the firm writes itself. */}
      <div className="grid gap-[1.2em]" style={{ padding: `3em ${pad}`, background: F.card }}>
        <span className="flex items-baseline justify-between">
          <span className="text-[1.5em] font-semibold tracking-[-0.02em]">Insights</span>
          <span className="text-[0.8em]" style={{ color: F.brass }}>All articles</span>
        </span>
        <div className="grid grid-cols-3 gap-[1em]">
          {notes.map(([d, t], i) => (
            <div key={t} className="grid gap-[0.7em]">
              <span className="aspect-[16/9] rounded-[0.6em]" style={{ background: i === 0 ? F.navy : i === 1 ? F.brassSoft : F.line }} />
              <span className="text-[0.7em] tracking-[0.1em]" style={{ color: F.soft }}>{d}</span>
              <span className="font-semibold leading-[1.25]">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="grid grid-cols-[1fr_2fr] items-center gap-[2em]" style={{ padding: `3em ${pad}` }}>
        <span className="text-[1.5em] font-semibold leading-[1.15] tracking-[-0.02em]">One team that knows your business.</span>
        <div className="grid grid-cols-4 gap-[0.8em]">
          {["AH", "RM", "JS", "LK"].map((n, i) => (
            <span key={n} className="grid aspect-square place-items-center rounded-full text-[1.1em] font-semibold" style={{ background: i % 2 ? F.brassSoft : F.line, color: F.ink }}>{n}</span>
          ))}
        </div>
      </div>

      {/* Footer: a fuller site, so a fuller footer. */}
      <div className="grid grid-cols-4 gap-[1.5em] text-[0.75em]" style={{ padding: `2.6em ${pad}`, background: F.navy, color: "rgb(255 255 255 / 0.6)" }}>
        <span className="font-semibold" style={{ color: F.paper }}>Halden &amp; Moss</span>
        {[["Services", "Tax · Audit · Payroll"], ["Company", "Team · Careers · Insights"], ["Contact", "example.com"]].map(([h, l]) => (
          <span key={h} className="grid gap-[0.4em]"><span style={{ color: F.paper }}>{h}</span>{l}</span>
        ))}
      </div>
    </div>
  )
}

/**
 * The content editor, in front of the window's lower right: the home page's headline being edited, with a
 * caret, saved, ready to publish. What Ascend adds: the team changes the words themselves.
 */
function EditorPanel() {
  return (
    <div className="absolute right-0 bottom-0 z-10 hidden w-[44%] [transform:translateZ(2px)] gap-3 rounded-xl border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.06))] [background:linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha)),var(--shadow-lift)] sm:grid">
      <span className="flex items-center justify-between">
        <span className="label-mono text-[10px] text-foreground">EDITING · HOME</span>
        <span className="label-mono flex items-center gap-1.5 text-[9.5px]"><span className="size-1.5 rounded-full bg-[#3BB273]" />SAVED</span>
      </span>
      <span className="grid gap-1">
        <span className="text-[10.5px] text-muted-foreground">Headline</span>
        <span className="rounded-md border border-border bg-background px-2 py-1.5 text-[11.5px] leading-snug text-foreground">
          Clear numbers, so you can get on with the work.<span className="ml-px inline-block h-[1.05em] w-px translate-y-[0.15em] bg-(--brand) [animation:caret-blink_1.1s_steps(1)_infinite] motion-reduce:[animation:none]" />
        </span>
      </span>
      <span className="grid gap-1">
        <span className="text-[10.5px] text-muted-foreground">Latest article</span>
        <span className="rounded-md border border-border bg-background px-2 py-1.5 text-[11px] text-foreground/80">A year-end checklist for small companies</span>
      </span>
      <span className="flex items-center justify-between pt-0.5">
        <span className="text-[10.5px] text-muted-foreground">3 changes</span>
        <span className="btn-light rounded-md! px-2.5 py-1 text-[10.5px] font-medium">Publish</span>
      </span>
    </div>
  )
}

// The launch site's own palette: near-black, warm white, the amber of the lamp it sells.
const L = { night: "#0D0C0B", panel: "#171513", ink: "#F3EEE6", soft: "#A39C91", line: "#2B2825", amber: "#F4A259", ember: "#C2632A" }

/**
 * A product's launch site: dark, cinematic, in motion. The lamp in the hero is a ring of light that turns
 * slowly and breathes, the kind of signature motion an Apex site is built around. It has a language switch,
 * and structured content: journal entries and a changelog.
 */
function LaunchSite() {
  const pad = "3.2em"
  const features = [["01", "Warm at dawn", "It wakes with you, in the softest light it has."], ["02", "Clear all day", "Bright, even light while you work."], ["03", "Amber at dusk", "It warms as the evening comes in."]]
  const changes = [["1.2", "Sunset mode, which follows your local sunset"], ["1.1", "Quieter dimming at the lowest settings"], ["1.0", "Solenne One, first release"]]
  return (
    <div style={{ background: L.night, color: L.ink }} className="font-sans">
      {/* Nav, with the language switch. */}
      <div className="flex items-center justify-between" style={{ padding: `1.4em ${pad}` }}>
        <span className="text-[1.05em] font-semibold tracking-[0.18em]">SOLENNE</span>
        <span className="flex items-center gap-[1.4em] text-[0.8em]" style={{ color: L.soft }}>
          <span>Product</span><span>Design</span><span>Journal</span><span>Changelog</span>
          <span className="flex overflow-hidden rounded-full border text-[0.85em]" style={{ borderColor: L.line }}>
            {["EN", "FR", "DE"].map((l, i) => <span key={l} className="px-[0.6em] py-[0.2em]" style={i === 0 ? { background: L.ink, color: L.night } : undefined}>{l}</span>)}
          </span>
          <span className="rounded-full px-[1em] py-[0.45em] font-medium" style={{ background: L.amber, color: L.night }}>Pre-order</span>
        </span>
      </div>

      {/* Hero: the lamp as a ring of light, turning and breathing. */}
      <div className="relative grid justify-items-center gap-[1.4em] overflow-hidden text-center" style={{ padding: `2.6em ${pad} 3.4em` }}>
        <span className="text-[0.72em] tracking-[0.22em]" style={{ color: L.amber }}>SOLENNE ONE · PRE-ORDERS OPEN</span>
        <span className="max-w-[14em] text-[3.1em] leading-[0.98] font-semibold tracking-[-0.04em]">Light that follows the day.</span>
        <span className="relative my-[0.6em] grid aspect-square w-[16em] place-items-center">
          <span className="absolute inset-[-18%] rounded-full blur-[2.2em] [animation:showcase-breathe_6s_ease-in-out_infinite] motion-reduce:[animation:none]" style={{ background: `radial-gradient(closest-side, ${L.amber}66, transparent)` }} />
          <span className="absolute inset-0 rounded-full [animation:showcase-spin_14s_linear_infinite] motion-reduce:[animation:none]" style={{ background: `conic-gradient(from 0deg, ${L.amber}, ${L.ember} 30%, transparent 55%, ${L.amber}55 75%, ${L.amber})`, mask: "radial-gradient(closest-side, transparent 80%, #000 82%)", WebkitMask: "radial-gradient(closest-side, transparent 80%, #000 82%)" }} />
          <span className="absolute inset-[24%] rounded-full" style={{ background: `radial-gradient(circle at 40% 35%, ${L.ink}, ${L.amber} 45%, ${L.ember} 100%)`, boxShadow: `0 0 4em ${L.amber}88` }} />
        </span>
        <span className="flex gap-[0.6em] text-[0.85em] font-medium">
          <span className="rounded-full px-[1.2em] py-[0.6em]" style={{ background: L.amber, color: L.night }}>Pre-order</span>
          <span className="rounded-full border px-[1.2em] py-[0.6em]" style={{ borderColor: L.line }}>Watch the film</span>
        </span>
      </div>

      {/* Features, as a sequence through the day. */}
      <div className="grid grid-cols-3 border-y" style={{ borderColor: L.line }}>
        {features.map(([n, t, b], i) => (
          <div key={n} className="grid gap-[0.6em] p-[1.8em]" style={i ? { borderLeft: `1px solid ${L.line}` } : undefined}>
            <span className="text-[0.75em] tracking-[0.1em]" style={{ color: L.amber }}>{n}</span>
            <span className="text-[1.15em] font-semibold">{t}</span>
            <span className="text-[0.8em] leading-[1.45]" style={{ color: L.soft }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Structured content: journal entries and a changelog. */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-[2em]" style={{ padding: `3em ${pad}` }}>
        <div className="grid content-start gap-[1em]">
          <span className="text-[0.72em] tracking-[0.16em]" style={{ color: L.soft }}>JOURNAL</span>
          {["Designing a light around the sun", "Why the ring is the lamp"].map((t, i) => (
            <div key={t} className="grid grid-cols-[6em_1fr] items-center gap-[1em]">
              <span className="aspect-[4/3] rounded-[0.6em]" style={{ background: i ? `linear-gradient(135deg, ${L.ember}, ${L.panel})` : `linear-gradient(135deg, ${L.amber}, ${L.ember})` }} />
              <span className="font-semibold leading-[1.25]">{t}</span>
            </div>
          ))}
        </div>
        <div className="grid content-start gap-[0.8em]">
          <span className="text-[0.72em] tracking-[0.16em]" style={{ color: L.soft }}>CHANGELOG</span>
          {changes.map(([v, t]) => (
            <div key={v} className="grid grid-cols-[2.6em_1fr] gap-[0.8em] border-t pt-[0.7em] text-[0.8em]" style={{ borderColor: L.line }}>
              <span style={{ color: L.amber }}>{v}</span>
              <span style={{ color: L.soft }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer, with every language. */}
      <div className="flex items-center justify-between text-[0.75em]" style={{ padding: `1.8em ${pad}`, background: L.panel, color: L.soft }}>
        <span className="tracking-[0.18em]" style={{ color: L.ink }}>SOLENNE</span>
        <span>English · Français · Deutsch · 日本語</span>
        <span>example.com</span>
      </div>
    </div>
  )
}

/**
 * The launch site's performance budget, in front of the window's lower right: each measure against its
 * limit, all under. What an Apex site is held to. The figures belong to the example.
 */
function BudgetPanel() {
  const rows = [["Page weight", "640 KB", "1 MB", 0.64], ["Largest paint", "1.4 s", "2.0 s", 0.7], ["JavaScript", "110 KB", "150 KB", 0.73], ["Layout shift", "0.01", "0.10", 0.1]] as const
  return (
    <div className="absolute right-0 bottom-0 z-10 hidden w-[44%] [transform:translateZ(2px)] gap-2.5 rounded-xl border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.06))] [background:linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha)),var(--shadow-lift)] sm:grid">
      <span className="flex items-center justify-between">
        <span className="label-mono text-[10px] text-foreground">PERFORMANCE BUDGET</span>
        <span className="label-mono flex items-center gap-1.5 text-[9.5px]"><span className="size-1.5 rounded-full bg-[#3BB273]" />ALL UNDER</span>
      </span>
      {rows.map(([k, v, max, f]) => (
        <span key={k} className="grid gap-1">
          <span className="flex justify-between text-[10.5px]">
            <span className="text-muted-foreground">{k}</span>
            <span className="label-mono text-[10px] text-foreground">{v} <span className="text-muted-foreground">/ {max}</span></span>
          </span>
          <span className="h-1 overflow-hidden rounded-full bg-foreground/[0.08]">
            <span className="block h-full rounded-full bg-[#3BB273]" style={{ width: `${f * 100}%` }} />
          </span>
        </span>
      ))}
    </div>
  )
}
