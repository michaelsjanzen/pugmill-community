import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import type { WidgetContext } from "@/types/widget";

export async function childPagesWidget(
  ctx: WidgetContext,
  _settings: Record<string, string>
): Promise<React.ReactNode> {
  const children = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug })
    .from(posts)
    .where(
      and(
        eq(posts.parentId, ctx.postId),
        eq(posts.type, "page"),
        eq(posts.published, true)
      )
    )
    .orderBy(posts.title);

  if (children.length === 0) return null;

  return (
    <nav aria-label="Sub-pages">
      <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
        Sub-pages
      </h3>
      <ul className="space-y-1">
        {children.map(page => (
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
