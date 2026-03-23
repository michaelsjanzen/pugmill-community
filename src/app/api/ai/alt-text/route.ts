import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAiProvider } from "@/lib/ai";

const SUPPORTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { imageUrl, postTitle } = await req.json() as { imageUrl?: string; postTitle?: string };
  if (!imageUrl) {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }

  const ai = await getAiProvider();
  if (!ai?.describeImage) {
    // Provider not configured or doesn't support vision — client falls back
    return NextResponse.json({ result: null });
  }

  const siteUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const s3PublicUrl = (process.env.S3_PUBLIC_URL ?? "").replace(/\/$/, "");

  let absoluteUrl: string;
  if (imageUrl.startsWith("/")) {
    // Relative path — safe, belongs to this site
    absoluteUrl = `${siteUrl}${imageUrl}`;
  } else if (imageUrl.startsWith(siteUrl + "/") || (s3PublicUrl && imageUrl.startsWith(s3PublicUrl + "/"))) {
    // Absolute URL from a known trusted origin
    absoluteUrl = imageUrl;
  } else {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  try {
    const imgRes = await fetch(absoluteUrl);
    if (!imgRes.ok) throw new Error(`Could not fetch image (${imgRes.status})`);

    const mimeType = (imgRes.headers.get("content-type") ?? "").split(";")[0].trim();
    if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json({ result: null });
    }

    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const result = await ai.describeImage(base64, mimeType, postTitle);
    return NextResponse.json({ result: result.trim() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
