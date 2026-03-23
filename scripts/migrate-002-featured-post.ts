/**
 * Migration 002 — featured post column
 *
 * Adds `featured boolean NOT NULL DEFAULT false` to the posts table.
 * This column marks a single post to be displayed as a hero/featured card
 * above the main feed on the homepage.
 *
 * Safe to run multiple times (IF NOT EXISTS guard).
 *
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/migrate-002-featured-post.ts
 *
 * Fresh installs:
 *   Use `npm run db:push` instead.
 */

import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("[migrate-002] Starting...");

  await db.execute(sql`
    ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false
  `);
  console.log("[migrate-002] featured column: ready");

  console.log("[migrate-002] Done.");
  process.exit(0);
}

migrate().catch(err => {
  console.error("[migrate-002] Failed:", err);
  process.exit(1);
});
