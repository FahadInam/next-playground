// STATIC VS DYNAMIC RENDERING PAGE - SERVER COMPONENT
// =====================================================
// Explains when Next.js statically generates pages vs dynamically renders them.
//
// STATIC RENDERING (default):
// - Page HTML is generated at BUILD TIME
// - HTML is reused for every request (served from CDN)
// - Best for: content that doesn't change per request
//
// DYNAMIC RENDERING:
// - Page HTML is generated at REQUEST TIME
// - Fresh HTML for every request
// - Triggered by: cookies(), headers(), searchParams, no-store fetch
//
// Next.js automatically chooses based on your code!

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function StaticVsDynamicPage() {
  return (
    <ConceptPage
      title="Static vs Dynamic Rendering"
      description="Next.js automatically determines whether to statically generate or dynamically render pages based on your data fetching patterns. Understanding this is crucial for performance."
      serverOrClient="server"
    >
      {/* Layman Explanation */}
      <section className="space-y-4">
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Layman Explanation</h2>
          <p className="text-[var(--color-text-secondary)]">
            🖼️ Think of two types of signs. A printed poster (static) is made once and shown to everyone — fast and cheap. A digital billboard (dynamic) updates in real-time with live info like weather or news — slower to generate but always current. Next.js lets you choose: pre-build pages that rarely change (static) or generate them fresh for each visitor (dynamic).
          </p>
        </div>
      </section>

      {/* Section 1: Overview */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Two Rendering Strategies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-3">Static Rendering (Default)</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Rendered at <strong>build time</strong></li>
              <li>• HTML cached and served from CDN</li>
              <li>• Same HTML for every user</li>
              <li>• Extremely fast (no server processing)</li>
              <li>• Can be revalidated with ISR</li>
            </ul>
            <div className="mt-3 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] rounded p-2">
              Best for: marketing pages, blog posts, documentation, product listings
            </div>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3">Dynamic Rendering</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Rendered at <strong>request time</strong></li>
              <li>• Fresh data for every request</li>
              <li>• Can be personalized per user</li>
              <li>• Slightly slower (server processing needed)</li>
              <li>• Required for real-time data</li>
            </ul>
            <div className="mt-3 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] rounded p-2">
              Best for: dashboards, user profiles, search results, shopping carts
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What triggers dynamic */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          What Triggers Dynamic Rendering?
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4 text-sm">
            Next.js automatically switches from static to dynamic rendering when you use
            any of these <strong className="text-[var(--color-text-primary)]">dynamic functions</strong>:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { fn: "cookies()", desc: "Reading cookies from the request" },
              { fn: "headers()", desc: "Reading request headers" },
              { fn: "searchParams", desc: "Accessing URL search parameters" },
              { fn: "fetch(..., { cache: 'no-store' })", desc: "Opting out of caching" },
              { fn: "export const dynamic = 'force-dynamic'", desc: "Explicit dynamic mode" },
              { fn: "unstable_noStore()", desc: "Opt-out of static rendering" },
            ].map((item) => (
              <div key={item.fn} className="bg-[var(--color-bg-primary)] rounded-lg p-3">
                <code className="text-orange-400 text-sm">{item.fn}</code>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Code Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>
        <div className="space-y-4">
          <CodeBlock
            filename="Static Page (default behavior)"
            language="tsx"
            code={`// This page is STATICALLY RENDERED at build time
// No dynamic functions used = static by default

export default async function AboutPage() {
  // This fetch is cached (default behavior)
  const data = await fetch('https://api.example.com/about', {
    cache: 'force-cache', // default - can be omitted
  }).then(res => res.json());

  return <div>{data.content}</div>;
}

// At build time, Next.js will:
// 1. Call this component
// 2. Generate static HTML
// 3. Cache the HTML
// 4. Serve the same HTML for ALL requests`}
            highlights={[1, 2, 7]}
          />

          <CodeBlock
            filename="Dynamic Page (opts into dynamic rendering)"
            language="tsx"
            code={`import { cookies, headers } from 'next/headers';

// This page is DYNAMICALLY RENDERED per request
// Because it uses cookies() - a dynamic function

export default async function DashboardPage() {
  // Reading cookies makes this page dynamic
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  // Reading headers also makes it dynamic
  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent');

  // This fetch uses no-store - also dynamic
  const userData = await fetch('https://api.example.com/user', {
    cache: 'no-store',
  }).then(res => res.json());

  return <div>Welcome, {userData.name}</div>;
}

// At request time, Next.js will:
// 1. Receive the request
// 2. Call cookies()/headers() - needs the actual request
// 3. Render fresh HTML
// 4. Send unique HTML for this specific request`}
            highlights={[3, 4, 7, 8, 12, 13, 17]}
          />

          <CodeBlock
            filename="Forcing Static or Dynamic"
            language="tsx"
            code={`// Force STATIC rendering (error if dynamic functions used)
export const dynamic = 'force-static';

// Force DYNAMIC rendering (always render on request)
export const dynamic = 'force-dynamic';

// Set revalidation period (ISR)
export const revalidate = 60; // Revalidate every 60 seconds

// These are "Route Segment Config" options
// They go at the top of page.tsx or layout.tsx files`}
            highlights={[2, 5, 8]}
          />
        </div>
      </section>

      {/* Section 4: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          This Page&apos;s Rendering
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            This page is <strong className="text-green-400">statically rendered</strong> because:
          </p>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>No cookies() or headers() calls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>No searchParams usage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>No cache: &apos;no-store&apos; fetch calls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>No dynamic route segment config</span>
            </li>
          </ul>
          <p className="text-xs text-[var(--color-text-muted)] mt-3 italic">
            The HTML for this page was generated at build time and will be served from the cache
            for every request until the next build.
          </p>
        </div>
      </section>

      {/* Section 5: Flow Diagrams */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Request Flow Comparison
        </h2>
        <div className="space-y-4">
          <FlowDiagram
            title="Static Rendering Flow"
            steps={[
              { label: "Build Time", description: "next build runs", type: "server" },
              { label: "Pre-render HTML", description: "Pages rendered to static HTML files", type: "server" },
              { label: "Deploy to CDN", description: "HTML files cached globally", type: "network" },
              { label: "User Request", description: "Browser requests the page", type: "client" },
              { label: "CDN Serves HTML", description: "Cached HTML returned instantly", type: "network" },
            ]}
          />
          <FlowDiagram
            title="Dynamic Rendering Flow"
            steps={[
              { label: "User Request", description: "Browser requests the page", type: "client" },
              { label: "Server Receives", description: "Request hits the Next.js server", type: "server" },
              { label: "Render on Demand", description: "Page rendered with fresh data", type: "server" },
              { label: "Send HTML", description: "Unique HTML sent to browser", type: "network" },
              { label: "Browser Displays", description: "Fresh, personalized content", type: "client" },
            ]}
          />
        </div>
      </section>
    </ConceptPage>
  );
}
