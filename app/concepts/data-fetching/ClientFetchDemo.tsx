"use client";

// CLIENT COMPONENT - Client-Side Fetch Demo
// ==========================================
// This is a CLIENT COMPONENT (notice the "use client" directive at the top).
// It demonstrates the traditional React pattern: fetching data in the browser
// using useEffect + useState.
//
// WHY THIS IS A CLIENT COMPONENT:
// - It uses useState to manage loading, error, and data states.
// - It uses useEffect to trigger the fetch after the component mounts.
// - It uses onClick handlers for the "Refetch" button.
// - All of these are browser-only APIs that require "use client".
//
// WHAT RUNS ON THE SERVER:
// - The INITIAL render of this component (with loading state = true)
// - This produces HTML showing the "Loading..." state
// - The server-rendered HTML is sent to the browser as a placeholder
//
// WHAT RUNS IN THE BROWSER:
// - React hydrates this component, attaching event listeners
// - useEffect fires AFTER hydration, triggering the fetch
// - The fetch() call goes from the BROWSER to the server over the network
// - The response travels back over the network to the browser
// - setState updates trigger re-renders in the browser
// - The user sees: Loading... -> data appears (or error)
//
// RENDERING LIFECYCLE:
// 1. Server renders the component with initial state (loading=true, posts=[])
// 2. Server sends HTML to browser showing "Loading posts..." skeleton
// 3. Browser paints the loading skeleton immediately
// 4. React hydrates the component (attaches JS event handlers)
// 5. useEffect fires (runs ONLY in the browser, AFTER mount)
// 6. Browser sends a GET request to /api/posts (visible in DevTools Network tab!)
// 7. Server processes the request and returns JSON
// 8. Browser receives the JSON response
// 9. setState({ posts: data }) triggers a re-render
// 10. React updates the DOM to show the actual post cards
//
// THE WATERFALL PROBLEM:
// Notice that the page HTML must arrive, then JS must load and hydrate,
// and THEN the fetch fires. This creates a "waterfall" of sequential requests
// that makes client-side fetching slower for initial page loads.

import { useState, useEffect } from "react";

// Same TypeScript interfaces as ServerFetchDemo
// In a real app, you would share these via a types/ directory
interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface PostsResponse {
  posts: Post[];
  fetchedAt: string;
  source: string;
}

export default function ClientFetchDemo() {
  // -----------------------------------------------------------------------
  // STATE - exists only in the browser
  // -----------------------------------------------------------------------
  // These state variables are managed by React in the browser.
  // The server renders this component once with the initial values,
  // then the browser takes over and updates them.

  // The fetched blog posts (initially empty until fetch completes)
  const [data, setData] = useState<PostsResponse | null>(null);

  // Loading indicator so we can show a skeleton/spinner
  const [loading, setLoading] = useState(true);

  // Error state in case the fetch fails
  const [error, setError] = useState<string | null>(null);

  // Track how long the fetch takes (to compare with server-side)
  const [fetchDuration, setFetchDuration] = useState<number | null>(null);

  // Count how many times we have fetched (to show refetch capability)
  const [fetchCount, setFetchCount] = useState(0);

  // -----------------------------------------------------------------------
  // fetchPosts - runs in the BROWSER
  // -----------------------------------------------------------------------
  // Unlike the Server Component version, this function executes in the
  // browser. The fetch request travels over the network from the user's
  // device to the server.
  //
  // This function is part of the client-side JS bundle and is visible
  // in the browser's Sources tab.
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      // This fetch runs in the BROWSER:
      // - Subject to CORS restrictions
      // - Visible in browser DevTools Network tab
      // - Travels over the public internet (user's network)
      // - Cannot include server-side secrets
      // - Relative URL works because the browser knows its own origin
      const response = await fetch("/api/posts");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json: PostsResponse = await response.json();
      const duration = Date.now() - startTime;

      // setState triggers a re-render in the BROWSER
      // The server never sees these state updates
      setData(json);
      setFetchDuration(duration);
      setFetchCount((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------------
  // useEffect - runs ONLY in the browser, AFTER mount
  // -----------------------------------------------------------------------
  // This is the key pattern for client-side data fetching:
  // 1. Component mounts with loading=true (server pre-renders this state)
  // 2. useEffect fires in the browser after hydration
  // 3. fetchPosts() sends a network request from the browser
  // 4. When data arrives, state updates cause a re-render
  //
  // NOTE: useEffect NEVER runs on the server. The server only renders
  // the initial state (loading=true), which produces the loading skeleton.
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      {/* Fetch metadata - always visible */}
      <div className="bg-[var(--color-bg-primary)] rounded p-3 space-y-1 text-xs">
        <p className="text-[var(--color-text-muted)]">
          Data source:{" "}
          <span className="text-blue-400">
            {data ? data.source : "Waiting..."}
          </span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Fetched at:{" "}
          <span className="text-blue-400">
            {data ? data.fetchedAt : "Waiting..."}
          </span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Fetch duration:{" "}
          <span className="text-blue-400">
            {fetchDuration !== null ? `${fetchDuration}ms` : "Waiting..."}
          </span>
          <span className="text-[var(--color-text-muted)] ml-1">
            (browser-to-server)
          </span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Fetch count:{" "}
          <span className="text-blue-400">{fetchCount}</span>
          <span className="text-[var(--color-text-muted)] ml-1">
            (click Refetch to increment)
          </span>
        </p>
      </div>

      {/* ----------- LOADING STATE ----------- */}
      {/* This is what the user sees FIRST because:
          1. Server pre-renders this component with loading=true
          2. Browser shows this skeleton until useEffect fetch completes
          This is the "waterfall" problem - the user must wait for:
            HTML download -> JS download -> Hydration -> fetch -> render */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[var(--color-bg-primary)] rounded-lg p-4 border border-blue-500/10 animate-pulse"
            >
              <div className="h-4 bg-blue-500/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-blue-500/10 rounded w-full mb-2" />
              <div className="h-3 bg-blue-500/10 rounded w-1/2" />
            </div>
          ))}
          <p className="text-xs text-blue-400 text-center animate-pulse">
            Fetching posts from browser...
          </p>
        </div>
      )}

      {/* ----------- ERROR STATE ----------- */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm font-medium">Fetch Error</p>
          <p className="text-red-400/70 text-xs mt-1">{error}</p>
          <p className="text-[var(--color-text-muted)] text-xs mt-2">
            Make sure the dev server is running (npm run dev).
          </p>
        </div>
      )}

      {/* ----------- SUCCESS STATE ----------- */}
      {/* Shown after the browser fetch completes successfully */}
      {!loading && !error && data && (
        <div className="space-y-3">
          {data.posts.map((post) => (
            <div
              key={post.id}
              className="bg-[var(--color-bg-primary)] rounded-lg p-4 border border-blue-500/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-[var(--color-text-secondary)] mb-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
              {/* Tags */}
              <div className="flex gap-1.5 mt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------- REFETCH BUTTON ----------- */}
      {/* onClick requires Client Component - Server Components cannot have event handlers */}
      <button
        onClick={fetchPosts}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
      >
        {loading ? "Fetching..." : "Refetch Posts"}
      </button>

      {/* Explanation note */}
      <p className="text-xs text-[var(--color-text-muted)] italic">
        This data was fetched in the browser. You initially saw a loading skeleton
        before the data appeared. Open your browser DevTools Network tab and
        look for the /api/posts request - you will see it listed there.
        Click &quot;Refetch Posts&quot; to see a new request fire from the browser.
      </p>
    </div>
  );
}
