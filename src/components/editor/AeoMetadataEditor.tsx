"use client";
import { useState, forwardRef, useImperativeHandle } from "react";

export interface AeoMetadata {
  summary?: string;
  questions?: { q: string; a: string }[];
  entities?: { type: string; name: string; description?: string }[];
  keywords?: string[];
}

export interface AeoMetadataEditorHandle {
  setValue: (value: AeoMetadata) => void;
}

interface Props {
  name: string;
  defaultValue?: AeoMetadata | null;
  onChange?: (value: AeoMetadata) => void;
}

const AeoMetadataEditor = forwardRef<AeoMetadataEditorHandle, Props>(function AeoMetadataEditor(
  { name, defaultValue, onChange },
  ref
) {
  const [summary, setSummary] = useState(defaultValue?.summary ?? "");
  const [questions, setQuestions] = useState<{ q: string; a: string }[]>(
    defaultValue?.questions ?? []
  );
  const [entities, setEntities] = useState<{ type: string; name: string; description?: string }[]>(
    defaultValue?.entities ?? []
  );
  const [keywords, setKeywords] = useState<string[]>(defaultValue?.keywords ?? []);

  function buildValue(
    s: string,
    qs: { q: string; a: string }[],
    es: { type: string; name: string; description?: string }[],
    kws: string[]
  ): AeoMetadata {
    return {
      ...(s ? { summary: s } : {}),
      ...(qs.filter(q => q.q && q.a).length > 0 ? { questions: qs.filter(q => q.q && q.a) } : {}),
      ...(es.filter(e => e.name).length > 0 ? { entities: es.filter(e => e.name) } : {}),
      ...(kws.length > 0 ? { keywords: kws } : {}),
    };
  }

  useImperativeHandle(ref, () => ({
    setValue(aeo: AeoMetadata) {
      const s = aeo.summary ?? "";
      const qs = aeo.questions ?? [];
      const es = aeo.entities ?? [];
      const kws = aeo.keywords ?? [];
      setSummary(s);
      setQuestions(qs);
      setEntities(es);
      setKeywords(kws);
      onChange?.(buildValue(s, qs, es, kws));
    },
  }));

  const value = buildValue(summary, questions, entities, keywords);

  return (
    <div className="space-y-5">
      <p className="text-xs text-zinc-500 leading-relaxed">
        AEO metadata helps AI engines (ChatGPT, Perplexity, Gemini) understand and cite this page
        accurately. Exposed at{" "}
        <code className="bg-zinc-100 px-1 rounded">/llms.txt</code> and in the REST API.
      </p>

      <input
        type="hidden"
        name={name}
        value={Object.keys(value).length > 0 ? JSON.stringify(value) : ""}
      />

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">
          Summary
          <span className="font-normal text-zinc-400 ml-1.5 text-xs">— one paragraph for AI crawlers</span>
        </label>
        <textarea
          value={summary}
          onChange={e => {
            const s = e.target.value;
            setSummary(s);
            onChange?.(buildValue(s, questions, entities, keywords));
          }}
          rows={3}
          placeholder="A concise description of this page for AI systems..."
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      </div>

      {/* Q&A Pairs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-700">
            Q&amp;A Pairs
            <span className="font-normal text-zinc-400 ml-1.5 text-xs">— questions your content answers</span>
          </label>
          <button
            type="button"
            onClick={() => {
              const next = [...questions, { q: "", a: "" }];
              setQuestions(next);
              onChange?.(buildValue(summary, next, entities, keywords));
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 rounded px-2 py-1 transition-colors"
          >
            + Add question
          </button>
        </div>
        <div className="space-y-3">
          {questions.map((qa, i) => (
            <div key={i} className="border border-zinc-200 rounded-lg p-3 bg-white space-y-2">
              <input
                value={qa.q}
                onChange={e => {
                  const next = [...questions];
                  next[i] = { ...next[i], q: e.target.value };
                  setQuestions(next);
                  onChange?.(buildValue(summary, next, entities, keywords));
                }}
                placeholder="Question"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <textarea
                value={qa.a}
                onChange={e => {
                  const next = [...questions];
                  next[i] = { ...next[i], a: e.target.value };
                  setQuestions(next);
                  onChange?.(buildValue(summary, next, entities, keywords));
                }}
                placeholder="Answer"
                rows={2}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <button
                type="button"
                onClick={() => {
                  const next = questions.filter((_, j) => j !== i);
                  setQuestions(next);
                  onChange?.(buildValue(summary, next, entities, keywords));
                }}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          {questions.length === 0 && (
            <p className="text-xs text-zinc-400 italic py-1">No Q&amp;A pairs yet.</p>
          )}
        </div>
      </div>

      {/* Named Entities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-700">
            Named Entities
            <span className="font-normal text-zinc-400 ml-1.5 text-xs">— key concepts, people, or products</span>
          </label>
          <button
            type="button"
            onClick={() => {
              const next = [...entities, { type: "Thing", name: "", description: "" }];
              setEntities(next);
              onChange?.(buildValue(summary, questions, next, keywords));
            }}
            className="text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 rounded px-2 py-1 transition-colors"
          >
            + Add entity
          </button>
        </div>
        <div className="space-y-3">
          {entities.map((entity, i) => (
            <div key={i} className="border border-zinc-200 rounded-lg p-3 bg-white space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={entity.name}
                  onChange={e => {
                    const next = [...entities];
                    next[i] = { ...next[i], name: e.target.value };
                    setEntities(next);
                    onChange?.(buildValue(summary, questions, next, keywords));
                  }}
                  placeholder="Name (e.g. Pugmill CMS)"
                  className="border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
                <select
                  value={entity.type}
                  onChange={e => {
                    const next = [...entities];
                    next[i] = { ...next[i], type: e.target.value };
                    setEntities(next);
                    onChange?.(buildValue(summary, questions, next, keywords));
                  }}
                  className="border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
                >
                  {["Thing", "Person", "Organization", "Product", "Place", "Event", "Technology"].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <input
                value={entity.description ?? ""}
                onChange={e => {
                  const next = [...entities];
                  next[i] = { ...next[i], description: e.target.value };
                  setEntities(next);
                  onChange?.(buildValue(summary, questions, next, keywords));
                }}
                placeholder="Short description (optional)"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />
              <button
                type="button"
                onClick={() => {
                  const next = entities.filter((_, j) => j !== i);
                  setEntities(next);
                  onChange?.(buildValue(summary, questions, next, keywords));
                }}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          {entities.length === 0 && (
            <p className="text-xs text-zinc-400 italic py-1">No entities yet.</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default AeoMetadataEditor;
