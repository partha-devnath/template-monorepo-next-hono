import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: [
    "@workspace/ui",
    "@workspace/schemas",
    "@workspace/logger",
  ],
  experimental: {
    optimizePackageImports: [
      "@workspace/ui",
      "lucide-react",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
