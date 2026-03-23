/**
 * Integration tests for the design draft/publish/discard server actions.
 * Runs against the real dev database using a __test__ theme ID that is
 * cleaned up before and after every test so real design data is never touched.
 */

import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";

// ─── Mock Next.js / app internals that can't run outside the Next.js runtime ──

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("next/cache",      () => ({ revalidatePath: vi.fn() }));

vi.mock("@/lib/get-current-user", () => ({
  getCurrentUser: vi.fn().mockResolvedValue({ id: "test-user-id", role: "admin" }),
}));

vi.mock("@/lib/config", () => ({
  getConfig: vi.fn().mockResolvedValue({
    appearance: { activeTheme: "__test__" },
    site: { name: "Test" },
  }),
}));

vi.mock("@/lib/audit-log", () => ({ auditLog: vi.fn() }));

// sanitizeThemeName normally validates against an allowlist — bypass for test isolation
vi.mock("@/lib/theme-registry", () => ({
  sanitizeThemeName: vi.fn().mockReturnValue("__test__"),
  getAllThemes: vi.fn().mockReturnValue([]),
}));

// loadThemeDesignDefs reads theme files — return empty defs so publish logic still runs
vi.mock("@/lib/design-config", () => ({
  invalidateDesignCache: vi.fn(),
  loadThemeDesignDefs: vi.fn().mockReturnValue({
    DESIGN_TOKEN_DEFS: [],
    DESIGN_DEFAULTS: {},
    SANS_FONTS: [],
    MONO_FONTS: [],
  }),
  getDesignConfig: vi.fn(),
  hasDraftConfig: vi.fn(),
}));

vi.mock("@/lib/widget-schema", () => ({
  ensureWidgetSettingsSchema: vi.fn().mockResolvedValue(undefined),
}));

// ─── Real DB imports (hit the actual dev database) ────────────────────────────

import { db } from "@/lib/db";
import { themeDesignConfigs, widgetSettings } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import {
  saveDesignDraft,
  publishDesign,
  discardDraft,
  savePartialDesignDraft,
  saveWidgetAreaDraft,
} from "@/lib/actions/design";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const THEME     = "__test__";
const TEST_AREA = "__test-area__";

async function getDraft() {
  const rows = await db.select().from(themeDesignConfigs)
    .where(and(eq(themeDesignConfigs.themeId, THEME), eq(themeDesignConfigs.status, "draft")));
  return rows[0] ?? null;
}

async function getPublished() {
  const rows = await db.select().from(themeDesignConfigs)
    .where(and(eq(themeDesignConfigs.themeId, THEME), eq(themeDesignConfigs.status, "published")));
  return rows[0] ?? null;
}

async function getArchived() {
  return db.select().from(themeDesignConfigs)
    .where(and(eq(themeDesignConfigs.themeId, THEME), eq(themeDesignConfigs.status, "archived")));
}

async function getWidgetSetting(areaId: string) {
  const rows = await db.select().from(widgetSettings)
    .where(and(eq(widgetSettings.widgetId, `area:${areaId}`), eq(widgetSettings.key, "widgets")));
  return rows[0]?.value ?? null;
}

async function cleanup() {
  await db.delete(themeDesignConfigs).where(eq(themeDesignConfigs.themeId, THEME));
  await db.delete(widgetSettings).where(eq(widgetSettings.widgetId, `area:${TEST_AREA}`));
}

beforeEach(cleanup);
afterAll(cleanup);

// ─── saveDesignDraft ──────────────────────────────────────────────────────────

