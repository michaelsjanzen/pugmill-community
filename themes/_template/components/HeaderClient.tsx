"use client";

/**
 * HeaderClient — client component stub
 *
 * Receives site name, logo URL, and nav items from the Header server component.
 * Add interactive behaviour here (active link state, mobile menu, etc.)
 * using usePathname, useState, etc.
 *
 * See /themes/default/components/HeaderClient.tsx for a full reference
 * implementation with glassmorphism header, active nav, and mobile drawer.
 *
 * Global config fields available via Header.tsx:
 *   config.site.name        — site name text
 *   config.site.logo        — optional logo URL (set in Settings → Site Identity)
 *   config.site.favicon     — optional favicon URL
 *   config.appearance.navigation — nav items array
 */

import Image from "next/image";

interface NavItem {
  label: string;
  path: string;
}

type HeaderIdentity = "logo-only" | "name-only" | "logo-and-name";

interface Props {
  siteName: string;
  logoUrl: string | null;
  headerIdentity: HeaderIdentity;
  navItems: NavItem[];
}

export default function HeaderClient({ siteName, logoUrl, headerIdentity, navItems }: Props) {
  const showLogo = logoUrl && headerIdentity !== "name-only";
  const showName = headerIdentity === "name-only" || headerIdentity === "logo-and-name" || !logoUrl;

  return (
    <header>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {showLogo && (
          <Image src={logoUrl!} alt={siteName} height={32} width={120} style={{ height: 32, width: "auto" }} />
        )}
        {showName && siteName}
      </a>
      <nav>
        {navItems.map((item) => (
          <a key={item.path} href={item.path}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
