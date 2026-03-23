// STUB: Copy and implement this file in your theme.
// See /themes/default/views/PageView.tsx for a full reference implementation.

import type { ArticleLayoutConfig } from "../design";

export interface Breadcrumb {
  title: string;
  slug: string;
}

export interface PageViewProps {
  title: string;
  content: string;
  breadcrumbs: Breadcrumb[];
  layoutConfig?: ArticleLayoutConfig;
  siblingPages?: { title: string; slug: string }[];
}

export default function PageView({ title, content }: PageViewProps) {
  return (
    <article>
      <h1>{title}</h1>
      <div>{content}</div>
    </article>
  );
}
