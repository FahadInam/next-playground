"use client";

// CLIENT COMPONENT - Caching Demo
// =================================
// This is a Client Component because it needs:
// 1. useState - to store fetched results
// 2. onClick handlers - to trigger fetches on demand
// 3. Dynamic UI updates - showing cache behavior differences
//
// NOTE: This demo fetches from the browser to /api/time
// to demonstrate the concepts. In real apps, you'd typically
// use server-side fetch in Server Components to leverage
// Next.js's built-in caching.

import { useState } from "react";

interface FetchResult {
  timestamp: string;
  random: string;
  fetchedAt: string;
}

export default function CachingDemo() {
  const [results, setResults] = useState<Record<string, FetchResult[]>>({});

  const fetchWithStrategy = async (strategy: string) => {
    const startTime = Date.now();

    // Different cache strategies
    // NOTE: Browser fetch cache is different from Next.js server-side fetch cache
    // This demo shows the concept - server-side caching is handled differently
    let response: Response;

    switch (strategy) {
      case "no-store":
        response = await fetch("/api/time", { cache: "no-store" });
        break;
      case "force-cache":
        response = await fetch("/api/time", { cache: "force-cache" });
        break;
      case "revalidate":
        // In server components: next: { revalidate: 10 }
        // From client, we simulate by adding a cache-buster after timeout
        response = await fetch("/api/time");
        break;
      default:
        response = await fetch("/api/time");
    }

    const data = await response.json();
    const elapsed = Date.now() - startTime;

    const result: FetchResult = {
      timestamp: data.timestamp,
      random: data.random,
      fetchedAt: `${new Date().toLocaleTimeString()} (${elapsed}ms)`,
    };

    setResults((prev) => ({
      ...prev,
      [strategy]: [...(prev[strategy] || []), result].slice(-5),
    }));
  };

  const strategies = [
    {
      key: "no-store",
      label: "cache: 'no-store'",
      description: "Always fetches fresh data. Every request hits the server.",
      color: "red",
    },
    {
      key: "force-cache",
      label: "cache: 'force-cache'",
      description: "Caches the response. Subsequent requests use cached version.",
      color: "green",
    },
    {
      key: "revalidate",
      label: "next: { revalidate: 10 }",
      description: "Caches for 10 seconds, then revalidates in background.",
      color: "blue",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-secondary)]">
        Click each button multiple times to see how different caching strategies affect the response.
        Watch the timestamp and random number - identical values mean cached data.
      </p>

      {strategies.map((strategy) => (
        <div
          key={strategy.key}
          className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <code className={`text-${strategy.color}-400 text-sm font-semibold`}>
                {strategy.label}
              </code>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                {strategy.description}
              </p>
            </div>
            <button
              onClick={() => fetchWithStrategy(strategy.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-${strategy.color}-600 hover:bg-${strategy.color}-500 text-white`}
              style={{
                backgroundColor: strategy.color === "red" ? "#dc2626" : strategy.color === "green" ? "#16a34a" : "#2563eb",
              }}
            >
              Fetch
            </button>
          </div>

          {/* Results */}
          {results[strategy.key] && results[strategy.key].length > 0 && (
            <div className="space-y-1">
              {results[strategy.key].map((result, i) => (
                <div
                  key={i}
                  className="text-xs font-mono bg-[var(--color-bg-primary)] rounded p-2 flex justify-between"
                >
                  <span className="text-[var(--color-text-muted)]">
                    #{i + 1} at {result.fetchedAt}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    random: {result.random}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
        <p className="text-amber-400 font-semibold text-sm mb-1">Note</p>
        <p className="text-[var(--color-text-secondary)] text-xs">
          This demo uses client-side fetch to illustrate caching concepts.
          In production Next.js apps, you would typically use server-side fetch
          in Server Components to get the full benefit of Next.js&apos;s Data Cache.
          The browser&apos;s fetch cache behaves differently from Next.js&apos;s server-side cache.
        </p>
      </div>
    </div>
  );
}
