"use client";

// CLIENT COMPONENT
// ================
// This component MUST be a Client Component because:
// 1. It uses useState for managing sidebar collapse state and mobile menu
// 2. It uses usePathname() hook to highlight the active route
// 3. It uses useEffect for handling resize events and escape key
// 4. It handles user interactions (click to toggle sidebar)
//
// In Next.js, any component that uses React hooks or browser interactivity
// MUST be marked with "use client" at the top of the file.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // HOOK: usePathname() reads the current URL path from the browser
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile sidebar on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ─── Mobile Header Bar ───────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center gap-3 px-4 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-1 rounded-lg hover:bg-white/5 text-[var(--color-text-secondary)] transition-colors"
          aria-label="Open navigation"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
        <Link href="/" className="text-sm font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]">
          Next.js Playground
        </Link>
      </div>

      {/* Mobile spacer to push content below fixed header */}
      <div className="md:hidden h-14 flex-shrink-0" />

      {/* ─── Mobile Overlay ──────────────────────────────── */}
      <div
        className={`sidebar-overlay md:hidden ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ─── Sidebar ─────────────────────────────────────── */}
      <aside
        className={`
          ${collapsed ? "md:w-16" : "md:w-[272px]"}
          fixed md:sticky top-0 left-0 z-50 md:z-auto
          h-screen
          border-r border-[var(--color-border)]
          bg-[var(--color-bg-secondary)]/80 backdrop-blur-xl
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          overflow-y-auto overflow-x-hidden
          flex-shrink-0 flex flex-col
          ${mobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px]"}
          md:translate-x-0
        `}
      >
        {/* ─── Sidebar Header ────────────────────────────── */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between flex-shrink-0">
          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/5 text-[var(--color-text-secondary)] transition-colors"
            aria-label="Close navigation"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>

          {/* Desktop logo */}
          {!collapsed && (
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 text-sm font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent-blue)] transition-colors"
            >
              <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] flex items-center justify-center text-[10px] font-bold text-white">
                N
              </span>
              Next.js Playground
            </Link>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            >
              <path d="M10 3L5 8l5 5" />
            </svg>
          </button>

          {/* Mobile home link */}
          <Link
            href="/"
            className="md:hidden text-sm font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)]"
          >
            Next.js Playground
          </Link>

          {/* Spacer for mobile layout */}
          <div className="md:hidden w-7" />
        </div>

        {/* ─── Navigation ────────────────────────────────── */}
        <nav className="flex-1 p-2 pt-3 overflow-y-auto">
          {concepts.map((group) => (
            <div key={group.category} className="mb-5">
              {!collapsed && (
                <h3 className="px-3 py-1.5 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-[0.12em]">
                  {group.category}
                </h3>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150
                        ${isActive
                          ? "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] font-medium border border-[var(--color-accent-blue)]/15 shadow-sm shadow-[var(--color-accent-blue)]/5"
                          : "text-[var(--color-text-secondary)] hover:bg-white/[0.04] hover:text-[var(--color-text-primary)] border border-transparent"
                        }
                      `}
                      title={item.name}
                    >
                      <span className="text-base flex-shrink-0 w-5 text-center">{item.icon}</span>
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
