"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/lib/actions/users";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";

export default function DeleteUserButton({ id, name }: { id: string; name?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const label = name ? `user "${name}"` : "this user";

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
          await deleteUser(id);
          router.refresh();
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
