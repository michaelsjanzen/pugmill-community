import type { WidgetDef } from "@/types/widget";

const registry = new Map<string, WidgetDef>();

export function registerWidget(def: WidgetDef): void {
  registry.set(def.id, def);
}

export function getWidget(id: string): WidgetDef | undefined {
  return registry.get(id);
}

export function getAllWidgets(): WidgetDef[] {
  return Array.from(registry.values());
}

export function getWidgetsForArea(areaId: string): WidgetDef[] {
  return getAllWidgets().filter(w => w.areas.includes(areaId));
}
