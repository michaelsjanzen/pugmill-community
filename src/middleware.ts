/**
 * Next.js Edge Middleware — admin route protection.
 *
 * Runs at the Edge before any handler, ensuring unauthenticated requests
 * to /admin/* are redirected to the login page without reaching the server.
 *
 * Uses the Edge-compatible authConfig (no Node.js built-ins, no DB lookups)
 * so this stays fast and works on Vercel Edge / Cloudflare Workers.
 */
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Protect all admin routes. Excludes the login page so unauthenticated users
  // can reach it. Static assets and API routes are excluded by default.
  matcher: ["/admin/:path*"],
};
