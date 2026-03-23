/**
 * NextAuth module augmentation.
 *
 * Extends the built-in Session, User, and JWT interfaces to include Pugmill
 * custom fields (id and role) so TypeScript knows about them without `as any`.
 *
 * @see https://next-auth.js.org/getting-started/typescript
 */

import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's database ID (UUID string from admin_users.id). */
      id: string;
      /** CMS role — "admin" or "editor". */
      role: "admin" | "editor";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    /** CMS role — "admin" or "editor". */
    role: "admin" | "editor";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    /** Copied from User into the token on first sign-in. */
    id: string;
    role: "admin" | "editor";
    /** Unix ms timestamp of the last DB role refresh — used to limit refresh frequency. */
    roleRefreshedAt?: number;
  }
}
