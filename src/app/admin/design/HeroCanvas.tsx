"use client";
import { useState, useRef, useEffect, useTransition } from "react";
import type { HeroConfig } from "../../../../themes/default/design";
import type { UploadedMediaItem } from "@/components/admin/MediaDropZone";
import { uploadMedia } from "@/lib/actions/media";

interface MediaItem { id: number; url: string; fileName: string; }

interface Props {
  initialConfig: HeroConfig;
  allMedia: MediaItem[];
  saveAction: (partial: Record<string, string>) => Promise<void>;
  embedded?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "").padEnd(6, "0");
  return [0, 2, 4].map(i => parseInt(clean.slice(i, i + 2), 16)).join(" ");
}

function overlayBg(config: HeroConfig): string {
  const rgb = hexToRgb(config.overlayColor || "#000000");
  const opacity = config.overlayOpacity / 100;
  const solid = `rgb(${rgb} / ${opacity})`;
  const clear = `rgb(${rgb} / 0)`;
  return {
    flat: solid,
    "gradient-up": `linear-gradient(to top, ${solid}, ${solid} 25%, ${clear})`,
    "gradient-down": `linear-gradient(to bottom, ${solid}, ${solid} 25%, ${clear})`,
  }[config.overlayStyle] ?? solid;
}

function heroToRecord(c: HeroConfig): Record<string, string> {
  return {
    heroEnabled: c.enabled ? "true" : "false",
    heroHeight: c.height,
    heroImageUrl: c.imageUrl,
    heroOverlayColor: c.overlayColor,
    heroOverlayStyle: c.overlayStyle,
    heroOverlayOpacity: String(c.overlayOpacity),
    heroShowHeadline: c.showHeadline ? "true" : "false",
    heroHeadline: c.headline,
    heroShowSubheadline: c.showSubheadline ? "true" : "false",
    heroSubheadline: c.subheadline,
    heroContentAlign: c.contentAlign,
    heroContentPosition: c.contentPosition,
    heroCta1Enabled: c.cta1Enabled ? "true" : "false",
    heroCta1Text: c.cta1Text,
    heroCta1Url: c.cta1Url,
    heroCta1Style: c.cta1Style,
    heroCta2Enabled: c.cta2Enabled ? "true" : "false",
    heroCta2Text: c.cta2Text,
    heroCta2Url: c.cta2Url,
    heroCta2Style: c.cta2Style,
  };
}

const heightClass: Record<string, string> = {
  short: "min-h-[40vh]",
  medium: "min-h-[60vh]",
  tall: "min-h-[80vh]",
  full: "min-h-screen",
};

const justifyClass: Record<string, string> = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
};

// ─── Contenteditable hook ─────────────────────────────────────────────────────

function useEditable(value: string, onCommit: (v: string) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current && ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  });

  return {
    ref,
    contentEditable: true as const,
    suppressContentEditableWarning: true,
    onFocus: () => { focused.current = true; },
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
      focused.current = false;
      const text = e.currentTarget.textContent ?? "";
      if (text !== value) onCommit(text);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
      if (e.key === "Escape") {
        if (ref.current) ref.current.textContent = value;
        e.currentTarget.blur();
      }
    },
  };
}

// ─── Upload zone styled for dark panels ───────────────────────────────────────

function DarkUploadZone({ onUploaded }: { onUploaded: (items: UploadedMediaItem[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!arr.length) return;
    setUploading(true);
    setError(null);
    const uploaded: UploadedMediaItem[] = [];
    try {
      for (const file of arr) {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadMedia(fd);
        if ("error" in result && result.error) { setError(result.error); }
        else if (result.id && result.url) { uploaded.push({ id: result.id, url: result.url, fileName: file.name }); }
      }
    } catch (err) {
      console.error("[HeroCanvas] upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
    setUploading(false);
    if (uploaded.length) onUploaded(uploaded);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-colors text-sm select-none ${
          dragging ? "border-white/60 bg-white/10 text-white" : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? "Uploading…" : dragging ? "Drop to upload" : "Drop or click to upload"}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); }} />
    </div>
  );
}

// ─── Eye toggle icon ──────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

// ─── CTA Popover ──────────────────────────────────────────────────────────────

