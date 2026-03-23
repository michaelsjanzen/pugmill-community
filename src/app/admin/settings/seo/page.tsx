import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { like, desc } from "drizzle-orm";
import { getConfig, updateConfig } from "@/lib/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PageShell, Field, SaveButton } from "../_components";
import MediaUrlPicker from "@/components/admin/MediaUrlPicker";
import SiteAeoEditor from "./SiteAeoEditor";

export default async function SearchDiscoveryPage({ searchParams }: { searchParams: Promise<{ toast?: string }> }) {
  const [config, sp, allMedia] = await Promise.all([
    getConfig(),
    searchParams,
    db.select({ id: media.id, url: media.url, fileName: media.fileName })
      .from(media)
      .where(like(media.fileType, "image/%"))
      .orderBy(desc(media.createdAt)),
  ]);
  const saved = sp.toast === "saved";
  const seo = config.site.seoDefaults ?? {};
  const aeo = config.site.aeoDefaults ?? {};

  async function saveAll(formData: FormData) {
    "use server";
    const current = await getConfig();

    let questions: { q: string; a: string }[] = [];
    try {
      const raw = formData.get("aeoQuestions") as string;
      if (raw) questions = JSON.parse(raw);
    } catch { /* keep empty */ }

    await updateConfig({
      ...current,
      site: {
        ...current.site,
        seoDefaults: {
          ogImage: (formData.get("ogImage") as string) || undefined,
          metaDescription: (formData.get("seoMetaDescription") as string) || undefined,
        },
        aeoDefaults: {
          summary: (formData.get("aeoSummary") as string) || undefined,
          questions: questions.filter((qa): qa is { q: string; a: string } => !!qa.q.trim() && !!qa.a.trim()),
          organization: {
            name: (formData.get("aeoOrgName") as string) || undefined,
            type: (formData.get("aeoOrgType") as string) || "Organization",
            description: (formData.get("aeoOrgDescription") as string) || undefined,
            url: (formData.get("aeoOrgUrl") as string) || undefined,
          },
        },
      },
    });
    revalidatePath("/admin/settings/seo");
    redirect("/admin/settings/seo?toast=saved");
  }

  return (
    <PageShell
      title="Search & Discovery"
      description="Control how search engines and AI crawlers understand your site."
      saved={saved}
    >
      <form action={saveAll} className="space-y-6">

        {/* Traditional SEO */}
        <section className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Traditional SEO</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Fallback values used on pages without their own SEO metadata.</p>
          </div>
          <MediaUrlPicker
            label="Fallback OG Image"
            name="ogImage"
            defaultValue={seo.ogImage ?? ""}
            hint="Used on pages without a featured image. Recommended size: 1200×630px."
            allMedia={allMedia}
          />
          <Field
            label="Fallback Meta Description"
            name="seoMetaDescription"
            defaultValue={seo.metaDescription ?? ""}
            hint="Used on pages without an excerpt. Keep under 160 characters."
            textarea
          />
        </section>

        {/* Site AEO */}
        <section className="bg-white border border-zinc-200 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">AI Engine Optimization (AEO)</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Site-level data surfaced in llms.txt and structured data for AI crawlers.</p>
          </div>
          <SiteAeoEditor
            defaultSummary={aeo.summary}
            defaultQuestions={aeo.questions}
            defaultOrganization={aeo.organization}
            isAiEnabled={!!config.ai?.provider}
          />
        </section>

        <SaveButton />
      </form>
    </PageShell>
  );
}
