-- Migration: Remove legacy Replit users table
-- Run this on existing deployments BEFORE running npm run db:push.
-- Safe to run multiple times (idempotent via IF EXISTS guards).
--
-- What this does:
--   1. Drops FK constraints on posts.author_id and media.uploader_id that reference the
--      legacy `users` table (the old Replit auth table, now replaced by admin_users).
--   2. Converts posts.author_id and media.uploader_id from INTEGER to TEXT to match
--      admin_users.id (UUID text). Existing integer values are nulled out — they are
--      stale Replit user IDs with no corresponding admin_users rows.
--   3. Adds new FK constraints pointing to admin_users.id.
--   4. Drops the legacy `users` table.

-- Step 1: Drop any FK constraints on posts and media that reference users
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tc.constraint_name, tc.table_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    JOIN information_schema.table_constraints tc2
      ON rc.unique_constraint_name = tc2.constraint_name
    WHERE tc2.table_name = 'users'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name IN ('posts', 'media')
  LOOP
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', r.table_name, r.constraint_name);
  END LOOP;
END $$;

-- Step 2: Convert posts.author_id INTEGER → TEXT (null out stale Replit user IDs)
ALTER TABLE posts ALTER COLUMN author_id TYPE TEXT USING NULL;

-- Step 3: Convert media.uploader_id INTEGER → TEXT (null out stale Replit user IDs)
ALTER TABLE media ALTER COLUMN uploader_id TYPE TEXT USING NULL;

-- Step 4: Add new FK constraints pointing to admin_users
ALTER TABLE posts
  ADD CONSTRAINT posts_author_id_admin_users_fk
  FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL;

ALTER TABLE media
  ADD CONSTRAINT media_uploader_id_admin_users_fk
  FOREIGN KEY (uploader_id) REFERENCES admin_users(id) ON DELETE SET NULL;

-- Step 5: Drop the legacy Replit users table
DROP TABLE IF EXISTS users;
