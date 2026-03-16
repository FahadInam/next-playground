// GRAPHQL SCHEMA PAGE - SERVER COMPONENT
// ========================================
// This page teaches the GraphQL Schema Definition Language (SDL).
// It is a Server Component (no "use client") because it is purely informational.
//
// WHY SERVER COMPONENT?
// - No interactivity: just static text, code blocks, and diagrams
// - No React hooks (useState, useEffect) or browser APIs
// - No event handlers (onClick, onChange, etc.)
// - All content can be rendered to HTML on the server
//
// WHAT HAPPENS DURING A REQUEST:
// 1. User navigates to /concepts/graphql/schema
// 2. Next.js server executes this component function
// 3. All JSX is rendered to HTML on the server
// 4. CodeBlock components (Client Components) get their small JS bundles for copy buttons
// 5. FlowDiagram and ConceptPage render as pure HTML (Server Components)
// 6. Browser receives HTML + minimal JS, displays instantly
//
// GRAPHQL SCHEMA CONTEXT:
// The schema is the heart of any GraphQL API. It defines:
// - What types of data exist (User, Post, Comment)
// - What fields each type has (name, email, title, content)
// - What queries are available (getUser, getPosts)
// - What mutations can modify data (createPost, deleteUser)
// - The relationships between types (a Post has an Author who is a User)

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function GraphQLSchemaPage() {
  // This function runs ONLY on the server.
  // The browser never sees this source code.
  return (
    <ConceptPage
      title="GraphQL Schema"
      description="The schema is the contract between your GraphQL API and its clients. It defines every type, field, and relationship available, using the Schema Definition Language (SDL)."
      serverOrClient="server"
    >
      {/* ============================================================
          SECTION 1: LAYMAN EXPLANATION
          Uses a restaurant menu analogy for the schema concept.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Restaurant Menu Analogy
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            If GraphQL is a restaurant where you can order exactly what you want, then the
            <strong className="text-[var(--color-text-primary)]"> schema is the menu</strong>. The menu
            tells you:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">What the Menu Contains</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">*</span>
                  <span><strong>Categories</strong> (Types) - Appetizers, Mains, Desserts = User, Post, Comment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">*</span>
                  <span><strong>Items in each category</strong> (Fields) - Burger has: patty, cheese, bun = User has: name, email, posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">*</span>
                  <span><strong>Required vs optional</strong> (Non-null !) - Every burger MUST have a patty = Every user MUST have an id</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">*</span>
                  <span><strong>Combos</strong> (Relationships) - A meal comes with sides = A Post comes with its Author</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-2">Why the Menu Matters</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>You know exactly what you CAN order before ordering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>The kitchen rejects orders for items not on the menu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Both customer and kitchen agree on what exists</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>New items can be added without changing existing ones</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: SCALAR TYPES
          Explains the built-in primitive types in GraphQL.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Built-in Scalar Types
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Scalars are the leaf values in a GraphQL schema - the basic data types that
            represent concrete data. GraphQL comes with five built-in scalars:
          </p>
          <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left p-3 text-[var(--color-text-muted)]">Scalar Type</th>
                  <th className="text-left p-3 text-[var(--color-text-muted)]">Description</th>
                  <th className="text-left p-3 text-[var(--color-text-muted)]">Example</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-mono text-green-400">String</td>
                  <td className="p-3">UTF-8 text</td>
                  <td className="p-3 font-mono">&quot;Alice Johnson&quot;</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-mono text-blue-400">Int</td>
                  <td className="p-3">32-bit signed integer</td>
                  <td className="p-3 font-mono">42</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-mono text-orange-400">Float</td>
                  <td className="p-3">Double-precision floating point</td>
                  <td className="p-3 font-mono">3.14</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="p-3 font-mono text-purple-400">Boolean</td>
                  <td className="p-3">True or false</td>
                  <td className="p-3 font-mono">true</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-yellow-400">ID</td>
                  <td className="p-3">Unique identifier (serialized as String)</td>
                  <td className="p-3 font-mono">&quot;cuid_abc123&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: SCHEMA SYNTAX EXPLAINED
          Explains !, [], and relationships between types.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Schema Syntax: Modifiers and Relationships
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                Non-Null (!) and Arrays ([])
              </h3>
              <CodeBlock
                language="graphql"
                code={`# Type modifiers control nullability and lists

name: String       # Can be null - name might be absent
name: String!      # CANNOT be null - name is required

posts: [Post]      # Nullable array of nullable posts
posts: [Post]!     # Non-null array of nullable posts (array always exists)
posts: [Post!]!    # Non-null array of non-null posts (strictest)

# Real-world example:
type User {
  id: ID!            # Always has an ID (required)
  name: String!      # Always has a name (required)
  bio: String        # Bio is optional (can be null)
  posts: [Post!]!    # Always returns an array, posts in it are never null
}`}
                highlights={[3, 4, 6, 7, 8]}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                Relationships Between Types
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                Types reference each other to create relationships. A Post has an author (User),
                and a User has many posts. These relationships are what make GraphQL powerful -
                you can traverse the entire graph in a single query.
              </p>
              <CodeBlock
                language="graphql"
                code={`# Relationships are just fields that reference other types

type User {
  id: ID!
  name: String!
  posts: [Post!]!      # One User -> Many Posts (one-to-many)
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!        # Each Post -> One User (many-to-one)
  comments: [Comment!]! # One Post -> Many Comments (one-to-many)
}

type Comment {
  id: ID!
  text: String!
  author: User!        # Each Comment -> One User (many-to-one)
  post: Post!          # Each Comment -> One Post (many-to-one)
}`}
                highlights={[6, 13, 14, 20, 21]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: FULL SCHEMA EXAMPLE
          Shows a complete schema definition including types,
          Query root type, and Mutation root type.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Complete Schema Example
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          Here is the full schema that our backend GraphQL API uses. Notice how
          the <code className="text-green-400">Query</code> type defines what data you can read,
          and the <code className="text-green-400">Mutation</code> type defines what data you can modify.
        </p>
        <CodeBlock
          filename="schema.graphql"
          language="graphql"
          code={`# =============================================
# GRAPHQL SCHEMA DEFINITION
# =============================================
# This schema defines the complete API contract.
# Every query and mutation MUST match this schema.

# --- Object Types (the data models) ---

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!        # Resolved by a field resolver
}

type Post {
  id: ID!
  title: String!
  content: String!
  published: Boolean!
  author: User!          # Resolved by a field resolver
  comments: [Comment!]!  # Resolved by a field resolver
}

type Comment {
  id: ID!
  text: String!
  author: User!          # Resolved by a field resolver
  post: Post!            # Resolved by a field resolver
}

# --- Root Query Type ---
# Defines all "read" operations (like GET in REST)

type Query {
  users: [User!]!              # Get all users
  user(id: ID!): User          # Get one user by ID (nullable - might not exist)
  posts: [Post!]!              # Get all posts
  post(id: ID!): Post          # Get one post by ID
}

# --- Root Mutation Type ---
# Defines all "write" operations (like POST/PUT/DELETE in REST)

type Mutation {
  createUser(name: String!, email: String!): User!
  createPost(title: String!, content: String!, authorId: ID!): Post!
  createComment(text: String!, authorId: ID!, postId: ID!): Comment!
  updatePost(id: ID!, title: String, content: String, published: Boolean): Post
  deletePost(id: ID!): Boolean!
}`}
          highlights={[9, 17, 26, 34, 44]}
        />
      </section>

      {/* ============================================================
          SECTION 5: VISUAL SCHEMA RELATIONSHIP DIAGRAM
          Shows how types relate to each other using a flow diagram.
          FlowDiagram renders as pure HTML (Server Component).
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Schema Relationship Map
        </h2>
        <FlowDiagram
          title="How Types Connect in Our Schema"
          direction="horizontal"
          steps={[
            {
              label: "User",
              description: "id, name, email, posts[]",
              type: "server",
            },
            {
              label: "Post",
              description: "id, title, content, author, comments[]",
              type: "neutral",
            },
            {
              label: "Comment",
              description: "id, text, author, post",
              type: "client",
            },
          ]}
        />
        <div className="mt-3 bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <strong className="text-purple-400">Graph Structure:</strong> A User has many Posts.
            Each Post has one Author (User) and many Comments. Each Comment has one Author (User)
            and belongs to one Post. This web of relationships is why it is called
            Graph-QL - you are querying a graph of connected data.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: SCHEMA VALIDATION FLOW
          Shows how the server validates queries against the schema.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          How the Schema Validates Queries
        </h2>
        <FlowDiagram
          title="Schema Validation Flow"
          steps={[
            {
              label: "Client Sends Query",
              description: "{ user(id: \"1\") { name, age } }",
              type: "client",
            },
            {
              label: "Parse Query",
              description: "Convert query string to AST (Abstract Syntax Tree)",
              type: "server",
            },
            {
              label: "Validate Against Schema",
              description: "Check: Does 'user' query exist? Does User type have 'name'? Does it have 'age'?",
              type: "server",
            },
            {
              label: "Validation Result",
              description: "FAIL: 'age' field does not exist on type User. Error returned to client.",
              type: "network",
            },
          ]}
        />
      </section>

      {/* ============================================================
          SECTION 7: KEY TAKEAWAYS
          Summary of the most important schema concepts.
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
                <strong className="text-[var(--color-text-primary)]">The schema is the API contract:</strong> It
                defines every type, field, query, and mutation available. Both client and server
                must agree on the schema.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Five built-in scalars:</strong> String,
                Int, Float, Boolean, and ID are the primitive types. Custom scalars (like DateTime)
                can also be defined.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">! means non-null:</strong> A
                field marked with ! is guaranteed to always have a value. Without !, the
                field can return null.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">[] means array:</strong> Square
                brackets indicate a list of items. Combine with ! for strictness:
                [Post!]! means a non-null array of non-null posts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Query and Mutation are special root types:</strong> The
                Query type defines all read operations and the Mutation type defines all
                write operations. They are the entry points into your API graph.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Schemas enable tooling:</strong> Because
                the schema defines everything, tools like GraphiQL, Apollo DevTools, and IDE
                plugins can provide auto-completion, validation, and documentation automatically.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
