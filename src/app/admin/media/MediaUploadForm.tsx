"use client";
import { useRouter } from "next/navigation";
import MediaDropZone from "@/components/admin/MediaDropZone";

export default function MediaUploadForm() {
  const router = useRouter();
  return (
    <MediaDropZone
      multiple
      onUploaded={() => router.refresh()}
    />
  );
}
