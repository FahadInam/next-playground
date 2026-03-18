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
        accent: "from-emerald-500/15 to-emerald-600/5",
        glow: "group-hover:shadow-emerald-500/10",
      },
      {
        name: "Client Components",
        path: "/concepts/client-components",
        description: "Interactive components that hydrate in the browser",
        icon: "🌐",
        accent: "from-blue-500/15 to-blue-600/5",
        glow: "group-hover:shadow-blue-500/10",
      },
      {
        name: "Data Fetching",
        path: "/concepts/data-fetching",
        description: "Server fetch, client fetch, and caching strategies",
        icon: "📡",
        accent: "from-violet-500/15 to-violet-600/5",
        glow: "group-hover:shadow-violet-500/10",
      },
      {
        name: "Caching",
        path: "/concepts/caching",
        description: "force-cache, no-store, revalidate, and ISR",
        icon: "💾",
        accent: "from-amber-500/15 to-amber-600/5",
        glow: "group-hover:shadow-amber-500/10",
      },
      {
        name: "Streaming & Suspense",
        path: "/concepts/streaming",
        description: "Progressive loading with React Suspense boundaries",
        icon: "🌊",
        accent: "from-cyan-500/15 to-cyan-600/5",
        glow: "group-hover:shadow-cyan-500/10",
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
        accent: "from-yellow-500/15 to-yellow-600/5",
        glow: "group-hover:shadow-yellow-500/10",
      },
      {
        name: "API Routes",
        path: "/concepts/api-routes",
        description: "RESTful API endpoints with Route Handlers",
        icon: "🔌",
        accent: "from-indigo-500/15 to-indigo-600/5",
        glow: "group-hover:shadow-indigo-500/10",
      },
      {
        name: "Middleware",
        path: "/concepts/middleware-demo",
        description: "Request interception for auth, redirects, and more",
        icon: "🛡️",
        accent: "from-rose-500/15 to-rose-600/5",
        glow: "group-hover:shadow-rose-500/10",
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
        accent: "from-teal-500/15 to-teal-600/5",
        glow: "group-hover:shadow-teal-500/10",
      },
      {
        name: "Dynamic Routing",
        path: "/concepts/dynamic-routing",
        description: "Dynamic segments, catch-all routes, and params",
        icon: "🔀",
        accent: "from-pink-500/15 to-pink-600/5",
        glow: "group-hover:shadow-pink-500/10",
      },
      {
        name: "Static vs Dynamic",
        path: "/concepts/static-vs-dynamic",
        description: "When pages are statically generated vs server-rendered",
        icon: "⚖️",
        accent: "from-orange-500/15 to-orange-600/5",
        glow: "group-hover:shadow-orange-500/10",
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
        accent: "from-emerald-500/15 to-emerald-600/5",
        glow: "group-hover:shadow-emerald-500/10",
      },
      {
        name: "Performance",
        path: "/concepts/performance",
        description: "Image optimization, code splitting, and dynamic imports",
        icon: "🚀",
        accent: "from-fuchsia-500/15 to-fuchsia-600/5",
        glow: "group-hover:shadow-fuchsia-500/10",
      },
      {
        name: "Env Variables",
        path: "/concepts/env-variables",
        description: "Server-only vs public environment variables",
        icon: "🔐",
        accent: "from-stone-400/15 to-stone-500/5",
        glow: "group-hover:shadow-stone-400/10",
      },
      {
        name: "SEO & Metadata",
        path: "/concepts/seo",
        description: "Static and dynamic metadata for search engines",
        icon: "🔍",
        accent: "from-sky-500/15 to-sky-600/5",
        glow: "group-hover:shadow-sky-500/10",
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
        {/* ─── Hero Section ──────────────────────────────────── */}
        <div className="mb-16 md:mb-20 text-center pt-6 md:pt-12">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-accent-blue)]/8 text-[var(--color-accent-blue)] text-xs font-medium mb-6 border border-[var(--color-accent-blue)]/15">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
            Interactive Learning Platform
          </div>

          {/* Title with gradient */}
          <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-display)] font-bold mb-6 leading-[1.1] tracking-tight">
            <span className="bg-gradient-to-r from-[#4c9aff] via-[#a78bfa] to-[#34d399] bg-clip-text text-transparent">
              Next.js Learning
            </span>
            <br />
            <span className="text-[var(--color-text-primary)]">
              Playground
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            An interactive guide for experienced React developers to master every
            Next.js App Router concept. Each page includes working demos,
            code examples, and detailed explanations.
          </p>

          {/* CTA Button */}
          <Link
            href="/react-vs-nextjs"
            className="cta-button inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#4c9aff] to-[#7c6cf0] text-white font-semibold text-[15px] hover:from-[#5aa5ff] hover:to-[#8d7ff5] transition-all shadow-lg shadow-blue-500/15 hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Here: React vs Next.js Architecture
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>

          {/* Stats strip */}
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-accent-green)] font-semibold">30+</span>
              <span>Concept Pages</span>
            </div>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-accent-blue)] font-semibold">Live</span>
              <span>Working Demos</span>
            </div>
            <div className="w-px h-4 bg-[var(--color-border)]" />
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-accent-purple)] font-semibold">App</span>
              <span>Router</span>
            </div>
          </div>
        </div>

        {/* ─── Concept Grid ─────────────────────────────────── */}
        {conceptPages.map((category, categoryIndex) => (
          <ScrollReveal key={category.category} delay={categoryIndex * 0.05} className="mb-14">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-text-primary)] tracking-tight">
                {category.category}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
                {category.description}
              </p>
            </div>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <StaggerItem key={item.path}>
                  <Link href={item.path} className="group">
                    <div className={`concept-card p-5 bg-gradient-to-br ${item.accent} h-full`}>
                      <div className="text-2xl mb-3.5 transition-transform duration-300 group-hover:scale-110 inline-block">
                        {item.icon}
                      </div>
                      <h3 className="text-[15px] font-[family-name:var(--font-display)] font-semibold text-[var(--color-text-primary)] mb-1.5">
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
