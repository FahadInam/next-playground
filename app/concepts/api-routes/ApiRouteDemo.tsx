"use client";

// CLIENT COMPONENT - API Route Tester
// =====================================
// Demonstrates calling Route Handlers from the client.
// Must be "use client" because:
// 1. useState for storing responses
// 2. onClick handlers for triggering requests
// 3. Dynamic UI updates based on API responses

import { useState } from "react";

export default function ApiRouteDemo() {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const makeRequest = async (method: string, body?: object) => {
    setLoading(true);
    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch("/api/demo", options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="tag-client">Client</span>
        <span className="text-[var(--color-text-muted)] text-sm">→</span>
        <span className="tag-server">Route Handler</span>
      </div>

      {/* GET request */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => makeRequest("GET")}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          GET /api/demo
        </button>
      </div>

      {/* POST request */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter a message..."
          className="flex-1 px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => {
            makeRequest("POST", { text: newMessage });
            setNewMessage("");
          }}
          disabled={loading || !newMessage.trim()}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          POST /api/demo
        </button>
      </div>

      {/* Response display */}
      {response && (
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)] mb-2">Server Response:</p>
          <pre className="text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {response}
          </pre>
        </div>
      )}

      <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
        These requests go to /api/demo/route.ts on the server. The Route Handler
        processes the request and returns a JSON response. Check the network tab
        in DevTools to see the actual HTTP requests.
      </p>
    </div>
  );
}
