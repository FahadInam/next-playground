// MIDDLEWARE - Runs BEFORE every matched request
// ================================================
// middleware.ts must be placed at the ROOT of your project (next to app/).
//
// KEY CONCEPTS:
// 1. Middleware runs on the server BEFORE the page is rendered
// 2. It can modify requests, redirect, rewrite URLs, set headers/cookies
// 3. It runs on the Edge Runtime (lightweight, fast, globally distributed)
// 4. It cannot access Node.js APIs (no fs, no path, etc.)
// 5. It receives the request and can return a modified response
//
// COMMON USE CASES:
// - Authentication checks (redirect unauthenticated users)
// - Internationalization (detect locale, redirect)
// - A/B testing (rewrite to different versions)
// - Bot detection
// - Rate limiting
// - Adding security headers
//
// REQUEST LIFECYCLE:
// 1. Browser makes request
// 2. Middleware runs FIRST (before any page/API route)
// 3. Middleware can: redirect, rewrite, modify headers, continue
// 4. If continued, Next.js renders the page normally

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Log the request for demo purposes
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Create a response that continues to the page
  const response = NextResponse.next();

  // DEMO: Add custom headers to show middleware ran
  response.headers.set("x-middleware-ran", "true");
  response.headers.set("x-request-path", pathname);
  response.headers.set("x-request-time", new Date().toISOString());

  // DEMO: Authentication guard for /concepts/middleware-demo/protected
  if (pathname === "/concepts/middleware-demo/protected") {
    // Check for a demo auth cookie
    const authToken = request.cookies.get("demo-auth-token");

    if (!authToken) {
      // Redirect to the middleware demo page if not "authenticated"
      const redirectUrl = new URL("/concepts/middleware-demo", request.url);
      redirectUrl.searchParams.set("message", "not-authenticated");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // DEMO: URL rewriting example
  // /old-blog/:slug → /concepts/dynamic-routing/blog/:slug
  if (pathname.startsWith("/old-blog/")) {
    const slug = pathname.replace("/old-blog/", "");
    return NextResponse.rewrite(
      new URL(`/concepts/dynamic-routing/blog/${slug}`, request.url)
    );
  }

  return response;
}

// MATCHER CONFIG
// Defines which routes the middleware should run on.
// Without this, middleware runs on EVERY request (including static files).
export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
