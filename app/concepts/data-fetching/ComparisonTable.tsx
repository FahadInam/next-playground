// SERVER COMPONENT - Comparison Table
// ====================================
// This is a Server Component (no "use client" directive).
// It renders a static comparison table between server-side and client-side
// data fetching approaches.
//
// WHY THIS IS A SERVER COMPONENT:
// - It has zero interactivity - no hooks, no event handlers, no browser APIs.
// - It renders purely static content (a comparison table).
// - Keeping it as a Server Component means zero client-side JavaScript for this table.
// - The HTML is generated on the server and sent to the browser as-is.
//
// WHAT RUNS ON THE SERVER:
// - The entire component function body
// - The comparisonData array creation
// - JSX rendering to HTML
//
// WHAT THE BROWSER RECEIVES:
// - Pre-rendered HTML table
// - No JavaScript, no React runtime needed for this component
//
// RENDERING LIFECYCLE:
// 1. The parent page.tsx includes <ComparisonTable /> in its JSX
// 2. Next.js server renders this component to HTML
// 3. The HTML is included in the full page response
// 4. Browser displays the table instantly - no hydration needed

// Data for the comparison table.
// This array exists only on the server. It is never sent as JS to the browser.
// The browser only receives the rendered HTML table rows.
const comparisonData = [
  {
    feature: "Where fetch runs",
    server: "On the Node.js server",
    client: "In the user's browser",
    serverColor: "text-green-400",
    clientColor: "text-blue-400",
  },
  {
    feature: "Loading state",
    server: "No loading spinner (data is in the HTML)",
    client: "Shows loading skeleton, then data appears",
    serverColor: "text-green-400",
    clientColor: "text-blue-400",
  },
  {
    feature: "Network tab",
    server: "Fetch NOT visible in browser DevTools",
    client: "Fetch IS visible in browser DevTools",
    serverColor: "text-green-400",
    clientColor: "text-blue-400",
  },
  {
    feature: "CORS",
    server: "No CORS issues (server-to-server)",
    client: "Subject to CORS restrictions",
    serverColor: "text-green-400",
    clientColor: "text-orange-400",
  },
  {
    feature: "Secrets / API keys",
    server: "Safe to use (never sent to browser)",
    client: "Exposed in client bundle if used directly",
    serverColor: "text-green-400",
    clientColor: "text-red-400",
  },
  {
    feature: "Bundle size impact",
    server: "Zero (fetch code not in client bundle)",
    client: "Adds to client JS bundle size",
    serverColor: "text-green-400",
    clientColor: "text-orange-400",
  },
  {
    feature: "Caching",
    server: "Next.js built-in fetch cache",
    client: "Manual (SWR, React Query, or custom)",
    serverColor: "text-green-400",
    clientColor: "text-blue-400",
  },
  {
    feature: "Refetching / real-time",
    server: "Requires page refresh or revalidation",
    client: "Can refetch on demand (button, interval)",
    serverColor: "text-orange-400",
    clientColor: "text-green-400",
  },
  {
    feature: "SEO",
    server: "Excellent (data in HTML for crawlers)",
    client: "Poor without SSR (crawlers see loading state)",
    serverColor: "text-green-400",
    clientColor: "text-red-400",
  },
  {
    feature: "User interactivity",
    server: "No (cannot respond to user actions)",
    client: "Yes (fetch on click, search, filter, etc.)",
    serverColor: "text-orange-400",
    clientColor: "text-green-400",
  },
];

export default function ComparisonTable() {
  // This entire function runs on the server.
  // The map(), conditionals, and JSX all execute on the server.
  // The browser only receives the final HTML output.
  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg border border-[var(--color-border)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="text-left p-3 text-[var(--color-text-muted)] w-[25%]">
              Feature
            </th>
            <th className="text-left p-3 w-[37.5%]">
              <span className="flex items-center gap-2">
                <span className="tag-server">Server</span>
                <span className="text-green-400 text-xs">fetch</span>
              </span>
            </th>
            <th className="text-left p-3 w-[37.5%]">
              <span className="flex items-center gap-2">
                <span className="tag-client">Client</span>
                <span className="text-blue-400 text-xs">useEffect + fetch</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="text-[var(--color-text-secondary)]">
          {comparisonData.map((row, index) => (
            <tr
              key={row.feature}
              className={
                index < comparisonData.length - 1
                  ? "border-b border-[var(--color-border)]"
                  : ""
              }
            >
              <td className="p-3 font-medium text-[var(--color-text-primary)]">
                {row.feature}
              </td>
              <td className={`p-3 ${row.serverColor}`}>{row.server}</td>
              <td className={`p-3 ${row.clientColor}`}>{row.client}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
