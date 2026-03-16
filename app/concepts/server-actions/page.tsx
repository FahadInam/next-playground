// SERVER ACTIONS PAGE - SERVER COMPONENT
// ========================================
// Server Actions are functions that run on the server and can be called
// from Client Components. They are defined with "use server" directive.
//
// KEY CONCEPT: Server Actions replace the need for API routes for form
// submissions and data mutations. They are type-safe and can be called
// directly from forms or event handlers.
//
// WHAT HAPPENS:
// 1. User submits form / clicks button
// 2. The form data is serialized and sent to the server
// 3. The Server Action function executes on the server
// 4. The server can update databases, send emails, etc.
// 5. The result is sent back to the client
// 6. The page revalidates if needed

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import ServerActionForm from "./ServerActionForm";
import ServerActionWithState from "./ServerActionWithState";

export default function ServerActionsPage() {
  return (
    <ConceptPage
      title="Server Actions"
      description='Server Actions are async functions that execute on the server. Defined with "use server", they enable form handling and data mutations without creating separate API endpoints.'
      serverOrClient="both"
    >
      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          What Are Server Actions?
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] space-y-3">
          <p className="text-[var(--color-text-secondary)]">
            Server Actions are async functions marked with <code className="text-green-400">&ldquo;use server&rdquo;</code>.
            They can be used in forms, event handlers, and useEffect for data mutations and server-side operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
              <h3 className="text-green-400 font-semibold text-sm mb-2">Benefits</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>• No API routes needed for mutations</li>
                <li>• Type-safe end-to-end</li>
                <li>• Works with progressive enhancement</li>
                <li>• Automatic request/response handling</li>
                <li>• Can revalidate cached data</li>
              </ul>
            </div>
            <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold text-sm mb-2">Use Cases</h3>
              <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
                <li>• Form submissions</li>
                <li>• Database updates (CRUD)</li>
                <li>• Sending emails/notifications</li>
                <li>• File uploads</li>
                <li>• Authentication flows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Live Demo - Basic Form */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Demo 1: Basic Server Action Form
        </h2>
        <ServerActionForm />
      </section>

      {/* Section 3: Live Demo - useActionState */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Demo 2: Server Action with useActionState
        </h2>
        <ServerActionWithState />
      </section>

      {/* Section 4: Code Patterns */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Two Ways to Define Server Actions
        </h2>

        <div className="space-y-4">
          <CodeBlock
            filename="Option 1: Inline in Server Component"
            language="tsx"
            code={`// SERVER COMPONENT
export default function Page() {
  // Define the action inline with "use server"
  async function createPost(formData: FormData) {
    "use server"; // This function runs on the server

    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    // Safe to access database directly
    await db.posts.create({ title, body });

    // Revalidate the posts page
    revalidatePath("/posts");
  }

  // The form submits to the server action
  // Works even WITHOUT JavaScript enabled (progressive enhancement)
  return (
    <form action={createPost}>
      <input name="title" />
      <textarea name="body" />
      <button type="submit">Create Post</button>
    </form>
  );
}`}
            highlights={[4, 5, 19]}
          />

          <CodeBlock
            filename="Option 2: Separate file (for Client Components)"
            language="tsx"
            code={`// actions.ts
"use server"; // All exports from this file are Server Actions

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  await db.posts.create({ title });
  revalidatePath("/posts");
}

export async function deletePost(id: string) {
  await db.posts.delete(id);
  revalidatePath("/posts");
}

// ----

// ClientForm.tsx
"use client";
import { createPost } from "./actions";

export default function ClientForm() {
  // Can use the server action in a client component!
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}`}
            highlights={[1, 2, 17, 18, 19]}
          />
        </div>
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Server Action Request Flow"
          steps={[
            { label: "Form Submit / onClick", description: "User triggers the action", type: "client" },
            { label: "Serialize Data", description: "Form data serialized to request", type: "client" },
            { label: "POST Request", description: "Sent to Next.js server automatically", type: "network" },
            { label: "Server Action Executes", description: "Function runs on server (DB, email, etc.)", type: "server" },
            { label: "Return Result", description: "Success/error response sent back", type: "network" },
            { label: "UI Updates", description: "Page revalidates, UI reflects changes", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
