import { describe, it, expect } from "vitest";
import { sanitizeThemeName } from "@/lib/theme-registry";

describe("sanitizeThemeName", () => {
  it("returns 'default' for a valid allowlisted theme", () => {
    expect(sanitizeThemeName("default")).toBe("default");
  });

  it("returns 'default' for an unknown theme name", () => {
    expect(sanitizeThemeName("hacker-theme")).toBe("default");
  });

  it("strips unsafe characters before checking the allowlist", () => {
    // Uppercase letters are stripped — 'Default' → 'efault', not in allowlist
    expect(sanitizeThemeName("Default")).toBe("default");
  });

  it("returns 'default' for an empty string", () => {
    expect(sanitizeThemeName("")).toBe("default");
  });

  it("strips special characters and path traversal attempts", () => {
    expect(sanitizeThemeName("../../etc/passwd")).toBe("default");
    expect(sanitizeThemeName("<script>alert(1)</script>")).toBe("default");
  });
});
