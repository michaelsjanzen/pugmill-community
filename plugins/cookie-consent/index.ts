import type { PugmillPlugin, PluginHookManager, PluginSettings } from "../../src/lib/plugin-registry";
import ConsentBanner from "./components/ConsentBanner";

export const cookieConsentPlugin: PugmillPlugin = {
  id: "cookie-consent",
  name: "Cookie Consent",
  version: "0.1.0",
  description: "Displays a cookie consent banner at the bottom of every page. Stores the visitor's choice for a configurable number of days.",

  settingsDefs: [
    {
      key: "bannerText",
      label: "Banner Text",
      type: "text",
      default: "We use cookies to improve your experience.",
      description: "Message shown in the consent banner.",
    },
    {
      key: "acceptLabel",
      label: "Accept Button Label",
      type: "text",
      default: "Accept",
    },
    {
      key: "declineLabel",
      label: "Decline Button Label",
      type: "text",
      default: "Decline",
    },
    {
      key: "privacyUrl",
      label: "Privacy Policy URL",
      type: "text",
      default: "",
      description: "Optional URL shown as a \"Learn more\" link. Leave blank to hide.",
    },
    {
      key: "cookieDuration",
      label: "Cookie Duration (days)",
      type: "text",
      default: "180",
      description: "How long the visitor's choice is remembered. Default is 180 days.",
    },
  ],

  // No server-side initialization needed — this plugin is entirely client-side.
  // The banner reads/writes document.cookie and exposes window.__pugmill_consent.
  initialize(_hooks: PluginHookManager, _settings: PluginSettings) {},

  slots: {
    siteBanner: ConsentBanner,
  },
};
