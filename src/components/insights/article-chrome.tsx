"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/** A hairline of the accent along the foot of the header, growing as the article is read. */
export function ReadingProgress({ target }: { target: string }) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const el = document.getElementById(target)
    if (!el) return
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const { top, height } = el.getBoundingClientRect()
        const span = height - window.innerHeight * 0.6
        setP(span > 0 ? Math.min(1, Math.max(0, -top / span)) : 1)
      })
    }
    measure()
    window.addEventListener("scroll", measure, { passive: true })
    window.addEventListener("resize", measure)
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", measure); window.removeEventListener("resize", measure) }
  }, [target])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-(--header-h) z-40 h-px">
      <div className="h-full origin-left bg-(--brand)" style={{ transform: `scaleX(${p})` }} />
    </div>
  )
}

/** The article's sections, with the one being read marked. Sticky beside the text from lg. */
export function Contents({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const heads = items.map((i) => document.getElementById(i.id)).filter((h): h is HTMLElement => !!h)
    // A heading counts as current once it passes the upper third of the screen.
    const io = new IntersectionObserver(
      (entries) => {
        const passed = heads.filter((h) => h.getBoundingClientRect().top < window.innerHeight * 0.35)
        if (passed.length) setActive(passed[passed.length - 1].id)
        else if (entries.length) setActive(heads[0]?.id)
      },
      { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] },
    )
    heads.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [items])

  if (items.length < 2) return null
  return (
    <nav aria-label="In this note" className="sticky top-[calc(var(--header-h)+2.5rem)] hidden self-start lg:grid">
      <span className="label-mono mb-3 text-[11px]">IN THIS NOTE</span>
      <ol className="grid border-l border-border/70">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 pl-4 text-[13px] leading-snug transition-colors duration-200",
                active === i.id ? "border-(--brand) text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
