# Changelog

## v1.0.0 — 2026-03-26

Initial release.

- Imports posts and pages with published/draft status
- Imports categories and tags with duplicate detection
- Downloads media attachments from the original WordPress server and uploads to Pugmill storage (local or S3)
- Rewrites media URLs in post content to point at newly uploaded files
- Wires up featured images
- Converts HTML content to Markdown using Turndown
- Strips Gutenberg block comment markers
- `--dry-run` flag for previewing imports without writing to the database
- Idempotent: skips categories, tags, and posts that already exist
- Summary log with counts and warnings at the end
