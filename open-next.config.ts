import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache"

// Next.js's cache lives in the R2 bucket bound in wrangler.jsonc.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
})
