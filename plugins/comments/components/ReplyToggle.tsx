"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";

interface Props {
  postId: number;
  parentId: number;
  requireEmail: boolean;
}

export default function ReplyToggle({ postId, parentId, requireEmail }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs"
        style={{ color: "var(--color-muted)" }}
      >
        Reply
      </button>
    );
  }

  return (
    <CommentForm
      postId={postId}
      parentId={parentId}
      requireEmail={requireEmail}
      onCancel={() => setOpen(false)}
    />
  );
}
