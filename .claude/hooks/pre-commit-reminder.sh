#!/usr/bin/env sh
set -eu

payload="$(cat || true)"

if printf '%s' "$payload" | grep -Eiq 'git[[:space:]]+commit'; then
  printf '%s\n' "Reminder: run this app's build/lint (and tests, if any exist) before committing behavior changes, and mention the result in the final summary." >&2
fi

exit 0
