// SERVER GRAPHQL DEMO - ASYNC SERVER COMPONENT
// =============================================
// This component is an ASYNC SERVER COMPONENT — it runs entirely on the
// Node.js server. There is NO "use client" directive because this component
// does NOT need any browser APIs, event handlers, or React hooks.
//
// HOW IT WORKS:
// 1. When a user navigates to the server-fetching page, Next.js renders
//    this component on the server during the request.
// 2. The `await fetch()` call runs in Node.js — the browser never sees it.
// 3. The GraphQL query is sent to our API Route (/api/graphql) which is
//    running in the SAME Next.js server process.
// 4. The response data is used to render HTML on the server.
// 5. The browser receives fully rendered HTML — no loading spinners needed.
//
// WHY SERVER COMPONENT?
// - Data fetching happens BEFORE the HTML is sent to the browser
// - Sensitive API keys or internal URLs are never exposed to the client
// - No JavaScript is shipped to the browser for this component
// - No useEffect, no useState, no loading states — just async/await
//
// RENDERING LIFECYCLE:
// 1. Next.js calls this function on the server
// 2. The function `await`s the fetch — the server pauses rendering here
// 3. Once data arrives, the function continues and returns JSX
// 4. React converts the JSX to HTML
// 5. Next.js streams the HTML to the browser
// 6. The browser displays the fully-rendered post list immediately
//
// COMPARISON WITH CLIENT COMPONENTS:
// - Client Component: page loads -> JS downloads -> fetch fires -> loading spinner -> data renders
// - Server Component: server fetches data -> HTML renders -> page loads with data already visible

export default async function ServerGraphQLDemo() {
  // -------------------------------------------------------------------
  // This entire function body executes on the Node.js server.
  // Variables, fetch calls, and data processing here are INVISIBLE
  // to the browser — they never appear in the client JavaScript bundle.
  // -------------------------------------------------------------------

  // The GraphQL query string — asks for posts with their id, title,
  // content, and each author's name. This is the SAME query syntax
  // whether called from server or client — GraphQL doesn't change.
  const query = `{
    posts {
      id
      title
      content
      author {
        name
      }
    }
  }`;

  // Wrap in try/catch because this is a server-side fetch that could fail
  // (e.g., if the GraphQL API route isn't running or has an error)
  try {
    // This fetch runs on the server (Node.js), NOT in the browser.
    // We use the absolute URL because server-side fetch doesn't have
    // a browser origin to resolve relative URLs against.
    const res = await fetch("http://localhost:3000/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you had auth tokens, they'd be safe here — never sent to browser
      },
      body: JSON.stringify({ query }),
      // cache: "no-store" means fetch fresh data on every request.
      // Other options:
      //   cache: "force-cache" — cache indefinitely (static)
      //   next: { revalidate: 60 } — cache for 60 seconds (ISR)
      cache: "no-store",
    });

    // Parse the JSON response from the GraphQL server
    const json = await res.json();

    // GraphQL always returns { data: ..., errors: ... }
    // Even if there are errors, data may be partially populated
    const { data, errors } = json;

    // If GraphQL returned errors, show them to help with debugging
    if (errors) {
      return (
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
          <h3 className="text-red-400 font-semibold mb-2">GraphQL Errors</h3>
          <pre className="text-sm text-red-300 overflow-x-auto">
            {JSON.stringify(errors, null, 2)}
          </pre>
        </div>
      );
    }

    // Extract the posts array from the GraphQL response
    const posts = data?.posts ?? [];

    // Render the posts — this HTML is generated on the server
    // and sent to the browser as a complete, rendered block.
    // No loading spinner, no skeleton UI — data is already here.
    return (
      <div className="space-y-4">
        {/* Header showing this was server-rendered */}
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
          <p className="text-green-400 text-sm font-medium">
            Server-Rendered at {new Date().toLocaleTimeString()}
          </p>
          <p className="text-[var(--color-text-muted)] text-xs mt-1">
            This data was fetched on the server. No JavaScript was needed in the browser
            to load these posts. View the page source to confirm — the HTML is already complete.
          </p>
        </div>

        {/* Render each post as a card */}
        {posts.length > 0 ? (
          <div className="grid gap-3">
            {posts.map((post: { id: string; title: string; content: string; author: { name: string } }) => (
              <div
                key={post.id}
                className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]"
              >
                {/* Post title */}
                <h3 className="text-[var(--color-text-primary)] font-semibold mb-1">
                  {post.title}
                </h3>
                {/* Author name */}
                <p className="text-blue-400 text-xs mb-2">
                  by {post.author.name}
                </p>
                {/* Post content — truncated to keep the demo compact */}
                <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          // Empty state — no posts found
          <div className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]">
            <p className="text-[var(--color-text-muted)] text-sm">
              No posts found. Make sure the GraphQL API route is running and has data.
            </p>
          </div>
        )}

        {/* Debug info — shows the raw query that was executed */}
        <details className="text-xs text-[var(--color-text-muted)]">
          <summary className="cursor-pointer hover:text-[var(--color-text-secondary)]">
            View GraphQL Query
          </summary>
          <pre className="mt-2 bg-[var(--color-bg-card)] rounded p-3 border border-[var(--color-border)] overflow-x-auto">
            {query}
          </pre>
        </details>
      </div>
    );
  } catch (error) {
    // If the fetch fails entirely (network error, server down, etc.)
    // This error boundary catches it and shows a helpful message
    return (
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
        <h3 className="text-red-400 font-semibold mb-2">
          Failed to Fetch GraphQL Data
        </h3>
        <p className="text-[var(--color-text-secondary)] text-sm mb-2">
          The server-side fetch to <code className="text-red-300">/api/graphql</code> failed.
          This usually means the development server is starting up or the API route has an error.
        </p>
        <pre className="text-xs text-red-300 overflow-x-auto">
          {error instanceof Error ? error.message : "Unknown error"}
        </pre>
      </div>
    );
  }
}
