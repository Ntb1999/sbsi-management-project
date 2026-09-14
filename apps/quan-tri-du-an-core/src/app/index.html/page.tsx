import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
import { loadLegacyPage } from "@/lib/loadLegacyPage";

// index.html was a byte-identical copy of SBSI_Master_Project_Portal.html
// in the original repo — reuse the same extracted assets here too.
const data = loadLegacyPage("master-project-portal");

export const metadata: Metadata = { title: data.title };

export default function Page() {
  return (
    <LegacyPage
      css={data.css}
      bodyHtml={data.bodyHtml}
      links={data.links}
      externalScripts={data.externalScripts}
    />
  );
}
