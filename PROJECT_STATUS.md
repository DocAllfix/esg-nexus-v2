# ESG Nexus — Project Status Tracker

## P1 — Remove @/mock imports + wire residual placeholders
- [x] Audit confirmed zero @/mock imports remain in src/ (already done in earlier sessions)
- [x] Cataloghi.jsx wired to catalogo_iro + kpi_definizioni via useCataloghi hook `pending`
- [x] Cataloghi.jsx — removed crash-prone hardcoded arrays (irosAcme/kpiLibrary/ghgData) `pending`
- [x] CommandPalette.jsx wired to useClienti + useEngagements `pending`

## P2 — Supabase migrations (7 files, ALL applied to mjerafarrifhijkelqfr)
- [x] 00001_initial_schema.sql — 18 public tables `applied`
- [x] 00002_rls_policies.sql — RLS on 18/18 tables `applied`
- [x] 00003_views.sql `applied`
- [x] 00004_seed_catalogs.sql — 24 IRO + 19 KPI seeded `applied`
- [x] 00005_triggers.sql — handle_new_user etc. `applied`
- [x] 00006_enable_realtime.sql `applied`
- [x] 00007_storage_buckets.sql — 3 buckets + 9 RLS policies `applied 2026-04-26`

## P3 — Data Access Layer (hooks + schemas)
- [x] src/schemas/index.js — 8 Zod schemas `7ec1646`
- [x] src/hooks/useFormData.js — triple-audited, useRef flush, keepalive `7ec1646`
- [x] src/hooks/useClienti.js `7ec1646`
- [x] src/hooks/useEngagements.js `7ec1646`
- [x] src/hooks/useRischi.js `7ec1646`
- [x] src/hooks/useGhgVoci.js `7ec1646`
- [x] src/hooks/useKpiValori.js `7ec1646`
- [x] src/hooks/useScadenze.js `7ec1646`
- [x] src/hooks/useDashboard.js `7ec1646`
- [x] src/hooks/useAnalytics.js `7ec1646`
- [x] P3 DB schema alignment fix `7ec1646`

## P4 — Wire forms to useFormData

### P4a — PROC-00 (Acquisizione Cliente)
- [x] FormWrapper.jsx — remove localStorage, add status/onSave props `b7cf30d`
- [x] Form00A — Primo Contatto `b7cf30d`
- [x] Form00B — Pre-Qualifica (+ d1_table) `b7cf30d`
- [x] Form00C — Score Pre-Qualifica (+ scores radar) `b7cf30d`
- [x] Form00D — Conflitti Interesse `b7cf30d`
- [x] Form00E — Offerta Commerciale (+ piano + economics) `b7cf30d`
- [x] Form00F — KYC (+ kyc_rows) `b7cf30d`
- [x] Form00G — Chiusura Fase 0 `b7cf30d`
- [x] TabProc00/index.jsx — useFormStatuses + engagementId prop `b7cf30d`

### P4b — PROC-01
- [x] Form01A … Form01G + TabProc01/index.jsx `882c454`

### P4c — PROC-02
- [x] Form02A … Form02G + TabProc02/index.jsx `882c454`

### P4d — PROC-03
- [x] Form03A … Form03G + TabProc03/index.jsx `882c454`

### P4e — PROC-04
- [x] Form04A … Form04G + TabProc04/index.jsx `882c454`

### P4f — PROC-05
- [x] Form05A … Form05G + TabProc05/index.jsx `882c454`

### P4g — PROC-06
- [x] Form06A … Form06H + Form06LOG + TabProc06/index.jsx `882c454`

### P4h — PROC-07
- [x] Form07A … Form07G + Form07LOG + TabProc07/index.jsx `8b8815b`

### P4i — DettaglioEngagement
- [x] DettaglioEngagement.jsx — useEngagement/useRischi/useScadenze, engagementId prop to all TabProc

