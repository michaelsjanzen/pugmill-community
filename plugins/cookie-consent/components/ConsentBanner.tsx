"use client";

import { useState, useEffect } from "react";
import type { SiteBannerSlotProps } from "../../../src/lib/plugin-registry";

const COOKIE_NAME = "pugmill_consent";

type ConsentStatus = "accepted" | "declined";

function getCookieValue(): ConsentStatus | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  return value === "accepted" || value === "declined" ? value : null;
}

function setCookie(value: ConsentStatus, days: number) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function publishConsentAPI(status: ConsentStatus) {
  if (typeof window === "undefined") return;
  (window as Window & { __pugmill_consent?: { status: ConsentStatus; nonEssential: boolean } }).__pugmill_consent = {
    status,
    nonEssential: status === "accepted",
  };
}

export default function ConsentBanner({ settings }: SiteBannerSlotProps) {
  const [visible, setVisible] = useState(false);

  const bannerText =
    (settings.bannerText as string) || "We use cookies to improve your experience.";
  const acceptLabel = (settings.acceptLabel as string) || "Accept";
  const declineLabel = (settings.declineLabel as string) || "Decline";
  const privacyUrl = settings.privacyUrl as string;
  const cookieDuration = parseInt(settings.cookieDuration as string, 10) || 180;

  useEffect(() => {
    const existing = getCookieValue();
    if (existing) {
      publishConsentAPI(existing);
    } else {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    setCookie("accepted", cookieDuration);
    publishConsentAPI("accepted");
    setVisible(false);
  }

  function handleDecline() {
    setCookie("declined", cookieDuration);
    publishConsentAPI("declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#18181b",
        color: "#f4f4f5",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        borderTop: "1px solid #3f3f46",
        fontSize: "14px",
      }}
    >
      <p style={{ margin: 0, flex: "1 1 auto" }}>
        {bannerText}
        {privacyUrl && (
          <>
            {" "}
            <a
              href={privacyUrl}
              style={{ color: "#a1a1aa", textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </>
        )}
      </p>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          type="button"
          onClick={handleDecline}
          style={{
            padding: "6px 16px",
            borderRadius: "4px",
            border: "1px solid #52525b",
            background: "transparent",
            color: "#a1a1aa",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          {declineLabel}
        </button>
        <button
          type="button"
          onClick={handleAccept}
          style={{
            padding: "6px 16px",
            borderRadius: "4px",
            border: "none",
            background: "#f4f4f5",
            color: "#18181b",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {acceptLabel}
        </button>
      </div>
    </div>
  );
}
