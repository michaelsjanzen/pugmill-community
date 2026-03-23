import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getAiProvider } from "@/lib/ai";
import { db } from "@/lib/db";
import { adminUsers, posts } from "@/lib/db/schema";
import { and, eq, ne, desc } from "drizzle-orm";
import { getConfig } from "@/lib/config";

type SuggestType = "excerpt" | "titles" | "categories" | "tags" | "aeo" | "keywords"
  | "slug" | "meta-title" | "headline-variants" | "topic-report" | "reading-level" | "brief"
  | "internal-links" | "tone-check" | "site-summary" | "site-faqs";

function buildSystemPrompt(type: SuggestType, authorVoice: string, opts: { existingTags?: string[] } = {}): string {
  const voiceClause = authorVoice
    ? `Author's voice and style guide:\n${authorVoice}\n\n`
    : "";

  switch (type) {
    case "excerpt":
      return `${voiceClause}You are an expert copywriter. Generate a compelling 1-2 sentence excerpt (max 160 characters) for the given blog post. Return ONLY the excerpt text, nothing else.`;
    case "titles":
      return `${voiceClause}You are an expert headline writer. Generate 5 compelling alternative titles for the given blog post. Return ONLY a JSON array of strings, e.g. ["Title 1","Title 2"]. No explanation.`;
    case "categories":
      return `You are a content categorisation expert. Suggest 1-3 relevant category names for the given blog post. Return ONLY a JSON array of strings, e.g. ["Category 1"]. Use broad, reusable category names. No explanation.`;
    case "tags": {
      const poolClause = opts.existingTags?.length
        ? `\n\nExisting tag pool (prefer these exact names when relevant, only suggest new tags if no existing tag covers the concept):\n${opts.existingTags.join(", ")}`
        : "";
      return `You are a content tagging expert. Suggest 3-7 specific tags for the given blog post.${poolClause} Return ONLY a JSON array of strings, e.g. ["tag-one","tag-two"]. For existing tags use the exact name provided. For new tags use lowercase, hyphenated slugs. No explanation.`;
    }
    case "aeo":
      return `You are an AEO (Answer Engine Optimisation) expert. Analyse the given blog post and return a JSON object with these exact fields:
- summary: string — 2-3 sentence factual plain-text summary written for AI answer engines, not humans. Cover the main topic, key conclusion, and who this is for. No fluff.
- questions: array of { q: string, a: string } — 3-5 FAQ pairs. Each question must be a genuine search query a reader would type. Each answer must be a complete, standalone sentence (not "See above" or "As mentioned"). Do NOT include questions about the author, the site, or who wrote the post.
- entities: array of { type: string, name: string, description?: string } — named entities that are the subject of the content. Types: Person, Organization, Product, Place, Event, SoftwareApplication, CreativeWork. Only include entities that are explicitly discussed in the post. Do NOT include the post author or the publishing site as entities unless the post is specifically about them. Omit generic concepts.
Return ONLY valid JSON. No markdown fences, no explanation.`;
    case "slug":
      return `You are a URL slug generator. Convert the given post title into a clean, SEO-friendly URL slug: lowercase, words separated by hyphens, no special characters, max 60 characters. Return ONLY the slug string. No explanation.`;
    case "meta-title":
      return `${voiceClause}You are an SEO expert. Generate 3 alternative meta title variants for the given post. Each should be under 60 characters, include a primary keyword, and be optimised for search click-through. Return ONLY a JSON array of objects: [{"title":"...","reasoning":"one sentence why this works"}]. No explanation outside the JSON.`;
    case "headline-variants":
      return `${voiceClause}You are a copywriting expert. Generate two headline variants for the given post: one curiosity-driven (creates intrigue, uses a knowledge gap) and one utility-driven (clearly states the benefit or outcome). Return ONLY a JSON object: {"curiosity":"...","utility":"..."}. No explanation.`;
    case "topic-report":
      return `You are a content analyst. Identify the primary topic of the given post and evaluate how coherently the content covers that topic. Return ONLY a JSON object: {"topic":"primary topic in 3-5 words","score":1-5,"note":"one sentence observation about focus or coherence"}. Score 5 = laser-focused, 1 = scattered. No explanation outside the JSON.`;
    case "reading-level":
      return `${voiceClause}You are a readability expert. Analyse the reading level of the given post content. Return ONLY a JSON object: {"level":"e.g. High School / College / Expert","gradeLevel":number,"note":"one sentence on clarity and pace"}. If an Author's Voice is provided, add a "fit" field: "fits voice" or "too complex" or "too simple". No explanation outside the JSON.`;
    case "tone-check":
      return `${voiceClause}You are a tone and style editor. Analyse the given blog post content against the Author's Voice guide provided above. Identify passages where the tone, vocabulary, or style deviates from the guide. Return ONLY a JSON array of objects:\n[\n  {\n    "quote": "exact passage from the content (20-120 characters)",\n    "issue": "one sentence describing the tone problem",\n    "suggestion": "rewritten version of the passage that matches the voice guide"\n  }\n]\nIf the content already matches the voice guide well, return an empty array []. Return 0-6 items maximum. No markdown fences, no explanation outside the JSON.`;
    case "keywords":
      return `You are an SEO keyword extraction expert. Extract 5-15 specific keywords and key phrases from the given blog post that best describe its content for search engine indexing. Focus on technical terms, product names, methodologies, and specific concepts — not generic filler words. Return ONLY a JSON array of strings, e.g. ["keyword one","keyword two"]. No explanation.`;
    case "site-summary":
      return `You are an AEO (Answer Engine Optimisation) expert. Given a site name and a sample of its published post titles and excerpts, write a 2-4 sentence factual site summary for AI crawlers and llms.txt. The summary must describe: what topics the site covers, who it is for, and what value it provides. Write in third person. Be specific — avoid generic phrases like "covers a wide range of topics". Return ONLY the summary text, nothing else.`;
    case "site-faqs":
      return `You are an AEO expert. Given a site name and a sample of its published post titles, generate 4-6 frequently asked questions a visitor might ask about this site and its subject area. Each answer must be a complete, standalone sentence — no "See above" or "As mentioned". Return ONLY a JSON array: [{"q":"...","a":"..."}]. No markdown fences, no explanation outside the JSON.`;
    case "brief":
      return `${voiceClause}You are an expert content strategist. Generate a structured content brief for a blog post. Return ONLY a JSON object with these exact fields:
{
  "suggestedTitle": "compelling working title",
  "angle": "1-2 sentences: unique hook or perspective that differentiates this post",
  "targetAudience": "specific description of the intended reader",
  "recommendedWordCount": number (e.g. 1200),
  "outline": ["H2: Section title", "H2: Section title", ...] (4-6 sections),
  "keyPoints": ["specific point to cover", ...] (4-6 items),
  "anglesToAvoid": ["competing angle or cliché to avoid", ...] (2-3 items),
  "suggestedExcerpt": "compelling 1-2 sentence excerpt under 160 characters"
}
No markdown fences, no explanation outside the JSON.`;
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ai = await getAiProvider();
  if (!ai) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  const bodySchema = z.object({
    type:         z.string(),
    content:      z.string().max(100_000).optional(),
    postTitle:    z.string().max(500).optional(),
    postId:       z.number().int().positive().optional(),
    audience:     z.string().max(500).optional(),
    keywords:     z.string().max(1000).optional(),
    existingTags: z.array(z.string().max(100)).max(200).optional(),
  });

  const bodyResult = bodySchema.safeParse(await req.json());
  if (!bodyResult.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { content, postTitle, type, postId, audience, keywords, existingTags } = bodyResult.data;
  // slug and brief only need the title; all other types require content
  if (!type || (type !== "slug" && type !== "brief" && !content)) {
    return NextResponse.json({ error: "content and type are required" }, { status: 400 });
  }

  // ── Site-level generation: fetch context server-side ─────────────────────────
  if (type === "site-summary" || type === "site-faqs") {
    const [siteConfig, recentPosts] = await Promise.all([
      getConfig(),
      db
        .select({ title: posts.title, excerpt: posts.excerpt })
        .from(posts)
        .where(and(eq(posts.published, true), eq(posts.type, "post")))
        .orderBy(desc(posts.createdAt))
        .limit(25),
    ]);

    if (recentPosts.length === 0) {
      return NextResponse.json({ error: "No published posts found — publish some content first so the AI has context." }, { status: 422 });
    }

    const siteName = siteConfig.site?.name ?? "this site";
    const postLines = recentPosts
      .map(p => `- "${p.title}"${p.excerpt ? `: ${p.excerpt.slice(0, 120)}` : ""}`)
      .join("\n");

    const systemPrompt = buildSystemPrompt(type, "");
    const userPrompt = `Site name: "${siteName}"\n\nPublished posts:\n${postLines}`;

    try {
      const result = await ai.complete(systemPrompt, userPrompt);
      return NextResponse.json({ result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI request failed";
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  // ── Internal links: fetch post index server-side, build prompt, return ──────
  if (type === "internal-links") {
    // Fetch up to 40 published posts (title, slug, excerpt) excluding the current post
    const conditions = [eq(posts.published, true), eq(posts.type, "post")];
    if (postId) conditions.push(ne(posts.id, postId));

    const allPosts = await db
      .select({ title: posts.title, slug: posts.slug, excerpt: posts.excerpt })
      .from(posts)
      .where(and(...conditions))
      .limit(40);

    if (allPosts.length === 0) {
      return NextResponse.json({ result: "[]" });
    }

    const postsIndex = allPosts
      .map(p => `- "${p.title}" → /post/${p.slug}${p.excerpt ? ` | ${p.excerpt.slice(0, 120)}` : ""}`)
      .join("\n");

    const systemPrompt = `You are an internal linking expert for a blog. Given a post's content and an index of other published posts on the same site, identify 3–5 natural internal linking opportunities.

For each suggestion, identify:
- Which existing post to link to (use its exact slug)
- The best anchor text (2–6 words from the post content that naturally describe the linked topic)
- The context sentence where the link fits (quote the exact sentence from the content)

Return ONLY a JSON array:
[
  {
    "slug": "existing-post-slug",
    "title": "Existing Post Title",
    "anchorText": "natural anchor text",
    "context": "The exact sentence from the content where this link fits naturally."
  }
]

No markdown fences. No explanation outside the JSON. Only suggest posts that are genuinely topically relevant. If fewer than 3 good matches exist, return fewer.`;

    const userPrompt = `Post title: "${postTitle ?? ""}"\n\nPost content:\n${content}\n\n---\nPublished posts index:\n${postsIndex}`;

    try {
      const result = await ai.complete(systemPrompt, userPrompt);
      return NextResponse.json({ result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI request failed";
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  const dbUser = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, String(session.user.id)),
  });
  const authorVoice = dbUser?.authorVoice ?? "";

  const systemPrompt = buildSystemPrompt(type as SuggestType, authorVoice, { existingTags });
  const userPrompt = type === "slug"
    ? `Post title: "${postTitle ?? ""}"`
    : type === "brief"
      ? [
          `Topic: "${postTitle ?? ""}"`,
          audience ? `Target audience: "${audience}"` : "",
          keywords ? `Keywords: "${keywords}"` : "",
        ].filter(Boolean).join("\n")
      : postTitle
        ? `Post title: "${postTitle}"\n\nPost content:\n${content}`
        : `Post content:\n${content}`;

  try {
    const result = await ai.complete(systemPrompt, userPrompt);
    return NextResponse.json({ result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI request failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
