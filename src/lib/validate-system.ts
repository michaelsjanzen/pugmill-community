import { THEME_ALLOWLIST } from "@/lib/theme-registry";
import { validateThemeModules } from "@/lib/theme-modules";

/**
 * Validates critical system invariants at cold-start time.
 * Throws a descriptive error if any invariant is violated.
 *
 * Checks:
 * - The 'default' theme must exist in THEME_ALLOWLIST.
 *   (The default theme is the fallback; removing it breaks theme loading.)
 * - Every theme in THEME_ALLOWLIST must have a complete entry in THEME_MODULES,
 *   including all required view components and design module exports.
 *   (Catches partial installs where a theme was added to the allowlist but
 *   theme-modules.ts was not fully updated.)
 */
export function validateSystem(): void {
  if (!(THEME_ALLOWLIST as readonly string[]).includes("default")) {
    throw new Error(
      "[Pugmill] FATAL: The 'default' theme is missing from THEME_ALLOWLIST. " +
        "The default theme is required as the system fallback and must never be removed. " +
        "Re-add it to THEME_ALLOWLIST in src/lib/theme-registry.ts."
    );
  }

  const themeErrors = validateThemeModules(THEME_ALLOWLIST);
  if (themeErrors.length > 0) {
    throw new Error(
      "[Pugmill] FATAL: Theme module validation failed:\n" +
        themeErrors.map(e => `  - ${e}`).join("\n") +
        "\nSee THEME_AUTHORING.md for the installation contract."
    );
  }
}