function CtaPopover({
  text, url, style,
  onText, onUrl, onStyle, onRemove, onClose,
}: {
  text: string; url: string; style: "filled" | "outline";
  onText: (v: string) => void; onUrl: (v: string) => void;
  onStyle: (v: "filled" | "outline") => void;
  onRemove: () => void; onClose: () => void;
}) {
  const isExternal = /^https?:\/\//i.test(url);
  return (
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-30 bg-white rounded-xl shadow-xl border border-zinc-200 p-3 w-64">
      <div className="space-y-2">
        <input
          value={text}
          onChange={e => onText(e.target.value)}
          placeholder="Button label"
          className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs select-none">
            {url === "" ? "" : isExternal ? "↗" : "→"}
          </span>
          <input
            value={url}
            onChange={e => onUrl(e.target.value)}
            placeholder="/page or https://…"
            className="w-full border border-zinc-200 rounded-lg pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>
        <p className="text-xs text-zinc-600">
          {isExternal ? "Opens in a new tab" : url ? "Links to a page on this site" : "Enter a path like /about or a full URL"}
        </p>
        <div className="flex gap-1">
          {(["filled", "outline"] as const).map(s => (
            <button
              key={s} type="button"
              onClick={() => onStyle(s)}
              className={`flex-1 py-1.5 text-xs rounded-lg capitalize font-medium transition-colors ${
                style === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button" onClick={onRemove}
          className="w-full text-xs text-red-500 hover:text-red-700 py-1 transition-colors"
        >
          Remove button
        </button>
      </div>
      <button
        type="button" onClick={onClose}
        className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700 text-lg leading-none"
        aria-label="Close"
      >×</button>
    </div>
  );
}

// ─── Control Panel ────────────────────────────────────────────────────────────

function ControlPanel({
  config,
  update,
  onOpenLibrary,
}: {
  config: HeroConfig;
  update: (p: Partial<HeroConfig>) => void;
  onOpenLibrary: () => void;
}) {
  return (
    <div className="w-52 shrink-0 space-y-5 self-start">

      {/* Image */}
      <div>
        <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">Image</p>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onOpenLibrary}
            className="w-full py-1.5 text-xs rounded-lg font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            {config.imageUrl ? "Change image" : "Add image"}
          </button>
          {config.imageUrl && (
            <button
              type="button"
              onClick={() => update({ imageUrl: "" })}
              className="w-full py-1.5 text-xs rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              Remove image
            </button>
          )}
        </div>
      </div>

      {/* Height */}
      <div>
        <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">Height</p>
        <div className="grid grid-cols-4 gap-1">
          {([["short","S"],["medium","M"],["tall","T"],["full","F"]] as const).map(([h, label]) => (
            <button
              key={h} type="button"
              onClick={() => update({ height: h })}
              className={`py-1.5 text-xs rounded-lg font-medium transition-colors ${
                config.height === h ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div>
        <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">Overlay</p>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="color"
            value={config.overlayColor}
            onChange={e => update({ overlayColor: e.target.value })}
            className="h-7 w-7 rounded cursor-pointer border border-zinc-200 p-0.5 shrink-0"
            title="Overlay color"
          />
          <input
            type="range" min={0} max={90} step={10}
            value={config.overlayOpacity}
            onChange={e => update({ overlayOpacity: Number(e.target.value) })}
            className="flex-1 accent-zinc-900"
          />
          <span className="text-xs text-zinc-400 w-8 text-right shrink-0">{config.overlayOpacity}%</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {([
            ["gradient-up", "↑ Fade"],
            ["gradient-down", "↓ Fade"],
            ["flat", "Flat"],
          ] as const).map(([val, label]) => (
            <button
              key={val} type="button"
              onClick={() => update({ overlayStyle: val })}
              className={`py-1.5 text-xs rounded-lg font-medium transition-colors ${
                config.overlayStyle === val ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Position */}
      <div>
        <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">Content position</p>
        <div className="grid grid-cols-3 gap-1 mb-1.5">
          {(["top", "center", "bottom"] as const).map(p => (
            <button
              key={p} type="button"
              onClick={() => update({ contentPosition: p })}
              className={`py-1.5 text-xs rounded-lg capitalize font-medium transition-colors ${
                config.contentPosition === p ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          {(["left", "center"] as const).map(a => (
            <button
              key={a} type="button"
              onClick={() => update({ contentAlign: a })}
              className={`py-1.5 text-xs rounded-lg capitalize font-medium transition-colors ${
                config.contentAlign === a ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {a === "left" ? "⟵ Left" : "⊕ Center"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function HeroCanvas({ initialConfig, allMedia, saveAction, embedded = false }: Props) {
  const [config, setConfig] = useState<HeroConfig>(initialConfig);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<"cta1" | "cta2" | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [localMedia, setLocalMedia] = useState<MediaItem[]>(allMedia);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [, startTransition] = useTransition();

  // Cancel any pending auto-save when the component unmounts (e.g. after
  // publish/discard redirect) to prevent a stale save from re-creating the
  // draft after it has been promoted to published or discarded.
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  // Auto-save with 600ms debounce
  function update(partial: Partial<HeroConfig>) {
    setConfig(prev => {
      const next = { ...prev, ...partial };
      clearTimeout(saveTimer.current);
      setSaveStatus("saving");
      saveTimer.current = setTimeout(() => {
        startTransition(async () => {
          await saveAction(heroToRecord(next));
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        });
      }, 600);
      return next;
    });
    // Close popover if clicking elsewhere
    if (!("cta1Text" in partial || "cta1Url" in partial || "cta1Style" in partial ||
          "cta2Text" in partial || "cta2Url" in partial || "cta2Style" in partial)) {
      setActivePopover(null);
    }
  }

  function handleUploaded(items: UploadedMediaItem[]) {
    const mapped = items.map(i => ({ id: i.id, url: i.url, fileName: i.fileName }));
    setLocalMedia(prev => [...mapped, ...prev]);
    update({ imageUrl: mapped[0].url });
    setLibraryOpen(false);
  }

  const headlineEditProps = useEditable(config.headline, v => update({ headline: v }));
  const subheadlineEditProps = useEditable(config.subheadline, v => update({ subheadline: v }));

  const canvasJustify = justifyClass[config.contentPosition] ?? "justify-end";
  const canvasHeight = heightClass[config.height] ?? "min-h-[60vh]";
  const alignClasses = config.contentAlign === "center" ? "items-center text-center" : "items-start text-left";
  const ctaAlign = config.contentAlign === "center" ? "justify-center" : "";

  const ctaBtnClass = (style: "filled" | "outline") =>
    style === "outline"
      ? "px-5 py-2.5 rounded-lg border-2 border-white text-white text-sm font-semibold hover:bg-white/15 transition-colors"
      : "px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-sm font-semibold hover:bg-white/90 transition-colors";

  const inner = (
    <>
      {/* Header / toggle row */}
      <div className={`flex items-center justify-between px-5 border-zinc-100 ${
        embedded ? "py-3 border-t" : "py-4 border-b"
      }`}>
        <div>
          {embedded
            ? <span className="text-sm font-semibold text-zinc-700">Hero Section</span>
            : <h3 className="text-base font-semibold text-zinc-800">Hero Section</h3>
          }
          <p className="text-xs text-zinc-600 mt-0.5">Full-width banner at the top of your homepage</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "saving" && <span className="text-xs text-zinc-400">Saving…</span>}
          {saveStatus === "saved" && <span className="text-xs text-emerald-600 font-medium">Saved</span>}
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{config.enabled ? "On" : "Off"}</span>
            <button
              type="button"
              role="switch"
              aria-checked={config.enabled}
              onClick={() => update({ enabled: !config.enabled })}
              className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                config.enabled ? "bg-zinc-900" : "bg-zinc-200"
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                config.enabled ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas + control panel */}
      {config.enabled && (
        <div className="flex gap-4 p-4">

          {/* Canvas */}
          <div className="flex-1 min-w-0">

            <div
              className={`relative flex flex-col ${canvasJustify} ${canvasHeight} rounded-xl overflow-hidden`}
              style={config.imageUrl
                ? { backgroundImage: `url(${config.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : { backgroundColor: "var(--color-accent, #2563eb)" }
              }
            >
              {/* Overlay */}
              {config.imageUrl && (
                <div className="absolute inset-0 pointer-events-none" style={{ background: overlayBg(config) }} />
              )}

              {/* Library picker panel (slides in over canvas) */}
              {libraryOpen && (
                <div className="absolute inset-0 z-20 bg-zinc-950/95 flex flex-col rounded-xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
                    <span className="text-sm font-medium text-white">Choose background image</span>
                    <button type="button" onClick={() => setLibraryOpen(false)} className="text-white/50 hover:text-white text-xl leading-none">×</button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <DarkUploadZone onUploaded={handleUploaded} />
                    {localMedia.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {localMedia.map(item => (
                          <button
                            key={item.id} type="button"
                            onClick={() => { update({ imageUrl: item.url }); setLibraryOpen(false); }}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                              config.imageUrl === item.url ? "border-white" : "border-transparent hover:border-white/60"
                            }`}
                            title={item.fileName}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.url} alt={item.fileName} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/40 text-sm text-center py-4">No images yet — drop one above.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Content block */}
              {!libraryOpen && (
                <div className={`relative z-10 w-full px-8 py-10 flex flex-col gap-4 ${alignClasses}`}>

                  {/* Headline */}
                  <div className="group/headline relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => update({ showHeadline: !config.showHeadline })}
                      className="shrink-0 p-1 rounded text-white/40 hover:text-white/80 transition-colors opacity-0 group-hover/headline:opacity-100"
                      title={config.showHeadline ? "Hide headline" : "Show headline"}
                    >
                      <EyeIcon open={config.showHeadline} />
                    </button>
                    {config.showHeadline ? (
                      <div
                        {...headlineEditProps}
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight outline-none cursor-text rounded px-1 -mx-1 hover:bg-white/10 focus:bg-white/10 transition-colors min-w-[4ch]"
                      />
                    ) : (
                      <div
                        className="text-3xl sm:text-4xl font-bold text-white/25 italic cursor-pointer px-1 rounded hover:bg-white/10 transition-colors"
                        onClick={() => update({ showHeadline: true })}
                      >
                        {config.headline || "Headline"}
                      </div>
                    )}
                  </div>

                  {/* Subheadline */}
                  <div className="group/sub relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => update({ showSubheadline: !config.showSubheadline })}
                      className="shrink-0 p-1 rounded text-white/40 hover:text-white/80 transition-colors opacity-0 group-hover/sub:opacity-100"
                      title={config.showSubheadline ? "Hide subheadline" : "Show subheadline"}
                    >
                      <EyeIcon open={config.showSubheadline} />
                    </button>
                    {config.showSubheadline ? (
                      <div
                        {...subheadlineEditProps}
                        className="text-base sm:text-lg text-white/80 outline-none cursor-text rounded px-1 -mx-1 hover:bg-white/10 focus:bg-white/10 transition-colors min-w-[4ch] max-w-xl"
                      />
                    ) : (
                      <div
                        className="text-base sm:text-lg text-white/25 italic cursor-pointer px-1 rounded hover:bg-white/10 transition-colors"
                        onClick={() => update({ showSubheadline: true })}
                      >
                        {config.subheadline || "Subheadline"}
                      </div>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className={`flex flex-wrap gap-3 pt-1 ${ctaAlign}`}>
                    {/* Button 1 */}
                    {config.cta1Enabled ? (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActivePopover(activePopover === "cta1" ? null : "cta1")}
                          className={`${ctaBtnClass(config.cta1Style)} ring-2 ${activePopover === "cta1" ? "ring-white" : "ring-transparent hover:ring-white/50"} transition-all`}
                        >
                          {config.cta1Text || "Button 1"}
                        </button>
                        {activePopover === "cta1" && (
                          <CtaPopover
                            text={config.cta1Text} url={config.cta1Url} style={config.cta1Style}
                            onText={v => update({ cta1Text: v })}
                            onUrl={v => update({ cta1Url: v })}
                            onStyle={v => update({ cta1Style: v })}
                            onRemove={() => { update({ cta1Enabled: false }); setActivePopover(null); }}
                            onClose={() => setActivePopover(null)}
                          />
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => update({ cta1Enabled: true })}
                        className="px-4 py-2 rounded-lg border-2 border-dashed border-white/30 text-white/40 text-sm hover:border-white/60 hover:text-white/60 transition-colors"
                      >
                        + Add button
                      </button>
                    )}

                    {/* Button 2 */}
                    {config.cta1Enabled && (
                      config.cta2Enabled ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActivePopover(activePopover === "cta2" ? null : "cta2")}
                            className={`${ctaBtnClass(config.cta2Style)} ring-2 ${activePopover === "cta2" ? "ring-white" : "ring-transparent hover:ring-white/50"} transition-all`}
                          >
                            {config.cta2Text || "Button 2"}
                          </button>
                          {activePopover === "cta2" && (
                            <CtaPopover
                              text={config.cta2Text} url={config.cta2Url} style={config.cta2Style}
                              onText={v => update({ cta2Text: v })}
                              onUrl={v => update({ cta2Url: v })}
                              onStyle={v => update({ cta2Style: v })}
                              onRemove={() => { update({ cta2Enabled: false }); setActivePopover(null); }}
                              onClose={() => setActivePopover(null)}
                            />
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => update({ cta2Enabled: true })}
                          className="px-4 py-2 rounded-lg border-2 border-dashed border-white/30 text-white/40 text-sm hover:border-white/60 hover:text-white/60 transition-colors"
                        >
                          + Add button
                        </button>
                      )
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Control panel */}
          <ControlPanel config={config} update={update} onOpenLibrary={() => setLibraryOpen(true)} />
        </div>
      )}
    </>
  );

  if (embedded) return inner;
  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      {inner}
    </div>
  );
}
