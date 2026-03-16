// SERVER-SIDE GRAPHQL FETCHING - SERVER COMPONENT
// ================================================
// This page demonstrates how to fetch GraphQL data from Server Components
// using async/await. Server Components can fetch data BEFORE the HTML is
// sent to the browser — no loading spinners, no client-side JavaScript.
//
// KEY CONCEPTS COVERED:
// 1. Why server-side GraphQL fetching is the default choice in Next.js
// 2. How async Server Components fetch data with plain fetch()
// 3. Next.js caching options for GraphQL responses (no-store, revalidate, force-cache)
// 4. The lifecycle of a server-side GraphQL request
//
// RENDERING STRATEGY: SERVER COMPONENT
// - No "use client" directive = React Server Component
// - This page and its child (ServerGraphQLDemo) both run on the server
// - The entire page, including fetched data, is rendered to HTML on the server
// - Zero client JavaScript for this page (except CodeBlock's copy button)
//
// RENDERING LIFECYCLE:
// 1. User navigates to /concepts/graphql/server-fetching
// 2. Next.js App Router matches this page.tsx
// 3. This component renders on the server
// 4. ServerGraphQLDemo (also a Server Component) runs its fetch() on the server
// 5. Both components produce HTML, which is streamed to the browser
// 6. The browser displays the complete page with data already loaded
//
// WHY SERVER COMPONENT FOR THIS PAGE?
// - The page content is purely informational (text, code, diagrams)
// - The live demo (ServerGraphQLDemo) is also a Server Component
// - No interactivity is needed — no useState, no onClick, no forms
// - Server rendering = data is pre-fetched, page loads instantly with content

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import ServerGraphQLDemo from "./ServerGraphQLDemo";

