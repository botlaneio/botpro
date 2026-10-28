/**
 * Insights: the studio's notes. Each post is typed content rather than markdown, so the page sets every
 * block in the site's own type and the numbers in a post can come from where they're kept: prices are read
 * from the price book, so a note never quotes a price the site has since changed.
 *
 * Every claim in a post must be true and on record. Merging a post publishes it.
 */
import importedPosts from "../content/imported-insights.json"

import { chargeLabel, money, offering, plan, OFFERS } from "./pricing/index.ts"

const REGION = "US" as const

export type Topic = "Engineering" | "Working with us" | "Getting found" | "Enquiries" | "Buying a website" | "Automation and AI"

/** One block of a post's body. */
export type Block =
  | { type: "markdown"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "note"; label: string; items: [string, string][] }

export interface Post {
  slug: string
  title: string
  /** The line under the title, and the post's description. */
  dek: string
  topic: Topic
  /** Published, as YYYY-MM-DD. */
  date: string
  /** Which cover art the post gets. */
  cover: "lines" | "grid" | "orbit"
  body: Block[]
}

const price = (id: string) => chargeLabel(plan(id).charges[0], REGION)
const amount = (id: string) => money(plan(id).charges[0].amounts[REGION], REGION)
// "Up to 5" → "Up to 5 pages"; "Scoped to your needs" → "Pages scoped to your needs".
const pages = (spec = "") => (/^Up to/.test(spec) ? `${spec} pages` : `Pages ${spec.toLowerCase()}`)

