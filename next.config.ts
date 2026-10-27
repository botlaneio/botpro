import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Services became Solutions: keep old links and search results working.
  async redirects() {
    return [{ source: "/services", destination: "/solutions", permanent: true }];
  },
};

export default nextConfig;
