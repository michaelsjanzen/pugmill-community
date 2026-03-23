/**
 * Tests for the design config merge logic.
 *
 * The merge order is: theme defaults → published overrides → draft overrides.
 * Each layer only overwrites keys it explicitly sets.
 */
import { describe, it, expect } from "vitest";

// Mirror of the merge logic in getDesignConfig (src/lib/design-config.ts)
function mergeDesignConfig(
  defaults: Record<string, string>,
  published: Record<string, string> | null,
  draft: Record<string, string> | null,
  mode: "published" | "draft"
): Record<string, string> {
  const merged = { ...defaults, ...(published ?? {}) };
  if (mode === "draft" && draft) {
    Object.assign(merged, draft);
  }
  return merged;
}

const DEFAULTS = {
  colorBackground: "#ffffff",
  colorForeground: "#000000",
  homeFeedStyle: "list",
  homeListStyle: "compact",
};

describe("design config merging", () => {
  it("returns defaults when no overrides exist", () => {
    const result = mergeDesignConfig(DEFAULTS, null, null, "published");
    expect(result).toEqual(DEFAULTS);
  });

  it("published overrides take precedence over defaults", () => {
    const result = mergeDesignConfig(
      DEFAULTS,
      { colorBackground: "#111111" },
      null,
      "published"
    );
    expect(result.colorBackground).toBe("#111111");
    expect(result.colorForeground).toBe("#000000"); // default unchanged
  });

  it("draft overrides take precedence over published in draft mode", () => {
    const result = mergeDesignConfig(
      DEFAULTS,
      { homeFeedStyle: "grid" },
      { homeFeedStyle: "list" },
      "draft"
    );
    expect(result.homeFeedStyle).toBe("list"); // draft wins
  });

  it("draft overrides are ignored in published mode", () => {
    const result = mergeDesignConfig(
      DEFAULTS,
      { homeFeedStyle: "grid" },
      { homeFeedStyle: "list" },
      "published"
    );
    expect(result.homeFeedStyle).toBe("grid"); // published wins, draft ignored
  });

  it("draft can add new keys not present in published", () => {
    const result = mergeDesignConfig(
      DEFAULTS,
      {},
      { homeListStyle: "editorial" },
      "draft"
    );
    expect(result.homeListStyle).toBe("editorial");
  });

  it("null draft in draft mode falls back to published", () => {
    const result = mergeDesignConfig(
      DEFAULTS,
      { homeFeedStyle: "grid" },
      null,
      "draft"
    );
    expect(result.homeFeedStyle).toBe("grid");
  });

  it("all three layers merge correctly without clobbering unrelated keys", () => {
    const result = mergeDesignConfig(
      DEFAULTS,
      { colorBackground: "#111111" },
      { homeFeedStyle: "grid" },
      "draft"
    );
    expect(result.colorBackground).toBe("#111111");   // from published
    expect(result.homeFeedStyle).toBe("grid");         // from draft
    expect(result.colorForeground).toBe("#000000");    // from defaults
    expect(result.homeListStyle).toBe("compact");      // from defaults
  });
});
