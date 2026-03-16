/**
 * =============================================================================
 * GraphQL Schema Definition & Resolvers
 * =============================================================================
 *
 * This file is the heart of our GraphQL API. It defines three things:
 *
 *   1. The TYPE DEFINITIONS (typeDefs) — a string written in GraphQL's Schema
 *      Definition Language (SDL) that describes every type, query, and mutation
 *      our API supports. Think of this as the "contract" between the client
 *      and the server: it tells clients exactly what data they can ask for
 *      and what shape it will come back in.
 *
 *   2. The IN-MEMORY DATA STORE — simple JavaScript arrays that act as our
 *      "database." In a real application you would replace these with calls
 *      to a real database (PostgreSQL, MongoDB, etc.), but for learning
 *      purposes plain arrays let us focus on how GraphQL itself works without
 *      the complexity of database setup.
 *
 *   3. The RESOLVERS — an object whose structure mirrors the schema. Every
 *      field in the schema that needs custom logic to fetch or compute its
 *      value gets a corresponding resolver function. Resolvers are where
 *      the actual work happens: reading from the data store, filtering,
 *      creating new records, etc.
 *
 * WHY SEPARATE THIS FILE?
 * -----------------------
 * We keep the schema and resolvers in their own module so that:
 *   - The Route Handler (`app/api/graphql/route.ts`) stays slim and focused
 *     on wiring up the HTTP layer.
 *   - The schema can be imported by tests, scripts, or other server-side
 *     code without pulling in HTTP concerns.
 *   - It's easier to navigate: schema questions → this file,
 *     HTTP questions → the route handler.
 *
 * IMPORTANT: This file runs ONLY on the server. It is never bundled into
 * the client-side JavaScript that the browser downloads. That means it's
 * safe to put secrets, database connections, or other sensitive logic here
 * (though we don't need any for this demo).
 * =============================================================================
 */

// =============================================================================
// Section 1: In-Memory Data Store
// =============================================================================
//
// These arrays simulate database tables. Each object in an array is like a
// "row" in a relational database table.
//
// We use TypeScript interfaces to describe the shape of each record. This
// gives us autocompletion and compile-time checks — if we misspell a field
// name somewhere the TypeScript compiler will catch it before the code runs.
// =============================================================================

/**
 * Represents a user in our system.
 *
 * - `id`    — A unique identifier (string, not number, because GraphQL's ID
 *             scalar is always serialised as a string).
 * - `name`  — The user's display name.
 * - `email` — The user's email address.
 * - `bio`   — An optional short biography. Marked as `string | null` to
 *             match the nullable `bio: String` field in the GraphQL schema.
 */
interface User {
  id: string;
  name: string;
  email: string;
  bio: string | null;
}

/**
 * Represents a blog post.
 *
 * - `id`        — Unique identifier for the post.
 * - `title`     — The headline / title of the post.
 * - `content`   — The body text of the post.
 * - `authorId`  — Foreign key linking to the User who wrote this post.
 *                 Notice we store only the ID here, not the full User object.
 *                 The GraphQL resolver for `Post.author` will look up the
 *                 actual User object at query time. This is exactly how a
 *                 relational database works: you store a foreign key and
 *                 join at read time.
 * - `createdAt` — ISO-8601 timestamp of when the post was created.
 */
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

/**
 * Represents a comment on a post.
 *
 * - `id`        — Unique identifier for the comment.
 * - `text`      — The comment's body text.
 * - `postId`    — Foreign key linking to the Post this comment belongs to.
 * - `authorId`  — Foreign key linking to the User who wrote the comment.
 * - `createdAt` — ISO-8601 timestamp.
 */