export default function ServerFetchingPage() {
  // ---------------------------------------------------------------
  // This function body runs ONLY on the Node.js server.
  // The JSX below is converted to HTML and streamed to the browser.
  // ServerGraphQLDemo is also a Server Component — its async fetch
  // runs during this server rendering pass.
  // ---------------------------------------------------------------

  return (
    <ConceptPage
      title="Server-Side GraphQL Fetching"
      description="Learn how to fetch GraphQL data from Server Components using async/await. Server-side fetching is the default and recommended approach in Next.js — data arrives before the page loads, with no client JavaScript needed."
      serverOrClient="server"
    >
      {/* ================================================================== */}
      {/* Section 1: Layman Explanation                                       */}
      {/* A non-technical analogy to make the concept approachable.           */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Layman Explanation: The Chef Prepares Before Serving
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          {/*
            Analogy: Server-side fetching is like a chef preparing food
            in the kitchen before the plate ever reaches the table.
            The diner receives a complete, ready-to-eat meal.
          */}
          <p className="text-[var(--color-text-secondary)] mb-4">
            Imagine visiting a restaurant where the chef <strong className="text-[var(--color-text-primary)]">prepares
            your entire meal in the kitchen</strong> before the waiter brings it to your table.
            You sit down, and your food is already ready — no waiting, no watching the chef cook.
            That&apos;s server-side GraphQL fetching.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Server-side: chef prepares in the kitchen */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold text-sm mb-2">
                Server-Side (Chef Cooks First)
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                The kitchen (server) gets your order, prepares the food (fetches data),
                plates it (renders HTML), and then the waiter brings you a complete meal
                (the finished page). You never see the cooking process.
              </p>
            </div>

            {/* Client-side comparison: you cook at the table */}
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold text-sm mb-2">
                Client-Side (Cook at Your Table)
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm">
                With client-side fetching, the waiter brings you raw ingredients (empty page
                + JavaScript), and you cook at your table (browser fetches data). You see a
                loading spinner while you wait for the food to be ready.
              </p>
            </div>
          </div>

          {/* Key insight */}
          <div className="mt-4 bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold text-sm mb-2">Why This Matters</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">
              In Next.js, Server Components are the default. Your data is ready <em>before</em> the
              page reaches the browser. This means faster page loads, better SEO (search engines see
              the full content), and less JavaScript for the user&apos;s device to process.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 2: Developer Explanation                                     */}
      {/* Technical details of server-side GraphQL fetching in Next.js.       */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Developer Explanation
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            In Next.js App Router, every component is a Server Component by default. Server
            Components can be <code className="text-blue-400">async</code> functions, which means
            you can <code className="text-blue-400">await</code> data fetching directly in the
            component body — no <code className="text-blue-400">useEffect</code>, no loading state
            management, no client-side data fetching libraries.
          </p>

          {/* Why server-side is ideal */}
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Why Server-Side GraphQL is Ideal in Next.js
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-secondary)] mb-4">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">1.</span>
              <span>
                <strong>No client JavaScript</strong> — The fetch and data processing happen on the
                server. Zero bytes of fetching code are sent to the browser.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">2.</span>
              <span>
                <strong>Secure by default</strong> — API keys, database URLs, and auth tokens stay
                on the server. They never appear in the client bundle.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">3.</span>
              <span>
                <strong>SEO-friendly</strong> — Search engine crawlers receive fully-rendered HTML
                with all data visible. No JavaScript execution needed.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">4.</span>
              <span>
                <strong>Automatic caching</strong> — Next.js extends <code className="text-green-400">fetch()</code> with
                caching options: <code className="text-green-400">force-cache</code> (static), <code className="text-green-400">revalidate</code> (ISR),
                or <code className="text-green-400">no-store</code> (always fresh).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">5.</span>
              <span>
                <strong>Simpler code</strong> — No useState, no useEffect, no loading/error state
                management. Just <code className="text-green-400">async/await</code> and render.
              </span>
            </li>
          </ul>

          {/* When NOT to use server-side fetching */}
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            When to Use Client-Side Instead
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Server-side fetching is great for initial page data, but you still need client-side
            fetching for: real-time updates (subscriptions), user-triggered data loading (search,
            infinite scroll), and data that changes based on client-side state (filters, sorting).
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 3: Live Demo                                                */}
      {/* ServerGraphQLDemo is an async Server Component that fetches data.   */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Server-Fetched Posts
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] text-sm mb-4">
            The posts below were fetched from our GraphQL API <strong>on the server</strong> before
            this page was sent to your browser. View the page source (Ctrl+U) to confirm — the
            post data is already in the HTML. No JavaScript was needed to load this data.
          </p>

          {/*
            ServerGraphQLDemo is an ASYNC Server Component.
            It awaits a fetch() call to /api/graphql during server rendering.
            By the time the browser receives the page, the data is already
            rendered into HTML — no loading spinner, no hydration needed.
          */}
          <ServerGraphQLDemo />
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 4: Code Examples                                            */}
      {/* Shows server fetch patterns with different caching strategies.       */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>

        {/* Basic server-side fetch */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Basic Server-Side GraphQL Fetch
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">
            The simplest pattern: an async Server Component that fetches GraphQL data
            and renders it directly. This is the pattern used in the live demo above.
          </p>
          <CodeBlock
            filename="app/posts/page.tsx"
            language="typescript"
            highlights={[1, 2, 3, 11, 12, 13, 24]}
            code={`// SERVER COMPONENT — no "use client" directive
// This entire file runs on the Node.js server
// The browser receives only the rendered HTML

export default async function PostsPage() {
  // Define the GraphQL query
  const query = \`{
    posts { id title content author { name } }
  }\`;

  // This fetch() runs on the SERVER (Node.js)
  // The browser never sees this network request
  // API keys and internal URLs stay server-side
  const res = await fetch("http://localhost:3000/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store", // Always fetch fresh data
  });

  const { data } = await res.json();

  // This JSX is rendered to HTML on the server
  // The browser receives the finished HTML
  return (
    <ul>
      {data.posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`}
          />
        </div>

        {/* Caching strategies */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Caching Strategies for GraphQL Fetches
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">
            Next.js extends the native <code className="text-blue-400">fetch()</code> API with
            caching options. This is critical for GraphQL because it determines how often
            your data refreshes.
          </p>
          <CodeBlock
            filename="Caching Options"
            language="typescript"
            highlights={[2, 3, 10, 11, 18, 19]}
            code={`// Strategy 1: ALWAYS FRESH (Dynamic)
// Every request fetches new data from GraphQL
// Use for: user-specific data, real-time dashboards
const res1 = await fetch(GRAPHQL_URL, {
  method: "POST",
  body: JSON.stringify({ query }),
  cache: "no-store",
});

// Strategy 2: REVALIDATE (ISR - Incremental Static Regeneration)
// Cache for 60 seconds, then fetch fresh data in the background
// Use for: blog posts, product listings, semi-static content
const res2 = await fetch(GRAPHQL_URL, {
  method: "POST",
  body: JSON.stringify({ query }),
  next: { revalidate: 60 },
});

// Strategy 3: STATIC (Full Cache)
// Cache indefinitely until a manual revalidation or redeploy
// Use for: configuration data, rarely-changing content
const res3 = await fetch(GRAPHQL_URL, {
  method: "POST",
  body: JSON.stringify({ query }),
  cache: "force-cache",
});`}
          />
        </div>

        {/* Error handling pattern */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Error Handling Pattern
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">
            Server-side fetches can fail. Unlike client components where you can show a
            retry button, server errors need graceful fallbacks or error boundaries.
          </p>
          <CodeBlock
            filename="app/posts/page.tsx"
            language="typescript"
            highlights={[3, 4, 17, 18, 23, 24]}
            code={`export default async function PostsPage() {
  try {
    // Server-side fetch — runs in Node.js
    // If this fails, the catch block handles it
    const res = await fetch("http://localhost:3000/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: \`{ posts { id title } }\`,
      }),
    });

    if (!res.ok) {
      throw new Error(\`GraphQL request failed: \${res.status}\`);
    }

    // GraphQL can return partial data + errors
    // Always check for the errors field
    const { data, errors } = await res.json();

    if (errors) {
      console.error("GraphQL errors:", errors);
      // You could render a partial UI here with whatever
      // data was returned alongside the errors
    }

    return <PostList posts={data?.posts ?? []} />;
  } catch (error) {
    // Render a fallback UI instead of crashing the page
    return <ErrorFallback error={error} />;
  }
}`}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* Section 5: Flow Diagram                                             */}
      {/* Shows the lifecycle of a server-side GraphQL fetch.                 */}
      {/* ================================================================== */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Server-Side GraphQL Fetch Lifecycle
        </h2>
        <FlowDiagram
          title="How Server Components Fetch GraphQL Data"
          steps={[
            {
              label: "User Navigates",
              description: "Browser requests /posts — the URL hits Next.js App Router",
              type: "client",
            },
            {
              label: "Server Component Executes",
              description: "Next.js runs the async PostsPage() function on Node.js",
              type: "server",
            },
            {
              label: "fetch() to GraphQL API",
              description: "Server-side HTTP POST to /api/graphql with the query string",
              type: "network",
            },
            {
              label: "GraphQL Resolves",
              description: "GraphQL Yoga parses query, runs resolvers, fetches from database",
              type: "server",
            },
            {
              label: "Data Returns to Component",
              description: "JSON response is parsed — the component has access to data",
              type: "server",
            },
            {
              label: "HTML Rendered & Streamed",
              description: "JSX with data is rendered to HTML and streamed to the browser",
              type: "server",
            },
            {
              label: "Page Displays",
              description: "Browser shows complete page with data — no loading spinner needed",
              type: "client",
            },
          ]}
        />

        {/* Additional note about what the browser sees */}
        <div className="mt-4 bg-green-500/5 rounded-lg p-4 border border-green-500/20">
          <h3 className="text-green-400 font-semibold text-sm mb-2">
            What the Browser Sees
          </h3>
          <p className="text-[var(--color-text-secondary)] text-sm">
            The browser only participates in steps 1 (sending the URL) and 7 (displaying
            the result). Steps 2-6 happen entirely on the server. The browser never
            executes the fetch, never processes the GraphQL response, and never runs any
            JavaScript for this component. It simply receives and displays HTML.
          </p>
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
              Beginner: Modify the Server Fetch Query
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Open <code className="text-green-400">ServerGraphQLDemo.tsx</code> and change the
              GraphQL query to request different fields. See how the server-rendered output
              changes immediately without any client-side code changes.
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
              <li>1. Open <code className="text-green-400">ServerGraphQLDemo.tsx</code></li>
              <li>2. Remove <code className="text-green-400">content</code> from the query and add a new field</li>
              <li>3. Refresh the page — the server re-fetches with the new query</li>
              <li>4. View page source (Ctrl+U) to confirm the HTML contains the data</li>
            </ul>
          </div>

          {/* Intermediate exercise */}
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
            <h3 className="text-orange-400 font-semibold text-sm mb-2">
              Intermediate: Add Caching with Revalidation
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Change the <code className="text-orange-400">ServerGraphQLDemo</code> to use
              time-based revalidation instead of <code className="text-orange-400">no-store</code>.
              Observe how the timestamp in the demo stops changing for the cache duration.
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
              <li>1. Replace <code className="text-orange-400">cache: &quot;no-store&quot;</code> with <code className="text-orange-400">{`next: { revalidate: 10 }`}</code></li>
              <li>2. Refresh the page several times — notice the timestamp stays the same for 10 seconds</li>
              <li>3. After 10 seconds, the next refresh triggers a background revalidation</li>
              <li>4. The following refresh shows the new data (stale-while-revalidate pattern)</li>
            </ul>
          </div>

          {/* Advanced exercise */}
          <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
            <h3 className="text-purple-400 font-semibold text-sm mb-2">
              Advanced: Parallel Server Fetches with Suspense
            </h3>
            <p className="text-[var(--color-text-secondary)] text-sm mb-2">
              Create two separate async Server Components, each fetching different GraphQL
              queries. Wrap them in <code className="text-purple-400">&lt;Suspense&gt;</code> boundaries
              to enable parallel streaming.
            </p>
            <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
              <li>1. Create <code className="text-purple-400">PostsList.tsx</code> — async Server Component fetching posts</li>
              <li>2. Create <code className="text-purple-400">AuthorsList.tsx</code> — async Server Component fetching authors</li>
              <li>3. In <code className="text-purple-400">page.tsx</code>, wrap each in <code className="text-purple-400">&lt;Suspense fallback=&#123;...&#125;&gt;</code></li>
              <li>4. Add an artificial <code className="text-purple-400">await new Promise(r =&gt; setTimeout(r, 2000))</code> to one component</li>
              <li>5. Observe how the fast component renders first while the slow one shows its fallback</li>
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
            {/* Takeaway 1: Server Components are the default */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">1.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Server-side fetching is the default in Next.js</strong> —
                every component is a Server Component unless you add <code className="text-blue-400">&quot;use client&quot;</code>.
                Use async/await to fetch GraphQL data directly in the component body.
              </span>
            </li>
            {/* Takeaway 2: No client JavaScript needed */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">2.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Zero client JavaScript for data fetching</strong> — the
                fetch, query string, response parsing, and data processing all happen on the server. The
                browser only receives rendered HTML.
              </span>
            </li>
            {/* Takeaway 3: Caching is built in */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">3.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Next.js extends fetch() with built-in caching</strong> — use <code className="text-green-400">no-store</code> for
                always-fresh data, <code className="text-green-400">revalidate</code> for time-based
                refresh, or <code className="text-green-400">force-cache</code> for static data.
              </span>
            </li>
            {/* Takeaway 4: Secrets are safe */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">4.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Server-side fetching keeps secrets safe</strong> — API
                keys, database URLs, and authorization tokens used in server fetch calls never appear in
                the client-side JavaScript bundle.
              </span>
            </li>
            {/* Takeaway 5: Use Suspense for parallel fetching */}
            <li className="flex items-start gap-3">
              <span className="text-green-400 font-bold mt-0.5">5.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Combine with Suspense for parallel streaming</strong> — wrap
                multiple async Server Components in Suspense boundaries to stream data as it arrives. Fast
                data appears first while slower queries continue loading.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
