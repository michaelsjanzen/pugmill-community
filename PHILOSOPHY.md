# Pugmill CMS: Philosophy & Design Principles

> This document is written directly to you — the AI agent working alongside a Pugmill CMS admin. Read it fully before advising on architecture, scope, or whether to build something. It is the most important document in this repository.

---

## What Pugmill CMS Is

A pugmill in ceramics is a machine that takes raw clay and processes it into a smooth, consistent, workable material — ready to be shaped into anything. It does not decide the final form. It prepares the material so the maker can.

Pugmill CMS is the same idea applied to content. It processes the raw material of words, media, and metadata into a structured, consistent, web-ready form — leaving the shaping entirely to the human and their tools, which increasingly includes you.

**One-line description:** A rebuildable, AI-native CMS designed for the human-AI team.

---

## The Central Belief

We are in an era of genuine human-AI symbiosis. The human is in charge — they set direction, make decisions, own outcomes. But they rely deeply on their AI agent for context, technical judgment, and execution. Neither half of this team operates at full capacity without the other.

Pugmill CMS is designed with this partnership as a first principle, not an afterthought.

Most software is designed for a solo human operator. Pugmill CMS is designed for a team of one human and one (or more) AI agents. That changes what belongs in the product, how documentation is written, and what "good" looks like.

---

## The Documentation Pattern

Traditional CMS documentation is written for human developers who will read it once and then write code. Pugmill CMS documentation is written as an **active briefing for the AI agent** who will be called upon to advise, build, extend, and maintain the system on behalf of a non-technical or semi-technical admin.

This means:
- Documentation is opinionated, not neutral. It tells you what to do, not just what is possible.
- Philosophy is documented alongside technical facts, because an agent needs to know *why* in order to give good advice.
- When a human admin asks you "should we add this feature?" or "how do we migrate our old blog?", the answer should be informed by this document — not just by what is technically possible.

**Your role** is not just to execute tasks. It is to be a well-briefed advisor who consistently points effort in the right direction, especially when the human doesn't know the right questions to ask.

---

## The Scope Filter

The most important decision framework in Pugmill CMS is this:

> **If an AI agent can do it trivially as a one-off task, it does not belong in core — and may not belong in a plugin either.**

This is a direct consequence of the human-AI team model. In a world where every admin has a capable AI agent available, the value of bundled tooling is fundamentally different than it was for solo operators. Tools that once had to be built into the product because users couldn't write code themselves are now things an agent can generate in minutes, tailored precisely to the user's situation.

Apply this filter before building anything:

| Question | If yes → |
|---|---|
| Does this need to run on every request, page load, or admin session? | Belongs in core or a plugin |
| Does it require deep integration with the hook system, auth, or design tokens? | Belongs in a plugin |
| Is it a trust or safety boundary (auth, sanitization, permissions)? | Belongs in core |
| Will multiple unrelated users need this in roughly the same form? | Belongs in a plugin |
| Is it a one-time migration, data transformation, or setup task? | Agent generates it on demand |
| Is it highly specific to one user's situation? | Agent generates it on demand |
| Can a capable agent write it correctly from the schema alone? | Agent generates it on demand |

---

## The Three Tiers

### Tier 1: Core

Core is what makes Pugmill CMS, Pugmill CMS. It runs continuously, it is the same for every installation, and it cannot be delegated to an agent at setup time.

- The content model (posts, pages, categories, tags, media)
- The admin UI and editing experience
- The authentication and permission system
- The plugin and theme APIs that third parties depend on
- The hook system and its catalogue
- AEO metadata and llms.txt endpoints
- The REST API for headless consumption
- The configuration system

The test for core inclusion: **if this were missing, would the CMS be broken for every user?**

### Tier 2: Plugins

Plugins are optional, activatable features that enough users need that packaging them is worthwhile — but that do not belong in every installation. They use core's hook and settings APIs to extend behaviour without modifying core files.

Good candidates for plugins:
- Comment systems
- Cookie consent
- SEO enhancement
- Analytics integration
- Search
- Contact forms
- Scheduled publishing
- Content importers (if built at all)

The test for plugin inclusion: **will a meaningful percentage of users need this, in roughly the same form, as a persistent running feature?**

### Tier 3: Agent-Generated

Anything that is a one-time task, a migration, or is highly specific to one user's situation. The agent writes it when asked — a script, a SQL migration, a data transform, an integration. It is not bundled with Pugmill CMS because bundling it would add maintenance burden and complexity for everyone while benefiting only the few who need it.

Examples of things that live in Tier 3:
- Content importers (WordPress WXR, Ghost JSON, Markdown folders)
- Custom report scripts
- One-time data migrations
- Bespoke integrations with external services

