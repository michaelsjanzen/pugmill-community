--
-- PostgreSQL database dump
--

\restrict CvLfEzgyps0GD73bfXaaouKKA6jzJ1qPms1t3GfWmUuG9qN4wf1olDIRsM3Y43N

-- Dumped from database version 16.13 (Homebrew)
-- Dumped by pg_dump version 16.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.admin_users (id, name, email, email_verified, image, password_hash, role, author_voice, created_at) VALUES ('ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', 'Admin', 'admin@example.com', NULL, NULL, '$2b$12$mBF7RuYhG.2UBF.xYufnOuPrYuwEOgy17gkAPpLycibaH.wpF0S/C', 'admin', '# Minimal "Agile Symbiosis" Style Guide (Test Version)

## 1. Tone & Persona
* **No Commands:** Use gerunds instead of imperatives (e.g., "Focusing on..." not "Focus on...").
* **Neutrality:** Stick to facts. Strip out emotional exaggeration and manufactured urgency.
* **No Absolutes:** Avoid broad claims (*always, all*). Rely on specific evidence.
* **Zero Fluff:** Delete adjectives and adverbs unless they add a concrete, provable fact.

## 2. Banned Vocabulary
* **Fillers:** *Actually, simply, just, basically, really.*
* **False Authority:** *Crucial, fundamental, highly, effectively.*
* **Drama/Superlatives:** *Staggering, massive, transformative, profound, powerful.*
* **AI Clichés:** *Dive into, unleash, leverage, unlock, game-changing.*

## 3. Structure & Formatting
* **No Conversational Starters:** Do not begin sentences with *So, But,* or *And*.
* **No Visual Tags:** Absolutely no placeholders like `[Image of...]`.

## 4. AI "Tells" to Avoid
* **Direct Openings:** Skip chapter recaps and previews. Start immediately with the core topic.
* **State the Affirmative:** Avoid defensive phrasing ("Not X, but Y"). Just state what is true.
* **No Forced Dichotomies:** Cut philosophical, symmetrical contrasts.
* **Natural Casing:** Avoid over-capitalizing concepts (use "peak moment", not "The Peak Moment").

## 5. Appendices (Prompts)
* **Frame as Recipes:** Introduce prompts collegially as adaptable starting points, not rigid code.
* **Formatting:** Enclose all prompt text inside standard block quotes.', '2026-03-26 06:49:15.131859');


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (1, 'CMS', 'cms', NULL, '2026-03-26 10:56:34.759373');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (2, 'Developer Tools', 'developer-tools', NULL, '2026-03-26 10:56:35.21087');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (3, 'Open Source', 'open-source', NULL, '2026-03-26 10:56:35.70663');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (4, 'CMS & Content Management', 'cms--content-management', NULL, '2026-03-26 11:06:52.832329');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (5, 'Content Management', 'content-management', NULL, '2026-03-26 11:09:30.739028');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (6, 'Web Development', 'web-development', NULL, '2026-03-26 11:09:31.181542');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (7, 'Technical Guides', 'technical-guides', NULL, '2026-03-26 11:09:31.635804');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (8, 'Community & Contributions', 'community--contributions', NULL, '2026-03-26 11:10:33.745898');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (9, 'Plugin Development', 'plugin-development', NULL, '2026-03-26 11:11:18.78464');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (10, 'CMS & Blogging', 'cms--blogging', NULL, '2026-03-26 11:12:30.408373');
INSERT INTO public.categories (id, name, slug, description, created_at) VALUES (11, 'AI & Machine Learning', 'ai--machine-learning', NULL, '2026-03-26 11:13:26.451958');


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.media (id, file_name, file_type, file_size, url, storage_key, alt_text, uploader_id, created_at) VALUES (1, '1774534147837-pugmill-logo.png', 'image/png', 74125, '/uploads/1774534147837-pugmill-logo.png', 'uploads/1774534147837-pugmill-logo.png', NULL, NULL, '2026-03-26 07:09:07.840304');
INSERT INTO public.media (id, file_name, file_type, file_size, url, storage_key, alt_text, uploader_id, created_at) VALUES (2, '1774543170072-pugmill-cms-revolution.png', 'image/png', 7218101, '/uploads/1774543170072-pugmill-cms-revolution.png', 'uploads/1774543170072-pugmill-cms-revolution.png', NULL, NULL, '2026-03-26 09:39:30.083016');


--
-- Data for Name: plugin_community_members; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.plugin_community_members (id, github_id, github_handle, github_avatar_url, github_access_token, tier, score, score_updated_at, created_at, last_active_at) VALUES (1, '201247629', 'michaelsjanzen', 'https://avatars.githubusercontent.com/u/201247629?v=4', 'REDACTED', 'apprentice', 0, NULL, '2026-03-26 07:17:28.995146', '2026-03-26 17:41:30.934');


--
-- Data for Name: plugin_community_recipe_pnas; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--



--
-- Data for Name: plugin_community_recipe_versions; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.plugin_community_recipe_versions (id, recipe_id, version, changelog, release_url, zipball_url, published_at) VALUES (1, 1, 'v3.0.0', 'This major release upgrades the Prompt-Native Application (PNA) standard from a basic learning framework to an improved **Active Learning** system. Version 3.0.0 introduces a centralized structural standard that merges previous formats into a single, high-performance master file for all PNA types.

## Included in this Release

* **The Unified Master Template (`pna-v3-unified-template.json`):** A new, consolidated blank master file designed for starting projects from scratch using the v3.0.0 standard.
* **The Handshake Protocol:** A transparency feature requiring the AI to explicitly identify itself and its specific Persona upon initialization.
* **The Verbatim Reading Engine:** A core operational override that forces the AI to act as a "Verbatim Printer," eliminating summaries and reducing hallucinations of the source text.
* **The Standardized UI (`standard_navigation`):** A universal command set—including `[N] Next`, `[C] Course`, and `[R] Read`—to ensure a consistent user experience across all PNA implementations.
* **The v3.0 Toolset:** An overhauled prompt library including new specialized prompts for generating READMEs and upgrading legacy files to the v3.0.0 standard.
* **Removal of Replit Protocol:** Streamlined the build process by removing the Replit Agent protocol, focusing on direct LLM-to-JSON generation and local validation.

## Capabilities

* **Active Learning Curriculum Engine:** Supports structured learning through "Crash Course" and "Deep Dive" tracks, complete with built-in grading functionality.
* **Persona-Driven Interactions:** Transforms the AI from a passive chatbot into a structured, reliable Course Engine or Book Companion governed by a defined persona.
* **Verification and Transparency:** Enforces the Handshake Protocol to ensure users are always aware of the AI''s active persona and operational constraints.
* **Verbatim Text Fidelity:** Ensures that the source material is delivered accurately to the user, bypassing the AI''s natural tendency to paraphrase or condense information.

## License

* **MIT License:** Fully open-source. This repository and its standards are open for public contribution and unrestricted use in both personal and commercial projects.', 'https://github.com/michaelsjanzen/pna/releases/tag/v3.0.0', 'https://api.github.com/repos/michaelsjanzen/pna/zipball/v3.0.0', '2026-01-19 21:13:23');
INSERT INTO public.plugin_community_recipe_versions (id, recipe_id, version, changelog, release_url, zipball_url, published_at) VALUES (2, 2, 'v1.0.0', 'Initial release. Imports posts, pages, categories, tags, and media from a WordPress WXR export into a Pugmill CMS database. See README for usage. ', 'https://github.com/michaelsjanzen/pugmill-import-wordpress/releases/tag/v1.0.0', 'https://api.github.com/repos/michaelsjanzen/pugmill-import-wordpress/zipball/v1.0.0', '2026-03-26 18:51:58');


--
-- Data for Name: plugin_community_recipes; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.plugin_community_recipes (id, owner_id, github_repo_url, github_owner, github_repo, type, name, slug, summary, readme_md, latest_version, license, stars_count, download_count, last_indexed_at, created_at, updated_at) VALUES (1, 1, 'https://github.com/michaelsjanzen/pna', 'michaelsjanzen', 'pna', 'cartridge', 'pna', 'michaelsjanzen/pna', 'If the LLM is the console, the Prompt-Native Application (PNA) is the cartridge. A standard for distributing interactive content as a single JSON file that runs natively in ChatGPT, Claude, and Gemini. Perfect for authors and educators.', NULL, 'v3.0.0', 'MIT', 0, 0, '2026-03-26 14:18:43.428', '2026-03-26 07:18:43.430469', '2026-03-26 07:18:43.430469');
INSERT INTO public.plugin_community_recipes (id, owner_id, github_repo_url, github_owner, github_repo, type, name, slug, summary, readme_md, latest_version, license, stars_count, download_count, last_indexed_at, created_at, updated_at) VALUES (2, 1, 'https://github.com/michaelsjanzen/pugmill-import-wordpress', 'michaelsjanzen', 'pugmill-import-wordpress', 'workflow', 'pugmill-import-wordpress', 'michaelsjanzen/pugmill-import-wordpress', 'WordPress to Pugmill CMS importer', NULL, 'v1.0.0', 'MIT', 0, 0, '2026-03-26 18:54:34.029', '2026-03-26 11:54:34.031417', '2026-03-26 11:54:34.031417');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (4, 'page', 'Submit a Recipe', 'submit-a-recipe', 'Submitting a recipe to Pugmill Community takes about two minutes. Your repository is indexed from GitHub -- there is nothing to upload.

## Prerequisites

Before submitting, make sure your repository:

- Is **public** on GitHub
- Has a clear `README.md` describing what it does
- Has at least one **release tag** (e.g. `v1.0.0`) if you want a download link in the registry

A release is not strictly required to submit, but visitors will not see a download button without one.

## How to submit

1. [Sign in with GitHub](/community/account) using the Account link in the navigation
2. Go to [Submit a Recipe](/recipes/submit)
3. Paste your repository URL -- for example `https://github.com/yourname/my-pugmill-plugin`
4. Select the recipe type (Plugin, Theme, Workflow, or PNA Cartridge)
5. Click **Submit Recipe**

The registry fetches your repository name, description, license, and latest release from the GitHub API. Your recipe appears in the listing immediately.

## Recipe types

Not sure which type to choose?

- **Plugin** -- activatable feature for Pugmill CMS; follows the plugin authoring standard
- **Theme** -- visual theme for Pugmill CMS; exports a Layout and design token contract
- **Workflow** -- script, automation, or tool for operating a Pugmill site
- **PNA Cartridge** -- structured context file for AI agents following the PNA Standard', 'Submitting a recipe to Pugmill Community takes two minutes — paste your GitHub URL, pick a type, and your listing appears immediately.', NULL, true, false, '2026-03-26 18:10:43.308', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', NULL, '{"summary": "This post explains how to submit a recipe to the Pugmill Community registry by linking a public GitHub repository — no file upload is required. It covers prerequisites such as having a public repo, a README, and an optional release tag, then outlines the five-step submission process. It is intended for developers who want to list plugins, themes, workflows, or PNA Cartridges in the Pugmill Community registry.", "entities": [{"name": "Pugmill Community", "type": "Organization", "description": "A community registry where developers can list and discover recipes such as plugins, themes, workflows, and PNA Cartridges for Pugmill CMS."}, {"name": "Pugmill CMS", "type": "Product", "description": "A content management system for which plugins, themes, and workflows can be built and submitted to the Pugmill Community registry."}, {"name": "GitHub", "type": "SoftwareApplication", "description": "The version control platform used to host recipe repositories; Pugmill Community indexes recipes directly from public GitHub repos via the GitHub API."}, {"name": "PNA Standard", "type": "CreativeWork", "description": "A standard for structured context files used by AI agents, which defines the PNA Cartridge recipe type in Pugmill Community."}], "keywords": ["Pugmill Community", "submit recipe", "GitHub repository indexing", "Pugmill CMS plugin", "Pugmill theme", "PNA Cartridge", "PNA Standard", "recipe registry", "GitHub API", "Pugmill workflow"], "questions": [{"a": "To submit a recipe to Pugmill Community, sign in with GitHub, go to the Submit a Recipe page, paste your repository URL, select the recipe type (Plugin, Theme, Workflow, or PNA Cartridge), and click Submit Recipe — the registry will automatically fetch your repo details from GitHub.", "q": "How do I submit a recipe to Pugmill Community?"}, {"a": "Yes, your GitHub repository must be public before you can submit it to the Pugmill Community registry.", "q": "Does my GitHub repository need to be public to submit to Pugmill Community?"}, {"a": "A release tag is not strictly required to submit a recipe, but without one visitors will not see a download button on your listing in the registry.", "q": "Do I need a GitHub release tag to submit a recipe to Pugmill Community?"}, {"a": "You can submit four types of recipes: a Plugin (an activatable feature for Pugmill CMS), a Theme (a visual theme exporting a Layout and design token contract), a Workflow (a script, automation, or tool for operating a Pugmill site), or a PNA Cartridge (a structured context file for AI agents following the PNA Standard).", "q": "What types of recipes can I submit to Pugmill Community?"}, {"a": "When a recipe is submitted, the Pugmill Community registry automatically fetches the repository name, description, license, and latest release from the GitHub API.", "q": "What information does Pugmill Community pull from GitHub when a recipe is submitted?"}]}', '2026-03-26 10:54:44.078586', '2026-03-26 18:10:43.308');
INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (1, 'post', 'What Is a Pugmill? (And Why We Named a CMS After One)', 'what-is-a-pugmill', '# What Is a Pugmill?

In ceramics, a **pugmill** is a machine with a single, unglamorous job: it takes raw or reclaimed clay — lumpy, inconsistent, full of air pockets — and works it into a smooth, uniform mass ready for the wheel or the press.

You feed material in one end. Usable clay comes out the other. No fuss.

## The Machine

A pugmill works by forcing clay through a tapered barrel using an auger screw. As the clay moves through, it''s compressed, de-aired, and homogenised. Potters use pugmills to reclaim scraps and offcuts that would otherwise go to waste, returning them to workable condition without hours of hand-wedging.

It is not a glamorous tool. It sits in the corner of the studio, covered in dried clay, doing the same thing every day. Without it, nothing else in the studio works as well.

## The Metaphor

Content has the same problem clay does. It arrives from everywhere — writers, editors, clients, imports, APIs — in inconsistent shapes and states. Formatting all over the place. Structure missing. Relationships undefined.

A CMS is supposed to fix that. It takes raw content in and produces something structured, publishable, and consistent on the other side.

Most CMS platforms have drifted a long way from that simple idea. They''ve accumulated plugins, page builders, subscription tiers, and abstractions until the original job — condition your content, make it ready — is buried under layers of complexity.

Pugmill returns to that original idea: the simple machine in the corner of the studio.

## What We''re Building

Pugmill is a developer-first CMS built on Next.js and PostgreSQL. It ships with the basics done well: posts, pages, media, users, themes, and a clean admin interface. It has a plugin system for the things you might need but don''t always. It has [no cloud lock-in, no monthly fee](/post/wordpress-to-pugmill-migration), and no page builder.

Feed your content in one end. Get a clean, fast, well-structured site out the other.

*You can edit or delete this post from the admin panel. Welcome to Pugmill.*', 'Pugmill takes its name from the ceramics tool that turns raw, inconsistent clay into something workable — the same job a CMS should do for content.', NULL, true, true, '2026-03-26 13:49:00', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', NULL, '{"summary": "Pugmill is a developer-first CMS built on Next.js and PostgreSQL, named after the ceramics machine that processes raw clay into a uniform, workable mass. The metaphor reflects the CMS''s core purpose: taking inconsistent content from various sources and producing something structured and publishable. It is aimed at developers who want a straightforward, self-hosted CMS without cloud lock-in, monthly fees, or unnecessary complexity.", "entities": [{"name": "Pugmill", "type": "Product", "description": "A developer-first CMS built on Next.js and PostgreSQL, designed to structure and publish content without cloud lock-in or subscription fees."}, {"name": "Next.js", "type": "SoftwareApplication", "description": "The React-based web framework on which Pugmill CMS is built."}, {"name": "PostgreSQL", "type": "Product", "description": "The relational database used as the data store for Pugmill CMS."}], "keywords": ["pugmill CMS", "developer-first CMS", "Next.js CMS", "PostgreSQL CMS", "headless CMS alternative", "self-hosted CMS", "open source CMS", "pugmill ceramics metaphor", "no cloud lock-in CMS", "content management system"], "questions": [{"a": "A pugmill is a machine used in ceramics that forces raw or reclaimed clay through a tapered barrel via an auger screw, compressing and de-airing it to produce a smooth, uniform mass ready for use on the wheel or press.", "q": "What is a pugmill in ceramics?"}, {"a": "Pugmill is a developer-first content management system built on Next.js and PostgreSQL that ships with core features like posts, pages, media, users, themes, and a plugin system, with no cloud lock-in or monthly fees.", "q": "What is Pugmill CMS and what is it built on?"}, {"a": "Pugmill CMS is named after the ceramics pugmill because both share the same core function: taking raw, inconsistent input material and processing it into something clean, structured, and ready to use.", "q": "Why is Pugmill CMS named after a ceramics machine?"}, {"a": "No, Pugmill CMS has no monthly fee and no cloud lock-in, making it a self-hosted alternative to CMS platforms that rely on subscription tiers or proprietary cloud infrastructure.", "q": "Does Pugmill CMS require a subscription or cloud hosting?"}, {"a": "Pugmill CMS includes posts, pages, media management, user management, themes, a clean admin interface, and a plugin system for optional extended functionality.", "q": "What features does Pugmill CMS include out of the box?"}]}', '2026-03-26 06:49:15.164019', '2026-03-26 18:15:51.245');
INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (5, 'page', 'Creating Plugins', 'create-a-plugin', '
A Pugmill plugin is a folder in `/plugins` that exports a `PugmillPlugin` object. Plugins are activated via the admin and can register hook listeners, add admin pages, define settings, and create their own database tables.

## Structure

```
plugins/my-plugin/
├── index.ts          # Required: exports the plugin object
├── schema.ts         # Optional: Drizzle table definitions
├── actions.ts        # Optional: server actions
└── AdminPage.tsx     # Optional: custom admin settings page
```

## The plugin object

```typescript
import type { PugmillPlugin } from "@/lib/plugin-registry";

const plugin: PugmillPlugin = {
  id: "my-plugin",
  name: "My Plugin",
  version: "1.0.0",
  description: "Does something useful.",
  async initialize(hooks, settings) {
    hooks.addAction("post:after-save", async ({ post }) => {
      // runs every time a post is saved
    });
    hooks.addFilter("content:render", ({ input, post }) => {
      return input + "\n\n*Appended by my-plugin.*";
    });
  },
};

export default plugin;
```

## Rules

- **Table naming:** all plugin database tables must be named `plugin_<id>_<tablename>`
- **No foreign keys** to core tables -- store IDs as plain integers
- **Server actions** must call `await loadPlugins()` as their first line
- **Hook names** must come from the hook catalog (`src/lib/hook-catalogue.ts`)

## Publishing

Once your plugin is working, push it to a public GitHub repository and [submit it here](/recipes/submit) as a Plugin recipe.

The full authoring guide, hook catalog, and schema reference are in the [Pugmill repository](https://github.com/pugmillcms/pugmill).
', 'Pugmill plugins live in `/plugins`, exporting a `PugmillPlugin` object that registers hooks, adds admin pages, and defines database tables.', NULL, true, false, '2026-03-26 18:11:38.95', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', NULL, '{"summary": "This post explains how to create plugins for Pugmill, a CMS platform. It covers the required folder structure, how to define a PugmillPlugin object with hooks and filters, naming rules for database tables, and how to publish a plugin to the Pugmill ecosystem. It is intended for developers building extensions for Pugmill.", "entities": [{"name": "Pugmill", "type": "SoftwareApplication", "description": "A CMS platform that supports a plugin system allowing developers to extend functionality via hooks, settings, admin pages, and custom database tables."}, {"name": "pugmillcms", "type": "Organization", "description": "The GitHub organization that maintains the Pugmill CMS repository."}, {"name": "Pugmill repository", "type": "CreativeWork", "description": "The official GitHub repository for Pugmill CMS, containing the full authoring guide, hook catalog, and schema reference for plugin development."}, {"name": "Drizzle", "type": "SoftwareApplication", "description": "An ORM used in Pugmill plugins to define database table schemas via schema.ts files."}], "keywords": ["Pugmill plugin development", "PugmillPlugin object", "plugin hook listeners", "addAction addFilter hooks", "Drizzle table definitions", "plugin database tables", "server actions loadPlugins", "hook catalogue", "Pugmill CMS plugins", "plugin folder structure"], "questions": [{"a": "A Pugmill plugin lives in the /plugins directory and requires an index.ts file that exports the plugin object, with optional files including schema.ts for database table definitions, actions.ts for server actions, and AdminPage.tsx for a custom admin settings page.", "q": "What is the folder structure for a Pugmill plugin?"}, {"a": "A Pugmill plugin object is defined in TypeScript by importing the PugmillPlugin type from @/lib/plugin-registry and exporting a default object with fields including id, name, version, description, and an initialize function that receives hooks and settings parameters.", "q": "How do you define a Pugmill plugin object?"}, {"a": "All database tables created by a Pugmill plugin must follow the naming convention plugin_<id>_<tablename>, and foreign keys to core tables are not allowed — core table IDs should be stored as plain integers instead.", "q": "What are the naming rules for Pugmill plugin database tables?"}, {"a": "Inside the plugin''s initialize function, you can use hooks.addAction to run code in response to events such as post:after-save, and hooks.addFilter to transform data such as rendered content, with all valid hook names sourced from the hook catalog at src/lib/hook-catalogue.ts.", "q": "How do you use hooks in a Pugmill plugin?"}, {"a": "Once your Pugmill plugin is working, you push it to a public GitHub repository and submit it as a Plugin recipe through the Pugmill site''s submission page.", "q": "How do you publish a Pugmill plugin?"}]}', '2026-03-26 10:54:44.078586', '2026-03-26 18:11:38.95');
INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (7, 'page', 'PNA Cartridges', 'pna-cartridges', 'A PNA cartridge is a structured context file that gives an AI agent everything it needs to understand a system -- persona, knowledge base, and tools -- in a single portable package.

PNA stands for **Prompt-Native Application**. The standard defines a format called **Monolithic Context Architecture (MCA)**: all context in one file, loaded once, ready immediately.

## Why cartridges

AI agents work best when they have complete, structured context upfront. A cartridge removes the need for an agent to discover a system through trial and error. Instead of reading dozens of files and piecing together how something works, the agent loads one file and is ready to contribute.

[Pugmill ships with its own cartridge](/post/what-is-a-pugmill) (`pugmill.pna.json`) that gives any AI agent working on a Pugmill site full knowledge of the architecture, plugin API, theme API, hook catalog, schema, and conventions.

## What a cartridge contains

- **Persona** -- the role and identity the agent should adopt
- **Knowledge base** -- structured facts about the system, domain, or codebase
- **Tools** -- callable actions the agent can use
- **Instructions** -- behavioral rules and conventions

## Creating a cartridge

A cartridge is a JSON file following the PNA Standard schema. The [PNA Standard repository](https://github.com/michaelsjanzen/pna) defines the full specification with examples.

The short version: write a JSON object with `persona`, `knowledge`, and optionally `tools` and `instructions` keys. Keep it self-contained -- the file should be useful with no other context loaded.

## Submitting to the registry

Once your cartridge is in a public GitHub repository, [submit it here](/recipes/submit) and select **PNA Cartridge** as the type.

Good candidates for community cartridges: framework documentation bundles, API reference packs, domain knowledge bases, and tool-specific agent personas.', 'Structured context files that give AI agents complete system knowledge in a single portable package — no trial and error, no scattered files.', NULL, true, false, '2026-03-26 18:13:55.538', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', 2, '{"summary": "A PNA (Prompt-Native Application) cartridge is a portable JSON context file that provides an AI agent with a complete persona, knowledge base, tools, and instructions for understanding a system in a single load. The format follows the Monolithic Context Architecture (MCA) standard, eliminating the need for an agent to discover system details through trial and error. This is relevant for developers building AI-assisted workflows, particularly those using the Pugmill static site system or creating community-shareable agent context bundles.", "entities": [{"name": "PNA Cartridge", "type": "Product", "description": "A portable JSON context file following the Prompt-Native Application standard that packages persona, knowledge, tools, and instructions for an AI agent."}, {"name": "Pugmill", "type": "Product", "description": "A static site system that ships with its own PNA cartridge (pugmill.pna.json) giving AI agents full knowledge of its architecture, plugin API, theme API, hook catalog, schema, and conventions."}, {"name": "PNA Standard", "type": "CreativeWork", "description": "The specification defining the Prompt-Native Application format and Monolithic Context Architecture, hosted on GitHub at github.com/michaelsjanzen/pna."}, {"name": "Monolithic Context Architecture", "type": "CreativeWork", "description": "The context format defined by the PNA Standard in which all agent context is contained in a single file loaded once."}, {"name": "pugmill.pna.json", "type": "SoftwareApplication", "description": "The official PNA cartridge bundled with Pugmill, providing AI agents with complete knowledge of the Pugmill system."}], "keywords": ["PNA cartridge", "Prompt-Native Application", "Monolithic Context Architecture", "AI agent context file", "PNA Standard", "pugmill.pna.json", "structured context file", "AI agent knowledge base", "PNA registry", "portable AI context package"], "questions": [{"a": "A PNA (Prompt-Native Application) cartridge is a self-contained JSON file that gives an AI agent everything it needs to understand a system — including persona, knowledge base, tools, and instructions — in a single portable package.", "q": "What is a PNA cartridge?"}, {"a": "MCA stands for Monolithic Context Architecture, the format defined by the PNA Standard in which all agent context is stored in one file, loaded once, and immediately ready for use.", "q": "What does MCA stand for in the context of PNA?"}, {"a": "A PNA cartridge JSON file contains a ''persona'' key defining the agent''s role, a ''knowledge'' key with structured facts about the system, and optionally ''tools'' for callable actions and ''instructions'' for behavioral rules and conventions.", "q": "What fields does a PNA cartridge JSON file contain?"}, {"a": "The full PNA Standard specification, including schema and examples, is defined in the public GitHub repository at github.com/michaelsjanzen/pna.", "q": "Where is the PNA Standard specification defined?"}, {"a": "Good candidates for community PNA cartridges include framework documentation bundles, API reference packs, domain knowledge bases, and tool-specific agent personas.", "q": "What are good use cases for creating a community PNA cartridge?"}]}', '2026-03-26 10:54:44.078586', '2026-03-26 18:13:55.538');
INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (2, 'page', 'About The Pugmill Community', 'about', 'Pugmill Community is a registry for Pugmill CMS extensions -- plugins, themes, workflows, and PNA cartridges built by the community and indexed from GitHub.

## What you will find here

**Plugins** extend Pugmill CMS with persistent, activatable features: comment systems, contact forms, analytics integrations, search, scheduled publishing, and more.

**Themes** change how your Pugmill site looks. Each theme controls layout, typography, color tokens, and the design system available in the admin Design panel.

**Workflows** are scripts and automation tools that help you operate a Pugmill site: content importers, deployment helpers, CI configurations, and data migration scripts.

**PNA Cartridges** are cognitive context bundles for AI agents. A cartridge is a single structured file that gives an AI agent everything it needs to understand a system, a codebase, or a domain -- persona, knowledge base, and tools in one portable package. Pugmill ships with its own cartridge.

## How it works

Every recipe in the registry is backed by a public GitHub repository. The registry indexes metadata from GitHub -- name, description, license, latest release -- and redirects downloads to GitHub Releases. There is no file hosting.

To submit a recipe, sign in with your GitHub account and paste your repository URL.

## Getting started

- [Browse recipes](/recipes)
- [Submit a recipe](/submit-a-recipe)
- [Learn about PNA cartridges](/pna-cartridges)', 'A community registry for Pugmill CMS plugins, themes, workflows, and PNA cartridges — indexed from GitHub and built by the community.', NULL, true, false, '2026-03-26 17:59:23.865', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', NULL, '{"summary": "Pugmill Community is a registry that indexes community-built extensions for Pugmill CMS, including plugins, themes, workflows, and PNA cartridges, all sourced from public GitHub repositories. The registry stores no files itself but indexes metadata from GitHub and redirects downloads to GitHub Releases. It is intended for developers and site operators who build or use extensions for the Pugmill CMS platform.", "entities": [{"name": "Pugmill CMS", "type": "Product", "description": "A content management system for which the Pugmill Community registry indexes extensions including plugins, themes, workflows, and PNA cartridges."}, {"name": "Pugmill Community", "type": "SoftwareApplication", "description": "A registry that indexes community-built extensions for Pugmill CMS, sourced from public GitHub repositories."}, {"name": "GitHub", "type": "Organization", "description": "The platform where all Pugmill Community extension repositories are hosted; the registry indexes metadata and redirects downloads to GitHub Releases."}], "keywords": ["Pugmill CMS extensions", "Pugmill Community registry", "PNA cartridges", "cognitive context bundles", "AI agent cartridge", "Pugmill plugins", "Pugmill themes", "Pugmill workflows", "GitHub CMS extensions registry"], "questions": [{"a": "Pugmill Community is a registry that indexes plugins, themes, workflows, and PNA cartridges built for Pugmill CMS, with all entries backed by public GitHub repositories.", "q": "What is the Pugmill Community?"}, {"a": "PNA (Prompt-Native Application) cartridges are cognitive context bundles for AI agents — structured files that package a persona, knowledge base, and tools together so an AI agent can understand a system, codebase, or domain. Learn more about the PNA Standard: https://github.com/michaelsjanzen/pna", "q": "What are PNA cartridges in Pugmill?"}, {"a": "To submit a recipe to the Pugmill Community registry, sign in with your GitHub account and paste your public repository URL on the submission page.", "q": "How do I submit an extension to the Pugmill Community registry?"}, {"a": "No, Pugmill Community does not host any files; it indexes metadata from GitHub and redirects downloads directly to GitHub Releases.", "q": "Does Pugmill Community host extension files?"}, {"a": "The Pugmill Community registry includes plugins that add features like comment systems and analytics, themes that control site appearance, workflows for automation and content migration, and PNA cartridges for AI agents.", "q": "What types of extensions can I find in the Pugmill Community registry?"}]}', '2026-03-26 06:49:15.164019', '2026-03-26 17:59:23.865');
INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (8, 'page', 'Pugmill Workflows', 'workflows', '
A workflow recipe is a script, automation, or operational tool for Pugmill CMS sites. Unlike plugins (which run persistently inside the CMS) and themes (which control visual presentation), workflows are things you run when you need them.

## What belongs here

- **Content importers** -- scripts that migrate posts from WordPress, Ghost, Markdown folders, or other sources into Pugmill
- **Deployment helpers** -- shell scripts, Dockerfiles, or platform-specific setup guides
- **CI configurations** -- GitHub Actions workflows, test runners, linting setups
- **Data migration scripts** -- one-time database transformations after schema changes
- **Backup and export tools** -- scripts that dump or archive site content

## The philosophy

Pugmill is designed for the human-AI team. Many tasks that would require a plugin in a traditional CMS can instead be handled by an AI agent generating a script on demand. Workflows are the packaged, reusable version of that pattern -- common enough to be worth sharing, but not persistent enough to belong inside the CMS itself.

## Submitting

Push your workflow to a public GitHub repository with a clear README explaining what it does, what it requires, and how to run it. Then [submit it here](/recipes/submit) as a Workflow recipe.

A release tag is optional for workflows, but versioning your scripts makes it easier for others to pin to a known-good version.
', 'Reusable scripts and automation tools for Pugmill CMS — run when needed, not persistently.', NULL, true, false, '2026-03-26 18:08:22.549', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', 2, '{"summary": "Pugmill Workflows are scripts, automations, and operational tools designed for use with Pugmill CMS that are run on demand rather than running persistently. They cover use cases such as content migration, deployment, CI configuration, data transformation, and backup. This resource is aimed at developers and site operators building or maintaining Pugmill CMS sites who want to share or reuse common scripted tasks.", "entities": [{"name": "Pugmill CMS", "type": "Product", "description": "A content management system designed for human-AI collaboration, where many tasks can be handled by AI-generated scripts rather than persistent plugins."}, {"name": "GitHub Actions", "type": "SoftwareApplication", "description": "A CI/CD platform mentioned as a supported workflow configuration type for Pugmill workflow recipes."}, {"name": "GitHub", "type": "Organization", "description": "Code hosting platform where Pugmill workflow authors are directed to publish their scripts in public repositories."}, {"name": "WordPress", "type": "Product", "description": "A CMS mentioned as a source platform from which content can be migrated into Pugmill using importer workflows."}, {"name": "Ghost", "type": "Product", "description": "A CMS mentioned as a source platform from which content can be migrated into Pugmill using importer workflows."}], "keywords": ["Pugmill CMS", "workflow recipe", "content importers", "deployment helpers", "CI configurations", "data migration scripts", "human-AI team", "GitHub Actions workflows", "CMS automation", "backup and export tools"], "questions": [{"a": "A Pugmill workflow recipe is a script, automation, or operational tool built for Pugmill CMS sites that is run on demand, as opposed to plugins (which run persistently) or themes (which control visual presentation).", "q": "What is a Pugmill workflow recipe?"}, {"a": "Pugmill workflows include content importers, deployment helpers, CI configurations such as GitHub Actions, data migration scripts, and backup or export tools.", "q": "What types of scripts count as Pugmill workflows?"}, {"a": "To submit a workflow, push it to a public GitHub repository with a README explaining what it does, what it requires, and how to run it, then submit it via the Workflow recipe submission page on the Pugmill site.", "q": "How do you submit a workflow to Pugmill?"}, {"a": "A Pugmill plugin runs persistently inside the CMS, while a workflow is a standalone script or tool that you run only when needed and is not embedded in the CMS itself.", "q": "What is the difference between a Pugmill plugin and a Pugmill workflow?"}, {"a": "A release tag is optional for Pugmill workflows, but versioning scripts is recommended because it allows others to pin their usage to a known-good version.", "q": "Do Pugmill workflow scripts need a version or release tag?"}]}', '2026-03-26 10:54:44.078586', '2026-03-26 18:08:22.549');
INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (9, 'post', 'Migrating a WordPress Blog to Pugmill: A Case Study', 'wordpress-to-pugmill-migration', 'Moving a WordPress blog to Pugmill CMS is a good first workflow to understand because it covers the full range of challenges you will face in any content migration: structured data with relationships, media files, user attribution, taxonomies, and content that has accumulated formatting quirks over years of editing.

The sections below cover the mapping decisions and the import sequence the workflow follows. The workflow script itself -- a ready-to-run importer you can drop into any Pugmill project -- is linked at the end once it is published to the registry.

## What WordPress exports

WordPress exports content as WXR -- WordPress eXtended RSS. It is an XML file you generate from Tools &gt; Export in the WordPress admin. A full-site export includes:

- Posts and pages with their full HTML content
- Categories and tags, including the relationships between them and posts
- Media attachments with their original URLs and metadata
- Authors
- Post meta (custom fields, featured image references, SEO plugin data)
- Comments (if you want them)

The WXR format is well-documented and has been stable for years. Every field you need is in there.

## The mapping problem

Pugmill and WordPress have similar but not identical data models. Before writing a line of code, it helps to think through the mapping:

WordPressPugmillPost (post_status: publish)Post (type: post, published: true)Page (post_status: publish)Post (type: page, published: true)DraftPost (published: false)CategoryCategoryTagTagFeatured imagePost.featuredImage (media ID)AuthorStored as string on the post; admin user if matched by emailPost content (HTML)Converted to Markdown

The trickiest mapping is content format. WordPress stores content as HTML (or Gutenberg blocks in newer installs). Pugmill stores content as Markdown. The workflow handles this with a HTML-to-Markdown conversion step using a library like `turndown`.

## Media: the hardest part

WordPress media lives on the WordPress server. When you export, the WXR file contains the original URLs of every attachment -- it does not include the files themselves.

The workflow has two strategies:

**Download and re-upload (recommended):** For each media attachment, fetch the file from the original WordPress URL and upload it to Pugmill via the storage abstraction (`getStorage().upload()`). This gives you full control and works even after the WordPress site goes offline.

**Reference in place:** Keep the original WordPress URLs in the content. Simpler, but breaks if the WordPress site moves or goes down.

For a production migration, download and re-upload is the more reliable option. The workflow script handles this with a concurrent download queue so a large media library does not take hours.

## Categories and tags

WordPress categories are hierarchical. Pugmill categories are flat. If your WordPress site has deeply nested category trees, you will need to decide how to flatten them -- typically by keeping only the leaf categories, or by concatenating parent and child names.

Tags are a straightforward one-to-one mapping.

The workflow creates categories and tags first, then builds a lookup map from WordPress term IDs to Pugmill IDs so the post insertion step can wire up the relationships correctly.

## Content conversion

Going from WordPress HTML to clean Markdown surfaces a few recurring issues:

**Gutenberg blocks** add HTML comments like `<!-- wp:paragraph -->` that need to be stripped before conversion.

**Shortcodes** like `[caption]` and `[gallery]` need special handling. The workflow converts common ones to Markdown equivalents and logs anything it cannot convert so you can fix it manually.

**Relative URLs** in links and image `src` attributes need to be rewritten to absolute URLs or updated to point at the new Pugmill media library.

**Embedded iframes** (YouTube, Twitter, etc.) pass through as raw HTML. Pugmill renders Markdown through `react-markdown` with `rehype-raw` enabled, so they will render correctly.

## The import sequence

The workflow runs in this order to respect foreign key dependencies:

1. Parse the WXR file
2. Create categories (flat, deduplicated)
3. Create tags (flat, deduplicated)
4. Download and upload media files, building a URL → Pugmill media ID map
5. Insert posts and pages, converting content and wiring up categories, tags, and featured images
6. Log anything that could not be mapped automatically

Each step is idempotent where possible -- re-running the script after a failure picks up where it left off rather than duplicating content.

## What the workflow does not handle

- **Comments** -- Pugmill''s comment plugin has its own schema. If you want to migrate comments, that is a separate step.
- **Plugins and widgets** -- WordPress plugin data (WooCommerce orders, contact form entries, etc.) is outside scope.
- **User accounts** -- Pugmill''s admin users are separate from WordPress authors. The workflow records the author display name on each post but does not create new admin accounts.

## Running it

The workflow is a TypeScript script that runs with `tsx` -- no build step required. You point it at your WXR file and your `.env.local`, and it imports directly into your Pugmill database using the same Drizzle schema the CMS uses.

```bash
npx tsx scripts/import-wordpress.ts --file export.xml --env .env.local
```

Progress is logged to the console. A summary at the end shows how many posts, pages, media files, categories, and tags were imported, and lists any items that need manual attention.

---

The workflow script is published in the Pugmill Community registry. Once it is live, the link will appear here.', 'Migrating WordPress to Pugmill covers media, taxonomies, and content conversion. This case study walks through the mapping decisions and import sequence.', NULL, true, false, '2026-03-26 18:10:03.352', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', NULL, '{"summary": "This post is a technical case study explaining how to migrate a WordPress blog to Pugmill CMS using a WXR export and a TypeScript import script. It covers the full data mapping process — including posts, pages, categories, tags, media files, and author attribution — and details the recommended import sequence to handle foreign key dependencies. It is aimed at developers performing content migrations who want a structured, repeatable workflow.", "entities": [{"name": "Pugmill CMS", "type": "SoftwareApplication", "description": "A content management system that stores content as Markdown and uses a Drizzle schema, into which WordPress content is being migrated."}, {"name": "WordPress", "type": "SoftwareApplication", "description": "A widely used CMS that exports content in WXR format, including posts, pages, media, taxonomies, and authors."}, {"name": "WXR (WordPress eXtended RSS)", "type": "CreativeWork", "description": "The XML-based export format used by WordPress to package site content for migration or backup."}, {"name": "Turndown", "type": "SoftwareApplication", "description": "A JavaScript library used in the migration workflow to convert HTML content from WordPress into Markdown for Pugmill."}, {"name": "tsx", "type": "SoftwareApplication", "description": "A tool used to run the TypeScript migration script directly without a separate build step."}, {"name": "react-markdown", "type": "SoftwareApplication", "description": "A Markdown rendering library used by Pugmill, configured with rehype-raw to support embedded raw HTML such as iframes."}, {"name": "Drizzle", "type": "SoftwareApplication", "description": "The ORM schema used by Pugmill CMS, which the migration script interacts with directly to insert imported content."}], "keywords": ["WordPress to Pugmill migration", "WXR WordPress export", "WordPress content migration", "HTML to Markdown conversion", "Pugmill CMS", "WordPress XML import", "turndown HTML converter", "Drizzle schema import", "WordPress media migration", "WXR taxonomy mapping"], "questions": [{"a": "To migrate a WordPress blog to Pugmill CMS, you export your WordPress content as a WXR file, then run a TypeScript import script (using tsx) that parses the file, creates categories and tags, downloads and re-uploads media files, and inserts posts and pages with content converted from HTML to Markdown.", "q": "How do you migrate a WordPress blog to Pugmill CMS?"}, {"a": "WXR (WordPress eXtended RSS) is an XML export format generated from the WordPress admin under Tools > Export, and it includes posts, pages, categories, tags, media attachment URLs, authors, post meta (such as featured image references and custom fields), and optionally comments.", "q": "What is WXR and what does it include?"}, {"a": "The recommended approach is to download each media file from its original WordPress URL and re-upload it to Pugmill via the storage abstraction, using a concurrent download queue to handle large media libraries efficiently, rather than keeping the original WordPress URLs which could break if the site goes offline.", "q": "How does the WordPress to Pugmill migration handle media files?"}, {"a": "The migration workflow converts WordPress HTML content to Markdown using a library like Turndown, while also stripping Gutenberg block HTML comments, handling common shortcodes like [caption] and [gallery], rewriting relative URLs, and passing embedded iframes through as raw HTML which Pugmill renders via react-markdown with rehype-raw.", "q": "How is WordPress HTML content converted to Markdown for Pugmill?"}, {"a": "WordPress categories are hierarchical but Pugmill categories are flat, so the migration requires a manual decision on how to flatten nested category trees — typically by keeping only leaf categories or by concatenating parent and child category names.", "q": "Does the WordPress to Pugmill migration handle hierarchical categories?"}]}', '2026-03-26 11:05:14.159117', '2026-03-26 18:10:03.352');
INSERT INTO public.posts (id, type, title, slug, content, excerpt, featured_image, published, featured, published_at, author_id, parent_id, aeo_metadata, created_at, updated_at) VALUES (6, 'page', 'Creating Themes', 'create-a-theme', 'A [Pugmill theme](/post/what-is-a-pugmill) is a folder in `/themes` that provides a layout, page views, and a design token contract. Themes are activated via Admin &gt; Themes and can be customized without touching code using the Design panel.

## Structure

```
themes/my-theme/
├── Layout.tsx              # Required: wraps every page
├── manifest.json           # Required: id, name, version, description
├── design.ts               # Required: token definitions and CSS builder
└── views/
    ├── HomeView.tsx         # Homepage
    ├── PostView.tsx         # Blog posts
    └── PageView.tsx         # Static pages
```

## The design token contract

Each theme defines its editable surface in `design.ts`:

```typescript
export const DESIGN_TOKEN_DEFS: DesignTokenDef[] = [
  {
    key: "colorAccent",
    label: "Accent",
    type: "color",
    group: "colors",
    cssVariable: "--color-accent",
    default: "#2563eb",
    editable: true,
  },
];
```

Token types are `color` (color picker), `google-font` (font selector), and `select` (dropdown). Tokens with `editable: false` inject into CSS but are hidden from the admin UI.

Design changes save as a draft and only go live when published, so the live site is never affected mid-edit.

## Getting started

Copy `/themes/_template/` as your starting point -- it contains the correct file structure and all required exports with documentation.

## Publishing

Push your theme to a public GitHub repository and [submit it here](/recipes/submit) as a Theme recipe.

The full authoring guide is in `THEME_AUTHORING.md` in the [Pugmill repository](https://github.com/pugmillcms/pugmill).', 'Pugmill themes live in `/themes` — a folder with a layout, views, and design tokens editable from the Admin panel without touching code.', NULL, true, false, '2026-03-26 18:12:46.788', 'ff3bc5b0-e357-4ea4-8e8b-34fa6f88187e', NULL, '{"summary": "This post explains how to create a custom theme for Pugmill CMS. A theme is a folder in /themes containing a required Layout.tsx, manifest.json, design.ts, and optional view components, with design tokens defined in design.ts controlling editable CSS variables surfaced in the admin Design panel. It is intended for developers building or customizing Pugmill themes.", "entities": [{"name": "Pugmill", "type": "SoftwareApplication", "description": "A CMS that supports custom themes built with TSX components and design tokens, managed via an admin interface."}, {"name": "THEME_AUTHORING.md", "type": "CreativeWork", "description": "The full theme authoring guide included in the Pugmill GitHub repository."}, {"name": "pugmillcms", "type": "Organization", "description": "The GitHub organization hosting the Pugmill CMS repository."}], "keywords": ["Pugmill themes", "design token contract", "DesignTokenDef", "CSS variables", "theme manifest.json", "Layout.tsx", "google-font token type", "theme authoring", "design panel customization", "THEME_AUTHORING.md"], "questions": [{"a": "A Pugmill theme requires three files: Layout.tsx (which wraps every page), manifest.json (containing id, name, version, and description), and design.ts (which defines design token definitions and the CSS builder).", "q": "What files are required to create a Pugmill theme?"}, {"a": "Pugmill supports three design token types: color (rendered as a color picker), google-font (rendered as a font selector), and select (rendered as a dropdown).", "q": "What are the available design token types in Pugmill?"}, {"a": "In Pugmill, design changes are saved as a draft and only go live when explicitly published, ensuring the live site is never affected while edits are in progress.", "q": "How do design changes work in Pugmill without affecting the live site?"}, {"a": "You should copy the /themes/_template/ directory as your starting point, as it contains the correct file structure and all required exports with inline documentation.", "q": "How do I start building a Pugmill theme from scratch?"}, {"a": "You can share a custom Pugmill theme by pushing it to a public GitHub repository and submitting it as a Theme recipe via the submit page on the Pugmill site.", "q": "How can I share or publish a custom Pugmill theme?"}]}', '2026-03-26 10:54:44.078586', '2026-03-26 18:12:46.788');


--
-- Data for Name: post_categories; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.post_categories (post_id, category_id) VALUES (2, 1);
INSERT INTO public.post_categories (post_id, category_id) VALUES (2, 2);
INSERT INTO public.post_categories (post_id, category_id) VALUES (2, 3);
INSERT INTO public.post_categories (post_id, category_id) VALUES (8, 2);
INSERT INTO public.post_categories (post_id, category_id) VALUES (8, 4);
INSERT INTO public.post_categories (post_id, category_id) VALUES (9, 5);
INSERT INTO public.post_categories (post_id, category_id) VALUES (9, 6);
INSERT INTO public.post_categories (post_id, category_id) VALUES (9, 7);
INSERT INTO public.post_categories (post_id, category_id) VALUES (4, 2);
INSERT INTO public.post_categories (post_id, category_id) VALUES (4, 8);
INSERT INTO public.post_categories (post_id, category_id) VALUES (5, 9);
INSERT INTO public.post_categories (post_id, category_id) VALUES (6, 6);
INSERT INTO public.post_categories (post_id, category_id) VALUES (6, 10);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 11);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 2);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 1);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 10);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 4);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 8);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 5);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 3);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 9);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 7);
INSERT INTO public.post_categories (post_id, category_id) VALUES (7, 6);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 11);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 1);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 10);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 4);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 8);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 5);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 2);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 3);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 9);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 7);
INSERT INTO public.post_categories (post_id, category_id) VALUES (1, 6);


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.tags (id, name, slug, created_at) VALUES (1, 'pugmill-cms', 'pugmill-cms', '2026-03-26 10:56:37.029386');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (2, 'plugins', 'plugins', '2026-03-26 10:56:37.476636');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (3, 'themes', 'themes', '2026-03-26 10:56:37.86306');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (4, 'community', 'community', '2026-03-26 10:56:38.208829');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (5, 'extensions', 'extensions', '2026-03-26 10:56:42.765698');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (6, 'pna-cartridges', 'pna-cartridges', '2026-03-26 10:56:43.080523');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (7, 'github', 'github', '2026-03-26 10:56:43.530615');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (8, 'wordpress', 'wordpress', '2026-03-26 11:09:46.734472');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (9, 'migration', 'migration', '2026-03-26 11:09:53.142227');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (10, 'workflows', 'workflows', '2026-03-26 11:10:37.621217');
INSERT INTO public.tags (id, name, slug, created_at) VALUES (11, 'design-tokens', 'design-tokens', '2026-03-26 11:12:33.165248');


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.post_tags (post_id, tag_id) VALUES (2, 1);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (2, 2);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (2, 3);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (2, 4);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (2, 5);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (2, 6);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (2, 7);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (8, 1);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (8, 7);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (8, 2);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (8, 3);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (8, 4);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (9, 8);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (9, 9);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (4, 4);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (4, 7);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (4, 2);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (4, 3);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (4, 6);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (4, 1);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (4, 10);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (5, 2);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (5, 1);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (5, 7);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (5, 5);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (6, 3);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (6, 1);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (6, 7);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (6, 11);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 4);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 11);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 5);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 7);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 9);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 2);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 6);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 1);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 3);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 8);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (7, 10);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 4);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 11);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 5);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 7);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 9);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 2);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 6);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 1);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 3);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 8);
INSERT INTO public.post_tags (post_id, tag_id) VALUES (1, 10);


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--



