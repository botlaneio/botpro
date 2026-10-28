import { cn } from "@/lib/utils"

/**
 * An example of the kind of site we build, for an offer page's hero: a browser window with a phone in front
 * of it, both showing the same small business site and scrolling slowly through it. The business is made
 * up and labelled as an example (its address is example.com, reserved for exactly this), and the page has
 * no quotes or reviews, so nothing in it can pass for client work. Its colours are its own, not ours: the
 * point is a site that looks like its business. Hovering pauses it; it holds still under reduced motion.
 * Decorative, so hidden from screen readers. Sized in container units, so it scales with its column.
 */
export function SiteShowcase({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("group/s relative mx-auto w-full max-w-[38rem] pb-8 sm:pr-10", className)}>
      {/* Light behind the window, as in the lab's other hero pieces. */}
      <div className="pointer-events-none absolute -inset-[12%] -z-10 [mask-image:radial-gradient(closest-side,#000,transparent)]">
        <div className="absolute top-[30%] left-[10%] h-[30%] w-[80%] -rotate-[14deg] rounded-full bg-[color-mix(in_oklch,var(--brand)_calc(var(--glow)*30%),transparent)] blur-3xl" />
      </div>

      {/* The browser window. */}
      <div className="surface-glass overflow-hidden rounded-2xl! p-0!">
        <div className="flex items-center gap-3 border-b border-border/60 px-3.5 py-2.5">
          <span className="flex gap-1.5">
            {[0.5, 0.3, 0.2].map((a) => <span key={a} className="size-2 rounded-full" style={{ background: `rgb(var(--ink) / ${a})` }} />)}
          </span>
          <span className="label-mono mx-auto rounded-md bg-foreground/[0.05] px-3 py-0.5 text-[10.5px]">example.com</span>
          <span className="label-mono rounded-full border border-border px-2 text-[9px] leading-4">EXAMPLE DESIGN</span>
        </div>
        <div className="relative aspect-[16/10.5] overflow-hidden [container-type:inline-size]">
          {/* It scrolls by its own height less the window's (65.6cqw at 16:10.5), so it stops at the footer. */}
          <div className="text-[1.6cqw] [--travel:calc(-100%_+_65.6cqw)] [animation:showcase-scroll_18s_var(--ease-soft)_infinite] group-hover/s:[animation-play-state:paused] motion-reduce:[animation:none]">
            <SampleSite wide />
          </div>
        </div>
      </div>

      {/* The phone, in front of the window's lower right: the same site, laid out for a small screen. */}
      <div className="absolute right-0 bottom-0 hidden w-[27%] rounded-[1.4rem] border border-[rgb(var(--ink)/calc(var(--edge-alpha)+0.08))] bg-[linear-gradient(180deg,var(--glass-top),var(--glass-bottom)),var(--background)] p-[0.35rem] shadow-[inset_0_1px_0_rgb(255_255_255/var(--highlight-alpha)),var(--shadow-lift)] sm:block">
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[1.1rem] [container-type:inline-size]">
          <div className="text-[4.6cqw] [--travel:calc(-100%_+_205.5cqw)] [animation:showcase-scroll_18s_var(--ease-soft)_-4s_infinite] group-hover/s:[animation-play-state:paused] motion-reduce:[animation:none]">
            <SampleSite />
          </div>
        </div>
      </div>
    </div>
  )
}

// The example business's own palette: warm paper, dark ink, a sage green.
const C = { paper: "#F5F0E8", card: "#FFFDF9", ink: "#26221D", soft: "#6E665C", line: "#E4DCCF", sage: "#3F6B52", sageSoft: "#DCE7DE" }

/** The example site itself, in em so it scales with whatever sets its font size. */
function SampleSite({ wide = false }: { wide?: boolean }) {
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
