#!/usr/bin/env sh
set -eu

payload="$(cat || true)"

deny() {
  printf '%s\n' "Blocked by command guard: $1" >&2
  printf '%s\n' "If this is truly required, ask the project owner for an explicit one-off approval path." >&2
  exit 2
}

printf '%s' "$payload" | grep -Eiq 'git[[:space:]]+reset[[:space:]]+--hard' && deny "destructive git reset"
printf '%s' "$payload" | grep -Eiq 'git[[:space:]]+clean[[:space:]]+-fdx' && deny "destructive git clean"
printf '%s' "$payload" | grep -Eiq 'rm[[:space:]]+-rf[[:space:]]+/' && deny "recursive delete from filesystem root"
printf '%s' "$payload" | grep -Eiq '(terraform|pulumi)[[:space:]]+destroy' && deny "destructive infrastructure command"
printf '%s' "$payload" | grep -Eiq '(cat|type|Get-Content)[[:space:]]+\.env([^[:alnum:]_.-]|$)' && deny "reading local .env secrets"

exit 0