--
-- Data for Name: site_config; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.site_config (id, config, updated_at) VALUES (1, '{"ai": {"model": "", "apiKey": "aabc437029a995694a7825f6:38de4c8c0bba7f52c2dea0b2f091c3b9:47383a1cb9f5acdafa9ca4e7ecd3b2e21ff7f8377418d4096a84465972b574e782f57bcfd30eb4816d4ebcaa8612656c1b98bbd0c056e035a464def4170633773b99a12ee121f1fb1ff5dd23eda9c5fd785ed31eebade5b82eb2aaf3c93d34d50a8e8efacb7b1a032439cca0", "provider": "anthropic"}, "site": {"url": "https://your-site.com", "logo": "/uploads/1774534147837-pugmill-logo.png", "name": "Pugmill Community", "favicon": "/uploads/1774534147837-pugmill-logo.png", "aeoDefaults": {"summary": "", "questions": [], "organization": {"url": "", "name": "", "type": "Organization", "description": ""}}, "description": "A rebuildable CMS", "seoDefaults": {"ogImage": "", "metaDescription": ""}, "socialLinks": {"github": "", "twitter": "", "youtube": "", "facebook": "", "linkedin": "", "instagram": ""}, "showPoweredBy": true, "headerIdentity": "logo-and-name"}, "system": {"version": "0.1.0", "headlessMode": false, "maintenanceMode": false, "onboardingDismissed": false}, "modules": {"activePlugins": ["default-widgets", "contact-form", "community", "cookie-consent", "comments"], "pluginSettings": {}}, "appearance": {"navigation": [{"path": "/recipes", "label": "Recipes"}, {"path": "/recipes?type=plugin", "label": "Plugins"}, {"path": "/recipes?type=theme", "label": "Themes"}, {"path": "/recipes?type=cartridge", "label": "PNA Cartridges"}, {"path": "/community/account", "label": "Account"}], "activeTheme": "default"}}', '2026-03-26 17:16:41.197');


