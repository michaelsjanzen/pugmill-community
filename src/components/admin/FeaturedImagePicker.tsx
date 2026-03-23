"use client";
import { useState } from "react";
import Image from "next/image";
import MediaDropZone, { UploadedMediaItem } from "@/components/admin/MediaDropZone";

interface MediaItem {
  id: number;
  url: string;
  fileName: string;
}

interface Props {
  initialId?: number | null;
  initialUrl?: string | null;
  allMedia: MediaItem[];
  onMediaUploaded?: (item: MediaItem) => void;
}

export default function FeaturedImagePicker({ initialId, initialUrl, allMedia, onMediaUploaded }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(initialId ?? null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(initialUrl ?? null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [localMedia, setLocalMedia] = useState<MediaItem[]>(allMedia);

  function select(item: MediaItem) {
    setSelectedId(item.id);
    setSelectedUrl(item.url);
    setPanelOpen(false);
  }

  function remove() {
    setSelectedId(null);
    setSelectedUrl(null);
  }

  function onUploaded(items: UploadedMediaItem[]) {
    const newItems = items.map(i => ({ id: i.id, url: i.url, fileName: i.fileName }));
    setLocalMedia(prev => [...newItems, ...prev]);
    onMediaUploaded?.(newItems[0]);
    select(newItems[0]);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-700">Featured Image</label>

      {selectedId !== null && (
        <input type="hidden" name="featuredImage" value={selectedId} />
      )}

      {selectedUrl ? (
        <div className="relative w-full aspect-[2/1] max-w-sm rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
          <Image
            src={selectedUrl}
            alt="Featured image"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
          />
          <button
            type="button"
            onClick={remove}
            className="absolute top-2 right-2 bg-white border border-zinc-300 rounded-full w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:border-red-300 shadow-sm transition text-xs leading-none"
            aria-label="Remove featured image"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className="flex items-center justify-center w-full aspect-[2/1] max-w-sm rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 text-sm cursor-pointer hover:border-zinc-400 hover:text-zinc-600 transition"
          onClick={() => setPanelOpen(v => !v)}
        >
          No image selected
        </div>
      )}

      <button
        type="button"
        onClick={() => setPanelOpen(v => !v)}
        className="text-xs px-3 py-1.5 rounded border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 transition"
      >
        {selectedUrl ? "Change image" : "Choose from library"}
      </button>

      {/* Inline panel */}
      {panelOpen && (
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-100 bg-zinc-50">
            <span className="text-xs font-medium text-zinc-600">Media Library</span>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="text-zinc-400 hover:text-zinc-700 transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-3 space-y-3">
            <MediaDropZone onUploaded={onUploaded} compact />

            {localMedia.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
                {localMedia.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(item)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      selectedId === item.id
                        ? "border-zinc-900 ring-2 ring-zinc-200"
                        : "border-zinc-200 hover:border-zinc-500"
                    }`}
                    title={item.fileName}
                  >
                    <Image
                      src={item.url}
                      alt={item.fileName}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 text-center py-4">No images uploaded yet. Drop one above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
