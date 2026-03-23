"use client";
import { useTransition, useEffect, useRef } from "react";

interface Props {
  open: boolean;
  /** Shown as "Delete {itemLabel}?" — e.g. "this post", "category 'Technology'" */
  itemLabel: string;
  onConfirm: () => Promise<void> | void;
  onClose: () => void;
}

/**
 * Accessible confirmation modal for destructive delete actions.
 * Replaces browser confirm() across all admin delete buttons.
 *
 * - Focuses Cancel on open so Enter doesn't accidentally confirm.
 * - Disables both buttons while the delete is in-flight.
 * - Closes automatically after onConfirm resolves.
 * - Clicking the backdrop or pressing Escape closes the modal.
 */
export default function ConfirmDeleteModal({ open, itemLabel, onConfirm, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus Cancel when modal opens so Enter doesn't trigger Delete by accident.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm();
      onClose();
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="confirm-delete-title" className="text-base font-semibold text-zinc-900">
          Delete {itemLabel}?
        </h2>
        <p className="text-sm text-zinc-500">This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
