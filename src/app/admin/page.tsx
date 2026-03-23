import { db } from "@/lib/db";
import { posts, media, adminUsers, sessions } from "@/lib/db/schema";
import { sql, gte, isNotNull, notInArray } from "drizzle-orm";
import DashboardCharts from "@/components/admin/DashboardCharts";

function buildMonthlyBuckets(n: number): { key: string; label: string }[] {
  const result: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short" });
    result.push({ key, label });
  }
  return result;
}

export default async function AdminDashboard() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  twelveMonthsAgo.setDate(1);

  // Subquery for used media IDs
  const usedMediaIds = db
    .select({ id: posts.featuredImage })
    .from(posts)
    .where(isNotNull(posts.featuredImage));

  const [counts, totalMediaRows, unusedMediaRows, monthlyRaw, allUsers, lastActiveSessions] =
    await Promise.all([
      db
        .select({
          type: posts.type,
          published: posts.published,
          count: sql<number>`count(*)::int`,
        })
        .from(posts)
        .groupBy(posts.type, posts.published),

      db.select({ id: media.id }).from(media),

      db.select({ id: media.id }).from(media).where(notInArray(media.id, usedMediaIds)),

      db
        .select({
          month: sql<string>`TO_CHAR(DATE_TRUNC('month', ${posts.createdAt}), 'YYYY-MM')`,
          type: posts.type,
          count: sql<number>`count(*)::int`,
        })
        .from(posts)
        .where(gte(posts.createdAt, twelveMonthsAgo))
        .groupBy(sql`DATE_TRUNC('month', ${posts.createdAt})`, posts.type)
        .orderBy(sql`DATE_TRUNC('month', ${posts.createdAt})`),

      db
        .select({
          id: adminUsers.id,
          name: adminUsers.name,
          email: adminUsers.email,
          role: adminUsers.role,
          createdAt: adminUsers.createdAt,
        })
        .from(adminUsers)
        .orderBy(adminUsers.createdAt),

      // Most recent session per user — expires ≈ lastLogin + 30 days
      db
        .select({
          userId: sessions.userId,
          lastExpires: sql<Date>`MAX(${sessions.expires})`,
        })
        .from(sessions)
        .groupBy(sessions.userId),
    ]);

  const buckets = buildMonthlyBuckets(12);
  const monthlyIndex: Record<string, { posts: number; pages: number }> = {};
  for (const b of buckets) monthlyIndex[b.key] = { posts: 0, pages: 0 };
  for (const row of monthlyRaw) {
    if (monthlyIndex[row.month]) {
      if (row.type === "post") monthlyIndex[row.month].posts = row.count;
      if (row.type === "page") monthlyIndex[row.month].pages = row.count;
    }
  }
  const monthly = buckets.map(b => ({ month: b.label, ...monthlyIndex[b.key] }));

  const sum = (type: string, published?: boolean) =>
    counts
      .filter(r => r.type === type && (published === undefined || r.published === published))
      .reduce((acc, r) => acc + r.count, 0);

  const postStatus = [
    { name: "Published", value: sum("post", true) },
    { name: "Draft", value: sum("post", false) },
  ];
  const pageStatus = [
    { name: "Published", value: sum("page", true) },
    { name: "Draft", value: sum("page", false) },
  ];

  // Build user list with approximate last-active derived from session expiry
  // NextAuth default session maxAge is 30 days; expires = createdAt + 30d
  const SESSION_MAXAGE_MS = 30 * 24 * 60 * 60 * 1000;
  const sessionMap = new Map(
    lastActiveSessions.map(s => [
      s.userId,
      new Date(new Date(s.lastExpires).getTime() - SESSION_MAXAGE_MS),
    ]),
  );

  const users = allUsers.map(u => ({
    ...u,
    lastActive: sessionMap.get(u.id) ?? null,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-800">Dashboard</h2>
      <DashboardCharts
        monthly={monthly}
        postStatus={postStatus}
        pageStatus={pageStatus}
        totalMedia={totalMediaRows.length}
        unusedMedia={unusedMediaRows.length}
        users={users}
      />
    </div>
  );
}