--
-- Data for Name: theme_design_configs; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.theme_design_configs (id, theme_id, status, config, created_at, updated_at) VALUES (1, 'community', 'archived', '{"blogGap": "md", "homeGap": "md", "blogColumns": "1", "homeColumns": "1", "blogFeedStyle": "grid", "blogListStyle": "compact", "homeFeedStyle": "grid", "homeListStyle": "compact"}', '2026-03-26 07:11:21.300645', '2026-03-26 07:11:23.633922');
INSERT INTO public.theme_design_configs (id, theme_id, status, config, created_at, updated_at) VALUES (3, 'community', 'published', '{"blogGap": "md", "homeGap": "md", "heroHeight": "medium", "blogColumns": "1", "heroCta1Url": "https://github.com/pugmillcms/pugmill", "heroCta2Url": "/recipes", "heroEnabled": "true", "homeColumns": "3", "heroCta1Text": "GitHub", "heroCta2Text": "Community", "heroHeadline": "CMS with AI Engine Optimization (AEO)", "heroImageUrl": "/uploads/1774543170072-pugmill-cms-revolution.png", "blogFeedStyle": "list", "blogListStyle": "feature", "heroCta1Style": "filled", "heroCta2Style": "outline", "homeFeedStyle": "list", "homeListStyle": "feature", "heroCta1Enabled": "true", "heroCta2Enabled": "true", "heroSubheadline": "A rebuildable, AI-native CMS Designed for Human-AI Teams", "heroContentAlign": "center", "heroOverlayColor": "#000000", "heroOverlayStyle": "gradient-up", "heroShowHeadline": "true", "heroOverlayOpacity": "60", "heroContentPosition": "center", "heroShowSubheadline": "true", "widgetArea:post-footer": "toc,categories", "widgetArea:sidebar-page": "sibling-pages", "widgetArea:sidebar-post": "related-posts,recent-posts"}', '2026-03-26 09:37:52.775038', '2026-03-26 09:53:20.533695');


