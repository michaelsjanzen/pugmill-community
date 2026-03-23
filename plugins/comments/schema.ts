import { pgTable, serial, integer, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";

/**
 * plugin_comments_items — stores all comments across all posts.
 *
 * Rules followed:
 *  - Table name prefixed: plugin_comments_<tablename>
 *  - postId and parentId are plain integers, no FK constraints to core tables
 */
export const pluginCommentsItems = pgTable("plugin_comments_items", {
  id: serial("id").primaryKey(),
  /** References posts.id by value — no FK constraint intentionally. */
  postId: integer("post_id").notNull(),
  /** References plugin_comments_items.id for threaded replies. Null = top-level comment. */
  parentId: integer("parent_id"),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  content: text("content").notNull(),
  /** false until an admin approves. If moderation=auto, set true on insert. */
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CommentRow = typeof pluginCommentsItems.$inferSelect;
export type CommentInsert = typeof pluginCommentsItems.$inferInsert;