/** A date as "28 October 2026". A declaration, so the posts below can use it as they're built. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
}
const sites = offering("websites").plans
const founding = OFFERS.find((o) => o.id === "founding-ten")!

export const POSTS: Post[] = [
  {
    slug: "what-a-fixed-price-covers",
    title: "What a fixed price actually covers",
    dek: "Every website we build has one price, agreed before we start. Here is what it includes, what sits outside it, and what happens after launch.",
    topic: "Working with us",
    date: "2026-10-28",
    cover: "grid",
    body: [
      { type: "p", text: "Every website we build has one price, agreed before any work starts. That sentence is on most of our pages, so it's worth being precise about what it means: what the price buys, what it doesn't, and what happens once the site is live." },
      { type: "h2", text: "One price, agreed in writing first" },
      { type: "p", text: "A project starts with a short call about what you need. From that we write a scope: the pages, the timeline and the price, in one document, agreed before we design anything. The price on that document is the price on the invoice." },
      { type: "quote", text: "The price on the scope is the price on the invoice." },
      { type: "h2", text: "What each package includes" },
      { type: "p", text: "Our three website packages differ in how many pages they cover, how you edit the site afterwards and how many rounds of revisions the design gets." },
      {
        type: "note",
        label: "The three packages",
        items: sites.map((p) => [`${p.name} · ${price(p.id)}`, `${pages(p.specs?.Pages)}. ${p.specs?.Editing}. ${p.specs?.Revisions} of revisions, over ${p.specs?.Timeline}.`]),
      },
      { type: "p", text: "Revisions are rounds of changes to the design, reviewed on your real content rather than placeholder text, so what you approve is what goes live." },
      { type: "h2", text: "What sits outside it" },
      { type: "p", text: `The price covers the written scope. Anything outside it, like pages the scope doesn't list, is additional work at ${price("extra-work")}. We'd rather say that plainly now than have it surprise anyone later.` },
      { type: "h2", text: "After launch" },
      { type: "p", text: "Launch isn't the end of a site's life, so we offer to look after it. Care is a monthly plan for the site we built:" },
      { type: "list", items: [...(plan("care").includes ?? [])] },
      { type: "p", text: `Care is ${price("care")}, and it's optional.` },
      { type: "h2", text: "Apps work in stages" },
      { type: "p", text: `Web apps carry more unknowns than websites, so we don't quote a whole app on a first call. Each one starts with a scoping sprint for ${amount("app-scoping")}, which ends in a technical plan and a fixed quote for the build. ${plan("app-scoping").terms}` },
      { type: "h2", text: "For our first clients" },
      { type: "p", text: `We're a new studio. Our first ${founding.places} clients get ${Math.round(founding.discount * 100)}% off their project, until ${formatDate(founding.endsOn)}. The scope and the fixed price work exactly the same way.` },
    ],
  },
  {
    slug: "moving-botlane-to-cloudflare-workers",
    title: "Moving botlane.io to Cloudflare Workers",
    dek: "This site is a Next.js app. Here is what it took to run it on Cloudflare Workers, and the few things that didn't move by themselves.",
    topic: "Engineering",
    date: "2026-10-28",
    cover: "lines",
    body: [
      { type: "p", text: "This site is a Next.js app, and until this week it ran on Vercel. It now runs on Cloudflare Workers. Most of the move was configuration; a few parts needed real changes. This is a note on both, for anyone running Next.js who's considering the same." },
      { type: "h2", text: "The adapter" },
      { type: "p", text: "Workers don't run Next.js directly. OpenNext's Cloudflare adapter takes the output of a normal Next.js build and turns it into a Worker, with the static files served as assets alongside it. The Worker's settings live in one file, wrangler.jsonc, kept in the repository with the code." },
      { type: "h2", text: "Where Next.js keeps its cache" },
      { type: "p", text: "Next.js caches pages and data between requests. On Workers that cache needs somewhere to live, so it sits in an R2 bucket bound to the Worker. One thing it holds here: how many Founding Ten places are left, which the site reads from Stripe at most every five minutes rather than on every visit." },
      { type: "h2", text: "The build that needed the internet" },
      { type: "p", text: "The first build failed for a reason that had nothing to do with Cloudflare. The site loaded its two fonts, Inter and JetBrains Mono, through Next.js's Google Fonts loader, which downloads them while the site builds. Where the build couldn't reach Google, it stopped." },
      { type: "p", text: "We now ship both fonts from npm and load them as local files: same fonts, same weights, and a build that no longer depends on another service being reachable." },
      { type: "quote", text: "A build shouldn't depend on another service being reachable." },
      { type: "h2", text: "Moving the domain without a gap" },
      { type: "p", text: "The new Worker ran on its own workers.dev address first, so we could check it before anyone else saw it. Only then did botlane.io and www.botlane.io move over, as custom domains on the Worker." },
      { type: "p", text: "After that, the workers.dev address was a second public copy of the site, outside any rules set on the domain. We switched it off in wrangler.jsonc rather than in the dashboard, because a setting changed only in the dashboard is undone by the next deploy." },
      { type: "note", label: "In the first hours", items: [["Worker size", "About 2 MB, compressed"], ["Median CPU time", "About 8 ms a request"], ["Error rate", "0%"]] },
      { type: "h2", text: "What we'd pass on" },
      { type: "list", items: [
        "Nothing in a build should need a third party to be up. Fonts, data, anything: keep it in the repository or fetch it at run time.",
        "Check the new home on its own address before moving the domain.",
        "Make the config file the source of truth. Settings changed by hand drift.",
      ] },
    ],
  },
  ...(importedPosts as Post[]),
]

/** Posts, newest first; the same date keeps the order written above. */
export const postsByDate = (): Post[] => [...POSTS].sort((a, b) => b.date.localeCompare(a.date))

export const findPost = (slug: string): Post | undefined => POSTS.find((p) => p.slug === slug)

/** Minutes to read, at about 220 words a minute, never less than one. */
export function readingMinutes(post: Post): number {
  const words = post.body
    .flatMap((b) => (b.type === "list" ? b.items : b.type === "note" ? b.items.flat() : [b.text]))
    .join(" ")
    .split(/\s+/).length
  return Math.max(1, Math.round(words / 220))
}

/** A heading's anchor: "Where Next.js keeps its cache" → "where-nextjs-keeps-its-cache". */
export const anchor = (text: string): string => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
