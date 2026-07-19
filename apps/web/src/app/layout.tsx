import type { Metadata } from "next"
import { Providers } from "@/components/providers"
import "@workspace/ui/globals.css"

export const metadata: Metadata = {
  title: "template-monorepo-next-hono",
  description: "Full-stack monorepo with Next.js, Hono, Better Auth, Drizzle",
  icons: [{ url: "/favicon.svg", type: "image/svg+xml" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-svh bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
