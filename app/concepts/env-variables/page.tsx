// ENVIRONMENT VARIABLES PAGE - SERVER COMPONENT
// ================================================
// Demonstrates how environment variables work in Next.js.
//
// CRITICAL SECURITY CONCEPT:
// - Variables WITHOUT NEXT_PUBLIC_ prefix: SERVER ONLY (never exposed to browser)
// - Variables WITH NEXT_PUBLIC_ prefix: Available in BOTH server and client
//
// This is a major difference from Create React App where REACT_APP_* vars
// are embedded in the client bundle.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import EnvClientDemo from "./EnvClientDemo";

export default function EnvVariablesPage() {
  // SERVER-ONLY env vars - these are NEVER sent to the browser
  // Access them directly in Server Components
  const secretKey = process.env.SECRET_API_KEY || "(not set - add to .env.local)";
  const dbUrl = process.env.DATABASE_URL || "(not set - add to .env.local)";

  // NEXT_PUBLIC_ env vars - available everywhere
  const publicAppName = process.env.NEXT_PUBLIC_APP_NAME || "Next.js Playground";
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  return (
    <ConceptPage
      title="Environment Variables"
      description="Next.js handles environment variables with built-in security. Variables without the NEXT_PUBLIC_ prefix are server-only and never exposed to the browser."
      serverOrClient="both"
    >
      {/* Section 1: The Two Types */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Server-only vs Public Variables
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-3">Server-only (Default)</h3>
            <code className="text-sm bg-[var(--color-bg-primary)] px-2 py-1 rounded text-green-400">
              SECRET_API_KEY=sk_live_...
            </code>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Only accessible in Server Components</li>
              <li>• Only accessible in Route Handlers</li>
              <li>• Only accessible in Middleware</li>
              <li>• NEVER sent to the browser</li>
              <li>• Safe for secrets, API keys, DB URLs</li>
            </ul>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3">Public (NEXT_PUBLIC_ prefix)</h3>
            <code className="text-sm bg-[var(--color-bg-primary)] px-2 py-1 rounded text-blue-400">
              NEXT_PUBLIC_API_URL=https://...
            </code>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li>• Accessible EVERYWHERE (server + client)</li>
              <li>• Inlined into client JS bundle at build time</li>
              <li>• Visible in browser source code</li>
              <li>• Use for public URLs, feature flags</li>
              <li>• NEVER use for secrets!</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Live Demo - Server Variables */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Server-only Variables
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="tag-server">Server Only</span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            These values are read on the server. They appear in the HTML but their
            source code and process.env access is never sent to the browser.
          </p>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-[var(--color-bg-primary)] rounded p-3">
              <span className="text-[var(--color-text-muted)]">SECRET_API_KEY: </span>
              <span className="text-green-400">{secretKey}</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded p-3">
              <span className="text-[var(--color-text-muted)]">DATABASE_URL: </span>
              <span className="text-green-400">{dbUrl}</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded p-3">
              <span className="text-[var(--color-text-muted)]">NEXT_PUBLIC_APP_NAME: </span>
              <span className="text-blue-400">{publicAppName}</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded p-3">
              <span className="text-[var(--color-text-muted)]">NEXT_PUBLIC_API_URL: </span>
              <span className="text-blue-400">{publicApiUrl}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Client Variable Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Client-side Variables
        </h2>
        <EnvClientDemo />
      </section>

      {/* Section 4: .env Files */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Environment File Hierarchy
        </h2>
        <CodeBlock
          filename="Environment Files (loaded in order)"
          language="text"
          code={`.env                 ← Base defaults (all environments)
.env.local           ← Local overrides (gitignored!)
.env.development     ← Development-specific
.env.production      ← Production-specific
.env.test            ← Test-specific

Priority (highest to lowest):
1. Actual environment variables (process.env)
2. .env.local (not loaded in test env)
3. .env.[environment]  (.env.development, .env.production)
4. .env`}
        />

        <CodeBlock
          filename=".env.local (example)"
          language="bash"
          code={`# Server-only variables (NEVER exposed to browser)
SECRET_API_KEY=sk_live_abc123
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
JWT_SECRET=super-secret-jwt-key

# Public variables (embedded in client bundle)
NEXT_PUBLIC_APP_NAME=My Awesome App
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXX`}
          highlights={[1, 6]}
        />
      </section>

      {/* Section 5: Code Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Usage Examples
        </h2>
        <CodeBlock
          filename="Server Component (can access ALL env vars)"
          language="tsx"
          code={`// SERVER COMPONENT - can access all env vars safely
export default async function Page() {
  // ✅ Server-only vars - safe, never sent to browser
  const dbUrl = process.env.DATABASE_URL;
  const apiKey = process.env.SECRET_API_KEY;

  // ✅ Public vars - also available on server
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  // Use secret vars for server-side operations
  const data = await fetch('https://api.example.com/data', {
    headers: { Authorization: \`Bearer \${apiKey}\` }
  });

  return <div>{appName}</div>;
}`}
          highlights={[1, 3, 4, 5]}
        />

        <CodeBlock
          filename="Client Component (ONLY NEXT_PUBLIC_ vars)"
          language="tsx"
          code={`"use client";
// CLIENT COMPONENT - can only access NEXT_PUBLIC_ vars

export default function ClientComponent() {
  // ✅ Works - NEXT_PUBLIC_ vars are inlined at build time
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  // ❌ UNDEFINED - server-only vars are not available
  const secret = process.env.SECRET_API_KEY; // undefined!
  const dbUrl = process.env.DATABASE_URL;    // undefined!

  return <div>{appName} - {apiUrl}</div>;
}`}
          highlights={[1, 2, 5, 6, 9, 10, 11]}
        />
      </section>

      {/* Section 6: Flow */}
      <section>
        <FlowDiagram
          title="Environment Variable Flow"
          steps={[
            { label: "Build Time", description: "Next.js reads .env files", type: "server" },
            { label: "NEXT_PUBLIC_ vars", description: "Inlined into client JS bundle as string literals", type: "server" },
            { label: "Server-only vars", description: "Kept in server memory only", type: "server" },
            { label: "Client Bundle", description: "Contains ONLY NEXT_PUBLIC_ values", type: "network" },
            { label: "Browser", description: "Can access NEXT_PUBLIC_ vars. Server vars = undefined", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
