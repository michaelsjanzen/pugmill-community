"use server";
import { revalidatePath } from "next/cache";
import { getConfig, updateConfig } from "@/lib/config";
import { getCurrentUser } from "@/lib/get-current-user";
import { auditLog } from "@/lib/audit-log";
import { sanitizeThemeName } from "@/lib/theme-registry";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized: admin role required");
  return user;
}

export async function setActiveTheme(themeId: string) {
  const user = await requireAdmin();
  const safe = sanitizeThemeName(themeId);
  if (!safe) throw new Error("Invalid or unknown theme");

  const config = await getConfig();
  config.appearance.activeTheme = safe;
  await updateConfig(config);

  auditLog({ action: "settings.update", userId: user.id, detail: `theme: ${safe}` });
  revalidatePath("/admin/themes");
  revalidatePath("/");
}
