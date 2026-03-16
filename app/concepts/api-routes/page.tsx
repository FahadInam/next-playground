// API ROUTES (ROUTE HANDLERS) PAGE - SERVER COMPONENT
// =====================================================
// This page explains Next.js Route Handlers (the App Router's API routes).
//
// KEY CONCEPTS:
// 1. Route Handlers are defined in route.ts files
// 2. They use Web standard Request/Response APIs
// 3. They support all HTTP methods (GET, POST, PUT, DELETE, etc.)
// 4. They run ONLY on the server
// 5. They replace pages/api from the Pages Router

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import ApiRouteDemo from "./ApiRouteDemo";

export default function ApiRoutesPage() {
  return (
    <ConceptPage
      title="API Routes (Route Handlers)"
      description="Route Handlers let you create API endpoints using Web Request and Response APIs. They are defined in route.ts files and run exclusively on the server."
      serverOrClient="both"
    >
      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          What Are Route Handlers?
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Route Handlers are Next.js&apos;s way of creating API endpoints. They live in
            <code className="text-green-400"> route.ts</code> files inside the <code className="text-green-400">app/</code> directory.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">File Convention</h3>
              <CodeBlock
                code={`app/
├── api/
│   ├── users/
│   │   └── route.ts    → GET/POST /api/users
│   ├── users/[id]/
│   │   └── route.ts    → GET/PUT/DELETE /api/users/:id
│   └── health/
│       └── route.ts    → GET /api/health`}
                language="text"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Key Points</h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Uses Web standard Request/Response</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Export named functions: GET, POST, PUT, DELETE</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Support streaming responses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Can run on Edge or Node.js runtime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Cannot coexist with page.tsx in same directory</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Code Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>
        <div className="space-y-4">
          <CodeBlock
            filename="app/api/users/route.ts"
            language="tsx"
            code={`// ROUTE HANDLER - runs ONLY on the server
// Export named functions matching HTTP methods
import { NextRequest, NextResponse } from 'next/server';

// GET /api/users
export async function GET(request: NextRequest) {
  // Access query params
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');

  // Query database (server-only)
  const users = await db.users.findMany({ where: { role } });

  // Return JSON response using Web Response API
  return NextResponse.json(users);
}

// POST /api/users
export async function POST(request: NextRequest) {
  // Parse request body
  const body = await request.json();

  // Validate
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'Name and email required' },
      { status: 400 }
    );
  }

  // Create user in database
  const user = await db.users.create({ data: body });

  return NextResponse.json(user, { status: 201 });
}`}
            highlights={[1, 2, 6, 18]}
          />

          <CodeBlock
            filename="app/api/users/[id]/route.ts"
            language="tsx"
            code={`// DYNAMIC ROUTE HANDLER
// The [id] segment becomes a parameter
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET /api/users/:id
export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await db.users.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

// DELETE /api/users/:id
export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = await params;
  await db.users.delete({ where: { id } });
  return new Response(null, { status: 204 });
}`}
            highlights={[2, 3, 5, 8]}
          />
        </div>
      </section>

      {/* Section 3: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: API Endpoint Tester
        </h2>
        <ApiRouteDemo />
      </section>

      {/* Section 4: Route Handlers vs Server Actions */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Route Handlers vs Server Actions
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                <th className="text-left p-3 text-green-400">Route Handlers</th>
                <th className="text-left p-3 text-purple-400">Server Actions</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Best for</td>
                <td className="p-3">Public APIs, webhooks, 3rd party</td>
                <td className="p-3">Form mutations, data updates</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">HTTP Methods</td>
                <td className="p-3">GET, POST, PUT, DELETE, etc.</td>
                <td className="p-3">POST only (automatically)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Progressive Enhancement</td>
                <td className="p-3">Manual implementation</td>
                <td className="p-3">Built-in (works without JS)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Type Safety</td>
                <td className="p-3">Manual types for request/response</td>
                <td className="p-3">End-to-end TypeScript types</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Flow */}
      <section>
        <FlowDiagram
          title="Route Handler Request Flow"
          steps={[
            { label: "Client Request", description: "fetch('/api/users', { method: 'POST' })", type: "client" },
            { label: "Next.js Router", description: "Matches request to route.ts file", type: "server" },
            { label: "Route Handler", description: "POST() function executes", type: "server" },
            { label: "Business Logic", description: "Database queries, validation, etc.", type: "server" },
            { label: "Response", description: "NextResponse.json() sent back", type: "network" },
            { label: "Client Receives", description: "Response processed by calling code", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
