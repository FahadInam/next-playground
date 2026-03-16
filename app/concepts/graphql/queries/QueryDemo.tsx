"use client";

// QUERY DEMO - CLIENT COMPONENT
// ===============================
// This component MUST be a Client Component because:
// 1. useState - manages selected query, response data, loading state, and error state
// 2. onClick handlers - user clicks buttons to trigger different queries
// 3. fetch() in event handlers - sends POST requests to /api/graphql from the browser
// 4. Dynamic UI updates - response area updates when data comes back
//
// WHY "use client"?
// - Server Components cannot use useState or onClick
// - Server Components cannot respond to user interactions
// - This component needs to dynamically send HTTP requests from the browser
//   and display the results in real-time
//
// WHAT RUNS IN THE BROWSER:
// - All of this component's code is included in the client JavaScript bundle
// - The useState hooks create state variables in the browser's memory
// - The fetch() calls go from the browser to our Next.js API route
// - React re-renders this component in the browser when state changes
//
// GRAPHQL EXECUTION FLOW:
// 1. User clicks a preset query button (e.g., "All Users")
// 2. onClick handler fires in the browser
// 3. fetch() sends a POST request to /api/graphql with the query string
// 4. The Next.js API route receives the request on the server
// 5. The GraphQL server (on the backend) parses, validates, and executes the query
// 6. Resolvers fetch data from the data store
// 7. Response JSON is sent back to the browser
// 8. setState updates the response display
// 9. React re-renders to show the JSON response
//
// NEXT.JS RENDERING LIFECYCLE:
// 1. During SSR, this component renders with initial state (no response shown)
// 2. The HTML is sent to the browser with the buttons visible
// 3. React hydrates this component, attaching event handlers to the buttons
// 4. Now the buttons are interactive and can trigger GraphQL queries

import { useState } from "react";

// =============================================
// PRESET QUERIES
// =============================================
// These are predefined GraphQL query strings that the user can execute
// by clicking buttons. Each demonstrates a different GraphQL feature:
// - Simple list queries
// - Nested relationship queries
// - Queries with arguments
// - Deeply nested queries

const PRESET_QUERIES = [
  {
    name: "All Users",
    description: "Fetch all users with their names and emails",
    query: `{
  users {
    id
    name
    email
  }
}`,
  },
  {
    name: "All Posts",
    description: "Fetch all posts with title and published status",
    query: `{
  posts {
    id
    title
    content
    published
  }
}`,
  },
  {
    name: "Post with Author",
    description: "Fetch a post with its nested author data (1 request!)",
    query: `{
  post(id: "1") {
    title
    content
    author {
      name
      email
    }
  }
}`,
  },
  {
    name: "User with Posts & Comments",
    description: "Deep nesting: user -> posts -> comments -> author",
    query: `{
  user(id: "1") {
    name
    email
    posts {
      title
      published
      comments {
        text
        author {
          name
        }
      }
    }
  }
}`,
  },
];

export default function QueryDemo() {
  // STATE MANAGEMENT (browser-only)
  // These state variables exist in the browser's memory after hydration.
  // They are NOT accessible on the server.
  const [selectedQuery, setSelectedQuery] = useState(PRESET_QUERIES[0]);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // =============================================
  // EXECUTE GRAPHQL QUERY
  // =============================================
  // This function runs entirely in the browser.
  // It sends a POST request to our Next.js API route at /api/graphql.
  //
  // The flow is:
  // Browser (this function) -> HTTP POST -> /api/graphql (server) -> GraphQL execution -> Response
  const executeQuery = async (query: string) => {
    setLoading(true);
    setError("");
    setResponse("");
    const startTime = performance.now();

    try {
      // fetch() here runs in the BROWSER, not on the server.
      // It sends an HTTP POST request to our Next.js API route.
      // The request body contains the GraphQL query string.
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));

      // Format the JSON response for display
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute query");
    }

    setLoading(false);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      {/* Header showing this is a client-to-server interaction */}
      <div className="flex items-center gap-2 mb-4">
        <span className="tag-client">Client</span>
        <span className="text-[var(--color-text-muted)] text-sm">&rarr;</span>
        <span className="tag-server">GraphQL API</span>
      </div>

      {/* Preset Query Buttons */}
      <div className="mb-4">
        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
          Select a query to execute:
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUERIES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                // onClick runs in the browser after hydration.
                // It updates local state and triggers a re-render.
                setSelectedQuery(preset);
                setResponse("");
                setError("");
                setExecutionTime(null);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedQuery.name === preset.name
                  ? "bg-purple-600 text-white"
                  : "bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Query Display */}
      <div className="mb-4">
        <p className="text-xs text-[var(--color-text-muted)] mb-1">
          {selectedQuery.description}
        </p>
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--color-border)]">
          <pre className="text-sm text-purple-400 font-mono overflow-x-auto whitespace-pre">
            {selectedQuery.query}
          </pre>
        </div>
      </div>

      {/* Execute Button */}
      <button
        onClick={() => executeQuery(selectedQuery.query)}
        disabled={loading}
        className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50 mb-4"
      >
        {loading ? "Executing..." : "Run Query"}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[var(--color-text-muted)]">Server Response:</p>
            {executionTime !== null && (
              <p className="text-xs text-[var(--color-text-muted)]">
                {executionTime}ms
              </p>
            )}
          </div>
          <pre className="text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {response}
          </pre>
        </div>
      )}

      {/* Explanation footer */}
      <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
        This demo sends real GraphQL queries to /api/graphql. Each query is a POST
        request with the query string in the body. The server parses the query,
        validates it against the schema, executes resolvers, and returns JSON that
        matches the exact shape of your query. Open DevTools Network tab to see the
        actual HTTP requests.
      </p>
    </div>
  );
}
