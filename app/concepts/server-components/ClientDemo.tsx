"use client";

// CLIENT COMPONENT
// ================
// This component demonstrates client-side interactivity.
// It MUST have "use client" because it uses:
// 1. useState - React hook for state management
// 2. useEffect - React hook for side effects
// 3. onClick handler - User interaction
//
// WHAT HAPPENS:
// 1. Server renders initial HTML for this component (with initial state)
// 2. HTML is sent to browser
// 3. React "hydrates" this component - attaches event listeners
// 4. Component becomes interactive in the browser
// 5. State changes trigger re-renders in the BROWSER only

import { useState, useEffect } from "react";

export default function ClientDemo() {
  // STATE: This state exists only in the browser
  // Server Components cannot use useState
  const [count, setCount] = useState(0);
  const [clientTimestamp, setClientTimestamp] = useState<string>("");

  // EFFECT: Runs in the browser after component mounts
  // This is a browser-only operation
  useEffect(() => {
    // window and document are browser APIs - NOT available in Server Components
    setClientTimestamp(new Date().toISOString());
  }, []);

  return (
    <div className="space-y-3 text-sm">
      <p className="text-[var(--color-text-secondary)]">
        This content is <strong className="text-blue-400">interactive</strong> in the browser.
      </p>
      <div className="bg-[var(--color-bg-primary)] rounded p-3 space-y-1">
        <p className="text-[var(--color-text-muted)]">
          Client timestamp: <span className="text-blue-400">{clientTimestamp || "Loading..."}</span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Counter: <span className="text-blue-400">{count}</span>
        </p>
      </div>

      {/* onClick handlers require Client Components */}
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
      >
        Click me ({count})
      </button>

      <p className="text-xs text-[var(--color-text-muted)] italic">
        Click the button - the count updates instantly in the browser without any
        server request. This is client-side state management.
      </p>
    </div>
  );
}
