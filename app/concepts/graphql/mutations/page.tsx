// GRAPHQL MUTATIONS - SERVER COMPONENT PAGE
// ============================================
// This page teaches how GraphQL mutations work - the way clients WRITE (create,
// update, delete) data through a GraphQL API, as opposed to queries which only READ.
//
// SERVER COMPONENT: There is no "use client" directive in this file.
// This means Next.js treats it as a React Server Component (RSC).
// All the JSX in this file is rendered to HTML on the server at request time.
// The browser never executes any of this code directly.
//
// WHY IS THIS A SERVER COMPONENT?
// - It has NO interactive elements itself (no useState, no onClick handlers)
// - It only renders static educational content: text, code examples, diagrams
// - The interactive demo is delegated to MutationDemo (a Client Component)
// - Keeping this as a Server Component means zero JavaScript is shipped to the
//   browser for all the static sections, resulting in a smaller bundle
//
// WHY DOES MutationDemo NEED TO BE A CLIENT COMPONENT?
// - MutationDemo uses useState to track form inputs, loading state, and results
// - MutationDemo uses onChange/onSubmit handlers to respond to user input
// - MutationDemo calls fetch() from the browser to send mutations to /api/graphql
// - None of these are possible in a Server Component because Server Components
//   render once on the server and produce static HTML with no interactivity
//
// RENDERING LIFECYCLE:
// 1. Browser requests /concepts/graphql/mutations
// 2. Next.js server receives the request and begins rendering this page
// 3. This Server Component renders all static sections (explanations, code blocks,
//    diagrams) directly into HTML strings on the server
// 4. When it encounters <MutationDemo />, Next.js knows it's a Client Component
//    because MutationDemo.tsx has "use client" at the top
// 5. MutationDemo is ALSO server-rendered for its initial state (empty form, no results)
//    so the HTML includes the form structure even before JavaScript loads
// 6. The server sends the complete HTML to the browser (fast first paint!)
// 7. The browser downloads the JavaScript bundle that contains ONLY MutationDemo's code
//    (not this page's code - Server Components are never in the client bundle)
// 8. React "hydrates" MutationDemo, attaching event listeners to the form elements
// 9. Now the form is interactive: the user can type, submit, and see results
//
// WHAT RUNS ON THE SERVER:
// - This entire file (page.tsx) executes on the server
// - The ConceptPage, CodeBlock, and FlowDiagram components render on the server
// - All the JSX below becomes plain HTML strings
//
// WHAT RUNS IN THE BROWSER:
// - Only MutationDemo.tsx code is shipped to and executed in the browser
// - React hydration makes the form interactive
// - User interactions (typing, submitting) trigger browser-side state updates and fetch calls

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import MutationDemo from "./MutationDemo";

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================
// This is the default export that Next.js uses as the route handler for
// /concepts/graphql/mutations. It returns JSX wrapped in ConceptPage, which
// provides the shared layout (title, description, navigation) for all concept pages.
//
// serverOrClient="both" tells ConceptPage to show a badge indicating this page
// uses both Server and Client Components.
export default function MutationsPage() {
  return (
    <ConceptPage
      title="GraphQL Mutations"
      description="Mutations are how clients write data to a GraphQL API - creating, updating, and deleting records. While queries are for reading, mutations are for changing things."
      serverOrClient="both"
    >
      {/* ============================================================
          SECTION 1: LAYMAN EXPLANATION
          A simple, non-technical analogy to help beginners grasp what
          mutations do before diving into technical details.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Doctor&apos;s Office Analogy
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            Think of a GraphQL mutation like filling out a form at a doctor&apos;s office
            to update your medical records.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Query analogy - reading data */}
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-2">Query = Reading Your Chart</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                A query is like asking the receptionist to look up your records. They pull
                up your file and read back the information you asked for - your name,
                address, allergies. Nothing changes; you&apos;re just reading.
              </p>
            </div>
            {/* Mutation analogy - writing data */}
            <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
              <h3 className="text-purple-400 font-semibold mb-2">Mutation = Updating Your Records</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                A mutation is like filling out a form to change your address or add a new
                allergy. You hand the form to the receptionist, they update your file,
                and then they confirm what was changed. The data is now different.
              </p>
            </div>
          </div>

          {/* Extra analogy details to deepen understanding */}
          <div className="mt-4 bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
            <h3 className="text-orange-400 font-semibold mb-2">Key Insight: You Get Confirmation Back</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Just like the receptionist confirms &quot;We&apos;ve updated your address to 123 Oak St,&quot;
              a GraphQL mutation returns the data that was changed. You can specify exactly which
              fields you want back in the confirmation - just like with a query!
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: DEVELOPER EXPLANATION
          Technical details about how mutations work, their syntax,
          and the differences from queries.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          How Mutations Work
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] space-y-4">
          {/* Mutation syntax */}
          <div>
            <h3 className="text-sm font-semibold text-green-400 mb-1">Mutation Syntax</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Mutations look almost identical to queries but start with the{" "}
              <code className="text-purple-400">mutation</code> keyword instead of{" "}
              <code className="text-purple-400">query</code>. They accept arguments (the data
              you want to write) and return a selection set (the fields you want back as confirmation).
            </p>
          </div>

          {/* Input arguments */}
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-1">Input Arguments</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Mutation fields accept arguments that represent the data to write. For example,{" "}
              <code className="text-purple-400">createPost(title: &quot;Hello&quot;, content: &quot;World&quot;, authorId: &quot;1&quot;)</code>{" "}
              passes the new post&apos;s data as arguments. Arguments marked with{" "}
              <code className="text-purple-400">!</code> in the schema are required.
            </p>
          </div>

          {/* Return values */}
          <div>
            <h3 className="text-sm font-semibold text-orange-400 mb-1">Return Values</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              After the mutation executes, the server returns the data you selected. This
              lets the client update its local state immediately without a separate query.
              For example, after creating a post you get back the new post&apos;s{" "}
              <code className="text-purple-400">id</code>,{" "}
              <code className="text-purple-400">title</code>, and{" "}
              <code className="text-purple-400">createdAt</code>.
            </p>
          </div>

          {/* Sequential execution */}
          <div>
            <h3 className="text-sm font-semibold text-purple-400 mb-1">Sequential Execution</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Unlike queries (which resolve in parallel), mutations in the same request
              execute sequentially - one after the other. This prevents race conditions.
              If you send two mutations that modify the same data, the second one will
              always see the result of the first.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: CODE EXAMPLES
          Concrete mutation examples using CodeBlock with syntax
          highlighting. Shows both createPost and createComment.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Mutation Examples
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* createPost mutation example */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Create a Post</h3>
            <CodeBlock
              filename="create-post.graphql"
              language="graphql"
              code={`# Create a new blog post
# Arguments: title, content, authorId (all required!)
# Returns: the newly created post with its fields
mutation {
  createPost(
    title: "Learning GraphQL Mutations"
    content: "Mutations let you write data..."
    authorId: "1"
  ) {
    id
    title
    content
    published
    createdAt
    author {
      name
    }
  }
}`}
              highlights={[4, 5, 6, 7, 8, 10, 11, 12]}
            />
          </div>

          {/* createComment mutation example */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Create a Comment</h3>
            <CodeBlock
              filename="create-comment.graphql"
              language="graphql"
              code={`# Add a comment to an existing post
# Arguments: text, postId, authorId (all required!)
# Returns: the new comment and its author
mutation {
  createComment(
    text: "Great article!"
    postId: "1"
    authorId: "2"
  ) {
    id
    text
    createdAt
    author {
      name
      email
    }
  }
}`}
              highlights={[4, 5, 6, 7, 8, 10, 11]}
            />
          </div>
        </div>

        {/* Additional example: sending mutations from JavaScript */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
            Sending Mutations from JavaScript
          </h3>
          <CodeBlock
            filename="send-mutation.ts"
            language="typescript"
            code={`// How to send a GraphQL mutation using the Fetch API
// This pattern works in Client Components (browser-side)

const mutation = \`
  mutation {
    createPost(
      title: "My New Post"
      content: "This is the content of my post."
      authorId: "1"
    ) {
      id
      title
      createdAt
    }
  }
\`;

// Mutations use the same endpoint and method as queries
// The only difference is the operation type in the string
const response = await fetch("/api/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: mutation }),
});

// Response structure is the same: { data, errors }
const { data, errors } = await response.json();

if (errors) {
  console.error("Mutation failed:", errors);
} else {
  console.log("Created post:", data.createPost);
  // data.createPost.id -> the new post's ID
  // data.createPost.title -> "My New Post"
  // data.createPost.createdAt -> timestamp string
}`}
            highlights={[20, 21, 22, 23, 26]}
          />
        </div>
      </section>

      {/* ============================================================
          SECTION 4: LIVE DEMO
          MutationDemo is a Client Component - it uses useState for
          form fields, loading/error state, and fetch() to send
          mutations from the browser to /api/graphql.
          This is the ONLY part of this page that ships JavaScript
          to the browser.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Mutation Playground
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          Fill out the form below to create a new post via a GraphQL mutation.
          The mutation is sent from your browser to /api/graphql, and the server
          responds with the newly created post data.
        </p>
        {/* MutationDemo is imported as a Client Component.
            During SSR, Next.js renders it with initial state (empty form).
            After hydration, it becomes interactive in the browser. */}
        <MutationDemo />
      </section>

      {/* ============================================================
          SECTION 5: FLOW DIAGRAM
          Visual representation of the mutation execution flow using
          the FlowDiagram component. Each step is color-coded by
          where it happens (client, server, or network).
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Mutation Execution Flow
        </h2>
        <FlowDiagram
          title="What Happens When You Send a Mutation"
          steps={[
            {
              label: "Client Builds Mutation",
              description: "Developer writes the mutation string with input arguments",
              type: "client",
            },
            {
              label: "POST to /api/graphql",
              description: "Mutation string sent as JSON in the request body (same as queries)",
              type: "network",
            },
            {
              label: "Parse & Validate",
              description: "Server parses mutation and validates arguments against the schema types",
              type: "server",
            },
            {
              label: "Execute Resolver",
              description: "The mutation resolver runs, writing data to the database or data store",
              type: "server",
            },
            {
              label: "Return Created Data",
              description: "Server returns the newly created/modified data matching the selection set",
              type: "server",
            },
            {
              label: "Client Updates UI",
              description: "Browser receives the response and updates the interface to reflect the change",
              type: "client",
            },
          ]}
        />
      </section>

      {/* ============================================================
          SECTION 6: PRACTICE EXERCISES
          Three difficulty levels to reinforce learning. Uses color-coded
          cards: green (beginner), blue (intermediate), orange (advanced).
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Practice Exercises
        </h2>
        <div className="space-y-4">
          {/* Beginner exercise - green card */}
          <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-2">Beginner: Create a Comment</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Write a mutation that creates a comment on post ID &quot;1&quot; from author ID &quot;2&quot;.
              Select the comment&apos;s <code className="text-purple-400">id</code>,{" "}
              <code className="text-purple-400">text</code>, and{" "}
              <code className="text-purple-400">createdAt</code> in the return.
              Try writing it out before looking at the code example above.
            </p>
          </div>

          {/* Intermediate exercise - blue card */}
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-2">Intermediate: Chain Mutations</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Modify the MutationDemo component to send two mutations in sequence:
              first create a post, then immediately create a comment on that post
              using the returned post ID. Remember, mutations execute sequentially,
              so you can use the result of one to feed into the next.
            </p>
          </div>

          {/* Advanced exercise - orange card */}
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
            <h3 className="text-orange-400 font-semibold mb-2">Advanced: Optimistic UI Update</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Create a new Client Component that shows a list of posts (fetched via query)
              and has a &quot;New Post&quot; form. When the user submits, immediately add the new
              post to the list optimistically (before the server responds), then update
              it with the real data when the mutation completes. Handle the case where
              the mutation fails by rolling back the optimistic update.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: KEY TAKEAWAYS
          Summary of the most important points about mutations.
          Uses checkmark icons for visual scanning.
          ============================================================ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <ul className="space-y-3 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Mutations write data:</strong>{" "}
                Use <code className="text-purple-400">mutation</code> keyword for create, update,
                and delete operations - <code className="text-purple-400">query</code> is only for reading.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Same endpoint:</strong>{" "}
                Mutations go to the same POST /api/graphql endpoint as queries.
                The server distinguishes them by the operation keyword.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Return data:</strong>{" "}
                Mutations return data just like queries. You choose which fields
                of the created/modified resource to get back.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Sequential execution:</strong>{" "}
                Multiple mutations in one request run one after the other (not in parallel),
                preventing race conditions on shared data.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Required arguments:</strong>{" "}
                Fields marked with <code className="text-purple-400">!</code> in the schema
                (like <code className="text-purple-400">title: String!</code>) must be provided
                or the mutation will fail validation.
              </span>
            </li>
          </ul>
        </div>
      </section>
    </ConceptPage>
  );
}
