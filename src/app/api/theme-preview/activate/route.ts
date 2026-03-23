import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { THEME_ALLOWLIST } from "@/lib/theme-registry";
import { getConfig, updateConfig } from "@/lib/config";
import { auditLog } from "@/lib/audit-log";
import { revalidatePath } from "next/cache";

const BASE_URL = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000";

/**
 * GET /api/theme-preview/activate
 *
 * Activates the theme currently being previewed (reads from cookie), then clears
 * the preview cookie. Admin role required — unauthenticated requests are redirected
 * to the login page.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", BASE_URL()));
  }

  const cookieStore = await cookies();
  const previewThemeId = cookieStore.get("__pugmill_theme_preview")?.value ?? "";

  // Only activate if the cookie contains a known allowlisted theme
  if (!previewThemeId || !(THEME_ALLOWLIST as readonly string[]).includes(previewThemeId)) {
    return NextResponse.redirect(new URL("/admin/themes", BASE_URL()));
  }

  const config = await getConfig();
  config.appearance.activeTheme = previewThemeId;
  await updateConfig(config);

  auditLog({ action: "settings.update", userId: user.id, detail: `theme: ${previewThemeId}` });
  revalidatePath("/admin/themes");
  revalidatePath("/");

  cookieStore.delete("__pugmill_theme_preview");
  return NextResponse.redirect(new URL("/admin/themes", BASE_URL()));
}
