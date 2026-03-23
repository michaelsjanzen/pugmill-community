/**
 * Migration 002 — posts table performance indexes
 *
 * Adds two indexes to the posts table that are missing from the initial schema
 * but required for acceptable query performance as content grows:
 *
 *   1. posts_published_type_idx — composite index on (published, type).
 *      Covers every feed query: homepage, blog archive, page tree, and the
 *      admin posts list — all of which filter by published=true AND type='post'|'page'.
 *
 *   2. posts_author_id_idx — index on author_id.
 *      Covers editor-scoped queries, ownership checks on updatePost/deletePost,
 *      and the author dashboard view.
 *
 * Both statements use IF NOT EXISTS so this script is safe to run multiple times.
 *
 * Usage (existing deployments):
 *   npm run db:migrate
 *
 * Fresh installs:
 *   Use `npm run db:push` instead — drizzle-kit push reads the schema and
 *   creates everything from scratch, making this script unnecessary.
 */

import "./_load-env";
import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("[migrate-002] Starting...");

  // 1. Composite index for feed queries (published + type).
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS posts_published_type_idx
    ON posts (published, type)
  `);
  console.log("[migrate-002] posts_published_type_idx: ready");

  // 2. Index for author-scoped queries.
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS posts_author_id_idx
    ON posts (author_id)
  `);
  console.log("[migrate-002] posts_author_id_idx: ready");

  console.log("[migrate-002] Done.");
  process.exit(0);
}

migrate().catch(err => {
  console.error("[migrate-002] Failed:", err);
  process.exit(1);
});
