"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Search, X } from "lucide-react"

import type { Post } from "@/lib/insights"
import { cn } from "@/lib/utils"

import { InsightCover } from "./insight-cover"

/** What the index needs of a post: everything but its body, with its date and length already worked out. */
export interface PostSummary {
  slug: string
  title: string
  dek: string
  topic: string
  date: string
  minutes: number
  cover: Post["cover"]
}

const href = (slug: string) => `/blog/${slug}`

/** A topic, a date and a reading time, in the mono face. */
function Meta({ post, className }: { post: PostSummary; className?: string }) {
  return (
    <span className={cn("label-mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]", className)}>
      <span className="text-foreground">{post.topic.toUpperCase()}</span>
      <span aria-hidden className="opacity-50">/</span>
      <span>{post.date.toUpperCase()}</span>
      <span aria-hidden className="opacity-50">/</span>
      <span>{post.minutes} MIN</span>
    </span>
  )
}

/** The topics, as a row of tabs in a glass track, with a highlight that glides to the one chosen. */
function Topics({ topics, counts, value, onChange }: { topics: (string | null)[]; counts: Record<string, number>; value: string | null; onChange: (t: string | null) => void }) {
  const track = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState<{ x: number; w: number } | null>(null)
  useLayoutEffect(() => {
    const el = track.current?.querySelector<HTMLElement>("[aria-pressed=true]")
    if (el) setSpot({ x: el.offsetLeft, w: el.offsetWidth })
  }, [value])

  return (
    <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div ref={track} role="group" aria-label="Filter by topic" className="relative inline-flex gap-0.5 rounded-full border border-border/70 bg-foreground/[0.025] p-1 backdrop-blur">
        <span aria-hidden className="absolute top-1 left-0 h-9 rounded-full bg-foreground shadow-[0_6px_18px_-8px_var(--float-shadow)] transition-[translate,width] duration-500 ease-(--ease-lift)" style={spot ? { width: spot.w, translate: `${spot.x}px 0` } : { opacity: 0 }} />
        {topics.map((t) => {
          const on = value === t
          return (
            <button
              key={t ?? "all"}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(t)}
              className={cn("relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm whitespace-nowrap transition-colors duration-300", on ? "text-background" : "text-foreground/65 hover:text-foreground")}
            >
              {t ?? "All"}
              <sup className={cn("label-mono text-[9.5px] tabular-nums", on ? "text-background/60" : "opacity-60")}>{counts[t ?? "all"]}</sup>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** The newest note, across the page: its cover as the backdrop, the title set large over it. */
function Feature({ post }: { post: PostSummary }) {
  return (
    <Link href={href(post.slug)} className="group/cover relative grid overflow-hidden rounded-[1.75rem] outline-none focus-visible:ring-2 focus-visible:ring-foreground">
      <InsightCover variant={post.cover} topic={post.topic} label={false} side className="absolute inset-0 rounded-[1.75rem]" />
      {/* Darkness rising from the foot, so the words read over the light. */}
      <div aria-hidden className="absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(180deg,transparent_20%,rgb(5_5_6/0.55)_55%,rgb(5_5_6/0.92))] md:bg-[linear-gradient(90deg,rgb(5_5_6/0.85),rgb(5_5_6/0.35)_45%,transparent_65%)]" />
      <div className="dark relative grid min-h-[30rem] content-end gap-5 p-6 text-foreground sm:min-h-[34rem] sm:p-10 lg:min-h-[36rem] lg:p-14">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md">
          <span className="size-1.5 rounded-full bg-[#A6CDFF] shadow-[0_0_10px_#A6CDFF]" />
          <span className="label-mono text-[10.5px] text-white/85">LATEST NOTE</span>
        </span>
        <h2 className="max-w-3xl text-[2.2rem] leading-[1.04] font-medium tracking-[-0.03em] text-balance text-white sm:text-5xl lg:text-[4.25rem]">{post.title}</h2>
        <p className="max-w-xl text-base leading-relaxed text-pretty text-white/70 sm:text-lg">{post.dek}</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-5">
          <Meta post={post} className="text-white/55 [&>span:first-child]:text-white" />
          <span className="inline-flex h-12 items-center gap-2 rounded-full bg-white pr-2 pl-5 text-[15px] font-medium text-black transition-[gap] duration-300 group-hover/cover:gap-3">
            Read the note
            <span className="grid size-8 place-items-center rounded-full bg-black text-white"><ArrowRight className="size-4" /></span>
          </span>
        </div>
      </div>
    </Link>
  )
}

/** A note with its cover above: the second rank, two side by side. */
function Card({ post }: { post: PostSummary }) {
  return (
    <Link href={href(post.slug)} className="group/cover grid content-start gap-5 outline-none focus-visible:[&_h3]:underline">
      <InsightCover variant={post.cover} topic={post.topic} className="aspect-[16/10] rounded-[1.4rem] transition-[translate,box-shadow] duration-500 ease-(--ease-lift) group-hover/cover:-translate-y-1 group-hover/cover:shadow-[0_34px_60px_-30px_rgb(26_63_120/0.7)]" />
      <div className="grid gap-3 px-1">
        <Meta post={post} />
        <h3 className="text-2xl leading-tight font-medium tracking-[-0.02em] text-balance sm:text-[1.75rem]">{post.title}</h3>
        <p className="line-clamp-2 max-w-[52ch] text-muted-foreground text-pretty">{post.dek}</p>
      </div>
    </Link>
  )
}

/**
 * The notes as a journal: the newest across the page over its cover, the next two side by side, and the rest
 * as a numbered archive. A row of topic tabs filters all of it; a filter that leaves nothing says so.
 */
export function InsightsIndex({ posts }: { posts: PostSummary[] }) {
  const topics = Array.from(new Set(posts.map((p) => p.topic)))
  const counts: Record<string, number> = { all: posts.length }
  for (const p of posts) counts[p.topic] = (counts[p.topic] ?? 0) + 1
  const [topic, setTopic] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const search = query.trim().toLowerCase()
  const shown = posts.filter((p) => (!topic || p.topic === topic) && (!search || `${p.title} ${p.dek} ${p.topic}`.toLowerCase().includes(search)))
  const [lead, ...others] = shown
  const pair = others.slice(0, 2)
  const rest = others.slice(2)

  return (
    <div className="grid gap-12 sm:gap-16">
      <div className="grid gap-5 border-y border-border/70 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="label-mono text-[11px]">EXPLORE THE JOURNAL</h2>
          <div className="relative flex w-full items-center sm:w-80">
            <Search aria-hidden className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search articles" placeholder="Find a topic or question…" className="min-h-11 w-full rounded-full border border-border bg-foreground/[0.025] pr-11 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-0 grid size-11 place-items-center rounded-full text-muted-foreground hover:text-foreground"><X aria-hidden className="size-4" /></button>}
          </div>
        </div>
        {topics.length > 1 && <Topics topics={[null, ...topics]} counts={counts} value={topic} onChange={setTopic} />}
        <p role="status" aria-live="polite" className="text-xs text-muted-foreground">{shown.length} {shown.length === 1 ? "note" : "notes"}{topic ? ` in ${topic}` : " from the studio"}{search ? ` matching “${query.trim()}”` : ""}</p>
      </div>

      {/* Re-keyed by topic, so a new filter fades its notes in. */}
      <div key={`${topic ?? "all"}:${search}`} className="grid gap-14 [animation:set-in_500ms_var(--ease-lift)_both] sm:gap-20">
        {lead && <Feature post={lead} />}

        {pair.length > 0 && (
          <div className="grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-10">
            {pair.map((p) => <Card key={p.slug} post={p} />)}
          </div>
        )}

        {rest.length > 0 && (
          <section aria-labelledby="archive-title" className="grid">
            <div className="flex items-baseline justify-between border-b border-border pb-4">
              <h2 id="archive-title" className="text-2xl font-medium tracking-tight sm:text-3xl">The archive</h2>
              <span className="label-mono text-[11px]">{rest.length} MORE</span>
            </div>
            <ol>
              {rest.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={href(p.slug)}
                    className="group/r relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-border/70 py-7 outline-none sm:grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] lg:grid-cols-[5.5rem_minmax(0,1fr)_14rem_2.5rem] lg:gap-x-8"
                  >
                    {/* A blue hairline that draws itself across the row on hover. */}
                    <span aria-hidden className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#3060B0,#A6CDFF_60%,transparent)] transition-transform duration-700 ease-(--ease-lift) group-hover/r:scale-x-100 group-focus-visible/r:scale-x-100" />
                    <span className="pt-1 font-serif text-[1.6rem] leading-none font-light text-foreground/30 tabular-nums transition-colors duration-300 group-hover/r:text-foreground sm:text-[2.1rem]">
                      {String(i + 4).padStart(2, "0")}
                    </span>
                    <span className="grid gap-2">
                      <span className="text-xl leading-snug font-medium tracking-[-0.015em] text-balance transition-transform duration-500 ease-(--ease-lift) group-hover/r:translate-x-1 sm:text-[1.45rem]">{p.title}</span>
                      <span className="line-clamp-2 max-w-[60ch] text-[15px] text-muted-foreground text-pretty">{p.dek}</span>
                      <Meta post={p} className="mt-1 lg:hidden" />
                    </span>
                    <span className="label-mono hidden content-start gap-1.5 pt-1.5 text-[11px] lg:grid">
                      <span className="text-foreground">{p.topic.toUpperCase()}</span>
                      <span>{p.date.toUpperCase()} · {p.minutes} MIN</span>
                    </span>
                    <span aria-hidden className="hidden size-10 place-items-center self-start rounded-full border border-border transition-[background-color,border-color,color] duration-300 group-hover/r:border-transparent group-hover/r:bg-foreground group-hover/r:text-background sm:grid">
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/r:rotate-45" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {shown.length === 0 && <div className="grid justify-items-start gap-4 rounded-2xl border border-border p-8 sm:p-12"><h2 className="text-2xl font-medium tracking-tight">No notes found.</h2><p className="text-muted-foreground">Try a different phrase or explore all topics.</p><button type="button" onClick={() => { setQuery(""); setTopic(null) }} className="btn-light min-h-11 rounded-full px-5 text-sm font-medium">Show all notes</button></div>}
      </div>
    </div>
  )
}
