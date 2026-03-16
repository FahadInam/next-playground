// SERVER COMPONENT - Demo sub-component
// ======================================
// This is a Server Component (no "use client" directive).
// It receives props from the parent Server Component.
//
// KEY INSIGHT: This component's code is never sent to the browser.
// Only the rendered HTML output is sent.

interface ServerDemoProps {
  timestamp: string;
}

export default function ServerDemo({ timestamp }: ServerDemoProps) {
  // This runs on the server. The browser never executes this code.
  const nodeVersion = process.version; // Node.js API - only available on server

  return (
    <div className="space-y-3 text-sm">
      <p className="text-[var(--color-text-secondary)]">
        This content was rendered on the <strong className="text-green-400">server</strong>.
      </p>
      <div className="bg-[var(--color-bg-primary)] rounded p-3 space-y-1">
        <p className="text-[var(--color-text-muted)]">
          Server timestamp: <span className="text-green-400">{timestamp}</span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Node.js version: <span className="text-green-400">{nodeVersion}</span>
        </p>
        <p className="text-[var(--color-text-muted)]">
          Random number: <span className="text-green-400">{Math.random().toFixed(4)}</span>
        </p>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] italic">
        Refresh the page to see values change. These values are computed once on the server.
        The random number stays the same until you refresh because it was generated at render time.
      </p>
    </div>
  );
}
