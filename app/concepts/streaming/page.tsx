// STREAMING & SUSPENSE PAGE - SERVER COMPONENT
// ===============================================
// This page demonstrates React Suspense and streaming in Next.js.
//
// STREAMING allows the server to send HTML in chunks as components finish rendering.
// Instead of waiting for ALL data to load, the server sends what's ready immediately.
//
// WHAT HAPPENS DURING A REQUEST:
// 1. Browser requests the page
// 2. Server starts rendering the component tree
// 3. When it hits a <Suspense> boundary with an async child, it:
//    a. Sends the fallback HTML immediately
//    b. Continues rendering other parts of the page
// 4. When the async component finishes:
//    a. Server sends the completed HTML as a new chunk
//    b. Browser replaces the fallback with the real content
// 5. This happens progressively - no full page reload needed

import { Suspense } from "react";
import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

// Simulate slow data fetching - this runs on the SERVER
async function SlowComponent({ delay, label }: { delay: number; label: string }) {
  // This await blocks THIS component, but NOT the rest of the page
  // Thanks to Suspense, the server streams the fallback while this loads
  await new Promise((resolve) => setTimeout(resolve, delay));

  const data = {
    label,
    loadedAt: new Date().toLocaleTimeString(),
    items: Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      value: Math.random().toFixed(4),
    })),
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-green-500/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-green-400 font-semibold text-sm">{data.label}</h4>
        <span className="tag-server">Server Component</span>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-3">
        Loaded at {data.loadedAt} (after {delay}ms delay)
      </p>
      <div className="space-y-2">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm bg-[var(--color-bg-primary)] rounded p-2"
          >
            <span className="text-[var(--color-text-secondary)]">Item {item.id}</span>
            <span className="text-green-400 font-mono">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading skeleton component - rendered immediately while async components load
function LoadingSkeleton({ label }: { label: string }) {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)] animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[var(--color-text-muted)] text-sm font-semibold">{label}</div>
        <span className="text-xs text-[var(--color-text-muted)]">Loading...</span>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-[var(--color-bg-primary)] rounded" />
        ))}
      </div>
    </div>
  );
}

export default function StreamingPage() {
  return (
    <ConceptPage
      title="Streaming & Suspense"
      description="Streaming lets the server send HTML progressively as components finish rendering. Combined with React Suspense, it enables instant loading states and progressive content delivery."
      serverOrClient="server"
    >
      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          How Streaming Works
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <div className="space-y-3 text-[var(--color-text-secondary)]">
            <p>
              Without streaming, the server waits for <strong className="text-[var(--color-text-primary)]">all data</strong> to load before sending any HTML.
              Users see a blank page until everything is ready.
            </p>
            <p>
              With streaming, the server sends HTML <strong className="text-[var(--color-text-primary)]">progressively</strong>:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-green-400">1.</span>
                <span>Shell HTML (layout, navigation) sent immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">2.</span>
                <span>Suspense fallbacks (loading skeletons) displayed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">3.</span>
                <span>As each async component resolves, its HTML streams in</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">4.</span>
                <span>Fallbacks are replaced with real content automatically</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Progressive Loading
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-4 text-sm">
          Each panel below simulates a slow API call. Watch them load progressively -
          faster components appear first, slower ones show loading skeletons until ready.
          <strong className="text-[var(--color-text-primary)]"> Refresh the page</strong> to see the streaming effect.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fast component - loads first */}
          <Suspense fallback={<LoadingSkeleton label="User Profile (500ms)" />}>
            <SlowComponent delay={500} label="User Profile (500ms)" />
          </Suspense>

          {/* Medium component */}
          <Suspense fallback={<LoadingSkeleton label="Recent Orders (1500ms)" />}>
            <SlowComponent delay={1500} label="Recent Orders (1500ms)" />
          </Suspense>

          {/* Slow component */}
          <Suspense fallback={<LoadingSkeleton label="Analytics (2500ms)" />}>
            <SlowComponent delay={2500} label="Analytics (2500ms)" />
          </Suspense>

          {/* Very slow component */}
          <Suspense fallback={<LoadingSkeleton label="Recommendations (3500ms)" />}>
            <SlowComponent delay={3500} label="Recommendations (3500ms)" />
          </Suspense>
        </div>
      </section>

      {/* Section 3: Code Example */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Example
        </h2>
        <CodeBlock
          filename="app/dashboard/page.tsx"
          language="tsx"
          code={`import { Suspense } from 'react';

// Async Server Component - takes 3 seconds to load
async function SlowAnalytics() {
  const data = await fetch('https://api.example.com/analytics');
  const analytics = await data.json();
  return <AnalyticsChart data={analytics} />;
}

// Loading skeleton - shown instantly while SlowAnalytics loads
function AnalyticsSkeleton() {
  return <div className="animate-pulse h-64 bg-gray-200 rounded" />;
}

// Page component - the layout renders immediately
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* This content appears immediately */}
      <WelcomeMessage />

      {/* Suspense boundary: shows skeleton, then swaps with real content */}
      <Suspense fallback={<AnalyticsSkeleton />}>
        <SlowAnalytics />
      </Suspense>

      {/* This also appears immediately - not blocked by SlowAnalytics */}
      <QuickStats />
    </div>
  );
}`}
          highlights={[1, 24, 25, 26]}
        />
      </section>

      {/* Section 4: loading.tsx */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          loading.tsx - Automatic Suspense Boundary
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Next.js provides a special <code className="text-green-400">loading.tsx</code> file that
            automatically wraps a route segment in a Suspense boundary. This gives you route-level
            loading states without manually writing Suspense.
          </p>
          <CodeBlock
            filename="app/dashboard/loading.tsx"
            language="tsx"
            code={`// loading.tsx is a SPECIAL Next.js file
// It automatically creates a Suspense boundary around the page
// Shown while page.tsx is loading (fetching data)

export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-64 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
    </div>
  );
}

// Next.js transforms this into:
// <Suspense fallback={<Loading />}>
//   <Page />
// </Suspense>`}
            highlights={[1, 2, 3, 16, 17, 18]}
          />
        </div>
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Streaming Request Flow"
          steps={[
            { label: "Browser Request", description: "User navigates to /dashboard", type: "client" },
            { label: "Server Starts Rendering", description: "Renders component tree top-down", type: "server" },
            { label: "Send Shell + Fallbacks", description: "Layout, nav, and loading skeletons sent immediately", type: "network" },
            { label: "Browser Shows Skeleton", description: "User sees layout + loading states instantly", type: "client" },
            { label: "Async Components Resolve", description: "Data fetches complete on the server", type: "server" },
            { label: "Stream HTML Chunks", description: "Each resolved component's HTML sent as a chunk", type: "network" },
            { label: "Replace Fallbacks", description: "Browser swaps skeletons with real content", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
