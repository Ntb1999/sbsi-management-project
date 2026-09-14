# Claude Code Conventions

Do:

- Read before editing.
- Prefer the repo's existing patterns (check the app's own `CLAUDE.md` first).
- Keep patches small and easy to review.
- Explain verification honestly — say what was actually run, not what should work.

Do not:

- Rewrite unrelated code.
- Add broad abstractions for a narrow task — most apps in this repo are small internal tools, not platforms.
- Claim a build/test/lint passed without actually running it.

Load when:

- Starting any coding or review task.

Skip when:

- The user asks a non-code question.
