/**
 * Theme Layout Template
 *
 * This is the root wrapper for every page rendered by your theme.
 * It is responsible for:
 *   1. Reading the active design config (draft or published)
 *   2. Injecting CSS custom properties via buildCssString
 *   3. Optionally loading Google Fonts via buildGoogleFontsUrl
 *   4. Showing a preview banner when the design preview cookie is active
 *   5. Rendering your Header, page content, and Footer
 *
 * Plugin integration:
 *   Themes may call hooks.applyFilters / hooks.doAction for any hook in
 *   src/lib/hook-catalogue.ts. The "nav:items" filter is the most common
 *   theme integration point — pass config.appearance.navigation through it
 *   before rendering your Header so plugins can modify nav items.
 *
 * Full hook reference: src/lib/hook-catalogue.ts
 */

import { getConfig } from "../../src/lib/config";
import { sanitizeThemeName } from "../../src/lib/theme-registry";
import { getDesignConfig } from "../../src/lib/design-config";
import { cookies } from "next/headers";
import { buildCssString, buildGoogleFontsUrl, DESIGN_TOKEN_DEFS } from "./design";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default async function ThemeLayout({ children }: { children: React.ReactNode }) {
  // ── Site config + active theme ──────────────────────────────────────────────
  const config = await getConfig();
  const themeId = sanitizeThemeName(config.appearance.activeTheme);

  // ── Design config: draft (preview) or published ─────────────────────────────
  const cookieStore = await cookies();
  const isPreview = cookieStore.get("__pugmill_design_preview")?.value === "1";
  const designConfig = await getDesignConfig(themeId, isPreview ? "draft" : "published");

  // ── Build CSS variables + optional Google Fonts URL ─────────────────────────
  const cssString = buildCssString(designConfig, DESIGN_TOKEN_DEFS);
  const fontUrl = buildGoogleFontsUrl(designConfig);

  return (
    <div
      className="antialiased"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Design token CSS custom properties — must come before any content */}
      <style dangerouslySetInnerHTML={{ __html: cssString }} />

      {/* Google Fonts — only rendered when a non-system font is selected */}
      {fontUrl && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={fontUrl} />
        </>
      )}

      {/* Design preview banner — visible when __pugmill_design_preview cookie is set */}
      {isPreview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, background: "#b45309", color: "#fff", textAlign: "center", padding: "6px 12px", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span>Previewing draft design changes</span>
          <a href="/api/design-preview/disable" style={{ textDecoration: "underline" }}>
            Exit preview
          </a>
        </div>
      )}

      <Header />

      {/* pt-20 offsets the fixed preview banner so content isn't hidden beneath it */}
      <main style={isPreview ? { paddingTop: "2.5rem" } : undefined}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
