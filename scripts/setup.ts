import "./_load-env";
import { db } from "../src/lib/db";
import { adminUsers } from "../src/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import * as readline from "readline";
import { seedDefaultContent } from "../seeds/default-content";

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer); }));
}

async function setup() {
  console.log("\n🚀 Pugmill Setup\n");

  // Check if admin already exists
  const existing = await db.select().from(adminUsers).limit(1);
  if (existing.length > 0) {
    console.log("✅ Admin account already exists. Setup complete.");
    process.exit(0);
  }

  // Use env vars if set (for automated/agent setups), otherwise prompt
  const email = process.env.ADMIN_EMAIL || await prompt("Admin email: ");
  const password = process.env.ADMIN_PASSWORD || await prompt("Admin password (min 8 chars): ");
  const name = process.env.ADMIN_NAME || await prompt("Your name (optional): ");

  if (!email || !password) {
    console.error("❌ Email and password are required.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(adminUsers).values({
    email,
    name: name || "Admin",
    passwordHash,
    role: "admin",
  } as typeof adminUsers.$inferInsert);

  console.log(`\n✅ Admin account created for ${email}`);
  console.log("   Visit /admin/login to sign in.\n");

  // Seed CMS config to database (no-op if already seeded)
  console.log("Seeding CMS configuration...");
  const { getConfig } = await import("../src/lib/config");
  await getConfig(); // This auto-seeds on first call
  console.log("✅ CMS configuration ready.");

  // Seed default content (no-op if posts already exist)
  console.log("Seeding default content...");
  const created = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  await seedDefaultContent(created[0].id);

  process.exit(0);
}

setup().catch(err => {
  console.error("Setup failed:", err);
  process.exit(1);
});
