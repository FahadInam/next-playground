// E-COMMERCE ARCHITECTURE ANALYSIS - SERVER COMPONENT
// ====================================================
// This page is a Server Component (the default in Next.js App Router).
// There is NO "use client" directive — this entire file runs on the server.
//
// WHY SERVER COMPONENT?
// - This page is purely educational content (text, code examples, diagrams)
// - No useState, useEffect, onClick, or browser APIs needed
// - All content is static — no interactivity required
// - CodeBlock IS a Client Component (copy button), but Next.js handles the
//   boundary automatically when we import it here
//
// WHAT HAPPENS DURING A REQUEST:
// 1. User navigates to /concepts/real-world/ecommerce
// 2. Next.js server receives the request
// 3. This component function executes on the server (Node.js)
// 4. All JSX is rendered to HTML on the server
// 5. CodeBlock's small JS bundle is included for hydration (copy button)
// 6. FlowDiagram renders to pure HTML — zero JS sent
// 7. Combined HTML + minimal JS is streamed to the browser
//
// EDUCATIONAL CONTEXT:
// This page teaches React developers how to THINK about architecting
// a real e-commerce application using Next.js. It does NOT build one —
// instead, it explains the architectural decisions and trade-offs.

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

// SERVER-SIDE EXECUTION:
// This function runs ONLY on the server. The browser receives only HTML output.
export default function EcommerceArchitecturePage() {
  return (
    <ConceptPage
      title="E-commerce Website Architecture"
      description="A complete architectural analysis of how to build a production e-commerce website using Next.js App Router — covering rendering strategies, data fetching, authentication, caching, SEO, and performance."
      serverOrClient="both"
    >
      {/* Layman Explanation - Introductory Analogy */}
      <section className="space-y-4">
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Layman Explanation</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Think of this page as a blueprint review meeting for a department store. Before construction begins, the architect explains every decision — where to put the entrance, how to organize departments, where security goes, and how to handle the checkout lines. This page walks you through every architectural decision for building an e-commerce website with Next.js.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 0: TABLE OF CONTENTS
          Provides in-page navigation for this long architecture document.
          Uses anchor links to jump to each section.
          ============================================================ */}
      <section className="space-y-4">
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Table of Contents
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { num: "1", label: "Project Overview", id: "overview" },
              { num: "2", label: "High-Level Architecture", id: "architecture" },
              { num: "3", label: "Server vs Client Components", id: "components" },
              { num: "4", label: "Rendering Strategy", id: "rendering" },
              { num: "5", label: "Data Fetching Strategy", id: "data-fetching" },
              { num: "6", label: "SEO & Metadata Strategy", id: "seo" },
              { num: "7", label: "Performance Strategy", id: "performance" },
              { num: "8", label: "Authentication Strategy", id: "authentication" },
              { num: "9", label: "Caching Strategy", id: "caching" },
              { num: "10", label: "Execution Flow", id: "execution-flow" },
              { num: "11", label: "Layman Explanation", id: "layman" },
              { num: "12", label: "Key Takeaways", id: "takeaways" },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-accent-blue)] transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] text-xs flex items-center justify-center font-bold">
                  {item.num}
                </span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: PROJECT OVERVIEW
          Sets the context: what are we building and what features does it have?
          Every subsequent architecture decision references these features.
          ============================================================ */}
      <section id="overview" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          1. Project Overview
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            We are architecting <strong className="text-[var(--color-text-primary)]">&quot;ShopNext&quot;</strong> —
            a mid-size e-commerce store selling physical products. Think of it as a simplified
            version of sites like Nike.com or Allbirds.com. The goal is to understand which
            Next.js features to use for each part of the application.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: "📦", name: "Product Catalog", desc: "Browse products by category with filters and search" },
              { icon: "🔍", name: "Product Detail", desc: "Full product page with images, specs, and reviews" },
              { icon: "🛒", name: "Shopping Cart", desc: "Add/remove items, update quantities, persist across sessions" },
              { icon: "💳", name: "Checkout", desc: "Multi-step checkout with address, payment, and order confirmation" },
              { icon: "🔐", name: "Authentication", desc: "Login, register, password reset, OAuth providers" },
              { icon: "👤", name: "User Account", desc: "Order history, saved addresses, profile settings" },
              { icon: "⭐", name: "Reviews", desc: "Star ratings, text reviews, helpful votes" },
              { icon: "🛠️", name: "Admin Dashboard", desc: "Manage products, orders, users, and analytics" },
            ].map((feature) => (
              <div
                key={feature.name}
                className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-border)]"
              >
                <span className="text-2xl">{feature.icon}</span>
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mt-2">
                  {feature.name}
                </h4>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: HIGH-LEVEL ARCHITECTURE
          Shows the Next.js App Router file structure for the project.
          This is the first thing an architect plans — the route layout.
          ============================================================ */}
      <section id="architecture" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          2. High-Level Architecture
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            In Next.js App Router, your <strong className="text-[var(--color-text-primary)]">file structure IS your URL structure</strong>.
            Every folder inside <code className="text-[var(--color-accent-blue)]">app/</code> becomes a route.
            This is fundamentally different from React Router where you define routes in code.
          </p>
        </div>

        <CodeBlock
          filename="Project File Structure"
          language="bash"
          code={`app/
├── layout.tsx              # Root layout: header, footer, cart provider
├── page.tsx                # Homepage: hero, featured products, categories
├── loading.tsx             # Global loading skeleton
├── error.tsx               # Global error boundary
├── not-found.tsx           # Custom 404 page
│
├── products/
│   ├── page.tsx            # Product listing with filters & pagination
│   ├── loading.tsx         # Skeleton grid while products load
│   └── [slug]/
│       ├── page.tsx        # Product detail page (SSG + ISR)
│       ├── loading.tsx     # Product detail skeleton
│       └── reviews/
│           └── page.tsx    # All reviews for a product
│
├── categories/
│   └── [category]/
│       └── page.tsx        # Category listing (ISR)
│
├── cart/
│   └── page.tsx            # Full cart page (Client Component heavy)
│
├── checkout/
│   ├── page.tsx            # Checkout step 1: shipping address
│   ├── payment/
│   │   └── page.tsx        # Checkout step 2: payment
│   └── confirmation/
│       └── page.tsx        # Order confirmation (SSR)
│
├── auth/
│   ├── login/page.tsx      # Login form
│   └── register/page.tsx   # Registration form
│
├── account/
│   ├── layout.tsx          # Protected layout (checks auth)
│   ├── page.tsx            # Account overview
│   ├── orders/
│   │   ├── page.tsx        # Order history list
│   │   └── [id]/page.tsx   # Single order detail
│   └── settings/page.tsx   # Profile settings
│
├── admin/
│   ├── layout.tsx          # Admin layout with admin nav (protected)
│   ├── page.tsx            # Admin dashboard / analytics
│   ├── products/page.tsx   # Product management (CRUD)
│   └── orders/page.tsx     # Order management
│
├── search/
│   └── page.tsx            # Search results (SSR, dynamic)
│
└── api/
    ├── auth/[...nextauth]/route.ts  # NextAuth.js handler
    ├── cart/route.ts                # Cart CRUD operations
    ├── checkout/route.ts            # Process checkout
    ├── products/route.ts            # Product data API
    ├── reviews/route.ts             # Review submission
    └── webhooks/stripe/route.ts     # Stripe payment webhooks`}
        />

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            Why This Structure?
          </h3>
          <div className="space-y-3 text-sm text-[var(--color-text-secondary)]">
            <p>
              <strong className="text-[var(--color-accent-green)]">Nested layouts</strong> —
              <code>account/layout.tsx</code> and <code>admin/layout.tsx</code> wrap their child routes
              with auth checks and specialized navigation. The root layout provides the global header/footer.
            </p>
            <p>
              <strong className="text-[var(--color-accent-green)]">Dynamic segments</strong> —
              <code>[slug]</code> and <code>[id]</code> allow a single page component to handle
              thousands of products/orders. Next.js extracts the value from the URL automatically.
            </p>
            <p>
              <strong className="text-[var(--color-accent-green)]">Loading states</strong> —
              <code>loading.tsx</code> files create automatic Suspense boundaries. The product grid
              shows a skeleton while data loads, without any manual Suspense code.
            </p>
            <p>
              <strong className="text-[var(--color-accent-green)]">API routes</strong> —
              <code>api/</code> handlers are used for webhook receivers (Stripe), auth callbacks,
              and client-side mutations (cart updates). Server Actions handle most form submissions.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: SERVER VS CLIENT COMPONENTS
          The most important architectural decision in Next.js.
          For each major component, explain WHERE it runs and WHY.
          ============================================================ */}
      <section id="components" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          3. Server vs Client Components
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)] mb-4">
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            The golden rule: <strong className="text-[var(--color-text-primary)]">default to Server Components,
            add &quot;use client&quot; only when you must</strong>. In an e-commerce site, most of the page
            is displaying data (products, descriptions, reviews) — that&apos;s all Server Component territory.
            Only the interactive bits (buttons, forms, carousels) need to be Client Components.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Server Components */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border-2 border-green-500/30">
            <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
              <span className="tag-server text-xs px-2 py-0.5 rounded">Server</span>
              Server Components
            </h3>
            <div className="space-y-3">
              {[
                { name: "ProductCard", reason: "Displays product name, price, image — no interactivity needed. Fetches data on server, reduces JS bundle." },
                { name: "ProductDetail", reason: "Renders product description, specs, pricing. Static content that benefits from server-side rendering for SEO." },
                { name: "CategoryNav", reason: "Navigation links fetched from database. No state, no onClick handlers — just rendered HTML links." },
                { name: "ReviewsList", reason: "Fetches and displays reviews. Read-only data. Can be wrapped in Suspense for streaming." },
                { name: "Breadcrumbs", reason: "Generated from the URL path on the server. Pure HTML navigation — no client JS needed." },
                { name: "OrderHistory", reason: "Fetches user's orders on the server with auth. Sensitive data stays server-side, never exposed in client bundle." },
                { name: "Footer / Header", reason: "Static content, links, branding. Zero interactivity. Should NEVER be Client Components." },
                { name: "ProductGrid", reason: "Maps over products array and renders ProductCards. The grid itself needs no state or effects." },
              ].map((item) => (
                <div key={item.name} className="flex items-start gap-2">
                  <span className="text-green-400 mt-1 flex-shrink-0">✓</span>
                  <div>
                    <span className="text-[var(--color-text-primary)] font-medium text-sm">{item.name}</span>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Components */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border-2 border-blue-500/30">
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="tag-client text-xs px-2 py-0.5 rounded">Client</span>
              Client Components
            </h3>
            <div className="space-y-3">
              {[
                { name: "AddToCartButton", reason: "Needs onClick handler to add item to cart. Updates cart state (context/store). Must be a Client Component." },
                { name: "SearchBar", reason: "Uses useState for input value, onChange for real-time filtering, and possibly useEffect for debounced search API calls." },
                { name: "CartSidebar", reason: "Interactive slide-out panel. Needs useState for open/close, animations, and real-time cart state updates." },
                { name: "ImageGallery", reason: "Carousel/zoom functionality requires browser APIs (mouse position, touch events). useState for selected image index." },
                { name: "QuantitySelector", reason: "Increment/decrement buttons need onClick handlers. Updates local and cart state." },
                { name: "FilterSidebar", reason: "Checkboxes, range sliders, dropdowns all need useState. URL updates via useRouter for shareable filter URLs." },
                { name: "ReviewForm", reason: "Form with star rating selector (onClick), text input (onChange), and submission (onSubmit). Uses a Server Action for the actual submit." },
                { name: "WishlistButton", reason: "Toggle heart icon on click. Optimistic UI update with useState, then syncs to server." },
              ].map((item) => (
                <div key={item.name} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1 flex-shrink-0">✓</span>
                  <div>
                    <span className="text-[var(--color-text-primary)] font-medium text-sm">{item.name}</span>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision tree */}
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            Decision Tree: Server or Client?
          </h3>
          <div className="text-sm text-[var(--color-text-secondary)] space-y-2 font-mono">
            <p>Does the component need...</p>
            <p className="pl-4">├── useState, useEffect, useContext? → <span className="text-blue-400 font-bold">Client Component</span></p>
            <p className="pl-4">├── onClick, onChange, onSubmit? → <span className="text-blue-400 font-bold">Client Component</span></p>
            <p className="pl-4">├── Browser APIs (window, localStorage)? → <span className="text-blue-400 font-bold">Client Component</span></p>
            <p className="pl-4">├── Real-time updates / animations? → <span className="text-blue-400 font-bold">Client Component</span></p>
            <p className="pl-4">└── None of the above? → <span className="text-green-400 font-bold">Server Component ✓</span></p>
          </div>
        </div>

        <CodeBlock
          filename="Mixing Server and Client Components on a Product Page"
          language="tsx"
          code={`// app/products/[slug]/page.tsx
// SERVER COMPONENT — fetches product data on the server
// This component runs ONLY on the Node.js server

import { AddToCartButton } from "./AddToCartButton";  // Client Component
import { ImageGallery } from "./ImageGallery";          // Client Component
import { ReviewsList } from "./ReviewsList";             // Server Component
import { Suspense } from "react";

// ASYNC SERVER COMPONENT: Can use await directly (no useEffect needed)
// The slug parameter is extracted from the URL by Next.js automatically
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // SERVER-SIDE FETCH: This runs on the server — not visible in browser DevTools
  // Can directly access databases, internal APIs, or secrets
  const product = await fetch(\`https://api.shop.com/products/\${slug}\`, {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  }).then((r) => r.json());

  return (
    <div>
      {/* SERVER: Pure HTML — zero JS sent for this section */}
      <h1>{product.name}</h1>
      <p className="text-2xl font-bold">\${product.price}</p>
      <p>{product.description}</p>

      {/* CLIENT: ImageGallery needs mouse events and useState */}
      {/* Next.js includes its JS bundle for hydration */}
      <ImageGallery images={product.images} />

      {/* CLIENT: AddToCartButton needs onClick and cart context */}
      <AddToCartButton productId={product.id} />

      {/* SERVER + STREAMING: Reviews load independently */}
      {/* The page shell renders instantly; reviews stream in when ready */}
      <Suspense fallback={<ReviewsSkeleton />}>
        <ReviewsList productId={product.id} />
      </Suspense>
    </div>
  );
}`}
        />
      </section>

      {/* ============================================================
          SECTION 4: RENDERING STRATEGY
          Which pages use SSG, SSR, ISR, or CSR — and WHY.
          This is the architect's most impactful decision.
          ============================================================ */}
      <section id="rendering" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          4. Rendering Strategy
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            The core question for each page: <strong className="text-[var(--color-text-primary)]">How often does this data change?</strong>
            The answer determines your rendering strategy.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-[var(--color-text-primary)]">Page</th>
                  <th className="text-left py-3 px-4 text-[var(--color-text-primary)]">Strategy</th>
                  <th className="text-left py-3 px-4 text-[var(--color-text-primary)]">Why?</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Homepage</td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">SSG + ISR (60s)</span></td>
                  <td className="py-3 px-4">Featured products change occasionally. Revalidate every 60 seconds — fast for millions of visitors.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Product Listing</td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">SSG + ISR (60s)</span></td>
                  <td className="py-3 px-4">Products are added/updated by admins. ISR serves cached pages and rebuilds in background.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Product Detail</td>
                  <td className="py-3 px-4"><span className="text-green-400 font-mono">SSG + ISR (3600s)</span></td>
                  <td className="py-3 px-4">Individual product data rarely changes. Use generateStaticParams to pre-build popular products at build time.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Search Results</td>
                  <td className="py-3 px-4"><span className="text-orange-400 font-mono">SSR (dynamic)</span></td>
                  <td className="py-3 px-4">Query is user-specific and can&apos;t be pre-built. Must render fresh for every request.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Cart</td>
                  <td className="py-3 px-4"><span className="text-blue-400 font-mono">CSR (Client)</span></td>
                  <td className="py-3 px-4">Cart is per-user, changes frequently, needs instant UI updates. Lives in client state (context/store).</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Checkout</td>
                  <td className="py-3 px-4"><span className="text-orange-400 font-mono">SSR (force-dynamic)</span></td>
                  <td className="py-3 px-4">Must verify auth, load fresh cart data, and show real-time pricing. Never serve stale checkout data.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Account Pages</td>
                  <td className="py-3 px-4"><span className="text-orange-400 font-mono">SSR (protected)</span></td>
                  <td className="py-3 px-4">User-specific data (orders, settings). Must check authentication and fetch per-user data on every request.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Admin Dashboard</td>
                  <td className="py-3 px-4"><span className="text-orange-400 font-mono">SSR (protected)</span></td>
                  <td className="py-3 px-4">Real-time analytics and order data. No caching — admin always needs fresh data.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <CodeBlock
          filename="Configuring Rendering Strategies in Next.js"
          language="tsx"
          code={`// ─── ISR: Product detail page ──────────────────────────
// app/products/[slug]/page.tsx

// REVALIDATE: This tells Next.js to cache the page for 3600 seconds (1 hour).
// After 1 hour, the next visitor gets the cached (stale) page,
// AND Next.js rebuilds the page in the background.
// The FOLLOWING visitor gets the fresh page.
export const revalidate = 3600;

// GENERATE STATIC PARAMS: Pre-build the top 100 products at build time.
// These pages will be ready as static HTML — zero server work at request time.
// Products NOT in this list will be built on-demand (first visitor triggers build).
export async function generateStaticParams() {
  const products = await fetch("https://api.shop.com/products/popular?limit=100")
    .then(r => r.json());

  return products.map((p: { slug: string }) => ({
    slug: p.slug, // Each object maps to the [slug] dynamic segment
  }));
}

// ─── SSR: Checkout page (always fresh) ────────────────
// app/checkout/page.tsx

// FORCE-DYNAMIC: Every request hits the server. No caching at all.
// This is critical for checkout — stale prices or cart data = angry customers.
export const dynamic = "force-dynamic";

// ─── SSG + ISR: Homepage ──────────────────────────────
// app/page.tsx

// REVALIDATE: Rebuild homepage every 60 seconds.
// Millions of visitors all see the same cached HTML.
// Only one server render per minute, regardless of traffic.
export const revalidate = 60;`}
        />
      </section>

      {/* ============================================================
          SECTION 5: DATA FETCHING STRATEGY
          Where data fetching happens and how to structure it.
          ============================================================ */}
      <section id="data-fetching" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          5. Data Fetching Strategy
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            The Principle: Fetch Where You Use
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            In Next.js, each Server Component can fetch its own data independently. Unlike React SPA
            where you might fetch everything in a parent and pass props down, Next.js
            <strong className="text-[var(--color-text-primary)]"> deduplicates identical fetch requests automatically</strong>.
            This means two components fetching the same URL will only trigger one actual HTTP request.
          </p>
        </div>

        <FlowDiagram
          title="Data Flow: Product Detail Page"
          steps={[
            {
              label: "Layout (Root)",
              description: "Fetches: site config, navigation categories. Shared across ALL pages — cached aggressively.",
              type: "server" as const,
            },
            {
              label: "Layout (Products)",
              description: "No additional fetching. Provides product-section-specific UI wrapper.",
              type: "server" as const,
            },
            {
              label: "Page (Product Detail)",
              description: "Fetches: product by slug (price, description, images). ISR cached for 1 hour.",
              type: "server" as const,
            },
            {
              label: "Suspense Boundary",
              description: "Wraps slow data. Page shell renders instantly while these load in parallel.",
              type: "neutral" as const,
            },
            {
              label: "ReviewsList (async)",
              description: "Fetches: reviews for this product. Streams in when ready — doesn't block the page.",
              type: "server" as const,
            },
            {
              label: "Recommendations (async)",
              description: "Fetches: related products via ML API. Slow call — streams independently.",
              type: "server" as const,
            },
            {
              label: "Client Hydration",
              description: "AddToCartButton, ImageGallery, WishlistButton hydrate with their JS bundles.",
              type: "client" as const,
            },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <CodeBlock
            filename="Server Component: Parallel Fetching"
            language="tsx"
            code={`// SERVER COMPONENT — runs on Node.js server
// Parallel fetching eliminates waterfalls

async function ProductPage({ params }) {
  const { slug } = await params;

  // PARALLEL: Both fetches start at the same time
  // In a React SPA, you'd need Promise.all in useEffect
  // In Next.js, you can simply start both promises
  const productPromise = fetch(
    \`/api/products/\${slug}\`,
    { next: { revalidate: 3600 } }
  );
  const reviewsPromise = fetch(
    \`/api/reviews?product=\${slug}\`,
    { next: { revalidate: 300 } }
  );

  // AWAIT BOTH: Total time = max(product, reviews)
  // Not product + reviews (sequential waterfall)
  const [productRes, reviewsRes] = await Promise.all([
    productPromise,
    reviewsPromise,
  ]);

  const product = await productRes.json();
  const reviews = await reviewsRes.json();

  return (
    <div>
      <h1>{product.name}</h1>
      <ReviewsList reviews={reviews} />
    </div>
  );
}`}
          />

          <CodeBlock
            filename="Client Component: Cart Data"
            language="tsx"
            code={`"use client";
// CLIENT COMPONENT — runs in the browser
// Cart data is per-user and changes constantly
// This CANNOT be a Server Component because:
// 1. Cart state lives in browser (context/store)
// 2. Needs instant UI updates on add/remove
// 3. Needs onClick handlers

import { useCart } from "@/hooks/useCart";
import { useState } from "react";

export function AddToCartButton({
  productId,
  price,
}: {
  productId: string;
  price: number;
}) {
  // STATE: Lives in browser memory
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  // EVENT HANDLER: Runs in the browser
  const handleAdd = async () => {
    setAdding(true);

    // OPTIMISTIC UPDATE: Show success immediately
    addItem({ productId, price, quantity: 1 });

    // SYNC TO SERVER: Persist cart via API route
    await fetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });

    setAdding(false);
  };

  return (
    <button onClick={handleAdd} disabled={adding}>
      {adding ? "Adding..." : "Add to Cart"}
    </button>
  );
}`}
          />
        </div>

        {/* Data fetching locations summary */}
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Where Each Type of Data is Fetched
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-400">Server Components</h4>
              <ul className="space-y-1 text-[var(--color-text-secondary)]">
                <li>• Product catalog, categories, details</li>
                <li>• User orders (with auth check on server)</li>
                <li>• Reviews, ratings, recommendations</li>
                <li>• Site config, navigation, SEO data</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Client Components</h4>
              <ul className="space-y-1 text-[var(--color-text-secondary)]">
                <li>• Cart state (real-time, per-user)</li>
                <li>• Search autocomplete suggestions</li>
                <li>• Wishlist toggles</li>
                <li>• Live inventory/stock updates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[var(--color-accent-purple)]">Server Actions</h4>
              <ul className="space-y-1 text-[var(--color-text-secondary)]">
                <li>• Submit review form</li>
                <li>• Update profile settings</li>
                <li>• Place order (checkout submission)</li>
                <li>• Admin: create/update/delete products</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-[var(--color-accent-orange)]">API Routes</h4>
              <ul className="space-y-1 text-[var(--color-text-secondary)]">
                <li>• Stripe webhook handler</li>
                <li>• NextAuth.js callback routes</li>
                <li>• Cart CRUD (called from Client Components)</li>
                <li>• External service integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: SEO & METADATA STRATEGY
          How to make product pages rank well on Google.
          ============================================================ */}
      <section id="seo" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          6. SEO & Metadata Strategy
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            SEO is one of the biggest reasons to choose Next.js over a React SPA for e-commerce.
            Google needs to see your product data in the HTML — not behind a loading spinner.
            Next.js&apos;s <code className="text-[var(--color-accent-blue)]">generateMetadata</code> function
            lets you dynamically generate SEO tags per page.
          </p>
        </div>

        <CodeBlock
          filename="Dynamic Metadata for Product Pages"
          language="tsx"
          code={`// app/products/[slug]/page.tsx
// SERVER-SIDE ONLY: generateMetadata runs on the server during rendering
// The browser never sees this function — only the resulting <head> tags

import { Metadata } from "next";

// This function runs BEFORE the page component renders.
// Next.js calls it to generate <title>, <meta>, and OpenGraph tags.
// The fetch here is DEDUPLICATED with the same fetch in the page component.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // FETCH: Same URL as the page component — Next.js deduplicates this
  // Only ONE actual HTTP request is made, even though two functions call it
  const product = await fetch(\`https://api.shop.com/products/\${slug}\`).then(
    (r) => r.json()
  );

  return {
    // <title>Blue Running Shoes | ShopNext</title>
    title: \`\${product.name} | ShopNext\`,

    // <meta name="description" content="...">
    description: product.description.slice(0, 160),

    // OpenGraph tags — used by Facebook, LinkedIn, Slack, iMessage
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      images: [
        {
          url: product.images[0].url,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },

    // Twitter card — used by X/Twitter
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 200),
      images: [product.images[0].url],
    },

    // Canonical URL — prevents duplicate content issues
    alternates: {
      canonical: \`https://shopnext.com/products/\${slug}\`,
    },
  };
}`}
        />

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            SEO Priority by Page Type
          </h3>
          <div className="space-y-2 text-sm">
            {[
              { page: "Product Detail", priority: "Critical", color: "text-red-400", reason: "Product pages ARE the business. Must rank on Google Shopping, search results." },
              { page: "Category Pages", priority: "High", color: "text-orange-400", reason: "Category pages rank for broad keywords like 'running shoes' or 'winter jackets'." },
              { page: "Homepage", priority: "High", color: "text-orange-400", reason: "Brand searches land here. Needs strong title, description, and structured data." },
              { page: "Search Results", priority: "Low", color: "text-green-400", reason: "Internal search pages shouldn't rank (duplicate content). Use noindex." },
              { page: "Cart / Checkout", priority: "None", color: "text-[var(--color-text-muted)]", reason: "Private, user-specific. No SEO value. Use noindex, nofollow." },
              { page: "Account / Admin", priority: "None", color: "text-[var(--color-text-muted)]", reason: "Protected pages behind auth. Not indexable." },
            ].map((item) => (
              <div key={item.page} className="flex items-center gap-4 py-2 border-b border-[var(--color-border)]/30 last:border-0">
                <span className="w-32 text-[var(--color-text-primary)] font-medium">{item.page}</span>
                <span className={`w-16 font-bold ${item.color}`}>{item.priority}</span>
                <span className="text-[var(--color-text-secondary)] flex-1">{item.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: PERFORMANCE STRATEGY
          How Next.js features make e-commerce sites fast.
          ============================================================ */}
      <section id="performance" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          7. Performance Strategy
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Streaming with Suspense",
              icon: "🌊",
              desc: "Wrap slow sections (reviews, recommendations) in <Suspense>. The product info renders instantly; slower parts stream in when ready. Users see content faster.",
              color: "border-blue-500/30",
            },
            {
              title: "Image Optimization",
              icon: "🖼️",
              desc: "Use next/image for all product images. Automatic WebP/AVIF conversion, lazy loading, responsive srcsets. Critical for e-commerce where product images are the largest assets.",
              color: "border-green-500/30",
            },
            {
              title: "Code Splitting",
              icon: "✂️",
              desc: "Automatic per-route code splitting. Visiting /products doesn't load /admin JS. Client Components are split into separate chunks automatically.",
              color: "border-purple-500/30",
            },
            {
              title: "Dynamic Imports",
              icon: "📦",
              desc: "Lazy-load heavy Client Components like ImageGallery or the rich text editor in admin. Use next/dynamic with a loading skeleton.",
              color: "border-orange-500/30",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`bg-[var(--color-bg-card)] rounded-lg p-5 border ${item.color}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <h4 className="text-[var(--color-text-primary)] font-semibold mt-2">{item.title}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2">{item.desc}</p>
            </div>
          ))}
        </div>

        <FlowDiagram
          title="Streaming: Product Page Load Sequence"
          steps={[
            {
              label: "Browser Request",
              description: "User clicks on a product link",
              type: "client" as const,
            },
            {
              label: "Shell HTML Sent",
              description: "Header, nav, product name/price render instantly as HTML",
              type: "network" as const,
            },
            {
              label: "User Sees Product",
              description: "Main product info visible immediately (< 200ms TTFB)",
              type: "client" as const,
            },
            {
              label: "Images Load",
              description: "next/image loads optimized WebP, lazy-loads below-fold images",
              type: "network" as const,
            },
            {
              label: "Reviews Stream In",
              description: "Suspense fallback replaced with actual reviews when DB query completes",
              type: "server" as const,
            },
            {
              label: "Recommendations Stream In",
              description: "ML-powered 'You may also like' section arrives last",
              type: "server" as const,
            },
            {
              label: "Client Components Hydrate",
              description: "AddToCart, ImageGallery, WishlistButton become interactive",
              type: "client" as const,
            },
          ]}
        />

        <CodeBlock
          filename="Streaming with Suspense Boundaries"
          language="tsx"
          code={`// app/products/[slug]/page.tsx
// SERVER COMPONENT — streaming architecture

import { Suspense } from "react";
import { ProductInfo } from "./ProductInfo";       // Server Component
import { ImageGallery } from "./ImageGallery";     // Client Component
import { ReviewsList } from "./ReviewsList";       // Server Component (async)
import { Recommendations } from "./Recommendations"; // Server Component (async)

export default async function ProductPage({ params }) {
  const { slug } = await params;

  // This fetch is FAST (cached via ISR) — doesn't block
  const product = await getProduct(slug);

  return (
    <div>
      {/* INSTANT: Renders immediately in the first HTML chunk */}
      <ProductInfo product={product} />
      <ImageGallery images={product.images} />

      {/* STREAMED: Shows skeleton first, then real content */}
      {/* The page doesn't wait for reviews before sending HTML */}
      <Suspense fallback={<ReviewsSkeleton />}>
        {/* ReviewsList is an async Server Component that fetches reviews */}
        {/* It "suspends" until the data is ready, then streams in */}
        <ReviewsList productId={product.id} />
      </Suspense>

      {/* STREAMED: Loads independently of reviews */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations category={product.category} />
      </Suspense>
    </div>
  );
}`}
        />
      </section>

      {/* ============================================================
          SECTION 8: AUTHENTICATION STRATEGY
          How to protect routes and handle user sessions.
          ============================================================ */}
      <section id="authentication" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          8. Authentication Strategy
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
            Layered Protection Approach
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            Authentication in Next.js works at <strong className="text-[var(--color-text-primary)]">three layers</strong>.
            Each layer serves a different purpose — you need all three for a secure e-commerce site.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-[var(--color-accent-purple)]/30 bg-[var(--color-accent-purple)]/5">
              <h4 className="font-semibold text-[var(--color-accent-purple)]">Layer 1: Middleware</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                Runs BEFORE any page renders. Checks for auth cookie/token. Redirects unauthenticated
                users to /login. Fast — runs at the edge, no database call.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
              <h4 className="font-semibold text-green-400">Layer 2: Server Components</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                Reads the session to get user data (name, role, permissions). Fetches user-specific
                data from the database. Controls what data is visible.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
              <h4 className="font-semibold text-blue-400">Layer 3: Client Components</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                Shows/hides UI elements based on auth state. Handles login forms. Manages
                session refresh. Never trust client-side auth alone — always verify on server.
              </p>
            </div>
          </div>
        </div>

        <FlowDiagram
          title="Authentication Flow: Visiting /account/orders"
          steps={[
            {
              label: "Browser Request",
              description: "User navigates to /account/orders",
              type: "client" as const,
            },
            {
              label: "Middleware Executes",
              description: "middleware.ts checks for session cookie. Path matches /account/* pattern.",
              type: "server" as const,
            },
            {
              label: "Auth Check",
              description: "Cookie found? → Continue. No cookie? → Redirect to /auth/login?from=/account/orders",
              type: "server" as const,
            },
            {
              label: "Layout Auth",
              description: "account/layout.tsx reads session, gets user ID and role from JWT/session",
              type: "server" as const,
            },
            {
              label: "Page Renders",
              description: "orders/page.tsx fetches orders WHERE userId = session.userId. Server-side — secure.",
              type: "server" as const,
            },
            {
              label: "HTML Sent",
              description: "Full HTML with order data sent to browser. User sees their orders immediately.",
              type: "network" as const,
            },
          ]}
        />

        <CodeBlock
          filename="Middleware: Route Protection"
          language="tsx"
          code={`// middleware.ts (root of project)
// MIDDLEWARE runs at the EDGE — before ANY page rendering begins
// It intercepts requests and can redirect, rewrite, or add headers
// This is the first line of defense for authentication

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// PROTECTED ROUTES: These paths require authentication
const protectedPaths = ["/account", "/checkout", "/admin"];

// ADMIN ROUTES: These paths require admin role
const adminPaths = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CHECK: Does this path require authentication?
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next(); // Public page — let it through

  // READ SESSION: Check for the auth cookie
  // This does NOT hit the database — just reads the JWT from the cookie
  const session = request.cookies.get("session-token");

  if (!session) {
    // NO SESSION: Redirect to login, preserving the intended destination
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ADMIN CHECK: Verify role for admin routes
  // In production, decode the JWT to check the role claim
  const isAdminRoute = adminPaths.some((p) => pathname.startsWith(p));
  if (isAdminRoute) {
    // Decode JWT and check role (simplified)
    const payload = decodeJWT(session.value);
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// MATCHER: Only run middleware on these paths (performance optimization)
export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"],
};`}
        />
      </section>

      {/* ============================================================
          SECTION 9: CACHING STRATEGY
          What to cache, how long, and why.
          ============================================================ */}
      <section id="caching" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          9. Caching Strategy
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            The mental model: <strong className="text-[var(--color-text-primary)]">What changes often vs. what is mostly static?</strong>
            Cache aggressively for static content, skip caching for user-specific or real-time data.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-[var(--color-text-primary)]">Data</th>
                  <th className="text-left py-3 px-4 text-[var(--color-text-primary)]">Cache Strategy</th>
                  <th className="text-left py-3 px-4 text-[var(--color-text-primary)]">Config</th>
                  <th className="text-left py-3 px-4 text-[var(--color-text-primary)]">Why?</th>
                </tr>
              </thead>
              <tbody className="text-[var(--color-text-secondary)]">
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Product data</td>
                  <td className="py-3 px-4 text-green-400">ISR</td>
                  <td className="py-3 px-4 font-mono text-xs">revalidate: 3600</td>
                  <td className="py-3 px-4">Products change rarely. Stale-while-revalidate pattern works perfectly.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Product images</td>
                  <td className="py-3 px-4 text-green-400">CDN cache</td>
                  <td className="py-3 px-4 font-mono text-xs">next/image</td>
                  <td className="py-3 px-4">next/image handles CDN caching, format conversion, and responsive sizes automatically.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Categories / nav</td>
                  <td className="py-3 px-4 text-green-400">Force cache</td>
                  <td className="py-3 px-4 font-mono text-xs">force-cache</td>
                  <td className="py-3 px-4">Categories almost never change. Cache at build time, revalidate on-demand when admin updates.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Cart data</td>
                  <td className="py-3 px-4 text-red-400">No cache</td>
                  <td className="py-3 px-4 font-mono text-xs">no-store</td>
                  <td className="py-3 px-4">Per-user, changes constantly. Must always be fresh.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">User session</td>
                  <td className="py-3 px-4 text-red-400">No cache</td>
                  <td className="py-3 px-4 font-mono text-xs">no-store</td>
                  <td className="py-3 px-4">Security-sensitive. Always verify fresh from the auth provider.</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]/50">
                  <td className="py-3 px-4 font-medium">Inventory / stock</td>
                  <td className="py-3 px-4 text-orange-400">Short ISR</td>
                  <td className="py-3 px-4 font-mono text-xs">revalidate: 30</td>
                  <td className="py-3 px-4">Stock levels change often. Short revalidation prevents overselling while keeping perf.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Static pages</td>
                  <td className="py-3 px-4 text-green-400">Full route cache</td>
                  <td className="py-3 px-4 font-mono text-xs">SSG</td>
                  <td className="py-3 px-4">About, contact, FAQ pages are fully static. Built once, served from CDN forever.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <CodeBlock
          filename="Cache Configuration Examples"
          language="tsx"
          code={`// ─── Aggressive cache: Categories (rarely change) ─────
const categories = await fetch("https://api.shop.com/categories", {
  cache: "force-cache", // Cache forever until manually revalidated
  // To bust this cache when admin adds a category:
  // await revalidateTag("categories") in a Server Action
  next: { tags: ["categories"] },
});

// ─── ISR cache: Product data (changes occasionally) ───
const product = await fetch(\`https://api.shop.com/products/\${slug}\`, {
  next: {
    revalidate: 3600, // Revalidate every hour
    tags: [\`product-\${slug}\`], // Tag for on-demand revalidation
  },
});

// ─── No cache: Cart (per-user, real-time) ─────────────
const cart = await fetch("https://api.shop.com/cart", {
  cache: "no-store", // Never cache — always fetch fresh
  headers: {
    Authorization: \`Bearer \${session.token}\`,
  },
});

// ─── On-demand revalidation: Admin updates a product ──
// app/admin/products/actions.ts
"use server";
import { revalidateTag } from "next/cache";

export async function updateProduct(slug: string, data: ProductData) {
  await db.products.update({ where: { slug }, data });

  // BUST CACHE: Next time someone visits this product page,
  // Next.js will regenerate it with fresh data
  revalidateTag(\`product-\${slug}\`);
  revalidateTag("products"); // Also bust the product listing cache
}`}
        />
      </section>

      {/* ============================================================
          SECTION 10: EXECUTION FLOW
          The complete request lifecycle when visiting a product page.
          This ties all previous sections together.
          ============================================================ */}
      <section id="execution-flow" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          10. Execution Flow
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            Here is the complete lifecycle when a user visits{" "}
            <code className="text-[var(--color-accent-blue)]">/products/blue-sneakers</code>.
            Every architectural decision from the previous sections comes together in this flow.
          </p>
        </div>

        <FlowDiagram
          title="Full Request Lifecycle: /products/blue-sneakers"
          steps={[
            {
              label: "1. Browser Request",
              description: "User clicks a product link. Browser sends GET /products/blue-sneakers to the Next.js server.",
              type: "client" as const,
            },
            {
              label: "2. Middleware",
              description: "middleware.ts runs at the edge. This is a public page — no auth redirect. Adds analytics headers.",
              type: "server" as const,
            },
            {
              label: "3. Cache Check",
              description: "Next.js checks the Full Route Cache. If a cached HTML exists (ISR) and is fresh, serve it immediately. If stale, serve stale + trigger background revalidation.",
              type: "server" as const,
            },
            {
              label: "4. Route Matching",
              description: "Next.js matches the URL to app/products/[slug]/page.tsx. Extracts slug='blue-sneakers' from the URL.",
              type: "server" as const,
            },
            {
              label: "5. Layout Renders",
              description: "Root layout.tsx renders: header, nav, cart provider wrapper. Fetches site config (cached). This HTML is SHARED across all pages.",
              type: "server" as const,
            },
            {
              label: "6. Page Fetches Data",
              description: "page.tsx calls fetch('/api/products/blue-sneakers') with ISR cache. generateMetadata() runs in parallel for SEO tags.",
              type: "server" as const,
            },
            {
              label: "7. HTML Streamed",
              description: "Product name, price, description sent as HTML immediately. Browser starts painting. Suspense boundaries send skeleton fallbacks.",
              type: "network" as const,
            },
            {
              label: "8. User Sees Product",
              description: "Browser paints the product page. Content is visible before any JS loads. Images start lazy-loading via next/image.",
              type: "client" as const,
            },
            {
              label: "9. Client Hydration",
              description: "Small JS bundles for AddToCartButton, ImageGallery, WishlistButton download and hydrate. Buttons become clickable.",
              type: "client" as const,
            },
            {
              label: "10. Reviews Stream In",
              description: "ReviewsList Server Component finishes its DB query. HTML replaces the skeleton via streaming. No extra JS needed.",
              type: "server" as const,
            },
          ]}
        />
      </section>

      {/* ============================================================
          SECTION 11: LAYMAN EXPLANATION
          The department store analogy for the entire architecture.
          ============================================================ */}
      <section id="layman" className="space-y-6 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          11. Layman Explanation
        </h2>

        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h3 className="text-lg font-semibold text-[var(--color-accent-purple)] mb-4">
            🏬 Think of it as a Department Store
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
            Building an e-commerce site with Next.js is like running a well-organized department store.
            Let&apos;s map every architectural concept to something you can picture:
          </p>

          <div className="space-y-4">
            {[
              {
                concept: "Server Components",
                analogy: "The display shelves and mannequins",
                explanation: "Set up by the store staff (server) BEFORE customers (browser) walk in. Customers see beautifully arranged products immediately — they didn't have to build the displays themselves.",
                color: "border-green-500/30",
              },
              {
                concept: "Client Components",
                analogy: "The fitting rooms and checkout registers",
                explanation: "These require customer interaction to work. You can't try on clothes without being there in person. Similarly, buttons and forms need the browser (customer) to function.",
                color: "border-blue-500/30",
              },
              {
                concept: "SSG (Static Generation)",
                analogy: "Pre-printed product catalogs",
                explanation: "Created once, handed to every customer who walks in. Fast and cheap — but the catalog might be slightly outdated. Perfect for product listings that don't change hourly.",
                color: "border-green-500/30",
              },
              {
                concept: "ISR (Incremental Static Regeneration)",
                analogy: "Catalogs reprinted every hour",
                explanation: "Customers still get a pre-printed catalog (fast!), but the store reprints them periodically with updated prices. Best of both worlds — speed + freshness.",
                color: "border-orange-500/30",
              },
              {
                concept: "SSR (Server-Side Rendering)",
                analogy: "A personal shopping assistant",
                explanation: "Writes a custom recommendation list for each customer based on their preferences. Slower than a catalog but perfectly personalized. Used for account pages and checkout.",
                color: "border-purple-500/30",
              },
              {
                concept: "Middleware",
                analogy: "The security guard at the entrance",
                explanation: "Checks your membership card (auth cookie) before you enter the VIP section (account pages). Fast check — doesn't search the whole database, just glances at your card.",
                color: "border-red-500/30",
              },
              {
                concept: "Streaming / Suspense",
                analogy: "Progressive store assembly",
                explanation: "Imagine the main store is ready when you arrive, but the jewelry section is still being set up. You can browse everything else while that section finishes. You don't wait at the door.",
                color: "border-cyan-500/30",
              },
              {
                concept: "Caching",
                analogy: "Keeping popular items near the entrance",
                explanation: "Bestsellers are displayed right at the front (cached). Rare items require a trip to the warehouse (database). The store is smart about what to keep up front based on demand.",
                color: "border-yellow-500/30",
              },
            ].map((item) => (
              <div
                key={item.concept}
                className={`p-4 rounded-lg border ${item.color} bg-[var(--color-bg-secondary)]`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[var(--color-text-primary)] font-semibold">{item.concept}</span>
                  <span className="text-[var(--color-text-muted)]">→</span>
                  <span className="text-[var(--color-accent-purple)] font-medium italic">{item.analogy}</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 12: KEY TAKEAWAYS
          Summary of the most important architectural decisions.
          ============================================================ */}
      <section id="takeaways" className="space-y-4 scroll-mt-8">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          12. Key Takeaways
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <ol className="space-y-4 text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">1.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Default to Server Components.</strong>{" "}
                In e-commerce, ~80% of the page is displaying data (products, descriptions, reviews).
                All of that should be Server Components. Only add &quot;use client&quot; for interactive elements
                like buttons, forms, and carousels.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">2.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Choose rendering strategy by data freshness.</strong>{" "}
                Products → ISR (hourly). Cart → Client-side (real-time). Checkout → SSR (always fresh).
                The question is always: &quot;How stale can this data be?&quot;
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">3.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Stream for perceived performance.</strong>{" "}
                Wrap slow sections (reviews, recommendations) in Suspense boundaries. Users see the
                product instantly while secondary content loads. This dramatically improves perceived speed.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">4.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Protect at multiple layers.</strong>{" "}
                Middleware for fast route-level redirects. Server Components for data-level access control.
                Never rely on client-side auth alone — it can be bypassed.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">5.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">SEO is a first-class feature in Next.js.</strong>{" "}
                Use generateMetadata for dynamic product pages. Every product page should have unique
                titles, descriptions, OpenGraph images, and canonical URLs. This is impossible in a React SPA.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">6.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Cache strategically, not blindly.</strong>{" "}
                Product data = cache heavily. User data = never cache. Stock levels = cache briefly.
                Use tags for on-demand revalidation when admins update products.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">7.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Fetch where you use the data.</strong>{" "}
                Each Server Component fetches its own data. Next.js deduplicates identical requests
                automatically. No more prop drilling from a single top-level fetch.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--color-accent-blue)] font-bold">8.</span>
              <span>
                <strong className="text-[var(--color-text-primary)]">Your file structure IS your architecture.</strong>{" "}
                In Next.js App Router, the folder layout defines routes, layouts, loading states, and
                error boundaries. Plan your file tree carefully — it&apos;s the blueprint of your entire app.
              </span>
            </li>
          </ol>
        </div>
      </section>
    </ConceptPage>
  );
}
