"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

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

/**
 * The notes, newest first: the latest as a feature with its cover, then the rest as editorial rows, each
 * a date, a title with its line, and the topic with minutes to read. Topics filter both; a filter that
 * leaves nothing says so. With only one topic the filters don't show.
 */
export function InsightsIndex({ posts }: { posts: PostSummary[] }) {
  const topics = Array.from(new Set(posts.map((p) => p.topic)))
  const [topic, setTopic] = useState<string | null>(null)
  const shown = topic ? posts.filter((p) => p.topic === topic) : posts
  const [lead, ...rest] = shown

  return (
    <div className="grid gap-10">
      {topics.length > 1 && (
        <div role="group" aria-label="Filter by topic" className="-mx-6 flex gap-1.5 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {[null, ...topics].map((t) => (
            <button
              key={t ?? "all"}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-3.5 text-sm whitespace-nowrap transition-colors duration-200",
                topic === t ? "border-transparent bg-foreground text-background" : "border-border text-foreground/70 hover:text-foreground",
              )}
            >
              {t ?? "All notes"}
            </button>
          ))}
        </div>
      )}

      {lead && (
        <Link href={href(lead.slug)} className="group/f grid items-center gap-7 outline-none focus-visible:[&_h2]:underline md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
          <InsightCover variant={lead.cover} topic={lead.topic} className="aspect-[16/10] transition-[transform,box-shadow] duration-500 ease-(--ease-lift) group-hover/f:-translate-y-1 group-hover/f:shadow-[0_30px_60px_-34px_var(--float-shadow)]" />
          <div className="grid justify-items-start gap-4">
            <Meta post={lead} />
            <h2 className="text-3xl font-medium tracking-tight text-balance lg:text-[2.6rem] lg:leading-[1.1]">{lead.title}</h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground text-pretty lg:text-lg">{lead.dek}</p>
            <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium">
              Read the note <ArrowRight className="size-4 transition-transform duration-300 group-hover/f:translate-x-0.5" />
            </span>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid">
          <span className="label-mono border-b border-border/70 pb-3">MORE NOTES</span>
          <ul>
            {rest.map((p) => (
              <li key={p.slug} className="border-b border-border/70">
                <Link href={href(p.slug)} className="group/r -mx-4 grid gap-2.5 rounded-xl px-4 py-6 transition-colors duration-200 hover:bg-foreground/[0.03] lg:grid-cols-[11rem_minmax(0,1fr)_1.25rem] lg:gap-10">
                  {/* One line above the title on phones and tablets; a small column of its own on wide screens. */}
                  <span className="label-mono flex flex-wrap gap-x-2 gap-y-1 text-[11px] lg:flex-col lg:pt-1.5">
                    <span>{p.date.toUpperCase()}</span>
                    <span aria-hidden className="lg:hidden">·</span>
                    <span className="text-foreground/80">{p.topic.toUpperCase()}</span>
                    <span aria-hidden className="lg:hidden">·</span>
                    <span>{p.minutes} MIN</span>
                  </span>
                  <span className="grid gap-1.5">
                    <span className="text-xl font-medium tracking-tight text-balance">{p.title}</span>
                    <span className="max-w-[62ch] text-muted-foreground text-pretty">{p.dek}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="mt-1.5 hidden size-4 opacity-0 transition-[opacity,translate] duration-300 group-hover/r:translate-x-0.5 group-hover/r:-translate-y-0.5 group-hover/r:opacity-80 lg:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {shown.length === 0 && <p className="text-muted-foreground">Nothing under that topic yet.</p>}
    </div>
  )
}

function Meta({ post }: { post: PostSummary }) {
  return (
    <span className="label-mono flex flex-wrap items-center gap-x-2 text-[11.5px]">
      <span className="text-foreground">{post.topic.toUpperCase()}</span>
      <span aria-hidden>·</span>
      <span>{post.date.toUpperCase()}</span>
      <span aria-hidden>·</span>
      <span>{post.minutes} MIN READ</span>
    </span>
  )
}
