import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site"

/** Everything may be crawled except the component lab, and the sitemap is named for crawlers that look here. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/lab" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
