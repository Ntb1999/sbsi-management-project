# SBSI Monorepo

Turborepo + pnpm workspace monorepo for SBSI internal apps.

## Apps

- `apps/quan-tri-du-an-core` — UAT Command Portal (fork of the original static Cloudflare Pages project, rewritten on Next.js). Frontend HTML is unchanged; the old Cloudflare Pages Functions were ported to Next.js API routes, still backed by Cloudflare KV (accessed over Cloudflare's REST API instead of a native binding, since this app no longer deploys to Cloudflare Pages).

## Packages

- `packages/cloudflare-kv` — shared Cloudflare KV REST client (`kvGet`/`kvPut`), reusable by any future app in this monorepo that needs KV storage.

## Getting started

```bash
pnpm install
pnpm dev
```

See `apps/quan-tri-du-an-core/.env.example` for required environment variables.
