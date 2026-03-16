// SERVER COMPONENT PAGE
// =====================
// This page demonstrates Server Components - the DEFAULT in Next.js App Router.
// Since there is no "use client" directive, this entire page runs on the server.
//
// WHAT HAPPENS DURING A REQUEST:
// 1. Browser requests /concepts/server-components
// 2. Next.js server receives the request
// 3. This component function executes on the server
// 4. The JSX is rendered to HTML on the server
// 5. The HTML is sent to the browser
// 6. Browser displays the HTML immediately (no JS needed for this component)
// 7. No hydration occurs for Server Components = faster page load
//
// KEY INSIGHT: This component's code is NEVER sent to the browser.
// The browser only receives the rendered HTML output.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import ServerDemo from "./ServerDemo";
import ClientDemo from "./ClientDemo";

// This async function runs on the SERVER
// Server Components CAN be async - Client Components CANNOT
async function getServerTimestamp() {
  // This code runs on the server - you could access databases, file system, etc.
  // The result is embedded in the HTML - the browser never sees this function
  return new Date().toISOString();
}

export default async function ServerComponentsPage() {
  // ASYNC SERVER COMPONENT: Note the async keyword!
  // In React SPA, components cannot be async.
  // In Next.js, Server Components CAN be async because they run on the server.
  const timestamp = await getServerTimestamp();

  return (
    <ConceptPage
      title="Server Components"
      description="Server Components are the default in Next.js App Router. They render on the server and send zero JavaScript to the browser, resulting in faster page loads and smaller bundles."
      serverOrClient="server"
    >
      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          What Are Server Components?
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Default behavior:</strong> Every component in the app/ directory is a Server Component unless you add &ldquo;use client&rdquo;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Zero client JS:</strong> Server Components send only HTML to the browser - no JavaScript bundle</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Async support:</strong> Server Components can be async functions - they can await data directly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Direct backend access:</strong> Can query databases, read files, access env vars securely</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">✗</span>
              <span><strong className="text-[var(--color-text-primary)]">No interactivity:</strong> Cannot use useState, useEffect, onClick, or any browser APIs</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 2: When to use Server vs Client */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          When to Use Server Components
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
              <span className="tag-server">Server</span> Use When:
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Fetching data from databases or APIs</li>
              <li>• Rendering static or dynamic content</li>
              <li>• Accessing backend resources directly</li>
              <li>• Reducing client-side JavaScript bundle size</li>
              <li>• Performing secure operations (API keys, tokens)</li>
              <li>• Reading from the file system</li>
              <li>• Heavy computations (keeps client light)</li>
            </ul>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <span className="tag-client">Client</span> Use When:
            </h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Using React hooks (useState, useEffect)</li>
              <li>• Handling user interactions (clicks, forms)</li>
              <li>• Managing local UI state</li>
              <li>• Using browser APIs (window, localStorage)</li>
              <li>• Using interactive libraries (charts, maps)</li>
              <li>• Adding event listeners</li>
              <li>• Using Context providers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Server vs Client Rendering
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Server Component Demo */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="tag-server">Server Component</span>
            </h3>
            <ServerDemo timestamp={timestamp} />
          </div>

          {/* Client Component Demo */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3 text-sm flex items-center gap-2">
              <span className="tag-client">Client Component</span>
            </h3>
            <ClientDemo />
          </div>
        </div>
      </section>

      {/* Section 4: Code Example */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Example
        </h2>
        <CodeBlock
          filename="app/example/page.tsx"
          language="tsx"
          code={`// SERVER COMPONENT (default - no "use client" needed)
// This code runs ONLY on the server
// The browser never sees this source code

// Server Components CAN be async!
// This is impossible in traditional React components
export default async function ProductPage() {
  // Direct database access - safe because this runs on the server
  // API keys and secrets are never exposed to the client
  const products = await fetch('https://api.example.com/products', {
    headers: { Authorization: \`Bearer \${process.env.API_SECRET}\` }
  }).then(res => res.json());

  // This JSX is rendered to HTML on the server
  // The browser receives pure HTML - no React runtime needed
  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p.id}>
          <h2>{p.name}</h2>
          <p>{p.price}</p>
        </div>
      ))}
    </div>
  );
}`}
          highlights={[1, 2, 3, 7, 8, 9]}
        />
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Request Lifecycle
        </h2>
        <FlowDiagram
          title="Server Component Rendering Flow"
          steps={[
            { label: "Browser Request", description: "User navigates to /products", type: "client" },
            { label: "Next.js Server", description: "Server receives the request", type: "server" },
            { label: "Component Executes", description: "async function runs, data fetched", type: "server" },
            { label: "JSX → HTML", description: "React renders component to HTML string", type: "server" },
            { label: "HTML Response", description: "Pure HTML sent to browser", type: "network" },
            { label: "Browser Renders", description: "HTML displayed instantly, no JS needed", type: "client" },
          ]}
        />
      </section>

      {/* Section 6: Key Differences from React */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Differences from React SPA
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                <th className="text-left p-3 text-blue-400">React SPA</th>
                <th className="text-left p-3 text-green-400">Next.js Server Component</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Rendering</td>
                <td className="p-3">Client-side only</td>
                <td className="p-3">Server-side (HTML)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Async Components</td>
                <td className="p-3">Not supported</td>
                <td className="p-3">Fully supported</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Bundle Size</td>
                <td className="p-3">All code sent to client</td>
                <td className="p-3">Zero client JS</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Data Fetching</td>
                <td className="p-3">useEffect + fetch</td>
                <td className="p-3">Direct await in component</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Secrets</td>
                <td className="p-3">Exposed if not careful</td>
                <td className="p-3">Never sent to client</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </ConceptPage>
  );
}
