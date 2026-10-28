import type { NextConfig } from "next";

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
