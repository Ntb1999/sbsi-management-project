#!/usr/bin/env sh
set -eu

payload="$(cat || true)"

if printf '%s' "$payload" | grep -Eiq '"file_path"[[:space:]]*:[[:space:]]*"[^"]*(id_rsa|private_key|\.pem)"'; then
  printf '%s\n' "Blocked by edit guard: do not write private keys or credential material into the repo." >&2
  exit 2
fi

# Only block writing to a *.env* file when it is NOT gitignored — a gitignored
# .env/.env.local (e.g. for local dev credentials the project owner asked
# for) is the normal, safe pattern and should not be blocked. What must
# never happen is a secret landing in a file git will actually track.
file_path="$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"

case "$file_path" in
  *.env|*.env.*)
    if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
      if ! git check-ignore -q "$file_path" 2>/dev/null; then
        printf '%s\n' "Blocked by edit guard: '$file_path' is a .env-style file that is NOT gitignored." >&2
        printf '%s\n' "Add it to .gitignore first, or write documented (no real secrets) values to a .env.example instead." >&2
        exit 2
      fi
    fi
    ;;
esac

exit 0
