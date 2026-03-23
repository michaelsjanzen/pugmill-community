"use client";
import { useState } from "react";

type Mode = "logo-only" | "name-only" | "logo-and-name";

const OPTIONS: { value: Mode; label: string; description: string }[] = [
  { value: "logo-only",     label: "Logo only",     description: "Show logo image; falls back to site name if no logo is set." },
  { value: "name-only",     label: "Name only",     description: "Always show the site name as text." },
  { value: "logo-and-name", label: "Logo + name",   description: "Show logo image and site name side by side." },
];

export default function IdentityModeRadio({ defaultValue }: { defaultValue: Mode }) {
  const [selected, setSelected] = useState<Mode>(defaultValue);

  return (
    <div>
      <p className="text-sm font-medium text-zinc-700 mb-2">Header display</p>
      <div className="flex flex-col sm:flex-row gap-2">
        {OPTIONS.map(opt => (
          <label
            key={opt.value}
            className={`flex-1 flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
              selected === opt.value
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-200 bg-white hover:border-zinc-400"
            }`}
          >
            <input
              type="radio"
              name="headerIdentity"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              className="mt-0.5 shrink-0 accent-zinc-900"
            />
            <div>
              <p className="text-sm font-medium text-zinc-800 leading-tight">{opt.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{opt.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
