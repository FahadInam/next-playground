// API ROUTE - Slow Endpoint
// =========================
// Simulates a slow API response for streaming/Suspense demos.
// The delay parameter controls how long the response takes.
//
// SERVER ONLY: Route handlers always run on the server.

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Read the delay from query params
  const searchParams = request.nextUrl.searchParams;
  const delay = parseInt(searchParams.get("delay") || "2000", 10);
  const label = searchParams.get("label") || "Data";

  // Simulate slow database/API call
  await new Promise((resolve) => setTimeout(resolve, delay));

  return NextResponse.json({
    label,
    data: `${label} loaded after ${delay}ms delay`,
    timestamp: new Date().toISOString(),
    items: [
      { id: 1, title: `${label} Item 1`, value: Math.random().toFixed(4) },
      { id: 2, title: `${label} Item 2`, value: Math.random().toFixed(4) },
      { id: 3, title: `${label} Item 3`, value: Math.random().toFixed(4) },
    ],
  });
}
