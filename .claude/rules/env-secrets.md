# Environment And Secrets

Do:

- Use `.env.example` for variable names and documentation only.
- Keep real secrets in gitignored local files (`.env.local`, `scripts/.env`, etc.) or a managed secret store on the deploy platform.
- Treat SBSI business data, credentials, and any user/customer data the same way — as sensitive.

Do not:

- Commit `.env`, credentials, account IDs, tokens, or private keys.
- Paste secrets into docs, specs, or commit messages.
- Add a hardcoded credential "fallback default" in code — if an env var is missing, fail with a clear error instead (see `apps/quan-tri-du-an-core`'s history: the original repo had exactly this mistake, a hardcoded Jira password, committed to git).

Load when:

- Editing config, auth, or any file that reads environment variables.

Skip when:

- The task cannot touch secrets or config.
