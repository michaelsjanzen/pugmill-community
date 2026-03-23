import { getWidget } from "@/lib/widget-registry";
import { getWidgetSettingsBulk } from "@/lib/actions/widgets";
import type { WidgetContext } from "@/types/widget";

interface Props {
  /** Ordered widget IDs to render — parsed from the design config comma string. */
  widgetIds: string[];
  context: WidgetContext;
}

/**
 * Async server component that renders an ordered list of widgets for a named area.
 * Unknown widget IDs (e.g. from a disabled plugin) are silently skipped.
 * Widget render errors are caught and suppressed so one broken widget
 * doesn't prevent the rest of the page from loading.
 */
export default async function WidgetArea({ widgetIds, context }: Props) {
  if (widgetIds.length === 0) return null;

  const settingsMap = await getWidgetSettingsBulk(widgetIds);

  const rendered = await Promise.all(
    widgetIds.map(async (id) => {
      const widget = getWidget(id);
      if (!widget) return null;
      const settings = settingsMap[id] ?? {};
      try {
        const node = await widget.component(context, settings);
        return node ? { id, node } : null;
      } catch (err) {
        console.error(`[WidgetArea] Widget "${id}" threw:`, err);
        return null;
      }
    })
  );

  const items = rendered.filter(
    (r): r is NonNullable<typeof r> => r !== null
  );
  if (items.length === 0) return null;

  return (
    <div className="space-y-6">
      {items.map(({ id, node }) => (
        <div key={id}>{node}</div>
      ))}
    </div>
  );
}

/** Parse a comma-separated design config value into an ordered widget ID array. */
export function parseWidgetIds(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(",").map(s => s.trim()).filter(Boolean);
}
