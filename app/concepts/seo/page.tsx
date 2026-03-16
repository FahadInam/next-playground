// SEO & METADATA PAGE - SERVER COMPONENT
// ========================================
// Demonstrates the Next.js Metadata API for SEO optimization.
//
// KEY CONCEPTS:
// 1. Static Metadata - Export a metadata object from page/layout files
// 2. Dynamic Metadata - Export a generateMetadata function for dynamic values
// 3. Metadata is SERVER-ONLY - Client Components cannot export metadata
// 4. Metadata is automatically deduped and merged from layouts to pages
//
// IMPORTANT: This is a major advantage over React SPA where you need
// libraries like react-helmet or manually manage document.title

import type { Metadata } from "next";
import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

// STATIC METADATA - Exported from page/layout files
// This generates <head> tags on the server
export const metadata: Metadata = {
  title: "SEO & Metadata | Next.js Learning Playground",
  description: "Learn how to use the Next.js Metadata API for search engine optimization, Open Graph tags, and more.",
  openGraph: {
    title: "SEO & Metadata Guide",
    description: "Master Next.js metadata for better SEO",
    type: "article",
  },
};

export default function SeoPage() {
  return (
    <ConceptPage
      title="SEO & Metadata"
      description="Next.js provides a powerful Metadata API that generates <head> tags on the server. This includes title, description, Open Graph, Twitter cards, and more - all with full TypeScript support."
      serverOrClient="server"
    >
      {/* Section 1: Metadata Types */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Two Ways to Define Metadata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-500/5 rounded-lg p-5 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-3">Static Metadata</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Export a <code className="text-green-400">metadata</code> object from a page or layout file.
              Best for pages with known, fixed metadata.
            </p>
            <code className="text-xs text-[var(--color-text-muted)]">Used by: About, Home, Contact pages</code>
          </div>
          <div className="bg-blue-500/5 rounded-lg p-5 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-3">Dynamic Metadata</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">
              Export a <code className="text-blue-400">generateMetadata</code> function that receives params/searchParams.
              Best for pages with dynamic content.
            </p>
            <code className="text-xs text-[var(--color-text-muted)]">Used by: Blog posts, Product pages, User profiles</code>
          </div>
        </div>
      </section>

      {/* Section 2: Live Demo */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Live Demo: This Page&apos;s Metadata
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-green-500/20">
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            This page exports a static <code className="text-green-400">metadata</code> object.
            Inspect the page source or check the browser tab title to see it in action.
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-[var(--color-bg-primary)] rounded p-3">
              <span className="text-[var(--color-text-muted)]">title: </span>
              <span className="text-green-400">&ldquo;SEO & Metadata | Next.js Learning Playground&rdquo;</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded p-3">
              <span className="text-[var(--color-text-muted)]">description: </span>
              <span className="text-green-400">&ldquo;Learn how to use the Next.js Metadata API...&rdquo;</span>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded p-3">
              <span className="text-[var(--color-text-muted)]">og:type: </span>
              <span className="text-green-400">&ldquo;article&rdquo;</span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-3 italic">
            Check the browser tab - it should show the custom title above.
            Right-click → View Page Source to see all the generated &lt;meta&gt; tags.
          </p>
        </div>
      </section>

      {/* Section 3: Code Examples */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Examples
        </h2>
        <div className="space-y-4">
          <CodeBlock
            filename="Static Metadata (page.tsx or layout.tsx)"
            language="tsx"
            code={`import type { Metadata } from 'next';

// STATIC METADATA - SERVER ONLY
// Only page.tsx and layout.tsx can export metadata
// Client Components CANNOT export metadata
export const metadata: Metadata = {
  title: 'My Blog | Next.js App',
  description: 'A blog built with Next.js',

  // Open Graph tags (for social sharing)
  openGraph: {
    title: 'My Blog',
    description: 'A blog built with Next.js',
    url: 'https://example.com/blog',
    siteName: 'My Blog',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog',
    description: 'A blog built with Next.js',
    images: ['/twitter-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
  },
};`}
            highlights={[3, 4, 5, 6]}
          />

          <CodeBlock
            filename="Dynamic Metadata (blog/[slug]/page.tsx)"
            language="tsx"
            code={`import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

// DYNAMIC METADATA - Runs on the server for each request
// Can fetch data and use params to generate metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Fetch the blog post data
  const post = await fetch(\`https://api.example.com/posts/\${slug}\`)
    .then(res => res.json());

  return {
    title: \`\${post.title} | My Blog\`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  // ... render post
}`}
            highlights={[7, 8, 9, 10]}
          />

          <CodeBlock
            filename="Metadata Template (layout.tsx)"
            language="tsx"
            code={`// METADATA TEMPLATE in layout.tsx
// Automatically applies to all child pages

export const metadata: Metadata = {
  // Template: child page title replaces %s
  title: {
    template: '%s | My App',  // "Blog Post" → "Blog Post | My App"
    default: 'My App',        // Fallback if page has no title
  },
  // All child pages inherit these unless they override
  metadataBase: new URL('https://example.com'),
};

// Child page.tsx can then just set:
// export const metadata = { title: 'Blog Post' };
// Output: <title>Blog Post | My App</title>`}
            highlights={[6, 7, 8]}
          />
        </div>
      </section>

      {/* Section 4: React SPA Comparison */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          React SPA vs Next.js SEO
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-3 text-[var(--color-text-muted)]">Feature</th>
                <th className="text-left p-3 text-blue-400">React SPA</th>
                <th className="text-left p-3 text-green-400">Next.js</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Meta tags</td>
                <td className="p-3">react-helmet (client-side)</td>
                <td className="p-3">Built-in Metadata API (server)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Crawlability</td>
                <td className="p-3">JS must execute first</td>
                <td className="p-3">HTML contains all meta tags</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium">Social Sharing</td>
                <td className="p-3">Crawlers may not see OG tags</td>
                <td className="p-3">OG tags in initial HTML</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Type Safety</td>
                <td className="p-3">Varies by library</td>
                <td className="p-3">Full TypeScript support</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 5: Flow Diagram */}
      <section>
        <FlowDiagram
          title="Metadata Generation Flow"
          steps={[
            { label: "Request Received", description: "Server processes the route", type: "server" },
            { label: "Merge Metadata", description: "Layout metadata + Page metadata merged", type: "server" },
            { label: "generateMetadata()", description: "Dynamic metadata function runs (if exists)", type: "server" },
            { label: "Generate <head>", description: "Meta tags, title, OG tags generated", type: "server" },
            { label: "HTML Response", description: "Complete HTML with meta tags sent", type: "network" },
            { label: "SEO Ready", description: "Crawlers see all meta tags immediately", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
