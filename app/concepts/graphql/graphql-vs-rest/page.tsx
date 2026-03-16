// GRAPHQL VS REST - SERVER COMPONENT
// ====================================
// This page compares GraphQL and REST APIs side by side.
// It is a Server Component (no "use client") because it contains only
// static educational content - no interactivity needed.
//
// WHY SERVER COMPONENT?
// - Pure comparison/educational content with no user interaction
// - No React hooks (useState, useEffect) needed
// - No onClick handlers or browser APIs
// - All content is statically renderable
//
// WHAT HAPPENS DURING A REQUEST:
// 1. User navigates to /concepts/graphql/graphql-vs-rest
// 2. Next.js server renders this component to HTML
// 3. ConceptPage and FlowDiagram are also Server Components - pure HTML output
// 4. CodeBlock is a Client Component (copy button), so its small JS bundle is included
// 5. The browser receives mostly HTML with minimal JS for the copy buttons
//
// GRAPHQL EXECUTION CONTEXT:
// This page explains the fundamental differences between REST and GraphQL
// architectures. REST uses multiple endpoints with fixed data structures,
// while GraphQL uses a single endpoint where the client specifies the
// exact shape of the data it needs.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function GraphQLvsRESTPage() {
  // This entire function runs on the server.
  // No async needed here since we have no data fetching - just static content.
  return (
    <ConceptPage
      title="GraphQL vs REST"
      description="Understand the key differences between GraphQL and REST APIs: how they handle data fetching, their endpoint structures, and when to use each approach."
      serverOrClient="server"
    >
      {/* ============================================================
          SECTION 1: LAYMAN EXPLANATION
          Restaurant analogy comparing fixed menus (REST) to
          build-your-own orders (GraphQL).
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Restaurant Menu Analogy
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Think of APIs like ordering food at a restaurant. REST and GraphQL represent
            two very different ordering experiences:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-2">REST = Fixed Menu</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                Each dish on the menu is a fixed endpoint. Want the &quot;User Profile Platter&quot;?
                You get name, email, avatar, settings, AND preferences - even if you only
                wanted the name. Want their posts too? That&apos;s a separate order from a different
                section of the menu.
              </p>
              <div className="text-xs text-[var(--color-text-muted)] space-y-1 font-mono">
                <p>GET /api/users/1 &rarr; Everything about the user</p>
                <p>GET /api/users/1/posts &rarr; All their posts</p>
                <p>GET /api/posts/5/comments &rarr; Comments on post</p>
              </div>
            </div>
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">GraphQL = Build Your Own</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                You walk up to one counter and write down exactly what you want:
                &quot;I&apos;d like the user&apos;s name, their last 3 posts with titles, and the first
                comment on each post.&quot; You get exactly that, in one trip.
              </p>
              <div className="text-xs text-[var(--color-text-muted)] space-y-1 font-mono">
                <p>POST /graphql &rarr; Your custom query</p>
                <p>&nbsp;&nbsp;user, posts, comments</p>
                <p>&nbsp;&nbsp;all in ONE request</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: DEVELOPER EXPLANATION - THE THREE BIG PROBLEMS
          Explains overfetching, underfetching, and multiple round trips
          which are the core pain points REST has that GraphQL solves.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Three Problems GraphQL Solves
        </h2>
        <div className="space-y-4">
          {/* Overfetching */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h3 className="text-red-400 font-semibold mb-2">1. Overfetching</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              REST endpoints return fixed data structures. If you only need a user&apos;s name,
              you still get their email, avatar, bio, settings, and everything else the endpoint returns.
              This wastes bandwidth, especially on mobile networks.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-red-400 font-semibold mb-1">REST: You get EVERYTHING</p>
                <CodeBlock
                  language="json"
                  code={`// GET /api/users/1
// You only need the name, but you get:
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "avatar": "https://...",
  "bio": "Software engineer...",
  "settings": { ... },
  "createdAt": "2024-01-01",
  "lastLogin": "2024-03-15"
  // ...20 more fields you don't need
}`}
                />
              </div>
              <div>
                <p className="text-xs text-green-400 font-semibold mb-1">GraphQL: You get ONLY what you ask for</p>
                <CodeBlock
                  language="graphql"
                  code={`# Query: just ask for the name
{
  user(id: "1") {
    name
  }
}

# Response:
{
  "data": {
    "user": {
      "name": "Alice"
    }
  }
}`}
                />
              </div>
            </div>
          </div>

          {/* Underfetching */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h3 className="text-red-400 font-semibold mb-2">2. Underfetching</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              A single REST endpoint often does not return enough data. To build a user profile
              page showing the user, their posts, and their followers, you need to hit multiple
              endpoints and stitch the data together on the client.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-red-400 font-semibold mb-1">REST: 3 separate requests needed</p>
                <CodeBlock
                  language="typescript"
                  code={`// Need 3 requests to build a profile page
const user = await fetch('/api/users/1');
const posts = await fetch('/api/users/1/posts');
const followers = await fetch('/api/users/1/followers');

// Then manually combine them
const profileData = {
  ...await user.json(),
  posts: await posts.json(),
  followers: await followers.json(),
};`}
                />
              </div>
              <div>
                <p className="text-xs text-green-400 font-semibold mb-1">GraphQL: 1 request gets everything</p>
                <CodeBlock
                  language="graphql"
                  code={`# ONE query gets all related data
{
  user(id: "1") {
    name
    email
    posts {
      title
      createdAt
    }
    followers {
      name
      avatar
    }
  }
}`}
                />
              </div>
            </div>
          </div>

          {/* Multiple Round Trips */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h3 className="text-red-400 font-semibold mb-2">3. Multiple Round Trips</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              With REST, fetching related data often means sequential requests: first get the user,
              then use the user ID to get their posts, then use each post ID to get comments.
              Each round trip adds latency. GraphQL resolves all nested data in a single request
              on the server side, eliminating the waterfall effect.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: SIDE-BY-SIDE CODE COMPARISON
          Shows REST endpoint approach vs GraphQL query approach
          for the same data requirements.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Side-by-Side: Fetching a Blog Post with Author and Comments
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-orange-400 mb-2">REST Approach (3 requests)</h3>
            <CodeBlock
              filename="rest-approach.ts"
              language="typescript"
              code={`// REQUEST 1: Get the post
const postRes = await fetch('/api/posts/5');
const post = await postRes.json();
// Returns: { id, title, content, authorId, ... }

// REQUEST 2: Get the author (needs authorId from request 1)
const authorRes = await fetch(
  \`/api/users/\${post.authorId}\`
);
const author = await authorRes.json();
// Returns: { id, name, email, bio, avatar, ... }

// REQUEST 3: Get comments
const commentsRes = await fetch('/api/posts/5/comments');
const comments = await commentsRes.json();
// Returns: [{ id, text, userId, ... }, ...]

// Manually combine on the client
const fullPost = { ...post, author, comments };`}
              highlights={[1, 2, 6, 7, 8, 12, 13]}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-2">GraphQL Approach (1 request)</h3>
            <CodeBlock
              filename="graphql-approach.graphql"
              language="graphql"
              code={`# ONE request gets everything nested
query GetPostWithDetails {
  post(id: "5") {
    title
    content
    author {
      name
      email
    }
    comments {
      text
      author {
        name
      }
    }
  }
}

# Server resolves ALL relationships
# Client gets exactly this shape back
# No manual data stitching needed`}
              highlights={[1, 2, 3, 6, 10]}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: COMPARISON TABLE
          Structured comparison of REST vs GraphQL features.
          Rendered as pure HTML table on the server.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Feature Comparison
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                <th className="text-left p-3 text-orange-400">REST</th>
                <th className="text-left p-3 text-purple-400">GraphQL</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Endpoints</td>
                <td className="p-3">Multiple (one per resource)</td>
                <td className="p-3">Single endpoint (/graphql)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Data Fetching</td>
                <td className="p-3">Server decides response shape</td>
                <td className="p-3">Client decides response shape</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Overfetching</td>
                <td className="p-3">Common problem</td>
                <td className="p-3">Eliminated by design</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Underfetching</td>
                <td className="p-3">Requires multiple requests</td>
                <td className="p-3">Nested queries solve this</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Type System</td>
                <td className="p-3">Optional (OpenAPI/Swagger)</td>
                <td className="p-3">Built-in and required</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Versioning</td>
                <td className="p-3">/v1/, /v2/ common pattern</td>
                <td className="p-3">No versioning needed</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Caching</td>
                <td className="p-3">HTTP caching built-in (ETags, etc.)</td>
                <td className="p-3">Requires client-side cache (Apollo, etc.)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Error Handling</td>
                <td className="p-3">HTTP status codes (404, 500, etc.)</td>
                <td className="p-3">Always 200, errors in response body</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Learning Curve</td>
                <td className="p-3">Lower (familiar HTTP verbs)</td>
                <td className="p-3">Higher (query language, schema design)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: FLOW DIAGRAMS
          Two flow diagrams showing the request flow for REST vs GraphQL.
          FlowDiagram is a Server Component - zero JS cost.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Request Flow Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FlowDiagram
            title="REST: Multiple Requests for Related Data"
            steps={[
              { label: "Client: GET /api/posts/5", description: "First request for the post", type: "client" },
              { label: "Server: Returns post data", description: "Includes authorId but not author details", type: "server" },
              { label: "Client: GET /api/users/3", description: "Second request for the author", type: "client" },
              { label: "Server: Returns user data", description: "Full user object (overfetching)", type: "server" },
              { label: "Client: GET /api/posts/5/comments", description: "Third request for comments", type: "client" },
              { label: "Server: Returns comments", description: "All comment fields (overfetching)", type: "server" },
              { label: "Client: Combine Data", description: "Manually stitch 3 responses together", type: "client" },
            ]}
          />
          <FlowDiagram
            title="GraphQL: Single Request for All Data"
            steps={[
              { label: "Client: POST /graphql", description: "One query requesting post + author + comments", type: "client" },
              { label: "Server: Parse Query", description: "Validates query against schema", type: "server" },
              { label: "Server: Resolve Post", description: "Fetches post from database", type: "server" },
              { label: "Server: Resolve Author", description: "Fetches author (nested resolver)", type: "server" },
              { label: "Server: Resolve Comments", description: "Fetches comments (nested resolver)", type: "server" },
              { label: "Server: Shape Response", description: "Assembles data matching query shape", type: "server" },
              { label: "Client: Receives All Data", description: "Exactly what was requested, nothing more", type: "client" },
            ]}
          />
        </div>
      </section>

      {/* ============================================================
          SECTION 6: KEY TAKEAWAYS
          Summary of when to use REST vs GraphQL.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">GraphQL eliminates overfetching and underfetching:</strong> The
                client gets precisely the data it needs, no more and no less, in a single request.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">REST is simpler for basic CRUD:</strong> If
                your API is straightforward (simple resources, no complex relationships), REST
                is easier to implement and has better built-in caching via HTTP.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">GraphQL shines with complex, related data:</strong> When
                your frontend needs data from multiple related resources (users with posts with
                comments), GraphQL dramatically reduces the number of requests.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">They can coexist:</strong> Many companies
                use REST for simple endpoints and GraphQL for complex data requirements.
                They are not mutually exclusive.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">GraphQL trades HTTP caching for flexibility:</strong> REST
                leverages HTTP caching natively. GraphQL needs client-side caching solutions
                like Apollo Client or urql, but gains flexibility in return.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