describe("saveDesignDraft", () => {
  it("creates a draft row from FormData", async () => {
    const fd = new FormData();
    fd.set("colorBackground", "#ff0000");
    fd.set("homeFeedStyle", "grid");

    await saveDesignDraft(fd);

    const draft = await getDraft();
    expect(draft).not.toBeNull();
    const config = draft!.config as Record<string, string>;
    expect(config.colorBackground).toBe("#ff0000");
    expect(config.homeFeedStyle).toBe("grid");
  });

  it("merges into an existing draft without clobbering unrelated keys", async () => {
    await db.insert(themeDesignConfigs).values({
      themeId: THEME, status: "draft",
      config: { colorBackground: "#000000", fontSans: "Inter" },
    } as typeof themeDesignConfigs.$inferInsert);

    const fd = new FormData();
    fd.set("colorBackground", "#ffffff");
    await saveDesignDraft(fd);

    const config = (await getDraft())!.config as Record<string, string>;
    expect(config.colorBackground).toBe("#ffffff"); // updated
    expect(config.fontSans).toBe("Inter");          // preserved
  });

  it("strips Next.js internal form keys ($ACTION_, _)", async () => {
    const fd = new FormData();
    fd.set("$ACTION_ID_abc", "internal");
    fd.set("_nextAction", "internal");
    fd.set("colorBackground", "#123456");
    await saveDesignDraft(fd);

    const config = (await getDraft())!.config as Record<string, string>;
    expect(config.colorBackground).toBe("#123456");
    expect(config["$ACTION_ID_abc"]).toBeUndefined();
    expect(config["_nextAction"]).toBeUndefined();
  });
});

// ─── savePartialDesignDraft ───────────────────────────────────────────────────

describe("savePartialDesignDraft", () => {
  it("creates a draft from a plain object", async () => {
    await savePartialDesignDraft({ homeFeedStyle: "grid", homeGap: "lg" });

    const config = (await getDraft())!.config as Record<string, string>;
    expect(config.homeFeedStyle).toBe("grid");
    expect(config.homeGap).toBe("lg");
  });

  it("merges into existing draft without clobbering unrelated keys", async () => {
    await db.insert(themeDesignConfigs).values({
      themeId: THEME, status: "draft",
      config: { colorBackground: "#000000" },
    } as typeof themeDesignConfigs.$inferInsert);

    await savePartialDesignDraft({ homeFeedStyle: "grid" });

    const config = (await getDraft())!.config as Record<string, string>;
    expect(config.colorBackground).toBe("#000000"); // preserved
    expect(config.homeFeedStyle).toBe("grid");      // added
  });
});

// ─── publishDesign ────────────────────────────────────────────────────────────

describe("publishDesign", () => {
  it("promotes draft to published and removes the draft row", async () => {
    await db.insert(themeDesignConfigs).values({
      themeId: THEME, status: "draft",
      config: { colorBackground: "#ff0000" },
    } as typeof themeDesignConfigs.$inferInsert);

    await publishDesign();

    expect(await getDraft()).toBeNull();
    const published = await getPublished();
    expect(published).not.toBeNull();
    expect((published!.config as Record<string, string>).colorBackground).toBe("#ff0000");
  });

  it("archives the existing published row when promoting a draft", async () => {
    await db.insert(themeDesignConfigs).values([
      { themeId: THEME, status: "published", config: { colorBackground: "#old" } },
      { themeId: THEME, status: "draft",     config: { colorBackground: "#new" } },
    ] as typeof themeDesignConfigs.$inferInsert[]);

    await publishDesign();

    const published = await getPublished();
    expect((published!.config as Record<string, string>).colorBackground).toBe("#new");

    const archived = await getArchived();
    expect(archived.length).toBe(1);
    expect((archived[0].config as Record<string, string>).colorBackground).toBe("#old");
  });

  it("draft values take precedence over published values on promotion", async () => {
    await db.insert(themeDesignConfigs).values([
      { themeId: THEME, status: "published", config: { colorBackground: "#pub", fontSans: "Inter" } },
      { themeId: THEME, status: "draft",     config: { colorBackground: "#draft" } },
    ] as typeof themeDesignConfigs.$inferInsert[]);

    await publishDesign();

    const config = (await getPublished())!.config as Record<string, string>;
    expect(config.colorBackground).toBe("#draft"); // draft wins
    expect(config.fontSans).toBe("Inter");          // published key not in draft is preserved
  });

  it("preserves all published keys not present in the draft (regression: layout settings)", async () => {
    // Bug: publishDesign previously only preserved 'immediatePublish' structural keys
    // from the old published config. Non-structural keys (homeFeedStyle, blogFeedStyle,
    // homeColumns, etc.) were silently dropped when a draft that didn't touch those
    // sections was published. This test locks in the correct behaviour.
    await db.insert(themeDesignConfigs).values([
      {
        themeId: THEME, status: "published",
        config: { homeFeedStyle: "grid", homeColumns: "3", colorBackground: "#pub" },
      },
      {
        themeId: THEME, status: "draft",
        config: { colorBackground: "#new" }, // user only changed a colour — layout untouched
      },
    ] as typeof themeDesignConfigs.$inferInsert[]);

    await publishDesign();

    const config = (await getPublished())!.config as Record<string, string>;
    expect(config.colorBackground).toBe("#new");   // draft wins
    expect(config.homeFeedStyle).toBe("grid");     // layout key preserved from old published
    expect(config.homeColumns).toBe("3");           // layout key preserved from old published
  });

  it("does nothing when no draft exists", async () => {
    await expect(publishDesign()).resolves.not.toThrow();
    expect(await getPublished()).toBeNull();
  });

  it("flushes widgetArea keys to widget_settings on publish", async () => {
    await db.insert(themeDesignConfigs).values({
      themeId: THEME, status: "draft",
      config: { [`widgetArea:${TEST_AREA}`]: "recent-posts,tag-cloud" },
    } as typeof themeDesignConfigs.$inferInsert);

    await publishDesign();

    expect(await getWidgetSetting(TEST_AREA)).toBe("recent-posts,tag-cloud");
  });

  it("does not flush widget_settings when draft has no widgetArea keys", async () => {
    await db.insert(themeDesignConfigs).values({
      themeId: THEME, status: "draft",
      config: { colorBackground: "#ffffff" },
    } as typeof themeDesignConfigs.$inferInsert);

    await publishDesign();

    expect(await getWidgetSetting(TEST_AREA)).toBeNull();
  });
});

