import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PROTECTED = ["/dashboard", "/settings", "/rewards"]
const AUTH_PAGES = ["/login", "/register"]
const SESSION_COOKIE = "better-auth.session_token"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuth = !!request.cookies.get(SESSION_COOKIE)?.value

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isAuth)
    return NextResponse.redirect(new URL("/login", request.url))

  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && isAuth)
    return NextResponse.redirect(new URL("/dashboard", request.url))

  if (pathname === "/" && isAuth) return NextResponse.redirect(new URL("/dashboard", request.url))

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|ico)).*)"],
}
