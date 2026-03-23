import type { PugmillPlugin } from "../../src/lib/plugin-registry";
import { db } from "../../src/lib/db";
import { sql } from "drizzle-orm";
import { deletePluginNotifications, createNotification } from "../../src/lib/notifications";
import { getPendingCount } from "./db";
import CommentsSection from "./components/CommentsSection";

export const commentsPlugin: PugmillPlugin = {
  id: "comments",
  name: "Comments",
  version: "1.0.0",
  description: "Threaded comment system with manual or auto-approval moderation.",

  settingsDefs: [
    {
      key: "moderation",
      label: "Moderation Mode",
      type: "select",
      default: "manual",
      options: ["manual", "auto"],
      description: "manual: new comments require approval before appearing. auto: comments are approved immediately.",
    },
    {
      key: "requireEmail",
      label: "Require Email Address",
      type: "boolean",
      default: true,
      description: "Require commenters to provide an email address.",
    },
    {
      key: "maxLength",
      label: "Maximum Comment Length",
      type: "text",
      default: "2000",
      description: "Maximum characters per comment. Set to 0 for no limit.",
    },
  ],

  actionHref: "/admin/comments",

  async initialize(_hooks, _settings) {
    // Sync the pending-moderation notification on startup.
    // This catches cases where a comment was submitted before the notification
    // system existed, or before an admin has visited the admin area.
    // New comment notifications are also created directly in actions.ts because
    // server actions run without loadPlugins(), so hook listeners don't fire there.
    const pending = await getPendingCount();
    if (pending > 0) {
      await createNotification({
        pluginId: "comments",
        message: `${pending} comment${pending === 1 ? "" : "s"} awaiting moderation.`,
        href: "/admin/comments",
        replaceKey: "comments:pending",
        itemCount: pending,
      });
    }
  },

  schema: {
    async migrate() {
      // CREATE TABLE IF NOT EXISTS — safe to call on every startup
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS plugin_comments_items (
          id          SERIAL PRIMARY KEY,
          post_id     INTEGER NOT NULL,
          parent_id   INTEGER,
          author_name VARCHAR(100) NOT NULL,
          author_email VARCHAR(255) NOT NULL,
          content     TEXT NOT NULL,
          approved    BOOLEAN NOT NULL DEFAULT FALSE,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
    },
    async teardown() {
      await db.execute(sql`DROP TABLE IF EXISTS plugin_comments_items`);
      await deletePluginNotifications("comments");
    },
  },

  /** Rendered below post content — displays the comment thread and submission form. */
  slots: {
    postFooter: CommentsSection,
  },

};
