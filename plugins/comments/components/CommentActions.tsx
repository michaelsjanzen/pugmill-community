"use client";
import { useTransition } from "react";
import { approveComment, deleteComment } from "../actions";

interface Props {
  commentId: number;
  approved: boolean;
}

function dispatchRefresh() {
  window.dispatchEvent(new Event("pugmill:badges:refresh"));
}

export default function CommentActions({ commentId, approved }: Props) {
  const [approvePending, startApprove] = useTransition();
  const [deletePending, startDelete] = useTransition();

  return (
    <div className="flex items-center gap-2 shrink-0">
      {!approved && (
        <button
          disabled={approvePending}
          onClick={() =>
            startApprove(async () => {
              await approveComment(commentId);
              dispatchRefresh();
            })
          }
          className="text-xs px-3 py-1.5 rounded-md bg-[var(--ds-blue-1000)] text-white hover:bg-[var(--ds-blue-900)] transition-colors disabled:opacity-50"
        >
          {approvePending ? "Approving…" : "Approve"}
        </button>
      )}
      <button
        disabled={deletePending}
        onClick={() =>
          startDelete(async () => {
            await deleteComment(commentId);
            dispatchRefresh();
          })
        }
        className="text-xs px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        {deletePending ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
