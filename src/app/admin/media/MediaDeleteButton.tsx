"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMedia } from "@/lib/actions/media";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function MediaDeleteButton({ id, fileName }: { id: number; fileName?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const label = fileName ? `"${fileName}"` : "this file";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Delete file"
        aria-label={`Delete ${fileName ?? "file"}`}
        className="flex-shrink-0 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded px-1.5 py-0.5 transition"
      >
        ✕
      </button>
      <ConfirmDeleteModal
        open={open}
        itemLabel={label}
        onConfirm={async () => {
          await deleteMedia(id);
          router.refresh();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
