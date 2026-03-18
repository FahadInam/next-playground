// CACHING STRATEGIES PAGE - SERVER COMPONENT
// ============================================
// Demonstrates Next.js caching mechanisms.
// This page is a Server Component - it fetches data on the server
// to demonstrate different caching behaviors.
//
// NEXT.JS CACHING LAYERS:
// 1. Request Memoization - deduplicates identical fetches in a single render
// 2. Data Cache - persists fetch results across requests on the server
// 3. Full Route Cache - caches rendered HTML and RSC payload
// 4. Router Cache - client-side cache of visited routes
//
// RENDERING: This page is DYNAMICALLY rendered because it uses
// fetch with different cache options that include no-store.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import CachingDemo from "./CachingDemo";

export default function CachingPage() {
  return (
    <ConceptPage
      title="Caching Strategies"
      description="Next.js has multiple caching layers that optimize performance. Understanding when data is cached, revalidated, or fetched fresh is crucial for building performant applications."
      serverOrClient="both"
    >
      {/* Layman Explanation */}
      <section className="space-y-4">
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Layman Explanation</h2>
          <p className="text-[var(--color-text-secondary)]">
            📚 Think of a library. If you borrow a popular book, the librarian might keep extra copies at the front desk (cache) so they don&apos;t have to walk to the back shelves every time someone asks. Caching in Next.js works the same way — it stores frequently requested data close by so your pages load faster.
          </p>
        </div>
      </section>

      {/* Section 1: Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Next.js Caching Layers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Request Memoization",
              description: "Deduplicates identical fetch calls within a single server render pass. If two components fetch the same URL, only one request is made.",
              scope: "Single render",
              color: "blue",
            },
            {
              title: "Data Cache",
              description: "Persists fetch responses on the server across multiple requests. Controlled by cache and revalidate options on fetch().",
              scope: "Across requests",
              color: "green",
            },
            {
              title: "Full Route Cache",
              description: "Caches the rendered HTML and RSC payload for static routes at build time. Dynamic routes are not cached here.",
              scope: "Build time",
              color: "purple",
            },
            {
              title: "Router Cache",
              description: "Client-side cache that stores previously visited routes. Enables instant back/forward navigation without server requests.",
              scope: "Browser session",
              color: "orange",
            },
          ].map((cache) => (
            <div key={cache.title} className={`bg-${cache.color}-500/5 rounded-lg p-4 border border-${cache.color}-500/20`}>
              <h3 className={`text-${cache.color}-400 font-semibold text-sm mb-2`}>{cache.title}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm mb-2">{cache.description}</p>
              <span className="text-xs bg-[var(--color-bg-primary)] px-2 py-1 rounded text-[var(--color-text-muted)]">
                Scope: {cache.scope}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: fetch() Cache Options */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          fetch() Cache Options
        </h2>
        <CodeBlock
          filename="Caching Options"
          language="tsx"
          code={`// 1. FORCE CACHE (default in Next.js)
// Data is cached indefinitely until manually revalidated
// Best for: static data that rarely changes
const data1 = await fetch('https://api.example.com/data', {
  cache: 'force-cache' // This is the default
});

// 2. NO STORE - Always fresh
// Every request fetches new data from the source
// Best for: real-time data, user-specific content
const data2 = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// 3. TIME-BASED REVALIDATION (ISR)
// Cache for N seconds, then revalidate in the background
// Best for: data that changes periodically (blog posts, products)
const data3 = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 } // Revalidate every 60 seconds
});

// 4. TAG-BASED REVALIDATION
// Revalidate specific cached data on demand
const data4 = await fetch('https://api.example.com/data', {
  next: { tags: ['products'] } // Tag this cache entry
});
// Later: revalidateTag('products') to invalidate`}
          highlights={[2, 3, 9, 10, 15, 16, 21, 22]}
        />
      </section>

      {/* Section 3: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Comparing Cache Behaviors
        </h2>
        <CachingDemo />
      </section>

      {/* Section 4: ISR Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Incremental Static Regeneration (ISR)
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            ISR lets you update static content after deployment without rebuilding the entire site.
            It combines the performance of static generation with the freshness of dynamic rendering.
          </p>
          <CodeBlock
            filename="app/products/page.tsx"
            language="tsx"
            code={`// ISR Example: Revalidate every 60 seconds
// First request: serves cached version
// After 60s: next request triggers background regeneration
// Subsequent requests: serve the new version

export const revalidate = 60; // Page-level revalidation

export default async function ProductsPage() {
  // This fetch is cached for 60 seconds
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 }
  }).then(res => res.json());

  return <ProductList products={products} />;
}

// Timeline:
// t=0s:   User A visits → serves cached HTML
// t=30s:  User B visits → serves same cached HTML (still fresh)
// t=61s:  User C visits → serves stale HTML, triggers revalidation
// t=62s:  User D visits → serves NEW HTML (regenerated in background)`}
            highlights={[6, 11]}
          />
        </div>
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Data Cache Flow (with revalidation)"
          steps={[
            { label: "fetch() called", description: "Component makes a fetch request", type: "server" },
            { label: "Check Data Cache", description: "Is there a cached response?", type: "server" },
            { label: "Cache HIT (fresh)", description: "Return cached data immediately", type: "server" },
            { label: "Cache MISS or STALE", description: "Fetch from data source", type: "network" },
            { label: "Update Cache", description: "Store new response in Data Cache", type: "server" },
            { label: "Return Data", description: "Component receives data to render", type: "server" },
          ]}
        />
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Common Pitfalls
        </h2>
        <div className="space-y-3">
          {[
            {
              title: "Forgetting that fetch() is cached by default",
              description: "Unlike browser fetch, Next.js fetch() caches responses by default. Use cache: 'no-store' for fresh data.",
            },
            {
              title: "Over-using no-store",
              description: "Using no-store everywhere defeats the purpose of Next.js caching. Only use it for truly dynamic data.",
            },
            {
              title: "Not understanding revalidation",
              description: "revalidate: 60 doesn't mean data refreshes every 60s. It means after 60s, the NEXT request triggers a background refresh.",
            },
          ].map((pitfall) => (
            <div key={pitfall.title} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <p className="text-amber-400 font-semibold text-sm">{pitfall.title}</p>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">{pitfall.description}</p>
            </div>
          ))}
        </div>
      </section>
    </ConceptPage>
  );
}
