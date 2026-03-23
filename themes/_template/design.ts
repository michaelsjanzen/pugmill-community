// PUGMILL_DESIGN_CONTRACT
// ============================================================
// This file defines the design system contract for your theme.
// Copy it to /themes/<your-theme-id>/design.ts and customize
// it to match your theme's visual language.
//
// Read THEMES.md at the repo root before editing this file.
//
// Required exports (the Design admin will not work without them):
//
//   DESIGN_TOKEN_DEFS: DesignTokenDef[]    — all design token definitions
//   DESIGN_DEFAULTS: Record<string,string>  — default value for each token key
//   SANS_FONTS: string[]                    — curated sans-serif Google Fonts
//   MONO_FONTS: string[]                    — curated monospace Google Fonts
//   HomeLayoutConfig                        — type for homepage layout options
//   ArticleLayoutConfig                     — type for post/page layout options
//   buildGoogleFontsUrl(config)             — returns Google Fonts URL or null
//   buildCssString(config, defs)            — returns :root { ... } CSS block
//
// The admin loads this file at runtime via:
//   import(`../../themes/${themeId}/design`)
//
// IMPORTANT: The 'default' theme is reserved as the system fallback.
// Never remove it from THEME_ALLOWLIST in src/lib/theme-registry.ts.
// ============================================================

import type { DesignTokenDef } from "../../src/types/design";

// ─── Layout config types ──────────────────────────────────────────────────────
// These are passed as props to HomeView, PostView, and PageView.
// Keep these types in sync with your token definitions below.

export interface HomeLayoutConfig {
  feedStyle: "list" | "grid";
  listStyle: "compact" | "editorial" | "feature" | "text-only";
  columns: 1 | 2 | 3;
  gap: "sm" | "md" | "lg";
}

export interface ArticleLayoutConfig {
  contentWidth: "narrow" | "medium" | "wide";
  sidebar: "none" | "left" | "right";
}

// ─── Font allowlists ──────────────────────────────────────────────────────────
// List every Google Font your theme supports. The Typography admin renders
// these as dropdown options. Only fonts in these lists will be fetched from
// Google Fonts — everything else is treated as a system font.
//
// Curate this list to match your theme's personality. A minimal theme might
// offer just 2–3 fonts. A versatile theme might offer 10+.

export const SANS_FONTS: string[] = [
  "Inter",
  "DM Sans",
  "Outfit",
  "Manrope",
  "Plus Jakarta Sans",
  "Nunito Sans",
];

export const MONO_FONTS: string[] = [
  "JetBrains Mono",
  "Fira Code",
  "Source Code Pro",
  "IBM Plex Mono",
];

// Fonts treated as system fonts — no Google Fonts request generated.
const SYSTEM_FONTS = ["system-ui", "serif", "monospace"];

// ─── Token definitions ────────────────────────────────────────────────────────
// Define all design tokens your theme exposes.
//
// Token types:
//   "color"       → <input type="color"> in the admin UI
//   "google-font" → <select> from SANS_FONTS or MONO_FONTS
//   "select"      → <select> using the options array
//
// Token groups (see THEMES.md §3.1):
//   Built-in: "colors" | "typography" | "layout-home" | "layout-post" | "layout-page"
//   Custom:   any other string → rendered under "Theme Options" in the admin
//
// The editable field (see THEMES.md §3.2):
//   editable: true  (default) → shown in admin UI, user can change it
//   editable: false           → injected as CSS but hidden from admin UI
//                               Use this for tokens core to your theme's identity.
//
// Tokens with cssVariable are injected into :root { ... } at render time.
// Layout tokens (no cssVariable) are passed as props to view components.

