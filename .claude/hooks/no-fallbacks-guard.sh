#!/usr/bin/env sh
set -eu

payload="$(cat || true)"

if printf '%s' "$payload" | grep -Eiq 'catch[[:space:]]*\([^)]*\)[[:space:]]*\{[[:space:]]*\}'; then
  printf '%s\n' "Blocked by no-fallbacks guard: empty catch blocks hide real failures." >&2
  exit 2
fi

if printf '%s' "$payload" | grep -Eiq 'silently[[:space:]]+(ignore|fallback|continue)'; then
  printf '%s\n' "Blocked by no-fallbacks guard: silent fallback language usually needs explicit error handling." >&2
  exit 2
fi

exit 0
