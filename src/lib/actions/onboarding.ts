"use server";
import { revalidatePath } from "next/cache";
import { getConfig, updateConfig } from "@/lib/config";
import { getCurrentUser } from "@/lib/get-current-user";

export async function dismissOnboarding(): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");
  const config = await getConfig();
  await updateConfig({ system: { ...config.system, onboardingDismissed: true } });
  revalidatePath("/admin");
}
