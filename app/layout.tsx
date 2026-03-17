// ROOT LAYOUT - SERVER COMPONENT
// ===============================
// This is the ROOT layout in Next.js App Router.
// It wraps EVERY page in the application.
//
// KEY CONCEPTS:
// 1. layout.tsx files are SERVER COMPONENTS by default
// 2. The root layout MUST contain <html> and <body> tags
// 3. Layouts are NOT re-rendered when navigating between pages that share the layout
// 4. This means layout state (like sidebar) persists across navigation
// 5. Layouts receive {children} which is the page content
//
// SERVER vs CLIENT:
// - This layout runs on the server - it renders the HTML shell
// - The Sidebar component is a Client Component (imported here)
// - Next.js handles the boundary: server renders layout, client hydrates Sidebar
// - The Sidebar import creates a "Server-Client boundary"
//
// RENDERING LIFECYCLE:
// 1. Server receives request
// 2. Server renders this layout (HTML + CSS)
// 3. Server renders the page component (children)
// 4. Combined HTML is sent to browser
// 5. Browser receives HTML (instant visual)
// 6. React hydrates Client Components (Sidebar becomes interactive)

import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

// METADATA API (Server-only feature)
// This generates <head> tags on the server.
// Only Server Components and layout/page files can export metadata.
// Client Components CANNOT export metadata.
export const metadata: Metadata = {
  title: "Next.js Learning Playground",
  description:
    "An interactive learning playground for experienced React developers to master Next.js App Router concepts",
  keywords: ["Next.js", "React", "App Router", "Server Components", "Learning"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This function body runs on the SERVER.
  // You can safely access databases, file system, env vars here.
  // console.log here would appear in your terminal, NOT in the browser.

  return (
    <html lang="en">
      <body className="antialiased">
        {/*
          LAYOUT STRUCTURE:
          - Sidebar: Client Component (interactive, uses hooks)
          - Main content area: Server Component (children = page content)

          The flex layout ensures sidebar + content are side by side.
          On mobile (< 768px), sidebar becomes an overlay drawer.
        */}
        <div className="flex min-h-screen">
          {/* Client Component boundary - Sidebar will be hydrated in the browser */}
          <Sidebar />

          {/* Main content area - each page renders here */}
          <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
