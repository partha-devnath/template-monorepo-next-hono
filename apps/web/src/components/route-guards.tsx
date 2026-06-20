"use client"

import { type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"

export function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return <>{children}</>
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (session) {
    router.push("/dashboard")
    return null
  }

  return <>{children}</>
}
