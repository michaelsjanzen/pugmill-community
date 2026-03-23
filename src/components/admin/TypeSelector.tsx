"use client";
import { useState } from "react";

interface Props {
  defaultType: "post" | "page";
  onTypeChange?: (type: "post" | "page") => void;
}

export default function TypeSelector({ defaultType, onTypeChange }: Props) {
  const [type, setType] = useState<"post" | "page">(defaultType);

  function handleChange(next: "post" | "page") {
    setType(next);
    onTypeChange?.(next);
  }

  return (
    <div>
      <div className="inline-flex bg-zinc-100 rounded-lg p-1 gap-1">
        <input
          type="radio" name="type" id="type-post" value="post"
          checked={type === "post"}
          onChange={() => handleChange("post")}
          className="sr-only peer/post"
        />
        <label
          htmlFor="type-post"
          className="px-5 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all
            text-zinc-500 hover:text-zinc-700
            peer-checked/post:bg-white peer-checked/post:text-zinc-900 peer-checked/post:shadow-sm"
        >
          Post
        </label>

        <input
          type="radio" name="type" id="type-page" value="page"
          checked={type === "page"}
          onChange={() => handleChange("page")}
          className="sr-only peer/page"
        />
        <label
          htmlFor="type-page"
          className="px-5 py-1.5 rounded-md text-sm font-medium cursor-pointer transition-all
            text-zinc-500 hover:text-zinc-700
            peer-checked/page:bg-white peer-checked/page:text-zinc-900 peer-checked/page:shadow-sm"
        >
          Page
        </label>
      </div>
    </div>
  );
}
