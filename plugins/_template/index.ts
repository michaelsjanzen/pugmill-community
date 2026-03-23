import type { PugmillPlugin } from "../../src/lib/plugin-registry";

/**
 * My Plugin — Template
 * ============================================================
 * Copy this directory to /plugins/<your-plugin-id>/ to start
 * a new plugin. Replace all placeholder values below.
 *
 * Hook names are type-checked against ActionCatalogue and
 * FilterCatalogue in src/lib/hook-catalogue.ts. Only hooks
 * defined in that file may be used.
 *
 * Plugin authoring rules:
 *   - Plugin DB tables MUST be named: plugin_<id>_<tablename>
 *   - NO foreign key constraints to core tables (use plain integer values)
 *   - NO imports from other plugins (use hooks for inter-plugin communication)
 *   - Shared utilities belong in npm packages, not in other plugins
 *
 * Full authoring guide: PLUGIN_AUTHORING.md
 * Hook reference: src/lib/hook-catalogue.ts
 * ============================================================
 */
export const myPlugin: PugmillPlugin = {
  id: "my-plugin",
  name: "My Plugin",
  version: "1.0.0",
  description: "A short description of what this plugin does.",

  settingsDefs: [
    {
      key: "exampleText",
      label: "Example Text",
      type: "text",
      default: "",
      description: "A sample text setting.",
    },
    {
      key: "apiKey",
      label: "API Key",
      type: "text",
      default: "",
      secret: true,   // masked in admin UI, never logged
      required: true,
      description: "Your API key for the external service.",
    },
    {
      key: "enabled",
      label: "Enable feature",
      type: "boolean",
      default: true,
    },
  ],

  initialize(hooks, settings) {
    // ── Filter example: transform post Markdown before rendering ────────────
    hooks.addFilter("content:render", ({ input, post }) => {
      // input is the raw Markdown string — return modified Markdown.
      if (!settings.enabled) return input;
      return input + `\n\n<!-- rendered by my-plugin for post ${post.id} -->`;
    });

    // ── Action example: react to post saves ──────────────────────────────────
    hooks.addAction("post:after-save", ({ post }) => {
      console.log(`[my-plugin] Post saved: ${post.slug}`);
    });
  },

  destroy() {
    // Optional: clean up timers, connections, etc.
    // Called on clean server shutdown (SIGTERM/SIGINT).
    // NOT called on plugin deactivation — deactivation takes effect on next cold start.
    // Safe to omit if initialize() only registers hook listeners.
  },
};
