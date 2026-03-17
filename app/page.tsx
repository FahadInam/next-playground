// HOME PAGE - SERVER COMPONENT
// =============================
// This is the dashboard/home page at route "/"
// It's a Server Component by default - no "use client" directive.
//
// WHY SERVER COMPONENT?
// - This page only displays static links and text
// - No hooks, no user interaction state
// - Benefits: Zero JavaScript sent to browser for this page
// - The HTML is pre-rendered on the server
//
// ANIMATIONS:
// - PageTransition wraps the entire page for fade-in on mount
// - ScrollReveal wraps each category section for scroll-triggered reveals
// - StaggerChildren + StaggerItem wrap the card grid for staggered entrances
// - These are Client Components imported into this Server Component;
//   Next.js handles the boundary automatically

import Link from "next/link";
import PageTransition from "./components/PageTransition";
import ScrollReveal from "./components/ScrollReveal";
import StaggerChildren, { StaggerItem } from "./components/StaggerChildren";

// All concept pages with their metadata
// This data structure exists only on the server - never sent to the client
const conceptPages = [
  {
    category: "Core Concepts",
    description: "Fundamental building blocks of Next.js",
    items: [
      {
        name: "Server Components",
        path: "/concepts/server-components",
        description: "Components that render on the server with zero client JS",
        icon: "🖥️",
        color: "from-green-500/20 to-green-600/5",
      },
      {
        name: "Client Components",
        path: "/concepts/client-components",
        description: "Interactive components that hydrate in the browser",
        icon: "🌐",
        color: "from-blue-500/20 to-blue-600/5",
      },
      {
        name: "Data Fetching",
        path: "/concepts/data-fetching",
        description: "Server fetch, client fetch, and caching strategies",
        icon: "📡",
        color: "from-purple-500/20 to-purple-600/5",
      },
      {
        name: "Caching",
        path: "/concepts/caching",
        description: "force-cache, no-store, revalidate, and ISR",
        icon: "💾",
        color: "from-orange-500/20 to-orange-600/5",
      },
      {
        name: "Streaming & Suspense",
        path: "/concepts/streaming",
        description: "Progressive loading with React Suspense boundaries",
        icon: "🌊",
        color: "from-cyan-500/20 to-cyan-600/5",
      },
    ],
  },
  {
    category: "Server Features",
    description: "Server-side capabilities unique to Next.js",
    items: [
      {
        name: "Server Actions",
        path: "/concepts/server-actions",
        description: "Form mutations and data updates without API routes",
        icon: "⚡",
        color: "from-yellow-500/20 to-yellow-600/5",
      },
      {
        name: "API Routes",
        path: "/concepts/api-routes",
        description: "RESTful API endpoints with Route Handlers",
        icon: "🔌",
        color: "from-indigo-500/20 to-indigo-600/5",
      },
      {
        name: "Middleware",
        path: "/concepts/middleware-demo",
        description: "Request interception for auth, redirects, and more",
        icon: "🛡️",
        color: "from-red-500/20 to-red-600/5",
      },
    ],
  },
  {
    category: "Routing & Layout",
    description: "How Next.js handles page navigation and structure",
    items: [
      {
        name: "Layout System",
        path: "/concepts/layouts",
        description: "Nested layouts that persist across page navigations",
        icon: "📐",
        color: "from-teal-500/20 to-teal-600/5",
      },
      {
        name: "Dynamic Routing",
        path: "/concepts/dynamic-routing",
        description: "Dynamic segments, catch-all routes, and params",
        icon: "🔀",
        color: "from-pink-500/20 to-pink-600/5",
      },
      {
        name: "Static vs Dynamic",
        path: "/concepts/static-vs-dynamic",
        description: "When pages are statically generated vs server-rendered",
        icon: "⚖️",
        color: "from-amber-500/20 to-amber-600/5",
      },
    ],
  },
  {
    category: "Advanced",
    description: "Performance, optimization, and advanced features",
    items: [
      {
        name: "Edge Runtime",
        path: "/concepts/edge-runtime",
        description: "Lightweight runtime for globally distributed execution",
        icon: "🌍",
        color: "from-emerald-500/20 to-emerald-600/5",
      },
      {
        name: "Performance",
        path: "/concepts/performance",
        description: "Image optimization, code splitting, and dynamic imports",
        icon: "🚀",
        color: "from-violet-500/20 to-violet-600/5",
      },
      {
        name: "Env Variables",
        path: "/concepts/env-variables",
        description: "Server-only vs public environment variables",
        icon: "🔐",
        color: "from-stone-500/20 to-stone-600/5",
      },
      {
        name: "SEO & Metadata",
        path: "/concepts/seo",
        description: "Static and dynamic metadata for search engines",
        icon: "🔍",
        color: "from-sky-500/20 to-sky-600/5",
      },
    ],
  },
];

export default function HomePage() {
  // This entire function runs on the server.
  // The returned JSX is converted to HTML on the server and sent to the browser.
  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="mb-14 md:mb-16 text-center pt-4 md:pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] text-xs font-medium mb-5 border border-[var(--color-accent-blue)]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
            Interactive Learning Platform
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent leading-tight tracking-tight">
            Next.js Learning Playground
          </h1>
          <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8 leading-relaxed">
            An interactive guide for experienced React developers to master every
            Next.js App Router concept. Each page includes working demos,
            code examples, and detailed explanations.
          </p>
          <Link
            href="/react-vs-nextjs"
            className="cta-button inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Here: React vs Next.js Architecture
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        {/* Concept Grid */}
        {conceptPages.map((category, categoryIndex) => (
          <ScrollReveal key={category.category} delay={categoryIndex * 0.05} className="mb-12">
            <div className="mb-5">
              <h2 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                {category.category}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {category.description}
              </p>
            </div>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <StaggerItem key={item.path}>
                  <Link href={item.path}>
                    <div className={`concept-card p-5 bg-gradient-to-br ${item.color} bg-[var(--color-bg-card)] h-full group`}>
                      <div className="text-2xl mb-3 transition-transform duration-200 group-hover:scale-110 inline-block">
                        {item.icon}
                      </div>
                      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1.5">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </ScrollReveal>
        ))}
      </div>
    </PageTransition>
  );
}
