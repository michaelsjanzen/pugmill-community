# ReplPress: Implementation Guide (2026 Edition)

This guide contains the exact sequence and code blueprints for building ReplPress. Use these prompts in order.

---

## 0. The Master Initialization
**Goal:** Align the Agent with the project vision and setup the DB connection.

> "I am building **ReplPress**, an AI-native, rebuildable CMS. I have provided `AGENT.md`, `package.json`, `replpress.config.json`, and `src/lib/db/schema.ts`. 
> 1. Read all files to understand the Hook System and modular architecture.
> 2. Install dependencies.
> 3. Create `src/lib/db/index.ts` to connect to Replit PostgreSQL and run `db:push`.
> 4. Implement the `HookManager` in `src/lib/hooks.ts`. 
> Confirm once the core engine is ready."

---

## Sprint 1: Core Logic & Config Utilities
**Goal:** Create the bridge between the JSON config and the app.

> "Create `src/lib/config.ts` with `getConfig()` and `updateConfig()` functions to read/write to `replpress.config.json`. Ensure these are usable in both Server Components and Server Actions."

---

## Sprint 2: The Dynamic Theme System
**Goal:** Build the system that swaps the site's look.

> "Create a 'Default' theme in `/themes/default`. It should have:
> - `Layout.tsx`: Uses `hooks.applyFilters('theme_head_tags')` and `hooks.doAction('theme_footer')`.
> - `views/HomeView.tsx`: A blog feed layout.
> Then, create a dynamic loader in `src/app/page.tsx` that imports the correct View based on `activeTheme` in the config."

---

## Sprint 3: The Admin Dashboard (CRUD)
**Goal:** Create the content management interface.

> "Build the Admin Dashboard at `/admin`. 
> 1. Use Replit Auth for security.
> 2. Create a 'Posts' page with a table to View/Edit/Delete posts.
> 3. Build a 'New Post' editor using a Server Action to save to the `posts` table in PostgreSQL.
> 4. Use shadcn/ui for a clean, professional look."

---

## Sprint 4: The Plugin System
**Goal:** Enable modularity using the Hook System.

> "Build a plugin loader that scans the `/plugins` directory. Register plugins listed in `activePlugins`. Then, create a 'Hello World' plugin that uses `hooks.addFilter('theme_footer_text', () => 'Built with ❤️ on ReplPress')`. Finally, add a 'Plugins' toggle page in the Admin Dashboard."

---

## Sprint 5: Media & Assets
**Goal:** Enable image uploads and management.

> "1. Ensure the `media` table in `schema.ts` is pushed to the DB.
> 2. Create a Server Action in `src/lib/actions/media.ts` to handle file uploads to the `/public/uploads` directory.
> 3. Build a 'Media Library' page in the Admin Dashboard to display and delete images.
> 4. Update the Post Editor to allow selecting a 'Featured Image' from the Media Library."

---

## Troubleshooting & Rebuilding
- **DB Mismatch:** "Check `schema.ts` and run `db:push`."
- **Missing Hooks:** "Ensure the active theme actually calls `doAction` or `applyFilters` in its components."
