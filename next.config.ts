import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Services became Solutions: keep old links and search results working.
  async redirects() {
    return [
      { source: "/services", destination: "/solutions", permanent: true },
      // The AI Assistant moved under Custom solutions.
      { source: "/ai-assistant", destination: "/custom-solutions/ai-assistant", permanent: true },
    ];
  },
};

export default nextConfig;

// Lets `next dev` reach Cloudflare bindings (the R2 cache) while developing.
initOpenNextCloudflareForDev();
