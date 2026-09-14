import type { Metadata } from "next";
import { LegacyPage } from "@/components/LegacyPage";
import { loadLegacyPage } from "@/lib/loadLegacyPage";

const data = loadLegacyPage("platform-core-flex-backoffice");

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
