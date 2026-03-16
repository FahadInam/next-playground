"use client";

// CLIENT COMPONENT - Heavy Component (Dynamically Imported)
// =========================================================
// This component simulates a "heavy" library component.
// It's loaded via next/dynamic, so its code is only downloaded when needed.
//
// In a real app, this could be:
// - A charting library (Chart.js, Recharts)
// - A rich text editor (Slate, TipTap)
// - A map component (Mapbox, Leaflet)
// - A data grid (AG Grid, TanStack Table)

import { useState } from "react";

export default function HeavyComponent() {
  const [data] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      label: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 100),
    }))
  );

  return (
    <div className="bg-[var(--color-bg-primary)] rounded-lg p-4 border border-[var(--color-border)]">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
        Dynamically Loaded Chart (Simulated)
      </h3>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="text-xs text-[var(--color-text-muted)] w-16">{item.label}</span>
            <div className="flex-1 bg-[var(--color-bg-card)] rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
            <span className="text-xs text-violet-400 font-mono w-8">{item.value}%</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mt-3">
        This component was loaded on-demand via next/dynamic.
        Its JavaScript was NOT part of the initial page bundle.
      </p>
    </div>
  );
}