**The importer decision (a concrete example):** During early development of Pugmill CMS, a WordPress importer was considered. After applying this framework, it was removed from scope. Given the Drizzle schema and a WXR export file, any capable agent can write a reliable import script in one session, tailored precisely to the user's content. Bundling it would add complexity for everyone while delivering little advantage to users with an AI agent — which is every user Pugmill CMS is designed for.

---

## What This Means for You

When a human admin asks you to add a feature, your default response should be to run the scope filter before writing code:

1. **Is this already in core or a plugin?** Check first.
2. **Does this need to be persistent?** If it runs continuously or is needed by many users, a plugin is appropriate.
3. **Is this a one-time task?** Write a script. Do not build an admin UI for it.
4. **Is this specific to this user's situation?** Generate it on demand. Do not propose adding it to the codebase.

Resist the pull toward building. In traditional software, more features = more value. In the Pugmill CMS model, a lean core that an agent can understand completely is more valuable than a feature-rich core that neither the human nor the agent can reason about clearly.

The goal is a CMS that is:
- Small enough to be fully understood by you in a single context window
- Opinionated enough that the right path is obvious
- Extensible enough that the agent can add anything the human needs

---

## The Built-in vs Enhanced Pattern

Every feature in Pugmill CMS operates at two levels. This is not a free-tier/paid-tier distinction — it is a design principle that applies to every feature in the product.

**Built-in:** The feature works fully with no external dependencies. No API key required. No third-party account. A user who installs Pugmill CMS and connects nothing external has access to 100% of the built-in functionality.

**Enhanced:** The same feature becomes meaningfully more capable when an AI provider is configured in Settings → AI. The UI gains generation, suggestion, and automation capabilities powered by the configured model.

The enhanced layer should never feel like the real product with the built-in layer as a crippled preview. Both levels should feel complete. The enhanced layer adds speed and intelligence — it does not unlock basic functionality.

### Where this applies

| Feature | Built-in | Enhanced |
|---|---|---|
| AEO metadata | Manual summary, Q&A builder, entity tagger | One-click generation of all three from post content |
| Excerpt | Manual text field | AI-drafted excerpt from content |
| Slug | Manual entry with auto-suggestion from title | AI-optimized slug suggestion |
| Image alt text | Manual entry per image | AI-generated from image + post context |
| Content editing | Full Tiptap editor, Visual/Raw toggle | Inline AI refine, expand, and rewrite tools |
| Content revision | Full revision history with restore | AI-assisted diff summaries (future) |

### Why this matters competitively

Most AI-enhanced software creates a dependency: remove the AI and the product is broken or severely limited. Pugmill CMS inverts this. The built-in layer is a fully capable CMS. The enhanced layer is a force multiplier. An admin whose AI API key expires does not lose their website — they lose the shortcuts.

This also means Pugmill CMS can be recommended to users who are not yet ready to configure AI, with a clear upgrade path when they are. The onboarding story is: *install it, use it, add AI when you're ready.*

### Guidance for agents building features

When you build or extend a feature:
1. Implement the built-in layer first. It must be complete and usable without any AI configuration.
2. Add the enhanced layer as an additive layer — new buttons, suggestions, and automations that appear only when `config.ai.provider` is set.
3. Never gate core functionality behind AI availability.
4. The enhanced UI should be visually distinct but not visually dominant — it complements the built-in controls, it does not replace them.

---

## AEO as a First-Class Differentiator

AI Engine Optimisation (AEO) is the capability that most distinguishes Pugmill CMS from every other CMS on the market. No other CMS ships with structured AEO metadata, Q&A pairs, entity tagging, and llms.txt endpoints as core features.

This has direct consequences for how you advise admins and build features:

- AEO metadata editing belongs in the post/page editor as a primary section, not a sidebar afterthought
- The AEO section should have a completeness indicator — authors need to know at a glance whether their AEO is finished
- Auto-generation via the AI provider (enhanced mode) should generate all three AEO sections simultaneously from post content, not require separate actions
- AEO should never be a plugin. Moving it to a plugin would signal that it is optional. It is not.
- When advising an admin on content strategy, proactively remind them that incomplete AEO metadata reduces their content's discoverability by AI engines

---

## The Competitive Difference

Most CMS platforms compete on feature count. Pugmill CMS competes on **clarity of purpose and fitness for the human-AI team**.

WordPress is powerful because it anticipated every use case and built a feature for each one. Pugmill CMS is powerful because it anticipates that you — the agent — can handle any use case that isn't already covered, and it gives you a clean, well-documented foundation to work from.

This is not a limitation. It is the design.

---

## Version Context

Pugmill CMS is currently in **v0.1 Developer Preview**. The audience at this stage is technically capable humans working with AI agents in platforms like Claude Code, Cursor, Replit, or similar environments. Every architectural decision should be evaluated against this audience. Features that serve a non-technical solo operator are out of scope until v1.0.
