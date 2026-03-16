"use client";

// CLIENT COMPONENT - Edge Runtime Demo
// ======================================
// Fetches from the Edge API route to demonstrate Edge Runtime.
// Must be "use client" for useState and onClick.

import { useState } from "react";

export default function EdgeDemo() {
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchFromEdge = async () => {
    setLoading(true);
    const start = performance.now();
    const res = await fetch("/api/edge-demo?name=Developer");
    const data = await res.json();
    const elapsed = (performance.now() - start).toFixed(0);
    setResponse(JSON.stringify({ ...data, responseTime: `${elapsed}ms` }, null, 2));
    setLoading(false);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      <button
        onClick={fetchFromEdge}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50 mb-4"
      >
        {loading ? "Fetching..." : "Fetch from Edge API Route"}
      </button>

      {response && (
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--color-border)]">
          <pre className="text-sm text-purple-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {response}
          </pre>
        </div>
      )}

      <p className="text-xs text-[var(--color-text-muted)] mt-3 italic">
        This fetches from /api/edge-demo which uses <code>export const runtime = &apos;edge&apos;</code>.
        In production on Vercel, this would run at the nearest CDN edge location to you.
      </p>
    </div>
  );
}
