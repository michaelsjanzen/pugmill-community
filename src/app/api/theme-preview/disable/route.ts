import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE_URL = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000";

/**
 * GET /api/theme-preview/disable
 *
 * Clears the theme preview cookie and returns the admin to the themes page.
 */
export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("__pugmill_theme_preview");
  return NextResponse.redirect(new URL("/admin/themes", BASE_URL()));
}
