// =============================================================================
// GraphQL Caching - Concept Page
// =============================================================================
// SERVER COMPONENT (default in Next.js App Router)
//
// This page is a React Server Component, meaning:
// 1. It runs ONLY on the server during the request/render cycle
// 2. It has zero JavaScript sent to the client browser
// 3. It cannot use useState, useEffect, or any client-side hooks
// 4. It can directly access server-side resources (databases, file system, etc.)
//
// RENDERING LIFECYCLE:
// 1. User navigates to /concepts/graphql/caching
// 2. Next.js server receives the request
// 3. This component function executes on the server
// 4. JSX is rendered to HTML on the server
// 5. HTML is streamed to the client browser
// 6. No hydration needed (no interactive JS to attach)
//
// WHY SERVER COMPONENT FOR THIS PAGE:
// - Pure educational content with no interactive elements
// - No client-side state management needed
// - Better SEO since all content is in the initial HTML
// - Faster page load (no JS bundle for this page)
// - CodeBlock and FlowDiagram handle their own interactivity
//
// CACHING META-NOTE:
// Ironically, this page about caching is itself subject to Next.js caching.
// Since it's a static server component with no dynamic data, Next.js will
// statically generate this page at build time and serve it from cache.
// =============================================================================

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

// -----------------------------------------------------------------------------
// Page metadata could be exported here for SEO if needed:
// export const metadata = { title: "GraphQL Caching", description: "..." }
// -----------------------------------------------------------------------------

