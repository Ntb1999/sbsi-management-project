#!/usr/bin/env sh
set -eu

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

branch="$(git branch --show-current 2>/dev/null || true)"

if [ "$branch" != "main" ] && [ "$branch" != "master" ]; then
  exit 0
fi

payload="$(cat || true)"
file_path="$(printf '%s' "$payload" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"

# Docs-only exception: small doc edits directly on main are fine, they
# don't touch running code.
case "$file_path" in
  */CLAUDE.md|CLAUDE.md|*/README.md|README.md)
    exit 0
    ;;
esac

printf '%s\n' "Blocked by worktree guard: editing files directly on '$branch' is not allowed." >&2
printf '%s\n' "Call the EnterWorktree tool first (creates an isolated branch/worktree under .claude/worktrees/), then retry the edit." >&2
printf '%s\n' "Docs-only exception: CLAUDE.md and README.md may still be edited directly on '$branch'." >&2
exit 2
