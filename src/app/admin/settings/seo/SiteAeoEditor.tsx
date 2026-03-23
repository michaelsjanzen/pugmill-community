"use client";

import { useState } from "react";

export interface AeoQuestion { q?: string; a?: string }
export interface AeoOrganization {
  name?: string;
  type?: string;
  description?: string;
  url?: string;
}

interface Props {
  defaultSummary?: string;
  defaultQuestions?: AeoQuestion[];
  defaultOrganization?: AeoOrganization;
  isAiEnabled?: boolean;
}

const ORG_TYPES = [
  "Organization",
  "Corporation",
  "LocalBusiness",
  "EducationalOrganization",
  "GovernmentOrganization",
  "NGO",
  "NewsMediaOrganization",
];

export default function SiteAeoEditor({ defaultSummary = "", defaultQuestions = [], defaultOrganization = {}, isAiEnabled = false }: Props) {
  const [summary, setSummary] = useState(defaultSummary);
  const [questions, setQuestions] = useState<{ q: string; a: string }[]>(
    defaultQuestions.length > 0
      ? defaultQuestions.map(qa => ({ q: qa.q ?? "", a: qa.a ?? "" }))
      : [{ q: "", a: "" }]
  );
  const [org, setOrg] = useState<AeoOrganization>({
    name: defaultOrganization.name ?? "",
    type: defaultOrganization.type ?? "Organization",
    description: defaultOrganization.description ?? "",
    url: defaultOrganization.url ?? "",
  });

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [faqsLoading, setFaqsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function callAi(type: "site-summary" | "site-faqs") {
    const res = await fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json() as { result?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "AI request failed");
    return data.result!;
  }

  async function generateSummary() {
    setSummaryLoading(true);
    setAiError(null);
    try {
      const result = await callAi("site-summary");
      setSummary(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI request failed");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function generateFaqs() {
    setFaqsLoading(true);
    setAiError(null);
    try {
      const result = await callAi("site-faqs");
      const parsed: unknown = JSON.parse(result);
      if (!Array.isArray(parsed)) throw new Error("AI returned an unexpected format. Please try again.");
      const suggested = (parsed as { q?: string; a?: string }[])
        .filter(item => typeof item.q === "string" && typeof item.a === "string")
        .map(item => ({ q: item.q as string, a: item.a as string }));
      // Keep any existing non-empty pairs and append the suggestions after them
      const existing = questions.filter(qa => qa.q.trim() || qa.a.trim());
      setQuestions(existing.length > 0 ? [...existing, ...suggested] : suggested);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "AI request failed");
    } finally {
      setFaqsLoading(false);
    }
  }

  function addQuestion() {
    setQuestions(prev => [...prev, { q: "", a: "" }]);
  }

  function removeQuestion(i: number) {
    setQuestions(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateQuestion(i: number, field: "q" | "a", value: string) {
    setQuestions(prev => prev.map((qa, idx) => idx === i ? { ...qa, [field]: value } : qa));
  }

  // Filter out empty Q&A pairs before serializing
  const validQuestions = questions.filter(qa => qa.q.trim() || qa.a.trim());

  return (
    <>
      {/* Hidden inputs for form submission */}
      <input type="hidden" name="aeoSummary" value={summary} />
      <input type="hidden" name="aeoQuestions" value={JSON.stringify(validQuestions)} />
      <input type="hidden" name="aeoOrgName" value={org.name ?? ""} />
      <input type="hidden" name="aeoOrgType" value={org.type ?? "Organization"} />
      <input type="hidden" name="aeoOrgDescription" value={org.description ?? ""} />
      <input type="hidden" name="aeoOrgUrl" value={org.url ?? ""} />

      {/* AI error banner */}
      {aiError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{aiError}</span>
          <button type="button" onClick={() => setAiError(null)} className="ml-auto shrink-0 text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      {/* Site AI Summary */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <label className="block text-sm font-medium text-zinc-700">Site AI Summary</label>
          {isAiEnabled && (
            <button
              type="button"
              onClick={generateSummary}
              disabled={summaryLoading}
              className="text-xs text-zinc-600 border border-zinc-200 rounded px-2 py-1 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {summaryLoading ? (
                <>
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  Generating…
                </>
              ) : "✦ Generate"}
            </button>
          )}
        </div>
        <textarea
          rows={3}
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="A concise description of what this site is about, written for AI engines and crawlers."
          className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-y"
        />
        <p className="text-xs text-zinc-500">Used in llms.txt as the site overview. Aim for 2–4 sentences.</p>
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-zinc-700">Frequently Asked Questions</label>
          <div className="flex items-center gap-2">
            {isAiEnabled && (
              <button
                type="button"
                onClick={generateFaqs}
                disabled={faqsLoading}
                className="text-xs text-zinc-600 border border-zinc-200 rounded px-2 py-1 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {faqsLoading ? (
                  <>
                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Suggesting…
                  </>
                ) : "✦ Suggest"}
              </button>
            )}
            <button
              type="button"
              onClick={addQuestion}
              className="text-xs text-zinc-600 border border-zinc-200 rounded px-2 py-1 hover:bg-zinc-50 transition-colors"
            >
              + Add question
            </button>
          </div>
        </div>
        {questions.map((qa, i) => (
          <div key={i} className="border border-zinc-200 rounded-md p-4 space-y-2 bg-zinc-50">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={qa.q}
                  onChange={e => updateQuestion(i, "q", e.target.value)}
                  placeholder="Question"
                  className="w-full border border-zinc-200 rounded px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
                />
                <textarea
                  rows={2}
                  value={qa.a}
                  onChange={e => updateQuestion(i, "a", e.target.value)}
                  placeholder="Answer"
                  className="w-full border border-zinc-200 rounded px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white resize-y"
                />
              </div>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="text-zinc-400 hover:text-red-500 transition-colors mt-1 text-lg leading-none"
                  aria-label="Remove question"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
        <p className="text-xs text-zinc-500">These questions are injected into llms.txt and FAQPage structured data.</p>
      </div>

      {/* Organization */}
      <div className="space-y-3 pt-2">
        <label className="block text-sm font-medium text-zinc-700">Organization</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs text-zinc-500">Name</label>
            <input
              type="text"
              value={org.name}
              onChange={e => setOrg(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Acme Corp"
              className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs text-zinc-500">Type</label>
            <select
              value={org.type}
              onChange={e => setOrg(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            >
              {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs text-zinc-500">Description</label>
            <textarea
              rows={2}
              value={org.description}
              onChange={e => setOrg(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Short description of the organization."
              className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-y"
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs text-zinc-500">URL (override)</label>
            <input
              type="url"
              value={org.url}
              onChange={e => setOrg(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com (defaults to site URL if blank)"
              className="w-full border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        </div>
        <p className="text-xs text-zinc-500">Used in Organization JSON-LD structured data on every page.</p>
      </div>
    </>
  );
}
