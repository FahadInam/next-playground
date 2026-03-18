// REACT VS NEXT.JS ARCHITECTURE PAGE - SERVER COMPONENT
// ========================================================
// This is the flagship comparison page explaining the fundamental
// architectural differences between a React SPA and Next.js.
//
// This entire page is a Server Component - it sends zero JavaScript
// to the browser. The complex comparison tables and diagrams are
// all rendered as static HTML on the server.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export const metadata = {
  title: "React vs Next.js Architecture | Learning Playground",
  description: "Understand the fundamental architectural differences between a React SPA and Next.js App Router application.",
};

export default function ReactVsNextjsPage() {
  return (
    <ConceptPage
      title="React vs Next.js Architecture"
      description="Understanding the fundamental shift from client-side React SPAs to Next.js's server-first architecture. This is the most important concept to grasp."
      serverOrClient="both"
    >
      {/* Layman Explanation */}
      <section className="space-y-4">
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Layman Explanation</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Imagine building a house. With traditional React (SPA), you ship all the building materials to the homeowner and let them assemble the house themselves in the browser. With Next.js, a construction crew (the server) builds most of the house before delivering it — the homeowner just moves in. The house looks the same, but the Next.js approach means people can move in much faster.
          </p>
        </div>
      </section>

      {/* Section 1: The Big Picture */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Fundamental Difference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/5 rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-bold text-lg mb-3">React SPA</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              Everything runs in the <strong className="text-blue-400">browser</strong>.
              The server sends an empty HTML shell, then JavaScript takes over.
            </p>
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Server sends empty HTML + large JS bundle</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Browser downloads, parses, executes JS</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>React renders the entire UI client-side</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Data fetched via useEffect after mount</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>User sees blank page → loading spinner → content</span>
              </div>
            </div>
          </div>
          <div className="bg-green-500/5 rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-bold text-lg mb-3">Next.js App Router</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              Most work happens on the <strong className="text-green-400">server</strong>.
              The browser receives ready-to-display HTML.
            </p>
            <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Server renders components to complete HTML</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Browser receives fully-rendered HTML</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Only interactive components send JS</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Data fetched on server before rendering</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>User sees content instantly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Request Lifecycle Comparison */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Request Lifecycle Comparison
        </h2>
        <div className="space-y-4">
          <FlowDiagram
            title="React SPA Request Lifecycle"
            steps={[
              { label: "Browser Request", description: "User navigates to URL", type: "client" },
              { label: "Server: Empty HTML", description: '<div id="root"></div> + JS bundles', type: "server" },
              { label: "Download JS Bundle", description: "Often 200KB+ of JavaScript", type: "network" },
              { label: "Parse & Execute JS", description: "Browser processes all JavaScript", type: "client" },
              { label: "React Renders UI", description: "Components render in the browser", type: "client" },
              { label: "useEffect → API Calls", description: "Data fetched AFTER first render", type: "network" },
              { label: "Re-render with Data", description: "UI updates with fetched data", type: "client" },
            ]}
          />
          <FlowDiagram
            title="Next.js App Router Request Lifecycle"
            steps={[
              { label: "Browser Request", description: "User navigates to URL", type: "client" },
              { label: "Next.js Server", description: "Server receives the request", type: "server" },
              { label: "Server Components Render", description: "Components execute on server, data fetched", type: "server" },
              { label: "HTML Sent to Browser", description: "Complete HTML with data, minimal JS", type: "network" },
              { label: "Browser Shows HTML", description: "Content visible immediately", type: "client" },
              { label: "Client Components Hydrate", description: "Only interactive parts get JS", type: "client" },
              { label: "Interactivity Begins", description: "App fully interactive", type: "client" },
            ]}
          />
        </div>
      </section>

      {/* Section 3: Feature Comparison Table */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Feature-by-Feature Comparison
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                <th className="text-left p-3 text-blue-400">React SPA</th>
                <th className="text-left p-3 text-green-400">Next.js App Router</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              {[
                ["Rendering", "Client-side only", "Server-first, client when needed"],
                ["Routing", "React Router (library)", "File-system based (built-in)"],
                ["Data Fetching", "useEffect + fetch/axios", "Async Server Components"],
                ["SEO", "Poor (empty HTML)", "Excellent (full HTML + metadata)"],
                ["Bundle Size", "All code sent to client", "Only client code sent"],
                ["Initial Load", "Blank → spinner → content", "Content visible instantly"],
                ["API Layer", "Separate backend needed", "Built-in Route Handlers"],
                ["Caching", "Manual (React Query, SWR)", "Built-in fetch caching + ISR"],
                ["Code Splitting", "Manual (React.lazy)", "Automatic (route-based)"],
                ["Authentication", "Client-side only", "Middleware + server-side"],
                ["Environment Vars", "All embedded in bundle", "Server vars stay secret"],
                ["Forms", "Client-side handling", "Server Actions (no API needed)"],
                ["Streaming", "Not supported", "Built-in with Suspense"],
                ["Deployment", "Static hosting (CDN)", "Node.js server or Edge"],
              ].map(([feature, react, next]) => (
                <tr key={feature} className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-medium">{feature}</td>
                  <td className="p-3">{react}</td>
                  <td className="p-3">{next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Code Comparison */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Comparison: Fetching & Displaying Data
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <CodeBlock
            filename="React SPA Approach"
            language="tsx"
            code={`// React SPA - ALL of this runs in the browser
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data fetching happens AFTER component mounts
  useEffect(() => {
    fetch('https://api.example.com/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // User sees loading state first
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// Problems:
// 1. Empty page until JS loads and executes
// 2. Loading spinner shown to user
// 3. API key would need to be public or use a proxy
// 4. No SEO - search engines see empty HTML
// 5. All component code sent to browser`}
            highlights={[1, 10, 18, 19]}
          />

          <CodeBlock
            filename="Next.js App Router Approach"
            language="tsx"
            code={`// Next.js - This runs on the SERVER
// No useState, no useEffect, no loading state needed

export default async function ProductsPage() {
  // Data fetched on the server BEFORE rendering
  // API key stays secret - never sent to browser
  const products = await fetch('https://api.example.com/products', {
    headers: { Authorization: \`Bearer \${process.env.API_SECRET}\` },
    next: { revalidate: 60 }, // Cache for 60 seconds
  }).then(res => res.json());

  // HTML is generated with data already included
  // User sees content immediately - no loading spinner
  return (
    <div>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

// Benefits:
// 1. Content visible instantly (HTML pre-rendered)
// 2. No loading state needed
// 3. API secrets stay on the server
// 4. Full SEO - search engines see complete HTML
// 5. Zero JavaScript sent for this component`}
            highlights={[1, 2, 5, 6, 8, 9]}
          />
        </div>
      </section>

      {/* Section 5: Mental Model Shift */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Mental Model Shift
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] space-y-4">
          {[
            {
              from: "Everything is a client component",
              to: "Default to Server Components, opt into client only when needed",
              icon: "🔄",
            },
            {
              from: "Fetch data in useEffect after mount",
              to: "Fetch data in async Server Components before rendering",
              icon: "📡",
            },
            {
              from: "Create separate API endpoints",
              to: "Use Server Actions for mutations, Route Handlers for APIs",
              icon: "⚡",
            },
            {
              from: "Client-side routing with React Router",
              to: "File-system routing with app/ directory",
              icon: "🗂️",
            },
            {
              from: "Manage loading states manually",
              to: "Use Suspense boundaries and loading.tsx",
              icon: "🌊",
            },
            {
              from: "SEO is an afterthought",
              to: "SEO is built-in with the Metadata API",
              icon: "🔍",
            },
          ].map((shift) => (
            <div key={shift.from} className="flex items-start gap-4 bg-[var(--color-bg-primary)] rounded-lg p-4">
              <span className="text-xl">{shift.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-blue-400 line-through">{shift.from}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="text-green-400">{shift.to}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: When to Use What */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          When to Use React SPA vs Next.js
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/5 rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3">React SPA is fine for:</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Internal dashboards / admin panels</li>
              <li>• Apps behind authentication</li>
              <li>• Apps where SEO doesn&apos;t matter</li>
              <li>• Highly interactive single-page apps</li>
              <li>• Prototypes and MVPs</li>
            </ul>
          </div>
          <div className="bg-green-500/5 rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-3">Next.js excels for:</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Public-facing websites</li>
              <li>• E-commerce sites</li>
              <li>• Content-heavy sites (blogs, docs)</li>
              <li>• Apps requiring good SEO</li>
              <li>• Apps needing fast initial loads</li>
              <li>• Full-stack applications</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 7: Architecture Diagram */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Architecture Overview
        </h2>
        <CodeBlock
          filename="Next.js Architecture"
          language="text"
          code={`┌─────────────────────────────────────────────────────────┐
│                     BROWSER (Client)                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   HTML       │  │ Client      │  │  Router Cache   │ │
│  │   (instant)  │  │ Components  │  │  (visited pages)│ │
│  │             │  │ (hydrated)  │  │                 │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                          │ HTTP Request
┌──────────────────────────┴──────────────────────────────┐
│                   NEXT.JS SERVER                         │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────┐    │
│  │Middleware │→ │Server        │→ │ Route          │    │
│  │(Edge)    │  │Components    │  │ Handlers       │    │
│  └──────────┘  └──────────────┘  └────────────────┘    │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              CACHING LAYERS                       │  │
│  │  Request Memo │ Data Cache │ Full Route Cache    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          SERVER RESOURCES (secure)                │  │
│  │  Databases │ APIs │ File System │ Env Vars       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘`}
        />
      </section>
    </ConceptPage>
  );
}
