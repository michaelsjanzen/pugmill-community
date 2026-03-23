"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "../actions";

interface Props {
  requirePhone: boolean;
}

const initial: ContactFormState = { status: "idle", message: "" };

export default function ContactFormUI({ requirePhone }: Props) {
  const [state, action, isPending] = useActionState(submitContactForm, initial);

  if (state.status === "success") {
    return (
      <div
        className="rounded-lg border p-5 text-sm"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-muted)",
        }}
      >
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {/* Honeypot — hidden from real users, filled by bots */}
      <input type="text" name="_hp" tabIndex={-1} aria-hidden="true" className="hidden" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="cf-name"
            className="block text-xs font-medium mb-1"
            style={{ color: "var(--color-muted)" }}
          >
            Name <span style={{ color: "var(--color-foreground)" }}>*</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }}
          />
        </div>
        <div>
          <label
            htmlFor="cf-email"
            className="block text-xs font-medium mb-1"
            style={{ color: "var(--color-muted)" }}
          >
            Email <span style={{ color: "var(--color-foreground)" }}>*</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }}
          />
        </div>
      </div>

      {requirePhone && (
        <div>
          <label
            htmlFor="cf-phone"
            className="block text-xs font-medium mb-1"
            style={{ color: "var(--color-muted)" }}
          >
            Phone <span style={{ color: "var(--color-foreground)" }}>*</span>
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            maxLength={50}
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
            }}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="cf-message"
          className="block text-xs font-medium mb-1"
          style={{ color: "var(--color-muted)" }}
        >
          Message <span style={{ color: "var(--color-foreground)" }}>*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder="How can we help?"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 resize-y"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-foreground)",
          }}
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm" style={{ color: "#dc2626" }}>
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2 rounded-md text-sm font-medium transition-opacity disabled:opacity-50"
        style={{
          backgroundColor: "var(--color-foreground)",
          color: "var(--color-background)",
        }}
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
