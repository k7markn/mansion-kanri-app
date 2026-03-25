import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/mansion-kanri-app",
  assetPrefix: "/mansion-kanri-app",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
