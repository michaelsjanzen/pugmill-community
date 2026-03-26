# pugmill-import-wordpress

A TypeScript script that imports posts, pages, categories, tags, and media from a WordPress WXR export into a [Pugmill CMS](https://github.com/pugmillcms/pugmill) database.

This is a community workflow recipe, not an official Pugmill project. It is designed to be dropped into an existing Pugmill installation and run once.

---

## What it imports

| WordPress | Pugmill |
|---|---|
| Posts (published) | Posts (type: post, published) |
| Posts (draft) | Posts (type: post, draft) |
| Pages (published) | Posts (type: page, published) |
| Pages (draft) | Posts (type: page, draft) |
| Categories | Categories |
| Tags | Tags |
| Media attachments | Downloaded and uploaded to your storage provider |
| Featured images | Wired to imported media |
| Post content (HTML) | Converted to Markdown |
| Excerpts | Converted to Markdown |

### What it does not import

- Comments (use Pugmill's comments plugin separately if needed)
- WordPress plugin data (WooCommerce, form entries, etc.)
- Admin user accounts (posts are attributed to your Pugmill admin)
- Private or password-protected posts

---

## Prerequisites

- Node.js 22+
- A working Pugmill CMS install with `DATABASE_URL` configured
- The original WordPress site must still be accessible if you want media downloaded (see note below)

---

## Installation

In your Pugmill project root, install the two additional dependencies:

```bash
npm install fast-xml-parser turndown @types/turndown
```

Copy `import-wordpress.ts` into your Pugmill project's `scripts/` folder:

```bash
curl -o scripts/import-wordpress.ts \
  https://raw.githubusercontent.com/michaelsjanzen/pugmill-import-wordpress/main/import-wordpress.ts
```

---

## Usage

### 1. Export your WordPress content

In your WordPress admin go to **Tools > Export**, select **All content**, and download the `.xml` file.

### 2. Run the importer

```bash
npx tsx scripts/import-wordpress.ts --file export.xml
```

By default the script looks for `.env.local` for your database connection. Pass `--env` to use a different file:

```bash
npx tsx scripts/import-wordpress.ts --file export.xml --env .env.production
```

### 3. Preview before importing

Use `--dry-run` to parse the export and log what would be imported without writing anything to the database:

```bash
npx tsx scripts/import-wordpress.ts --file export.xml --dry-run
```

---

## Options

| Flag | Default | Description |
|---|---|---|
| `--file` | required | Path to the WXR export file |
| `--env` | `.env.local` | Path to your Pugmill env file |
| `--dry-run` | false | Parse and log without writing to the DB |

---

## How it works

The script runs in five steps:

1. **Parse** the WXR XML file
2. **Create categories and tags**, skipping any that already exist by name
3. **Download media** from the original WordPress server and upload to your configured Pugmill storage provider (local or S3)
4. **Convert and insert posts and pages** -- HTML is converted to Markdown, media URLs in content are rewritten to point at the newly uploaded files, featured images are wired up
5. **Print a summary** with counts and any items that need manual attention

The script is idempotent for categories and tags (skips duplicates). Posts and pages are skipped if a matching slug already exists in the database.

---

## Media

Media files are downloaded from the original WordPress server at import time and uploaded to whichever storage provider your Pugmill install is configured to use (`STORAGE_PROVIDER=local` or `STORAGE_PROVIDER=s3`).

If the original WordPress site is offline or the files have moved, the script will log a warning for each file it cannot fetch and continue. Any content that referenced missing media will contain broken image links that you can fix manually in the Pugmill editor.

---

## Content conversion

WordPress content is stored as HTML (or Gutenberg blocks in newer installs). Pugmill stores content as Markdown. The script uses [Turndown](https://github.com/mixmark-io/turndown) for the conversion and strips Gutenberg block comment markers before processing.

Most content converts cleanly. Things that may need manual review after import:

- Complex shortcodes (converted to their text content or dropped)
- Embedded iframes (pass through as raw HTML -- Pugmill renders these correctly)
- Heavily styled inline HTML (styles are stripped)

---

## After importing

1. Visit **Admin > Posts** and **Admin > Pages** in your Pugmill admin to review imported content
2. Check the console output for any warnings or skipped items
3. Add AEO metadata to important posts via the editor

---

## Related

- [Pugmill CMS](https://github.com/pugmillcms/pugmill)
- [Case study: Migrating a WordPress Blog to Pugmill](https://community.pugmillcms.com/wordpress-to-pugmill-migration)
- [Pugmill Community Recipe Registry](https://community.pugmillcms.com/recipes)

---

## License

MIT
