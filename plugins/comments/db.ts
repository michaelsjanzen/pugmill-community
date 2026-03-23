import { db } from "../../src/lib/db";
import { pluginCommentsItems, type CommentRow } from "./schema";
import { eq, and, desc, count } from "drizzle-orm";

export interface ThreadedComment extends CommentRow {
  replies: CommentRow[];
}

/** Approved top-level comments for a post, with their approved replies. */
export async function getThreadedComments(postId: number): Promise<ThreadedComment[]> {
  const all = await db
    .select()
    .from(pluginCommentsItems)
    .where(and(eq(pluginCommentsItems.postId, postId), eq(pluginCommentsItems.approved, true)))
    .orderBy(pluginCommentsItems.createdAt);

  const topLevel = all.filter(c => c.parentId === null);
  const replies = all.filter(c => c.parentId !== null);

  return topLevel.map(comment => ({
    ...comment,
    replies: replies.filter(r => r.parentId === comment.id),
  }));
}

/** Count of approved comments for a post — uses SQL COUNT for efficiency. */
export async function getCommentCount(postId: number): Promise<number> {
  const result = await db
    .select({ total: count() })
    .from(pluginCommentsItems)
    .where(and(eq(pluginCommentsItems.postId, postId), eq(pluginCommentsItems.approved, true)));
  return Number(result[0]?.total ?? 0);
}

/** Count of comments pending approval — used by the notification system. */
export async function getPendingCount(): Promise<number> {
  const result = await db
    .select({ total: count() })
    .from(pluginCommentsItems)
    .where(eq(pluginCommentsItems.approved, false));
  return Number(result[0]?.total ?? 0);
}

/** All comments pending approval (for admin). */
export async function getPendingComments(): Promise<CommentRow[]> {
  return db
    .select()
    .from(pluginCommentsItems)
    .where(eq(pluginCommentsItems.approved, false))
    .orderBy(desc(pluginCommentsItems.createdAt));
}

/** All comments (for admin), most recent first. Capped at 500 rows — add pagination before production scale. */
export async function getAllComments(): Promise<CommentRow[]> {
  return db
    .select()
    .from(pluginCommentsItems)
    .orderBy(desc(pluginCommentsItems.createdAt))
    .limit(500);
}
