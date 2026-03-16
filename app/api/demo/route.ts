// API ROUTE - Demo Endpoint
// =========================
// Demonstrates both GET and POST route handlers.
// Used by the API Routes concept page.
//
// SERVER ONLY: All route handlers execute on the server.
// They are Next.js's replacement for Express/API routes.
//
// IMPORTANT DIFFERENCES FROM pages/api (Pages Router):
// 1. Route Handlers use Web standard Request/Response APIs
// 2. They support GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
// 3. They can be co-located with page.tsx files
// 4. They support streaming responses

import { NextRequest, NextResponse } from "next/server";

// In-memory store (simulated database)
// This persists across requests while the server is running
// In production, you'd use a real database
const messages: { id: number; text: string; createdAt: string }[] = [
  { id: 1, text: "Hello from the API!", createdAt: new Date().toISOString() },
  { id: 2, text: "Next.js Route Handlers are powerful", createdAt: new Date().toISOString() },
];

// GET /api/demo
// Handles GET requests - returns all messages
export async function GET() {
  // You can access databases, file system, env vars here
  // This code NEVER runs in the browser
  return NextResponse.json({
    messages,
    count: messages.length,
    serverTime: new Date().toISOString(),
  });
}

// POST /api/demo
// Handles POST requests - creates a new message
export async function POST(request: NextRequest) {
  // Parse the request body
  const body = await request.json();

  if (!body.text || typeof body.text !== "string") {
    return NextResponse.json(
      { error: "Text field is required" },
      { status: 400 }
    );
  }

  const newMessage = {
    id: messages.length + 1,
    text: body.text,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);

  return NextResponse.json(newMessage, { status: 201 });
}
