// =============================================================================
// GraphQL Subscriptions - Concept Page
// =============================================================================
// SERVER COMPONENT (default in Next.js App Router)
//
// This page is a React Server Component, meaning:
// 1. It runs ONLY on the server during the request/render cycle
// 2. No JavaScript is shipped to the client for this component
// 3. Cannot use React hooks (useState, useEffect, etc.)
// 4. Can access server-only resources directly
//
// RENDERING LIFECYCLE:
// 1. User navigates to /concepts/graphql/subscriptions
// 2. Next.js server receives the request
// 3. This component executes on the server, generating static HTML
// 4. HTML is streamed to the client
// 5. No hydration step needed — purely informational content
//
// IMPORTANT EDUCATIONAL NOTE:
// This page teaches the concept of GraphQL subscriptions but does NOT
// implement a live WebSocket server. Real subscriptions require:
// - A WebSocket-capable GraphQL server (e.g., Apollo Server with graphql-ws)
// - A persistent connection between client and server
// - Infrastructure that supports long-lived WebSocket connections
// The code examples here are illustrative and meant for learning.
//
// WHY SERVER COMPONENT:
// - No interactivity needed (educational/reference content)
// - Better performance — zero client-side JS overhead
// - Excellent SEO — all content rendered in initial HTML
// - Faster Time to First Byte (TTFB)
// =============================================================================

import ConceptPage from "@/app/components/ConceptPage";
import CodeBlock from "@/app/components/CodeBlock";
import FlowDiagram from "@/app/components/FlowDiagram";

// -----------------------------------------------------------------------------
// No client-side state, effects, or event handlers in this file.
// All content is determined at build/request time on the server.
// -----------------------------------------------------------------------------

