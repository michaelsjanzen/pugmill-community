# Contributing to Pugmill CMS

Thank you for your interest in contributing. This document covers everything you need to get
a local development environment running, understand how the codebase is organised, and submit
a quality contribution.

If you are working with an AI agent (Claude Code, Cursor, Windsurf, etc.), point your agent
at [`AGENT.md`](./AGENT.md) and [`PHILOSOPHY.md`](./PHILOSOPHY.md) before starting. Those
documents are written specifically for AI-assisted development workflows.

---

## Before You Start

Read [`PHILOSOPHY.md`](./PHILOSOPHY.md). It is short and it answers the most common question
contributors ask: *should I add this feature?* It defines what belongs in core, what belongs
in a plugin, and what should be a one-off script. Contributions that don't clear the scope
filter will not be merged, so reading it first saves everyone time.

---

## Development Setup

### Prerequisites

- **Node.js 22+**
- **PostgreSQL 16** running locally (or a remote connection string)
- **Git**

### First-time setup

```bash
# 1. Fork and clone
git clone https://github.com/pugmillcms/pugmill.git
cd pugmill

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Open .env.local and fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
# See REQUIREMENTS.md for the full variable reference

# 4. Push the schema to your database
npm run db:push

# 5. Create your first admin account
npm run setup

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) and sign in.

### Useful commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm test` | Run the test suite (Vitest) |
| `npm run db:push` | Push schema changes to the database (fresh installs) |
| `npm run db:migrate` | Run migration scripts (existing installs after schema updates) |
| `npm run db:studio` | Open Drizzle Studio — visual database browser |
| `npm run env:check` | Validate that all required env vars are set |

---

## Project Structure

```
pugmill/
├── src/
│   ├── app/
│   │   ├── (site)/          # Public-facing routes (blog, posts, pages)
│   │   ├── admin/           # Admin dashboard
│   │   └── api/             # Public REST API (read-only, headless)
│   ├── lib/
│   │   ├── db/              # Drizzle schema and database client
│   │   ├── actions/         # Next.js Server Actions (all write operations)
│   │   ├── storage/         # Storage abstraction (local + S3)
│   │   ├── hook-catalogue.ts  # Single source of truth for all hooks
│   │   ├── hooks/           # HookManager implementation
│   │   ├── auth.ts          # NextAuth configuration (full, server-only)
│   │   ├── auth.config.ts   # NextAuth edge-compatible subset (middleware)
│   │   └── config.ts        # DB-backed site config with cache
│   └── types/               # TypeScript module augmentation
├── plugins/                 # Optional, activatable features
│   ├── comments/
│   ├── contact-form/
│   └── cookie-consent/
├── themes/                  # Visual themes
│   ├── default/             # Built-in theme — never remove
│   └── _template/           # Copy this to start a new theme
└── scripts/                 # Setup and migration scripts
```

---

## How to Contribute

### Bug fixes

1. Open an issue describing the bug and how to reproduce it
2. Fork, branch (`fix/short-description`), fix, test
3. Open a pull request referencing the issue

### New features

1. Open an issue first and describe the feature
2. Wait for a maintainer to confirm it clears the scope filter (see `PHILOSOPHY.md`)
3. Fork, branch (`feature/short-description`), implement, test
4. Open a pull request

**Do not open a pull request for a large feature without prior discussion.** The scope filter
means many reasonable-sounding features intentionally do not belong in core or as a plugin.
Opening the issue first avoids wasted effort.

### New plugins

Plugins are the right place for optional, persistent features that many users need. See
[`PLUGIN_AUTHORING.md`](./PLUGIN_AUTHORING.md) for the complete guide — it covers the file
structure, the installation contract, hooks, settings, database tables, admin pages, and
conventions.

The short version:
1. Copy the structure from an existing plugin (e.g. `plugins/comments/`)
2. Register it in `src/lib/plugin-registry.ts`
3. Activate it via the admin UI and test
4. Submit a pull request

### New themes

See [`THEME_AUTHORING.md`](./THEME_AUTHORING.md) for the complete guide. Start from
`/themes/_template/` — it contains the correct file structure and required exports.

---

## Code Standards

### TypeScript

- Strict mode is enabled. No `any` unless genuinely unavoidable, and comment why.
- Module augmentation is used for NextAuth types — see `src/types/next-auth.d.ts`.
- Drizzle v0.38 requires `as typeof table.$inferInsert` on `.values()` calls for strict
  insert type inference.

### React / Next.js

- Server Components by default. Add `"use client"` only when interactivity is required.
- All write operations go through Server Actions in `src/lib/actions/` — no write REST endpoints.
- Plugin actions must call `await loadPlugins()` at the top of every exported function.
  Server actions run in a separate request context where `initialize()` may not have run.

### Database

- All schema changes go in `src/lib/db/schema.ts`.
- Fresh installs use `npm run db:push`. Existing installs use migration scripts in `/scripts/`.
- Plugin tables must be named `plugin_<plugin-id>_<tablename>` — no exceptions.
- No foreign key constraints from plugin tables to core tables — store IDs as plain integers.

### Hooks

- All hooks must be defined in `src/lib/hook-catalogue.ts` before use.
- Plugins may only use hooks listed in the catalogue.
- Hook names follow the `namespace:event` convention (e.g. `post:after-save`).
- See [`HOOKS.md`](./HOOKS.md) for the complete hook reference.

### Security

- Never hardcode secrets. All secrets come from environment variables.
- Validate all user input with Zod before processing.
- Admin routes require auth checks via `getCurrentUser()` — never rely on middleware alone.
- See [`SECURITY.md`](./SECURITY.md) for the full security policy.

### Style

- Tailwind CSS only. No CSS modules, no styled-components, no inline style objects except for
  CSS custom properties (design token values).
- Match the visual patterns already established in `src/app/admin/`.

---

## Testing

Pugmill uses [Vitest](https://vitest.dev/). Run the full suite with:

```bash
npm test
```

All pull requests must pass the full test suite. If your change requires new tests, add them.
If you are fixing a bug, a regression test is expected.

---

## Pull Request Checklist

Before opening a PR:

- [ ] Tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run build` with no type errors)
- [ ] New hooks are registered in `src/lib/hook-catalogue.ts` and `HOOKS.md`
- [ ] New env vars are added to `.env.example` with a description comment
- [ ] New plugin tables follow the `plugin_<id>_<name>` naming rule
- [ ] No secrets, `.env.local`, or generated files committed
- [ ] PR description explains *what* changed and *why*

---

## Questions

Open a [GitHub Discussion](https://github.com/pugmillcms/pugmill/discussions) for questions
about architecture, design decisions, or whether a feature belongs in the project.

Open a [GitHub Issue](https://github.com/pugmillcms/pugmill/issues) for bug reports and
concrete feature proposals.
