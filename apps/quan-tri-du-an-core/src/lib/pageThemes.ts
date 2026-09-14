// Maps each top-level route segment (== the original filename) to the
// extra attributes its original <html> tag carried beyond lang="vi"
// (e.g. data-theme). Read by the root layout so the attribute is present
// in the server-rendered HTML from the first byte — no client-side flash
// of the wrong theme while switching between a dark page and eKYC's light
// one. Values are taken straight from src/legacy/*/meta.json.
export const PAGE_HTML_ATTRS: Record<string, Record<string, string>> = {
  "SBSI_Master_Project_Portal.html": {},
  "index.html": {},
  "Timeline_Du_An_Core_FSS_SBSI.html": { "data-theme": "dark" },
  "Platform_Web_Trading_Online.html": { "data-theme": "dark" },
  "Platform_Mobile_Trading_App.html": { "data-theme": "dark" },
  "Platform_Core_FLEX_BackOffice.html": { "data-theme": "dark" },
  "Platform_Tenora_Bond_TPRL.html": { "data-theme": "dark" },
  "Platform_eKYC_Onboarding.html": { "data-theme": "light" }
};
