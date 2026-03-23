/**
 * Unified auth helper — NextAuth only.
 * Call this from any server component or server action to get the current user.
 * Custom fields (id, role) are typed via src/types/next-auth.d.ts — no `as any` needed.
 */
import { auth } from "./auth";

export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "admin" | "editor";
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role ?? "editor",
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "admin";
}
