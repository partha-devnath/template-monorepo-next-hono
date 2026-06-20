import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const protectedPaths = ["/dashboard"]
const authPaths = [
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const sessionCookie = getSessionCookie(request)

  if (authPaths.some((p) => pathname.startsWith(p)) && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (protectedPaths.some((p) => pathname.startsWith(p)) && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
