// GRAPHQL NEXT.JS INTEGRATION - SERVER COMPONENT
// ================================================
// This page explains WHERE GraphQL can run within a Next.js architecture.
// Next.js offers multiple integration points for GraphQL: API Routes,
// external GraphQL servers, and Edge Runtime functions.
//
// RENDERING STRATEGY: SERVER COMPONENT
// - No "use client" directive = this is a React Server Component
// - All JSX is rendered to HTML on the Node.js server at request time
// - Zero JavaScript is shipped to the browser for this page shell
// - Only CodeBlock children hydrate on the client (for copy button)
//
// RENDERING LIFECYCLE:
// 1. User navigates to /concepts/graphql/nextjs-integration
// 2. Next.js App Router matches this file (page.tsx)
// 3. The entire component tree executes on the server (Node.js)
// 4. HTML is streamed to the browser — no React runtime needed here
// 5. CodeBlock components hydrate independently for interactivity
//
// WHY SERVER COMPONENT?
// - This page has NO interactivity (no useState, no onClick, no forms)
// - It only displays educational text, code examples, and diagrams
// - Server rendering = faster initial load, better SEO, zero client JS
// - ConceptPage and FlowDiagram are also Server Components
// - CodeBlock is a Client Component (needs clipboard API), but it
//   hydrates independently via React's selective hydration

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function NextJSIntegrationPage() {
  // ---------------------------------------------------------------
  // This function body runs ONLY on the Node.js server.
  // The browser never executes this code — it receives pure HTML.
  // Variables defined here are server-side only and never leak
  // to the client bundle.
  // ---------------------------------------------------------------

  return (
    <ConceptPage
      title="Next.js + GraphQL Integration"
      description="Understand the different ways GraphQL can be integrated into a Next.js application. Learn about API Route handlers, external GraphQL servers, and Edge Runtime — and when to use each approach."
      serverOrClient="server"
    >
      {/* ================================================================== */}
      {/* Section 1: Layman Explanation                                       */}
      {/* A non-technical analogy to make the concept approachable.           */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Layman Explanation: The Translator in Different Offices
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          {/*
            Analogy: GraphQL is a translator that can work in different
            offices (server locations). The translator speaks the same
            language regardless of where they sit — the difference is
            proximity to the data and the people asking questions.
          */}
          <p className="text-[var(--color-text-secondary)] mb-4">
            Imagine GraphQL as a <strong className="text-[var(--color-text-primary)]">translator</strong> who
            speaks both &quot;frontend language&quot; and &quot;database language.&quot; This translator
            can work in different offices depending on your needs. The translation is always the same —
            what changes is <em>where</em> the translator sits and how close they are to the data.
          </p>

          {/* Three cards representing the three integration approaches */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* API Route approach — translator in your own building */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold text-sm mb-2">
                API Route (Same Building)
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                The translator works in your office building (your Next.js server). They&apos;re
                right down the hall — fast communication, easy to manage, but they share
                your building&apos;s resources.
              </p>
            </div>

            {/* External server approach — translator at a partner office */}
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold text-sm mb-2">
                External Server (Partner Office)
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                The translator works at a partner company across town. You call them
                when needed — they have their own resources and specialists, but
                there&apos;s a travel delay for each request.
              </p>
            </div>

            {/* Edge approach — translator at a satellite office */}
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold text-sm mb-2">
                Edge Runtime (Satellite Offices)
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                The translator has satellite offices around the world. Whichever city
                you&apos;re calling from, there&apos;s a translator nearby — super fast responses,
                but they can only use lightweight tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 2: Developer Explanation                                     */}
      {/* Technical details of each integration approach.                      */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Developer Explanation
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Next.js provides three primary integration points for GraphQL. Each approach
            determines where the GraphQL execution engine runs, how requests are routed,
            and what runtime capabilities are available.
          </p>

          {/* Approach 1: API Route Handler */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-400 mb-2">
              Approach 1: Next.js API Route Handler
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              The GraphQL server runs <strong>inside</strong> your Next.js application as a
              Route Handler (<code className="text-green-400">app/api/graphql/route.ts</code>).
              The GraphQL engine (like GraphQL Yoga) processes requests within the same Node.js
              process that serves your pages.
            </p>
            <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>Single deployment — no separate server to manage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>Shared environment variables and config with Next.js</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>Server Components can call the resolver functions directly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                <span>GraphQL server scales with your Next.js app (cannot scale independently)</span>
              </li>
            </ul>
          </div>

          {/* Approach 2: External GraphQL Server */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">
              Approach 2: External GraphQL Server
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              The GraphQL server runs as a separate service (e.g., a dedicated Express + Apollo
              Server, Hasura, or a managed GraphQL service like AWS AppSync). Your Next.js
              app sends HTTP requests to the external GraphQL endpoint.
            </p>
            <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>Independent scaling — GraphQL server handles its own load</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>Can be shared across multiple frontend apps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>Full Node.js runtime with no restrictions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                <span>Network latency between Next.js and GraphQL server</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                <span>Separate deployment and infrastructure to manage</span>
              </li>
            </ul>
          </div>

          {/* Approach 3: Edge Runtime */}
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-2">
              Approach 3: Edge Runtime
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              The GraphQL handler runs on the Edge Runtime (Vercel Edge Functions, Cloudflare
              Workers). Requests are processed at the CDN edge node closest to the user,
              providing very low latency but with a restricted runtime environment.
            </p>
            <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>Extremely low latency — runs near the user</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">+</span>
                <span>No cold starts — edge functions are always warm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                <span>Limited runtime — no Node.js APIs (no fs, no native modules)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">-</span>
                <span>Cannot connect to traditional databases directly (need HTTP-based data sources)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 3: Code Examples                                            */}
      {/* Three CodeBlock examples showing each integration approach.          */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>

        {/* Example 1: API Route Handler */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            1. Next.js API Route Approach
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">
            This is the approach we use in this learning playground. GraphQL Yoga handles
            incoming POST requests inside a Next.js Route Handler. Both Server Components
            and Client Components can query this endpoint.
          </p>
          <CodeBlock
            filename="app/api/graphql/route.ts"
            language="typescript"
            highlights={[1, 2, 5, 14, 15, 25, 26]}
            code={`// This file creates a GraphQL endpoint INSIDE Next.js
// It runs on the Node.js server as a Route Handler

import { createSchema, createYoga } from "graphql-yoga";
// The schema defines what queries clients can make
import { schema } from "@/graphql/schema";

// createYoga returns a fetch-compatible handler
// that processes GraphQL requests (parse -> validate -> execute)
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
  // This runs in the SAME Node.js process as Next.js
  // so it shares memory, env vars, and database connections
});

// Next.js Route Handlers export named functions for each HTTP method
// GraphQL uses POST for queries/mutations
export async function POST(request: Request) {
  return yoga.fetch(request);
}

// GET is needed for GraphiQL (the visual query explorer)
// In production, you might disable this
export async function GET(request: Request) {
  return yoga.fetch(request);
}`}
          />
        </div>

        {/* Example 2: External GraphQL Server */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            2. External GraphQL Server Approach
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">
            When your GraphQL server is a separate service, your Next.js Server Components
            fetch from the external URL. This is common with managed services like Hasura,
            AWS AppSync, or a standalone Apollo Server.
          </p>
          <CodeBlock
            filename="app/posts/page.tsx (Server Component)"
            language="typescript"
            highlights={[1, 2, 6, 7, 15, 16, 17]}
            code={`// Server Component — this code ONLY runs on the Node.js server
// The browser never sees this fetch or the API key

// Define the GraphQL query as a string
const POSTS_QUERY = \`
  query GetPosts {
    posts {
      id
      title
      author { name }
    }
  }
\`;

// The external URL and API key are server-side secrets
// They never appear in the client bundle
const GRAPHQL_ENDPOINT = process.env.GRAPHQL_API_URL!;
const API_KEY = process.env.GRAPHQL_API_KEY!;

export default async function PostsPage() {
  // This fetch runs on the SERVER (Node.js), not the browser
  // Next.js extends fetch with caching options
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // API key stays on the server — never sent to browser
      "Authorization": \`Bearer \${API_KEY}\`,
    },
    body: JSON.stringify({ query: POSTS_QUERY }),
    // Cache for 60 seconds, then revalidate in background
    next: { revalidate: 60 },
  });

  const { data } = await res.json();

  return (
    <ul>
      {data.posts.map((post: any) => (
        <li key={post.id}>{post.title} by {post.author.name}</li>
      ))}
    </ul>
  );
}`}
          />
        </div>

        {/* Example 3: Edge Runtime */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            3. Edge Runtime Approach
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">
            Running GraphQL on the Edge gives you the lowest latency, but you must use
            a lightweight GraphQL library and HTTP-compatible data sources (no direct
            database connections via TCP).
          </p>
          <CodeBlock
            filename="app/api/graphql-edge/route.ts"
            language="typescript"
            highlights={[1, 2, 3, 6, 13, 14, 28, 29, 30]}
            code={`// EDGE RUNTIME — this handler runs on CDN edge nodes
// It does NOT run in Node.js — no 'fs', no 'net', no native modules
// It runs in a V8 isolate (like a web worker)

import { createSchema, createYoga } from "graphql-yoga";
// Tell Next.js to use the Edge Runtime instead of Node.js
export const runtime = "edge";

// Schema must use only Edge-compatible resolvers
// No direct database connections — use HTTP APIs instead
const schema = createSchema({
  typeDefs: \`
    type Query {
      # Edge resolvers call HTTP APIs, not databases directly
      posts: [Post]
    }
    type Post {
      id: ID!
      title: String!
    }
  \`,
  resolvers: {
    Query: {
      posts: async () => {
        // Fetch from an HTTP API (database proxy, REST API, etc.)
        // This works on Edge because it uses the Fetch API
        const res = await fetch("https://api.example.com/posts");
        // Edge functions have a 25ms CPU time limit on some platforms
        // Keep resolvers fast and simple
        return res.json();
      },
    },
  },
});

const yoga = createYoga({ schema, fetchAPI: { Response } });

export async function POST(request: Request) {
  return yoga.fetch(request);
}`}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 4: Architecture Diagram                                     */}
      {/* FlowDiagram showing request flow for each approach.                 */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Architecture: Request Flow
        </h2>

        {/* API Route flow diagram */}
        <div className="mb-6">
          <FlowDiagram
            title="API Route Approach (Same Server)"
            steps={[
              {
                label: "Browser",
                description: "Client Component sends POST to /api/graphql",
                type: "client",
              },
              {
                label: "Next.js Server",
                description: "Route Handler receives the HTTP request",
                type: "server",
              },
              {
                label: "GraphQL Yoga",
                description: "Parses query, validates against schema, executes resolvers",
                type: "server",
              },
              {
                label: "Resolvers",
                description: "Fetch data from database, APIs, or in-memory stores",
                type: "server",
              },
              {
                label: "JSON Response",
                description: "Structured data returned to the browser",
                type: "network",
              },
            ]}
          />
        </div>

        {/* External server flow diagram */}
        <div className="mb-6">
          <FlowDiagram
            title="External Server Approach"
            steps={[
              {
                label: "Server Component",
                description: "async function fetches data during server rendering",
                type: "server",
              },
              {
                label: "Network Request",
                description: "HTTP POST to external GraphQL endpoint",
                type: "network",
              },
              {
                label: "External GraphQL Server",
                description: "Separate service (Apollo, Hasura, AppSync) processes query",
                type: "server",
              },
              {
                label: "Database / APIs",
                description: "External server resolves data from its own data sources",
                type: "neutral",
              },
              {
                label: "HTML Response",
                description: "Server Component renders data into HTML, sent to browser",
                type: "server",
              },
            ]}
          />
        </div>

        {/* Edge runtime flow diagram */}
        <FlowDiagram
          title="Edge Runtime Approach"
          steps={[
            {
              label: "User Request",
              description: "Request arrives from any location worldwide",
              type: "client",
            },
            {
              label: "CDN Edge Node",
              description: "Nearest edge location intercepts the request",
              type: "network",
            },
            {
              label: "Edge GraphQL Handler",
              description: "V8 isolate runs GraphQL Yoga in a lightweight runtime",
              type: "server",
            },
            {
              label: "HTTP Data Sources",
              description: "Resolvers call REST APIs, KV stores, or database proxies",
              type: "network",
            },
            {
              label: "Low-Latency Response",
              description: "Response returns from the nearest edge — minimal round trip",
              type: "client",
            },
          ]}
        />
      </section>

      {/* ================================================================== */}
      {/* Section 5: Comparison Table                                         */}
      {/* Side-by-side comparison of the three approaches.                    */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Comparison: Which Approach Should You Use?
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] overflow-x-auto">
          {/*
            Comparison table for the three approaches.
            Each row covers a key dimension: deployment, latency, runtime,
            scaling, data sources, and ideal use case.
          */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-2 pr-4 text-[var(--color-text-muted)]">Dimension</th>
                <th className="text-left py-2 pr-4 text-green-400">API Route</th>
                <th className="text-left py-2 pr-4 text-blue-400">External Server</th>
                <th className="text-left py-2 pr-4 text-purple-400">Edge Runtime</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              {/* Deployment complexity */}
              <tr className="border-b border-[var(--color-border)]/50">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]">Deployment</td>
                <td className="py-2 pr-4">Single deploy with Next.js</td>
                <td className="py-2 pr-4">Separate service to deploy and monitor</td>
                <td className="py-2 pr-4">Deployed to CDN edge nodes automatically</td>
              </tr>
              {/* Latency characteristics */}
              <tr className="border-b border-[var(--color-border)]/50">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]">Latency</td>
                <td className="py-2 pr-4">Low (same process for Server Components)</td>
                <td className="py-2 pr-4">Medium (network hop to external server)</td>
                <td className="py-2 pr-4">Very low (processed near the user)</td>
              </tr>
              {/* Runtime environment */}
              <tr className="border-b border-[var(--color-border)]/50">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]">Runtime</td>
                <td className="py-2 pr-4">Full Node.js</td>
                <td className="py-2 pr-4">Full Node.js (or any server language)</td>
                <td className="py-2 pr-4">V8 isolate (limited APIs)</td>
              </tr>
              {/* Scaling strategy */}
              <tr className="border-b border-[var(--color-border)]/50">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]">Scaling</td>
                <td className="py-2 pr-4">Scales with your Next.js app</td>
                <td className="py-2 pr-4">Scales independently</td>
                <td className="py-2 pr-4">Auto-scales globally at each edge node</td>
              </tr>
              {/* Data source access */}
              <tr className="border-b border-[var(--color-border)]/50">
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]">Data Sources</td>
                <td className="py-2 pr-4">Direct DB, files, APIs — anything Node.js can do</td>
                <td className="py-2 pr-4">Any data source the external server supports</td>
                <td className="py-2 pr-4">HTTP APIs only (no TCP connections)</td>
              </tr>
              {/* Ideal use case */}
              <tr>
                <td className="py-2 pr-4 font-medium text-[var(--color-text-muted)]">Best For</td>
                <td className="py-2 pr-4">Small-medium apps, learning, prototypes</td>
                <td className="py-2 pr-4">Large apps, multi-team, shared API layer</td>
                <td className="py-2 pr-4">Global apps needing ultra-low latency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 6: Practice Exercises                                       */}
      {/* Graduated difficulty: beginner, intermediate, advanced.              */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Practice Exercises
        </h2>

        <div className="space-y-4">
          {/* Beginner exercise */}
          <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
            <h3 className="text-green-400 font-semibold text-sm mb-2">
              Beginner: Explore the API Route
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Open <code className="text-green-400">/api/graphql</code> in your browser to see
              the GraphiQL playground. Try writing a simple query to fetch all posts. Notice
              how the URL is part of your Next.js app — no external server needed.
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
              <li>1. Navigate to <code className="text-green-400">http://localhost:3000/api/graphql</code></li>
              <li>2. Write a query: <code className="text-green-400">{`{ posts { id title } }`}</code></li>
              <li>3. Click the play button and examine the JSON response</li>
              <li>4. Try adding more fields to see how GraphQL returns only what you ask for</li>
            </ul>
          </div>

          {/* Intermediate exercise */}
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
            <h3 className="text-orange-400 font-semibold text-sm mb-2">
              Intermediate: Create a Parallel Integration
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Create a second GraphQL endpoint at <code className="text-orange-400">app/api/graphql-v2/route.ts</code> with
              a different schema. This simulates having multiple GraphQL services in one app.
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
              <li>1. Create a new Route Handler at <code className="text-orange-400">app/api/graphql-v2/route.ts</code></li>
              <li>2. Define a schema with a different type (e.g., <code className="text-orange-400">Book</code> with title and author)</li>
              <li>3. Add a resolver that returns hardcoded book data</li>
              <li>4. Test it at <code className="text-orange-400">http://localhost:3000/api/graphql-v2</code></li>
            </ul>
          </div>

          {/* Advanced exercise */}
          <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
            <h3 className="text-purple-400 font-semibold text-sm mb-2">
              Advanced: Edge Runtime GraphQL
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Create an Edge-compatible GraphQL endpoint. The key constraint is that you cannot
              use any Node.js-specific APIs — only Web Platform APIs (fetch, Request, Response).
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
              <li>1. Create <code className="text-purple-400">app/api/graphql-edge/route.ts</code></li>
              <li>2. Add <code className="text-purple-400">export const runtime = &quot;edge&quot;</code> at the top</li>
              <li>3. Define a simple schema with a resolver that calls an external HTTP API</li>
              <li>4. Deploy to Vercel and compare cold start times vs. the Node.js version</li>
              <li>5. Try importing a Node.js-only library to see how Next.js reports the error</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 7: Key Takeaways                                            */}
      {/* Summary of the most important points from this page.                */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            {/* Takeaway 1: GraphQL is flexible about where it runs */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">1.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">GraphQL is runtime-agnostic</strong> — it
                can run inside Next.js API Routes, on a separate server, or on the Edge. The query language
                and execution model are the same everywhere.
              </span>
            </li>
            {/* Takeaway 2: API Routes are simplest for learning */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">2.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">API Routes are the simplest starting point</strong> — single
                deployment, shared config, and Server Components can even call resolvers directly without
                an HTTP round-trip.
              </span>
            </li>
            {/* Takeaway 3: External servers for scale */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">3.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">External GraphQL servers shine at scale</strong> — when
                multiple frontends share the same API, or when the GraphQL layer needs to scale
                independently from the frontend.
              </span>
            </li>
            {/* Takeaway 4: Edge for global latency */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">4.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Edge Runtime trades capabilities for speed</strong> — no
                Node.js APIs or direct database connections, but near-instant responses from the
                closest edge node. Best for read-heavy, globally distributed apps.
              </span>
            </li>
            {/* Takeaway 5: You can mix approaches */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">5.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">You can mix and match</strong> — a real-world app
                might use an API Route for mutations (full Node.js), an Edge function for simple reads,
                and an external service for complex analytics queries.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
