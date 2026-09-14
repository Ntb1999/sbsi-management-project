"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";
import { PAGE_HTML_ATTRS } from "@/lib/pageThemes";

// Client component so useSelectedLayoutSegment can read the active
// top-level route (== original filename) and put the right data-theme
// on <html> during the SERVER render itself — no flash of the wrong
// theme, since each original file had a different data-theme baked in.
//
// Otherwise minimal: no global stylesheet, no font setup here. Each
// legacy page (LegacyPage.tsx) supplies its own <style>/<link> tags,
// exactly matching what each original standalone HTML file did.
export default function RootLayout({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const attrs = (segment && PAGE_HTML_ATTRS[segment]) || {};

  return (
    <html lang="vi" {...attrs}>
      <body>{children}</body>
    </html>
  );
}
