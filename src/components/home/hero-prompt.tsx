"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp, CornerDownLeft } from "lucide-react"

import { cn } from "@/lib/utils"

// Briefs the placeholder types out, one after another. Real kinds of project, in a visitor's words.
const EXAMPLES = [
  "A booking site for my physio clinic, with online payments",
  "A client portal where customers can track their orders",
  "A website for my law firm that people actually find",
  "An internal dashboard for my sales team",
]

const CHIPS = [
  { id: "website", label: "Website" },
  { id: "web-app", label: "Web app" },
  { id: "care", label: "Care" },
  { id: "not-sure", label: "Not sure yet", short: "Not sure" },
] as const

const TYPE_MS = 38, HOLD_MS = 1800, ERASE_MS = 16

/** Types the examples out and erases them, while the box is empty. With reduced motion, shows the first one. */
function useTypedExample(active: boolean) {
  const [text, setText] = useState(EXAMPLES[0])
  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let i = 0, n = 0, erasing = false
    let timer = window.setTimeout(function tick() {
      const full = EXAMPLES[i]
      if (!erasing) {
        n += 1
        if (n >= full.length) erasing = true
        setText(full.slice(0, n))
        timer = window.setTimeout(tick, n >= full.length ? HOLD_MS : TYPE_MS)
      } else {
        n -= 2
        if (n <= 0) { n = 0; erasing = false; i = (i + 1) % EXAMPLES.length }
        setText(full.slice(0, n))
        timer = window.setTimeout(tick, n === 0 ? 400 : ERASE_MS)
      }
    }, 600)
    return () => window.clearTimeout(timer)
  }, [active])
  return text
}

/**
 * The homepage's prompt bar. It is a plain GET form to /contact, so it works before any script loads:
 * the brief and the chosen chip arrive as ?brief= and ?need=, and fill the contact form's first two steps.
 */
export function HeroPrompt() {
  const [brief, setBrief] = useState("")
  const [focused, setFocused] = useState(false)
  const form = useRef<HTMLFormElement>(null)
  const example = useTypedExample(!brief && !focused)

  return (
    <form ref={form} action="/contact" method="get" className="surface-prompt relative mx-auto grid w-full max-w-2xl gap-3 p-3 text-left sm:p-4">
      <label className="relative grid">
        <span className="sr-only">What are you building?</span>
        <textarea
          name="brief"
          rows={2}
          maxLength={4000}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            // Enter sends, as in any prompt box; Shift and Enter makes a new line.
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              form.current?.requestSubmit()
            }
          }}
          placeholder={focused ? "What it is, who it's for, and what a good result looks like." : ""}
          className="min-h-16 w-full resize-none bg-transparent px-2 pt-1.5 max-sm:pr-11 text-[17px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        {!brief && !focused && (
          <span aria-hidden className="pointer-events-none absolute top-1.5 left-2 text-[17px] max-sm:right-11 leading-relaxed text-muted-foreground/80">
            {example}
            <span className="ml-px inline-block h-[1.1em] w-px translate-y-[3px] bg-foreground/60 [animation:caret-blink_1.1s_steps(1)_infinite]" />
          </span>
        )}
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <fieldset className="flex min-w-0 flex-nowrap gap-1 overflow-x-auto [scrollbar-width:none] sm:flex-wrap sm:gap-1.5 sm:overflow-visible [&::-webkit-scrollbar]:hidden">
          <legend className="sr-only">What you need</legend>
          {CHIPS.map((c) => (
            <label key={c.id} className="cursor-pointer">
              <input type="radio" name="need" value={c.id} className="peer sr-only" />
              <span className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-border bg-background/50 px-2.5 text-[12px] whitespace-nowrap text-muted-foreground transition-colors sm:px-3 sm:text-[13px]",
                "peer-checked:border-foreground/30 peer-checked:bg-foreground/[0.07] peer-checked:text-foreground peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 hover:text-foreground",
              )}>
                <span aria-hidden className="text-(--mark-eye-edge) max-sm:hidden">✦</span>
                {"short" in c ? <><span className="sm:hidden">{c.short}</span><span className="max-sm:hidden">{c.label}</span></> : c.label}
              </span>
            </label>
          ))}
        </fieldset>
        <span className="ml-auto hidden items-center gap-1 text-[12px] text-muted-foreground sm:inline-flex">
          <CornerDownLeft className="size-3" aria-hidden /> to send
        </span>
        <button type="submit" aria-label="Start your brief" className="btn-light grid size-9 shrink-0 place-items-center rounded-full! max-sm:absolute max-sm:top-3 max-sm:right-3">
          <ArrowUp className="size-4" />
        </button>
      </div>
    </form>
  )
}
