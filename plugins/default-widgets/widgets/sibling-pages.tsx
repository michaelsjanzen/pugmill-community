import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { and, eq, ne } from "drizzle-orm";
import Link from "next/link";
import type { WidgetContext } from "@/types/widget";

export async function siblingPagesWidget(
  ctx: WidgetContext,
  _settings: Record<string, string>
): Promise<React.ReactNode> {
  if (ctx.parentId === null) return null;

  const siblings = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug })
    .from(posts)
    .where(
      and(
        eq(posts.parentId, ctx.parentId),
        eq(posts.type, "page"),
        eq(posts.published, true),
        ne(posts.id, ctx.postId)
      )
    )
    .orderBy(posts.title);

  if (siblings.length === 0) return null;

  return (
    <nav aria-label="In this section">
      <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
        In this section
      </h3>
      <ul className="space-y-1">
        {siblings.map(page => (
          <li key={page.id}>
            <Link
              href={`/${page.slug}`}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] px-2 py-1 rounded-md hover:bg-[var(--color-surface)] transition block"
            >
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
