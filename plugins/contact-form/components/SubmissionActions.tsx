"use client";

import { useTransition } from "react";
import { markSubmissionRead, deleteSubmission } from "../actions";

interface Props {
  submissionId: number;
  isRead: boolean;
}

function dispatchRefresh() {
  window.dispatchEvent(new Event("pugmill:badges:refresh"));
}

export default function SubmissionActions({ submissionId, isRead }: Props) {
  const [readPending, startRead] = useTransition();
  const [deletePending, startDelete] = useTransition();

  return (
    <div className="flex items-center gap-2 shrink-0">
      {!isRead && (
        <button
          disabled={readPending}
          onClick={() =>
            startRead(async () => {
              await markSubmissionRead(submissionId);
              dispatchRefresh();
            })
          }
          className="text-xs px-3 py-1.5 rounded-md bg-[var(--ds-blue-1000)] text-white hover:bg-[var(--ds-blue-900)] transition-colors disabled:opacity-50"
        >
          {readPending ? "Marking…" : "Mark read"}
        </button>
      )}
      <button
        disabled={deletePending}
        onClick={() =>
          startDelete(async () => {
            await deleteSubmission(submissionId);
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
