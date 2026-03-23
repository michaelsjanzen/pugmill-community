import type React from "react";

/**
 * Runtime context passed to every widget component at render time.
 * Built by the route handler from the current post/page and design config.
 */
export interface WidgetContext {
  type: "post" | "page";
  postId: number;
  slug: string;
  /** Raw markdown content — used by the TOC widget for heading extraction. */
  content: string;
  categoryIds: number[];
  tagIds: number[];
  parentId: number | null;
  designConfig: Record<string, string>;
}

/**
 * A named slot in a theme layout where an ordered list of widgets renders.
 * Declared by the theme in its design.ts file.
 */
export interface WidgetAreaDef {
  id: string;
  label: string;
  /** Key used to read/write widget order in the design config. */
  configKey: string;
  defaultWidgets: string[];
}

/** Describes a single field in a widget's settings form. */
export interface WidgetConfigField {
  type: "text" | "number" | "select";
  label: string;
  default: string;
  description?: string;
  options?: { value: string; label: string }[];
}

/**
 * The definition of a widget — registered at startup via registerWidget().
 * Core ships built-in widget definitions; plugins may register additional ones.
 */
export interface WidgetDef {
  id: string;
  label: string;
  description?: string;
  /** Area IDs this widget is valid for. Controls which areas it appears in the admin picker. */
  areas: string[];
  /** When present, widget settings appear on the Settings → Widgets page. */
  configSchema?: Record<string, WidgetConfigField>;
  component: (
    ctx: WidgetContext,
    settings: Record<string, string>
  ) => Promise<React.ReactNode>;
}
