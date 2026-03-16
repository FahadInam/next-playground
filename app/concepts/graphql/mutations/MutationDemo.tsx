"use client";

// MUTATION DEMO - CLIENT COMPONENT
// ==================================
// This component MUST be a Client Component because:
// 1. useState - manages form input values, loading state, result data, and error messages
// 2. onChange handlers - respond to the user typing in form fields
// 3. onSubmit handler - intercepts form submission to send a GraphQL mutation
// 4. fetch() in event handlers - sends POST requests from the browser to /api/graphql
// 5. Dynamic UI updates - the result/error area updates after the mutation completes
//
// WHY "use client"?
// - Server Components cannot use React hooks (useState, useEffect, etc.)
// - Server Components cannot attach event handlers (onChange, onSubmit, onClick)
// - This component needs to capture user input, send it to the server, and display
//   the result - all of which are inherently browser-side operations
//
// WHAT RUNS IN THE BROWSER:
// - ALL of this component's code is included in the client JavaScript bundle
// - The useState hooks create state variables stored in the browser's memory
// - The onChange handlers fire in the browser when the user types in inputs
// - The fetch() call goes from the browser to our Next.js API route at /api/graphql
// - React re-renders this component in the browser whenever state changes
//
// WHAT DOES NOT RUN IN THE BROWSER:
// - The GraphQL server-side logic (parsing, validation, resolver execution)
// - Those all happen on the server when /api/graphql receives our POST request
//
// MUTATION EXECUTION FLOW (step by step):
// 1. User fills in the form fields (title, content, authorId)
// 2. Each keystroke triggers an onChange handler that calls setState
// 3. User clicks "Create Post" which triggers the onSubmit handler
// 4. onSubmit calls handleSubmit(), which:
//    a. Sets loading=true (shows "Creating..." on the button)
//    b. Clears any previous result/error
//    c. Constructs a GraphQL mutation string with the form values
//    d. Sends a POST request via fetch() to /api/graphql
//    e. The request body is JSON: { query: "mutation { createPost(...) { ... } }" }
// 5. The Next.js API route on the server:
//    a. Receives the POST request
//    b. Parses the GraphQL mutation string
//    c. Validates it against the schema (checks types, required fields)
//    d. Executes the createPost resolver, which writes to the data store
//    e. Returns the newly created post as JSON
// 6. Back in the browser:
//    a. fetch() resolves with the response
//    b. We parse the JSON and check for errors
//    c. If successful, we store the result in state -> React re-renders -> result is shown
//    d. If errors, we store the error message in state -> React re-renders -> error is shown
//    e. Set loading=false (button goes back to "Create Post")
//
// NEXT.JS RENDERING LIFECYCLE FOR THIS COMPONENT:
// 1. During SSR, Next.js renders this component on the server with initial state:
//    - form fields are empty strings
//    - loading is false, result is null, error is empty
//    - The HTML contains the form structure but no event handlers
// 2. The HTML is sent to the browser as part of the page
// 3. The browser downloads the JS bundle containing this component's code
// 4. React "hydrates" the component, attaching onChange/onSubmit handlers
// 5. Now the form is fully interactive

import { useState } from "react";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
// TypeScript interfaces for the form state and the mutation response.
// These help catch errors at compile time and provide IDE autocomplete.

// FormState represents the three form fields that map to the createPost
// mutation's required arguments: title (String!), content (String!), authorId (ID!)
interface FormState {
  title: string;
  content: string;
  authorId: string;
}

// MutationResult represents the shape of data we request back from the mutation.
// After createPost executes, we ask for these specific fields in our selection set.
interface MutationResult {
  createPost: {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
    author: {
      name: string;
      email: string;
    };
  };
}

