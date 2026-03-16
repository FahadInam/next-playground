// CLIENT COMPONENT - Client-Side GraphQL Fetcher Demo
// ====================================================
// This component demonstrates how to fetch GraphQL data from the browser
// using plain fetch(). It is a "use client" component because it uses:
//   1. useState - for managing query results, loading state, error state,
//      fetch count, and timing information
//   2. useCallback - for memoizing the fetch function to avoid recreating
//      it on every render
//   3. onClick handlers - for user interaction (query buttons, refetch)
//   4. fetch() - browser API to make HTTP requests to the GraphQL endpoint
//
// WHAT THIS DEMO SHOWS:
// - Multiple predefined GraphQL queries the user can execute
// - Loading state while the query is in flight
// - Error state when something goes wrong
// - The raw JSON response data from the GraphQL server
// - Fetch count tracking (how many requests have been made)
// - Response timing (how long each fetch took in milliseconds)
// - A "Refetch" button to demonstrate re-querying the same data
//
// This is intentionally using plain fetch() instead of Apollo or urql
// to show that GraphQL doesn't require any special library - it's just
// HTTP POST requests with a specific body format.

"use client";

import { useState, useCallback } from "react";

// =============================================================================
// PREDEFINED QUERIES
// =============================================================================
// These are the GraphQL query strings that the user can execute via buttons.
// Each query demonstrates a different GraphQL capability:
// - Simple list query (users)
// - List with nested relationships (posts with authors)
// - Single item query with variables (specific post by ID)

/**
 * Query to fetch all users with their basic info.
 * This is the simplest query - just a flat list of scalar fields.
 */
const USERS_QUERY = `
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

/**
 * Query to fetch all posts with their nested author relationship.
 * This demonstrates GraphQL's ability to fetch related data in a
 * single request - something that would require multiple REST calls.
 */
const POSTS_QUERY = `
  query GetPosts {
    posts {
      id
      title
      content
      createdAt
      author {
        name
      }
    }
  }
