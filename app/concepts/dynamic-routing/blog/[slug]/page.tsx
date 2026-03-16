// DYNAMIC ROUTE PAGE - SERVER COMPONENT
// =======================================
// This page demonstrates dynamic routing with the [slug] parameter.
// File: app/concepts/dynamic-routing/blog/[slug]/page.tsx
// URL:  /concepts/dynamic-routing/blog/:slug
//
// HOW IT WORKS:
// 1. The [slug] folder name creates a dynamic segment
// 2. Next.js extracts the URL segment and passes it as params
// 3. In Next.js 15+, params is a Promise that must be awaited
// 4. The component uses the slug to render the appropriate content
//
// RENDERING: This page uses generateStaticParams(), so it's STATICALLY
// GENERATED at build time for known slugs. Unknown slugs will be
// dynamically rendered on first request.

import Link from "next/link";

// Simulated blog post database - SERVER ONLY
// In production, this would be a database query or API call
const posts: Record<string, { title: string; content: string; date: string; author: string }> = {
  "getting-started": {
    title: "Getting Started with Next.js",
    content:
      "Next.js is a React framework that enables server-side rendering, static site generation, and more. The App Router (introduced in Next.js 13) uses React Server Components by default, providing better performance and developer experience.",
    date: "2024-01-15",
    author: "Next.js Team",
  },
  "server-components": {
    title: "Understanding Server Components",
    content:
      "React Server Components (RSC) are components that render exclusively on the server. They can directly access databases, file systems, and other server-side resources. The key benefit is zero client-side JavaScript for these components.",
    date: "2024-02-20",
    author: "React Core Team",
  },
  "data-fetching": {
    title: "Data Fetching Patterns",
    content:
      "Next.js extends the native fetch API with caching and revalidation options. You can fetch data in Server Components using async/await, or in Client Components using useEffect or libraries like SWR.",
    date: "2024-03-10",
    author: "Vercel Engineering",
  },
};

// TYPE: In Next.js 15+, params is a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// generateStaticParams tells Next.js which slugs to pre-render at build time
// This function runs at BUILD TIME on the server
export async function generateStaticParams() {
  // Return all known slugs
  return Object.keys(posts).map((slug) => ({ slug }));
}

// generateMetadata creates dynamic <head> tags for each blog post
// This is a SERVER-ONLY function
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];
  return {
    title: post ? `${post.title} | Next.js Playground` : "Post Not Found",
    description: post?.content.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  // AWAIT PARAMS: In Next.js 15+, params is async
  const { slug } = await params;

  // Look up the post data - this runs on the SERVER
  const post = posts[slug];

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          Post Not Found
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          No blog post found for slug: <code className="text-red-400">{slug}</code>
        </p>
        <Link href="/concepts/dynamic-routing" className="text-blue-400 hover:text-blue-300">
          ← Back to Dynamic Routing
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
        <Link href="/concepts/dynamic-routing" className="hover:text-blue-400 transition-colors">
          Dynamic Routing
        </Link>
        <span>/</span>
        <span>blog</span>
        <span>/</span>
        <span className="text-green-400">{slug}</span>
      </div>

      {/* Article */}
      <article className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)] mb-6">
          <span>By {post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          {post.content}
        </p>
      </article>

      {/* Technical details */}
      <div className="mt-6 bg-green-500/5 rounded-lg p-4 border border-green-500/20">
        <h3 className="text-green-400 font-semibold text-sm mb-2">How This Page Works</h3>
        <ul className="text-sm text-[var(--color-text-secondary)] space-y-1">
          <li>• Route: <code className="text-green-400">/concepts/dynamic-routing/blog/[slug]</code></li>
          <li>• Current slug: <code className="text-blue-400">{slug}</code></li>
          <li>• Rendering: <span className="text-green-400">Server Component</span> (no client JS)</li>
          <li>• The params were extracted from the URL by Next.js</li>
          <li>• generateStaticParams pre-renders known slugs at build time</li>
        </ul>
      </div>

      <Link
        href="/concepts/dynamic-routing"
        className="inline-block mt-6 text-blue-400 hover:text-blue-300 text-sm"
      >
        ← Back to Dynamic Routing
      </Link>
    </div>
  );
}
