"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/actions/posts";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export function DeletePostButton({ id, title }: { id: number; title?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const label = title ? `"${title}"` : "this post";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-red-500 hover:text-red-700 transition-colors"
      >
        Delete
      </button>
      <ConfirmDeleteModal
        open={open}
        itemLabel={label}
        onConfirm={async () => {
          await deletePost(id);
          router.refresh();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
