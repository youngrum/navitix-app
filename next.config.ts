import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["image.tmdb.org"],
    unoptimized: true, // vercelの無料枠超過回避
  },
};

export default nextConfig;
