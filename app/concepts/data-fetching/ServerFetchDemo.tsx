// SERVER COMPONENT - Server-Side Fetch Demo
// ==========================================
// This is a SERVER COMPONENT (no "use client" directive).
// It demonstrates the recommended Next.js pattern: fetching data directly
// inside an async Server Component.
//
// WHY THIS IS A SERVER COMPONENT:
// - It needs to fetch data on the server before sending HTML to the browser.
// - It uses async/await at the component level (only Server Components can be async).
// - No interactivity is required (no useState, useEffect, onClick).
// - The fetch happens on the server, so the browser receives pre-rendered HTML
//   with the data already embedded. No loading spinner needed.
//
// WHAT RUNS ON THE SERVER:
// - The entire component function, including the fetch call
// - JSON parsing and data transformation
// - JSX rendering to HTML
//
// WHAT THE BROWSER RECEIVES:
// - Pure HTML with the blog post data already rendered
// - Zero JavaScript for this component
// - No fetch call happens in the browser
//
// RENDERING LIFECYCLE:
// 1. Next.js server receives a request for /concepts/data-fetching
// 2. The parent page.tsx (also a Server Component) renders and includes this component
// 3. This component's async function executes on the server
// 4. The fetch() call runs on the server (server-to-server, no CORS)
// 5. The awaited JSON data is used to render JSX to HTML
// 6. The HTML is streamed to the browser as part of the full page
// 7. The browser paints the HTML immediately - no JavaScript execution needed
//
// PERFORMANCE BENEFITS:
// - No client-side JavaScript bundle for this component
// - No loading state / spinner visible to the user (data is ready in the HTML)
// - Server-to-server fetch is faster (no public internet round-trip)
// - Fetch results can be automatically cached by Next.js

// TypeScript interface matching the shape returned by /api/posts
interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

interface PostsResponse {
  posts: Post[];
  fetchedAt: string;
  source: string;
}

// -----------------------------------------------------------------------
// fetchPosts - runs on the SERVER
// -----------------------------------------------------------------------
// This function is defined in a Server Component file, so it executes
// on the server. It will never appear in the client-side JS bundle.
//
// NOTE: We use an absolute URL here because server-side fetch in Next.js
// does not have access to the browser's origin. In production, you would
// typically call the database directly instead of going through an API route.
// We use the API route here for demonstration purposes.
async function fetchPosts(): Promise<PostsResponse> {
  // This fetch runs on the NODE.JS SERVER, not in the browser.
  // - No CORS restrictions (server-to-server)
  // - Can include secret API keys safely via process.env
  // - Response is NOT visible in browser DevTools Network tab
  //
  // The { cache: "no-store" } option tells Next.js to always fetch fresh data
  // (equivalent to getServerSideProps in the Pages Router).
  // Other options:
  //   - { cache: "force-cache" } : cache indefinitely (like getStaticProps)
  //   - { next: { revalidate: 60 } } : revalidate every 60 seconds (ISR)
  const response = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  return response.json();
}

// -----------------------------------------------------------------------
// ServerFetchDemo - async Server Component
// -----------------------------------------------------------------------
// NOTE: This component is async! Only Server Components can be async.
// Client Components cannot be async because they need to render
// synchronously in the browser during hydration.
export default async function ServerFetchDemo() {
  // Record the start time to show how long the fetch takes
  const startTime = Date.now();

  // AWAIT directly in the component body.
  // This is the key difference from Client Components:
  // - Server Component: await here, data is ready before HTML is sent
  // - Client Component: must use useEffect + useState, shows loading first
  const data = await fetchPosts();

  const fetchDuration = Date.now() - startTime;

  return (
    <div className="space-y-4">
      {/* Fetch metadata */}
      <div className="bg-[var(--color-bg-primary)] rounded p-3 space-y-1 text-xs">
        <p className="text-[var(--color-text-muted)]">
          Data source:{" "}
          <span className="text-green-400">{data.source}</span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Fetched at:{" "}
          <span className="text-green-400">{data.fetchedAt}</span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Fetch duration:{" "}
          <span className="text-green-400">{fetchDuration}ms</span>
          <span className="text-[var(--color-text-muted)] ml-1">
            (server-to-server)
          </span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Rendered on:{" "}
          <span className="text-green-400">Server (Node.js {process.version})</span>
        </p>
      </div>

      {/* Blog post cards */}
      <div className="space-y-3">
        {data.posts.map((post) => (
          <div
            key={post.id}
            className="bg-[var(--color-bg-primary)] rounded-lg p-4 border border-green-500/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
            {/* Tags */}
            <div className="flex gap-1.5 mt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Explanation note */}
      <p className="text-xs text-[var(--color-text-muted)] italic">
        This data was fetched on the server. The HTML you see was pre-rendered
        with the data already embedded. No loading spinner was needed because the
        server waited for the data before sending the response. Check your
        browser DevTools Network tab - you will NOT see a /api/posts request.
      </p>
    </div>
  );
}