export const DESIGN_TOKEN_DEFS: DesignTokenDef[] = [

  // ── Colors ────────────────────────────────────────────────────────────────
  // Minimum required: colorBackground, colorForeground, colorAccent.
  // Add more to give users finer control over your theme's palette.
  {
    key: "colorBackground",
    label: "Background",
    description: "Main page background color.",
    type: "color",
    group: "colors",
    cssVariable: "--color-background",
    default: "#ffffff",
    editable: true,
    order: 1,
  },
  {
    key: "colorForeground",
    label: "Foreground",
    description: "Primary text color.",
    type: "color",
    group: "colors",
    cssVariable: "--color-foreground",
    default: "#0f172a",
    editable: true,
    order: 2,
  },
  {
    key: "colorAccent",
    label: "Accent",
    description: "Primary brand / interactive color.",
    type: "color",
    group: "colors",
    cssVariable: "--color-accent",
    default: "#2563eb",
    editable: true,
    order: 3,
  },
  // Example of a non-editable token — structural to the theme, not user-adjustable:
  // {
  //   key: "colorOverlay",
  //   label: "Overlay",
  //   type: "color",
  //   group: "colors",
  //   cssVariable: "--color-overlay",
  //   default: "rgba(0,0,0,0.4)",
  //   editable: false,
  // },

  // ── Typography ────────────────────────────────────────────────────────────
  {
    key: "fontSans",
    label: "Sans-serif font",
    description: "Body and UI text font.",
    type: "google-font",
    fontList: "sans",
    group: "typography",
    cssVariable: "--font-sans",
    default: "Inter",
    editable: true,
    order: 1,
  },
  {
    key: "fontMono",
    label: "Monospace font",
    description: "Code blocks and inline code.",
    type: "google-font",
    fontList: "mono",
    group: "typography",
    cssVariable: "--font-mono",
    default: "JetBrains Mono",
    editable: true,
    order: 2,
  },

  // ── Layout — Home ─────────────────────────────────────────────────────────
  // NOTE: layout-home tokens are handled by the HomepageLayoutCard admin UI,
  // not the generic DesignForm. All tokens in this group — including any you
  // add — are filtered out of the generic form automatically.
  {
    key: "homeFeedStyle",
    label: "Feed style",
    description: "Display posts as a list or a grid.",
    type: "select",
    group: "layout-home",
    options: [
      { value: "list", label: "List" },
      { value: "grid", label: "Grid" },
    ],
    default: "list",
    editable: true,
  },
  {
    key: "homeListStyle",
    label: "List style",
    description: "Visual layout of each post row when feed style is List.",
    type: "select",
    group: "layout-home",
    options: [
      { value: "compact",   label: "Compact — text left, thumbnail right" },
      { value: "editorial", label: "Editorial — large image left, text right" },
      { value: "feature",   label: "Feature — full-width image above text" },
      { value: "text-only", label: "Text only — no images" },
    ],
    default: "compact",
    editable: true,
  },
  {
    key: "homeColumns",
    label: "Grid columns",
    description: "Number of columns when feed style is grid.",
    type: "select",
    group: "layout-home",
    options: [
      { value: "1", label: "1 column" },
      { value: "2", label: "2 columns" },
      { value: "3", label: "3 columns" },
    ],
    default: "1",
    editable: true,
  },
  {
    key: "homeGap",
    label: "Gap",
    description: "Spacing between post cards.",
    type: "select",
    group: "layout-home",
    options: [
      { value: "sm", label: "Small" },
      { value: "md", label: "Medium" },
      { value: "lg", label: "Large" },
    ],
    default: "md",
    editable: true,
  },

  // ── Layout — Post ─────────────────────────────────────────────────────────
  {
    key: "postContentWidth",
    label: "Content width",
    description: "Max-width of blog post body.",
    type: "select",
    group: "layout-post",
    options: [
      { value: "narrow", label: "Narrow" },
      { value: "medium", label: "Medium" },
      { value: "wide", label: "Wide" },
    ],
    default: "narrow",
    editable: true,
  },
  {
    key: "postSidebar",
    label: "Sidebar",
    description: "Sidebar position for blog posts.",
    type: "select",
    group: "layout-post",
    options: [
      { value: "none", label: "None" },
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
    default: "none",
    editable: true,
  },

  // ── Layout — Page ─────────────────────────────────────────────────────────
  {
    key: "pageContentWidth",
    label: "Content width",
    description: "Max-width of static page body.",
    type: "select",
    group: "layout-page",
    options: [
      { value: "narrow", label: "Narrow" },
      { value: "medium", label: "Medium" },
      { value: "wide", label: "Wide" },
    ],
    default: "narrow",
    editable: true,
  },
  {
    key: "pageSidebar",
    label: "Sidebar",
    description: "Sidebar position for static pages.",
    type: "select",
    group: "layout-page",
    options: [
      { value: "none", label: "None" },
      { value: "left", label: "Left" },
      { value: "right", label: "Right" },
    ],
    default: "none",
    editable: true,
  },

  // ── Theme Options (custom group example) ──────────────────────────────────
  // Add tokens here for settings unique to your theme that don't fit the
  // built-in groups. They render under "Theme Options" in the admin UI.
  // Remove this section if your theme has no custom settings.
  //
  // {
  //   key: "heroStyle",
  //   label: "Hero style",
  //   description: "Visual treatment for the homepage hero section.",
  //   type: "select",
  //   group: "hero",
  //   options: [
  //     { value: "contained", label: "Contained" },
  //     { value: "full-bleed", label: "Full bleed" },
  //   ],
  //   default: "contained",
  //   editable: true,
  // },
];

// ─── Defaults map ─────────────────────────────────────────────────────────────
// Convenience flat map of key → default value. Generated from DESIGN_TOKEN_DEFS.
// Do not edit manually.

export const DESIGN_DEFAULTS: Record<string, string> = Object.fromEntries(
  DESIGN_TOKEN_DEFS.map(t => [t.key, t.default])
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds a Google Fonts URL from the active design config.
 * Only fetches fonts present in SANS_FONTS / MONO_FONTS.
 * Returns null when all active fonts are system fonts (no network request needed).
 *
 * IMPORTANT: The config keys used here ("fontSans", "fontMono") must exactly
 * match the `key` values of your google-font tokens in DESIGN_TOKEN_DEFS above.
 * If you rename a font token key, update it here too — otherwise fonts will
 * silently fall back to system defaults and not load from Google Fonts.
 */
export function buildGoogleFontsUrl(config: Record<string, string>): string | null {
  const fontSans = config.fontSans ?? DESIGN_DEFAULTS.fontSans ?? "Inter";
  const fontMono = config.fontMono ?? DESIGN_DEFAULTS.fontMono ?? "JetBrains Mono";

  const families: string[] = [];

  if (SANS_FONTS.includes(fontSans) && !SYSTEM_FONTS.includes(fontSans)) {
    families.push(`family=${encodeURIComponent(fontSans)}:wght@400;500;600;700`);
  }
  if (MONO_FONTS.includes(fontMono) && !SYSTEM_FONTS.includes(fontMono)) {
    families.push(`family=${encodeURIComponent(fontMono)}:wght@400;500`);
  }

  if (families.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

/**
 * Builds the :root { ... } CSS block from the active design config.
 * Only emits tokens that have a cssVariable defined.
 * Inject the result as a <style> tag in your theme Layout.tsx.
 */
export function buildCssString(
  config: Record<string, string>,
  defs: DesignTokenDef[]
): string {
  const lines: string[] = [];

  for (const def of defs) {
    if (!def.cssVariable) continue;
    const value = config[def.key] ?? def.default;

    if (def.type === "google-font") {
      // Apply appropriate system-font fallback stack based on the font list.
      const fallback = def.fontList === "mono"
        ? `'Fira Code', monospace`
        : `system-ui, -apple-system, sans-serif`;
      lines.push(`  ${def.cssVariable}: '${value}', ${fallback};`);
    } else {
      lines.push(`  ${def.cssVariable}: ${value};`);
    }
  }

  return [
    `:root {`,
    ...lines,
    `}`,
    // Prose overrides ensure article content respects design tokens.
    // Add or remove lines to match the CSS variables your theme defines.
    `body { font-family: var(--font-sans); background-color: var(--color-background); color: var(--color-foreground); }`,
    `/* prose overrides so article text respects design tokens */`,
    `.prose { color: var(--color-foreground); }`,
    `.prose a { color: var(--color-link, var(--color-accent)) !important; }`,
    `.prose h1, .prose h2, .prose h3, .prose h4 { color: var(--color-foreground); }`,
  ].join("\n");
}
