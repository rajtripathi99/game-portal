import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.gamemonetize.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
