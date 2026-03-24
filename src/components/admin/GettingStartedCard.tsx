"use client";
import Link from "next/link";
import { useTransition } from "react";
import { dismissOnboarding } from "@/lib/actions/onboarding";

interface Step {
  label: string;
  description: string;
  done: boolean;
  href: string;
}

interface Props {
  steps: Step[];
}

function CheckIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm3.78-9.72a.75.75 0 0 0-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5Z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm0-1.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" clipRule="evenodd" />
    </svg>
  );
}

export default function GettingStartedCard({ steps }: Props) {
  const [pending, startTransition] = useTransition();
  const completed = steps.filter(s => s.done).length;
  const total = steps.length;
  const pct = Math.round((completed / total) * 100);

  function handleDismiss() {
    startTransition(async () => {
      await dismissOnboarding();
    });
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900">Getting Started</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{completed} of {total} steps complete</p>
        </div>
        <button
          onClick={handleDismiss}
          disabled={pending}
          className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors shrink-0 disabled:opacity-50"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Steps */}
      <ul className="space-y-3">
        {steps.map(step => (
          <li key={step.href} className="flex items-start gap-3">
            <CheckIcon done={step.done} />
            <div className="min-w-0">
              <Link
                href={step.href}
                className={`text-sm font-medium leading-snug transition-colors ${
                  step.done
                    ? "text-zinc-400 line-through decoration-zinc-300"
                    : "text-zinc-800 hover:text-blue-600"
                }`}
              >
                {step.label}
              </Link>
              {!step.done && (
                <p className="text-xs text-zinc-400 mt-0.5">{step.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
