"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
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

const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().max(100).optional(),
});

export async function createTag(formData: FormData) {
  await requireAdmin();
  const result = tagSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
  });
  if (!result.success) throw new Error(result.error.issues.map(i => i.message).join(", "));

  const slug = result.data.slug || toSlug(result.data.name);
  await db.insert(tags).values({ name: result.data.name, slug } as typeof tags.$inferInsert);

  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function updateTag(id: number, formData: FormData) {
  await requireAdmin();
  const result = tagSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || undefined,
  });
  if (!result.success) throw new Error(result.error.issues.map(i => i.message).join(", "));

  const slug = result.data.slug || toSlug(result.data.name);
  await db.update(tags).set({ name: result.data.name, slug }).where(eq(tags.id, id));

  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function deleteTag(id: number) {
  await requireAdmin();
  await db.delete(tags).where(eq(tags.id, id));
  revalidatePath("/admin/tags");
}

// Inline variant — returns the created record instead of redirecting
export async function createTagInline(name: string): Promise<{ id: number; name: string; slug: string }> {
  await requireAdmin();
  const result = tagSchema.safeParse({ name: name.trim() });
  if (!result.success) throw new Error(result.error.issues.map(i => i.message).join(", "));
  const slug = toSlug(result.data.name);
  const [created] = await db.insert(tags)
    .values({ name: result.data.name, slug } as typeof tags.$inferInsert)
    .returning({ id: tags.id, name: tags.name, slug: tags.slug });
  revalidatePath("/admin/tags");
  return created;
}
