"use client";

// CLIENT COMPONENT - useActionState Demo
// ========================================
// Demonstrates useActionState (React 19) for handling Server Action state.
// useActionState provides:
// - The current state (return value of the action)
// - A form action to pass to <form>
// - A pending state boolean
//
// This replaces the older pattern of useState + manual fetch.

import { useActionState } from "react";
import { submitFeedback } from "./actions";

export default function ServerActionWithState() {
  // useActionState hook
  // Args: (action, initialState)
  // Returns: [state, formAction, isPending]
  const [state, formAction, isPending] = useActionState(submitFeedback, {
    message: "",
    status: "",
  });

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="tag-server">Server Action</span>
        <span className="tag-client">useActionState</span>
      </div>

      <form action={formAction} className="space-y-3">
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] mb-1">Name</label>
          <input
            name="name"
            type="text"
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text-muted)] mb-1">Feedback</label>
          <textarea
            name="feedback"
            placeholder="Your feedback (at least 10 characters)"
            rows={3}
            className="w-full px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      {/* Show server response */}
      {state.message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            state.status === "error"
              ? "bg-red-500/10 border border-red-500/30 text-red-400"
              : "bg-green-500/10 border border-green-500/30 text-green-400"
          }`}
        >
          {state.message}
        </div>
      )}

      <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
        The form submits to a Server Action. Validation runs on the server.
        useActionState manages the pending state and server response automatically.
        Try submitting with short inputs to see server-side validation errors.
      </p>
    </div>
  );
}
