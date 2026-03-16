// CLIENT-SIDE GRAPHQL FETCHING PAGE - SERVER COMPONENT
// =====================================================
// This page explains how to fetch GraphQL data from Client Components
// in Next.js. While Server Components can fetch at build/request time,
// Client Components fetch data in the browser after the page loads.
//
// KEY CONCEPTS COVERED:
// 1. Using plain fetch() in Client Components to send GraphQL queries
// 2. Popular GraphQL client libraries (Apollo Client, urql)
// 3. The tradeoffs between server-side and client-side GraphQL fetching
// 4. When to choose client-side fetching over server-side
//
// THIS PAGE IS A SERVER COMPONENT because it only renders static content.
// The interactive demo (ClientGraphQLDemo) is imported as a Client Component.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import ClientGraphQLDemo from "./ClientGraphQLDemo";

export default function ClientFetchingPage() {
  return (
    <ConceptPage
      title="Client-Side GraphQL Fetching"
      description="Learn how to fetch GraphQL data directly from the browser using Client Components. Understand when client-side fetching is the right choice and how libraries like Apollo Client and urql add caching and state management."
      serverOrClient="both"
    >
      {/* ================================================================== */}
      {/* Section 1: Layman Explanation                                       */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Layman Explanation
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Imagine you&apos;re a customer at a restaurant. With <strong>server-side fetching</strong>,
            the waiter (server) goes to the kitchen, grabs your food, and brings you a complete
            plate before you even sit down. With <strong>client-side fetching</strong>, you sit
            down first (the page loads), and then <em>you</em> personally call the kitchen to place
            your order and wait for it to arrive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Server-side analogy card */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold text-sm mb-2">Server-Side Fetching</h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                The waiter brings you a ready-made plate. You get your food immediately when
                you sit down, but you can&apos;t change your order once it&apos;s served.
              </p>
            </div>
            {/* Client-side analogy card */}
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold text-sm mb-2">Client-Side Fetching</h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                You call the kitchen yourself after sitting down. You see the menu first
                (the page), then order what you want, and can re-order anytime. But there&apos;s
                a wait while your food is being prepared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 2: Developer Explanation                                     */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Developer Explanation
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Client-side GraphQL fetching happens in <code className="text-blue-400">&quot;use client&quot;</code> components.
            The browser sends an HTTP POST request to the GraphQL endpoint with the query string
            in the request body. This is the same pattern as REST API calls, but with a single
            endpoint and a structured query language.
          </p>

          {/* Architecture overview */}
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Architecture & Request Flow
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)] mb-4">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">1.</span>
              <span>
                The Client Component mounts in the browser and triggers a <code className="text-green-400">fetch()</code> call
                (or a library hook like <code className="text-green-400">useQuery</code>).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">2.</span>
              <span>
                The browser sends an HTTP POST to <code className="text-green-400">/api/graphql</code> with
                the query string and any variables in the JSON body.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">3.</span>
              <span>
                The GraphQL server parses the query, validates it against the schema, executes
                resolvers, and returns a JSON response.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">4.</span>
              <span>
                The Client Component receives the data, updates state, and re-renders.
                During the fetch, a loading state is shown to the user.
              </span>
            </li>
          </ul>

          {/* When to use client-side fetching */}
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            When to Use Client-Side Fetching
          </h3>
          <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400">&#10003;</span>
              <span>Data that changes based on user interaction (search, filters, pagination)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">&#10003;</span>
              <span>Real-time or frequently updating data (dashboards, feeds)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">&#10003;</span>
              <span>User-specific data that requires authentication tokens from the browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">&#10003;</span>
              <span>Infinite scroll or load-more patterns where data is fetched incrementally</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">&#10007;</span>
              <span>SEO-critical content (use server-side fetching instead)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">&#10007;</span>
              <span>Data needed for initial page render (causes loading flicker)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 3: Code Examples                                             */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>
        <div className="space-y-4">
          {/* Plain fetch example */}
          <CodeBlock
            filename="app/components/UserList.tsx (plain fetch)"
            language="tsx"
            code={`"use client";
// CLIENT COMPONENT: Fetches GraphQL data using plain fetch()
// This is the simplest approach - no extra libraries needed.

import { useState, useEffect } from "react";

// The GraphQL query string. Clients specify exactly which fields they want.
const USERS_QUERY = \`
  query GetUsers {
    users {
      id
      name
      email
      posts {
        title
      }
    }
  }
\`;

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Send the GraphQL query as an HTTP POST request.
    // ALL GraphQL queries go to the SAME endpoint - unlike REST
    // where each resource has its own URL.
    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: USERS_QUERY }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errors) {
          setError(result.errors[0].message);
        } else {
          setUsers(result.data.users);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;
  return <ul>{users.map((u: any) => <li key={u.id}>{u.name}</li>)}</ul>;
}`}
            highlights={[1, 2, 30, 31, 32, 33]}
          />

          {/* Apollo Client example */}
          <CodeBlock
            filename="app/components/UserList.tsx (Apollo Client)"
            language="tsx"
            code={`"use client";
// CLIENT COMPONENT: Using Apollo Client for GraphQL
// Apollo provides a normalized cache, automatic refetching,
// optimistic updates, and more.

import { useQuery, gql } from "@apollo/client";

// Apollo uses the gql tagged template literal to parse queries
// at build time for better error checking and tooling support.
const USERS_QUERY = gql\`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
\`;

export default function UserList() {
  // useQuery handles loading, error, and data states automatically.
  // It also caches the result - subsequent renders with the same
  // query return cached data instantly (no network request).
  const { data, loading, error, refetch } = useQuery(USERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <ul>
        {data.users.map((user: any) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

// APOLLO'S NORMALIZED CACHE:
// Apollo stores each entity by its __typename and id.
// If you fetch User:1 in one query, and another query also
// returns User:1, Apollo deduplicates them automatically.
// Update User:1 anywhere → all components showing User:1 update.`}
            highlights={[1, 6, 25]}
          />

          {/* urql example */}
          <CodeBlock
            filename="app/components/UserList.tsx (urql)"
            language="tsx"
            code={`"use client";
// CLIENT COMPONENT: Using urql for GraphQL
// urql is a lightweight alternative to Apollo with a plugin-based
// architecture. It's smaller in bundle size but equally capable.

import { useQuery } from "urql";

const USERS_QUERY = \`
  query GetUsers {
    users { id name email }
  }
\`;

export default function UserList() {
  // urql's useQuery returns a tuple: [result, reexecuteQuery]
  // result has: data, fetching, error, stale
  const [result, reexecute] = useQuery({ query: USERS_QUERY });

  if (result.fetching) return <p>Loading...</p>;
  if (result.error) return <p>Error: {result.error.message}</p>;

  return (
    <div>
      <button onClick={() => reexecute({ requestPolicy: "network-only" })}>
        Refresh
      </button>
      <ul>
        {result.data.users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

// URQL EXCHANGES (plugins):
// - fetchExchange: makes actual HTTP requests
// - cacheExchange: document-based caching
// - @urql/exchange-graphcache: normalized caching (like Apollo)
// - retryExchange: automatic retry on failure`}
            highlights={[1, 6, 17]}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 4: Live Demo                                                 */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Client-Side GraphQL Fetcher
        </h2>
        {/* ClientGraphQLDemo is a "use client" component that uses useState,
            useEffect, onClick handlers, and fetch() - all browser-only features.
            It demonstrates real GraphQL queries against our /api/graphql endpoint. */}
        <ClientGraphQLDemo />
      </section>

      {/* ================================================================== */}
      {/* Section 5: Server vs Client Fetching Comparison Table               */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Server vs Client Fetching
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                <th className="text-left p-3 text-green-400">Server Fetching</th>
                <th className="text-left p-3 text-blue-400">Client Fetching</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">When data loads</td>
                <td className="p-3">Before HTML is sent to browser</td>
                <td className="p-3">After page renders in browser</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">SEO</td>
                <td className="p-3">Excellent (data in initial HTML)</td>
                <td className="p-3">Poor (empty until JS runs)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Loading state</td>
                <td className="p-3">No loading spinner needed</td>
                <td className="p-3">Must show loading UI</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Interactivity</td>
                <td className="p-3">Static until hydrated</td>
                <td className="p-3">Can refetch, filter, paginate</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">User-specific data</td>
                <td className="p-3">Requires cookies/headers forwarding</td>
                <td className="p-3">Auth tokens sent automatically</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Bundle size</td>
                <td className="p-3">Zero client JS for data fetching</td>
                <td className="p-3">Includes fetch logic in bundle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 6: Flow Diagram                                              */}
      {/* ================================================================== */}
      <section>
        <FlowDiagram
          title="Client-Side GraphQL Fetch Flow"
          steps={[
            {
              label: "Browser (Client Component)",
              description: "Component mounts, triggers fetch()",
              type: "client",
            },
            {
              label: "HTTP POST Request",
              description: "{ query: '...', variables: {...} }",
              type: "network",
            },
            {
              label: "GraphQL Server",
              description: "Parses query, executes resolvers",
              type: "server",
            },
            {
              label: "JSON Response",
              description: "{ data: {...} } sent back over HTTP",
              type: "network",
            },
            {
              label: "Update UI",
              description: "setState() triggers re-render with data",
              type: "client",
            },
          ]}
        />
      </section>

      {/* ================================================================== */}
      {/* Section 7: Key Takeaways                                             */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="space-y-3">
          {/* Each takeaway is a card with a colored left border for visual hierarchy */}
          {[
            {
              title: "Plain fetch() works perfectly for GraphQL",
              description:
                "You don't need a library to use GraphQL. A simple POST request with the query string in the body is enough. Libraries add caching and convenience, not necessity.",
            },
            {
              title: "Apollo and urql add normalized caching",
              description:
                "These libraries cache entities by ID, so fetching the same user in two different queries reuses the cached version. This reduces network requests and keeps the UI consistent.",
            },
            {
              title: "Client fetching shows loading states",
              description:
                "Unlike server fetching where data is ready before the page loads, client fetching always shows a loading state first. Design your UI with skeletons or spinners for a good user experience.",
            },
            {
              title: "Use client fetching for interactive data",
              description:
                "Search, filters, pagination, real-time updates, and user-triggered actions are best handled by client-side fetching. Use server-side fetching for initial page content and SEO-critical data.",
            },
          ].map((takeaway) => (
            <div
              key={takeaway.title}
              className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)] border-l-4 border-l-blue-500"
            >
              <p className="text-[var(--color-text-primary)] font-semibold text-sm">
                {takeaway.title}
              </p>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                {takeaway.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </ConceptPage>
  );
}
