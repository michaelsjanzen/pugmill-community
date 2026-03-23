import { db } from "@/lib/db";
import { categories, postCategories, posts } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import Link from "next/link";
import type { WidgetContext } from "@/types/widget";

export async function categoriesWidget(
  _ctx: WidgetContext,
  _settings: Record<string, string>
): Promise<React.ReactNode> {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      count: sql<number>`count(${postCategories.postId})::int`,
    })
    .from(categories)
    .leftJoin(postCategories, eq(postCategories.categoryId, categories.id))
    .leftJoin(posts, and(eq(posts.id, postCategories.postId), eq(posts.published, true), eq(posts.type, "post")))
    .groupBy(categories.id, categories.name, categories.slug)
    .orderBy(categories.name);

  const nonEmpty = rows.filter(r => r.count > 0);
  if (nonEmpty.length === 0) return null;

  return (
    <nav aria-label="Categories">
      <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
        Categories
      </h3>
      <ul className="space-y-1.5">
        {nonEmpty.map(cat => (
          <li key={cat.id} className="flex items-center justify-between gap-2">
            <Link
              href={`/category/${cat.slug}`}
              className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
            >
              {cat.name}
            </Link>
            <span className="text-xs text-[var(--color-muted)] tabular-nums shrink-0">
              {cat.count}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
