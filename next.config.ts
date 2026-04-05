import type { NextConfig } from "next";

const isCapacitorBuild = process.env.CAP_BUILD === "true";

const nextConfig: NextConfig = {
  output: isCapacitorBuild ? "export" : undefined,
  images: {
    unoptimized: isCapacitorBuild,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