export default function GraphQLCachingPage() {
  return (
    // ConceptPage wrapper provides consistent layout, breadcrumbs, and styling
    // serverOrClient="server" indicates this concept is primarily server-side
    <ConceptPage
      title="GraphQL Caching"
      description="Master caching strategies for GraphQL in Next.js to build fast, efficient applications that minimize redundant network requests."
      serverOrClient="server"
    >
      {/* ================================================================== */}
      {/* SECTION 1: LAYMAN EXPLANATION                                      */}
      {/* Uses a relatable analogy to make caching intuitive for beginners   */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Understanding Caching (The Simple Version)
        </h2>

        {/* Green card for the friendly analogy */}
        <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
          <h3 className="text-green-400 font-semibold text-lg mb-3">
            Think of It Like a Notebook
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            Imagine you have a friend who knows the answer to every question. Every
            time you have a question, you call them and they give you the answer.
            But calling takes time — you have to dial, wait for them to pick up,
            ask your question, and wait for the response.
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            Now imagine you start keeping a <strong className="text-[var(--color-text-primary)]">notebook</strong>.
            Every time your friend answers a question, you write down both the
            question and the answer. The next time someone asks you the same
            question, you just look in your notebook instead of calling your friend
            again. That's caching!
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            But there's a catch — what if your friend learns new information?
            Your notebook might have <strong className="text-[var(--color-text-primary)]">stale answers</strong>.
            So you set rules: "I'll check with my friend again after 1 hour" or
            "I'll call my friend whenever they text me that something changed."
            These rules are your <strong className="text-[var(--color-text-primary)]">cache invalidation strategy</strong>.
          </p>
        </div>

        {/* Visual summary of the analogy mapped to technical concepts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Your Friend = The Server
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              The GraphQL API that has the real, up-to-date data. Every call costs
              time and resources.
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              The Notebook = The Cache
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              A fast-access storage layer (memory, disk, CDN) that stores previous
              responses for quick retrieval.
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Checking the Notebook = Cache Hit
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              When you find the answer in your cache without making a network
              request. This is fast and free!
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 2: DEVELOPER EXPLANATION                                   */}
      {/* Three main approaches to caching GraphQL in Next.js                */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Developer Deep Dive: Three Caching Approaches
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          When working with GraphQL in Next.js, you have three primary caching
          strategies. Each operates at a different layer and serves different
          use cases.
        </p>

        {/* Approach 1: Next.js built-in fetch caching */}
        <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
          <h3 className="text-blue-400 font-semibold text-lg mb-3">
            1. Next.js fetch() Caching
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-3">
            Next.js extends the native <code className="text-blue-400">fetch()</code> API
            with built-in caching. When you use fetch to call a GraphQL endpoint
            in a Server Component, Next.js automatically caches the response.
            You control this with the <code className="text-blue-400">cache</code> and
            <code className="text-blue-400">next.revalidate</code> options.
          </p>
          <ul className="text-[var(--color-text-secondary)] space-y-2 list-disc list-inside">
            <li>
              <code className="text-blue-400">cache: &quot;force-cache&quot;</code> — Cache indefinitely
              (default for GET requests)
            </li>
            <li>
              <code className="text-blue-400">cache: &quot;no-store&quot;</code> — Never cache, always
              fetch fresh data
            </li>
            <li>
              <code className="text-blue-400">next.revalidate: 60</code> — Cache for 60 seconds,
              then revalidate in the background
            </li>
            <li>
              <code className="text-blue-400">next.tags</code> — Tag requests for on-demand
              revalidation
            </li>
          </ul>
        </div>

        {/* Approach 2: Apollo Client normalized cache */}
        <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-purple-400 font-semibold text-lg mb-3">
            2. Apollo Client Normalized Cache
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-3">
            Apollo Client uses a sophisticated <strong>normalized cache</strong> that
            breaks down GraphQL responses into individual objects, storing them by
            their unique identifier (typically <code className="text-purple-400">__typename:id</code>).
            This means if two different queries return the same user object, it is
            stored only once and both queries share the same cached reference.
          </p>
          <ul className="text-[var(--color-text-secondary)] space-y-2 list-disc list-inside">
            <li>Deduplicates objects across queries automatically</li>
            <li>Updates all queries referencing an object when it changes</li>
            <li>Supports cache policies: cache-first, network-only, cache-and-network</li>
            <li>Client-side only — runs in the browser</li>
          </ul>
        </div>

        {/* Approach 3: Server-side response caching */}
        <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
          <h3 className="text-orange-400 font-semibold text-lg mb-3">
            3. Server-Side Response Caching
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-3">
            At the GraphQL server level, you can cache entire query responses or
            individual resolver results. Tools like Redis, CDN caching, or
            persisted queries help reduce database load and response times.
          </p>
          <ul className="text-[var(--color-text-secondary)] space-y-2 list-disc list-inside">
            <li>CDN edge caching with persisted/automatic persisted queries (APQ)</li>
            <li>Redis or Memcached for resolver-level caching</li>
            <li>HTTP caching headers (Cache-Control, ETag)</li>
            <li>DataLoader pattern for batching and per-request caching</li>
          </ul>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 3: CODE EXAMPLES                                           */}
      {/* Practical, copy-pasteable code for each caching approach           */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Code Examples
        </h2>

        {/* Example 1: Next.js fetch with cache options */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Next.js fetch() with Cache Options
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            The simplest way to cache GraphQL in Next.js — use the extended
            fetch API directly in Server Components.
          </p>
          <CodeBlock
            filename="app/lib/graphql-fetch.ts"
            language="typescript"
            highlights={[8, 9, 10, 11]}
            code={`// Helper function to make cached GraphQL requests
// This runs on the SERVER in Server Components
async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { revalidate?: number; tags?: string[] }
): Promise<T> {
  const response = await fetch(process.env.GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // Next.js caching options (highlighted lines)
    cache: options?.revalidate ? undefined : "force-cache",
    next: {
      revalidate: options?.revalidate, // seconds until stale
      tags: options?.tags,             // tags for on-demand invalidation
    },
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? "GraphQL Error");
  }

  return json.data as T;
}

// Usage in a Server Component:
// Cached indefinitely (static)
const staticData = await fetchGraphQL<{ posts: Post[] }>(
  \`query { posts { id title } }\`
);

// Cached for 60 seconds (ISR-style)
const revalidatedData = await fetchGraphQL<{ posts: Post[] }>(
  \`query { posts { id title } }\`,
  undefined,
  { revalidate: 60 }
);

// Tagged for on-demand revalidation
const taggedData = await fetchGraphQL<{ posts: Post[] }>(
  \`query { posts { id title } }\`,
  undefined,
  { tags: ["posts"] }
);`}
          />
        </div>

        {/* Example 2: Apollo Client cache configuration */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Apollo Client Cache Configuration
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            Apollo's InMemoryCache normalizes data by type and ID, so updates
            to an entity automatically propagate to all queries referencing it.
          </p>
          <CodeBlock
            filename="app/lib/apollo-client.ts"
            language="typescript"
            highlights={[6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
            code={`import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Create a new Apollo Client instance with normalized caching
const client = new ApolloClient({
  link: new HttpLink({ uri: "/api/graphql" }),
  cache: new InMemoryCache({
    // Type policies customize how the cache handles specific types
    typePolicies: {
      Post: {
        // Tell Apollo which field is the unique identifier
        keyFields: ["id"],
        fields: {
          // Merge function for paginated comments
          comments: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
      Query: {
        fields: {
          // Custom read function for the "posts" query
          posts: {
            // cache-and-network: return cache immediately,
            // then update with network response
            merge(existing, incoming) {
              return incoming; // replace with latest
            },
          },
        },
      },
    },
  }),
  // Default fetch policy for all queries
  defaultOptions: {
    watchQuery: {
      // "cache-and-network" shows cached data instantly
      // while fetching fresh data in the background
      fetchPolicy: "cache-and-network",
    },
  },
});

export default client;`}
          />
        </div>

        {/* Example 3: Time-based revalidation */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Time-Based Revalidation (ISR Pattern)
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            Incremental Static Regeneration (ISR) with GraphQL — serve stale
            content while regenerating in the background.
          </p>
          <CodeBlock
            filename="app/blog/page.tsx"
            language="typescript"
            highlights={[5, 17]}
            code={`// This Server Component uses time-based revalidation
// The page will be statically generated, then revalidated
// every 60 seconds when a new request comes in

// Option A: Route segment config (applies to entire route)
export const revalidate = 60; // revalidate every 60 seconds

const GET_POSTS = \`
  query GetPosts {
    posts(limit: 10, orderBy: "createdAt_DESC") {
      id
      title
      excerpt
      createdAt
    }
  }
\`;

export default async function BlogPage() {
  // This fetch inherits the route-level revalidate = 60
  const data = await fetch(process.env.GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: GET_POSTS }),
    // Option B: Per-request revalidation (overrides route config)
    // next: { revalidate: 30 },
  }).then((res) => res.json());

  const posts = data.data.posts;

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post: any) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}`}
          />
        </div>

        {/* Example 4: On-demand revalidation with tags */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            On-Demand Revalidation with Tags
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            Instead of waiting for a timer, invalidate cache immediately when
            data changes. Perfect for CMS webhooks or after mutations.
          </p>
          <CodeBlock
            filename="app/api/revalidate/route.ts"
            language="typescript"
            highlights={[9, 10]}
            code={`// API Route to trigger on-demand revalidation
// Call this from a CMS webhook or after a GraphQL mutation
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { tag, secret } = await request.json();

  // Verify the request is authorized
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // Invalidate all fetch requests tagged with this tag
  // This causes Next.js to re-fetch data on the next request
  revalidateTag(tag);

  return NextResponse.json({
    revalidated: true,
    tag,
    timestamp: Date.now(),
  });
}

// ─────────────────────────────────────────────────
// In your data-fetching code, tag requests like this:
// ─────────────────────────────────────────────────

async function getPostById(id: string) {
  const res = await fetch(process.env.GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: \`query GetPost($id: ID!) { post(id: $id) { id title content } }\`,
      variables: { id },
    }),
    next: {
      tags: [\`post-\${id}\`, "posts"], // multiple tags for granular control
    },
  });
  return res.json();
}

// After a mutation, revalidate:
// await fetch("/api/revalidate", {
//   method: "POST",
//   body: JSON.stringify({ tag: "post-123", secret: "..." }),
// });`}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 4: COMPARISON TABLE                                        */}
      {/* Side-by-side comparison of all three caching strategies            */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Caching Strategy Comparison
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Each strategy has trade-offs. Choose based on your data freshness
          requirements and architecture.
        </p>

        {/* Responsive table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="p-3 text-[var(--color-text-primary)] font-semibold">Feature</th>
                <th className="p-3 text-blue-400 font-semibold">Next.js fetch()</th>
                <th className="p-3 text-purple-400 font-semibold">Apollo Client</th>
                <th className="p-3 text-orange-400 font-semibold">Server-Side</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Where it runs</td>
                <td className="p-3">Server (build/request time)</td>
                <td className="p-3">Client (browser)</td>
                <td className="p-3">GraphQL server / CDN</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Cache type</td>
                <td className="p-3">Full response</td>
                <td className="p-3">Normalized (by type + ID)</td>
                <td className="p-3">Full response or resolver</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Invalidation</td>
                <td className="p-3">Time-based or on-demand (tags)</td>
                <td className="p-3">Automatic on mutation</td>
                <td className="p-3">TTL, manual purge</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Best for</td>
                <td className="p-3">Static/semi-static pages</td>
                <td className="p-3">Interactive SPAs</td>
                <td className="p-3">High-traffic APIs</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Setup complexity</td>
                <td className="p-3">Minimal (built-in)</td>
                <td className="p-3">Moderate</td>
                <td className="p-3">High (infra needed)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Deduplication</td>
                <td className="p-3">By request URL + body</td>
                <td className="p-3">By __typename + id</td>
                <td className="p-3">By query hash</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Works offline</td>
                <td className="p-3">No</td>
                <td className="p-3">Yes (with persistence)</td>
                <td className="p-3">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 5: FLOW DIAGRAM                                            */}
      {/* Visual representation of how Next.js caching works with GraphQL    */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          How Next.js Caching Works with GraphQL
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          This diagram shows the lifecycle of a cached GraphQL request in Next.js,
          from the initial browser request through the Data Cache and out to the
          GraphQL API.
        </p>

        {/* FlowDiagram component renders a visual step-by-step flow */}
        <FlowDiagram
          title="Next.js GraphQL Cache Flow"
          steps={[
            {
              label: "Browser Request",
              description: "User navigates to a page that needs GraphQL data",
              type: "client",
            },
            {
              label: "Next.js Router",
              description: "App Router checks if a cached version of the page exists",
              type: "server",
            },
            {
              label: "Full Route Cache Check",
              description: "If the entire page is cached (static generation), serve it immediately",
              type: "server",
            },
            {
              label: "Server Component Renders",
              description: "Component function executes, encounters fetch() call to GraphQL API",
              type: "server",
            },
            {
              label: "Data Cache Check",
              description: "Next.js checks its Data Cache for this specific fetch request (URL + body hash)",
              type: "server",
            },
            {
              label: "Cache HIT → Return Cached Data",
              description: "If data is fresh (within revalidation window), return cached response instantly",
              type: "server",
            },
            {
              label: "Cache MISS → Fetch from GraphQL API",
              description: "If no cache or stale, make a real network request to the GraphQL endpoint",
              type: "network",
            },
            {
              label: "GraphQL API Responds",
              description: "Server processes the query against the database and returns JSON",
              type: "server",
            },
            {
              label: "Store in Data Cache",
              description: "Response is stored in the Data Cache with configured TTL or tags",
              type: "server",
            },
            {
              label: "Render HTML & Serve",
              description: "Server Component renders HTML with the data and streams it to the browser",
              type: "client",
            },
          ]}
        />
      </section>

      {/* ================================================================== */}
      {/* SECTION 6: PRACTICE EXERCISES                                      */}
      {/* Three tiers: beginner, intermediate, advanced                      */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Practice Exercises
        </h2>

        {/* Beginner exercises */}
        <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
          <h3 className="text-green-400 font-semibold text-lg mb-3">
            Beginner
          </h3>
          <ol className="text-[var(--color-text-secondary)] space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-[var(--color-text-primary)]">Static GraphQL Page:</strong>{" "}
              Create a Server Component that fetches a list of items from a GraphQL
              endpoint using <code className="text-green-400">cache: &quot;force-cache&quot;</code>.
              Verify it only makes one request by checking your server logs.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">No-Cache Comparison:</strong>{" "}
              Duplicate your component but use <code className="text-green-400">cache: &quot;no-store&quot;</code>.
              Compare the response times between the cached and uncached versions
              using the Network tab in DevTools.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Cache Headers Investigation:</strong>{" "}
              Inspect the response headers from your GraphQL endpoint. What
              cache-related headers do you see? How do they relate to Next.js
              caching behavior?
            </li>
          </ol>
        </div>

        {/* Intermediate exercises */}
        <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
          <h3 className="text-blue-400 font-semibold text-lg mb-3">
            Intermediate
          </h3>
          <ol className="text-[var(--color-text-secondary)] space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-[var(--color-text-primary)]">ISR with GraphQL:</strong>{" "}
              Build a blog listing page that uses <code className="text-blue-400">next.revalidate: 30</code>.
              Add a new post via your GraphQL API and observe how long it takes
              for the page to show the new content. Time the stale-while-revalidate
              behavior.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Tag-Based Revalidation:</strong>{" "}
              Implement an API route at <code className="text-blue-400">/api/revalidate</code> that
              accepts a tag and calls <code className="text-blue-400">revalidateTag()</code>. Tag your
              GraphQL fetches with meaningful tags and trigger revalidation
              via a POST request.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Apollo Cache Exploration:</strong>{" "}
              Set up Apollo Client with InMemoryCache. Use Apollo DevTools to
              inspect the normalized cache. Fetch overlapping data from two
              different queries and verify that shared entities are deduplicated.
            </li>
          </ol>
        </div>

        {/* Advanced exercises */}
        <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
          <h3 className="text-orange-400 font-semibold text-lg mb-3">
            Advanced
          </h3>
          <ol className="text-[var(--color-text-secondary)] space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-[var(--color-text-primary)]">Multi-Layer Caching:</strong>{" "}
              Implement a system that uses Next.js Data Cache for the initial load,
              Apollo Client cache for client-side navigation, and Redis for
              server-side resolver caching. Measure the performance improvement
              at each layer.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Cache Warming Strategy:</strong>{" "}
              Create a script that pre-warms your GraphQL cache by making requests
              for your most popular queries at deploy time. Integrate it with your
              CI/CD pipeline using a post-deploy webhook.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Stale-While-Revalidate Dashboard:</strong>{" "}
              Build a monitoring dashboard that shows cache hit/miss ratios for
              your GraphQL queries. Track which queries are most frequently
              fetched and which benefit most from caching.
            </li>
          </ol>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 7: KEY TAKEAWAYS                                           */}
      {/* Summary of the most important points from the entire page          */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Takeaway 1 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Next.js Caching is Your First Line
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              The extended fetch() API in Server Components gives you powerful
              caching with minimal effort. Use <code>force-cache</code> for static
              data and <code>revalidate</code> for semi-dynamic content.
            </p>
          </div>

          {/* Takeaway 2 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Normalized Cache for Interactivity
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              When you need client-side interactivity, Apollo's InMemoryCache
              normalizes your data by type and ID, automatically keeping your UI
              in sync across different queries.
            </p>
          </div>

          {/* Takeaway 3 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Invalidation is the Hard Part
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              Choosing when to invalidate cached data is harder than caching
              itself. Use time-based revalidation for predictable freshness and
              tag-based revalidation for event-driven updates.
            </p>
          </div>

          {/* Takeaway 4 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Layer Your Caching
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              Production applications benefit from multiple cache layers: CDN for
              static pages, Next.js Data Cache for server-rendered content, and
              Apollo Client for interactive client-side experiences.
            </p>
          </div>
        </div>
      </section>
    </ConceptPage>
  );
}
