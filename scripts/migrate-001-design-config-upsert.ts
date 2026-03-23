/**
 * Migration 001 — theme_design_configs upsert support
 *
 * Applies three changes to an existing deployment:
 *
 *   1. Adds the `updated_at` column to `theme_design_configs` (used by the
 *      upsert in saveDesignDraft to track when a draft was last modified).
 *
 *   2. Removes any duplicate draft/published rows, keeping only the most
 *      recently inserted row per (theme_id, status) pair. Archived rows are
 *      not touched. This ensures the unique index creation in step 3 succeeds
 *      even on deployments that accumulated duplicates before the constraint.
 *
 *   3. Creates a partial unique index on (theme_id, status) covering only
 *      'draft' and 'published' rows. This allows the ON CONFLICT upsert in
 *      saveDesignDraft to work correctly while permitting multiple 'archived'
 *      rows per theme (history rows are excluded from the constraint).
 *
 * Steps 1 and 3 use IF NOT EXISTS guards so this script is safe to run
 * multiple times. Step 2 is a no-op when no duplicates exist.
 *
 * Usage:
 *   npm run db:migrate
 *
 * Fresh installs:
 *   Use `npm run db:push` instead — drizzle-kit push reads the schema and
 *   creates everything from scratch, making this script unnecessary.
 */

import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";

async function migrate() {
  console.log("[migrate-001] Starting...");

  // 1. Add updated_at column if it doesn't exist.
  await db.execute(sql`
    ALTER TABLE theme_design_configs
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL
  `);
  console.log("[migrate-001] updated_at column: ready");

  // 2. Remove any duplicate draft/published rows before creating the unique index.
  //    Keeps only the most recently inserted row (highest id) per (theme_id, status)
  //    pair. Archived rows are not touched. This prevents the index creation from
  //    failing on deployments that accumulated duplicates before the constraint existed.
  await db.execute(sql`
    DELETE FROM theme_design_configs
    WHERE status IN ('draft', 'published')
      AND id NOT IN (
        SELECT MAX(id)
        FROM theme_design_configs
        WHERE status IN ('draft', 'published')
        GROUP BY theme_id, status
      )
  `);
  console.log("[migrate-001] duplicate draft/published rows: cleaned");

  // 3. Create partial unique index if it doesn't exist.
  //    Covers only 'draft' and 'published' rows — archived rows are excluded
  //    so that history rows can accumulate without violating the constraint.
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS theme_design_configs_theme_active_status_idx
    ON theme_design_configs (theme_id, status)
    WHERE status IN ('draft', 'published')
  `);
  console.log("[migrate-001] partial unique index: ready");

  console.log("[migrate-001] Done.");
  process.exit(0);
}

migrate().catch(err => {
  console.error("[migrate-001] Failed:", err);
  process.exit(1);
});
