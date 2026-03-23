"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/lib/actions/categories";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function DeleteCategoryButton({ id, name }: { id: number; name?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const label = name ? `category "${name}"` : "this category";

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
          await deleteCategory(id);
          router.refresh();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
