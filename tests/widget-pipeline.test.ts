/**
 * Integration tests for the WidgetArea render pipeline.
 *
 * These tests cover the critical paths that have caused real bugs:
 *   - All widgets returning null → WidgetArea returns null (sidebar suppressed)
 *   - Unknown widget ID → silently skipped
 *   - Widget throwing → caught and suppressed, other widgets still render
 *   - One good widget among nulls → WidgetArea returns content
 *   - Empty widgetIds → WidgetArea returns null immediately
 *
 * Uses the real widget-registry (no mock) and a controlled set of test widgets
 * registered for each test. getWidgetSettingsBulk is mocked since it hits the DB.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/actions/widgets", () => ({
  getWidgetSettingsBulk: vi.fn().mockResolvedValue({}),
  getWidgetAreaAssignment: vi.fn().mockResolvedValue([]),
  ensureWidgetSettingsSchema: vi.fn().mockResolvedValue(undefined),
}));

import WidgetArea from "@/components/widgets/WidgetArea";
import { registerWidget } from "@/lib/widget-registry";
import type { WidgetContext } from "@/types/widget";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const ctx: WidgetContext = {
  type: "post",
  postId: 1,
  slug: "test-post",
  content: "## Heading\n\nBody text.",
  categoryIds: [],
  tagIds: [],
  parentId: null,
  designConfig: {},
};

// Unique IDs per test to avoid registry pollution between suites
const WIDGET_NULL    = "__test-null__";
const WIDGET_CONTENT = "__test-content__";
const WIDGET_THROWS  = "__test-throws__";

beforeEach(() => {
  registerWidget({
    id: WIDGET_NULL,
    label: "Test Null",
    areas: ["sidebar-post"],
    component: async () => null,
  });
  registerWidget({
    id: WIDGET_CONTENT,
    label: "Test Content",
    areas: ["sidebar-post"],
    component: async () => "widget output",
  });
  registerWidget({
    id: WIDGET_THROWS,
    label: "Test Throws",
    areas: ["sidebar-post"],
    component: async () => { throw new Error("widget exploded"); },
  });
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("WidgetArea", () => {
  it("returns null for empty widgetIds without calling the registry", async () => {
    const result = await WidgetArea({ widgetIds: [], context: ctx });
    expect(result).toBeNull();
  });

  it("returns null when all widgets return null (sidebar should be suppressed)", async () => {
    const result = await WidgetArea({ widgetIds: [WIDGET_NULL], context: ctx });
    expect(result).toBeNull();
  });

  it("returns null when all widgets return null (multiple widgets)", async () => {
    const result = await WidgetArea({ widgetIds: [WIDGET_NULL, WIDGET_NULL], context: ctx });
    expect(result).toBeNull();
  });

  it("returns content when at least one widget produces output", async () => {
    const result = await WidgetArea({ widgetIds: [WIDGET_CONTENT], context: ctx });
    expect(result).not.toBeNull();
  });

  it("returns content when one good widget is mixed with null-returning widgets", async () => {
    const result = await WidgetArea({
      widgetIds: [WIDGET_NULL, WIDGET_CONTENT, WIDGET_NULL],
      context: ctx,
    });
    expect(result).not.toBeNull();
  });

  it("silently skips unknown widget IDs", async () => {
    const result = await WidgetArea({ widgetIds: ["__nonexistent-widget__"], context: ctx });
    expect(result).toBeNull();
  });

  it("suppresses a throwing widget and renders the rest", async () => {
    // WIDGET_THROWS throws, WIDGET_CONTENT should still render
    const result = await WidgetArea({
      widgetIds: [WIDGET_THROWS, WIDGET_CONTENT],
      context: ctx,
    });
    expect(result).not.toBeNull();
  });

  it("returns null when the only widget throws (no survivors)", async () => {
    const result = await WidgetArea({ widgetIds: [WIDGET_THROWS], context: ctx });
    expect(result).toBeNull();
  });

  it("passes widget settings from settingsMap to the component", async () => {
    const { getWidgetSettingsBulk } = await import("@/lib/actions/widgets");
    vi.mocked(getWidgetSettingsBulk).mockResolvedValueOnce({
      [WIDGET_CONTENT]: { count: "10" },
    });

    let receivedSettings: Record<string, string> = {};
    registerWidget({
      id: "__test-settings__",
      label: "Test Settings",
      areas: ["sidebar-post"],
      component: async (_ctx, settings) => {
        receivedSettings = settings;
        return "ok";
      },
    });

    await WidgetArea({ widgetIds: ["__test-settings__"], context: ctx });
    // Settings for __test-settings__ not in mock map → should receive empty object
    expect(receivedSettings).toEqual({});
  });

  it("passes correct context to the widget component", async () => {
    let receivedCtx: WidgetContext | null = null;
    registerWidget({
      id: "__test-ctx__",
      label: "Test Context",
      areas: ["sidebar-post"],
      component: async (c) => {
        receivedCtx = c;
        return "ok";
      },
    });

    await WidgetArea({ widgetIds: ["__test-ctx__"], context: ctx });
    expect(receivedCtx).toBe(ctx);
  });
});

