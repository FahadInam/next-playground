// SERVER COMPONENT (default)
// ==========================
// This component has NO interactivity - it just renders a visual diagram.
// Therefore it can be a Server Component (the default in Next.js App Router).
//
// Benefits of keeping this as a Server Component:
// 1. Zero JavaScript sent to the browser for this component
// 2. Renders to pure HTML on the server
// 3. Faster page loads since no hydration needed

interface FlowStep {
  label: string;
  description?: string;
  type?: "server" | "client" | "network" | "neutral";
}

interface FlowDiagramProps {
  title: string;
  steps: FlowStep[];
  direction?: "vertical" | "horizontal";
}

// Helper to get color based on step type
// This function runs on the SERVER - no client bundle cost
function getStepStyles(type: FlowStep["type"]) {
  switch (type) {
    case "server":
      return "border-green-500/30 bg-green-500/5 text-green-400";
    case "client":
      return "border-blue-500/30 bg-blue-500/5 text-blue-400";
    case "network":
      return "border-orange-500/30 bg-orange-500/5 text-orange-400";
    default:
      return "border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)]";
  }
}

function getTagLabel(type: FlowStep["type"]) {
  switch (type) {
    case "server": return "SERVER";
    case "client": return "CLIENT";
    case "network": return "NETWORK";
    default: return null;
  }
}

export default function FlowDiagram({ title, steps, direction = "vertical" }: FlowDiagramProps) {
  // ALL of this rendering happens on the server.
  // The browser receives pure HTML - no React runtime needed for this component.
  return (
    <div className="my-6 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">{title}</h4>

      <div className={`flex ${direction === "vertical" ? "flex-col" : "flex-row flex-wrap"} items-center gap-1`}>
        {steps.map((step, i) => (
          <div key={i} className={`flex ${direction === "vertical" ? "flex-col" : "flex-row"} items-center`}>
            {/* Step box */}
            <div className={`px-4 py-3 rounded-lg border ${getStepStyles(step.type)} text-center min-w-[200px]`}>
              <div className="flex items-center justify-center gap-2">
                {getTagLabel(step.type) && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    step.type === "server" ? "bg-green-500/20" :
                    step.type === "client" ? "bg-blue-500/20" :
                    "bg-orange-500/20"
                  }`}>
                    {getTagLabel(step.type)}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium mt-1">{step.label}</p>
              {step.description && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{step.description}</p>
              )}
            </div>

            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <div className={`text-[var(--color-text-muted)] ${direction === "vertical" ? "py-1" : "px-2"}`}>
                {direction === "vertical" ? "↓" : "→"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
