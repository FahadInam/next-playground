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
      return "border-[var(--color-accent-green)]/15 bg-[var(--color-accent-green)]/5";
    case "client":
      return "border-[var(--color-accent-blue)]/15 bg-[var(--color-accent-blue)]/5";
    case "network":
      return "border-[var(--color-accent-orange)]/15 bg-[var(--color-accent-orange)]/5";
    default:
      return "border-[var(--color-border)] bg-[var(--color-bg-card)]";
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

function getTagColor(type: FlowStep["type"]) {
  switch (type) {
    case "server": return "bg-[var(--color-accent-green)]/10 text-[var(--color-accent-green)] border border-[var(--color-accent-green)]/15";
    case "client": return "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] border border-[var(--color-accent-blue)]/15";
    case "network": return "bg-[var(--color-accent-orange)]/10 text-[var(--color-accent-orange)] border border-[var(--color-accent-orange)]/15";
    default: return "";
  }
}

function getLabelColor(type: FlowStep["type"]) {
  switch (type) {
    case "server": return "text-[var(--color-accent-green)]";
    case "client": return "text-[var(--color-accent-blue)]";
    case "network": return "text-[var(--color-accent-orange)]";
    default: return "text-[var(--color-text-primary)]";
  }
}

export default function FlowDiagram({ title, steps, direction = "vertical" }: FlowDiagramProps) {
  // ALL of this rendering happens on the server.
  // The browser receives pure HTML - no React runtime needed for this component.
  return (
    <div className="my-6 p-5 md:p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] backdrop-blur-sm">
      <h4 className="text-sm font-[family-name:var(--font-display)] font-semibold text-[var(--color-text-primary)] mb-5">{title}</h4>

      <div
        className={`
          flex ${direction === "vertical" ? "flex-col" : "flex-row flex-wrap"} items-center gap-1
          ${direction === "horizontal" ? "overflow-x-auto pb-2 -mb-2" : ""}
        `}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex ${direction === "vertical" ? "flex-col w-full" : "flex-row"} items-center`}
          >
            {/* Step box */}
            <div
              className={`
                flow-step px-4 py-3.5 rounded-lg border ${getStepStyles(step.type)}
                ${direction === "vertical" ? "w-full max-w-lg mx-auto" : "min-w-[200px]"}
                text-center
              `}
            >
              <div className="flex items-center justify-center gap-2">
                {getTagLabel(step.type) && (
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getTagColor(step.type)} tracking-wider`}>
                    {getTagLabel(step.type)}
                  </span>
                )}
              </div>
              <p className={`text-sm font-medium mt-1.5 ${getLabelColor(step.type)}`}>{step.label}</p>
              {step.description && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{step.description}</p>
              )}
            </div>

            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <div className={`text-[var(--color-text-muted)]/50 ${direction === "vertical" ? "py-1.5" : "px-3"} flex-shrink-0`}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={direction === "horizontal" ? "-rotate-90" : ""}
                >
                  <path d="M8 3v10M4 9l4 4 4-4" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
