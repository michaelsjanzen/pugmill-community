import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Idempotently create the widget_settings table and its unique index.
 * Called from loadPlugins() on every cold start — safe to run repeatedly.
 */
export async function ensureWidgetSettingsSchema(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS widget_settings (
      id          SERIAL PRIMARY KEY,
      widget_id   TEXT NOT NULL,
      key         TEXT NOT NULL,
      value       TEXT NOT NULL,
      updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS widget_settings_widget_key_idx
      ON widget_settings (widget_id, key)
  `);
}
