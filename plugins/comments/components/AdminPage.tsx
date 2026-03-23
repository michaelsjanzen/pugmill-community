import { getPendingComments, getAllComments } from "../db";
import { getConfig } from "../../../src/lib/config";
import CommentActions from "./CommentActions";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function CommentsAdminPage({ searchParams }: Props) {
  const filter = (searchParams.filter as string) ?? "pending";
  const [config, comments] = await Promise.all([
    getConfig(),
    filter === "all" ? getAllComments() : getPendingComments(),
  ]);

  const settings = config.modules.pluginSettings?.["comments"] ?? {};
  const moderation = (settings.moderation as string) ?? "manual";

  const pendingCount = filter === "all"
    ? comments.filter(c => !c.approved).length
    : comments.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Comments</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Moderation mode: <span className="font-medium text-zinc-700">{moderation}</span>
            {pendingCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 border border-zinc-200 rounded-lg p-0.5 self-start bg-zinc-50">
          <a
            href="?filter=pending"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter !== "all"
                ? "bg-white text-zinc-900 shadow-sm font-medium"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Pending
          </a>
          <a
            href="?filter=all"
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === "all"
                ? "bg-white text-zinc-900 shadow-sm font-medium"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            All
          </a>
        </div>
      </div>

      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
          <p className="text-zinc-500 text-sm">
            {filter === "all" ? "No comments yet." : "No comments awaiting moderation."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-lg divide-y divide-zinc-100">
          {comments.map(comment => (
            <div key={comment.id} className="p-4 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">{comment.authorName}</span>
                    {comment.authorEmail && (
                      <span className="text-xs text-zinc-400">{comment.authorEmail}</span>
                    )}
                    {!comment.approved && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    )}
                    {comment.parentId && (
                      <span className="text-xs text-zinc-400">↩ reply to #{comment.parentId}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">
                    Post #{comment.postId} · {formatDate(comment.createdAt)}
                  </p>
                </div>

                {/* Actions */}
                <CommentActions commentId={comment.id} approved={comment.approved} />
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
