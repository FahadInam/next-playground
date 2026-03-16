"use client";

// CLIENT COMPONENT - Dynamic Import Demo
// ========================================
// Shows how next/dynamic works with a live example.
// The HeavyComponent is only loaded when the user clicks a button.

import { useState } from "react";
import dynamic from "next/dynamic";

// DYNAMIC IMPORT: This component's code is NOT included in the initial bundle.
// It's loaded on-demand when the component is first rendered.
// The 'loading' prop shows a placeholder while the code downloads.
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => (
    <div className="animate-pulse bg-[var(--color-bg-primary)] rounded-lg p-4 text-center text-[var(--color-text-muted)] text-sm">
      Loading heavy component...
    </div>
  ),
});

export default function DynamicImportDemo() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="tag-client">Dynamic Import</span>
      </div>

      <button
        onClick={() => setShowHeavy(!showHeavy)}
        className="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors mb-4"
      >
        {showHeavy ? "Hide" : "Load"} Heavy Component
      </button>

      {showHeavy && <HeavyComponent />}

      <p className="text-xs text-[var(--color-text-muted)] mt-3 italic">
        The heavy component&apos;s JavaScript is only downloaded when you click &ldquo;Load&rdquo;.
        Check the Network tab in DevTools to see the chunk loading on demand.
      </p>
    </div>
  );
}
