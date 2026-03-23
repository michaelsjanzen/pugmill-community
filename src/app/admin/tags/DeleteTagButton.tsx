"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTag } from "@/lib/actions/tags";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function DeleteTagButton({ id, name }: { id: number; name?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const label = name ? `tag "${name}"` : "this tag";

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
          await deleteTag(id);
          router.refresh();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
