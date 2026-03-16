"use client";

// CLIENT COMPONENT
// ================
// This is a Client Component because it uses:
// 1. useState - for copy button state management
// 2. onClick handler - for user interaction (copying code)
// 3. navigator.clipboard - a browser-only API
//
// Note: Even though this component primarily displays static content,
// the interactivity (copy button) requires it to be a Client Component.

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlights?: number[]; // Line numbers to highlight
}

export default function CodeBlock({ code, language = "tsx", filename, highlights = [] }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // navigator.clipboard is a BROWSER API - only available in Client Components
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="code-block my-4 relative group">
      {/* File header */}
      {filename && (
        <div className="px-4 py-2 border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)] flex items-center justify-between bg-[#161b22]">
          <span>{filename}</span>
          <span className="text-[var(--color-text-muted)]">{language}</span>
        </div>
      )}

      {/* Copy button - requires onClick handler, hence Client Component */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Code content */}
      <pre className="overflow-x-auto">
        <code>
          {lines.map((line, i) => (
            <div
              key={i}
              className={`px-4 ${
                highlights.includes(i + 1) ? "bg-[var(--color-accent-blue)] bg-opacity-10 border-l-2 border-[var(--color-accent-blue)]" : ""
              }`}
            >
              <span className="inline-block w-8 text-[var(--color-text-muted)] select-none text-right mr-4">
                {i + 1}
              </span>
              {line}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
