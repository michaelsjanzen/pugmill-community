# Pugmill: Implementation Guide (2026 Edition)

This guide contains the build sequence and agent prompts for constructing Pugmill from scratch. Use these prompts in order when rebuilding or extending the system.

---

## 0. Initialization
**Goal:** Align the agent with the project architecture and establish the database connection.

> "I am building **Pugmill**, an AI-native, rebuildable CMS. I have provided `AGENT.md`, `REQUIREMENTS.md`, `THEMES.md`, `HOOKS.md`, `package.json`, and `src/lib/db/schema.ts`.
> 1. Read all provided files to understand the Hook System, design token contract, and modular architecture.
> 2. Install dependencies with `npm install`.
> 3. Create `src/lib/db/index.ts` to connect to PostgreSQL via `DATABASE_URL` and run `npm run db:push`.
> 4. Implement the `HookManager` in `src/lib/hooks.ts`.
> Confirm once the core engine is ready."

---

## Sprint 1: Core Logic & Config
**Goal:** Establish the DB-backed config system and server action patterns.

> "Create `src/lib/config.ts` with `getConfig()` (async, 60s TTL in-memory cache) and `updateConfig()` (validates with Zod, upserts to DB, invalidates cache). Config shape is documented in `REQUIREMENTS.md §11`. Ensure both are usable in Server Components and Server Actions."

---

## Sprint 2: Theme System
**Goal:** Build the dynamic theme loader and the default theme.

> "Create the default theme in `/themes/default/` following the contract in `THEMES.md`. It must include `Layout.tsx`, `components/Header.tsx`, `components/HeaderClient.tsx`, `components/Footer.tsx`, `views/HomeView.tsx`, `views/PostView.tsx`, `views/PageView.tsx`, and `design.ts` with all required exports. Then create `src/app/(site)/layout.tsx` to dynamically import the active theme's Layout based on `config.appearance.activeTheme`, validated against `THEME_ALLOWLIST` in `src/lib/theme-registry.ts`."

---

## Sprint 3: Admin Dashboard & Auth
**Goal:** Create the content management interface with NextAuth authentication.

> "Build the Admin Dashboard at `/admin` using NextAuth v5 with Credentials + GitHub + Google OAuth (see `REQUIREMENTS.md §3`). Create a Posts listing page with filter controls (type, status) and sortable columns. Build a post editor with Tiptap Markdown (Visual/Raw toggle), taxonomy pickers for categories and tags, a publish date picker, and an AEO metadata panel. Use Tailwind CSS throughout, matching the admin UI patterns in `src/app/admin/`."

---

## Sprint 4: Plugin System
**Goal:** Enable modularity using the Hook System.

> "Build a plugin loader in `src/lib/plugin-loader.ts` that initializes plugins listed in `config.modules.activePlugins`. Each plugin exports a `PugmillPlugin` object with an `initialize(hooks, settings)` method. Create a bundled SEO plugin in `/plugins/seo-optimizer/` that injects meta tags via the `theme_head_tags` filter. Add a Plugins admin page at `/admin/settings/plugins` with enable/disable toggles and per-plugin settings forms. See `HOOKS.md` for all available hooks."

---

## Sprint 5: Media & Storage
**Goal:** Enable file uploads through the storage abstraction layer.

> "Implement the `StorageProvider` interface in `src/lib/storage/` with `local.ts` (writes to `/public/uploads/`) and `s3.ts` (AWS S3 / R2 / DO Spaces). Route via `STORAGE_PROVIDER` env var. Create a Server Action in `src/lib/actions/media.ts` for upload and delete. Build a Media Library admin page with grid view, upload form, and per-item delete with confirmation. Connect featured image selection to the post editor."

---

## Sprint 6: Design Token Admin
**Goal:** Let site owners customize theme tokens without touching code.

> "Build the design token admin at `/admin/design`. Load the active theme's `DESIGN_TOKEN_DEFS` dynamically via `loadThemeDesignDefs()`. Render controls per token type: color picker + hex input for `color`, font selector with live preview for `google-font`, dropdown for `select`. Save as draft via upsert to `theme_design_configs` (partial unique index on `(theme_id, status) WHERE status IN ('draft', 'published')`). Add Publish (atomic archive → promote transaction), Discard (guard: draft must exist), and Preview (`__pugmill_design_preview` cookie) actions. Show inline toast feedback. See `THEMES.md` for the full token contract."

---

## Troubleshooting & Rebuilding

- **DB schema mismatch (fresh install):** Run `npm run db:push`
- **DB schema mismatch (existing deployment):** Run `npm run db:migrate`
- **Theme not loading:** Check `THEME_ALLOWLIST` in `src/lib/theme-registry.ts` — theme ID must be listed
- **Design tokens not applying:** Verify `buildCssString()` is called in `Layout.tsx` and the result is injected as a `<style>` tag
- **Missing hooks:** Ensure the active theme calls `doAction` / `applyFilters` in `Layout.tsx`
- **Plugin settings not saving:** Confirm plugin ID in `config.modules.pluginSettings` matches the plugin's `id` field
