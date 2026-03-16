// EDGE RUNTIME API ROUTE
// =======================
// This Route Handler runs on the Edge Runtime instead of Node.js.
// The 'edge' runtime provides near-zero cold start times.
//
// IMPORTANT: Edge Runtime only supports Web standard APIs.
// No Node.js APIs (fs, path, Buffer, etc.) are available.

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "World";

  return Response.json({
    message: `Hello from the Edge, ${name}!`,
    runtime: "edge",
    timestamp: new Date().toISOString(),
    info: "This response was generated on the Edge Runtime with near-zero cold start",
  });
}
