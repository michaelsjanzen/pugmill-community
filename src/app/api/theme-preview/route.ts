import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { THEME_ALLOWLIST } from "@/lib/theme-registry";

const BASE_URL = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000";

/**
 * GET /api/theme-preview?theme=<id>
 *
 * Sets a short-lived cookie that makes the public site render with the given theme
 * so admins can preview it before activating. The cookie is httpOnly and lasts 1 hour.
 * Only theme IDs present in THEME_ALLOWLIST are accepted.
 */
export async function GET(req: NextRequest) {
  const themeId = new URL(req.url).searchParams.get("theme") ?? "";

  if (!themeId || !(THEME_ALLOWLIST as readonly string[]).includes(themeId)) {
    return NextResponse.redirect(new URL("/", BASE_URL()));
  }

  const cookieStore = await cookies();
  cookieStore.set("__pugmill_theme_preview", themeId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return NextResponse.redirect(new URL("/", BASE_URL()));
}
