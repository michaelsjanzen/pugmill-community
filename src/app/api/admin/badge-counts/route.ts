import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { getUnreadCountsByPlugin } from "@/lib/notifications";
import { checkApiRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const limited = checkApiRateLimit(req);
  if (limited) return limited;

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const counts = await getUnreadCountsByPlugin();
  return NextResponse.json(counts);
}
