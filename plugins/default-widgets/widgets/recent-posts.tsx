import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, and, eq, ne } from "drizzle-orm";
import Link from "next/link";
import type { WidgetContext } from "@/types/widget";

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export async function recentPostsWidget(
  ctx: WidgetContext,
  settings: Record<string, string>
): Promise<React.ReactNode> {
  const count = Math.min(Math.max(1, Number(settings.count ?? "5")), 20);

  const recent = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug, publishedAt: posts.publishedAt })
    .from(posts)
    .where(and(eq(posts.published, true), eq(posts.type, "post"), ne(posts.id, ctx.postId)))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(count);

  if (recent.length === 0) return null;

  return (
    <nav aria-label="Recent posts">
      <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
        Recent posts
      </h3>
      <ul className="space-y-3">
        {recent.map(post => (
          <li key={post.id}>
            <Link
              href={`/post/${post.slug}`}
              className="text-sm text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors leading-snug block"
            >
              {post.title}
            </Link>
            {post.publishedAt && (
              <span className="text-xs text-[var(--color-muted)]">{formatDate(post.publishedAt)}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
