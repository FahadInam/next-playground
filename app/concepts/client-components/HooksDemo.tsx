"use client";

// CLIENT COMPONENT - React Hooks Demo
// =====================================
// Demonstrates that React hooks ONLY work in Client Components.
// useState, useEffect, useRef, etc. all require "use client".
//
// If you try to use hooks in a Server Component, you'll get an error:
// "You're importing a component that needs useState. It only works in
//  a Client Component but none of its parents are marked with 'use client'."

import { useState, useEffect, useRef } from "react";

export default function HooksDemo() {
  // useState - manages UI state in the browser
  const [color, setColor] = useState("#3b82f6");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(0);

  // useRef - references DOM elements (browser-only)
  const boxRef = useRef<HTMLDivElement>(null);

  // useEffect - runs after render in the browser
  useEffect(() => {
    // window is a BROWSER API - not available in Server Components
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Cleanup function - also browser-only
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse tracking - browser event handling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setMousePos({
        x: Math.round(e.clientX - rect.left),
        y: Math.round(e.clientY - rect.top),
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* useState demo */}
      <div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
          <strong>useState</strong> - Color picker (try changing the color):
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div
            className="px-4 py-2 rounded text-sm font-mono"
            style={{ backgroundColor: color + "20", color, border: `1px solid ${color}40` }}
          >
            Color: {color}
          </div>
        </div>
      </div>

      {/* useEffect + window API demo */}
      <div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
          <strong>useEffect + window API</strong> - Browser viewport width:
        </p>
        <p className="text-sm text-blue-400 font-mono bg-[var(--color-bg-primary)] rounded p-2 inline-block">
          window.innerWidth = {windowWidth}px
        </p>
      </div>

      {/* useRef + mouse tracking demo */}
      <div>
        <p className="text-sm text-[var(--color-text-secondary)] mb-2">
          <strong>useRef + onMouseMove</strong> - Mouse position tracker:
        </p>
        <div
          ref={boxRef}
          onMouseMove={handleMouseMove}
          className="h-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] flex items-center justify-center cursor-crosshair"
        >
          <span className="text-sm font-mono text-[var(--color-text-muted)]">
            x: {mousePos.x}, y: {mousePos.y}
          </span>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] italic">
        All these features require &ldquo;use client&rdquo; because they use React hooks and browser APIs.
        None of this would work in a Server Component.
      </p>
    </div>
  );
}
