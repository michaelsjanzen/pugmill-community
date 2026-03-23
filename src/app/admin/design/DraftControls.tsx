"use client";
import { useTransition } from "react";
import { publishDesign, discardDraft } from "@/lib/actions/design";
import { useDesignSave } from "./DesignSaveContext";

// ─── Banner ───────────────────────────────────────────────────────────────────

export function DraftBanner({ hasDraft }: { hasDraft: boolean }) {
  if (!hasDraft) return null;
  return (
    <div className="bg-amber-700 rounded-lg px-4 py-3 text-sm text-white">
      You have unpublished draft changes. Use the Publish button to make them live, or Discard to revert.
    </div>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────────────────

export function PublishActions({ hasDraft }: { hasDraft: boolean }) {
  const [isPublishing, startPublish] = useTransition();
  const [isDiscarding, startDiscard] = useTransition();
  const { isSaving } = useDesignSave();

  return (
    <div className="flex items-center gap-2">
      {hasDraft && (
        <>
          <a
            href="/api/design-preview"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg text-zinc-600 hover:bg-zinc-50 transition"
          >
            Preview ↗
          </a>
          <form action={() => startDiscard(() => discardDraft())}>
            <button
              type="submit"
              disabled={isDiscarding || isPublishing || isSaving}
              className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition disabled:opacity-50"
            >
              {isDiscarding ? "Discarding…" : "Discard"}
            </button>
          </form>
        </>
      )}
      <form action={() => startPublish(() => publishDesign())}>
        <button
          type="submit"
          disabled={isPublishing || isDiscarding || isSaving}
          className={`px-4 py-1.5 text-sm rounded-lg transition disabled:opacity-50 ${
            hasDraft
              ? "bg-zinc-900 text-white hover:bg-zinc-700"
              : "bg-zinc-100 text-zinc-400 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-500"
          }`}
        >
          {isPublishing ? "Publishing…" : "Publish"}
        </button>
      </form>
    </div>
  );
}
