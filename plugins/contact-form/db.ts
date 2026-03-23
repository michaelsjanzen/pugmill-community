import { db } from "../../src/lib/db";
import { pluginContactFormSubmissions, type SubmissionRow } from "./schema";
import { eq, desc, count } from "drizzle-orm";

/** Count of unread submissions — used by the notification system. */
export async function getUnreadCount(): Promise<number> {
  const result = await db
    .select({ total: count() })
    .from(pluginContactFormSubmissions)
    .where(eq(pluginContactFormSubmissions.read, false));
  return Number(result[0]?.total ?? 0);
}

/** All submissions, most recent first. Capped at 500 rows. */
export async function getAllSubmissions(): Promise<SubmissionRow[]> {
  return db
    .select()
    .from(pluginContactFormSubmissions)
    .orderBy(desc(pluginContactFormSubmissions.createdAt))
    .limit(500);
}

/** Unread submissions only, most recent first. */
export async function getUnreadSubmissions(): Promise<SubmissionRow[]> {
  return db
    .select()
    .from(pluginContactFormSubmissions)
    .where(eq(pluginContactFormSubmissions.read, false))
    .orderBy(desc(pluginContactFormSubmissions.createdAt));
}
