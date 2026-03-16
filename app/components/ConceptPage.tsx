// SERVER COMPONENT (default)
// ==========================
// This is a layout wrapper for concept pages.
// It receives children (which may be Server or Client Components)
// and renders a consistent page structure.
//
// No interactivity needed = Server Component = zero client JS for this wrapper.

interface ConceptPageProps {
  title: string;
  description: string;
  serverOrClient: "server" | "client" | "both";
  children: React.ReactNode;
}

export default function ConceptPage({ title, description, serverOrClient, children }: ConceptPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{title}</h1>
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
        <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">{description}</p>
      </div>

      {/* Page content - can contain mix of Server and Client Components */}
      <div className="space-y-8">{children}</div>
    </div>
  );
}
