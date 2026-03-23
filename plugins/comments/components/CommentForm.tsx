"use client";

import { useActionState } from "react";
import { submitComment, type CommentFormState } from "../actions";

interface Props {
  postId: number;
  parentId?: number;
  onCancel?: () => void;
  requireEmail: boolean;
}

const initial: CommentFormState = { status: "idle", message: "" };

export default function CommentForm({ postId, parentId, onCancel, requireEmail }: Props) {
  const [state, action, isPending] = useActionState(submitComment, initial);

  if (state.status === "success") {
    return (
      <div
        className="rounded-lg border p-4 text-sm"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-muted)",
        }}
      >
        {state.message}
        {!state.pending && (
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline"
            style={{ color: "var(--color-link)" }}
          >
            Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      {parentId != null && <input type="hidden" name="parentId" value={parentId} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor={`name-${postId}-${parentId ?? "root"}`}
            className="block text-xs font-medium mb-1"
            style={{ color: "var(--color-muted)" }}
          >
            Name <span style={{ color: "var(--color-foreground)" }}>*</span>
          </label>
          <input
            id={`name-${postId}-${parentId ?? "root"}`}
            name="authorName"
            type="text"
            required
            maxLength={100}
            placeholder="Your name"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }}
          />
        </div>
        <div>
          <label
            htmlFor={`email-${postId}-${parentId ?? "root"}`}
            className="block text-xs font-medium mb-1"
            style={{ color: "var(--color-muted)" }}
          >
            Email {requireEmail && <span style={{ color: "var(--color-foreground)" }}>*</span>}
          </label>
          <input
            id={`email-${postId}-${parentId ?? "root"}`}
            name="authorEmail"
            type="email"
            required={requireEmail}
            maxLength={255}
            placeholder={requireEmail ? "you@example.com" : "you@example.com (optional)"}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`content-${postId}-${parentId ?? "root"}`}
          className="block text-xs font-medium mb-1"
          style={{ color: "var(--color-muted)" }}
        >
          Comment <span style={{ color: "var(--color-foreground)" }}>*</span>
        </label>
        <textarea
          id={`content-${postId}-${parentId ?? "root"}`}
          name="content"
          required
          rows={parentId != null ? 3 : 4}
          placeholder="Share your thoughts…"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 resize-y"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm" style={{ color: "#dc2626" }}>
          {state.message}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-md text-sm font-medium transition-opacity disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-foreground)",
            color: "var(--color-background)",
          }}
        >
          {isPending ? "Posting…" : parentId != null ? "Post reply" : "Post comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
