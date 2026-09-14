// One-off dev tool: splits a legacy single-file HTML dashboard into the
// pieces a Next.js page needs (title, <link> tags, <style> CSS, and the
// raw <body> inner HTML with its interleaved <script> blocks left
// untouched — order/interleaving is preserved exactly, see LegacyPage.tsx
// for how those inline scripts get executed client-side).
//
// Kept in the repo (not just run-once-and-discard) since future apps in
// this monorepo forked from a similar static-HTML original can reuse it.
//
// Usage: node scripts/extract-legacy.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.join(__dirname, "..");
const sourceDir = path.join(appRoot, "public");
const outDir = path.join(appRoot, "src", "legacy");

const PAGES = [
  { file: "SBSI_Master_Project_Portal.html", slug: "master-project-portal" },
  { file: "Timeline_Du_An_Core_FSS_SBSI.html", slug: "timeline-du-an-core-fss-sbsi" },
  { file: "Platform_Web_Trading_Online.html", slug: "platform-web-trading-online" },
  { file: "Platform_Mobile_Trading_App.html", slug: "platform-mobile-trading-app" },
  { file: "Platform_Core_FLEX_BackOffice.html", slug: "platform-core-flex-backoffice" },
  { file: "Platform_Tenora_Bond_TPRL.html", slug: "platform-tenora-bond-tprl" },
  { file: "Platform_eKYC_Onboarding.html", slug: "platform-ekyc-onboarding" }
];

function extractLinks(headHtml) {
  const links = [];
  const re = /<link\b([^>]*)>/g;
  let m;
  while ((m = re.exec(headHtml))) {
    const attrsStr = m[1];
    const attrs = {};
    const attrRe = /([a-zA-Z-]+)(?:="([^"]*)")?/g;
    let a;
    while ((a = attrRe.exec(attrsStr))) {
      const name = a[1] === "crossorigin" ? "crossOrigin" : a[1];
      // Bare boolean-style HTML attributes (e.g. `crossorigin` with no
      // value) mean "anonymous" for crossOrigin specifically; keep as an
      // explicit string so this stays a plain string map, never a boolean
      // (React's handling of boolean values on passthrough DOM attributes
      // is inconsistent across attribute names).
      attrs[name] = a[2] ?? (name === "crossOrigin" ? "anonymous" : "");
    }
    links.push(attrs);
  }
  return links;
}

function extractExternalScriptSrcs(headHtml) {
  const srcs = [];
  const re = /<script\b[^>]*\ssrc="([^"]+)"[^>]*>\s*<\/script>/g;
  let m;
  while ((m = re.exec(headHtml))) {
    let src = m[1];
    // Same-origin relative paths (e.g. "jira_sbsiuat_issues.js") need to be
    // absolute now — these pages live at routes like /SBSI_Master_Project_Portal.html
    // rather than being served from a directory, and the asset itself still
    // lives at the public/ root.
    if (!/^([a-z]+:)?\/\//i.test(src) && !src.startsWith("/")) {
      src = "/" + src;
    }
    srcs.push(src);
  }
  return srcs;
}

for (const { file, slug } of PAGES) {
  const srcPath = path.join(sourceDir, file);
  const raw = fs.readFileSync(srcPath, "utf8");

  const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].trim() : file;

  const htmlTagMatch = raw.match(/<html\b([^>]*)>/);
  const htmlAttrs = {};
  if (htmlTagMatch) {
    const attrRe = /([a-zA-Z-]+)="([^"]*)"/g;
    let a;
    while ((a = attrRe.exec(htmlTagMatch[1]))) {
      if (a[1] === "lang") continue; // fixed on the shared root layout
      htmlAttrs[a[1]] = a[2];
    }
  }

  const headStart = raw.indexOf("<head>");
  const styleStart = raw.indexOf("<style>");
  const headHtml = raw.slice(headStart, styleStart);

  const links = extractLinks(headHtml);
  const externalScripts = extractExternalScriptSrcs(headHtml);

  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) throw new Error(`No <style> block found in ${file}`);
  const css = styleMatch[1];

  const bodyOpenMatch = raw.match(/<body[^>]*>/);
  const bodyCloseIdx = raw.lastIndexOf("</body>");
  if (!bodyOpenMatch || bodyCloseIdx === -1) throw new Error(`No <body> found in ${file}`);
  const bodyStart = bodyOpenMatch.index + bodyOpenMatch[0].length;
  const bodyHtml = raw.slice(bodyStart, bodyCloseIdx);

  const pageOutDir = path.join(outDir, slug);
  fs.mkdirSync(pageOutDir, { recursive: true });
  fs.writeFileSync(path.join(pageOutDir, "style.css"), css, "utf8");
  fs.writeFileSync(path.join(pageOutDir, "body.html"), bodyHtml, "utf8");
  fs.writeFileSync(
    path.join(pageOutDir, "meta.json"),
    JSON.stringify({ title, htmlAttrs, links, externalScripts }, null, 2),
    "utf8"
  );

  console.log(
    `${file} -> src/legacy/${slug}/ (css ${css.length}B, body ${bodyHtml.length}B, ${links.length} links, ${externalScripts.length} external scripts)`
  );
}