`;

/**
 * Query to fetch a single post by ID, including its author and comments.
 * Uses a GraphQL variable ($id) to parameterize the query.
 * Variables are the proper way to pass dynamic values - never use
 * string interpolation in GraphQL queries as it opens you up to
 * injection attacks (similar to SQL injection).
 */
const POST_BY_ID_QUERY = `
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
      createdAt
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
`;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
// TypeScript interface for our component's internal state tracking.

/** Represents a single fetch attempt with its result and timing info */
interface FetchResult {
  /** The parsed JSON response from the GraphQL server */
  data: Record<string, unknown> | null;
  /** Error message if the fetch failed */
  error: string | null;
  /** How long the fetch took in milliseconds */
  duration: number;
  /** Which query was executed (for display purposes) */
  queryName: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function ClientGraphQLDemo() {
  // ---------------------------------------------------------------------------
  // State declarations
  // ---------------------------------------------------------------------------

  /** The result of the most recent fetch, including data, error, timing */
  const [result, setResult] = useState<FetchResult | null>(null);

  /** Whether a fetch is currently in progress (shows loading spinner) */
  const [loading, setLoading] = useState(false);

  /** Total number of fetches made in this session (persists across queries) */
  const [fetchCount, setFetchCount] = useState(0);

  /** The name of the currently active query (used for the Refetch button) */
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  /** The query string and variables of the last executed query (for refetching) */
  const [lastQuery, setLastQuery] = useState<{
    query: string;
    variables?: Record<string, unknown>;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch function
  // ---------------------------------------------------------------------------
  // useCallback memoizes this function so it doesn't get recreated on every
  // render. This isn't strictly necessary here since we don't pass it as a
  // prop to child components, but it's a good practice for performance.

  /**
   * Executes a GraphQL query against the /api/graphql endpoint.
   *
   * @param query - The GraphQL query string to execute
   * @param variables - Optional variables to pass with the query
   * @param queryName - A human-readable name for display in the UI
   *
   * This function:
   * 1. Sets loading state to true (shows spinner)
   * 2. Records the start time for duration calculation
   * 3. Sends an HTTP POST to /api/graphql with the query in the body
   * 4. Parses the JSON response
   * 5. Calculates the duration
   * 6. Updates state with the result (or error)
   * 7. Increments the fetch counter
   */
  const executeQuery = useCallback(
    async (
      query: string,
      variables: Record<string, unknown> | undefined,
      queryName: string
    ) => {
      // Mark the fetch as in-progress so the UI shows a loading state
      setLoading(true);
      setActiveQuery(queryName);
      setLastQuery({ query, variables });

      // Record the start time so we can calculate how long the fetch takes.
      // performance.now() gives microsecond precision (better than Date.now()).
      const startTime = performance.now();

      try {
        // ---------------------------------------------------------------
        // THE CORE GRAPHQL FETCH
        // ---------------------------------------------------------------
        // This is how ALL GraphQL clients work under the hood:
        // - Method: POST (always POST for GraphQL queries)
        // - Content-Type: application/json
        // - Body: JSON with "query" (the GraphQL string) and optionally
        //   "variables" (dynamic values referenced in the query with $)
        // ---------------------------------------------------------------
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        // Parse the JSON response body
        const json = await response.json();

        // Calculate how long the entire fetch took (including network latency)
        const duration = Math.round(performance.now() - startTime);

        // Check if the GraphQL response contains errors.
        // Note: GraphQL can return BOTH data AND errors simultaneously
        // (partial success). This is different from REST where you get
        // either a success or an error response.
        if (json.errors && !json.data) {
          setResult({
            data: null,
            error: json.errors.map((e: { message: string }) => e.message).join(", "),
            duration,
            queryName,
          });
        } else {
          setResult({
            data: json.data,
            error: null,
            duration,
            queryName,
          });
        }
      } catch (err) {
        // Handle network errors (server down, CORS issues, etc.)
        const duration = Math.round(performance.now() - startTime);
        setResult({
          data: null,
          error: err instanceof Error ? err.message : "Unknown error occurred",
          duration,
          queryName,
        });
      } finally {
        // Always stop the loading state and increment the counter,
        // regardless of success or failure
        setLoading(false);
        setFetchCount((prev) => prev + 1);
      }
    },
    [] // No dependencies - this function is stable across renders
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      {/* Header with component type badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="tag-client">Client Component</span>
        <span className="text-[var(--color-text-muted)] text-sm">
          Fetches GraphQL data from the browser
        </span>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* Query Buttons                                                            */}
      {/* Each button triggers a different predefined GraphQL query.               */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Button 1: Fetch all users */}
        <button
          onClick={() => executeQuery(USERS_QUERY, undefined, "GetUsers")}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Query Users
        </button>

        {/* Button 2: Fetch all posts with authors */}
        <button
          onClick={() => executeQuery(POSTS_QUERY, undefined, "GetPosts")}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Query Posts
        </button>

        {/* Button 3: Fetch a specific post by ID (uses variables) */}
        <button
          onClick={() =>
            executeQuery(POST_BY_ID_QUERY, { id: "1" }, "GetPost(id:1)")
          }
          disabled={loading}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Query Post #1
        </button>

        {/* Refetch button - only visible after at least one query has been made */}
        {lastQuery && (
          <button
            onClick={() =>
              executeQuery(
                lastQuery.query,
                lastQuery.variables,
                activeQuery || "Refetch"
              )
            }
            disabled={loading}
            className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Refetch Last Query
          </button>
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* Stats Bar                                                                */}
      {/* Shows fetch count and last response duration to demonstrate the          */}
      {/* performance characteristics of client-side fetching.                     */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex gap-4 mb-4 text-xs text-[var(--color-text-muted)]">
        <span>
          Total fetches: <span className="text-[var(--color-text-primary)] font-mono">{fetchCount}</span>
        </span>
        {result && (
          <span>
            Last duration:{" "}
            <span className="text-[var(--color-text-primary)] font-mono">{result.duration}ms</span>
          </span>
        )}
        {activeQuery && (
          <span>
            Active query:{" "}
            <span className="text-[var(--color-text-primary)] font-mono">{activeQuery}</span>
          </span>
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* Loading State                                                            */}
      {/* Displayed while the fetch is in progress. In a production app, you'd     */}
      {/* use a skeleton loader or shimmer effect instead of a simple message.      */}
      {/* ---------------------------------------------------------------------- */}
      {loading && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            {/* Simple spinning animation using CSS */}
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-400 text-sm">Fetching from GraphQL server...</span>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* Error State                                                              */}
      {/* Displayed when the GraphQL query returns errors or the fetch fails.      */}
      {/* ---------------------------------------------------------------------- */}
      {result?.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm font-semibold">Error</p>
          <p className="text-red-300 text-sm mt-1 font-mono">{result.error}</p>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* Success State - Response Data                                            */}
      {/* Shows the raw JSON response from the GraphQL server. This demonstrates   */}
      {/* that GraphQL returns data in exactly the shape the query asked for.       */}
      {/* ---------------------------------------------------------------------- */}
      {result?.data && (
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[var(--color-text-muted)]">
              Response from <code className="text-green-400">/api/graphql</code> ({result.queryName}):
            </p>
            <span className="text-xs text-green-400 font-mono">{result.duration}ms</span>
          </div>
          {/* Pretty-print the JSON response with 2-space indentation */}
          <pre className="text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* Empty State                                                              */}
      {/* Shown before any query has been executed.                                 */}
      {/* ---------------------------------------------------------------------- */}
      {!result && !loading && (
        <div className="text-center py-8 text-[var(--color-text-muted)] text-sm">
          Click a query button above to fetch data from the GraphQL API.
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* Footer explanation                                                       */}
      {/* ---------------------------------------------------------------------- */}
      <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
        Each button sends an HTTP POST to /api/graphql with a different query string.
        Open your browser DevTools Network tab to see the actual requests being made.
        Notice how all requests go to the same URL but return different data based on the query.
      </p>
    </div>
  );
}
