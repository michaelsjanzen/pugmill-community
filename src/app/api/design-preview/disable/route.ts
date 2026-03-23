import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";

const BASE_URL = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", BASE_URL()));
  }

  const cookieStore = await cookies();
  cookieStore.delete("__pugmill_design_preview");
  return NextResponse.redirect(new URL("/admin/design", BASE_URL()));
}
