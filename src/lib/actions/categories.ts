"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/get-current-user";
import { z } from "zod";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  return user;
}

function toSlug(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const result = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
  });
  if (!result.success) throw new Error(result.error.issues.map(i => i.message).join(", "));

  const slug = result.data.slug || toSlug(result.data.name);
  await db.insert(categories).values({ name: result.data.name, slug, description: result.data.description } as typeof categories.$inferInsert);

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: number, formData: FormData) {
  await requireAdmin();
  const result = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
  });
  if (!result.success) throw new Error(result.error.issues.map(i => i.message).join(", "));

  const slug = result.data.slug || toSlug(result.data.name);
  await db.update(categories).set({ name: result.data.name, slug, description: result.data.description } as Partial<typeof categories.$inferInsert>).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

// Inline variant — returns the created record instead of redirecting
export async function createCategoryInline(name: string): Promise<{ id: number; name: string; slug: string }> {
  await requireAdmin();
  const result = categorySchema.safeParse({ name: name.trim() });
  if (!result.success) throw new Error(result.error.issues.map(i => i.message).join(", "));
  const slug = toSlug(result.data.name);
  const [created] = await db.insert(categories)
    .values({ name: result.data.name, slug } as typeof categories.$inferInsert)
    .returning({ id: categories.id, name: categories.name, slug: categories.slug });
  revalidatePath("/admin/categories");
  return created;
}
