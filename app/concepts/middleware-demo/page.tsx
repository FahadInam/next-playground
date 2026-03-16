// MIDDLEWARE DEMO PAGE - SERVER COMPONENT
// =========================================
// Demonstrates how middleware works in Next.js.
// The middleware.ts file at the project root runs BEFORE this page renders.
//
// This page reads the custom headers set by middleware to prove it ran.

import { headers } from "next/headers";
import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import MiddlewareDemo from "./MiddlewareDemo";

export default async function MiddlewarePage() {
  // Read headers set by middleware - this runs on the SERVER
  const headerStore = await headers();
  const middlewareRan = headerStore.get("x-middleware-ran");
  const requestPath = headerStore.get("x-request-path");
  const requestTime = headerStore.get("x-request-time");

  return (
    <ConceptPage
      title="Middleware"
      description="Middleware runs before every matched request, enabling authentication guards, redirects, URL rewrites, header modifications, and more. It executes on the Edge Runtime."
      serverOrClient="server"
    >
      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          How Middleware Works
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] space-y-4">
          <p className="text-[var(--color-text-secondary)]">
            Middleware is a function that runs <strong className="text-[var(--color-text-primary)]">before</strong> every
            request reaches your pages or API routes. It&apos;s defined in a single <code className="text-green-400">middleware.ts</code> file
            at the root of your project.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold text-sm mb-2">Can Do</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>• Redirect requests</li>
                <li>• Rewrite URLs</li>
                <li>• Modify request/response headers</li>
                <li>• Set/read cookies</li>
                <li>• Return responses directly</li>
              </ul>
            </div>
            <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20">
              <h3 className="text-red-400 font-semibold text-sm mb-2">Cannot Do</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>• Access Node.js APIs (fs, path)</li>
                <li>• Use most npm packages</li>
                <li>• Modify response body</li>
                <li>• Access databases directly</li>
                <li>• Run heavy computations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Proof middleware ran */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Proof: Middleware Ran on This Request
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            The middleware.ts file added custom headers to this request. Here they are:
          </p>
          <div className="space-y-2 font-mono text-sm">
            <div className="bg-[var(--color-bg-primary)] rounded p-3 flex justify-between">
              <span className="text-[var(--color-text-muted)]">x-middleware-ran:</span>
              <span className="text-green-400">{middlewareRan || "not set"}</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded p-3 flex justify-between">
              <span className="text-[var(--color-text-muted)]">x-request-path:</span>
              <span className="text-green-400">{requestPath || "not set"}</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded p-3 flex justify-between">
              <span className="text-[var(--color-text-muted)]">x-request-time:</span>
              <span className="text-green-400">{requestTime || "not set"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Auth Guard Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Demo: Authentication Guard
        </h2>
        <MiddlewareDemo />
      </section>

      {/* Section 4: Code Example */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Example
        </h2>
        <CodeBlock
          filename="middleware.ts (project root)"
          language="tsx"
          code={`import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for authentication token
  const token = request.cookies.get('auth-token');

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'hello');

  return response;
}

// Only run middleware on specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};`}
          highlights={[4, 6, 9, 10, 11, 22, 23]}
        />
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Middleware Request Flow"
          steps={[
            { label: "Browser Request", description: "User navigates to /dashboard", type: "client" },
            { label: "Middleware Executes", description: "Runs BEFORE any page or API route", type: "server" },
            { label: "Check Auth / Rules", description: "Read cookies, headers, URL", type: "server" },
            { label: "Decision", description: "Continue, redirect, or rewrite?", type: "server" },
            { label: "Page Renders", description: "If continued, page renders normally", type: "server" },
            { label: "Response to Browser", description: "HTML (with middleware headers) sent", type: "network" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