interface Comment {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------
// We pre-populate the arrays with a handful of records so the API has
// something to return right away. This data is mutable — mutations like
// `createPost` will push new objects into these arrays at runtime. Because
// this module lives in server memory, the data persists as long as the
// server process is running. If the server restarts (e.g., during
// development hot-reload), the data resets back to these initial values.
// ---------------------------------------------------------------------------

/** All users in the system. */
const users: User[] = [
  { id: "1", name: "Alice", email: "alice@example.com", bio: "Full-stack developer" },
  { id: "2", name: "Bob", email: "bob@example.com", bio: "Frontend engineer" },
  { id: "3", name: "Charlie", email: "charlie@example.com", bio: "DevOps specialist" },
];

/** All blog posts. Each post references an author by `authorId`. */
const posts: Post[] = [
  { id: "1", title: "Getting Started with GraphQL", content: "GraphQL is a query language for APIs...", authorId: "1", createdAt: "2024-01-15T10:00:00Z" },
  { id: "2", title: "Next.js Server Components", content: "Server Components render on the server...", authorId: "1", createdAt: "2024-01-20T14:30:00Z" },
  { id: "3", title: "TypeScript Best Practices", content: "TypeScript adds static typing to JavaScript...", authorId: "2", createdAt: "2024-02-01T09:00:00Z" },
  { id: "4", title: "React 19 Features", content: "React 19 introduces several new features...", authorId: "3", createdAt: "2024-02-10T16:45:00Z" },
];

/** All comments. Each comment references a post (`postId`) and an author (`authorId`). */
const comments: Comment[] = [
  { id: "1", text: "Great introduction!", postId: "1", authorId: "2", createdAt: "2024-01-16T08:00:00Z" },
  { id: "2", text: "Very helpful, thanks!", postId: "1", authorId: "3", createdAt: "2024-01-17T12:00:00Z" },
  { id: "3", text: "I love Server Components!", postId: "2", authorId: "3", createdAt: "2024-01-21T10:30:00Z" },
  { id: "4", text: "Clear explanation", postId: "3", authorId: "1", createdAt: "2024-02-02T14:00:00Z" },
];

// =============================================================================
// Section 2: GraphQL Type Definitions (SDL)
// =============================================================================
//
// The `typeDefs` string below uses GraphQL's Schema Definition Language to
// declare every type, query, and mutation our API supports.
//
// KEY CONCEPTS:
//
// - `type` defines an object type with named fields.
// - `!` after a type means "non-nullable" — the server promises this field
//   will always have a value (never null).
// - `[Post!]!` means "a non-nullable list of non-nullable Post objects."
//   The outer `!` means the list itself is always present (never null),
//   and the inner `!` means no element inside the list will be null.
// - `ID` is a special scalar that represents a unique identifier. It's
//   always serialised as a string.
// - `Query` is the root type for all read operations.
// - `Mutation` is the root type for all write operations (create, update,
//   delete).
//
// HOW THE CLIENT USES THIS:
// When a client sends a GraphQL query, it can request any combination of
// fields from these types. For example:
//
//   query {
//     posts {
//       title
//       author {
//         name
//       }
//     }
//   }
//
// The server will return ONLY the fields the client asked for — no more,
// no less. This is one of GraphQL's biggest advantages over REST, where
// endpoints often return fixed shapes that may include too much or too
// little data.
// =============================================================================

export const typeDefs = /* GraphQL */ `
  # --------------------------------------------------------------------------
  # User Type
  # --------------------------------------------------------------------------
  # Represents a person who can author posts and comments.
  #
  # The "posts" and "comments" fields don't exist in our raw data — there is
  # no "posts" array stored on each user object. Instead, GraphQL resolves
  # these fields dynamically by filtering the posts/comments arrays to find
  # entries whose authorId matches this user's id. This is called a
  # "computed" or "derived" field.
  # --------------------------------------------------------------------------
  type User {
    id: ID!
    name: String!
    email: String!
    bio: String                # Nullable — a user might not have a bio.
    posts: [Post!]!            # All posts written by this user.
    comments: [Comment!]!      # All comments written by this user.
  }

  # --------------------------------------------------------------------------
  # Post Type
  # --------------------------------------------------------------------------
  # Represents a blog post. The "author" field is resolved by looking up the
  # user whose id matches this post's authorId. The "comments" field is
  # resolved by filtering the comments array for this post's id.
  # --------------------------------------------------------------------------
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!              # The user who wrote this post.
    comments: [Comment!]!      # All comments on this post.
    createdAt: String!         # ISO-8601 timestamp string.
  }

  # --------------------------------------------------------------------------
  # Comment Type
  # --------------------------------------------------------------------------
  # Represents a comment on a post. Both "post" and "author" are resolved
  # by looking up the related objects from their respective arrays.
  # --------------------------------------------------------------------------
  type Comment {
    id: ID!
    text: String!
    post: Post!                # The post this comment belongs to.
    author: User!              # The user who wrote this comment.
    createdAt: String!
  }

  # --------------------------------------------------------------------------
  # Queries (Read Operations)
  # --------------------------------------------------------------------------
  # The Query type is the entry point for all read operations. Every field
  # here becomes a top-level query that clients can call.
  # --------------------------------------------------------------------------
  type Query {
    # Fetch all users.
    users: [User!]!

    # Fetch a single user by their unique ID.
    # Returns null if no user with that ID exists.
    user(id: ID!): User

    # Fetch all posts.
    posts: [Post!]!

    # Fetch a single post by its unique ID.
    # Returns null if no post with that ID exists.
    post(id: ID!): Post

    # Fetch all comments across all posts.
    comments: [Comment!]!
  }

  # --------------------------------------------------------------------------
  # Mutations (Write Operations)
  # --------------------------------------------------------------------------
  # Mutations are how clients modify data. Each mutation takes input
  # arguments and returns the newly created or affected object so the
  # client can immediately see the result without making a second query.
  # --------------------------------------------------------------------------
  type Mutation {
    # Create a new blog post.
    # Requires a title, content body, and the ID of the author.
    # Returns the newly created Post object.
    createPost(title: String!, content: String!, authorId: ID!): Post!

    # Create a new comment on an existing post.
    # Requires the comment text, the ID of the post, and the author's ID.
    # Returns the newly created Comment object.
    createComment(text: String!, postId: ID!, authorId: ID!): Comment!

    # Delete a post by its ID.
    # Returns true if the post was found and deleted, false otherwise.
    # Also deletes all comments associated with that post (cascade delete).
    deletePost(id: ID!): Boolean!
  }
`;

// =============================================================================
// Section 3: Resolvers
// =============================================================================
//
// Resolvers are functions that "resolve" (compute) the value of each field
// in the schema. They form a tree that mirrors the schema's type hierarchy.
//
// RESOLVER FUNCTION SIGNATURE:
//   (parent, args, context, info) => value
//
//   - parent  — The return value of the parent resolver. For root Query/
//               Mutation resolvers, this is usually undefined. For nested
//               resolvers (e.g., Post.author), it's the Post object that
//               the parent resolver returned.
//   - args    — An object containing the arguments passed to this field
//               in the query. For example, `user(id: "1")` would give
//               args = { id: "1" }.
//   - context — A shared object available to all resolvers in a single
//               request. Useful for things like authentication info or
//               database connections. We don't use it in this demo.
//   - info    — Advanced metadata about the query (AST, field name, etc.).
//               Rarely needed in everyday resolvers.
//
// RESOLVER CHAIN EXAMPLE:
// When a client sends:
//   query { post(id: "1") { title author { name } } }
//
// GraphQL executes resolvers in this order:
//   1. Query.post(_, { id: "1" })        → returns the Post object
//   2. Post.title(postObject)            → returns postObject.title (default)
//   3. Post.author(postObject)           → looks up User by postObject.authorId
//   4. User.name(userObject)             → returns userObject.name (default)
//
// DEFAULT RESOLVERS:
// If a field name matches a property on the parent object, GraphQL uses a
// "default resolver" that simply returns `parent[fieldName]`. That's why
// we don't need explicit resolvers for fields like `Post.title` or
// `User.name` — they map directly to properties on the objects in our
// arrays.
//
// We ONLY write explicit resolvers for fields that require custom logic:
//   - Relationship fields (Post.author, User.posts, etc.)
//   - Root Query and Mutation fields
// =============================================================================

export const resolvers = {
  // ---------------------------------------------------------------------------
  // Query Resolvers — entry points for reading data
  // ---------------------------------------------------------------------------
  Query: {
    /**
     * users — Returns the entire list of users.
     *
     * Since we want ALL users with no filtering, we simply return the
     * array as-is. GraphQL will then call the default resolver for each
     * scalar field (id, name, email, bio) and our custom resolvers for
     * the relationship fields (posts, comments).
     */
    users: () => users,

    /**
     * user(id) — Returns a single user by ID, or null if not found.
     *
     * `args.id` comes from the query argument: `user(id: "1")`.
     * Array.find() returns undefined if no match is found, which GraphQL
     * treats as null — exactly what our schema expects (the return type
     * is `User` without `!`, meaning it's nullable).
     */
    user: (_parent: unknown, args: { id: string }) => {
      return users.find((user) => user.id === args.id) || null;
    },

    /**
     * posts — Returns all posts.
     *
     * Same pattern as `users`: return the whole array and let GraphQL
     * handle field-level resolution.
     */
    posts: () => posts,

    /**
     * post(id) — Returns a single post by ID, or null if not found.
     */
    post: (_parent: unknown, args: { id: string }) => {
      return posts.find((post) => post.id === args.id) || null;
    },

    /**
     * comments — Returns all comments across every post.
     */
    comments: () => comments,
  },

  // ---------------------------------------------------------------------------
  // Mutation Resolvers — entry points for writing data
  // ---------------------------------------------------------------------------
  Mutation: {
    /**
     * createPost — Creates a new post and adds it to the in-memory array.
     *
     * Steps:
     *   1. Generate a new unique ID by taking the current length of the
     *      posts array + 1 and converting to string. (This is a naive
     *      approach; a real app would use UUIDs or auto-incrementing
     *      database IDs.)
     *   2. Build the new Post object with all required fields.
     *   3. Push it into the posts array so subsequent queries see it.
     *   4. Return the new Post object so the client gets it back
     *      immediately in the mutation response.
     *
     * The authorId must correspond to an existing user; however, for
     * simplicity we don't validate that here. A production API would
     * check and throw an error if the author doesn't exist.
     */
    createPost: (_parent: unknown, args: { title: string; content: string; authorId: string }) => {
      // Build the new post object with a generated ID and current timestamp.
      const newPost: Post = {
        id: String(posts.length + 1),
        title: args.title,
        content: args.content,
        authorId: args.authorId,
        createdAt: new Date().toISOString(), // Current server time in ISO format.
      };

      // Add the post to our in-memory store.
      posts.push(newPost);

      // Return the newly created post. GraphQL will resolve nested fields
      // (author, comments) using the Post resolvers defined below.
      return newPost;
    },

    /**
     * createComment — Creates a new comment on an existing post.
     *
     * Works the same way as createPost:
     *   1. Generate a unique ID.
     *   2. Build the Comment object.
     *   3. Push it into the comments array.
     *   4. Return the new comment.
     */
    createComment: (_parent: unknown, args: { text: string; postId: string; authorId: string }) => {
      const newComment: Comment = {
        id: String(comments.length + 1),
        text: args.text,
        postId: args.postId,
        authorId: args.authorId,
        createdAt: new Date().toISOString(),
      };

      // Add the comment to our in-memory store.
      comments.push(newComment);

      // Return it so the mutation response includes the new comment.
      return newComment;
    },

    /**
     * deletePost — Removes a post (and its comments) from the store.
     *
     * Steps:
     *   1. Find the index of the post with the given ID.
     *   2. If not found, return false to indicate nothing was deleted.
     *   3. Remove the post from the array using splice().
     *   4. Remove all comments that reference this post (cascade delete).
     *      We iterate backwards to safely remove items while iterating.
     *   5. Return true to indicate success.
     *
     * Returning a Boolean is a common pattern for delete mutations — the
     * client just needs to know whether the operation succeeded.
     */
    deletePost: (_parent: unknown, args: { id: string }) => {
      // Find the index of the post to delete.
      const postIndex = posts.findIndex((post) => post.id === args.id);

      // If the post doesn't exist, return false (nothing to delete).
      if (postIndex === -1) {
        return false;
      }

      // Remove the post from the array. splice() modifies the array
      // in place and returns the removed elements.
      posts.splice(postIndex, 1);

      // Cascade delete: remove all comments that belong to this post.
      // We iterate backwards so that removing an element doesn't shift
      // the indices of elements we haven't visited yet.
      for (let i = comments.length - 1; i >= 0; i--) {
        if (comments[i].postId === args.id) {
          comments.splice(i, 1);
        }
      }

      // Return true to signal that the deletion was successful.
      return true;
    },
  },

  // ---------------------------------------------------------------------------
  // User Field Resolvers — resolve relationship fields on the User type
  // ---------------------------------------------------------------------------
  //
  // When a query asks for `user { posts }`, GraphQL already has the User
  // object (from Query.user or Query.users). It passes that object as the
  // first argument (`parent`) to these resolvers so we can use parent.id
  // to look up related records.
  // ---------------------------------------------------------------------------
  User: {
    /**
     * posts — Returns all posts written by this user.
     *
     * `parent` is the User object. We filter the posts array to find
     * every post whose authorId matches this user's id.
     *
     * This is the GraphQL equivalent of a SQL JOIN:
     *   SELECT * FROM posts WHERE author_id = user.id
     */
    posts: (parent: User) => {
      return posts.filter((post) => post.authorId === parent.id);
    },

    /**
     * comments — Returns all comments written by this user.
     *
     * Same pattern as `posts`: filter by authorId.
     */
    comments: (parent: User) => {
      return comments.filter((comment) => comment.authorId === parent.id);
    },
  },

  // ---------------------------------------------------------------------------
  // Post Field Resolvers — resolve relationship fields on the Post type
  // ---------------------------------------------------------------------------
  Post: {
    /**
     * author — Returns the User who wrote this post.
     *
     * `parent` is the Post object. We look up the user whose id matches
     * parent.authorId. Since `author` is non-nullable in the schema
     * (User!), this should always find a match. If it doesn't (data
     * integrity issue), GraphQL will return an error for this field.
     */
    author: (parent: Post) => {
      return users.find((user) => user.id === parent.authorId);
    },

    /**
     * comments — Returns all comments on this post.
     *
     * Filter the comments array for entries whose postId matches this
     * post's id.
     */
    comments: (parent: Post) => {
      return comments.filter((comment) => comment.postId === parent.id);
    },
  },

  // ---------------------------------------------------------------------------
  // Comment Field Resolvers — resolve relationship fields on the Comment type
  // ---------------------------------------------------------------------------
  Comment: {
    /**
     * post — Returns the Post this comment belongs to.
     *
     * Looks up the post by matching parent.postId against post IDs.
     */
    post: (parent: Comment) => {
      return posts.find((post) => post.id === parent.postId);
    },

    /**
     * author — Returns the User who wrote this comment.
     *
     * Looks up the user by matching parent.authorId against user IDs.
     */
    author: (parent: Comment) => {
      return users.find((user) => user.id === parent.authorId);
    },
  },
};
