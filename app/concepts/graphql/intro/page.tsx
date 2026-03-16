// INTRODUCTION TO GRAPHQL - SERVER COMPONENT
// ============================================
// This page is a Server Component (the default in Next.js App Router).
// There is NO "use client" directive, so this entire file runs on the server.
//
// WHY SERVER COMPONENT?
// - This page is purely educational/informational content
// - No useState, useEffect, onClick, or any browser APIs needed
// - No user interactivity required
// - All content is static text, code examples, and diagrams
//
// WHAT HAPPENS DURING A REQUEST:
// 1. User navigates to /concepts/graphql/intro
// 2. Next.js server receives the request
// 3. This component function executes on the server
// 4. The JSX (including ConceptPage, CodeBlock, FlowDiagram) is rendered to HTML
// 5. CodeBlock IS a Client Component (it has a copy button with useState/onClick),
//    so Next.js includes its small JS bundle for hydration
// 6. FlowDiagram and ConceptPage are Server Components - rendered to pure HTML
// 7. The combined HTML + minimal JS is sent to the browser
//
// GRAPHQL CONTEXT:
// GraphQL is a query language for APIs, created by Facebook in 2012 and
// open-sourced in 2015. It provides a complete and understandable description
// of the data in your API, gives clients the power to ask for exactly what
// they need, and makes it easier to evolve APIs over time.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function GraphQLIntroPage() {
  // This function body runs ONLY on the server.
  // The browser never sees this source code - only the rendered HTML output.
  return (
    <ConceptPage
      title="Introduction to GraphQL"
      description="GraphQL is a query language for APIs that lets clients request exactly the data they need. Created by Facebook in 2012 and open-sourced in 2015, it has become a powerful alternative to REST."
      serverOrClient="server"
    >
      {/* ============================================================
          SECTION 1: LAYMAN EXPLANATION
          Uses a restaurant analogy to make GraphQL approachable.
          This entire section is static HTML - zero JS cost.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Restaurant Analogy
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Imagine you&apos;re at a restaurant. There are two ways to order food:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* REST analogy */}
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-2">REST = Combo Meals</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                With REST, you order a fixed combo meal. You get a burger, fries, and a drink
                whether you want all of them or not. If you also want dessert, you have to
                place a separate order (another API call).
              </p>
              <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
                <li>- Fixed set of items per order</li>
                <li>- May get things you don&apos;t want (overfetching)</li>
                <li>- Multiple orders for different items</li>
              </ul>
            </div>
            {/* GraphQL analogy */}
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">GraphQL = Custom Order</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                With GraphQL, you hand the kitchen a custom order that says exactly what you
                want: &quot;I want a burger with no pickles, sweet potato fries, and a milkshake.&quot;
                You get precisely what you asked for in one trip.
              </p>
              <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
                <li>- You specify exactly what you want</li>
                <li>- Get only what you asked for</li>
                <li>- One order for everything</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: DEVELOPER EXPLANATION
          Technical overview of what GraphQL actually is, its history,
          and its core principles.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          What Is GraphQL?
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            GraphQL is a <strong className="text-[var(--color-text-primary)]">query language for APIs</strong> and
            a <strong className="text-[var(--color-text-primary)]">runtime for executing those queries</strong> against
            your data. It is not tied to any specific database or storage engine.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold text-lg">1</span>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Created by Facebook (2012)</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Facebook built GraphQL internally to power their mobile apps. The News Feed
                  needed complex, nested data (posts, authors, comments, likes) and REST APIs
                  were too slow and inflexible for mobile networks.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold text-lg">2</span>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Open-Sourced (2015)</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Facebook released GraphQL as an open-source specification. Since then, it has
                  been adopted by companies like GitHub, Shopify, Twitter, and Airbnb.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold text-lg">3</span>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">A Specification, Not a Library</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  GraphQL is a spec that defines how queries should be structured and how servers
                  should respond. There are implementations in every language: JavaScript (Apollo, graphql-yoga),
                  Python (Graphene), Go (gqlgen), and many more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: CORE PRINCIPLES
          The three pillars of GraphQL explained visually.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Core Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h3 className="text-green-400 font-semibold mb-2">Ask for What You Need</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Send a GraphQL query to your API and get exactly what you need, nothing more
              and nothing less. The client controls the shape of the response, not the server.
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h3 className="text-blue-400 font-semibold mb-2">Get Many Resources in One Request</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              GraphQL queries access not just one resource but also follow references between
              them. Get all the data your app needs in a single request instead of making
              multiple round trips.
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h3 className="text-orange-400 font-semibold mb-2">Describe What&apos;s Possible with a Type System</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              GraphQL APIs are organized in terms of types and fields, not endpoints.
              The schema serves as a contract between client and server, providing clear
              documentation and enabling powerful developer tools.
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h3 className="text-purple-400 font-semibold mb-2">Evolve Your API Without Versioning</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Add new fields and types to your GraphQL API without impacting existing queries.
              Aging fields can be deprecated and hidden from tools. No need for /v1/, /v2/ endpoints.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: CODE EXAMPLE
          Shows a simple GraphQL query and its response.
          CodeBlock is a Client Component (has copy button with useState),
          but the code string itself is defined here on the server.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Your First GraphQL Query
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
              The Query (what you send)
            </h3>
            <CodeBlock
              filename="query.graphql"
              language="graphql"
              code={`# A GraphQL query looks like JSON without the values.
# You describe the SHAPE of the data you want.

{
  user(id: "1") {
    name
    email
    posts {
      title
      createdAt
    }
  }
}`}
              highlights={[4, 5, 6, 7, 8, 9]}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
              The Response (what you get back)
            </h3>
            <CodeBlock
              filename="response.json"
              language="json"
              code={`{
  "data": {
    "user": {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "posts": [
        {
          "title": "Getting Started with GraphQL",
          "createdAt": "2024-01-15"
        },
        {
          "title": "GraphQL vs REST",
          "createdAt": "2024-02-20"
        }
      ]
    }
  }
}`}
              highlights={[2, 3, 4, 5]}
            />
          </div>
        </div>
        <div className="mt-3 bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <strong className="text-purple-400">Notice:</strong> The response mirrors the exact shape of the query.
            You asked for <code className="text-green-400">name</code>, <code className="text-green-400">email</code>,
            and <code className="text-green-400">posts.title</code> - and that is exactly what you got back.
            No extra fields, no wasted data.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: FLOW DIAGRAM
          Visualizes how a GraphQL query flows from client to server.
          FlowDiagram is a Server Component - renders to pure HTML.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          How a GraphQL Query Works
        </h2>
        <FlowDiagram
          title="GraphQL Query Execution Flow"
          steps={[
            {
              label: "Client Sends Query",
              description: "POST request with GraphQL query string in the body",
              type: "client",
            },
            {
              label: "Single Endpoint Receives",
              description: "All queries go to one endpoint (e.g., /api/graphql)",
              type: "network",
            },
            {
              label: "Schema Validation",
              description: "Server validates query against the type schema",
              type: "server",
            },
            {
              label: "Resolver Execution",
              description: "Resolvers fetch data from databases, APIs, etc.",
              type: "server",
            },
            {
              label: "Response Shaped by Query",
              description: "Data is assembled to match the query structure exactly",
              type: "server",
            },
            {
              label: "Client Receives Data",
              description: "JSON response with only the requested fields",
              type: "client",
            },
          ]}
        />
      </section>

      {/* ============================================================
          SECTION 6: KEY TAKEAWAYS
          Summary of the most important points from this page.
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
                <strong className="text-[var(--color-text-primary)]">GraphQL is a query language:</strong> It
                lets clients describe exactly what data they need from an API, unlike REST where
                the server decides the response shape.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Single endpoint:</strong> Instead of
                dozens of REST endpoints (/users, /posts, /comments), GraphQL uses one endpoint
                (typically /graphql) for all operations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Strongly typed schema:</strong> Every
                GraphQL API defines a schema that describes all available data types and operations.
                This enables auto-completion, validation, and self-documentation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">No overfetching or underfetching:</strong> You
                get exactly the fields you request - no more, no less. This is especially important
                for mobile apps on slow networks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Created by Facebook, now open-source:</strong> Built
                in 2012 for Facebook&apos;s mobile apps, open-sourced in 2015, and now maintained by
                the GraphQL Foundation under the Linux Foundation.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
