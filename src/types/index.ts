import type { posts, media, settings } from "@/lib/db/schema";

export type Post = typeof posts.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Setting = typeof settings.$inferSelect;

// Lightweight display types used in theme views
export type PostTaxonomy = { name: string; slug: string };

export type PostSummary = {
  id: number;
  type: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date | null;
  featuredImageUrl: string | null;
  categories: PostTaxonomy[];
  tags: PostTaxonomy[];
};
