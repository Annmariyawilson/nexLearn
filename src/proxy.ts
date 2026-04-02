import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Read tokens from cookies (set by our cross-tab storage sync)
  const accessToken = request.cookies.get("nexlearn_access_token")?.value;
  const refreshToken = request.cookies.get("nexlearn_refresh_token")?.value;

  const protectedPaths = ["/exam", "/result"];
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  /**
   * SELF-HEALING AUTH POLICY:
   * 1. If accessToken exists -> PASS (Active session).
   * 2. If accessToken is missing BUT refreshToken exists -> PASS.
   *    (This allows the page to load so the client-side Axios interceptor 
   *     can perform a 'Silent Refresh' on the very first API call).
   * 3. If BOTH are missing -> REDIRECT to login.
   */
  if (isProtected) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/exam/:path*", "/result/:path*"],
};