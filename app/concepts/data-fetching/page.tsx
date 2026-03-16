// SERVER COMPONENT PAGE - Data Fetching Concepts
// ================================================
// This page demonstrates the two primary data fetching approaches in Next.js:
// 1. Server-side fetch (async Server Component with direct await)
// 2. Client-side fetch (Client Component with useEffect + useState)
//
// This file is a SERVER COMPONENT (no "use client" directive).
// It orchestrates the page layout by composing Server and Client sub-components.
//
// COMPONENT TREE AND BOUNDARIES:
// page.tsx (SERVER) <-- this file
//   |-- ConceptPage (SERVER) - layout wrapper
//   |     |-- ServerFetchDemo (SERVER, async) - data fetched on the server
//   |     |-- ClientFetchDemo (CLIENT) - data fetched in the browser
//   |     |-- ComparisonTable (SERVER) - static comparison table
//   |     |-- CodeBlock (CLIENT) - has copy button interactivity
//   |     |-- FlowDiagram (SERVER) - static diagram, no interactivity
//
// WHY THIS IS A SERVER COMPONENT:
// - It has no interactivity (no hooks, no event handlers).
// - It only composes child components and passes props.
// - Keeping it as a Server Component means the page shell is rendered on the
//   server with zero client JS, while only ClientFetchDemo (which needs hooks)
//   is hydrated in the browser.
//
// WHAT RUNS ON THE SERVER:
// - This entire page function, including all JSX composition
// - The ServerFetchDemo component (async, awaits data on the server)
// - The ComparisonTable component (static data, rendered to HTML)
// - The FlowDiagram component (static diagram, rendered to HTML)
// - The ConceptPage wrapper (static layout, rendered to HTML)
//
// WHAT RUNS IN THE BROWSER:
// - ClientFetchDemo: hydrated, useEffect fires, browser-side fetch happens
// - CodeBlock: hydrated for the copy-to-clipboard button functionality
//
// RENDERING LIFECYCLE:
// 1. Browser requests /concepts/data-fetching
// 2. Next.js server starts rendering this page component
// 3. ServerFetchDemo awaits its fetch (runs on the server, ~300ms)
// 4. Meanwhile, ClientFetchDemo is server-rendered with loading=true state
// 5. All Server Components (ComparisonTable, FlowDiagram) render to HTML
// 6. The complete HTML is sent to the browser
// 7. Browser displays HTML immediately (server data visible, client shows skeleton)
// 8. React hydrates Client Components (ClientFetchDemo, CodeBlock)
// 9. ClientFetchDemo's useEffect fires, fetching data from the browser
// 10. Client data arrives and the skeleton is replaced with post cards
//
// THIS DEMONSTRATES THE KEY DIFFERENCE:
// - Server data is in the HTML from the start (no loading state visible)
// - Client data appears after a loading state (waterfall: HTML -> JS -> fetch -> render)

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import ServerFetchDemo from "./ServerFetchDemo";
import ClientFetchDemo from "./ClientFetchDemo";
import ComparisonTable from "./ComparisonTable";

