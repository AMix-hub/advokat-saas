import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Säger åt Vercel att ignorera linting-fel när den bygger systemet
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;