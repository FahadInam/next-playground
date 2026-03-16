// CLIENT COMPONENTS CONCEPT PAGE
// ===============================
// This page itself is a SERVER Component that imports Client Component demos.
// It demonstrates the "use client" boundary pattern.
//
// ARCHITECTURE PATTERN:
// - Page (Server Component) handles layout and static content
// - Interactive demos (Client Components) are imported as children
// - This is the recommended pattern: Server Component as parent, Client as leaf

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import InteractiveFormDemo from "./InteractiveFormDemo";
import HooksDemo from "./HooksDemo";

export default function ClientComponentsPage() {
  return (
    <ConceptPage
      title="Client Components"
      description='Client Components are opted-in with "use client" directive. They enable interactivity, hooks, and browser APIs. They are hydrated in the browser after server-rendering.'
      serverOrClient="client"
    >
      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Understanding &ldquo;use client&rdquo;
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] space-y-4">
          <p className="text-[var(--color-text-secondary)]">
            The <code className="text-blue-400">&ldquo;use client&rdquo;</code> directive tells Next.js that a component (and all its imports) should be included in the client JavaScript bundle. This creates a <strong className="text-[var(--color-text-primary)]">client boundary</strong>.
          </p>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-400 font-semibold text-sm mb-2">Common Misconception</p>
            <p className="text-[var(--color-text-secondary)] text-sm">
              &ldquo;use client&rdquo; does NOT mean the component renders only on the client.
              Client Components are still <strong>server-rendered to HTML</strong> first (for initial page load),
              then <strong>hydrated</strong> in the browser. The directive means the component&apos;s
              JavaScript is sent to the browser for interactivity.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: The Client Boundary */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          The Client Boundary
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4">
            When you add <code className="text-blue-400">&ldquo;use client&rdquo;</code> to a file,
            every component imported INTO that file also becomes a Client Component.
            This is the &ldquo;client boundary&rdquo; - everything below it in the import tree is client-side.
          </p>
          <CodeBlock
            filename="Component Tree"
            language="text"
            code={`page.tsx (Server Component)
├── Header.tsx (Server Component)
├── ProductList.tsx (Server Component)
│   └── "use client"
│       InteractiveFilter.tsx (Client Component)
│       └── FilterButton.tsx (also Client Component - imported by client)
└── Footer.tsx (Server Component)

Rule: "use client" creates a boundary.
Everything imported BELOW that boundary is a Client Component.
But you CAN pass Server Components as children (props) to Client Components!`}
          />
        </div>
      </section>

      {/* Section 3: Live Demos */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demos
        </h2>
        <div className="space-y-4">
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <span className="tag-client">Client</span> Interactive Form
            </h3>
            <InteractiveFormDemo />
          </div>

          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
              <span className="tag-client">Client</span> React Hooks Demo
            </h3>
            <HooksDemo />
          </div>
        </div>
      </section>

      {/* Section 4: Code Patterns */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Passing Server Components to Client Components
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-4">
          You CAN pass Server Components as children to Client Components.
          This is the composition pattern - it keeps server benefits while adding interactivity.
        </p>
        <CodeBlock
          filename="app/dashboard/page.tsx"
          language="tsx"
          code={`// SERVER COMPONENT (page.tsx)
import ClientTabPanel from './TabPanel'; // Client Component
import ServerAnalytics from './Analytics';  // Server Component
import ServerReports from './Reports';      // Server Component

export default function Dashboard() {
  return (
    // Pass Server Components as children to Client Component
    // The Server Components are rendered on the server
    // The Client Component handles the tab switching UI
    <ClientTabPanel
      tabs={[
        { label: "Analytics", content: <ServerAnalytics /> },
        { label: "Reports", content: <ServerReports /> },
      ]}
    />
  );
}

// The Server Components (Analytics, Reports) render on the server.
// Only TabPanel's JS is sent to the client for tab switching.
// This is the BEST pattern for mixing Server and Client Components.`}
          highlights={[1, 10, 11, 12, 13]}
        />
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Client Component Rendering Flow"
          steps={[
            { label: "Server Pre-render", description: "Server renders HTML for initial state", type: "server" },
            { label: "HTML + JS Bundle", description: "HTML and component JS sent to browser", type: "network" },
            { label: "HTML Display", description: "Browser shows HTML instantly (not interactive yet)", type: "client" },
            { label: "Hydration", description: "React attaches event listeners to HTML", type: "client" },
            { label: "Interactive", description: "Component fully interactive in the browser", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
