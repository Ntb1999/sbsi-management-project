---
name: debugging
description: Use when investigating a failing build, runtime error, regression, or unclear behavior in any app in this monorepo.
---

# Debugging

## Trigger

Use when investigating a failing test, runtime error, regression, or unclear behavior.

## Procedure

1. Reproduce the issue with the smallest command or interaction.
2. Read the relevant code path and recent changes.
3. Form one hypothesis at a time.
4. Add temporary diagnostics only when they will be removed before finalizing.
5. Prefer fixing the root cause over adding fallback behavior.
6. Add or update a regression test when the app has a test setup.

## Verification

- Rerun the failing check.
- Run adjacent checks if the fix touches shared code (e.g. `packages/*`).

## Failure Or Blocking

- If reproduction is impossible, state what was attempted and what input is missing.
- If the fix requires product clarification, keep the code unchanged or guard the change behind an explicit note to the user.
