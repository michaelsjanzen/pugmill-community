"use client";
import { useTransition } from "react";
import { setActiveTheme } from "@/lib/actions/themes";

interface Props {
  id: string;
  name: string;
  version: string;
  description: string;
  isActive: boolean;
  isOnly: boolean;
}

export default function ThemeCard({ id, name, version, description, isActive, isOnly }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleActivate() {
    startTransition(() => setActiveTheme(id));
  }

  return (
    <div className={`bg-white border border-zinc-200 rounded-lg px-5 py-4 flex items-center justify-between gap-4 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-zinc-800">{name}</h3>
          <span className="text-xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">v{version}</span>
          {isActive && (
            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Active</span>
          )}
        </div>
        {description && (
          <p className="text-sm text-zinc-500">{description}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        {isOnly && (
          <span className="text-xs text-zinc-400">Required — at least one theme must be installed</span>
        )}
        {isActive || isOnly ? (
          <span className="text-xs text-zinc-400">Currently active</span>
        ) : (
          <div className="flex items-center gap-2">
            <a
              href={`/api/theme-preview?theme=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 border rounded text-sm text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition"
            >
              Preview
            </a>
            <button
              type="button"
              onClick={handleActivate}
              disabled={isPending}
              className="px-4 py-1.5 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 disabled:opacity-50 transition"
            >
              {isPending ? "Activating…" : "Activate"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