export default async function DataFetchingPage() {
  // This function body runs on the SERVER.
  // The async keyword allows this Server Component to await data if needed.
  // Even though this specific component does not fetch data itself,
  // it renders ServerFetchDemo which is also an async Server Component.

  return (
    <ConceptPage
      title="Data Fetching"
      description="Next.js provides two primary approaches to data fetching: server-side (in async Server Components) and client-side (using useEffect in Client Components). Understanding when to use each approach is key to building performant Next.js applications."
      serverOrClient="both"
    >
      {/* ================================================================= */}
      {/* SECTION 1: Explanation                                            */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Two Approaches to Data Fetching
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            In Next.js App Router, you have two fundamentally different ways to
            fetch data. Each has distinct trade-offs for performance, user
            experience, and developer ergonomics.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Server-side approach card */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                <span className="tag-server">Server</span> Async Server Component
              </h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">&#10003;</span>
                  <span>Data is fetched on the server before HTML is sent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">&#10003;</span>
                  <span>No loading state - data is embedded in the HTML</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">&#10003;</span>
                  <span>Zero client-side JavaScript for the fetch logic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">&#10003;</span>
                  <span>API keys and secrets stay on the server</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">&#10003;</span>
                  <span>Great for SEO - crawlers see the full content</span>
                </li>
              </ul>
            </div>

            {/* Client-side approach card */}
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <span className="tag-client">Client</span> useEffect + fetch
              </h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">&#10003;</span>
                  <span>Data is fetched in the browser after page loads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">&#10003;</span>
                  <span>Shows loading state, then data appears</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">&#10003;</span>
                  <span>Can refetch on demand (button click, interval)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">&#10003;</span>
                  <span>Responds to user interactions (search, filter)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">!</span>
                  <span>Creates a network waterfall (HTML &rarr; JS &rarr; fetch)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2: When to Use Each Approach                              */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          When to Use Each Approach
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-green-400 font-semibold mb-3 text-sm">
                Use Server-Side Fetch When:
              </h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li>&#8226; Loading data for the initial page render</li>
                <li>&#8226; Data does not change based on user interaction</li>
                <li>&#8226; SEO is important (blog posts, product pages)</li>
                <li>&#8226; You need to use API keys or database secrets</li>
                <li>&#8226; You want the fastest possible initial load</li>
                <li>&#8226; Data can be cached or revalidated on a schedule</li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 font-semibold mb-3 text-sm">
                Use Client-Side Fetch When:
              </h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li>&#8226; Data depends on user input (search, filters)</li>
                <li>&#8226; You need real-time updates or polling</li>
                <li>&#8226; The data is user-specific and changes frequently</li>
                <li>&#8226; Fetching is triggered by user actions (click, scroll)</li>
                <li>&#8226; You need infinite scrolling or pagination</li>
                <li>&#8226; The data is not needed for SEO</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: Live Demos                                             */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Server vs Client Fetch
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Both demos below fetch from the same API endpoint (/api/posts).
          Notice the differences: the server demo has data immediately, while the
          client demo shows a loading skeleton first.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Server-side fetch demo */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="tag-server">Server</span>
              Async Server Component
            </h3>
            {/* ServerFetchDemo is an async Server Component.
                It fetches data on the server and renders HTML with the data
                already embedded. The browser receives fully rendered content. */}
            <ServerFetchDemo />
          </div>

          {/* Client-side fetch demo */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="tag-client">Client</span>
              useEffect + fetch
            </h3>
            {/* ClientFetchDemo is a Client Component ("use client").
                It renders a loading skeleton on the server, then fetches
                data in the browser via useEffect after hydration. */}
            <ClientFetchDemo />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4: Side-by-Side Comparison Table                          */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Feature Comparison
        </h2>
        {/* ComparisonTable is a Server Component - renders a static HTML table.
            Zero client-side JavaScript needed for a comparison table. */}
        <ComparisonTable />
      </section>

      {/* ================================================================= */}
      {/* SECTION 5: Code Examples                                          */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>

        <div className="space-y-6">
          {/* Server-side code example */}
          <div>
            <h3 className="text-green-400 font-semibold mb-2 text-sm flex items-center gap-2">
              <span className="tag-server">Server</span>
              Server-Side Fetch (Async Server Component)
            </h3>
            <CodeBlock
              filename="app/posts/page.tsx"
              language="tsx"
              code={`// SERVER COMPONENT (default - no "use client")
// This entire component runs on the server.
// The fetch, the data processing, and the JSX rendering
// all happen on the server. The browser only gets HTML.

// Server Components CAN be async - Client Components CANNOT
export default async function PostsPage() {
  // This fetch runs on the Node.js server:
  // - No CORS issues (server-to-server)
  // - Can use process.env.API_SECRET safely
  // - NOT visible in browser DevTools
  // - Results are cached by Next.js by default
  const res = await fetch('https://api.example.com/posts', {
    // Cache options:
    // cache: "force-cache"           -> cache forever (default)
    // cache: "no-store"              -> always fetch fresh
    // next: { revalidate: 60 }       -> revalidate every 60s
    cache: "no-store",
  });
  const posts = await res.json();

  // This JSX renders to HTML on the server.
  // The browser receives <div>, <h2>, <p> tags with data.
  // No loading spinner is ever shown to the user.
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}`}
              highlights={[1, 2, 7, 13, 14, 15]}
            />
          </div>

          {/* Client-side code example */}
          <div>
            <h3 className="text-blue-400 font-semibold mb-2 text-sm flex items-center gap-2">
              <span className="tag-client">Client</span>
              Client-Side Fetch (useEffect Approach)
            </h3>
            <CodeBlock
              filename="app/posts/PostList.tsx"
              language="tsx"
              code={`"use client";
// CLIENT COMPONENT - required because we use hooks and event handlers.
// This code is sent to the browser as JavaScript.

import { useState, useEffect } from "react";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs ONLY in the browser, AFTER hydration.
  // The server renders this component with loading=true.
  useEffect(() => {
    // This fetch runs in the BROWSER:
    // - Subject to CORS restrictions
    // - Visible in browser DevTools Network tab
    // - Cannot use server secrets
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setLoading(false);
      });
  }, []);

  // The user sees this loading state first, then data.
  // This creates the "waterfall": HTML -> JS -> fetch -> render
  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}`}
              highlights={[1, 2, 11, 12, 13, 14, 15, 28]}
            />
          </div>

          {/* API route code example */}
          <div>
            <h3 className="text-[var(--color-text-primary)] font-semibold mb-2 text-sm flex items-center gap-2">
              API Route (consumed by both approaches)
            </h3>
            <CodeBlock
              filename="app/api/posts/route.ts"
              language="ts"
              code={`// API ROUTE - runs ONLY on the server
// Both Server and Client Components can fetch from this endpoint.
// The key difference is WHERE the fetch executes:
//   Server Component -> fetch runs on the server (same machine)
//   Client Component -> fetch runs in the browser (over the network)

import { NextResponse } from "next/server";

export async function GET() {
  // Simulate database query delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In production, query your database here
  const posts = [
    { id: 1, title: "Post 1", excerpt: "..." },
    { id: 2, title: "Post 2", excerpt: "..." },
  ];

  return NextResponse.json({ posts, fetchedAt: new Date().toISOString() });
}`}
              highlights={[1, 2, 3, 4, 5]}
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6: Flow Diagrams                                          */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Request Lifecycle
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          These diagrams show the step-by-step flow for each approach. Notice how
          the server-side approach has fewer steps and the data is ready before the
          browser receives the response.
        </p>

        <div className="space-y-6">
          {/* Server-side flow */}
          <FlowDiagram
            title="Server-Side Fetch Flow (async Server Component)"
            steps={[
              {
                label: "Browser Request",
                description: "User navigates to the page",
                type: "client",
              },
              {
                label: "Server Receives Request",
                description: "Next.js server processes the route",
                type: "server",
              },
              {
                label: "Server Fetches Data",
                description: "await fetch() runs on the server (fast, no CORS)",
                type: "server",
              },
              {
                label: "Server Renders HTML",
                description: "JSX + data rendered to HTML string",
                type: "server",
              },
              {
                label: "HTML Response",
                description: "Complete HTML with data sent to browser",
                type: "network",
              },
              {
                label: "Browser Paints",
                description: "User sees content immediately - no loading state",
                type: "client",
              },
            ]}
          />

          {/* Client-side flow */}
          <FlowDiagram
            title="Client-Side Fetch Flow (useEffect + fetch)"
            steps={[
              {
                label: "Browser Request",
                description: "User navigates to the page",
                type: "client",
              },
              {
                label: "Server Renders Shell",
                description: "Component rendered with loading=true",
                type: "server",
              },
              {
                label: "HTML Response",
                description: "HTML with loading skeleton sent to browser",
                type: "network",
              },
              {
                label: "Browser Paints Loading State",
                description: "User sees loading skeleton/spinner",
                type: "client",
              },
              {
                label: "React Hydrates",
                description: "JS downloads and hydrates Client Components",
                type: "client",
              },
              {
                label: "useEffect Fires",
                description: "fetch() called from the browser",
                type: "client",
              },
              {
                label: "API Request",
                description: "Browser sends GET /api/posts over the network",
                type: "network",
              },
              {
                label: "Server Processes API",
                description: "API route handler returns JSON data",
                type: "server",
              },
              {
                label: "JSON Response",
                description: "Data travels back over the network to browser",
                type: "network",
              },
              {
                label: "setState + Re-render",
                description: "React updates DOM, data replaces loading state",
                type: "client",
              },
            ]}
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7: Key Takeaways                                          */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1 font-bold text-lg leading-none">1</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Default to server-side fetching.
                </strong>{" "}
                Next.js is designed around Server Components. Fetch data on the
                server whenever possible for the best performance and SEO.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1 font-bold text-lg leading-none">2</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Use client-side fetching for interactivity.
                </strong>{" "}
                When data depends on user actions (search, filter, pagination) or
                needs real-time updates, use Client Components with useEffect or a
                library like SWR / React Query.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1 font-bold text-lg leading-none">3</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Combine both approaches.
                </strong>{" "}
                A common pattern is to fetch critical data on the server (for the
                initial render) and use client-side fetching for interactive
                features within the same page.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1 font-bold text-lg leading-none">4</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Understand the waterfall.
                </strong>{" "}
                Client-side fetching creates a request waterfall: the browser must
                download HTML, download JS, hydrate, and then fetch data. Server-side
                fetching eliminates this waterfall entirely.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1 font-bold text-lg leading-none">5</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Leverage Next.js caching.
                </strong>{" "}
                Server-side fetch integrates with Next.js built-in caching. Use{" "}
                <code className="text-xs bg-[var(--color-bg-primary)] px-1.5 py-0.5 rounded">
                  cache: &quot;force-cache&quot;
                </code>
                ,{" "}
                <code className="text-xs bg-[var(--color-bg-primary)] px-1.5 py-0.5 rounded">
                  cache: &quot;no-store&quot;
                </code>
                , or{" "}
                <code className="text-xs bg-[var(--color-bg-primary)] px-1.5 py-0.5 rounded">
                  next: {"{"} revalidate: 60 {"}"}
                </code>{" "}
                to control caching behavior.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
