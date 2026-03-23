import { getConfig } from "../../../src/lib/config";
import { hooks } from "../../../src/lib/hooks";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const config = await getConfig();
  const rawNav = (config.appearance.navigation as { label: string; path: string }[]) ?? [];
  const navItems = await hooks.applyFilters("nav:items", { input: rawNav });
  return (
    <HeaderClient
      siteName={config.site.name}
      logoUrl={config.site.logo ?? null}
      headerIdentity={config.site.headerIdentity ?? "logo-only"}
      navItems={navItems}
    />
  );
}
