// SERVER COMPONENT (default)
// ==========================
// This is a layout wrapper for concept pages.
// It receives children (which may be Server or Client Components)
// and renders a consistent page structure.
//
// PageTransition is a Client Component imported here — Next.js handles
// the server/client boundary automatically. The wrapper adds a subtle
// fade-in animation when the page loads.

import PageTransition from "./PageTransition";

interface ConceptPageProps {
  title: string;
  description: string;
  serverOrClient: "server" | "client" | "both";
  children: React.ReactNode;
}

export default function ConceptPage({ title, description, serverOrClient, children }: ConceptPageProps) {
  return (
    <PageTransition>
      <div className="max-w-[var(--content-max-width)] mx-auto">
        {/* Page header with refined typography */}
        <header className="mb-10 md:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-2xl md:text-[2rem] font-[family-name:var(--font-display)] font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
              {title}
            </h1>
            <span className={serverOrClient === "server" ? "tag-server" : serverOrClient === "client" ? "tag-client" : ""}>
              {serverOrClient === "server" && "Server Component"}
              {serverOrClient === "client" && "Client Component"}
              {serverOrClient === "both" && (
                <span className="flex gap-2">
                  <span className="tag-server">Server</span>
                  <span className="tag-client">Client</span>
                </span>
              )}
            </span>
          </div>
          <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed max-w-3xl">
            {description}
          </p>
          {/* Subtle separator line */}
          <div className="mt-6 h-px bg-gradient-to-r from-[var(--color-border)] via-[var(--color-border-hover)] to-transparent" />
        </header>

        {/* Page content - can contain mix of Server and Client Components */}
        <div className="space-y-10 md:space-y-14">{children}</div>
      </div>
    </PageTransition>
  );
}
