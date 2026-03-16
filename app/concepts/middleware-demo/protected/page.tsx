// PROTECTED PAGE - SERVER COMPONENT
// ===================================
// This page is protected by the middleware.
// If the user doesn't have the "demo-auth-token" cookie,
// the middleware redirects them before this page even renders.

import Link from "next/link";

export default function ProtectedPage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="text-4xl mb-4">🔓</div>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
        Protected Content
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-6">
        You can see this because the middleware verified your auth cookie.
        Without the cookie, you would have been redirected.
      </p>
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
        <p className="text-green-400 text-sm">
          The middleware checked for the &ldquo;demo-auth-token&rdquo; cookie and allowed this request through.
        </p>
      </div>
      <Link
        href="/concepts/middleware-demo"
        className="text-blue-400 hover:text-blue-300 text-sm"
      >
        ← Back to Middleware Demo
      </Link>
    </div>
  );
}
