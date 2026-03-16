// DYNAMIC ROUTING PAGE - SERVER COMPONENT
// =========================================
// Demonstrates Next.js file-based dynamic routing.
//
// KEY CONCEPTS:
// 1. [param] - Dynamic segment (matches one segment)
// 2. [...param] - Catch-all segment (matches one or more)
// 3. [[...param]] - Optional catch-all (matches zero or more)
// 4. Route groups (folder) - organize without affecting URL
// 5. Parallel routes @slot - render multiple pages simultaneously
//
// All routing is file-system based - no React Router needed!

import Link from "next/link";
import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

// Simulated blog posts - this data lives only on the server
const blogPosts = [
  { slug: "getting-started", title: "Getting Started with Next.js", excerpt: "Learn the basics of Next.js App Router" },
  { slug: "server-components", title: "Understanding Server Components", excerpt: "Deep dive into React Server Components" },
  { slug: "data-fetching", title: "Data Fetching Patterns", excerpt: "Best practices for fetching data in Next.js" },
];

export default function DynamicRoutingPage() {
  return (
    <ConceptPage
      title="Dynamic Routing"
      description="Next.js uses file-system based routing with support for dynamic segments, catch-all routes, and route groups. No external routing library needed."
      serverOrClient="server"
    >
      {/* Section 1: Route Patterns */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Dynamic Route Patterns
        </h2>
        <div className="space-y-3">
          {[
            {
              pattern: "[slug]",
              example: "app/blog/[slug]/page.tsx",
              matches: "/blog/hello-world, /blog/my-post",
              description: "Matches a single dynamic segment",
            },
            {
              pattern: "[...slug]",
              example: "app/docs/[...slug]/page.tsx",
              matches: "/docs/a, /docs/a/b, /docs/a/b/c",
              description: "Catch-all route - matches one or more segments",
            },
            {
              pattern: "[[...slug]]",
              example: "app/shop/[[...slug]]/page.tsx",
              matches: "/shop, /shop/a, /shop/a/b",
              description: "Optional catch-all - also matches the root",
            },
          ].map((route) => (
            <div key={route.pattern} className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-green-400 font-semibold">{route.pattern}</code>
                <span className="text-xs text-[var(--color-text-muted)]">- {route.description}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">File: <code className="text-blue-400">{route.example}</code></p>
              <p className="text-xs text-[var(--color-text-muted)]">Matches: <code className="text-purple-400">{route.matches}</code></p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Live Demo - Blog List */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: Dynamic Blog Routes
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            These links use the dynamic route <code className="text-green-400">/concepts/dynamic-routing/blog/[slug]</code>.
            Each slug maps to a different page using the same component template.
          </p>
          <div className="space-y-2">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/concepts/dynamic-routing/blog/${post.slug}`}
                className="block bg-[var(--color-bg-primary)] rounded-lg p-4 hover:bg-[var(--color-bg-card-hover)] border border-[var(--color-border)] transition-colors"
              >
                <h3 className="text-[var(--color-text-primary)] font-medium text-sm">{post.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{post.excerpt}</p>
                <p className="text-xs text-blue-400 mt-2 font-mono">/blog/{post.slug}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Code Example */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Example
        </h2>
        <CodeBlock
          filename="app/blog/[slug]/page.tsx"
          language="tsx"
          code={`// DYNAMIC ROUTE - SERVER COMPONENT
// The [slug] folder name creates a dynamic segment
// params.slug will contain the URL segment value

// In Next.js 15+, params is a Promise that must be awaited
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
  // Await the params (Next.js 15+ change)
  const { slug } = await params;

  // Use the slug to fetch data (server-side)
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`)
    .then(res => res.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// OPTIONAL: Generate static paths at build time
// This tells Next.js which slugs to pre-render
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts')
    .then(res => res.json());

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}
// With generateStaticParams, these pages are STATICALLY GENERATED
// at build time for optimal performance`}
          highlights={[1, 2, 3, 7, 11, 12, 26, 27, 28]}
        />
      </section>

      {/* Section 4: Route Groups */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Route Groups
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] text-sm mb-4">
            Route groups <code className="text-green-400">(folderName)</code> organize routes without affecting the URL structure.
            Useful for applying different layouts to different sections.
          </p>
          <CodeBlock
            code={`app/
├── (marketing)/       ← Route group - NOT in URL
│   ├── layout.tsx     ← Marketing-specific layout
│   ├── page.tsx       ← "/" (root page)
│   └── about/
│       └── page.tsx   ← "/about"
│
├── (dashboard)/       ← Another route group
│   ├── layout.tsx     ← Dashboard-specific layout
│   ├── dashboard/
│   │   └── page.tsx   ← "/dashboard"
│   └── settings/
│       └── page.tsx   ← "/settings"

The (parentheses) are stripped from the URL.
Both groups can have different layouts!`}
            language="text"
          />
        </div>
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Dynamic Route Resolution"
          steps={[
            { label: "Request: /blog/hello-world", description: "Browser requests a specific blog post", type: "client" },
            { label: "File System Lookup", description: "Next.js finds app/blog/[slug]/page.tsx", type: "server" },
            { label: "Extract Params", description: 'slug = "hello-world"', type: "server" },
            { label: "Render Component", description: "Page component receives params as props", type: "server" },
            { label: "Data Fetching", description: "Component fetches post by slug", type: "server" },
            { label: "HTML Response", description: "Rendered page sent to browser", type: "network" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
