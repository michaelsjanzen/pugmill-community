import type { WidgetContext } from "@/types/widget";

interface Heading { level: number; text: string; id: string; }

export function extractHeadings(content: string): Heading[] {
  if (!content) return [];
  const headings: Heading[] = [];
  for (const line of content.split("\n")) {
    const match = line.trimEnd().match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;
    const text = match[2].replace(/\*\*?(.+?)\*\*?/g, "$1").replace(/`(.+?)`/g, "$1").trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/^-+|-+$/g, "");
    headings.push({ level: match[1].length, text, id });
  }
  return headings;
}

export async function tocWidget(
  ctx: WidgetContext,
  _settings: Record<string, string>
): Promise<React.ReactNode> {
  const headings = extractHeadings(ctx.content);
  if (headings.length < 2) return null;

  const minLevel = Math.min(...headings.map(h => h.level));

  return (
    <nav aria-label="Table of contents">
      <h3 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
        On this page
      </h3>
      <ul className="space-y-1.5">
        {headings.map((h, i) => (
          <li
            key={i}
            style={{ paddingLeft: `${(h.level - minLevel) * 12}px` }}
          >
            <a
              href={`#${h.id}`}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors leading-snug block"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
