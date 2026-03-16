// API ROUTE - SERVER-ONLY
// =======================
// This file defines an API endpoint at /api/posts using Next.js Route Handlers.
//
// KEY CONCEPTS:
// 1. Route Handlers run ONLY on the server (like Server Components).
// 2. They replace the traditional pages/api/* approach from the Pages Router.
// 3. They use the standard Web APIs: Request and Response objects.
// 4. This file is NEVER sent to the browser - it's purely server-side code.
// 5. You can safely use secrets, database connections, etc. here.
//
// NAMING CONVENTION:
// - The file MUST be named route.ts (or route.js)
// - It sits inside app/api/posts/ which maps to the URL /api/posts
// - Export named functions matching HTTP methods: GET, POST, PUT, DELETE, PATCH
//
// WHY A MOCK API?
// We use this route to demonstrate the difference between server-side and
// client-side data fetching. Both the Server Component and the Client Component
// will fetch from this same endpoint, but the mechanics are very different:
//   - Server Component: fetch runs on the server (same machine), no CORS, no waterfall
//   - Client Component: fetch runs in the browser, crosses network, visible in DevTools

import { NextResponse } from "next/server";

// -----------------------------------------------------------------------
// Mock data: sample blog posts
// In a real app, this would come from a database (Prisma, Drizzle, etc.)
// Because this runs on the server, you could safely query a DB here.
// -----------------------------------------------------------------------
const posts = [
  {
    id: 1,
    title: "Understanding Server Components",
    excerpt:
      "Server Components render on the server and send zero JavaScript to the browser, resulting in faster page loads.",
    author: "Next.js Team",
    date: "2025-12-01",
    readTime: "5 min read",
    tags: ["server", "react", "next.js"],
  },
  {
    id: 2,
    title: "Client Components and Interactivity",
    excerpt:
      "Client Components add interactivity to your app. They hydrate on the client and can use hooks like useState.",
    author: "React Core",
    date: "2025-11-15",
    readTime: "4 min read",
    tags: ["client", "hooks", "react"],
  },
  {
    id: 3,
    title: "Data Fetching Strategies in Next.js",
    excerpt:
      "Learn the differences between server-side and client-side data fetching and when to use each approach.",
    author: "Vercel Blog",
    date: "2025-10-28",
    readTime: "7 min read",
    tags: ["data-fetching", "ssr", "csr"],
  },
  {
    id: 4,
    title: "Streaming and Suspense Boundaries",
    excerpt:
      "Use React Suspense with Next.js streaming to progressively render UI as data becomes available.",
    author: "Next.js Team",
    date: "2025-10-10",
    readTime: "6 min read",
    tags: ["streaming", "suspense", "performance"],
  },
];

// -----------------------------------------------------------------------
// GET handler
// -----------
// Handles GET requests to /api/posts
// Returns the mock blog post data as JSON.
//
// We add an artificial delay (300ms) to simulate real-world network latency.
// This makes the difference between server-side and client-side fetching
// more visible in the demo:
//   - Server fetch: the delay happens on the server, user sees nothing
//   - Client fetch: the delay is visible as a loading spinner in the browser
// -----------------------------------------------------------------------
export async function GET() {
  // Simulate a small network/database delay so the demo's loading states
  // are perceptible. In production you would NOT add an artificial delay.
  await new Promise((resolve) => setTimeout(resolve, 300));

  // NextResponse.json() is a helper that:
  // 1. Serialises the data to JSON
  // 2. Sets Content-Type: application/json
  // 3. Returns a standard Response object
  return NextResponse.json({
    posts,
    // Include metadata so the consuming components can display fetch info
    fetchedAt: new Date().toISOString(),
    source: "Next.js API Route (/api/posts)",
  });
}