## P5 — Pages wiring (Auth, Clienti, Engagements, Dashboard)
- [x] Dashboard.jsx — useDashboard, KPI live, azioni toggle mutation `97199ff`
- [x] Clienti.jsx — useClienti + useEngagements, zod validation `97199ff`
- [x] Engagements.jsx — useEngagements, NuovoEngagementDialog `97199ff`
- [x] DettaglioCliente.jsx — useCliente + useEngagements `97199ff`
- [x] Analytics.jsx — useAnalytics, tutti i grafici live `97199ff`
- [x] StatoAvanzamento.jsx — useEngagementsWithFasi, matrice live `97199ff`
- [x] Sidebar.jsx — useEngagements per shortcut `97199ff`
- [x] Topbar.jsx — useAuth, signOut `97199ff`
- [x] Impostazioni.jsx — users_profile upsert `97199ff`
- [x] NuovoClienteDrawer.jsx — clienteSchema validation `97199ff`
- [x] NuovoEngagementDialog.jsx — engagementSchema validation (nuovo) `97199ff`
- [x] P5 post-verification bug fixes (BUG-2 cache invalidation, BUG-3 empty strings, schema sito_web/indirizzo/note) `ab7a200`

## P6 — Edge Functions + hardening
- [x] compute-engagement-progress (LOG-003 dedup) `deployed v1 2026-04-26`
- [x] generate-project-code `deployed v1 2026-04-26 — smoke test PASS`
- [x] check-deadlines `deployed v1 2026-04-26`
- [x] send-notification-email (Resend) `deployed v1 2026-04-26 — needs RESEND_API_KEY secret`
- [x] DB webhook `form_data → compute-engagement-progress` (Vault-based) `2026-04-26`
- [x] pg_cron `check-deadlines` every 6h — end-to-end test PASS (200 OK) `2026-04-26`
- [x] Storage buckets migration (00007_storage_buckets.sql) `pending`
- [x] pg_cron documentation (SEC-001, manual setup) `pending`
- [x] Realtime subscriptions in Dashboard `pending`
- [x] ErrorBoundary global wrap `pending`
- [x] vercel.json security headers (CSP/HSTS, REM-008 noted) `pending`
- [x] Vitest + tests (5 tests, 3 files: useClienti, useFormData, useEngagements) `pending`
- [x] E2E_SCENARIOS.md (5 Playwright scenarios documented) `pending`
- [ ] Vercel deploy + env vars (post-merge)

## P7 — Pre-test audit fixes (deep audit 2026-04-26)

### Critical (DB + edge function)
- [x] C1 — Indici FK mancanti su iro_engagement.catalogo_iro_id e azioni_giorno.engagement_id `applied`
- [x] C3 — Trigger BEFORE INSERT generate_codice_progetto con advisory lock anti-race `applied + migration 00008`
- [x] C4 — compute-engagement-progress: validation strict del payload webhook (envelope + table + schema + engagement_id) `re-deployed v2`

### Major
- [x] M1+M3 — Date validation regex YYYY-MM-DD + campi note/data_fine_effettiva in engagementSchema
- [x] M4 — useFormData: serializzazione dei flush concorrenti via inFlightRef (anti out-of-order race)

### UX / Perf
- [x] Q1 — Code splitting con lazy routes: index.js da 1581 KB → 555 KB, 9 chunk lazy
- [x] Q2 — Optimistic update su azioni_giorno toggle (UX istantanea)
- [x] Q5 — SyncIndicator + OfflineBadge globali in Topbar (useIsMutating/useIsFetching)
- [x] Q4 — Esport CSV su Clienti + Engagements (no PDF/Word, RFC 4180 + UTF-8 BOM)

### Cleanup deps (Batch B+C: 35 file shadcn rimossi + 29 npm deps)
- [x] P3 — chart.jsx eliminato
- [x] P2 — form.jsx + react-hook-form + @hookform/resolvers eliminati
- [x] P1 — 33 altri file shadcn unused + 27 deps (next-themes, vaul, cmdk, sonner, embla, input-otp, react-resizable-panels, 19 @radix-ui orfani)

### DevOps
- [x] I1 — GitHub Actions CI workflow: lint + test + build su push/PR

### Skipped (con motivazione)
- [ ] C2 — bottoni PDF/Word in FormWrapper: utente vuole analizzare a parte
- [ ] M2 — RPC get_dashboard_data: overkill per single-user, defer post-MVP
- [ ] M5 — CSP nonce-based: alto rischio regressione dev mode, defer
- [ ] Q3 — Quick-create da CommandPalette: scope creep, defer
- [ ] I2 — Sentry: richiede DSN account utente
- [ ] I3 — backup off-site schedulato: richiede decisione destinazione
