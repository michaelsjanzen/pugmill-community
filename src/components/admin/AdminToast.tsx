"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Map ?toast= values to human-readable messages.
// Add new keys here as more server actions adopt the pattern.
const MESSAGES: Record<string, string> = {
  saved:       "Changes saved",
  created:     "Created successfully",
  deleted:     "Deleted",
  activated:   "Activated",
  deactivated: "Deactivated",
};

export default function AdminToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setVisible(false);
  };

  useEffect(() => {
    const key = searchParams.get("toast");
    if (!key) return;

    setMessage(MESSAGES[key] ?? "Done");
    setVisible(true);

    // Strip the param from the URL immediately (no page reload)
    const next = new URLSearchParams(searchParams.toString());
    next.delete("toast");
    const qs = next.toString();
    router.replace(pathname + (qs ? `?${qs}` : ""), { scroll: false });

    // Auto-dismiss after 3 s
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 3000);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [searchParams]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed bottom-5 right-5 z-50
        flex items-center gap-3
        bg-zinc-900 text-white
        pl-4 pr-3 py-2.5 rounded-lg shadow-xl
        text-sm font-medium
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}
      `}
    >
      {/* Success checkmark */}
      <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>

      {message}

      {/* Manual dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="ml-1 p-0.5 rounded text-zinc-400 hover:text-white transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
