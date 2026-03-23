// STUB: Copy and implement this file in your theme.
// See /themes/default/views/PostView.tsx for a full reference implementation.

import type { ArticleLayoutConfig } from "../design";

export interface PostTaxonomy { name: string; slug: string }

export interface PostViewProps {
  title: string;
  excerpt?: string | null;
  content: string;
  publishedAt: Date | null;
  featuredImageUrl?: string | null;
  categories: PostTaxonomy[];
  tags: PostTaxonomy[];
  aeoMetadata: unknown;
  layoutConfig?: ArticleLayoutConfig;
}

export default function PostView({ title, content }: PostViewProps) {
  return (
    <article>
      <h1>{title}</h1>
      <div>{content}</div>
    </article>
  );
}
