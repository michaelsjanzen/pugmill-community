/**
 * Vitest global setup — loads .env.local so DB-connected modules initialise
 * correctly in the test environment.
 */
import { readFileSync } from "fs";
import { resolve } from "path";

try {
  const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  // No .env.local — tests that require DB will fail with a clear error
}
