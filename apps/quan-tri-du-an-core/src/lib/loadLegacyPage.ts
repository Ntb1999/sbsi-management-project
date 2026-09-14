import fs from "node:fs";
import path from "node:path";

export interface LegacyPageData {
  title: string;
  htmlAttrs: Record<string, string>;
  links: Record<string, unknown>[];
  externalScripts: string[];
  css: string;
  bodyHtml: string;
}

/** Loads a page extracted by scripts/extract-legacy.mjs from src/legacy/<slug>/. */
export function loadLegacyPage(slug: string): LegacyPageData {
  const dir = path.join(process.cwd(), "src", "legacy", slug);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"));
  const css = fs.readFileSync(path.join(dir, "style.css"), "utf8");
  const bodyHtml = fs.readFileSync(path.join(dir, "body.html"), "utf8");
  return { ...meta, css, bodyHtml };
}
