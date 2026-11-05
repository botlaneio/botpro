import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Services became Solutions: keep old links and search results working.
  async redirects() {
    return [
      { source: "/services", destination: "/solutions", permanent: true },
      // The AI Assistant moved under Custom solutions.
      { source: "/ai-assistant", destination: "/custom-solutions/ai-assistant", permanent: true },
      // scriblane.botlane.io still forwards here, from the old site's layout.
      { source: "/document-processing", destination: "/products/spotlane", permanent: true },
      // The products were renamed: Syncc is slotLane, Scriblane is spotLane, Flowlane is dotLane.
      { source: "/products/syncc", destination: "/products/slotlane", permanent: true },
      { source: "/products/scriblane", destination: "/products/spotlane", permanent: true },
      { source: "/products/flowlane", destination: "/products/dotlane", permanent: true },
      { source: "/pricing", destination: "/solutions", permanent: true },
      // The partner programme is a footer dialog now: #partners opens it on any page.
      { source: "/partners", destination: "/#partners", permanent: true },
    ];
  },
};

export default nextConfig;

// Lets `next dev` reach Cloudflare bindings (the R2 cache) while developing.
initOpenNextCloudflareForDev();
