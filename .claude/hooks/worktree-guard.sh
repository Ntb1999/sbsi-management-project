#!/usr/bin/env sh
set -eu

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

branch="$(git branch --show-current 2>/dev/null || true)"

if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  printf '%s\n' "Worktree reminder: you are on '$branch'. Before editing files, call the EnterWorktree tool to work in an isolated branch/worktree (see root CLAUDE.md)." >&2
fi

exit 0
