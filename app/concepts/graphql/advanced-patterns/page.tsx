// ADVANCED GRAPHQL PATTERNS - CONCEPT PAGE - SERVER COMPONENT
// ===========================================================
// This page covers advanced GraphQL patterns that go beyond basic queries
// and mutations: the N+1 problem, DataLoader, schema stitching & federation,
// query complexity & security, and fragments & variables.
//
// ARCHITECTURE NOTE:
// This is a SERVER COMPONENT (no "use client" directive).
// All JSX is rendered on the server and sent as HTML to the browser.
// Only the CodeBlock child component hydrates on the client (for copy-to-clipboard).
//
// WHY SERVER COMPONENT?
// - This is purely educational content — no interactivity needed
// - Zero client JavaScript for the page shell
// - FlowDiagram and ConceptPage are also Server Components
// - Only CodeBlock requires hydration (it has a copy button with onClick + useState)
//
// RENDERING FLOW:
// 1. Next.js calls this function on the server at request/build time
// 2. React renders the JSX tree to HTML on the server
// 3. The browser receives fully-formed HTML — no JS needed for layout
// 4. Only CodeBlock islands hydrate on the client for interactive copy buttons

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function AdvancedGraphQLPatternsPage() {
  // ---------------------------------------------------------------
  // This entire function executes on the server.
  // The browser never downloads or runs this code — it only
  // receives the rendered HTML output.
  // ---------------------------------------------------------------

  return (
    <ConceptPage
      title="Advanced GraphQL Patterns"
      description="Once you know the basics of GraphQL — schemas, queries, mutations, and resolvers — it's time to learn the power patterns that make production GraphQL fast, secure, and maintainable. This page covers the N+1 problem, DataLoader, schema federation, security, and reusable fragments."
      serverOrClient="server"
    >
      {/* ================================================================= */}
      {/* SECTION 1: Layman Explanation                                     */}
      {/* ================================================================= */}
      {/*
        Start with a simple analogy so learners grasp the "why" before
        diving into technical details. This section is entirely static
        HTML — no client JS involved at all.
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Layman Explanation: Power Moves
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Think of learning GraphQL like learning a video game. The basics — schemas, queries,
            mutations — are like learning how to move, jump, and attack. <strong className="text-[var(--color-text-primary)]">Advanced patterns</strong> are
            the shortcuts, combos, and power moves that separate beginners from experts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left card: the analogy */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-2">Game Analogy</h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">1.</span>
                  <span><strong>N+1 Problem</strong> = Pressing one button per enemy instead of a combo that hits them all</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">2.</span>
                  <span><strong>DataLoader</strong> = The combo move — batch all hits into one powerful strike</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">3.</span>
                  <span><strong>Federation</strong> = Multiple players working together, each handling their speciality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">4.</span>
                  <span><strong>Security</strong> = Setting rules so no player can cheat or crash the game</span>
                </li>
              </ul>
            </div>
            {/* Right card: why these matter */}
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-2">Why These Matter</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                A basic GraphQL server works fine in development. But in production with
                thousands of users, you&apos;ll hit real problems: slow queries, server crashes
                from malicious requests, and unmaintainable monolith schemas. These advanced
                patterns solve all of that.
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Every production GraphQL API uses at least some of these patterns.
                Understanding them is what separates a tutorial project from a real-world API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2: The N+1 Problem                                        */}
      {/* ================================================================= */}
      {/*
        The N+1 problem is the most common performance pitfall in GraphQL.
        It arises because GraphQL resolves fields independently — each
        resolver doesn't know what other resolvers have already fetched.

        SERVER COMPONENT NOTE:
        All the code examples below are rendered to static HTML on the server.
        The CodeBlock component will hydrate on the client only for the copy button.
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The N+1 Problem
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            The N+1 problem is the #1 performance trap in GraphQL. It happens when you fetch
            a list of items (1 query), then for <em>each</em> item you make a separate query
            to fetch related data (N queries). So a list of 50 posts with authors = 51 database queries.
          </p>

          {/* Visual explanation of the problem */}
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20 mb-4">
            <h3 className="text-red-400 font-semibold mb-2">The Problem Visualized</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Imagine a client queries <code className="text-red-400">posts &#123; title author &#123; name &#125; &#125;</code>.
              GraphQL first resolves <code className="text-red-400">posts</code> (1 query to get 50 posts),
              then for each post it calls the <code className="text-red-400">author</code> resolver separately —
              that&apos;s 50 more queries, even if many posts share the same author!
            </p>
          </div>

          {/* Code: The N+1 problem in action */}
          <CodeBlock
            filename="resolvers-with-n-plus-1.ts"
            language="typescript"
            highlights={[12, 13, 14, 15, 16]}
            code={`// THE N+1 PROBLEM IN ACTION
// =========================
// This resolver setup LOOKS correct but has a hidden performance issue.

const resolvers = {
  Query: {
    // 1 query: "SELECT * FROM posts" — fetches all 50 posts
    posts: () => db.query("SELECT * FROM posts"),
  },

  Post: {
    // Called once PER POST — 50 separate queries!
    // "SELECT * FROM users WHERE id = ?" x 50 times
    // Even if 30 posts share the same author, we query 50 times.
    author: (post) => db.query(
      "SELECT * FROM users WHERE id = ?", [post.authorId]
    ),
  },
};

// Total queries: 1 (posts) + 50 (authors) = 51 queries!
// With 1000 posts, that's 1001 queries for a single GraphQL request.`}
          />

          {/* FlowDiagram: N+1 problem flow */}
          <div className="mt-4">
            <FlowDiagram
              title="N+1 Problem: 51 Queries for 50 Posts"
              steps={[
                { label: "Client sends query", description: "posts { title author { name } }", type: "client" },
                { label: "Query: SELECT * FROM posts", description: "1 query returns 50 posts", type: "server" },
                { label: "Resolve author for post #1", description: "SELECT * FROM users WHERE id = 1", type: "server" },
                { label: "Resolve author for post #2", description: "SELECT * FROM users WHERE id = 2", type: "server" },
                { label: "... repeat for all 50 posts", description: "48 more individual queries!", type: "server" },
                { label: "Return combined result", description: "51 total database queries", type: "network" },
              ]}
            />
          </div>

          {/* The solution: batching */}
          <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20 mt-4">
            <h3 className="text-green-400 font-semibold mb-2">The Solution: Batch Loading</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Instead of making 50 individual queries, collect all the author IDs first,
              then make a <strong>single</strong> query: <code className="text-green-400">SELECT * FROM users WHERE id IN (1, 2, 3, ...)</code>.
              This turns 51 queries into just 2 queries. That&apos;s what DataLoader does automatically.
            </p>
          </div>

          {/* Code: The batched solution */}
          <CodeBlock
            filename="resolvers-batched.ts"
            language="typescript"
            highlights={[8, 9, 10]}
            code={`// THE BATCHED SOLUTION
// ====================
// Instead of N individual queries, batch all IDs into one query.

const resolvers = {
  Post: {
    author: async (post, _, context) => {
      // DataLoader collects all authorIds during this tick,
      // then fires ONE batched query for all of them.
      return context.loaders.userLoader.load(post.authorId);
    },
  },
};

// Total queries: 1 (posts) + 1 (batched authors) = 2 queries!
// No matter how many posts — always just 2 queries.`}
          />

          {/* FlowDiagram: Batched flow */}
          <div className="mt-4">
            <FlowDiagram
              title="DataLoader Batched: Only 2 Queries for 50 Posts"
              steps={[
                { label: "Client sends query", description: "posts { title author { name } }", type: "client" },
                { label: "Query: SELECT * FROM posts", description: "1 query returns 50 posts", type: "server" },
                { label: "DataLoader collects IDs", description: "Gathers authorIds: [1, 2, 3, ...]", type: "neutral" },
                { label: "Single batched query", description: "SELECT * FROM users WHERE id IN (1,2,3,...)", type: "server" },
                { label: "Return combined result", description: "Only 2 total database queries!", type: "network" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3: DataLoader                                             */}
      {/* ================================================================= */}
      {/*
        DataLoader is a utility by Facebook that solves the N+1 problem.
        It works by delaying resolver execution within a single tick of
        the event loop, then batching all collected IDs into one call.

        KEY CONCEPTS:
        - Batching: collect all .load(id) calls, fire one batch function
        - Caching: within a single request, the same ID returns the same Promise
        - Per-request instances: create a new DataLoader per GraphQL request
          to avoid stale data across different users/requests
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          DataLoader: Batching & Deduplication
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            <strong className="text-[var(--color-text-primary)]">DataLoader</strong> is a utility originally
            created by Facebook. It sits between your resolvers and your data source, automatically
            batching and deduplicating requests within a single GraphQL operation.
          </p>

          {/* How DataLoader works — two key features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-2">Batching</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                When multiple resolvers call <code className="text-blue-400">loader.load(id)</code> in the
                same tick, DataLoader collects all IDs and calls your batch function once
                with the full array: <code className="text-blue-400">batchFn([id1, id2, id3])</code>.
              </p>
            </div>
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">Deduplication</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                If 30 out of 50 posts share the same author, DataLoader deduplicates the IDs.
                Instead of loading <code className="text-purple-400">[1, 1, 1, 2, 2, 3]</code> it loads{" "}
                <code className="text-purple-400">[1, 2, 3]</code> — only unique IDs.
              </p>
            </div>
          </div>

          {/* Full DataLoader implementation */}
          <CodeBlock
            filename="dataloader-setup.ts"
            language="typescript"
            highlights={[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]}
            code={`// DATALOADER IMPLEMENTATION
// =========================
// DataLoader requires a "batch function" that takes an array of keys
// and returns an array of results in the SAME ORDER as the keys.

import DataLoader from "dataloader";
import { db } from "./database";

// The batch function: takes an array of user IDs,
// returns an array of user objects in the same order.
function createUserLoader() {
  return new DataLoader<number, User>(async (userIds) => {
    // One query for ALL requested users
    const users = await db.query(
      "SELECT * FROM users WHERE id IN (?)",
      [userIds]
    );

    // IMPORTANT: DataLoader requires results in the same order as keys.
    // The database might return results in any order, so we map them.
    const userMap = new Map(users.map((u) => [u.id, u]));
    return userIds.map((id) => userMap.get(id) || null);
  });
}

// Create a fresh loader PER REQUEST (not globally!)
// This ensures caching doesn't leak between different users/requests.
export function createLoaders() {
  return {
    userLoader: createUserLoader(),
    postLoader: createPostLoader(),
    commentLoader: createCommentLoader(),
  };
}`}
          />

          {/* Integrating DataLoader with resolvers */}
          <CodeBlock
            filename="resolvers-with-dataloader.ts"
            language="typescript"
            highlights={[12, 21]}
            code={`// INTEGRATING DATALOADER WITH GRAPHQL RESOLVERS
// ===============================================
// The key is creating loaders per-request in the context.

import { createLoaders } from "./dataloaders";

// In your Apollo Server setup, create loaders in the context factory.
// Each request gets fresh loader instances (no cross-request caching).
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    loaders: createLoaders(), // Fresh loaders per request
    user: authenticateUser(req),
  }),
});

// In your resolvers, use loaders from context instead of direct DB calls
const resolvers = {
  Post: {
    // Instead of: db.query("SELECT * FROM users WHERE id = ?", [post.authorId])
    author: (post, _, { loaders }) => loaders.userLoader.load(post.authorId),
  },

  Comment: {
    // DataLoader works for any entity relationship
    author: (comment, _, { loaders }) => loaders.userLoader.load(comment.authorId),
    post: (comment, _, { loaders }) => loaders.postLoader.load(comment.postId),
  },

  User: {
    // You can also batch "reverse" lookups (one-to-many)
    posts: (user, _, { loaders }) => loaders.postsByAuthorLoader.load(user.id),
  },
};`}
          />

          {/* Important gotcha */}
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20 mt-4">
            <h3 className="text-orange-400 font-semibold mb-2">Common Gotcha: Result Order</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              DataLoader requires your batch function to return results in the <strong>exact same order</strong> as
              the input keys. If you request IDs <code className="text-orange-400">[3, 1, 2]</code>, you must
              return <code className="text-orange-400">[user3, user1, user2]</code>. A SQL{" "}
              <code className="text-orange-400">WHERE IN</code> clause does NOT guarantee order, so you always
              need to re-map the results.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 4: Schema Stitching & Federation                          */}
      {/* ================================================================= */}
      {/*
        As a GraphQL API grows, a single monolith schema becomes hard to
        maintain. Two solutions exist:
        1. Schema Stitching — merging multiple schemas into one gateway
        2. Apollo Federation — a more structured approach where each service
           declares its own types and the gateway composes them.

        SERVER COMPONENT NOTE:
        These code examples are large but they're all rendered to HTML on the
        server. The client only receives the final HTML + minimal JS for
        CodeBlock copy buttons.
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Schema Stitching & Federation
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            When your GraphQL API grows large, maintaining a single monolith schema becomes painful.
            Two patterns solve this: <strong className="text-[var(--color-text-primary)]">Schema Stitching</strong> (merging
            schemas) and <strong className="text-[var(--color-text-primary)]">Apollo Federation</strong> (composing
            microservice schemas into a unified graph).
          </p>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-2">Schema Stitching</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>- Merge multiple schemas at the gateway level</li>
                <li>- The gateway must know about all services</li>
                <li>- Uses <code className="text-blue-400">@graphql-tools/stitch</code></li>
                <li>- Good for simple cases or legacy APIs</li>
                <li>- Gateway handles all cross-service logic</li>
              </ul>
            </div>
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">Apollo Federation</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>- Each service owns and declares its types</li>
                <li>- Services can extend types from other services</li>
                <li>- Uses <code className="text-purple-400">@apollo/federation</code></li>
                <li>- Production-grade for large teams</li>
                <li>- Each team manages their own subgraph</li>
              </ul>
            </div>
          </div>

          {/* Schema Stitching code example */}
          <CodeBlock
            filename="schema-stitching-gateway.ts"
            language="typescript"
            highlights={[14, 15, 16, 17, 18]}
            code={`// SCHEMA STITCHING EXAMPLE
// ========================
// The gateway fetches schemas from multiple services
// and merges them into one unified schema.

import { stitchSchemas } from "@graphql-tools/stitch";
import { makeExecutableSchema } from "@graphql-tools/schema";

// Each service provides its own schema
const userSchema = makeExecutableSchema({
  typeDefs: \`
    type User {
      id: ID!
      name: String!
      email: String!
    }
    type Query {
      user(id: ID!): User
      users: [User!]!
    }
  \`,
  resolvers: userResolvers,
});

const postSchema = makeExecutableSchema({
  typeDefs: \`
    type Post {
      id: ID!
      title: String!
      body: String!
      authorId: ID!    # Raw ID — no User type here
    }
    type Query {
      post(id: ID!): Post
      posts: [Post!]!
    }
  \`,
  resolvers: postResolvers,
});

// Stitch them together at the gateway
const gatewaySchema = stitchSchemas({
  subschemas: [
    { schema: userSchema },
    { schema: postSchema },
  ],
  // Add cross-service relationships manually
  typeDefs: \`
    extend type Post {
      author: User!
    }
  \`,
  resolvers: {
    Post: {
      author: {
        selectionSet: "{ authorId }",
        resolve(post, _args, context, info) {
          // Delegate to the user service
          return delegateToSchema({
            schema: userSchema,
            operation: "query",
            fieldName: "user",
            args: { id: post.authorId },
            context,
            info,
          });
        },
      },
    },
  },
});`}
          />

          {/* Apollo Federation code example */}
          <CodeBlock
            filename="federation-user-service.ts"
            language="typescript"
            highlights={[6, 7, 8]}
            code={`// APOLLO FEDERATION — USER SERVICE (subgraph)
// =============================================
// Each service defines its own portion of the graph.
// The @key directive tells the gateway how to look up this entity.

import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";

const typeDefs = gql\`
  # The @key directive marks User as an entity that other services
  # can reference by its "id" field.
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }
\`;

const resolvers = {
  Query: {
    users: () => db.users.findAll(),
    user: (_, { id }) => db.users.findById(id),
  },
  User: {
    // __resolveReference is called by the gateway when another
    // service references a User entity by its key (id).
    __resolveReference: (ref) => db.users.findById(ref.id),
  },
};

export const schema = buildSubgraphSchema({ typeDefs, resolvers });`}
          />

          <CodeBlock
            filename="federation-post-service.ts"
            language="typescript"
            highlights={[9, 10, 11]}
            code={`// APOLLO FEDERATION — POST SERVICE (subgraph)
// =============================================
// This service owns Posts but can EXTEND the User type
// from the user service to add a "posts" field.

import { buildSubgraphSchema } from "@apollo/subgraph";
import { gql } from "graphql-tag";

const typeDefs = gql\`
  # Extend the User entity defined in the user service.
  # We add a "posts" field that this service resolves.
  extend type User @key(fields: "id") {
    id: ID! @external    # id exists in user service, not here
    posts: [Post!]!      # This service owns this field
  }

  type Post @key(fields: "id") {
    id: ID!
    title: String!
    body: String!
    author: User!
  }

  type Query {
    posts: [Post!]!
    post(id: ID!): Post
  }
\`;

const resolvers = {
  Query: {
    posts: () => db.posts.findAll(),
    post: (_, { id }) => db.posts.findById(id),
  },
  Post: {
    // Return a reference to User — the gateway fetches the full User
    // from the user service using __resolveReference.
    author: (post) => ({ __typename: "User", id: post.authorId }),
  },
  User: {
    // Resolve the "posts" field we added to User
    posts: (user) => db.posts.findByAuthorId(user.id),
  },
};

export const schema = buildSubgraphSchema({ typeDefs, resolvers });`}
          />

          {/* FlowDiagram: Federation architecture */}
          <div className="mt-4">
            <FlowDiagram
              title="Apollo Federation: Gateway Composes Subgraphs"
              steps={[
                { label: "Client sends query", description: "{ user(id: 1) { name posts { title } } }", type: "client" },
                { label: "Gateway receives query", description: "Builds a query plan across services", type: "network" },
                { label: "User Service", description: "Resolves: id, name, email", type: "server" },
                { label: "Post Service", description: "Resolves: posts for User id=1", type: "server" },
                { label: "Gateway merges results", description: "Combines data from both services", type: "network" },
                { label: "Client receives response", description: "Unified response from one endpoint", type: "client" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 5: Query Complexity & Security                            */}
      {/* ================================================================= */}
      {/*
        GraphQL's flexibility is a double-edged sword. Clients can construct
        deeply nested or absurdly expensive queries that overwhelm the server.
        This section covers defense mechanisms:
        - Query depth limiting
        - Query complexity analysis
        - Rate limiting

        SECURITY NOTE:
        Without these protections, a single malicious query can take down
        your entire GraphQL server. This is NOT a theoretical concern —
        it has happened to real production APIs.
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Query Complexity & Security
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            GraphQL&apos;s flexibility is also its biggest security risk. Because clients can write
            any query shape they want, a malicious user can craft queries that are
            catastrophically expensive to resolve, potentially crashing your server.
          </p>

          {/* The danger: malicious query example */}
          <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/20 mb-4">
            <h3 className="text-red-400 font-semibold mb-2">Danger: The Billion Laughs Attack</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              A deeply nested query can cause exponential database load. Each nesting level
              multiplies the number of resolver calls. This is trivial for an attacker to craft.
            </p>
          </div>

          {/* Code: Malicious deep query */}
          <CodeBlock
            filename="malicious-query.graphql"
            language="graphql"
            highlights={[3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            code={`# MALICIOUS DEEPLY NESTED QUERY
# ==============================
# Each level multiplies resolver calls exponentially.
# If each user has 10 friends, this query triggers:
# 10 x 10 x 10 x 10 x 10 = 100,000 resolver calls!

query MaliciousQuery {
  users {            # Level 1: 10 users
    friends {        # Level 2: 10 friends each = 100
      friends {      # Level 3: 100 x 10 = 1,000
        friends {    # Level 4: 1,000 x 10 = 10,000
          friends {  # Level 5: 10,000 x 10 = 100,000
            name
          }
        }
      }
    }
  }
}

# A single request could trigger 100,000+ database queries
# and consume gigabytes of memory. Your server crashes.`}
          />

          {/* Three defense strategies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-2">1. Depth Limiting</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Reject any query that nests deeper than a max level (e.g., 7 levels).
                Simple and effective against the deepest attacks.
              </p>
            </div>
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-2">2. Complexity Analysis</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Assign a cost to each field and reject queries whose total cost
                exceeds a threshold. More precise than depth limiting.
              </p>
            </div>
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">3. Rate Limiting</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Limit how many queries (or how much total complexity) a client
                can consume per time window. Prevents sustained abuse.
              </p>
            </div>
          </div>

          {/* Code: Implementing security measures */}
          <CodeBlock
            filename="query-security.ts"
            language="typescript"
            highlights={[9, 10, 22, 23, 24, 25, 26]}
            code={`// QUERY SECURITY IMPLEMENTATION
// ==============================
// Combine multiple layers of defense for production GraphQL.

import { ApolloServer } from "@apollo/server";
import depthLimit from "graphql-depth-limit";
import { createComplexityLimitRule } from "graphql-validation-complexity";

// LAYER 1: Depth Limiting
// Reject any query deeper than 7 levels.
// This stops the "friends of friends of friends..." attack.
const maxDepthRule = depthLimit(7);

// LAYER 2: Complexity Analysis
// Assign a cost to each field; reject if total cost > 1000.
// Lists multiply the cost of their children by their expected size.
const complexityRule = createComplexityLimitRule(1000, {
  // Scalar fields cost 1 point
  scalarCost: 1,
  // Object fields cost 2 points
  objectCost: 2,
  // List fields multiply child cost by estimated size
  listFactor: 10,
  // "friends" field is especially expensive
  // because it returns a list of users (which have friends, etc.)
  fieldCost: {
    "User.friends": 50,
  },
});

// Combine both rules in your Apollo Server configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [maxDepthRule, complexityRule],
});

// LAYER 3: Rate Limiting (middleware-level)
// Use a library like graphql-rate-limit or express-rate-limit
// to limit requests per IP/user per time window.
//
// Example with express-rate-limit:
// app.use("/graphql", rateLimit({
//   windowMs: 15 * 60 * 1000,   // 15-minute window
//   max: 100,                    // 100 requests per window
//   message: "Too many requests"
// }));`}
          />

          {/* Code: Per-field complexity with directives */}
          <CodeBlock
            filename="schema-with-cost-directives.graphql"
            language="graphql"
            highlights={[6, 11]}
            code={`# SCHEMA WITH COST DIRECTIVES
# ============================
# Some GraphQL implementations let you annotate fields
# with their cost directly in the schema.

type User {
  id: ID!
  name: String!
  email: String!
  # The @cost directive tells the complexity analyzer
  # that resolving "friends" is expensive.
  friends: [User!]! @cost(complexity: 50, multipliers: ["first"])
  posts(first: Int = 10): [Post!]! @cost(complexity: 10, multipliers: ["first"])
}

type Query {
  users(first: Int = 20): [User!]! @cost(complexity: 5, multipliers: ["first"])
  user(id: ID!): User @cost(complexity: 1)
}`}
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 6: Fragments & Variables                                  */}
      {/* ================================================================= */}
      {/*
        Fragments and variables are two features that make GraphQL queries
        more reusable and dynamic:
        - Fragments: named sets of fields you can reuse across queries
        - Variables: parameterize queries so you don't hardcode values

        These are client-side query features, but understanding them is
        essential for writing maintainable GraphQL code.

        SERVER COMPONENT NOTE:
        Even though fragments/variables are used on the client side,
        this educational content is still rendered as a Server Component.
        We're teaching concepts, not executing GraphQL queries.
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Fragments & Variables
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            <strong className="text-[var(--color-text-primary)]">Fragments</strong> let you define reusable
            sets of fields, and <strong className="text-[var(--color-text-primary)]">Variables</strong> let
            you parameterize queries so you don&apos;t hardcode values. Together, they make your
            GraphQL queries DRY, type-safe, and dynamic.
          </p>

          {/* Fragments section */}
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20 mb-4">
            <h3 className="text-blue-400 font-semibold mb-2">Fragments: Reusable Field Sets</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Without fragments, you repeat the same field selections across multiple queries.
              A fragment extracts those fields into a named, reusable block — like a function for
              your query&apos;s field selection.
            </p>
          </div>

          {/* Code: Without fragments (the problem) */}
          <CodeBlock
            filename="without-fragments.graphql"
            language="graphql"
            highlights={[5, 6, 7, 13, 14, 15]}
            code={`# WITHOUT FRAGMENTS: Repetitive field selections
# ================================================
# Notice how we repeat the same User fields in two places.

query GetDashboard {
  currentUser {
    id
    name
    email
    avatar
    createdAt
  }
  topContributors {
    id          # Repeated!
    name        # Repeated!
    email       # Repeated!
    avatar      # Repeated!
    createdAt   # Repeated!
    postCount
  }
}`}
          />

          {/* Code: With fragments (the solution) */}
          <CodeBlock
            filename="with-fragments.graphql"
            language="graphql"
            highlights={[3, 4, 5, 6, 7, 8, 9, 14, 18]}
            code={`# WITH FRAGMENTS: DRY and maintainable
# ======================================
# Define the reusable fields once as a fragment.

fragment UserFields on User {
  id
  name
  email
  avatar
  createdAt
}

query GetDashboard {
  # Spread the fragment wherever you need those fields
  currentUser {
    ...UserFields
  }
  topContributors {
    ...UserFields      # Same fields, no repetition
    postCount          # Plus additional fields specific to this context
  }
}

# If you need to add a field to User, change it in ONE place.
# All queries using ...UserFields automatically get the update.`}
          />

          {/* Code: Inline fragments for union/interface types */}
          <CodeBlock
            filename="inline-fragments.graphql"
            language="graphql"
            highlights={[8, 9, 10, 11, 12, 13, 14]}
            code={`# INLINE FRAGMENTS: For union and interface types
# ================================================
# When a field can return different types, use inline fragments
# to select type-specific fields.

query SearchResults {
  search(query: "graphql") {
    # Common fields for all SearchResult types
    __typename

    # Type-specific fields using inline fragments
    ... on Article {
      title
      body
      author { name }
    }
    ... on Video {
      title
      duration
      thumbnailUrl
    }
    ... on User {
      name
      avatar
    }
  }
}`}
          />

          {/* Variables section */}
          <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20 mb-4 mt-6">
            <h3 className="text-purple-400 font-semibold mb-2">Variables: Dynamic Queries</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Variables let you parameterize your queries instead of hardcoding values.
              This is essential for building real applications where the query shape stays
              the same but the inputs change (e.g., different user IDs, search terms, pagination).
            </p>
          </div>

          {/* Code: Without variables (bad) */}
          <CodeBlock
            filename="without-variables.graphql"
            language="graphql"
            code={`# WITHOUT VARIABLES: Hardcoded values (bad practice)
# ==================================================
# You'd need string interpolation to change values,
# which breaks caching and opens you to injection attacks.

query {
  user(id: "123") {
    name
    posts(first: 10, orderBy: "createdAt") {
      title
    }
  }
}

# To change the user ID, you'd need to build a new query string.
# This bypasses GraphQL's type system and is NOT safe.`}
          />

          {/* Code: With variables (good) */}
          <CodeBlock
            filename="with-variables.graphql"
            language="graphql"
            highlights={[5, 6, 7, 8, 9]}
            code={`# WITH VARIABLES: Type-safe and dynamic (best practice)
# =====================================================
# Declare variables with their types, then use them in the query.

query GetUserPosts(
  $userId: ID!           # Required variable
  $first: Int = 10       # Optional with default value
  $orderBy: String = "createdAt"
) {
  user(id: $userId) {
    name
    posts(first: $first, orderBy: $orderBy) {
      title
      createdAt
    }
  }
}

# Variables are passed separately as JSON:
# {
#   "userId": "123",
#   "first": 5,
#   "orderBy": "likes"
# }
#
# Benefits:
# - Type-safe: GraphQL validates variable types
# - Cacheable: query string is always the same
# - Safe: no string interpolation = no injection attacks
# - Reusable: same query, different inputs`}
          />

          {/* Code: Using fragments + variables together in a real app */}
          <CodeBlock
            filename="fragments-and-variables-react.tsx"
            language="typescript"
            highlights={[4, 5, 6, 7, 8, 9, 10, 22]}
            code={`// FRAGMENTS + VARIABLES IN A REAL REACT APP
// ==========================================
// This is how you'd actually use these in a Next.js/React app.

import { gql, useQuery } from "@apollo/client";

// Define reusable fragments
const USER_FRAGMENT = gql\`
  fragment UserCard on User {
    id
    name
    avatar
    role
  }
\`;

// Use fragments and variables together in a query
const GET_TEAM = gql\`
  \${USER_FRAGMENT}

  query GetTeam($teamId: ID!, $first: Int = 20) {
    team(id: $teamId) {
      name
      members(first: $first) {
        ...UserCard
      }
      lead {
        ...UserCard
      }
    }
  }
\`;

// In your component, pass variables dynamically
function TeamPage({ teamId }: { teamId: string }) {
  const { data, loading } = useQuery(GET_TEAM, {
    variables: { teamId, first: 50 },
  });

  // ...render the team
}`}
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 7: Practice Exercises                                     */}
      {/* ================================================================= */}
      {/*
        Three levels of exercises to reinforce the concepts:
        - Beginner: focuses on fragments and variables
        - Intermediate: implement DataLoader
        - Advanced: add security to a production API

        SERVER COMPONENT NOTE:
        These are static exercise descriptions — no interactivity.
        If we wanted interactive exercises (e.g., a code editor),
        we'd need a Client Component with "use client".
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Practice Exercises
        </h2>
        <div className="space-y-4">
          {/* Beginner */}
          <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-2">Beginner: Refactor with Fragments</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              Take the following query that repeats User fields in three places and refactor
              it to use a fragment. Then add a variable for the team ID.
            </p>
            <CodeBlock
              language="graphql"
              filename="exercise-beginner.graphql"
              code={`# EXERCISE: Refactor this query to use fragments and variables.
# Hints:
#   1. Extract the repeated User fields into a "fragment UserInfo on User"
#   2. Replace the hardcoded team ID with a $teamId variable
#   3. Add a default value for the "first" argument

query {
  team(id: "team-42") {
    lead {
      id
      name
      email
      avatar
    }
    members(first: 10) {
      id
      name
      email
      avatar
    }
    recentlyActive {
      id
      name
      email
      avatar
      lastSeen
    }
  }
}`}
            />
          </div>

          {/* Intermediate */}
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-2">Intermediate: Implement a DataLoader</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              Given the database helper below, implement a DataLoader that batches user lookups.
              Make sure to handle the case where a user ID doesn&apos;t exist and return results in
              the correct order.
            </p>
            <CodeBlock
              language="typescript"
              filename="exercise-intermediate.ts"
              code={`// EXERCISE: Create a DataLoader for users.
// The batch function must:
//   1. Accept an array of user IDs
//   2. Fetch all users in a single query
//   3. Return results in the SAME ORDER as the input IDs
//   4. Return null for IDs that don't exist

import DataLoader from "dataloader";

// Given: this database helper returns users in arbitrary order
async function fetchUsersByIds(ids: number[]): Promise<User[]> {
  return db.query("SELECT * FROM users WHERE id IN (?)", [ids]);
}

// TODO: Implement this function
function createUserLoader() {
  return new DataLoader<number, User | null>(async (ids) => {
    // Your implementation here:
    // 1. Call fetchUsersByIds with the ids
    // 2. Create a Map from id -> user
    // 3. Map over the original ids to preserve order
    // 4. Return null for missing users
  });
}`}
            />
          </div>

          {/* Advanced */}
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
            <h3 className="text-orange-400 font-semibold mb-2">Advanced: Secure a GraphQL API</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              You have a GraphQL API with a <code className="text-orange-400">User</code> type that has
              a <code className="text-orange-400">friends</code> field. Without protection, an attacker
              can craft a deeply nested query. Add three layers of defense:
            </p>
            <CodeBlock
              language="typescript"
              filename="exercise-advanced.ts"
              code={`// EXERCISE: Add security to this GraphQL server.
// Requirements:
//   1. Add query depth limiting (max 5 levels)
//   2. Add complexity analysis (max cost: 500)
//   3. Add rate limiting (50 requests per 15 minutes)
//   4. Log rejected queries for monitoring

import { ApolloServer } from "@apollo/server";
import express from "express";

const typeDefs = \`
  type User {
    id: ID!
    name: String!
    friends: [User!]!    # This recursive field is the danger
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    author: User!        # This can also be used for nesting
  }
  type Query {
    users: [User!]!
  }
\`;

// TODO: Configure validation rules and middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Add your security configuration here
});

const app = express();
// Add rate limiting middleware here
app.use("/graphql", /* your middleware */);`}
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 8: Key Takeaways                                          */}
      {/* ================================================================= */}
      {/*
        Summary of the most important points from each section.
        This is the last thing learners see, so it should reinforce
        the core concepts and give them actionable next steps.

        SERVER COMPONENT NOTE:
        This is static content — pure HTML rendered on the server.
        No client-side JavaScript needed.
      */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* N+1 & DataLoader takeaway */}
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold mb-2">N+1 & DataLoader</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>- The N+1 problem is the #1 performance pitfall in GraphQL</li>
                <li>- DataLoader batches and deduplicates resolver calls automatically</li>
                <li>- Always create new DataLoader instances per request</li>
                <li>- Batch function must return results in the same order as input keys</li>
              </ul>
            </div>

            {/* Federation takeaway */}
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-2">Schema Stitching & Federation</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>- Schema stitching merges schemas at the gateway level</li>
                <li>- Apollo Federation lets each service own its types</li>
                <li>- Federation is the production standard for large APIs</li>
                <li>- Services can extend types from other services</li>
              </ul>
            </div>

            {/* Security takeaway */}
            <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
              <h3 className="text-orange-400 font-semibold mb-2">Security</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>- Unlimited queries can crash your server (exponential nesting)</li>
                <li>- Use depth limiting, complexity analysis, and rate limiting together</li>
                <li>- Assign costs to expensive fields like recursive relationships</li>
                <li>- Always log rejected queries for monitoring and tuning</li>
              </ul>
            </div>

            {/* Fragments & Variables takeaway */}
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">Fragments & Variables</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>- Fragments make field selections reusable and DRY</li>
                <li>- Inline fragments handle union and interface types</li>
                <li>- Variables make queries dynamic and type-safe</li>
                <li>- Never use string interpolation — always use variables</li>
              </ul>
            </div>
          </div>

          {/* Final note */}
          <div className="mt-4 p-4 bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-text-muted)]">
              <strong className="text-[var(--color-text-secondary)]">Next steps:</strong> These patterns
              are essential for any production GraphQL API. Start by adding DataLoader to any existing
              project — you&apos;ll immediately see performance improvements. Then add query security
              before deploying to production. Federation becomes important once you have multiple
              teams working on the same API.
            </p>
          </div>
        </div>
      </section>
    </ConceptPage>
  );
}