--
-- Data for Name: widget_settings; Type: TABLE DATA; Schema: public; Owner: michaeljanzen
--

INSERT INTO public.widget_settings (id, widget_id, key, value, updated_at) VALUES (1, 'area:sidebar-post', 'widgets', 'related-posts,recent-posts', '2026-03-26 09:53:21.66438');
INSERT INTO public.widget_settings (id, widget_id, key, value, updated_at) VALUES (3, 'area:sidebar-page', 'widgets', 'sibling-pages', '2026-03-26 09:53:21.664329');
INSERT INTO public.widget_settings (id, widget_id, key, value, updated_at) VALUES (2, 'area:post-footer', 'widgets', 'toc,categories', '2026-03-26 09:53:21.664285');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.categories_id_seq', 11, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.media_id_seq', 2, true);


--
-- Name: plugin_community_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.plugin_community_members_id_seq', 1, true);


--
-- Name: plugin_community_recipe_versions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.plugin_community_recipe_versions_id_seq', 2, true);


--
-- Name: plugin_community_recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.plugin_community_recipes_id_seq', 2, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.posts_id_seq', 9, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.tags_id_seq', 11, true);


--
-- Name: theme_design_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.theme_design_configs_id_seq', 35, true);


--
-- Name: widget_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: michaeljanzen
--

SELECT pg_catalog.setval('public.widget_settings_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict CvLfEzgyps0GD73bfXaaouKKA6jzJ1qPms1t3GfWmUuG9qN4wf1olDIRsM3Y43N

