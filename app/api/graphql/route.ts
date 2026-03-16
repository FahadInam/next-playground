/**
 * =============================================================================
 * GraphQL API Route Handler
 * =============================================================================
 *
 * THIS IS A SERVER-ONLY FILE.
 * ───────────────────────────
 * In Next.js App Router, any file named `route.ts` inside the `app/api/`
 * directory tree is a "Route Handler." Route Handlers run EXCLUSIVELY on the
 * server — they are never bundled into client-side JavaScript. The browser
 * never sees this code; it only communicates with it via HTTP requests.
 *
 * This is important because:
 *   1. We can safely use server-side libraries (like graphql-yoga) that
 *      would be too large or insecure to ship to the browser.
 *   2. Our in-memory data store (defined in schema.ts) lives in the
 *      Node.js process and is inaccessible to the client.
 *   3. In a real app, this is where you'd connect to databases, read
 *      environment variables with secrets, etc.
 *
 * HOW THIS FILE FITS INTO THE NEXT.JS REQUEST LIFECYCLE:
 * ──────────────────────────────────────────────────────
 * When a request arrives at `/api/graphql`, Next.js does the following:
 *
 *   1. The incoming HTTP request (GET or POST) hits the Next.js server.
 *   2. Next.js matches the URL `/api/graphql` to this file because of its
 *      path: `app/api/graphql/route.ts`.
 *   3. Next.js calls the exported function that matches the HTTP method:
 *      - GET request  → calls the `GET` export
 *      - POST request → calls the `POST` export
 *   4. Our exported handler (which is the GraphQL Yoga instance) receives
 *      the standard Web API `Request` object.
 *   5. GraphQL Yoga parses the GraphQL query from the request (from the
 *      query string for GET, or from the JSON body for POST).
 *   6. Yoga executes the query against our schema, calling the appropriate
 *      resolver functions defined in `schema.ts`.
 *   7. The resolvers return data, which Yoga serialises into a JSON
 *      response conforming to the GraphQL specification.
 *   8. Yoga returns a standard Web API `Response` object.
 *   9. Next.js sends that response back to the client.
 *
 * WHY GRAPHQL YOGA?
 * ─────────────────
 * GraphQL Yoga is a fully-featured, spec-compliant GraphQL server that is
 * designed to work in any JavaScript runtime (Node.js, Deno, Bun, Cloudflare
 * Workers, and — crucially — Next.js Edge and Serverless environments).
 *
 * Key features we leverage:
 *   - `createSchema()` — builds an executable GraphQL schema from our type
 *     definitions string and resolver object.
 *   - `createYoga()` — creates a request handler that understands GraphQL
 *     over HTTP, including:
 *       • Parsing queries from GET (query params) and POST (JSON body).
 *       • Content negotiation and proper HTTP headers.
 *       • An optional built-in GraphiQL IDE (an interactive playground
 *         you can open in the browser to test queries).
 *       • Proper error formatting per the GraphQL spec.
 *   - It uses the standard Web `Request`/`Response` APIs, which is exactly
 *     what Next.js App Router expects from Route Handlers.
 *
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

/**
 * `createYoga` — Factory function that creates the main GraphQL HTTP handler.
 * It returns a function that accepts a Web API Request and returns a Response.
 *
 * `createSchema` — Utility that takes type definitions (SDL string) and a
 * resolvers object and produces an executable GraphQL schema. This schema
 * is what Yoga uses internally to validate and execute incoming queries.
 */
import { createYoga, createSchema } from "graphql-yoga";

/**
 * Import our schema definition and resolvers from the shared schema module.
 *
 * - `typeDefs` is the GraphQL SDL string defining types, queries, mutations.
 * - `resolvers` is the object with functions that fetch/compute field values.
 *
 * The `@/` prefix is a Next.js path alias that resolves to the project root,
 * so `@/app/graphql/schema` points to `app/graphql/schema.ts`. This avoids
 * fragile relative paths like `../../graphql/schema`.
 */
import { typeDefs, resolvers } from "@/app/graphql/schema";

// -----------------------------------------------------------------------------
// Create the GraphQL Yoga Instance
// -----------------------------------------------------------------------------

/**
 * `createYoga()` builds the GraphQL server instance. We pass it:
 *
 * 1. `schema` — The executable GraphQL schema, built by `createSchema()`
 *    from our type definitions and resolvers. This tells Yoga what types
 *    exist, what queries/mutations are available, and how to resolve each
 *    field.
 *
 * 2. `graphqlEndpoint` — The URL path where the GraphQL API is served.
 *    This must match the file's location in the `app/api/` directory.
 *    Yoga uses this to:
 *      - Correctly configure the built-in GraphiQL IDE's fetch URL.
 *      - Handle CORS and other path-specific logic.
 *    If this doesn't match your actual route, the GraphiQL playground
 *    will try to send requests to the wrong URL.
 *
 * 3. `fetchAPI: { Response }` — Tells Yoga to use the global Web API
 *    `Response` constructor available in the Next.js server environment.
 *    This ensures compatibility because different JavaScript runtimes
 *    (Node.js, Edge, Workers) may provide the Response class in different
 *    ways. By explicitly passing it, we guarantee Yoga uses the right one.
 */
const yoga = createYoga({
  // Build the executable schema from our SDL string and resolver functions.
  schema: createSchema({
    typeDefs,   // The GraphQL Schema Definition Language string.
    resolvers,  // The resolver functions that implement each field.
  }),

  // The URL path this GraphQL endpoint is served at. Must match the
  // file system path: app/api/graphql/route.ts → /api/graphql.
  graphqlEndpoint: "/api/graphql",

  // Provide the Response constructor from the current runtime environment.
  // This ensures GraphQL Yoga creates responses compatible with Next.js.
  fetchAPI: { Response },
});

// -----------------------------------------------------------------------------
// Export the Handler for Next.js
// -----------------------------------------------------------------------------

/**
 * GraphQL Yoga's handler type doesn't perfectly match the type signature
 * that Next.js expects for Route Handlers. Next.js expects:
 *
 *   (request: Request) => Promise<Response>
 *
 * While Yoga's handler is a more complex object with additional methods.
 * The `as unknown as ...` cast bridges this gap. At runtime, Yoga's handler
 * IS callable with (Request) => Promise<Response>, so this cast is safe —
 * it just satisfies the TypeScript compiler.
 *
 * WHY BOTH GET AND POST?
 * ──────────────────────
 * GraphQL queries can be sent via either HTTP method:
 *
 * - GET requests carry the query in URL query parameters. This is mainly
 *   used for simple queries and enables HTTP caching. Example:
 *   GET /api/graphql?query={users{name}}
 *
 * - POST requests carry the query in the JSON request body. This is the
 *   standard method for most GraphQL clients (Apollo, urql, etc.) and is
 *   required for mutations (write operations) by convention.
 *   POST /api/graphql  { "query": "{ users { name } }" }
 *
 * By exporting the same handler for both GET and POST, we support both
 * methods, which means:
 *   - The GraphiQL IDE (browser playground) works (it uses both methods).
 *   - Standard GraphQL client libraries work out of the box.
 *   - Simple testing via browser URL bar works (GET with query params).
 */
const handler = yoga as unknown as (request: Request) => Promise<Response>;

/**
 * Export the handler as both GET and POST, which tells Next.js:
 * "When an HTTP GET or POST request arrives at /api/graphql, call this
 * function with the incoming Request and send back the Response it returns."
 */
export { handler as GET, handler as POST };
