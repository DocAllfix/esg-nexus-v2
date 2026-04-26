# ESG Nexus

Gestionale per consulenza di sostenibilità (ESG / CSRD / ESRS / GRI) per il
singolo consulente che gestisce clienti, engagement e bilanci di sostenibilità.

> **Note** This repo was initialised from a Base44 export but no longer depends
> on it. The Base44 SDK and `VITE_BASE44_*` env vars are removed; the backend
> is Supabase only.

## Stack

- **Frontend**: React 18 + Vite, TanStack Query v5, shadcn/ui + Tailwind, Recharts, React Router v6
- **Backend**: Supabase (PostgreSQL 15, Auth, Realtime, Edge Functions, Storage)
- **Validation**: Zod + @hookform/resolvers
- **Tests**: Vitest + @testing-library/react + jsdom
- **Deploy**: Vercel

## Getting started

```bash
npm install
cp .env.example .env.local       # then fill in your Supabase URL + anon key
npm run dev                      # http://localhost:5173
```

Required env vars in `.env.local`:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

The `service_role` key **must never** appear in the frontend — RLS does the work.

## Scripts

```bash
npm run dev          # Vite dev server
npm run build        # Production build to dist/
npm run lint         # ESLint (errors only)
npm run lint:fix     # Auto-fix
npm run test         # Vitest, single run
npm run test:watch   # Vitest watch mode
npm run typecheck    # TypeScript on JSX/JS files (best-effort, false positives expected)
```

## Repo layout

```
src/
  api/supabaseClient.js       Supabase client (throws if env vars missing)
  hooks/                      Data access layer (TanStack Query + Supabase)
  schemas/index.js            Zod schemas (validation before any upsert)
  pages/                      Route-level components
  components/
    common/DataGuard.jsx      loading/error/empty wrapper for pages
    common/ErrorBoundary.jsx  global React error boundary
    engagement/               TabProc and Form components (PROC-00 … PROC-07)
  lib/AuthContext.jsx         Supabase Auth context
  test/                       Vitest setup + supabase mock
supabase/
  migrations/                 7 SQL migration files (schema, RLS, views, seeds, triggers, realtime, storage)
  functions/                  Deno edge functions (4)
  PG_CRON_SETUP.md            Manual setup for pg_cron (NEVER versioned with secrets)
vercel.json                   Security headers (CSP, HSTS, frame-ancestors none)
E2E_SCENARIOS.md              Playwright scenarios documented for post-deploy
PROJECT_STATUS.md             Phase tracker
CLAUDE.md                     Architecture rules + RLS patterns
```

## Edge Functions

Located in `supabase/functions/`. All four read `SUPABASE_SERVICE_ROLE_KEY` from
the function env (set via `supabase secrets set`), never from source.

| Function | Trigger | Purpose |
|----------|---------|---------|
| `compute-engagement-progress` | DB webhook on `form_data` INSERT/UPDATE | Recomputes `engagement_fasi.progresso` and `engagements.progresso`. Includes webhook deduplication (LOG-003): skips stale deliveries when a fresher row already exists. |
| `generate-project-code` | HTTP from frontend | Returns next free `ESG-{anno}-{sigla}-{nnn}` code. |
| `check-deadlines` | pg_cron every 6h | Marks overdue scadenze and notifies upcoming ones in `eventi_log`. Idempotent via `notificata_at`. |
| `send-notification-email` | HTTP from other functions or frontend | Sends transactional emails via Resend (requires `RESEND_API_KEY`). |

Deploy:

```bash
supabase functions deploy compute-engagement-progress
supabase functions deploy generate-project-code
supabase functions deploy check-deadlines
supabase functions deploy send-notification-email

supabase secrets set RESEND_API_KEY=...
supabase secrets set RESEND_FROM_ADDRESS="ESG Nexus <noreply@yourdomain>"
```

## Storage buckets

Created by `00007_storage_buckets.sql`:

- `engagement-docs` — private, path `{auth.uid()}/{engagement_id}/...`, RLS verifies engagement ownership
- `avatars` — public read, owner-write under `{auth.uid()}/...`
- `exports` — private, owner-only under `{auth.uid()}/...`

## Known technical debt

### REM-008 — CSP `'unsafe-inline'`

`vercel.json` declares:

```
script-src 'self' 'unsafe-inline'
style-src  'self' 'unsafe-inline' https://fonts.googleapis.com
```

`'unsafe-inline'` is required because Vite injects inline runtime helpers and
shadcn/ui uses inline `<style>` for radix portals. Removing it without a
nonce-based CSP breaks the app.

**Post-v1 plan**: introduce `vite-plugin-csp-guard` (or a custom
`transformIndexHtml` hook) that emits a per-build nonce, wire the same nonce
into `vercel.json` headers, and drop `'unsafe-inline'` from both directives.
Tracked in `PROJECT_STATUS.md` as REM-008.

### Other

- E2E Playwright scenarios are documented in `E2E_SCENARIOS.md` but not yet
  automated.
- API rate limiting not implemented (low risk for single-user product).

## Architecture rules — non-negotiable

- Never import from `@/mock/*` — all data goes through `src/hooks/*`.
- Never persist form data in `localStorage` — use `useFormData`.
- Never expose `service_role` in the frontend or in versioned migrations.
- Never use `navigator.sendBeacon` for flush — use `fetch(..., { keepalive: true })` with the auth header.
- Never use `useBlocker` for async flush — it returns before the request lands.
- Always wrap pages with `<DataGuard>` for loading/error/empty states.
- Always validate Zod-first before any Supabase upsert.

See `CLAUDE.md` for full architecture rules and RLS policy patterns.
