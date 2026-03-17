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
        <div className="px-4 py-2.5 border-b border-[var(--color-border)] text-xs flex items-center justify-between bg-[#161b22]">
          <span className="text-[var(--color-text-secondary)] font-medium truncate mr-4">{filename}</span>
          <span className="text-[var(--color-text-muted)] flex-shrink-0">{language}</span>
        </div>
      )}

      {/* Copy button - requires onClick handler, hence Client Component */}
      <button
        onClick={handleCopy}
        className={`
          absolute top-2 right-2 px-2.5 py-1 text-xs rounded-md
          border border-[var(--color-border)] transition-all duration-150
          ${copied
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-hover)]"
          }
          opacity-0 group-hover:opacity-100 focus:opacity-100
          ${filename ? "top-12" : "top-2"}
        `}
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
                highlights.includes(i + 1)
                  ? "bg-[var(--color-accent-blue)]/8 border-l-2 border-[var(--color-accent-blue)]"
                  : "border-l-2 border-transparent"
              }`}
            >
              <span className="inline-block w-8 text-[var(--color-text-muted)] select-none text-right mr-4 text-xs">
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
