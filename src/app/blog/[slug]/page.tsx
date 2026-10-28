import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Contents, ReadingProgress } from "@/components/insights/article-chrome"
import { InsightCover } from "@/components/insights/insight-cover"
import { BotlaneMark } from "@/components/site/botlane-mark"
import { SiteFooter, SiteHeader } from "@/components/site/site-header"
import { anchor, findPost, formatDate, postsByDate, readingMinutes, type Block } from "@/lib/insights"

export const dynamicParams = false

export function generateStaticParams() {
  return postsByDate().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = findPost((await params).slug)
  if (!post) return {}
  return {
    title: `${post.title} · Botlane`,
    description: post.dek,
    openGraph: { type: "article", title: post.title, description: post.dek, publishedTime: post.date },
  }
}

/** One block of the body, set for long reading: a 17px measure of about 68 characters. */
function Part({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[17px] leading-[1.75] text-foreground/85 text-pretty">{block.text}</p>
    case "h2":
      return <h2 id={anchor(block.text)} className="mt-6 scroll-mt-[calc(var(--header-h)+2rem)] text-2xl font-medium tracking-tight text-balance">{block.text}</h2>
    case "list":
      return (
        <ul className="grid gap-2.5">
          {block.items.map((i) => (
            <li key={i} className="flex gap-3 text-[17px] leading-[1.7] text-foreground/85">
              <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-(--brand)" />
              {i}
            </li>
          ))}
        </ul>
      )
    case "quote":
      return (
        <blockquote className="my-4 border-l-2 border-(--brand) py-1 pl-6 text-2xl leading-snug font-medium tracking-tight text-balance sm:text-[1.7rem]">
          {block.text}
        </blockquote>
      )
    case "note":
      return (
        <aside className="surface-glass my-2 grid gap-1 p-5 sm:p-6">
          <span className="label-mono mb-2 text-[11px]">{block.label.toUpperCase()}</span>
          <dl className="grid divide-y divide-border/60">
            {block.items.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-6">
                <dt className="font-medium">{k}</dt>
                <dd className="text-muted-foreground text-pretty">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )
  }
}

/**
 * A note: its topic, date and length, the title and its line, who wrote it, the cover, then the text beside
 * a list of its sections that follows your place. A line of the accent under the header shows how far
 * through you are. It closes with the next note and a way to ask us something.
 */
export default async function Note({ params }: { params: Promise<{ slug: string }> }) {
  const post = findPost((await params).slug)
  if (!post) notFound()
  const all = postsByDate()
  const next = all[(all.findIndex((p) => p.slug === post.slug) + 1) % all.length]
  const sections = post.body.filter((b) => b.type === "h2").map((b) => ({ id: anchor(b.text), text: b.text }))

  return (
    <>
      <SiteHeader />
      <ReadingProgress target="note-body" />
      <main className="mx-auto max-w-6xl px-6">
        <article>
          <header className="glow-brand grid justify-items-start gap-5 pt-10 pb-10 sm:pt-14">
            <Link href="/blog" className="group/b inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="size-3.5 transition-transform group-hover/b:-translate-x-0.5" /> Insights
            </Link>
            <span className="label-mono mt-4 flex flex-wrap items-center gap-x-2 text-[11.5px]">
              <span className="text-foreground">{post.topic.toUpperCase()}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatDate(post.date).toUpperCase()}</time>
              <span aria-hidden>·</span>
              <span>{readingMinutes(post)} MIN READ</span>
            </span>
            <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-balance sm:text-6xl sm:leading-[1.04]">{post.title}</h1>
            <p className="max-w-2xl text-xl leading-relaxed text-muted-foreground text-pretty">{post.dek}</p>
            <span className="mt-2 flex items-center gap-3 text-sm">
              <span className="tile-depth size-9 rounded-full! text-foreground"><BotlaneMark size={20} id="byline-mark" /></span>
              <span className="grid">
                <span className="font-medium">The Botlane studio</span>
                <span className="text-muted-foreground">Written by the people who build the work</span>
              </span>
            </span>
          </header>

          <InsightCover variant={post.cover} topic={post.topic} className="aspect-[21/9] w-full" />

          <div className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
            <Contents items={sections} />
            <div id="note-body" className="grid max-w-[68ch] gap-6">
              {post.body.map((b, i) => <Part key={i} block={b} />)}
            </div>
          </div>
        </article>

        <aside aria-label="Read next" className="grid gap-4 border-t border-border/60 py-12 sm:py-16">
          {next && next.slug !== post.slug && (
            <Link href={`/blog/${next.slug}`} className="surface-hairline group/n grid items-center gap-6 p-4 transition-colors hover:bg-foreground/[0.03] sm:grid-cols-[14rem_minmax(0,1fr)_auto] sm:p-5">
              <InsightCover variant={next.cover} topic={next.topic} className="aspect-[16/10]" />
              <span className="grid gap-2">
                <span className="label-mono text-[11px]">READ NEXT · {readingMinutes(next)} MIN</span>
                <span className="text-xl font-medium tracking-tight text-balance">{next.title}</span>
                <span className="text-muted-foreground text-pretty">{next.dek}</span>
              </span>
              <ArrowRight aria-hidden className="hidden size-5 opacity-60 transition-transform group-hover/n:translate-x-1 sm:block" />
            </Link>
          )}
        </aside>

        <section aria-labelledby="note-cta" className="surface-glass mb-16 flex flex-wrap items-center justify-between gap-6 p-8">
          <div className="grid gap-2">
            <h2 id="note-cta" className="text-2xl font-medium tracking-tight">Building something like this?</h2>
            <p className="text-muted-foreground">Tell us about it. We read every brief ourselves.</p>
          </div>
          <Link href="/contact" className="btn-light inline-flex h-10 items-center gap-1.5 px-5 text-sm font-medium">Start a project <ArrowRight className="size-4" /></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
