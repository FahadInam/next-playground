// API ROUTE - Route Handler
// =========================
// This file defines a GET endpoint at /api/time
// It's used by the caching demo to show different caching behaviors.
//
// SERVER ONLY: Route handlers always run on the server.
// They never execute in the browser.

import { NextResponse } from "next/server";

// GET /api/time
// Returns the current server timestamp
// Used to demonstrate caching behavior differences
export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    random: Math.random().toFixed(6),
    message: "This response was generated on the server",
  });
}
