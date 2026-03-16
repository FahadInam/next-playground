"use client";

// CLIENT COMPONENT - Middleware Auth Demo
// ========================================
// Demonstrates the middleware auth guard by setting/removing a cookie.
// Must be "use client" because it uses:
// 1. useState for managing auth state
// 2. document.cookie - browser API
// 3. onClick handlers

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MiddlewareDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the demo auth cookie exists (browser API)
    setIsAuthenticated(document.cookie.includes("demo-auth-token"));
  }, []);

  const login = () => {
    // Set a demo cookie - the middleware checks for this
    document.cookie = "demo-auth-token=demo-user-123; path=/";
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Remove the demo cookie
    document.cookie = "demo-auth-token=; path=/; max-age=0";
    setIsAuthenticated(false);
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      <p className="text-sm text-[var(--color-text-secondary)] mb-4">
        The middleware protects the route <code className="text-green-400">/concepts/middleware-demo/protected</code>.
        Without the auth cookie, you&apos;ll be redirected back here.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <span className={`text-sm px-3 py-1 rounded-full ${
          isAuthenticated
            ? "bg-green-500/10 text-green-400 border border-green-500/30"
            : "bg-red-500/10 text-red-400 border border-red-500/30"
        }`}>
          {isAuthenticated ? "Authenticated" : "Not Authenticated"}
        </span>

        {isAuthenticated ? (
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm transition-colors"
          >
            Logout (Remove Cookie)
          </button>
        ) : (
          <button
            onClick={login}
            className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm transition-colors"
          >
            Login (Set Cookie)
          </button>
        )}
      </div>

      <Link
        href="/concepts/middleware-demo/protected"
        className="inline-block px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
      >
        Try accessing protected route →
      </Link>

      <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
        1. Try clicking the protected route link without logging in - middleware will redirect you.
        2. Click &ldquo;Login&rdquo; to set the auth cookie, then try again - you&apos;ll see the protected content.
        The middleware checks for the &ldquo;demo-auth-token&rdquo; cookie before allowing access.
      </p>
    </div>
  );
}
