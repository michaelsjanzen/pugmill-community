import type { MetadataRoute } from "next";

/**
 * Explicit robots.txt — allows all crawlers including major AI bots.
 * Without this file, some agents treat the absence as ambiguous.
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) respect robots.txt,
 * so an explicit allow is both a signal and a best-practice hygiene item.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return {
    rules: [
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
