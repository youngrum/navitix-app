import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["image.tmdb.org"],
  },
  env: {
    TMDB_API_SECRET: process.env.TMDB_API_SECRET,
  },
};

export default nextConfig;
