// GRAPHQL QUERIES - SERVER COMPONENT PAGE
// ========================================
// This page teaches how GraphQL queries work - the primary way clients
// READ data from a GraphQL API.
//
// SERVER COMPONENT: No "use client" directive. This file runs on the server.
// The QueryDemo child component IS a Client Component (needs useState for
// the interactive query playground).
//
// RENDERING LIFECYCLE:
// 1. Browser requests /concepts/graphql/queries
// 2. Next.js server renders this page to HTML
// 3. Static sections (explanations, code examples, flow diagrams) become pure HTML
// 4. QueryDemo is server-rendered with its initial state, then hydrated in browser
// 5. Browser receives HTML + JS bundle for QueryDemo only

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import QueryDemo from "./QueryDemo";

export default function QueriesPage() {
  return (
    <ConceptPage
      title="GraphQL Queries"
      description="Queries are how clients read data from a GraphQL API. Unlike REST where each endpoint returns a fixed shape, GraphQL queries let you specify exactly which fields you want."
      serverOrClient="both"
    >
      {/* ============================================================
          SECTION 1: LAYMAN EXPLANATION
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Shopping List Analogy
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Think of a GraphQL query like writing a shopping list before going to the store.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-2">REST = Grab a Pre-packed Box</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                With REST, you pick up a pre-packed box from the shelf. It has bread, milk,
                eggs, and butter - even if you only needed bread. If you also need fruit,
                that&apos;s in a different aisle (another API call).
              </p>
            </div>
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">GraphQL = Custom Shopping List</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                With GraphQL, you hand the store a list that says: &quot;I want bread, apples,
                and cheese.&quot; A personal shopper collects exactly those items and nothing else,
                all in one trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: DEVELOPER EXPLANATION
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          How Queries Work
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-1">Query Structure</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              A GraphQL query mirrors the shape of the data you want back. You start from a
              root field (like <code className="text-purple-400">posts</code> or <code className="text-purple-400">user</code>),
              then select nested fields. The server responds with JSON matching your query&apos;s exact shape.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-1">Arguments</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Fields can accept arguments to filter or customize results. For example,
              <code className="text-purple-400"> post(id: &quot;1&quot;)</code> fetches a specific post.
              Arguments are defined in the schema and type-checked by GraphQL automatically.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-orange-400 mb-1">Nested Relations</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              The real power of queries is traversing relationships. In a single query you can
              fetch a post, its author, and all comments with their authors - something that
              would require 3+ REST API calls.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: CODE EXAMPLES
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Query Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Simple Query</h3>
            <CodeBlock
              filename="simple-query.graphql"
              language="graphql"
              code={`# Fetch all posts with just title and content
# No author info, no comments - only what we need
query {
  posts {
    id
    title
    content
    createdAt
  }
}`}
              highlights={[3, 4, 5, 6, 7]}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Nested Query</h3>
            <CodeBlock
              filename="nested-query.graphql"
              language="graphql"
              code={`# Fetch a post with its author AND comments
# All in ONE request - no multiple round trips
query {
  post(id: "1") {
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
}`}
              highlights={[4, 7, 8, 9, 11, 12, 13]}
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: LIVE DEMO
          QueryDemo is a Client Component - needs useState for the
          interactive query editor and fetch results display.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Query Playground
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          Try running queries against our GraphQL API. Edit the query and click &quot;Run Query&quot;
          to see the response.
        </p>
        <QueryDemo />
      </section>

      {/* ============================================================
          SECTION 5: EXECUTION FLOW
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Query Execution Flow
        </h2>
        <FlowDiagram
          title="What Happens When You Send a Query"
          steps={[
            { label: "Client Writes Query", description: "Developer specifies fields they need", type: "client" },
            { label: "POST to /api/graphql", description: "Query sent as JSON string in request body", type: "network" },
            { label: "Parse & Validate", description: "Server parses query and checks it against schema", type: "server" },
            { label: "Execute Resolvers", description: "Each field in the query triggers its resolver function", type: "server" },
            { label: "Assemble Response", description: "Results are assembled matching query shape", type: "server" },
            { label: "Return JSON", description: "Client receives exactly the data it asked for", type: "client" },
          ]}
        />
      </section>

      {/* ============================================================
          SECTION 6: FETCHING FROM JAVASCRIPT
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Fetching Queries in JavaScript
        </h2>
        <CodeBlock
          filename="fetch-graphql.ts"
          language="typescript"
          code={`// How to send a GraphQL query using the Fetch API
// This works in both Server Components and Client Components

const query = \`
  query GetPosts {
    posts {
      id
      title
      author {
        name
      }
    }
  }
\`;

// GraphQL always uses POST to a single endpoint
const response = await fetch("/api/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
});

// The response always has a "data" key
// (and optionally an "errors" key if something went wrong)
const { data, errors } = await response.json();

// data.posts is an array of posts matching the query shape
console.log(data.posts);`}
          highlights={[16, 17, 18, 19, 23]}
        />
      </section>

      {/* ============================================================
          SECTION 7: PRACTICE EXERCISES
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Practice Exercises
        </h2>
        <div className="space-y-4">
          <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-2">Beginner: Fetch All Users</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Write a query that fetches all users with their name and email.
              Use the live playground above to test your query.
            </p>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-2">Intermediate: Nested Relations</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Write a query that fetches a specific user by ID, including all their posts
              and the comments on each post. This requires 3 levels of nesting.
            </p>
          </div>
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
            <h3 className="text-orange-400 font-semibold mb-2">Advanced: Create a Query Component</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Create a new Client Component that fetches posts and displays them as cards.
              Add a text input that lets users filter posts by searching the title.
              Use the fetch API to send the query on component mount.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: KEY TAKEAWAYS
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Queries define shape:</strong> The query you write defines the exact shape of the response.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Arguments filter data:</strong> Use arguments like <code className="text-purple-400">post(id: &quot;1&quot;)</code> to fetch specific records.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Nested traversal:</strong> Follow relationships in a single query - no multiple API calls needed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong className="text-[var(--color-text-primary)]">Single endpoint:</strong> All queries go to POST /api/graphql with the query string in the body.</span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
