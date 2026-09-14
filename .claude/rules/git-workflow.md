# Git Workflow

Do:

- Check repo status before risky edits.
- Preserve user changes.
- Use non-destructive commands.
- **Before editing any code on `main`/`master`, call the `EnterWorktree` tool first** (creates an isolated branch/worktree under `.claude/worktrees/`). A hook (`worktree-edit-guard.sh`) blocks Write/Edit/MultiEdit on `main`/`master` as a backstop, but don't rely on the hook — call `EnterWorktree` proactively as soon as a task needs code changes. `CLAUDE.md`/`README.md` edits are exempt (docs-only, no running code affected).
- When a task is done, tell the user their change is in a worktree/branch and ask whether to merge it into `main` — don't merge unasked.

Do not:

- Run `git reset --hard`, `git clean -fdx`, or broad checkout restores.
- Push, merge, or create PRs unless explicitly asked.

Load when:

- Any task touches files in a git checkout.

Skip when:

- The folder is not a git repository and no git operation is needed.
