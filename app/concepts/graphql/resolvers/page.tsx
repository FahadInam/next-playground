// GRAPHQL RESOLVERS - CONCEPT PAGE 6 - SERVER COMPONENT
// =====================================================
// This page teaches GraphQL resolvers — the functions that actually fetch/compute
// the data for every field in your schema. Without resolvers, a schema is just
// a description of shapes; resolvers are the implementation that brings it to life.
//
// ARCHITECTURE NOTE:
// This is a SERVER COMPONENT (no "use client" directive).
// All JSX is rendered on the server and sent as HTML to the browser.
// Only the CodeBlock child component hydrates on the client (for copy-to-clipboard).
//
// WHY SERVER COMPONENT?
// - No interactivity needed on this page (no hooks, no event handlers)
// - Zero client JavaScript for the page shell
// - FlowDiagram and ConceptPage are also Server Components
// - Only CodeBlock requires hydration (it has a copy button with onClick + useState)

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function GraphQLResolversPage() {
  // ---------------------------------------------------------------
  // This entire function executes on the server.
  // The browser never downloads or runs this code — it only
  // receives the rendered HTML output.
  // ---------------------------------------------------------------

  return (
    <ConceptPage
      title="GraphQL Resolvers"
      description="Resolvers are the functions that fulfill GraphQL queries. They connect each field in your schema to the actual data source — whether that's a database, REST API, or in-memory data. Every field in a GraphQL schema has a corresponding resolver."
      serverOrClient="server"
    >
      {/* ================================================================= */}
      {/* SECTION 1: Layman Explanation (Analogy)                           */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Layman Explanation: The Kitchen Staff
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          {/*
            The restaurant analogy is powerful for GraphQL because it maps cleanly:
            - Menu (schema) = what you CAN order
            - Order (query) = what you DO order
            - Kitchen staff (resolvers) = who MAKES the food
            - Ingredients (data sources) = where the food COMES FROM
          */}
          <p className="text-[var(--color-text-secondary)] mb-4">
            Imagine a restaurant. The <strong className="text-[var(--color-text-primary)]">menu</strong> tells
            you what dishes are available — that&apos;s the <strong className="text-[var(--color-text-primary)]">GraphQL schema</strong>.
            When you place an order, the <strong className="text-[var(--color-text-primary)]">kitchen staff</strong> actually
            prepares each dish — those are the <strong className="text-[var(--color-text-primary)]">resolvers</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left card: the analogy mapping */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-2">Restaurant Analogy</h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">&#x1f4cb;</span>
                  <span><strong>Menu</strong> = GraphQL Schema (what&apos;s available)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">&#x1f4dd;</span>
                  <span><strong>Your Order</strong> = GraphQL Query (what you want)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">&#x1f468;&#x200d;&#x1f373;</span>
                  <span><strong>Kitchen Staff</strong> = Resolvers (who makes it)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">&#x1f96c;</span>
                  <span><strong>Ingredients</strong> = Data Sources (database, API, etc.)</span>
                </li>
              </ul>
            </div>
            {/* Right card: key insight */}
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-2">Key Insight</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                Each dish on the menu needs a chef who knows how to make it. Similarly,
                each field in your schema needs a resolver that knows how to fetch or compute
                the data for that field.
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                If a customer orders a &quot;burger with fries&quot;, the burger chef handles the
                burger, and the fry station handles the fries — each resolver handles its
                own piece independently.
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
          Developer Explanation: How Resolvers Work
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          {/*
            RESOLVER FUNCTION SIGNATURE:
            Every resolver receives exactly 4 arguments. Understanding these
            is critical for writing effective resolvers.

            (parent, args, context, info)

            - parent: The return value of the PARENT resolver in the chain.
                      For root-level Query/Mutation resolvers, this is usually undefined.
                      For nested resolvers, this is the object returned by the parent field.

            - args:   The arguments passed to THIS field in the query.
                      e.g., user(id: "123") -> args = { id: "123" }

            - context: A shared object available to ALL resolvers in a request.
                       Typically holds: database connection, authenticated user,
                       data loaders, request info, etc.

            - info:   Advanced metadata about the query execution — the AST,
                      field name, return type, path, etc. Rarely used in basic
                      resolvers but powerful for optimization.
          */}
          <p className="text-[var(--color-text-secondary)] mb-4">
            A resolver is a function that populates data for a single field in your schema.
            Every resolver receives <strong className="text-[var(--color-text-primary)]">four arguments</strong>,
            each serving a distinct purpose in the resolution chain.
          </p>

          {/* Four arguments explained in a grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Argument 1: parent */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-purple-400 mb-1">1. parent (or root)</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                The return value from the PARENT field&apos;s resolver. For top-level
                Query fields, this is <code className="text-green-400">undefined</code>.
                For nested fields like <code className="text-green-400">User.posts</code>,
                this is the User object returned by the parent resolver.
              </p>
            </div>
            {/* Argument 2: args */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-blue-400 mb-1">2. args</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                An object containing the arguments passed to this field in the GraphQL
                query. For example, <code className="text-green-400">user(id: &quot;5&quot;)</code> gives
                you <code className="text-green-400">{`{ id: "5" }`}</code>.
              </p>
            </div>
            {/* Argument 3: context */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-orange-400 mb-1">3. context</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                A shared object passed to every resolver during a single request.
                Commonly holds: database connections, the authenticated user,
                DataLoader instances, and any per-request state.
              </p>
            </div>
            {/* Argument 4: info */}
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
              <h4 className="text-sm font-semibold text-cyan-400 mb-1">4. info</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Advanced metadata about the query — the AST (abstract syntax tree),
                field name, return type, and the path from root. Used for
                optimization (e.g., checking which sub-fields were requested).
              </p>
            </div>
          </div>

          {/* Resolver chain explanation */}
          <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
              Resolver Chain (Parent Resolution)
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">
              When a query has nested fields, resolvers execute in a <strong>chain</strong>.
              The parent resolver runs first, and its return value becomes
              the <code className="text-green-400">parent</code> argument for each child resolver.
              This is how GraphQL traverses your data graph.
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              For example, querying <code className="text-green-400">{`{ user(id: "1") { name posts { title } } }`}</code> triggers:
              (1) <code className="text-green-400">Query.user</code> resolver runs, returns a User object.
              (2) <code className="text-green-400">User.name</code> gets the User object as <code className="text-green-400">parent</code> — returns <code className="text-green-400">parent.name</code>.
              (3) <code className="text-green-400">User.posts</code> gets the User object as <code className="text-green-400">parent</code> — fetches posts for that user.
              (4) For each post, <code className="text-green-400">Post.title</code> gets the Post as <code className="text-green-400">parent</code> — returns <code className="text-green-400">parent.title</code>.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: Code Example                                           */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Example: Resolver Implementation
        </h2>
        <div className="space-y-4">
          {/*
            FIRST CODE BLOCK: The resolver function signature
            This shows the generic shape of a resolver before diving into
            our specific implementation. Teaching the abstract pattern first
            helps developers recognize it in any GraphQL codebase.
          */}
          <CodeBlock
            filename="Resolver Function Signature"
            language="typescript"
            code={`// RESOLVER FUNCTION SIGNATURE
// ===========================
// Every resolver in GraphQL follows this exact pattern.
// It receives 4 arguments and returns data (or a Promise of data).

type ResolverFn = (
  parent: any,     // Return value from the parent resolver
                   // For Query.users -> parent is undefined (root level)
                   // For User.posts -> parent is the User object

  args: any,       // Arguments passed to this field in the query
                   // e.g., user(id: "5") -> args = { id: "5" }

  context: any,    // Shared per-request object (db, auth, loaders)
                   // Set up when creating the GraphQL server

  info: GraphQLResolveInfo  // Query AST metadata (advanced usage)
                            // Contains field name, return type, path, etc.
) => any; // Can return a value, Promise, or even another resolver`}
            highlights={[6, 7, 10, 13, 16]}
          />

          {/*
            SECOND CODE BLOCK: A practical resolver map
            This mirrors what you'd find in a real Next.js + GraphQL project.
            We show resolvers for Query (root level), a nested type (User),
            and a Mutation — covering the three most common resolver patterns.
          */}
          <CodeBlock
            filename="app/graphql/resolvers.ts"
            language="typescript"
            code={`// RESOLVER MAP - The implementation behind your schema
// ==================================================
// Each key in this object corresponds to a Type in the schema.
// Each nested key corresponds to a field on that Type.
// The function IS the resolver that fetches/computes the data.

// In-memory data for demonstration (replace with database in production)
const users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];

const posts = [
  { id: "101", title: "GraphQL Basics", content: "...", authorId: "1" },
  { id: "102", title: "Next.js + GraphQL", content: "...", authorId: "1" },
  { id: "103", title: "React Server Components", content: "...", authorId: "2" },
];

export const resolvers = {
  // ==============================================
  // ROOT QUERY RESOLVERS
  // ==============================================
  // These handle the top-level entry points into your data graph.
  // The 'parent' argument is always undefined for Query resolvers
  // because there is no parent — they ARE the root.
  Query: {
    // Resolver for: query { users } -> returns all users
    // parent = undefined (root level)
    // args = {} (no arguments defined for this field)
    users: () => users,

    // Resolver for: query { user(id: "1") } -> returns one user
    // parent = undefined (root level)
    // args = { id: "1" } (the id argument from the query)
    user: (_parent: unknown, args: { id: string }) => {
      return users.find(user => user.id === args.id);
    },

    // Resolver for: query { posts } -> returns all posts
    posts: () => posts,
  },

  // ==============================================
  // USER TYPE RESOLVERS (Nested / Relationship)
  // ==============================================
  // These resolve fields on the User type.
  // The 'parent' argument is the User object returned by
  // whichever resolver fetched this user (e.g., Query.user).
  //
  // IMPORTANT: GraphQL has "default resolvers" — if the parent
  // object has a property matching the field name, GraphQL
  // automatically returns parent[fieldName]. So User.name and
  // User.email don't need explicit resolvers because the user
  // objects already have 'name' and 'email' properties.
  //
  // We ONLY need an explicit resolver for 'posts' because
  // the user object doesn't have a 'posts' property — we need
  // to look it up from the posts array using authorId.
  User: {
    // Resolver for: user { posts { title } }
    // parent = the User object (e.g., { id: "1", name: "Alice", ... })
    // We use parent.id to find posts belonging to this user
    posts: (parent: { id: string }) => {
      return posts.filter(post => post.authorId === parent.id);
    },
  },

  // ==============================================
  // POST TYPE RESOLVERS (Nested / Relationship)
  // ==============================================
  Post: {
    // Resolver for: post { author { name } }
    // parent = the Post object (e.g., { id: "101", authorId: "1", ... })
    // We use parent.authorId to find the author User object
    author: (parent: { authorId: string }) => {
      return users.find(user => user.id === parent.authorId);
    },
  },

  // ==============================================
  // MUTATION RESOLVERS
  // ==============================================
  // Mutations modify data. They work exactly like Query resolvers
  // but by convention are used for write operations.
  Mutation: {
    // Resolver for: mutation { createPost(title: "...", content: "...", authorId: "1") }
    // args contains all the input arguments from the mutation
    createPost: (_parent: unknown, args: {
      title: string;
      content: string;
      authorId: string;
    }) => {
      const newPost = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        authorId: args.authorId,
      };
      posts.push(newPost);
      return newPost;
    },
  },
};`}
            highlights={[19, 27, 31, 36, 57, 63, 75, 86]}
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4: Flow Diagram                                           */}
      {/* ================================================================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Resolver Execution Flow
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          This diagram shows how resolvers execute for a nested query like:{" "}
          <code className="text-green-400 text-xs">{`{ user(id: "1") { name posts { title author { name } } } }`}</code>
        </p>

        {/*
          FLOW DIAGRAM: Resolver execution chain
          This shows the step-by-step process of how GraphQL resolves
          a nested query. Each step shows which resolver fires and what
          data it receives/returns. This is the "resolver chain" concept.
        */}
        <FlowDiagram
          title="Resolver Chain for Nested Query"
          steps={[
            {
              label: "1. Query.user(id: \"1\")",
              description: "Root resolver fires. parent=undefined, args={id:\"1\"}. Returns User object.",
              type: "server",
            },
            {
              label: "2. User.name",
              description: "Default resolver. parent=User object. Returns parent.name (\"Alice\").",
              type: "server",
            },
            {
              label: "3. User.posts",
              description: "Custom resolver. parent=User object. Filters posts by parent.id. Returns Post[].",
              type: "server",
            },
            {
              label: "4. Post.title (for each post)",
              description: "Default resolver. parent=Post object. Returns parent.title for each post.",
              type: "server",
            },
            {
              label: "5. Post.author (for each post)",
              description: "Custom resolver. parent=Post object. Finds user by parent.authorId.",
              type: "server",
            },
            {
              label: "6. User.name (on author)",
              description: "Default resolver on the author User. Returns parent.name for the author.",
              type: "server",
            },
            {
              label: "7. Assemble Response",
              description: "GraphQL engine combines all resolved values into the response JSON shape.",
              type: "neutral",
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
                  Every field has a resolver.
                </strong>{" "}
                Even if you don&apos;t write one explicitly, GraphQL provides a default
                resolver that returns <code className="text-green-400 text-xs">parent[fieldName]</code>.
                You only need custom resolvers when the field needs computation or data
                from a different source.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1 font-bold text-lg leading-none">2</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Resolvers receive 4 arguments: parent, args, context, info.
                </strong>{" "}
                The <code className="text-green-400 text-xs">parent</code> argument is the key
                to understanding nested resolution — it&apos;s how data flows down the
                resolver chain from parent types to child types.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1 font-bold text-lg leading-none">3</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Resolvers execute in a tree pattern.
                </strong>{" "}
                The root Query resolver runs first, then child resolvers run with
                the parent&apos;s return value. This creates a tree of resolver calls
                that mirrors the shape of the query.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1 font-bold text-lg leading-none">4</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Context is your shared toolbox.
                </strong>{" "}
                Use the context argument to share database connections, authentication
                state, and DataLoaders across all resolvers in a single request.
                It&apos;s created fresh for each request.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1 font-bold text-lg leading-none">5</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">
                  Watch out for the N+1 problem.
                </strong>{" "}
                If a resolver fetches data from a database inside a loop (e.g., fetching
                an author for each of 100 posts), you get 100 + 1 queries. Use DataLoader
                to batch these into a single query.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
