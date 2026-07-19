import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: process.env.STANDALONE ? "standalone" : undefined,
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
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ]
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
