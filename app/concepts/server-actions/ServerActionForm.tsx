"use client";

// CLIENT COMPONENT - Server Action Form Demo
// ============================================
// This Client Component demonstrates calling Server Actions from forms.
// The form's action attribute points to a Server Action function.
//
// WHY CLIENT COMPONENT?
// - Uses useState for managing the todo list display
// - Uses useTransition for pending state during server action execution
// - Handles form reset after submission
//
// IMPORTANT: The Server Action itself runs on the server.
// Only the form UI logic runs on the client.

import { useState, useTransition, useRef } from "react";
import { addTodo, toggleTodo, getTodos } from "./actions";

export default function ServerActionForm() {
  const [todos, setTodos] = useState<
    { id: string; text: string; completed: boolean }[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [loaded, setLoaded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Load initial todos
  const loadTodos = () => {
    startTransition(async () => {
      const result = await getTodos();
      setTodos(result);
      setLoaded(true);
    });
  };

  // Handle form submission - calls Server Action
  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await addTodo(formData);
      if (result.allTodos) {
        setTodos(result.allTodos);
      }
      formRef.current?.reset();
    });
  };

  // Toggle todo - calls Server Action
  const handleToggle = (id: string) => {
    startTransition(async () => {
      const result = await toggleTodo(id);
      if (result.allTodos) {
        setTodos(result.allTodos);
      }
    });
  };

  return (
    <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="tag-server">Server Action</span>
        <span className="tag-client">Client UI</span>
      </div>

      {!loaded ? (
        <button
          onClick={loadTodos}
          disabled={isPending}
          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? "Loading..." : "Load Todos from Server"}
        </button>
      ) : (
        <>
          {/* Form with Server Action */}
          <form ref={formRef} action={handleSubmit} className="flex gap-2 mb-4">
            <input
              name="todo"
              type="text"
              placeholder="Add a new todo..."
              required
              className="flex-1 px-3 py-2 rounded-md bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-green-500"
            />
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? "Adding..." : "Add Todo"}
            </button>
          </form>

          {/* Todo list */}
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 bg-[var(--color-bg-primary)] rounded-md p-3"
              >
                <button
                  onClick={() => handleToggle(todo.id)}
                  disabled={isPending}
                  className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center text-xs transition-colors ${
                    todo.completed
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-[var(--color-border)] hover:border-green-500"
                  }`}
                >
                  {todo.completed && "✓"}
                </button>
                <span
                  className={`text-sm ${
                    todo.completed
                      ? "text-[var(--color-text-muted)] line-through"
                      : "text-[var(--color-text-primary)]"
                  }`}
                >
                  {todo.text}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mt-4 italic">
            Every add/toggle action calls a Server Action. The function executes on the server,
            modifies the in-memory store, and returns the updated list. The UI updates when the
            server responds.
          </p>
        </>
      )}
    </div>
  );
}
