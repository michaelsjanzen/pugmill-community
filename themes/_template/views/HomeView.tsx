/**
 * HomeView Template
 *
 * Required exports: default HomeView component
 *
 * All props the page route passes to HomeView:
 *
 *   posts          — PostSummary[] (id, title, slug, excerpt, publishedAt,
 *                    featuredImageUrl, categories[], tags[])
 *   layoutConfig   — resolved from active design tokens:
 *                      feedStyle:  "list" | "grid"
 *                      listStyle:  "compact" | "editorial" | "feature" | "text-only"
 *                      columns:    1 | 2 | 3
 *                      gap:        "sm" | "md" | "lg"
 *   heroConfig     — typed hero settings (enabled, imageUrl, headline, etc.)
 *                    see HeroConfig in themes/default/design.ts for the full shape
 *   pagination     — { page: number; totalPages: number }
 *   featuredPost   — first pinned/featured PostSummary, excluded from `posts`
 *
 * See /themes/default/views/HomeView.tsx for a full reference implementation.
 */

import Link from "next/link";
import type { PostSummary } from "../../../src/types";
import type { HomeLayoutConfig } from "../design";

export default function HomeView({
  posts,
  layoutConfig,
  pagination,
  featuredPost,
}: {
  posts: PostSummary[];
  layoutConfig?: HomeLayoutConfig;
  heroConfig?: Record<string, unknown>;
  pagination?: { page: number; totalPages: number };
  featuredPost?: PostSummary;
}) {
  const feedStyle = layoutConfig?.feedStyle ?? "list";
  const listStyle = layoutConfig?.listStyle ?? "compact";
  const gap = layoutConfig?.gap ?? "md";

  // Silence unused-variable warnings for values you haven't wired up yet.
  void feedStyle; void listStyle; void gap;

  return (
    <div>
      {featuredPost && (
        <article>
          <span>Featured</span>
          <Link href={`/post/${featuredPost.slug}`}>
            <h2>{featuredPost.title}</h2>
          </Link>
          {featuredPost.excerpt && <p>{featuredPost.excerpt}</p>}
        </article>
      )}

      {posts.map((post) => (
        <article key={post.id}>
          <Link href={`/post/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          {post.excerpt && <p>{post.excerpt}</p>}
        </article>
      ))}

      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Pagination">
          {pagination.page > 1 && (
            <Link href={pagination.page === 2 ? "/" : `/?page=${pagination.page - 1}`}>Newer</Link>
          )}
          <span>{pagination.page} / {pagination.totalPages}</span>
          {pagination.page < pagination.totalPages && (
            <Link href={`/?page=${pagination.page + 1}`}>Older</Link>
          )}
        </nav>
      )}
    </div>
  );
}
