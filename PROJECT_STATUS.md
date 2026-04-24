# ESG Nexus — Project Status Tracker

## P1 — Remove @/mock imports
- [ ] Audit and replace all 39 @/mock imports

## P2 — Supabase migrations (6 files)
- [ ] 00001_initial_schema.sql
- [ ] 00002_rls_policies.sql
- [ ] 00003_views.sql
- [ ] 00004_seed_catalogs.sql
- [ ] 00005_triggers.sql
- [ ] 00006_enable_realtime.sql

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
- [ ] LoginPage.jsx
- [ ] DashboardPage.jsx
- [ ] ClientiPage.jsx
- [ ] EngagementsPage.jsx
- [ ] DettaglioClientePage.jsx

## P6 — Edge Functions + deploy
- [ ] compute-engagement-progress
- [ ] generate-project-code
- [ ] check-deadlines
- [ ] send-notification-email
- [ ] Vercel deploy + env vars
