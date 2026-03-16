"use server";

// SERVER ACTIONS FILE
// ===================
// Every exported function in this file is a Server Action.
// The "use server" directive at the top marks ALL exports.
//
// These functions:
// - Execute ONLY on the server
// - Can access databases, file system, env vars
// - Are called from Client Components via form actions or event handlers
// - Receive serialized data from the client
// - Can return serialized data to the client

// Simulated in-memory database
const todos: { id: string; text: string; completed: boolean }[] = [
  { id: "1", text: "Learn Server Components", completed: true },
  { id: "2", text: "Master Server Actions", completed: false },
  { id: "3", text: "Build with Next.js", completed: false },
];

// Server Action: Add a new todo
export async function addTodo(formData: FormData) {
  // This runs on the SERVER
  // formData comes from the form submission
  const text = formData.get("todo") as string;

  if (!text || text.trim().length === 0) {
    return { error: "Todo text is required" };
  }

  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newTodo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
  };

  todos.push(newTodo);

  // Return the result to the client
  return { success: true, todo: newTodo, allTodos: [...todos] };
}

// Server Action: Toggle todo completion
export async function toggleTodo(id: string) {
  // This runs on the SERVER
  await new Promise((resolve) => setTimeout(resolve, 300));

  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }

  return { success: true, allTodos: [...todos] };
}

// Server Action: Get all todos
export async function getTodos() {
  // Simulate database read
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...todos];
}

// Server Action with validation - for useActionState demo
export async function submitFeedback(
  prevState: { message: string; status: string },
  formData: FormData
) {
  // This function signature works with useActionState
  // prevState: the previous state returned by this action
  // formData: the form data from the submission

  const name = formData.get("name") as string;
  const feedback = formData.get("feedback") as string;

  // Server-side validation
  if (!name || name.trim().length < 2) {
    return { message: "Name must be at least 2 characters", status: "error" };
  }

  if (!feedback || feedback.trim().length < 10) {
    return { message: "Feedback must be at least 10 characters", status: "error" };
  }

  // Simulate saving to database
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return success state
  return {
    message: `Thank you, ${name}! Your feedback has been saved on the server.`,
    status: "success",
  };
}
