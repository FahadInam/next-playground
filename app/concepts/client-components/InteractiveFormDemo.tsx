"use client";

// CLIENT COMPONENT - Interactive Form Demo
// =========================================
// This demonstrates a form with client-side validation and state.
// Must be "use client" because:
// 1. useState for form data and validation errors
// 2. onChange / onSubmit handlers for user interaction
// 3. Real-time validation feedback (instant, no server roundtrip)

import { useState } from "react";

export default function InteractiveFormDemo() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Client-side validation - runs instantly in the browser
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Browser API - prevent default form submission
    if (validate()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-blue-500"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          Submit (Client-side)
        </button>
      </form>

      {submitted && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-md p-3">
          <p className="text-green-400 text-sm">
            Form validated and submitted on the client! No server roundtrip needed for validation.
          </p>
        </div>
      )}

      <p className="text-xs text-[var(--color-text-muted)] italic">
        This form validates in real-time in the browser. State (formData, errors)
        lives only in the browser. Try submitting with empty fields to see client validation.
      </p>
    </div>
  );
}
