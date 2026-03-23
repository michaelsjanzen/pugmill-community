"use server";

import { db } from "../../src/lib/db";
import { getClientIp } from "../../src/lib/get-client-ip";
import { z } from "zod";
import { getConfig } from "../../src/lib/config";
import { hooks } from "../../src/lib/hooks";
import { loadPlugins } from "../../src/lib/plugin-loader";
import { pluginCommentsItems } from "./schema";
import { posts } from "../../src/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { getCurrentUser } from "../../src/lib/get-current-user";
import { createNotification, deleteNotificationByReplaceKey } from "../../src/lib/notifications";
import { getPendingCount } from "./db";
import type { CommentPayload } from "../../src/lib/hook-catalogue";
import { submissionLimiter, SUBMISSION_RATE_LIMIT } from "../../src/lib/rate-limit";
import { auditLog } from "../../src/lib/audit-log";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized: not logged in");
  if (user.role !== "admin" && user.role !== "editor") throw new Error("Unauthorized: insufficient role");
  return user;
}

// ─── Public: submit a comment ─────────────────────────────────────────────────

export interface CommentFormState {
  status: "idle" | "success" | "error";
  message: string;
  /** true when moderation=manual and comment was saved but not yet approved */
  pending?: boolean;
}

export async function submitComment(
  _prev: CommentFormState,
  formData: FormData
): Promise<CommentFormState> {
  // Server actions run without a layout render, so loadPlugins() may not have
  // been called yet. This is idempotent — a no-op if already loaded.
  await loadPlugins();

  const config = await getConfig();

  if (!config.modules.activePlugins.includes("comments")) {
    return { status: "error", message: "Comments are not enabled." };
  }

  const settings = config.modules.pluginSettings?.["comments"] ?? {};
  const moderation = (settings.moderation as string) ?? "manual";
  const requireEmail = settings.requireEmail !== false;
  const maxLength = parseInt((settings.maxLength as string) ?? "2000", 10) || 2000;

  // Rate limit by IP — max 5 comments per 10 minutes.
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const { success: allowed } = submissionLimiter.check(`comment:${ip}`, SUBMISSION_RATE_LIMIT);
  if (!allowed) {
    return { status: "error", message: "Too many comments. Please try again later." };
  }

  const postId = parseInt(formData.get("postId") as string, 10);
  const parentId = formData.get("parentId") ? parseInt(formData.get("parentId") as string, 10) : null;
  const authorName = (formData.get("authorName") as string)?.trim();
  const authorEmail = (formData.get("authorEmail") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();

  // Validation
  if (!postId || isNaN(postId)) return { status: "error", message: "Invalid post." };

  const post = await db.query.posts.findFirst({
    where: and(eq(posts.id, postId), eq(posts.published, true)),
    columns: { id: true },
  });
  if (!post) return { status: "error", message: "Post not found." };
  if (!authorName) return { status: "error", message: "Name is required." };
  if (requireEmail && !authorEmail) return { status: "error", message: "Email is required." };
  if (requireEmail && authorEmail && !z.string().email().safeParse(authorEmail).success) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  if (!content) return { status: "error", message: "Comment cannot be empty." };
  if (content.length > maxLength) {
    return { status: "error", message: `Comment must be under ${maxLength} characters.` };
  }

  // Validate parentId belongs to the same post (prevents cross-post reply injection)
  if (parentId !== null) {
    const parent = await db
      .select({ id: pluginCommentsItems.id, postId: pluginCommentsItems.postId })
      .from(pluginCommentsItems)
      .where(and(eq(pluginCommentsItems.id, parentId), eq(pluginCommentsItems.postId, postId)));
    if (parent.length === 0) {
      return { status: "error", message: "Invalid reply target." };
    }
  }

  const draft = {
    postId,
    authorName,
    authorEmail: authorEmail || "",
    content,
    parentId: parentId ?? undefined,
  };

  // Allow plugins to reject the comment (e.g. spam detection).
  // doActionStrict() re-throws so a plugin can throw to reject the comment.
  try {
    await hooks.doActionStrict("comment:before-create", { comment: draft });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Comment was rejected.";
    return { status: "error", message: msg };
  }

  const autoApprove = moderation === "auto";

  let inserted;
  try {
    inserted = await db
      .insert(pluginCommentsItems)
      .values({
        postId,
        parentId: parentId ?? null,
        authorName,
        authorEmail: authorEmail || "",
        content,
        approved: autoApprove,
      } as typeof pluginCommentsItems.$inferInsert)
      .returning();
  } catch (err) {
    console.error("[comments] Failed to insert comment:", err);
    return { status: "error", message: "Could not save your comment. Please try again." };
  }

  const saved = inserted[0];
  if (!saved) {
    return { status: "error", message: "Could not save your comment. Please try again." };
  }

  const payload: CommentPayload = {
    id: saved.id,
    postId: saved.postId,
    parentId: saved.parentId,
    authorName: saved.authorName,
    authorEmail: saved.authorEmail,
    content: saved.content,
    approved: saved.approved,
    createdAt: saved.createdAt,
  };

  await hooks.doAction("comment:after-create", { comment: payload });

  // Create or update the pending-moderation notification directly rather than
  // via a hook listener. Notifications are a core side effect of this action,
  // not an optional plugin extension — calling them directly is more reliable
  // and explicit than delegating to a hook listener that could be missed.
  if (!autoApprove) {
    const pending = await getPendingCount();
    await createNotification({
      pluginId: "comments",
      message: `${pending} comment${pending === 1 ? "" : "s"} awaiting moderation.`,
      href: "/admin/comments",
      replaceKey: "comments:pending",
      itemCount: pending,
    });
  }

  // Revalidate post page so approved comments appear
  if (autoApprove) {
    revalidatePath("/post/[slug]", "page");
  }

  return {
    status: "success",
    message: autoApprove
      ? "Your comment has been posted."
      : "Your comment is awaiting moderation.",
    pending: !autoApprove,
  };
}

// ─── Admin: approve a comment ─────────────────────────────────────────────────

export async function approveComment(id: number): Promise<void> {
  const user = await requireAdmin();
  await loadPlugins();
  await db
    .update(pluginCommentsItems)
    .set({ approved: true } as Partial<typeof pluginCommentsItems.$inferInsert>)
    .where(eq(pluginCommentsItems.id, id));
  await hooks.doAction("comment:after-approve", { commentId: id, approved: true });
  await syncPendingNotification();
  auditLog({ action: "comment.approve", userId: user.id, detail: `commentId=${id}` });
  revalidatePath("/admin/comments");
  revalidatePath("/post/[slug]", "page");
}

// ─── Admin: delete a comment ──────────────────────────────────────────────────

export async function deleteComment(id: number): Promise<void> {
  const user = await requireAdmin();
  await loadPlugins();
  await db.delete(pluginCommentsItems).where(eq(pluginCommentsItems.id, id));
  await syncPendingNotification();
  auditLog({ action: "comment.delete", userId: user.id, detail: `commentId=${id}` });
  revalidatePath("/admin/comments");
  revalidatePath("/post/[slug]", "page");
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Keep the pending-moderation notification in sync with the actual pending count.
 * Called after any action that changes the pending queue (approve, delete).
 * If the queue is now empty, clears the notification badge.
 */
async function syncPendingNotification(): Promise<void> {
  const pending = await getPendingCount();
  if (pending > 0) {
    await createNotification({
      pluginId: "comments",
      message: `${pending} comment${pending === 1 ? "" : "s"} awaiting moderation.`,
      href: "/admin/comments",
      replaceKey: "comments:pending",
      itemCount: pending,
    });
  } else {
    await deleteNotificationByReplaceKey("comments", "comments:pending");
  }
}
