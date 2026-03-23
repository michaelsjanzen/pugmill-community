import { describe, it, expect, vi } from "vitest";

// WidgetArea imports next-auth (via get-current-user) which references next/server —
// not resolvable outside the Next.js runtime. Mock the offending action module.
vi.mock("@/lib/actions/widgets", () => ({
  getWidgetSettingsBulk: vi.fn().mockResolvedValue({}),
}));

import { parseWidgetIds } from "@/components/widgets/WidgetArea";

describe("parseWidgetIds", () => {
  it("parses a comma-separated string into an array", () => {
    expect(parseWidgetIds("recent-posts,tag-cloud")).toEqual(["recent-posts", "tag-cloud"]);
  });

  it("trims whitespace around widget IDs", () => {
    expect(parseWidgetIds(" recent-posts , tag-cloud ")).toEqual(["recent-posts", "tag-cloud"]);
  });

  it("filters out empty segments from double commas", () => {
    expect(parseWidgetIds("recent-posts,,tag-cloud")).toEqual(["recent-posts", "tag-cloud"]);
  });

  it("returns empty array for undefined", () => {
    expect(parseWidgetIds(undefined)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseWidgetIds("")).toEqual([]);
  });

  it("returns a single-element array for one widget", () => {
    expect(parseWidgetIds("recent-posts")).toEqual(["recent-posts"]);
  });
});
