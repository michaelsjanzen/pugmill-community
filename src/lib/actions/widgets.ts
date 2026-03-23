"use server";
import { db } from "@/lib/db";
import { widgetSettings } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { getCurrentUser } from "@/lib/get-current-user";
import { ensureWidgetSettingsSchema } from "@/lib/widget-schema";
import { z } from "zod";

async function requireAdmin(): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized: admin role required.");
  }
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const widgetIdSlug = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "Invalid widget ID").max(100);
const areaIdSlug   = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "Invalid area ID").max(100);
const settingKey   = z.string().regex(/^[a-z0-9_-]+$/, "Invalid setting key").max(100);
const settingValue = z.string().max(10000);

// ─── Widget area assignments ───────────────────────────────────────────────────
// Stored as widget_settings rows with widgetId = "area:<areaId>" and key = "widgets".
// Bypasses the design draft/publish cycle so changes take effect immediately.

const AREA_WIDGETS_KEY = "widgets";
function areaRowId(areaId: string): string {
  return `area:${areaId}`;
}

export async function saveWidgetAreaAssignment(
  areaId: string,
  widgetIds: string[]
): Promise<void> {
  await requireAdmin();
  const parsedArea = areaIdSlug.parse(areaId);
  const parsedIds  = z.array(widgetIdSlug).max(50).parse(widgetIds);
  const value      = parsedIds.join(",");
  await ensureWidgetSettingsSchema();
  await db
    .insert(widgetSettings)
    .values({
      widgetId: areaRowId(parsedArea),
      key: AREA_WIDGETS_KEY,
      value,
    } as typeof widgetSettings.$inferInsert)
    .onConflictDoUpdate({
      target: [widgetSettings.widgetId, widgetSettings.key],
      set: { value },
    });
}

export async function getWidgetAreaAssignment(areaId: string): Promise<string[]> {
  await ensureWidgetSettingsSchema();
  const rows = await db
    .select({ value: widgetSettings.value })
    .from(widgetSettings)
    .where(
      and(
        eq(widgetSettings.widgetId, areaRowId(areaId)),
        eq(widgetSettings.key, AREA_WIDGETS_KEY)
      )
    );
  if (rows.length === 0) return [];
  return rows[0].value.split(",").map(s => s.trim()).filter(Boolean);
}

export async function getWidgetAreaAssignmentsBulk(
  areaIds: string[]
): Promise<Record<string, string[]>> {
  if (areaIds.length === 0) return {};
  await ensureWidgetSettingsSchema();
  const rowIds = areaIds.map(areaRowId);
  const rows = await db
    .select()
    .from(widgetSettings)
    .where(
      and(
        inArray(widgetSettings.widgetId, rowIds),
        eq(widgetSettings.key, AREA_WIDGETS_KEY)
      )
    );
  const result: Record<string, string[]> = {};
  for (const row of rows) {
    const areaId = row.widgetId.replace(/^area:/, "");
    result[areaId] = row.value.split(",").map(s => s.trim()).filter(Boolean);
  }
  return result;
}

// ─── Widget settings ──────────────────────────────────────────────────────────

export async function saveWidgetSetting(
  widgetId: string,
  key: string,
  value: string
): Promise<void> {
  await requireAdmin();
  const parsedWidgetId = widgetIdSlug.parse(widgetId);
  const parsedKey      = settingKey.parse(key);
  const parsedValue    = settingValue.parse(value);
  await ensureWidgetSettingsSchema();
  await db
    .insert(widgetSettings)
    .values({ widgetId: parsedWidgetId, key: parsedKey, value: parsedValue } as typeof widgetSettings.$inferInsert)
    .onConflictDoUpdate({
      target: [widgetSettings.widgetId, widgetSettings.key],
      set: { value: parsedValue },
    });
}

export async function saveWidgetSettingsFromForm(formData: FormData): Promise<void> {
  await requireAdmin();
  await ensureWidgetSettingsSchema();
  const entries = Array.from(formData.entries()) as [string, string][];
  for (const [rawKey, rawValue] of entries) {
    const sep = rawKey.indexOf(":");
    if (sep === -1) continue;
    const rawWidgetId = rawKey.slice(0, sep);
    const rawSettingKey = rawKey.slice(sep + 1);
    // Silently skip any entry that fails format validation rather than aborting the whole batch
    const widgetIdResult = widgetIdSlug.safeParse(rawWidgetId);
    const keyResult      = settingKey.safeParse(rawSettingKey);
    const valueResult    = settingValue.safeParse(rawValue);
    if (!widgetIdResult.success || !keyResult.success || !valueResult.success) continue;
    await db
      .insert(widgetSettings)
      .values({ widgetId: widgetIdResult.data, key: keyResult.data, value: valueResult.data } as typeof widgetSettings.$inferInsert)
      .onConflictDoUpdate({
        target: [widgetSettings.widgetId, widgetSettings.key],
        set: { value: valueResult.data },
      });
  }
}

export async function getWidgetSettings(
  widgetId: string
): Promise<Record<string, string>> {
  await ensureWidgetSettingsSchema();
  const rows = await db
    .select({ key: widgetSettings.key, value: widgetSettings.value })
    .from(widgetSettings)
    .where(eq(widgetSettings.widgetId, widgetId));
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export async function getWidgetSettingsBulk(
  widgetIds: string[]
): Promise<Record<string, Record<string, string>>> {
  if (widgetIds.length === 0) return {};
  await ensureWidgetSettingsSchema();
  const rows = await db
    .select()
    .from(widgetSettings)
    .where(inArray(widgetSettings.widgetId, widgetIds));
  const result: Record<string, Record<string, string>> = {};
  for (const row of rows) {
    if (!result[row.widgetId]) result[row.widgetId] = {};
    result[row.widgetId][row.key] = row.value;
  }
  return result;
}
