"use client";

// CLIENT COMPONENT
// ================
// This component MUST be a Client Component because:
// 1. It uses useState for managing sidebar collapse state
// 2. It uses usePathname() hook to highlight the active route
// 3. It handles user interactions (click to toggle sidebar)
//
// In Next.js, any component that uses React hooks or browser interactivity
// MUST be marked with "use client" at the top of the file.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Navigation data - this is a constant, but since this whole file
// is a Client Component, this data is included in the client bundle.
// For large datasets, consider keeping them in Server Components instead.
const concepts = [
  {
    category: "Core Concepts",
    items: [
      { name: "Server Components", path: "/concepts/server-components", icon: "🖥️" },
      { name: "Client Components", path: "/concepts/client-components", icon: "🌐" },
      { name: "Data Fetching", path: "/concepts/data-fetching", icon: "📡" },
      { name: "Caching", path: "/concepts/caching", icon: "💾" },
      { name: "Streaming & Suspense", path: "/concepts/streaming", icon: "🌊" },
    ],
  },
  {
    category: "Server Features",
    items: [
      { name: "Server Actions", path: "/concepts/server-actions", icon: "⚡" },
      { name: "API Routes", path: "/concepts/api-routes", icon: "🔌" },
      { name: "Middleware", path: "/concepts/middleware-demo", icon: "🛡️" },
    ],
  },
  {
    category: "Routing & Layout",
    items: [
      { name: "Layout System", path: "/concepts/layouts", icon: "📐" },
      { name: "Dynamic Routing", path: "/concepts/dynamic-routing", icon: "🔀" },
      { name: "Static vs Dynamic", path: "/concepts/static-vs-dynamic", icon: "⚖️" },
    ],
  },
  {
    category: "Advanced",
    items: [
      { name: "Edge Runtime", path: "/concepts/edge-runtime", icon: "🌍" },
      { name: "Performance", path: "/concepts/performance", icon: "🚀" },
      { name: "Env Variables", path: "/concepts/env-variables", icon: "🔐" },
      { name: "SEO & Metadata", path: "/concepts/seo", icon: "🔍" },
    ],
  },
  {
    category: "GraphQL",
    items: [
      { name: "Introduction", path: "/concepts/graphql/intro", icon: "💎" },
      { name: "GraphQL vs REST", path: "/concepts/graphql/graphql-vs-rest", icon: "⚔️" },
      { name: "Schema", path: "/concepts/graphql/schema", icon: "📋" },
      { name: "Queries", path: "/concepts/graphql/queries", icon: "🔍" },
      { name: "Mutations", path: "/concepts/graphql/mutations", icon: "✏️" },
      { name: "Resolvers", path: "/concepts/graphql/resolvers", icon: "🔧" },
      { name: "GraphQL Server", path: "/concepts/graphql/graphql-server", icon: "🖥️" },
      { name: "Next.js Integration", path: "/concepts/graphql/nextjs-integration", icon: "🔗" },
      { name: "Server Fetching", path: "/concepts/graphql/server-fetching", icon: "📡" },
      { name: "Client Fetching", path: "/concepts/graphql/client-fetching", icon: "🌐" },
      { name: "Caching", path: "/concepts/graphql/caching", icon: "💾" },
      { name: "Subscriptions", path: "/concepts/graphql/subscriptions", icon: "📢" },
      { name: "Advanced Patterns", path: "/concepts/graphql/advanced-patterns", icon: "🧩" },
    ],
  },
  {
    category: "Architecture",
    items: [
      { name: "React vs Next.js", path: "/react-vs-nextjs", icon: "🏗️" },
    ],
  },
  {
    category: "Real World Architecture",
    items: [
      { name: "E-commerce Site", path: "/concepts/real-world/ecommerce", icon: "🛒" },
    ],
  },
];

export default function Sidebar() {
  // STATE: This state only exists in the browser (client-side)
  // Server Components cannot use useState
  const [collapsed, setCollapsed] = useState(false);

  // HOOK: usePathname() reads the current URL path from the browser
  // This is a client-only operation - the server doesn't know the "current" path
  // in the same way during static rendering
  const pathname = usePathname();

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-64"
      } h-screen sticky top-0 border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition-all duration-300 overflow-y-auto flex-shrink-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent-blue)] transition-colors">
            Next.js Playground
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        {concepts.map((group) => (
          <div key={group.category} className="mb-4">
            {!collapsed && (
              <h3 className="px-3 py-1 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                {group.category}
              </h3>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-[var(--color-accent-blue)] bg-opacity-15 text-[var(--color-accent-blue)] font-medium"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card)] hover:text-[var(--color-text-primary)]"
                  }`}
                  title={item.name}
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
