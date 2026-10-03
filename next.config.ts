import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",").map((h) => h.trim()) ?? [],
};

export default nextConfig;
