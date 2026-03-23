import { db } from "@/lib/db";
import { posts, postCategories } from "@/lib/db/schema";
import { desc, and, eq, ne, inArray } from "drizzle-orm";
import Link from "next/link";
import type { WidgetContext } from "@/types/widget";

export async function relatedPostsWidget(
  ctx: WidgetContext,
  settings: Record<string, string>
): Promise<React.ReactNode> {
  const count = Math.min(Math.max(1, Number(settings.count ?? "4")), 10);

  let related: { id: number; title: string; slug: string }[] = [];

  if (ctx.categoryIds.length > 0) {
    // Find posts sharing at least one category, excluding current post
    const joins = await db
      .selectDistinct({ postId: postCategories.postId })
      .from(postCategories)
      .where(
        and(
          inArray(postCategories.categoryId, ctx.categoryIds),
          ne(postCategories.postId, ctx.postId)
        )
      )
      .limit(count * 3); // fetch extras so we can filter to published

    const relatedIds = joins.map(j => j.postId);

    if (relatedIds.length > 0) {
      related = await db
        .select({ id: posts.id, title: posts.title, slug: posts.slug })
        .from(posts)
        .where(and(inArray(posts.id, relatedIds), eq(posts.published, true), eq(posts.type, "post")))
        .orderBy(desc(posts.publishedAt))
        .limit(count);
    }
  }

  // Fall back to recent posts if no related posts found
  if (related.length === 0) {
    related = await db
      .select({ id: posts.id, title: posts.title, slug: posts.slug })
      .from(posts)
      .where(and(eq(posts.published, true), eq(posts.type, "post"), ne(posts.id, ctx.postId)))
      .orderBy(desc(posts.publishedAt))
      .limit(count);
  }

  if (related.length === 0) return null;

  return (
    <nav aria-label="Related posts">
      <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
        Related posts
      </h3>
      <ul className="space-y-2">
        {related.map(post => (
          <li key={post.id}>
            <Link
              href={`/post/${post.slug}`}
              className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors leading-snug block"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
