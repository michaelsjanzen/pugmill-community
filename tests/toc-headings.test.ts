/**
 * Unit tests for the TOC widget's extractHeadings helper.
 *
 * Covers:
 *  - Normal markdown headings
 *  - Windows \r\n line endings (content stored via Tiptap on Windows)
 *  - Null/empty content guard
 *  - Inline markdown stripped from heading text
 *  - Heading ID generation
 */
import { describe, it, expect } from "vitest";
import { extractHeadings } from "../plugins/default-widgets/widgets/toc";

describe("extractHeadings", () => {
  it("returns empty array for empty string", () => {
    expect(extractHeadings("")).toEqual([]);
  });

  it("returns empty array for null-ish content (defensive guard)", () => {
    // The function accepts string but runtime content could be empty
    expect(extractHeadings("")).toEqual([]);
  });

  it("extracts h1 and h2 headings from plain markdown", () => {
    const content = "# Title\n\nSome text.\n\n## Section One\n\nMore text.\n\n## Section Two\n";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(3);
    expect(headings[0]).toMatchObject({ level: 1, text: "Title" });
    expect(headings[1]).toMatchObject({ level: 2, text: "Section One" });
    expect(headings[2]).toMatchObject({ level: 2, text: "Section Two" });
  });

  it("handles Windows \\r\\n line endings correctly", () => {
    const content = "# About Pugmill\r\n\r\nSome text.\r\n\r\n## What Pugmill Is\r\n\r\n## Who It's For\r\n\r\n## Getting Started\r\n";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(4);
    expect(headings[0]).toMatchObject({ level: 1, text: "About Pugmill" });
    expect(headings[1]).toMatchObject({ level: 2, text: "What Pugmill Is" });
    expect(headings[2]).toMatchObject({ level: 2, text: "Who It's For" });
    expect(headings[3]).toMatchObject({ level: 2, text: "Getting Started" });
  });

  it("strips trailing \\r from heading text", () => {
    const headings = extractHeadings("## Hello World\r\n");
    expect(headings[0].text).toBe("Hello World");
  });

  it("strips bold markdown from heading text", () => {
    const headings = extractHeadings("## **Important** Section\n");
    expect(headings[0].text).toBe("Important Section");
  });

  it("strips inline code from heading text", () => {
    const headings = extractHeadings("## Using `npm install`\n");
    expect(headings[0].text).toBe("Using npm install");
  });

  it("generates a slug-style id from heading text", () => {
    const headings = extractHeadings("## What Pugmill Is\n");
    expect(headings[0].id).toBe("what-pugmill-is");
  });

  it("generates id from heading with apostrophe", () => {
    const headings = extractHeadings("## Who It's For\n");
    // apostrophe is stripped by [^\w\s-], leaving "Who Its For" → "who-its-for"
    expect(headings[0].id).toBe("who-its-for");
  });

  it("supports all heading levels h1–h6", () => {
    const content = "# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6\n";
    const headings = extractHeadings(content);
    expect(headings.map(h => h.level)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("ignores lines that are not headings", () => {
    const content = "Some paragraph.\n\nAnother line.\n\n## Real Heading\n";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0].text).toBe("Real Heading");
  });

  it("does not match a # that is not at the start of a line", () => {
    const content = "This has a # in the middle\n\n## Real Heading\n";
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
  });

  it("returns empty array for content with no headings", () => {
    const content = "Just a paragraph.\n\nAnother paragraph.\n";
    expect(extractHeadings(content)).toHaveLength(0);
  });
});
