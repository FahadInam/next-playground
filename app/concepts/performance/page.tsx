// PERFORMANCE OPTIMIZATION PAGE - SERVER COMPONENT
// ==================================================
// Demonstrates performance optimization techniques in Next.js.
//
// KEY OPTIMIZATION FEATURES:
// 1. next/image - Automatic image optimization
// 2. next/dynamic - Dynamic imports for code splitting
// 3. next/font - Optimized font loading
// 4. Server Components - Zero client JS by default
// 5. Route-based code splitting (automatic)
// 6. Prefetching (Link component)

import Image from "next/image";
import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";
import DynamicImportDemo from "./DynamicImportDemo";

export default function PerformancePage() {
  return (
    <ConceptPage
      title="Performance Optimization"
      description="Next.js provides built-in performance optimizations including automatic image optimization, code splitting, dynamic imports, and font optimization."
      serverOrClient="both"
    >
      {/* Layman Explanation */}
      <section className="space-y-4">
        <div className="bg-[var(--color-bg-card)] rounded-lg p-6 border border-[var(--color-border)]">
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">Layman Explanation</h2>
          <p className="text-[var(--color-text-secondary)]">
            🧳 Think of packing for a trip. A bad packer throws everything into one huge suitcase (slow to carry). A smart packer uses small bags, only brings what&apos;s needed for each day, and compresses clothes to save space. Performance optimization in Next.js is like smart packing — loading only what&apos;s needed, compressing images, and splitting code into smaller pieces so your website loads faster.
          </p>
        </div>
      </section>

      {/* Section 1: Image Optimization */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Image Optimization with next/image
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
          <p className="text-[var(--color-text-secondary)] mb-4 text-sm">
            The <code className="text-green-400">&lt;Image&gt;</code> component from <code className="text-green-400">next/image</code> automatically
            optimizes images with lazy loading, responsive sizing, and modern formats (WebP/AVIF).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-[var(--color-bg-primary)] rounded-lg p-4">
              <h3 className="text-red-400 text-sm font-semibold mb-2">Without next/image</h3>
              <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                <li>• Full-size image downloaded always</li>
                <li>• No lazy loading by default</li>
                <li>• No format optimization</li>
                <li>• Layout shift as images load</li>
              </ul>
            </div>
            <div className="bg-[var(--color-bg-primary)] rounded-lg p-4">
              <h3 className="text-green-400 text-sm font-semibold mb-2">With next/image</h3>
              <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                <li>• Automatic responsive sizing</li>
                <li>• Lazy loading by default</li>
                <li>• WebP/AVIF conversion</li>
                <li>• Prevents Cumulative Layout Shift</li>
              </ul>
            </div>
          </div>

          {/* Live demo with next/image */}
          <div className="bg-[var(--color-bg-primary)] rounded-lg p-4">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">Live demo using next/image with a placeholder:</p>
            <div className="flex items-center justify-center bg-[var(--color-bg-secondary)] rounded-lg overflow-hidden" style={{ height: 200 }}>
              <Image
                src="/next.svg"
                alt="Next.js Logo"
                width={200}
                height={50}
                priority
                className="invert"
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              This image uses the built-in next.svg. In production, next/image would automatically
              optimize format, size, and loading behavior.
            </p>
          </div>
        </div>

        <CodeBlock
          filename="Image Component Usage"
          language="tsx"
          code={`import Image from 'next/image';

// LOCAL IMAGE (automatically optimized at build time)
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority              // Load immediately (above the fold)
  placeholder="blur"    // Show blur placeholder while loading
/>

// REMOTE IMAGE (optimized on-demand)
<Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={800}
  height={400}
  quality={75}          // Image quality (1-100)
/>

// FILL MODE (responsive container)
<div className="relative w-full h-64">
  <Image
    src="/banner.jpg"
    alt="Banner"
    fill                // Fills parent container
    sizes="100vw"       // Hint for responsive sizing
    style={{ objectFit: 'cover' }}
  />
</div>`}
          highlights={[9, 10, 20, 27, 28]}
        />
      </section>

      {/* Section 2: Dynamic Imports */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Code Splitting with Dynamic Imports
        </h2>
        <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)] mb-4">
          <p className="text-[var(--color-text-secondary)] text-sm mb-3">
            <code className="text-green-400">next/dynamic</code> enables lazy loading of components.
            The component&apos;s code is only downloaded when it&apos;s needed, reducing the initial bundle size.
          </p>
          <p className="text-[var(--color-text-secondary)] text-sm">
            This is especially useful for:
          </p>
          <ul className="text-sm text-[var(--color-text-secondary)] mt-2 space-y-1">
            <li>• Heavy libraries (charts, maps, rich text editors)</li>
            <li>• Modals and dialogs (not needed on initial load)</li>
            <li>• Below-the-fold content</li>
            <li>• Components with SSR compatibility issues</li>
          </ul>
        </div>
        <DynamicImportDemo />

        <CodeBlock
          filename="Dynamic Import Examples"
          language="tsx"
          code={`import dynamic from 'next/dynamic';

// 1. Basic dynamic import with loading state
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
});

// 2. Disable SSR (for components using browser-only APIs)
const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,  // Only render on the client
  loading: () => <div>Loading map...</div>,
});

// 3. Named export import
const Tabs = dynamic(
  () => import('./TabsComponent').then(mod => mod.Tabs)
);

// Usage in component
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Chart JS only loads when this component renders */}
      <HeavyChart data={chartData} />
      {/* Map only renders on client - no SSR */}
      <MapComponent />
    </div>
  );
}`}
          highlights={[4, 5, 9, 10]}
        />
      </section>

      {/* Section 3: Automatic Optimizations */}
      <section>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-text-primary)]">
          Built-in Automatic Optimizations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Route-based Code Splitting",
              description: "Each page's JavaScript is automatically split into separate bundles. Users only download code for the page they're viewing.",
              auto: true,
            },
            {
              title: "Prefetching",
              description: "The <Link> component automatically prefetches linked pages when they appear in the viewport, making navigation feel instant.",
              auto: true,
            },
            {
              title: "Server Components",
              description: "Components without 'use client' send zero JavaScript to the browser. Only the HTML is sent. This is automatic in App Router.",
              auto: true,
            },
            {
              title: "Script Optimization",
              description: "next/script provides loading strategies (beforeInteractive, afterInteractive, lazyOnload) for third-party scripts.",
              auto: false,
            },
          ].map((opt) => (
            <div key={opt.title} className="bg-[var(--color-bg-card)] rounded-lg p-4 border border-[var(--color-border)]">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{opt.title}</h3>
                {opt.auto && (
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                    Automatic
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">{opt.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Flow */}
      <section>
        <FlowDiagram
          title="Performance Optimization Flow"
          steps={[
            { label: "Build Time", description: "Images optimized, code split, fonts inlined", type: "server" },
            { label: "Initial Request", description: "Only critical JS/CSS sent to browser", type: "network" },
            { label: "First Paint", description: "HTML renders with optimized images", type: "client" },
            { label: "Hydration", description: "Only Client Components hydrate", type: "client" },
            { label: "Lazy Load", description: "Additional JS loaded as needed", type: "network" },
            { label: "Prefetch", description: "Linked pages prefetched in background", type: "client" },
          ]}
        />
      </section>
    </ConceptPage>
  );
}
