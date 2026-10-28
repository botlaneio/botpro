import type { MetadataRoute } from "next"

import { CATEGORIES, OFFERS, offerHref } from "@/lib/catalog"
import { POSTS } from "@/lib/insights"
import { LANES } from "@/lib/lanes"
import { SITE_URL } from "@/lib/site"

/**
 * Every public page, for search engines. Built from the same lists the pages are, so a new solution,
 * product or note appears here without touching this file. The component lab is left out on purpose.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`
  const fixed = ["/", "/solutions", "/care", "/products", "/blog", "/contact"]

  return [
    ...fixed.map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...CATEGORIES.map((c) => ({ url: url(c.href), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...OFFERS.map((o) => ({ url: url(offerHref(o)), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...LANES.map((l) => ({ url: url(`/products/${l.id}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...POSTS.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ]
}
