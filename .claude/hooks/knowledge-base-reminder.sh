#!/usr/bin/env sh
set -eu

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

# Uncommitted changes under apps/*/ that AREN'T just a CLAUDE.md edit —
# a nudge that the app's knowledge base may need updating too, so the
# next session (possibly a different, non-technical team member) doesn't
# have to re-explain context Claude already learned this session.
changed="$(git status --porcelain -- 'apps/*' 2>/dev/null | grep -v 'CLAUDE\.md$' || true)"

if [ -n "$changed" ]; then
  printf '%s\n' "Knowledge-base reminder: apps/ has uncommitted changes. Before wrapping up, check whether the relevant apps/<app>/CLAUDE.md (and the root CLAUDE.md app table) still reflects reality — see .claude/rules/knowledge-base-maintenance.md." >&2
fi

exit 0
