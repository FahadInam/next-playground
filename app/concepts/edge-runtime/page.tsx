// EDGE RUNTIME PAGE - SERVER COMPONENT
// ======================================
// Demonstrates the Edge Runtime in Next.js.
//
// RUNTIMES IN NEXT.JS:
// 1. Node.js Runtime (default) - Full Node.js APIs, runs on server
// 2. Edge Runtime - Lightweight, based on Web APIs, runs on CDN edge
//
// EDGE RUNTIME:
// - Runs closer to the user (CDN edge locations)
// - Cold start ~0ms (vs ~250ms for Node.js)
// - Limited to Web APIs (no fs, no child_process, etc.)
// - Smaller bundle size requirements
// - Ideal for: middleware, simple API routes, auth checks

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import EdgeDemo from "./EdgeDemo";

export default function EdgeRuntimePage() {
  return (
    <ConceptPage
      title="Edge Runtime"
      description="The Edge Runtime is a lightweight alternative to Node.js that runs on CDN edge locations, providing ultra-low latency responses globally. It supports Web standard APIs."
      serverOrClient="server"
    >
      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Node.js vs Edge Runtime
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                <th className="text-left p-3 text-green-400">Node.js Runtime</th>
                <th className="text-left p-3 text-purple-400">Edge Runtime</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Cold Start</td>
                <td className="p-3">~250ms</td>
                <td className="p-3">~0ms</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">API Support</td>
                <td className="p-3">Full Node.js APIs</td>
                <td className="p-3">Web standard APIs only</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">npm Packages</td>
                <td className="p-3">Most packages work</td>
                <td className="p-3">Limited (no Node.js deps)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">File System</td>
                <td className="p-3">Full access (fs, path)</td>
                <td className="p-3">Not available</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Location</td>
                <td className="p-3">Single region</td>
                <td className="p-3">Global CDN edge</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Max Execution</td>
                <td className="p-3">No time limit</td>
                <td className="p-3">Limited (varies by provider)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: When to Use Edge */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          When to Use Edge Runtime
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
            <h3 className="text-green-400 font-semibold text-sm mb-2">Good Fit</h3>
            <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
              <li>• Middleware (auth checks, redirects)</li>
              <li>• Simple API responses</li>
              <li>• A/B testing / feature flags</li>
              <li>• Geolocation-based responses</li>
              <li>• URL rewrites</li>
              <li>• Token validation (JWT)</li>
            </ul>
          </div>
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
            <h3 className="text-red-400 font-semibold text-sm mb-2">Not Suitable</h3>
            <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
              <li>• Database queries (most drivers need Node.js)</li>
              <li>• File system operations</li>
              <li>• Heavy computation</li>
              <li>• Packages using Node.js APIs</li>
              <li>• Long-running tasks</li>
              <li>• Complex image processing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Edge API Route
        </h2>
        <EdgeDemo />
      </section>

      {/* Section 4: Code Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>
        <div className="space-y-4">
          <CodeBlock
            filename="app/api/edge-demo/route.ts"
            language="tsx"
            code={`// EDGE RUNTIME API ROUTE
// Opt into Edge Runtime with the runtime config
import { NextRequest } from 'next/server';

// This single line switches from Node.js to Edge Runtime
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Web standard APIs work on the Edge
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';

  // Geolocation headers (available on Vercel Edge)
  const country = request.headers.get('x-vercel-ip-country') || 'Unknown';

  return Response.json({
    message: \`Hello, \${name}!\`,
    runtime: 'edge',
    country,
    timestamp: new Date().toISOString(),
  });
}

// Available Web APIs on Edge:
// - fetch(), Request, Response, Headers
// - URL, URLSearchParams, URLPattern
// - TextEncoder, TextDecoder
// - crypto (Web Crypto API)
// - setTimeout, setInterval
// - structuredClone
// - atob, btoa`}
            highlights={[2, 3, 6]}
          />

          <CodeBlock
            filename="app/edge-page/page.tsx"
            language="tsx"
            code={`// EDGE RUNTIME PAGE
// Pages can also use Edge Runtime

export const runtime = 'edge'; // Switch to Edge Runtime

export default function EdgePage() {
  // This Server Component runs on the Edge
  // Limited to Web APIs - no Node.js APIs available
  return (
    <div>
      <h1>This page runs on the Edge!</h1>
      <p>Ultra-fast, globally distributed.</p>
    </div>
  );
}`}
            highlights={[3, 4]}
          />
        </div>
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Edge Runtime vs Node.js Runtime"
          steps={[
            { label: "User Request", description: "From anywhere in the world", type: "client" },
            { label: "Nearest Edge Location", description: "CDN edge node close to user", type: "network" },
            { label: "Edge Runtime Executes", description: "Near-zero cold start, Web APIs", type: "server" },
            { label: "Response", description: "Ultra-low latency response", type: "network" },
            { label: "User Receives", description: "Fast response from nearby server", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
