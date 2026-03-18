// LAYOUT SYSTEM PAGE - SERVER COMPONENT
// ========================================
// Demonstrates the Next.js layout system.
//
// KEY CONCEPTS:
// 1. layout.tsx files wrap page.tsx and nested layouts
// 2. Layouts persist across navigations - they don't re-render
// 3. Each route segment can have its own layout
// 4. The root layout (app/layout.tsx) is REQUIRED and wraps everything
// 5. Layouts are Server Components by default
// 6. Layouts receive {children} which is the page or nested layout

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

export default function LayoutsPage() {
  return (
    <ConceptPage
      title="Layout System"
      description="Next.js uses a file-based layout system where layout.tsx files create persistent UI shells that wrap pages. Layouts don't re-render when navigating between pages that share them."
      serverOrClient="server"
    >
      {/* Layman Explanation */}
      <section className="space-y-4">
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Layman Explanation</h2>
          <p className="text-[var(--color-text-secondary)]">
            🖼️ Think of a picture frame. The frame (layout) stays the same while you swap different photos (pages) inside it. In Next.js, layouts are the parts of your website that stay consistent — like the navigation bar and footer — while the main content changes as you navigate between pages.
          </p>
        </div>
      </section>

      {/* Section 1: Explanation */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          How Layouts Work
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] space-y-4">
          <p className="text-[var(--color-text-secondary)]">
            In Next.js, layouts are UI that is <strong className="text-[var(--color-text-primary)]">shared between multiple pages</strong>.
            They preserve state, remain interactive, and don&apos;t re-render when navigating.
            This is fundamentally different from React SPA where the entire component tree re-renders on route changes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[var(--color-bg-primary)] rounded-lg p-4">
              <h3 className="text-green-400 font-semibold text-sm mb-2">layout.tsx</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Shared UI that wraps children. Persists across navigation. Cannot access pathname directly.
              </p>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded-lg p-4">
              <h3 className="text-blue-400 font-semibold text-sm mb-2">template.tsx</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Like layout but re-mounts on navigation. Useful for animations and per-page state reset.
              </p>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded-lg p-4">
              <h3 className="text-purple-400 font-semibold text-sm mb-2">loading.tsx</h3>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Auto-wrapped Suspense boundary. Shows while page.tsx loads data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: File Structure */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          File Structure & Nesting
        </h2>
        <CodeBlock
          filename="Nested Layout Structure"
          language="text"
          code={`app/
├── layout.tsx          ← Root layout (REQUIRED, wraps everything)
├── page.tsx            ← Home page "/"
├── loading.tsx         ← Loading state for home page
│
├── dashboard/
│   ├── layout.tsx      ← Dashboard layout (wraps all dashboard pages)
│   ├── page.tsx        ← "/dashboard"
│   ├── loading.tsx     ← Loading state for dashboard
│   │
│   ├── analytics/
│   │   └── page.tsx    ← "/dashboard/analytics" (uses dashboard layout)
│   │
│   └── settings/
│       ├── layout.tsx  ← Settings layout (nested inside dashboard layout)
│       └── page.tsx    ← "/dashboard/settings"

Rendering order for /dashboard/settings:
<RootLayout>           ← app/layout.tsx
  <DashboardLayout>    ← app/dashboard/layout.tsx
    <SettingsLayout>   ← app/dashboard/settings/layout.tsx
      <SettingsPage /> ← app/dashboard/settings/page.tsx
    </SettingsLayout>
  </DashboardLayout>
</RootLayout>`}
          highlights={[2, 7, 15, 18, 19, 20, 21, 22]}
        />
      </section>

      {/* Section 3: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: This Page Uses Layouts
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Right now, you&apos;re experiencing the layout system:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-[var(--color-text-primary)]">
                <strong>Root Layout</strong> (app/layout.tsx) - provides the HTML shell, sidebar, and main content area
              </span>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-[var(--color-text-primary)]">
                <strong>This Page</strong> (app/concepts/layouts/page.tsx) - the content you&apos;re reading
              </span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
            Navigate to other concept pages using the sidebar. Notice how the sidebar
            stays in place and doesn&apos;t re-render - that&apos;s the root layout persisting!
          </p>
        </div>
      </section>

      {/* Section 4: Code Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>
        <div className="space-y-4">
          <CodeBlock
            filename="app/layout.tsx (Root Layout - REQUIRED)"
            language="tsx"
            code={`// ROOT LAYOUT - SERVER COMPONENT
// Must contain <html> and <body> tags
// This is the ONLY layout that has these tags

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>Global Navigation</nav>
        {/* children = page.tsx or nested layout */}
        <main>{children}</main>
        <footer>Global Footer</footer>
      </body>
    </html>
  );
}`}
            highlights={[1, 2, 3, 20, 21]}
          />

          <CodeBlock
            filename="app/dashboard/layout.tsx (Nested Layout)"
            language="tsx"
            code={`// NESTED LAYOUT - SERVER COMPONENT
// This layout wraps all pages under /dashboard/*
// It does NOT contain <html> or <body> tags
// It persists when navigating between /dashboard/analytics and /dashboard/settings

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside>
        {/* Dashboard sidebar - persists across page navigations */}
        <DashboardNav />
      </aside>
      <section className="flex-1">
        {children}
      </section>
    </div>
  );
}`}
            highlights={[1, 2, 3, 4, 14]}
          />
        </div>
      </section>

      {/* Section 5: Layout vs Template */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          layout.tsx vs template.tsx
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Behavior</th>
                <th className="text-left p-3 text-green-400">layout.tsx</th>
                <th className="text-left p-3 text-blue-400">template.tsx</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Re-renders on navigation</td>
                <td className="p-3">No (persists)</td>
                <td className="p-3">Yes (re-mounts)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">State preserved</td>
                <td className="p-3">Yes</td>
                <td className="p-3">No (reset on each navigation)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">useEffect re-runs</td>
                <td className="p-3">No</td>
                <td className="p-3">Yes (on each navigation)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Use for</td>
                <td className="p-3">Persistent navigation, shared state</td>
                <td className="p-3">Entry/exit animations, page analytics</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 6: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Layout Rendering During Navigation"
          steps={[
            { label: "User Clicks Link", description: "Navigate from /dashboard/analytics to /dashboard/settings", type: "client" },
            { label: "Router Checks Layouts", description: "Which layouts are shared?", type: "client" },
            { label: "Root Layout: Preserved", description: "Same layout, no re-render needed", type: "server" },
            { label: "Dashboard Layout: Preserved", description: "Shared between both routes", type: "server" },
            { label: "Only Page Changes", description: "New page.tsx rendered and swapped in", type: "server" },
            { label: "DOM Update", description: "Only the changed content is updated", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
