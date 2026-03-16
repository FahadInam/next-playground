// GRAPHQL SERVER - CONCEPT PAGE 7 - SERVER COMPONENT
// ===================================================
// This page teaches how a GraphQL server works internally — the pipeline
// that every GraphQL request goes through: parse -> validate -> execute -> format.
//
// It also compares GraphQL Yoga (what we use) vs Apollo Server, and shows
// how our server is set up using Next.js Route Handlers.
//
// ARCHITECTURE NOTE:
// This is a SERVER COMPONENT (no "use client" directive).
// All content is rendered on the server as static HTML.
// Only CodeBlock hydrates on the client for the copy-to-clipboard feature.
//
// WHY SERVER COMPONENT?
// - No interactivity, no hooks, no event handlers
// - Pure informational content rendered to HTML
// - Zero client JavaScript for the page shell
// - CodeBlock is the only child that requires client-side hydration

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function GraphQLServerPage() {
  // ---------------------------------------------------------------
  // This entire function executes on the Node.js server.
  // The browser receives pure HTML — no React runtime needed
  // for this page component itself.
  // ---------------------------------------------------------------

  return (
    <ConceptPage
      title="GraphQL Server"
      description="A GraphQL server receives queries, processes them through a multi-stage pipeline (parse, validate, execute), and returns structured JSON responses. Understanding this pipeline is key to debugging and optimizing your GraphQL API."
      serverOrClient="server"
    >
      {/* ================================================================= */}
      {/* SECTION 1: Layman Explanation (Analogy)                           */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Layman Explanation: The Restaurant Kitchen
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          {/*
            Restaurant kitchen analogy for the GraphQL server pipeline:
            1. Receive order (parse) = waiter takes the order slip
            2. Check the menu (validate) = kitchen checks if items exist & are valid
            3. Cook the food (execute) = chefs prepare each dish
            4. Plate and serve (format response) = food is arranged on plates and sent out
          */}
          <p className="text-[var(--color-text-secondary)] mb-4">
            Think of a GraphQL server as the <strong className="text-[var(--color-text-primary)]">entire kitchen operation</strong> in
            a restaurant. When a customer places an order, it doesn&apos;t just magically appear — it goes
            through a series of steps. The GraphQL server is the kitchen that receives orders (queries),
            processes them through the kitchen staff (resolvers), and sends back the finished food (data).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left card: the kitchen pipeline */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-2">The Kitchen Pipeline</h3>
              <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">1.</span>
                  <span>
                    <strong>Receive the Order (Parse)</strong> — The waiter brings the order slip
                    to the kitchen. The kitchen reads and understands the order. If the handwriting
                    is illegible (syntax error), it&apos;s sent back.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">2.</span>
                  <span>
                    <strong>Check the Menu (Validate)</strong> — The kitchen checks: &quot;Is
                    this a real dish? Does it come with the sides they requested?&quot; If someone
                    orders a &quot;flying pizza&quot;, it gets rejected (field doesn&apos;t exist in schema).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">3.</span>
                  <span>
                    <strong>Cook the Food (Execute)</strong> — Each chef (resolver) prepares their
                    assigned portion. The burger chef makes the burger, the fry station makes fries.
                    They all work in parallel when possible.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">4.</span>
                  <span>
                    <strong>Plate and Serve (Format Response)</strong> — All the individual dishes
                    are arranged on the plate exactly how the customer ordered them, then sent out as
                    one beautiful response.
                  </span>
                </li>
              </ul>
            </div>
            {/* Right card: what makes it special */}
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-2">What Makes GraphQL Special</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                Unlike a REST API (where each endpoint is a fixed dish), a GraphQL server is like
                a kitchen that lets you <strong>customize your order completely</strong>. You can
                say &quot;I want the burger, but only the patty and cheese, skip the bun, and add
                a side of the soup&apos;s broth only.&quot;
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                The server handles this by having the schema (menu) describe all possible combinations,
                the validation step ensures the request makes sense, and the resolvers (kitchen staff)
                prepare exactly what was asked for — nothing more, nothing less.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2: Developer Explanation                                   */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Developer Explanation: The GraphQL Execution Pipeline
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          {/*
            THE 4-STAGE PIPELINE:
            This is the internal flow that every GraphQL server follows,
            regardless of which library you use (Yoga, Apollo, Mercurius, etc.)

            Stage 1: PARSE
            - Turns the query string into an AST (Abstract Syntax Tree)
            - This is a tree structure that represents the query
            - If the query has syntax errors, parsing fails here
            - Uses the graphql-js parser under the hood

            Stage 2: VALIDATE
            - Takes the AST and validates it against the schema
            - Checks: fields exist, argument types match, required args present
            - Checks: fragments are valid, no circular references
            - If validation fails, returns errors WITHOUT executing anything

            Stage 3: EXECUTE
            - Walks the validated AST from root to leaves
            - Calls the resolver function for each field
            - Handles async resolvers (await promises)
            - Passes parent data down the resolver chain
            - Resolvers run in parallel where possible (siblings)

            Stage 4: FORMAT RESPONSE
            - Assembles resolved data into the response shape
            - Matches the exact structure of the original query
            - Includes any errors in the "errors" array
            - Returns { data, errors? } as JSON
          */}
          <p className="text-[var(--color-text-secondary)] mb-4">
            Every GraphQL request goes through a <strong className="text-[var(--color-text-primary)]">four-stage pipeline</strong>.
            This pipeline is defined by the GraphQL specification and is the same regardless of which
            server library you use (Yoga, Apollo, Mercurius, etc.).
          </p>

          {/* Pipeline stages in detail */}
          <div className="space-y-3 mb-6">
            {/* Stage 1: Parse */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-purple-400 mb-1">Stage 1: Parse</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                The raw query string (e.g., <code className="text-green-400">{`"{ users { name } }"`}</code>) is
                converted into an <strong>Abstract Syntax Tree (AST)</strong> — a structured tree of nodes
                representing the query. If the query has syntax errors (missing braces, invalid tokens),
                parsing fails and returns an error immediately. No resolvers are called.
              </p>
            </div>
            {/* Stage 2: Validate */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-blue-400 mb-1">Stage 2: Validate</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                The AST is checked against the schema. Validation ensures: fields actually exist on the
                types being queried, argument types match (string vs number), required arguments are
                provided, fragment types are compatible, and there are no circular references.
                If validation fails, errors are returned without executing any resolvers.
              </p>
            </div>
            {/* Stage 3: Execute */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-green-400 mb-1">Stage 3: Execute</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                The executor walks the AST from root to leaf nodes, calling the corresponding resolver
                for each field. Sibling fields can resolve in <strong>parallel</strong> (they don&apos;t
                depend on each other), while nested fields resolve <strong>sequentially</strong> (children
                wait for their parent). Each resolver receives the four arguments: parent, args, context, info.
              </p>
            </div>
            {/* Stage 4: Format Response */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-orange-400 mb-1">Stage 4: Format Response</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                All resolved values are assembled into a JSON response that matches the exact shape
                of the original query. The response always has a <code className="text-green-400">data</code> field
                (containing the resolved data) and optionally an <code className="text-green-400">errors</code> field
                (if any resolver threw an error). Partial data is possible — some fields can succeed while others fail.
              </p>
            </div>
          </div>

          {/* Yoga vs Apollo comparison */}
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            GraphQL Yoga vs Apollo Server
          </h3>
          <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
            {/*
              COMPARISON TABLE:
              GraphQL Yoga and Apollo Server are the two most popular
              GraphQL server libraries for Node.js / Next.js.

              Yoga: Built by The Guild, focuses on being lightweight,
              spec-compliant, and framework-agnostic. Uses the Envelop
              plugin system. Works great with Next.js route handlers.

              Apollo: Built by Apollo (the company), more feature-rich
              out of the box with built-in caching, metrics, and a
              commercial ecosystem (Apollo Studio, Apollo Router).
            */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                  <th className="text-left p-3 text-green-400">GraphQL Yoga</th>
                  <th className="text-left p-3 text-purple-400">Apollo Server</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-medium">Bundle Size</td>
                  <td className="p-3">Lightweight (~45KB)</td>
                  <td className="p-3">Heavier (~200KB+)</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-medium">Plugin System</td>
                  <td className="p-3">Envelop (composable)</td>
                  <td className="p-3">Apollo plugins</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-medium">Standards</td>
                  <td className="p-3">Fetch API (Web standard)</td>
                  <td className="p-3">Express/Koa middleware</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-medium">Next.js Fit</td>
                  <td className="p-3">Native (uses Fetch API)</td>
                  <td className="p-3">Needs adapter</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-medium">Subscriptions</td>
                  <td className="p-3">Built-in (SSE)</td>
                  <td className="p-3">Separate package</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Best For</td>
                  <td className="p-3">Modern, lightweight APIs</td>
                  <td className="p-3">Enterprise, full ecosystem</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: Code Example                                           */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Example: Setting Up GraphQL Yoga in Next.js
        </h2>
        <div className="space-y-4">
          {/*
            CODE BLOCK 1: The schema definition
            This is where you define your typeDefs and resolvers,
            then combine them into a schema using graphql-yoga's createSchema.
            This file is imported by the route handler.
          */}
          <CodeBlock
            filename="app/graphql/schema.ts"
            language="typescript"
            code={`// GRAPHQL SCHEMA DEFINITION
// =========================
// This file defines the schema (typeDefs) and resolvers,
// then combines them into a single executable schema.
// This is imported by the route handler to create the server.

import { createSchema } from "graphql-yoga";

// TYPE DEFINITIONS (SDL - Schema Definition Language)
// This is the "menu" — it describes the shape of your data
// and what operations (queries/mutations) are available.
const typeDefs = /* GraphQL */ \`
  type Query {
    users: [User!]!          # Returns a list of users (non-nullable)
    user(id: ID!): User      # Returns a single user by ID (nullable)
    posts: [Post!]!          # Returns a list of posts
  }

  type Mutation {
    createPost(title: String!, content: String!, authorId: ID!): Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!          # Relationship: a user has many posts
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!            # Relationship: a post belongs to a user
  }
\`;

// RESOLVERS — the implementation behind each field
// (See the Resolvers concept page for detailed explanation)
const resolvers = {
  Query: {
    users: () => users,
    user: (_: unknown, { id }: { id: string }) => users.find(u => u.id === id),
    posts: () => posts,
  },
  User: {
    posts: (parent: { id: string }) =>
      posts.filter(p => p.authorId === parent.id),
  },
  Post: {
    author: (parent: { authorId: string }) =>
      users.find(u => u.id === parent.authorId),
  },
  Mutation: {
    createPost: (_: unknown, args: { title: string; content: string; authorId: string }) => {
      const newPost = { id: String(posts.length + 1), ...args };
      posts.push(newPost);
      return newPost;
    },
  },
};

// Sample data (replace with database in production)
const users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];
const posts = [
  { id: "101", title: "GraphQL Basics", content: "Learning GraphQL...", authorId: "1" },
  { id: "102", title: "Next.js + GraphQL", content: "Integration guide...", authorId: "1" },
  { id: "103", title: "Server Components", content: "RSC deep dive...", authorId: "2" },
];

// CREATE THE EXECUTABLE SCHEMA
// This combines typeDefs + resolvers into a single schema object
// that the GraphQL server can use to process requests.
export const schema = createSchema({ typeDefs, resolvers });

// Also export individually for direct execution (used in Server Components)
export { typeDefs, resolvers };`}
            highlights={[7, 12, 40, 76, 77]}
          />

          {/*
            CODE BLOCK 2: The Next.js route handler
            This is the actual API endpoint that receives HTTP requests
            and passes them to GraphQL Yoga for processing.
            It uses the Web standard Fetch API (Request/Response).
          */}
          <CodeBlock
            filename="app/api/graphql/route.ts"
            language="typescript"
            code={`// GRAPHQL API ROUTE HANDLER
// =========================
// This file creates the actual HTTP endpoint for your GraphQL API.
// It uses Next.js Route Handlers (the App Router's API routes)
// combined with GraphQL Yoga to process GraphQL requests.
//
// Endpoint: POST /api/graphql (and GET for GraphiQL playground)

import { createYoga } from "graphql-yoga";
import { schema } from "@/app/graphql/schema";

// CREATE THE YOGA SERVER INSTANCE
// ================================
// createYoga() returns a handler that:
// 1. Accepts standard Fetch API Request objects
// 2. Runs the GraphQL pipeline (parse -> validate -> execute)
// 3. Returns a standard Fetch API Response object
//
// This is why Yoga fits perfectly with Next.js Route Handlers —
// both use the Web standard Fetch API (Request/Response).
const { handleRequest } = createYoga({
  schema,

  // The URL path where GraphQL is served
  // Must match your route file location: app/api/graphql/route.ts
  graphqlEndpoint: "/api/graphql",

  // Enable GraphiQL (interactive query editor) in development
  // Visit /api/graphql in your browser to use it
  fetchAPI: {
    Request: Request,
    Response: Response,
  },
});

// EXPORT HTTP METHOD HANDLERS
// ============================
// Next.js Route Handlers require named exports matching HTTP methods.
//
// GET: Used by GraphiQL playground (the interactive editor in the browser)
//      When you visit /api/graphql in a browser, you see the playground.
//
// POST: Used by actual GraphQL queries from your application.
//       The client sends { query: "...", variables: {...} } as JSON body.
//
// OPTIONS: Used for CORS preflight requests from browsers.
//          Required if your frontend and API are on different origins.

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};`}
            highlights={[9, 10, 21, 22, 27, 48, 49, 50]}
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4: Flow Diagram                                           */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Request Processing Flow
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          This diagram shows the complete journey of a GraphQL request through the server,
          from the initial HTTP request to the final JSON response.
        </p>

        {/*
          FLOW DIAGRAM: The full GraphQL server request pipeline
          This visualizes the 4-stage pipeline from the developer explanation
          above, but in context of a real HTTP request-response cycle.
        */}
        <FlowDiagram
          title="GraphQL Server Request Pipeline"
          steps={[
            {
              label: "Client HTTP Request",
              description: "POST /api/graphql with { query, variables } as JSON body",
              type: "client",
            },
            {
              label: "Next.js Route Handler",
              description: "Route handler receives Request, passes to GraphQL Yoga",
              type: "server",
            },
            {
              label: "1. Parse Query",
              description: "Query string is parsed into an AST (Abstract Syntax Tree)",
              type: "server",
            },
            {
              label: "2. Validate Against Schema",
              description: "AST is checked: do fields exist? Are types correct? Args valid?",
              type: "server",
            },
            {
              label: "3. Execute Resolvers",
              description: "Walk the AST, call resolver for each field, await async results",
              type: "server",
            },
            {
              label: "4. Format Response",
              description: "Assemble resolved data into { data, errors? } JSON structure",
              type: "server",
            },
            {
              label: "HTTP Response",
              description: "JSON response sent back: { data: { users: [...] } }",
              type: "network",
            },
            {
              label: "Client Receives Data",
              description: "Application processes the typed, structured response",
              type: "client",
            },
          ]}
        />
      </section>

      {/* ================================================================= */}
      {/* SECTION 5: Key Takeaways                                          */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1 font-bold text-lg leading-none">1</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Every request goes through Parse, Validate, Execute, Format.
                </strong>{" "}
                This pipeline is defined by the GraphQL specification and is the same
                in every GraphQL server — Yoga, Apollo, Mercurius, or any other.
                Understanding it helps you debug issues at the right stage.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1 font-bold text-lg leading-none">2</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  GraphQL Yoga is ideal for Next.js.
                </strong>{" "}
                Yoga uses the Web standard Fetch API (Request/Response), which is exactly
                what Next.js Route Handlers use. This means zero adapters needed — the
                handler function works directly as a route handler export.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1 font-bold text-lg leading-none">3</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Validation happens before execution.
                </strong>{" "}
                If a query references a field that doesn&apos;t exist in the schema,
                you get a validation error <em>without any resolver code running</em>.
                This is a safety net — malformed queries are rejected at the gate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1 font-bold text-lg leading-none">4</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  The route handler is just a bridge.
                </strong>{" "}
                The Next.js route handler&apos;s job is minimal: receive the HTTP request and
                pass it to Yoga. All the real GraphQL processing (parsing, validation,
                execution) is handled by the GraphQL engine inside Yoga.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1 font-bold text-lg leading-none">5</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  One endpoint, infinite queries.
                </strong>{" "}
                Unlike REST APIs where each resource needs its own endpoint (GET /users,
                GET /posts, GET /users/1/posts), a GraphQL server has a single endpoint
                that handles all queries. The flexibility comes from the query language,
                not the URL structure.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