// ─── discardDraft ─────────────────────────────────────────────────────────────

describe("discardDraft", () => {
  it("deletes the draft row", async () => {
    await db.insert(themeDesignConfigs).values({
      themeId: THEME, status: "draft",
      config: { colorBackground: "#ff0000" },
    } as typeof themeDesignConfigs.$inferInsert);

    await discardDraft();

    expect(await getDraft()).toBeNull();
  });

  it("does not affect the published row", async () => {
    await db.insert(themeDesignConfigs).values([
      { themeId: THEME, status: "published", config: { colorBackground: "#pub" } },
      { themeId: THEME, status: "draft",     config: { colorBackground: "#draft" } },
    ] as typeof themeDesignConfigs.$inferInsert[]);

    await discardDraft();

    const published = await getPublished();
    expect(published).not.toBeNull();
    expect((published!.config as Record<string, string>).colorBackground).toBe("#pub");
  });

  it("no-ops cleanly when no draft exists", async () => {
    await expect(discardDraft()).resolves.not.toThrow();
  });
});

// ─── saveWidgetAreaDraft ──────────────────────────────────────────────────────

describe("saveWidgetAreaDraft", () => {
  it("stores widget area assignment as a widgetArea: key in the draft", async () => {
    await saveWidgetAreaDraft(TEST_AREA, ["recent-posts", "tag-cloud"]);

    const config = (await getDraft())!.config as Record<string, string>;
    expect(config[`widgetArea:${TEST_AREA}`]).toBe("recent-posts,tag-cloud");
  });

  it("merges widget area into existing draft without clobbering other keys", async () => {
    await db.insert(themeDesignConfigs).values({
      themeId: THEME, status: "draft",
      config: { colorBackground: "#000000" },
    } as typeof themeDesignConfigs.$inferInsert);

    await saveWidgetAreaDraft(TEST_AREA, ["recent-posts"]);

    const config = (await getDraft())!.config as Record<string, string>;
    expect(config.colorBackground).toBe("#000000");
    expect(config[`widgetArea:${TEST_AREA}`]).toBe("recent-posts");
  });

  it("stores an empty widget list as an empty string", async () => {
    await saveWidgetAreaDraft(TEST_AREA, []);

    const config = (await getDraft())!.config as Record<string, string>;
    expect(config[`widgetArea:${TEST_AREA}`]).toBe("");
  });

  it("publish after saveWidgetAreaDraft correctly flushes to widget_settings", async () => {
    await saveWidgetAreaDraft(TEST_AREA, ["recent-posts", "tag-cloud"]);
    await publishDesign();

    expect(await getDraft()).toBeNull();
    expect(await getWidgetSetting(TEST_AREA)).toBe("recent-posts,tag-cloud");
  });
});
