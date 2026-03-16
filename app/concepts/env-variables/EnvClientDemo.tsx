"use client";

// CLIENT COMPONENT - Environment Variable Demo
// ===============================================
// Demonstrates that only NEXT_PUBLIC_ variables are accessible
// in Client Components. Server-only variables are undefined.

export default function EnvClientDemo() {
  // NEXT_PUBLIC_ vars - AVAILABLE in client
  const publicAppName = process.env.NEXT_PUBLIC_APP_NAME || "Next.js Playground";
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  // Server-only vars - UNDEFINED in client (as expected!)
  const secretKey = process.env.SECRET_API_KEY;
  const dbUrl = process.env.DATABASE_URL;

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-blue-500/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="tag-client">Client Component</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] mb-3">
        These values are read in a Client Component. Notice that server-only
        variables are <code className="text-red-400">undefined</code>.
      </p>
      <div className="space-y-2 font-mono text-sm">
        <div className="bg-[var(--color-bg-primary)] rounded p-3 flex justify-between">
          <span className="text-[var(--color-text-muted)]">NEXT_PUBLIC_APP_NAME:</span>
          <span className="text-blue-400">{publicAppName}</span>
        </div>
        <div className="bg-[var(--color-bg-primary)] rounded p-3 flex justify-between">
          <span className="text-[var(--color-text-muted)]">NEXT_PUBLIC_API_URL:</span>
          <span className="text-blue-400">{publicApiUrl}</span>
        </div>
        <div className="bg-[var(--color-bg-primary)] rounded p-3 flex justify-between">
          <span className="text-[var(--color-text-muted)]">SECRET_API_KEY:</span>
          <span className="text-red-400">{secretKey || "undefined (correct!)"}</span>
        </div>
        <div className="bg-[var(--color-bg-primary)] rounded p-3 flex justify-between">
          <span className="text-[var(--color-text-muted)]">DATABASE_URL:</span>
          <span className="text-red-400">{dbUrl || "undefined (correct!)"}</span>
        </div>
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mt-3 italic">
        Server-only variables showing &ldquo;undefined&rdquo; is the CORRECT behavior.
        This is Next.js protecting your secrets from being exposed to the browser.
      </p>
    </div>
  );
}