export default function GraphQLSubscriptionsPage() {
  return (
    // ConceptPage provides consistent page structure across all concept pages
    // serverOrClient="server" — this topic is relevant to both sides but the
    // page itself is a server component
    <ConceptPage
      title="GraphQL Subscriptions"
      description="Learn how GraphQL subscriptions enable real-time data updates using WebSocket connections, and understand when to use them over polling or Server-Sent Events."
      serverOrClient="server"
    >
      {/* ================================================================== */}
      {/* SECTION 1: LAYMAN EXPLANATION                                      */}
      {/* A social media analogy makes real-time subscriptions intuitive     */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Understanding Subscriptions (The Simple Version)
        </h2>

        {/* Green card for the friendly analogy */}
        <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
          <h3 className="text-green-400 font-semibold text-lg mb-3">
            Think of It Like Following Someone on Social Media
          </h3>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            Imagine you want to know when your favorite creator posts something
            new. You have two options: you could open their profile page every 5
            minutes and check if there is anything new (that is exhausting!), or
            you could just <strong className="text-[var(--color-text-primary)]">follow them</strong>.
            When you follow someone, the platform notifies you automatically the
            moment they post — no need to keep checking.
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
            GraphQL subscriptions work the same way. Instead of your app
            repeatedly asking the server "Is there new data yet? How about now?
            Now?" (called <strong className="text-[var(--color-text-primary)]">polling</strong>),
            your app tells the server "Hey, let me know whenever this specific
            thing changes." The server then <strong className="text-[var(--color-text-primary)]">pushes
            updates</strong> to your app in real time.
          </p>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            The connection stays open (like keeping the app open to receive
            notifications), so updates arrive instantly without any delay or
            wasted requests.
          </p>
        </div>

        {/* Visual mapping of the analogy to technical concepts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Following = Subscribing
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              Your app establishes a persistent WebSocket connection to the server
              and declares what events it cares about.
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Push Notification = Server Push
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              When something changes on the server, it pushes the new data
              through the open connection — no request from the client needed.
            </p>
          </div>
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Unfollowing = Unsubscribing
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              When you leave the page or no longer need updates, the connection
              closes and the server stops sending data.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 2: DEVELOPER EXPLANATION                                   */}
      {/* Technical details about WebSockets and how subscriptions work      */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Developer Deep Dive: How Subscriptions Work
        </h2>

        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          GraphQL defines three root operation types: <strong className="text-[var(--color-text-primary)]">Query</strong> (read data),
          <strong className="text-[var(--color-text-primary)]"> Mutation</strong> (write data), and
          <strong className="text-[var(--color-text-primary)]"> Subscription</strong> (real-time updates).
          While queries and mutations use the standard HTTP request-response cycle,
          subscriptions use a persistent connection — typically a WebSocket.
        </p>

        {/* How subscriptions differ from queries and mutations */}
        <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
          <h3 className="text-blue-400 font-semibold text-lg mb-3">
            Subscriptions vs. Queries & Mutations
          </h3>
          <div className="space-y-4 text-[var(--color-text-secondary)]">
            <div>
              <strong className="text-[var(--color-text-primary)]">Queries & Mutations:</strong>{" "}
              Follow a request-response pattern over HTTP. The client sends a
              request, the server responds once, and the connection closes. This
              is a <em>pull</em> model — the client pulls data when it needs it.
            </div>
            <div>
              <strong className="text-[var(--color-text-primary)]">Subscriptions:</strong>{" "}
              Use a persistent WebSocket connection. The client declares interest
              in an event, and the server pushes data whenever that event occurs.
              This is a <em>push</em> model — the server pushes data when it has it.
            </div>
            <div>
              <strong className="text-[var(--color-text-primary)]">WebSocket Protocol:</strong>{" "}
              Starts as an HTTP request that "upgrades" to a WebSocket connection.
              Once upgraded, both client and server can send messages at any time
              through a single, long-lived TCP connection. The modern standard
              library for this is <code className="text-blue-400">graphql-ws</code>.
            </div>
          </div>
        </div>

        {/* When to use subscriptions */}
        <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
          <h3 className="text-purple-400 font-semibold text-lg mb-3">
            When to Use Subscriptions
          </h3>
          <ul className="text-[var(--color-text-secondary)] space-y-2 list-disc list-inside">
            <li>
              <strong className="text-[var(--color-text-primary)]">Chat applications</strong> — Messages
              need to appear instantly for all participants
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Live dashboards</strong> — Stock
              tickers, analytics, or monitoring that require real-time data
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Collaborative editing</strong> — Multiple
              users editing the same document need to see each other's changes
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Notifications</strong> — Alerting users
              of events as they happen (new orders, mentions, etc.)
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Gaming</strong> — Player state,
              game events, and multiplayer interactions
            </li>
          </ul>
        </div>

        {/* When NOT to use subscriptions */}
        <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
          <h3 className="text-orange-400 font-semibold text-lg mb-3">
            When NOT to Use Subscriptions
          </h3>
          <ul className="text-[var(--color-text-secondary)] space-y-2 list-disc list-inside">
            <li>
              Data that changes infrequently — polling every 30 seconds is simpler
              and cheaper than maintaining a WebSocket
            </li>
            <li>
              Static content or content updated by the current user only — just
              refetch after mutations
            </li>
            <li>
              Serverless environments (Vercel, AWS Lambda) — WebSockets require
              persistent server processes that serverless cannot provide
            </li>
            <li>
              When you need to support many thousands of concurrent users — each
              WebSocket holds a connection open, consuming server resources
            </li>
          </ul>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 3: CODE EXAMPLES                                           */}
      {/* Illustrative code for schema, client, server, and chat example     */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Code Examples
        </h2>

        {/* Note about educational context */}
        <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
          <p className="text-orange-400 text-sm">
            <strong>Note:</strong> These examples are for educational purposes.
            Running subscriptions requires a WebSocket-capable server (not
            available in serverless environments like default Vercel deployments).
          </p>
        </div>

        {/* Example 1: Subscription type definition in schema */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Subscription Type Definition (Schema)
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            Subscriptions are defined in your GraphQL schema just like queries
            and mutations, using the <code>Subscription</code> root type.
          </p>
          <CodeBlock
            filename="schema.graphql"
            language="graphql"
            highlights={[8, 9, 10, 11, 12, 13]}
            code={`# The three root types in GraphQL
type Query {
  messages(roomId: ID!): [Message!]!
  rooms: [Room!]!
}

type Mutation {
  sendMessage(roomId: ID!, content: String!): Message!
  createRoom(name: String!): Room!
}

# Subscription root type — defines what clients can subscribe to
type Subscription {
  # Triggered when a new message is sent in a specific room
  messageSent(roomId: ID!): Message!

  # Triggered when a user starts or stops typing
  userTyping(roomId: ID!): TypingIndicator!

  # Triggered when a new room is created
  roomCreated: Room!
}

type Message {
  id: ID!
  content: String!
  sender: User!
  roomId: ID!
  createdAt: String!
}

type TypingIndicator {
  userId: ID!
  username: String!
  isTyping: Boolean!
}

type Room {
  id: ID!
  name: String!
  participants: [User!]!
}`}
          />
        </div>

        {/* Example 2: Client-side subscription with graphql-ws */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Client-Side Subscription with graphql-ws
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            The <code className="text-blue-400">graphql-ws</code> library is the
            modern standard for GraphQL over WebSocket. It replaces the older
            <code className="text-blue-400"> subscriptions-transport-ws</code> library.
          </p>
          <CodeBlock
            filename="app/hooks/useMessageSubscription.ts"
            language="typescript"
            highlights={[7, 8, 9, 10, 11, 19, 20, 21, 22, 23, 24, 25, 26]}
            code={`"use client"; // This hook runs in the browser

import { useEffect, useState } from "react";
import { createClient } from "graphql-ws";

// Create a WebSocket client that connects to the GraphQL server
// This establishes a persistent connection for subscriptions
const wsClient = createClient({
  url: "ws://localhost:4000/graphql",
  // Optional: Authentication via connection params
  connectionParams: {
    authToken: "user-auth-token",
  },
});

// Custom hook for subscribing to new messages in a chat room
export function useMessageSubscription(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Subscribe returns a cleanup function
    // The subscribe() call sends the subscription operation
    // to the server over the WebSocket connection
    const cleanup = wsClient.subscribe<{ messageSent: Message }>(
      {
        query: \`
          subscription OnMessageSent($roomId: ID!) {
            messageSent(roomId: $roomId) {
              id
              content
              sender {
                id
                username
              }
              createdAt
            }
          }
        \`,
        variables: { roomId },
      },
      {
        // Called each time the server pushes a new message
        next(result) {
          if (result.data?.messageSent) {
            setMessages((prev) => [...prev, result.data!.messageSent]);
          }
        },
        // Called if the subscription encounters an error
        error(err) {
          setError(err instanceof Error ? err : new Error(String(err)));
        },
        // Called when the subscription completes (server closes it)
        complete() {
          console.log("Subscription completed");
        },
      }
    );

    // Cleanup: unsubscribe when the component unmounts
    // or when roomId changes
    return () => cleanup();
  }, [roomId]); // Re-subscribe when roomId changes

  return { messages, error };
}

// Type definition for a message
interface Message {
  id: string;
  content: string;
  sender: { id: string; username: string };
  createdAt: string;
}`}
          />
        </div>

        {/* Example 3: Server-side subscription setup */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Server-Side Subscription Resolvers
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            On the server, subscriptions use a publish/subscribe (PubSub) pattern.
            The server publishes events, and subscription resolvers filter and
            forward them to subscribed clients.
          </p>
          <CodeBlock
            filename="server/resolvers/subscription.ts"
            language="typescript"
            highlights={[4, 5, 6, 19, 20, 21, 22, 23]}
            code={`import { PubSub, withFilter } from "graphql-subscriptions";

// PubSub is an in-memory event system for subscriptions
// In production, use Redis PubSub (graphql-redis-subscriptions)
// for multi-server deployments
const pubsub = new PubSub();

// Event name constants — used to publish and subscribe to events
const EVENTS = {
  MESSAGE_SENT: "MESSAGE_SENT",
  USER_TYPING: "USER_TYPING",
  ROOM_CREATED: "ROOM_CREATED",
} as const;

export const subscriptionResolvers = {
  Subscription: {
    messageSent: {
      // subscribe() returns an AsyncIterator that yields events
      // withFilter ensures clients only receive events they care about
      // (i.e., messages for the room they subscribed to)
      subscribe: withFilter(
        () => pubsub.asyncIterator([EVENTS.MESSAGE_SENT]),
        // Filter function: only forward events where the message's
        // roomId matches the roomId the client subscribed to
        (payload, variables) => {
          return payload.messageSent.roomId === variables.roomId;
        }
      ),
    },

    userTyping: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([EVENTS.USER_TYPING]),
        (payload, variables) => {
          return payload.userTyping.roomId === variables.roomId;
        }
      ),
    },

    roomCreated: {
      // No filter needed — all clients get notified of new rooms
      subscribe: () => pubsub.asyncIterator([EVENTS.ROOM_CREATED]),
    },
  },
};

// In your mutation resolvers, publish events after data changes:
export const mutationResolvers = {
  Mutation: {
    sendMessage: async (_: any, args: any, context: any) => {
      // 1. Save the message to the database
      const message = await context.db.messages.create({
        content: args.content,
        roomId: args.roomId,
        senderId: context.userId,
      });

      // 2. Publish the event so subscribed clients receive it
      // This triggers the messageSent subscription for all
      // clients subscribed to this room
      await pubsub.publish(EVENTS.MESSAGE_SENT, {
        messageSent: message,
      });

      return message;
    },
  },
};`}
          />
        </div>

        {/* Example 4: Full chat component using subscriptions */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Chat Component with Subscriptions
          </h3>
          <p className="text-[var(--color-text-secondary)]">
            A complete example showing how queries (initial load) and
            subscriptions (real-time updates) work together in a chat UI.
          </p>
          <CodeBlock
            filename="app/components/ChatRoom.tsx"
            language="typescript"
            highlights={[15, 16, 17, 36, 37, 38, 39, 40]}
            code={`"use client"; // Chat requires interactivity — must be a Client Component

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useSubscription, gql } from "@apollo/client";

// Query: Fetch existing messages when the component mounts
const GET_MESSAGES = gql\`
  query GetMessages($roomId: ID!) {
    messages(roomId: $roomId) {
      id
      content
      sender { id username }
      createdAt
    }
  }
\`;

// Mutation: Send a new message
const SEND_MESSAGE = gql\`
  mutation SendMessage($roomId: ID!, $content: String!) {
    sendMessage(roomId: $roomId, content: $content) {
      id
      content
      sender { id username }
      createdAt
    }
  }
\`;

// Subscription: Listen for new messages in real time
const MESSAGE_SUBSCRIPTION = gql\`
  subscription OnMessageSent($roomId: ID!) {
    messageSent(roomId: $roomId) {
      id
      content
      sender { id username }
      createdAt
    }
  }
\`;

interface ChatRoomProps {
  roomId: string;
  currentUserId: string;
}

export default function ChatRoom({ roomId, currentUserId }: ChatRoomProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Query: Load existing messages on mount
  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: { roomId },
  });

  // 2. Subscription: Listen for new messages in real time
  //    subscribeToMore could also be used on the query above,
  //    but useSubscription is more explicit and easier to follow
  const { data: subData } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { roomId },
  });

  // 3. Mutation: Function to send a new message
  const [sendMessage] = useMutation(SEND_MESSAGE);

  // Combine queried messages with subscription messages
  const [messages, setMessages] = useState<any[]>([]);

  // Seed messages from initial query
  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  // Append new messages from subscription
  useEffect(() => {
    if (subData?.messageSent) {
      setMessages((prev) => {
        // Avoid duplicates (in case the mutation response
        // already added it via Apollo cache)
        const exists = prev.some((m) => m.id === subData.messageSent.id);
        if (exists) return prev;
        return [...prev, subData.messageSent];
      });
    }
  }, [subData]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage({
      variables: { roomId, content: newMessage },
    });
    setNewMessage("");
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={msg.sender.id === currentUserId
              ? "ml-auto bg-blue-600 rounded-lg p-3 max-w-xs"
              : "mr-auto bg-gray-700 rounded-lg p-3 max-w-xs"
            }
          >
            <p className="text-sm font-semibold">{msg.sender.username}</p>
            <p>{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 rounded font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}`}
          />
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 4: ARCHITECTURE DIAGRAM                                    */}
      {/* FlowDiagram showing the subscription lifecycle                     */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Subscription Lifecycle
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          This diagram traces the full lifecycle of a GraphQL subscription, from
          the initial connection setup through receiving real-time updates.
        </p>

        <FlowDiagram
          title="GraphQL Subscription Lifecycle"
          steps={[
            {
              label: "Client Initiates Connection",
              description:
                "Client sends an HTTP request with 'Upgrade: websocket' header to the GraphQL endpoint",
              type: "client",
            },
            {
              label: "WebSocket Handshake",
              description:
                "Server accepts the upgrade and establishes a persistent bidirectional WebSocket connection",
              type: "network",
            },
            {
              label: "Connection Initialized",
              description:
                "Client sends connection_init message with optional auth params; server responds with connection_ack",
              type: "server",
            },
            {
              label: "Client Sends Subscribe",
              description:
                "Client sends the subscription operation (query + variables) over the WebSocket",
              type: "client",
            },
            {
              label: "Server Registers Subscription",
              description:
                "Server sets up an event listener (AsyncIterator) for the specified subscription topic",
              type: "server",
            },
            {
              label: "Event Occurs on Server",
              description:
                "A mutation or external event triggers a publish() call with new data",
              type: "server",
            },
            {
              label: "Server Pushes Update",
              description:
                "Server sends a 'next' message with the subscription payload to the client via WebSocket",
              type: "network",
            },
            {
              label: "Client Receives Data",
              description:
                "Client's subscription handler receives the data and updates the UI in real time",
              type: "client",
            },
            {
              label: "Repeat: More Events",
              description:
                "Steps 6-8 repeat for every subsequent event — the connection stays open",
              type: "neutral",
            },
            {
              label: "Client Unsubscribes",
              description:
                "Client sends 'complete' message; server tears down the event listener and closes the subscription",
              type: "client",
            },
          ]}
        />
      </section>

      {/* ================================================================== */}
      {/* SECTION 5: COMPARISON TABLE                                        */}
      {/* Polling vs SSE vs WebSocket Subscriptions                          */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Comparison: Polling vs SSE vs WebSocket Subscriptions
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          There are multiple approaches to getting "real-time" data. Each has
          different trade-offs in complexity, latency, and infrastructure needs.
        </p>

        {/* Comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="p-3 text-[var(--color-text-primary)] font-semibold">Feature</th>
                <th className="p-3 text-blue-400 font-semibold">Polling</th>
                <th className="p-3 text-purple-400 font-semibold">Server-Sent Events (SSE)</th>
                <th className="p-3 text-orange-400 font-semibold">WebSocket Subscriptions</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-secondary)]">
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">How it works</td>
                <td className="p-3">Client sends repeated requests at intervals</td>
                <td className="p-3">Server pushes events over a one-way HTTP connection</td>
                <td className="p-3">Bidirectional persistent connection via WebSocket</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Latency</td>
                <td className="p-3">High (up to polling interval)</td>
                <td className="p-3">Low (server pushes immediately)</td>
                <td className="p-3">Very low (instant bidirectional)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Direction</td>
                <td className="p-3">Client to Server only</td>
                <td className="p-3">Server to Client only</td>
                <td className="p-3">Both directions</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Server load</td>
                <td className="p-3">High (many requests even with no changes)</td>
                <td className="p-3">Low (one connection per client)</td>
                <td className="p-3">Moderate (one connection, but stateful)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Complexity</td>
                <td className="p-3">Very simple</td>
                <td className="p-3">Simple</td>
                <td className="p-3">Complex (connection management, reconnection)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Serverless compatible</td>
                <td className="p-3">Yes</td>
                <td className="p-3">Partially (limited connection time)</td>
                <td className="p-3">No (requires persistent process)</td>
              </tr>
              <tr className="border-b border-[var(--color-border)]">
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Browser support</td>
                <td className="p-3">Universal</td>
                <td className="p-3">All modern browsers</td>
                <td className="p-3">All modern browsers</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-[var(--color-text-primary)]">Best for</td>
                <td className="p-3">Infrequent updates, simple setups</td>
                <td className="p-3">One-way feeds, notifications, live updates</td>
                <td className="p-3">Chat, gaming, collaborative editing</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Quick summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
            <h4 className="text-blue-400 font-semibold mb-2">Choose Polling When</h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              Data changes infrequently, you need maximum simplicity, or you are
              on serverless infrastructure. A 30-second polling interval is fine
              for dashboards that do not need instant updates.
            </p>
          </div>
          <div className="bg-purple-500/5 rounded-lg p-4 border border-purple-500/20">
            <h4 className="text-purple-400 font-semibold mb-2">Choose SSE When</h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              You need server-to-client real-time updates but clients do not need
              to send data back through the same channel. Great for live feeds,
              notifications, and streaming LLM responses.
            </p>
          </div>
          <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
            <h4 className="text-orange-400 font-semibold mb-2">Choose WebSocket Subscriptions When</h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              You need true bidirectional real-time communication. Essential for
              chat, multiplayer games, and collaborative editing where both client
              and server need to send data freely.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 6: PRACTICE EXERCISES                                      */}
      {/* Three tiers: beginner, intermediate, advanced                      */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Practice Exercises
        </h2>

        {/* Beginner exercises */}
        <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/20">
          <h3 className="text-green-400 font-semibold text-lg mb-3">
            Beginner
          </h3>
          <ol className="text-[var(--color-text-secondary)] space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-[var(--color-text-primary)]">Schema Design:</strong>{" "}
              Write a GraphQL schema with a Subscription type for a notification
              system. Include subscriptions for <code className="text-green-400">newNotification</code> and
              <code className="text-green-400"> notificationRead</code>. Define the Notification
              type with id, message, isRead, and createdAt fields.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Polling Simulation:</strong>{" "}
              Build a component that polls a GraphQL query every 5 seconds using
              Apollo Client's <code className="text-green-400">pollInterval</code> option. Observe
              the network requests in DevTools and compare the experience to what
              a subscription would offer.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Concept Comparison:</strong>{" "}
              Write a short document explaining the difference between polling,
              SSE, and WebSocket subscriptions. Include a scenario where each
              approach would be the best choice.
            </li>
          </ol>
        </div>

        {/* Intermediate exercises */}
        <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
          <h3 className="text-blue-400 font-semibold text-lg mb-3">
            Intermediate
          </h3>
          <ol className="text-[var(--color-text-secondary)] space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-[var(--color-text-primary)]">Local WebSocket Server:</strong>{" "}
              Set up a local GraphQL server using Apollo Server and
              <code className="text-blue-400"> graphql-ws</code>. Implement a simple subscription that
              pushes a random number every 2 seconds. Connect to it from a React
              client component.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Chat Room:</strong>{" "}
              Build a basic chat application with a <code className="text-blue-400">messageSent</code> subscription.
              Use <code className="text-blue-400">withFilter</code> on the server to ensure users only
              receive messages from the room they have joined.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Reconnection Handling:</strong>{" "}
              Implement connection retry logic using the <code className="text-blue-400">graphql-ws</code> client
              options. Test it by stopping and restarting your local server.
              Verify that the subscription automatically resumes.
            </li>
          </ol>
        </div>

        {/* Advanced exercises */}
        <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/20">
          <h3 className="text-orange-400 font-semibold text-lg mb-3">
            Advanced
          </h3>
          <ol className="text-[var(--color-text-secondary)] space-y-3 list-decimal list-inside">
            <li>
              <strong className="text-[var(--color-text-primary)]">Scaled PubSub with Redis:</strong>{" "}
              Replace the in-memory PubSub with <code className="text-orange-400">graphql-redis-subscriptions</code>.
              Run two instances of your GraphQL server and verify that a
              subscription on Server A receives events published by Server B.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Subscription Authentication:</strong>{" "}
              Implement authentication for WebSocket connections using
              <code className="text-orange-400"> connectionParams</code>. Verify the JWT token during
              the <code className="text-orange-400">onConnect</code> phase and reject unauthorized
              connections. Add authorization checks in the subscription resolver
              to ensure users can only subscribe to rooms they belong to.
            </li>
            <li>
              <strong className="text-[var(--color-text-primary)]">Hybrid Real-Time Strategy:</strong>{" "}
              Design and implement a system that uses WebSocket subscriptions for
              critical real-time data (chat messages) and SSE for less critical
              updates (user presence indicators). Measure the resource usage
              difference and document the trade-offs.
            </li>
          </ol>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SECTION 7: KEY TAKEAWAYS                                           */}
      {/* Summary of the most important concepts from this page              */}
      {/* ================================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Key Takeaways
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Takeaway 1 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Subscriptions are Push-Based
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              Unlike queries and mutations which follow a request-response pattern,
              subscriptions let the server push data to clients whenever events
              occur, enabling true real-time experiences.
            </p>
          </div>

          {/* Takeaway 2 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              WebSockets Require Infrastructure
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              Subscriptions need persistent WebSocket connections, which means
              they cannot run on serverless platforms. You need a long-running
              server process (Node.js, Docker, etc.) to maintain connections.
            </p>
          </div>

          {/* Takeaway 3 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Use graphql-ws, Not the Legacy Library
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              The <code>graphql-ws</code> library is the modern, actively
              maintained standard. The older <code>subscriptions-transport-ws</code> is
              deprecated. Always use <code>graphql-ws</code> for new projects.
            </p>
          </div>

          {/* Takeaway 4 */}
          <div className="bg-[var(--color-bg-card)] rounded-lg p-5 border border-[var(--color-border)]">
            <h4 className="text-[var(--color-text-primary)] font-semibold mb-2">
              Choose the Right Real-Time Strategy
            </h4>
            <p className="text-[var(--color-text-muted)] text-sm">
              Not every real-time need requires WebSocket subscriptions. Polling
              works for infrequent updates, SSE handles one-way server pushes
              efficiently, and subscriptions are for bidirectional real-time
              communication.
            </p>
          </div>
        </div>
      </section>
    </ConceptPage>
  );
}
