import { db } from "@/lib/db";
import { posts, categories, tags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const [publishedPosts, allCategories, allTags] = await Promise.all([
    db.select({ slug: posts.slug, updatedAt: posts.updatedAt, type: posts.type })
      .from(posts)
      .where(eq(posts.published, true)),
    db.select({ slug: categories.slug, createdAt: categories.createdAt }).from(categories),
    db.select({ slug: tags.slug, createdAt: tags.createdAt }).from(tags),
  ]);

  const postEntries: MetadataRoute.Sitemap = publishedPosts.map(post => ({
    url: `${siteUrl}/post/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: post.type === "page" ? "monthly" : "weekly",
    priority: post.type === "page" ? 0.8 : 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = allCategories.map(cat => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: cat.createdAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const tagEntries: MetadataRoute.Sitemap = allTags.map(tag => ({
    url: `${siteUrl}/tag/${tag.slug}`,
    lastModified: tag.createdAt,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
  ];

  return [...staticRoutes, ...postEntries, ...categoryEntries, ...tagEntries];
}
