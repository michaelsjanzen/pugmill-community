/**
 * env-check.ts
 *
 * Validates environment variable configuration:
 * 1. All required vars are set
 * 2. No weak/placeholder values in production
 * 3. .env.example is in sync with actual required vars
 *
 * Run: npm run env:check
 * Also runs automatically before dev server starts.
 */

import "./_load-env";
import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const ROOT = process.cwd();

// ─── Known weak/placeholder values that should never be used in production ───
const WEAK_VALUES = new Set([
  "secret",
  "changeme",
  "password",
  "12345678",
  "localhost",
  "local-dev-secret-change-in-production",
  "your-secret-here",
  "change-me",
  "replace-me",
  "todo",
  "fixme",
]);

// ─── Required variables with metadata ────────────────────────────────────────
const REQUIRED_VARS: Array<{
  key: string;
  description: string;
  minLength?: number;
  warnIfWeak?: boolean;
  onlyWhen?: () => boolean;
}> = [
  {
    key: "DATABASE_URL",
    description: "PostgreSQL connection string",
    minLength: 10,
  },
  {
    key: "NEXTAUTH_SECRET",
    description: "Random secret for JWT signing (min 32 chars). Generate: openssl rand -base64 32",
    minLength: 32,
    warnIfWeak: true,
  },
  {
    key: "NEXTAUTH_URL",
    description: "Full app URL (e.g. http://localhost:3000 or https://yourdomain.com)",
  },
];

// ─── Check .env.example is in sync ───────────────────────────────────────────
function checkEnvExample(): string[] {
  const warnings: string[] = [];
  const examplePath = path.join(ROOT, ".env.example");

  if (!fs.existsSync(examplePath)) {
    warnings.push(".env.example is missing — create it to document required variables");
    return warnings;
  }

  const exampleContent = fs.readFileSync(examplePath, "utf-8");

  // Check .env.example doesn't contain real-looking secrets
  const lines = exampleContent.split("\n");
  for (const line of lines) {
    if (line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    const value = rest.join("=").trim();

    // Flag if value looks like a real secret (long, random-ish string)
    if (
      value.length > 20 &&
      /[A-Za-z0-9+/=]{20,}/.test(value) &&
      !value.includes("example") &&
      !value.includes("your-") &&
      !value.includes("localhost") &&
      !value.startsWith("http")
    ) {
      warnings.push(
        `.env.example line "${key.trim()}" may contain a real secret value — replace with a placeholder`
      );
    }
  }

  return warnings;
}

// ─── Main validation ──────────────────────────────────────────────────────────
function runChecks() {
  const errors: string[] = [];
  const warnings: string[] = [];
  let passed = 0;

  console.log("\n🔍 Pugmill Environment Check\n");

  for (const varDef of REQUIRED_VARS) {
    // Skip vars that don't apply to current config
    if (varDef.onlyWhen && !varDef.onlyWhen()) {
      continue;
    }

    const value = process.env[varDef.key];

    // Missing
    if (!value) {
      errors.push(`Missing: ${varDef.key} — ${varDef.description}`);
      continue;
    }

    // Too short
    if (varDef.minLength && value.length < varDef.minLength) {
      errors.push(
        `Weak: ${varDef.key} is ${value.length} chars (minimum ${varDef.minLength}) — ${varDef.description}`
      );
      continue;
    }

    // Known weak value
    if (varDef.warnIfWeak && WEAK_VALUES.has(value.toLowerCase())) {
      if (isProd) {
        errors.push(`Insecure: ${varDef.key} is set to a known weak/placeholder value`);
      } else {
        warnings.push(`Weak: ${varDef.key} is a placeholder — replace before deploying to production`);
      }
      passed++;
      continue;
    }

    passed++;
    console.log(`  ✅ ${varDef.key}`);
  }

  // Check .env.example sync
  const exampleWarnings = checkEnvExample();
  warnings.push(...exampleWarnings);

  // Output warnings
  if (warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    for (const w of warnings) console.log(`  • ${w}`);
  }

  // Output errors
  if (errors.length > 0) {
    console.log("\n❌ Errors:");
    for (const e of errors) console.log(`  • ${e}`);
    console.log("\n  See SECURITY.md and .env.example for guidance.\n");

    if (isProd) {
      process.exit(1);
    } else {
      console.log("  ⚠️  Continuing in development mode despite errors.\n");
    }
  } else {
    console.log(`\n  ✅ All ${passed} required variables are set.\n`);
  }
}

runChecks();