export default function MutationDemo() {
  // ===========================================================================
  // STATE MANAGEMENT (all browser-only after hydration)
  // ===========================================================================
  // These state variables exist in the browser's memory. During SSR, they
  // have their initial values. After hydration, React manages them in the browser.

  // formState: tracks the current values of the three form inputs.
  // Each field maps to a required argument in the createPost mutation.
  const [formState, setFormState] = useState<FormState>({
    title: "",       // Maps to createPost(title: String!)
    content: "",     // Maps to createPost(content: String!)
    authorId: "1",   // Maps to createPost(authorId: ID!) - default to "1"
  });

  // loading: true while the mutation request is in flight.
  // Used to disable the submit button and show a loading indicator.
  const [loading, setLoading] = useState(false);

  // result: holds the parsed mutation response data after a successful mutation.
  // null when no mutation has been executed yet or after clearing.
  const [result, setResult] = useState<MutationResult | null>(null);

  // error: holds an error message string if the mutation fails.
  // Empty string when there is no error.
  const [error, setError] = useState<string>("");

  // executionTime: tracks how long the mutation took in milliseconds.
  // null when no mutation has been executed yet.
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // ===========================================================================
  // FORM INPUT HANDLER
  // ===========================================================================
  // This function runs in the browser whenever the user types in any form field.
  // It uses the input's "name" attribute to determine which field to update.
  // This is a common React pattern called "controlled components" - the form
  // inputs' values are controlled by React state, not the DOM.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Spread the existing state and override just the changed field.
    // For example, if name="title" and value="Hello", this produces:
    // { title: "Hello", content: (unchanged), authorId: (unchanged) }
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // ===========================================================================
  // MUTATION SUBMISSION HANDLER
  // ===========================================================================
  // This function runs entirely in the browser when the user submits the form.
  // It constructs a GraphQL mutation string from the form values, sends it
  // to /api/graphql via fetch(), and handles the response.
  //
  // IMPORTANT: The mutation string is constructed by interpolating form values
  // directly. In a production app, you would use GraphQL variables instead
  // to prevent injection and improve caching. This is simplified for learning.
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent the browser's default form submission behavior (which would
    // cause a full page reload). We want to handle it with JavaScript instead.
    e.preventDefault();

    // Set loading state - this triggers a re-render that disables the button
    // and shows "Creating..." text
    setLoading(true);
    setError("");
    setResult(null);
    setExecutionTime(null);

    // Record the start time for measuring execution duration.
    // performance.now() is a browser API that returns a high-resolution timestamp.
    const startTime = performance.now();

    try {
      // =====================================================================
      // CONSTRUCT THE GRAPHQL MUTATION STRING
      // =====================================================================
      // We build the mutation string with the form values inserted.
      // The mutation keyword tells GraphQL this is a write operation.
      // The selection set (id, title, content, etc.) specifies what data
      // we want back after the mutation completes.
      const mutation = `
        mutation {
          createPost(
            title: "${formState.title}"
            content: "${formState.content}"
            authorId: "${formState.authorId}"
          ) {
            id
            title
            content
            published
            createdAt
            author {
              name
              email
            }
          }
        }
      `;

      // =====================================================================
      // SEND THE MUTATION TO THE GRAPHQL API
      // =====================================================================
      // fetch() runs in the BROWSER. It sends an HTTP POST request from the
      // user's browser to our Next.js API route at /api/graphql.
      //
      // Key details:
      // - Method is POST (GraphQL always uses POST for mutations)
      // - Content-Type is application/json
      // - The body contains { query: "mutation { ... }" }
      //   (Note: the key is "query" even for mutations - this is a GraphQL convention)
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mutation }),
      });

      // =====================================================================
      // PARSE THE RESPONSE
      // =====================================================================
      // The GraphQL server always returns JSON with this shape:
      // { data: { createPost: { ... } }, errors?: [...] }
      //
      // - data contains the successful result (matching our selection set)
      // - errors (optional) contains any errors that occurred
      const json = await response.json();

      // Calculate how long the round trip took
      const endTime = performance.now();
      setExecutionTime(Math.round(endTime - startTime));

      // Check if the GraphQL server returned any errors.
      // These are GraphQL-level errors (validation failures, resolver errors),
      // not HTTP errors (the HTTP status is usually 200 even with GraphQL errors).
      if (json.errors) {
        setError(json.errors.map((err: { message: string }) => err.message).join(", "));
      } else {
        // Success! Store the mutation result in state.
        // This triggers a re-render that displays the result below the form.
        setResult(json.data);
      }
    } catch (err) {
      // This catch block handles network errors (server unreachable, CORS issues,
      // JSON parse failures, etc.) - NOT GraphQL errors, which are handled above.
      setError(err instanceof Error ? err.message : "Failed to execute mutation");
    }

    // Set loading to false - this re-enables the submit button
    setLoading(false);
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  // The JSX below renders:
  // 1. A header showing this is a client-to-server interaction
  // 2. A form with title, content, and authorId fields
  // 3. A submit button that triggers the mutation
  // 4. An error display (conditionally shown)
  // 5. A result display (conditionally shown after successful mutation)
  // 6. An explanation footer
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      {/* Header: shows that this is a Client -> Server interaction */}
      <div className="flex items-center gap-2 mb-4">
        <span className="tag-client">Client</span>
        <span className="text-[var(--color-text-muted)] text-sm">&rarr;</span>
        <span className="tag-server">GraphQL API</span>
      </div>

      {/* =====================================================================
          MUTATION FORM
          =====================================================================
          This form collects the three required arguments for createPost:
          - title (String!) - the post's title
          - content (String!) - the post's body text
          - authorId (ID!) - the ID of the user creating the post

          Each input is a "controlled component" - its value comes from React state
          and updates are handled by onChange -> setFormState.

          onSubmit is intercepted to prevent page reload and instead call handleSubmit. */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        {/* Title field */}
        <div>
          <label
            htmlFor="mutation-title"
            className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
          >
            Title <span className="text-red-400">*</span>
          </label>
          <input
            id="mutation-title"
            type="text"
            name="title"
            value={formState.title}
            onChange={handleInputChange}
            placeholder="Enter post title..."
            required
            className="w-full px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
          />
        </div>

        {/* Content field - textarea for longer text */}
        <div>
          <label
            htmlFor="mutation-content"
            className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
          >
            Content <span className="text-red-400">*</span>
          </label>
          <textarea
            id="mutation-content"
            name="content"
            value={formState.content}
            onChange={handleInputChange}
            placeholder="Write your post content..."
            required
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-vertical"
          />
        </div>

        {/* Author ID field - defaults to "1" for convenience */}
        <div>
          <label
            htmlFor="mutation-authorId"
            className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
          >
            Author ID <span className="text-red-400">*</span>
          </label>
          <input
            id="mutation-authorId"
            type="text"
            name="authorId"
            value={formState.authorId}
            onChange={handleInputChange}
            placeholder="Enter author ID (e.g., 1)"
            required
            className="w-full px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Use &quot;1&quot; or &quot;2&quot; to match existing users in the demo data.
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {/* Show different text based on loading state */}
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>

      {/* =====================================================================
          MUTATION PREVIEW
          =====================================================================
          Shows the GraphQL mutation that will be sent, so the user can see
          exactly what's happening under the hood. Updates in real-time as
          the user types in the form fields. */}
      <div className="mb-4">
        <p className="text-xs text-[var(--color-text-muted)] mb-1">
          Mutation that will be sent:
        </p>
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--color-border)]">
          <pre className="text-sm text-purple-400 font-mono overflow-x-auto whitespace-pre">
{`mutation {
  createPost(
    title: "${formState.title || "..."}"
    content: "${formState.content || "..."}"
    authorId: "${formState.authorId || "..."}"
  ) {
    id
    title
    content
    published
    createdAt
    author {
      name
      email
    }
  }
}`}
          </pre>
        </div>
      </div>

      {/* =====================================================================
          ERROR DISPLAY
          =====================================================================
          Conditionally rendered when the error state is non-empty.
          Shows GraphQL errors (validation, resolver failures) and network errors. */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-400 font-medium mb-1">Mutation Error</p>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* =====================================================================
          RESULT DISPLAY
          =====================================================================
          Conditionally rendered when a mutation has completed successfully.
          Shows the returned data in formatted JSON, along with execution time.
          This demonstrates that mutations return data just like queries - you
          get back exactly the fields you specified in the selection set. */}
      {result && (
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[var(--color-border)] mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[var(--color-text-muted)]">
              Mutation Result (server response):
            </p>
            {/* Show execution time if available */}
            {executionTime !== null && (
              <p className="text-xs text-[var(--color-text-muted)]">
                {executionTime}ms
              </p>
            )}
          </div>
          {/* Format the result as pretty-printed JSON for readability */}
          <pre className="text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* =====================================================================
          EXPLANATION FOOTER
          =====================================================================
          A brief note explaining what's happening technically, to reinforce
          the learning. Suggests opening DevTools to see the actual network request. */}
      <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
        This demo sends a real GraphQL mutation to /api/graphql. The mutation is a POST
        request with the mutation string in the body. The server parses it, validates the
        arguments against the schema (title: String!, content: String!, authorId: ID!),
        executes the createPost resolver to write data, and returns the newly created post.
        Open DevTools Network tab to inspect the actual HTTP request and response.
      </p>
    </div>
  );
}
