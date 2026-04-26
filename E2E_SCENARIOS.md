# Playwright E2E Scenarios — Post-Deploy

Documented now (Fix PROMPT-003), to be implemented after first production deploy.
Each scenario assumes a clean test account and that all 17 RLS policies are active.

## Scenario 1 — Onboarding flow
1. Sign up with new email
2. Verify `users_profile` row created automatically by trigger (`handle_new_user`)
3. Open `/impostazioni` and update `full_name` and `studio_nome`
4. Reload — fields persist
5. **Assertion:** profile UPDATE policy permits self-write; `created_at` ≠ `updated_at`

## Scenario 2 — Cliente + engagement creation
1. Login
2. Open `/clienti` → "Nuovo cliente"
3. Submit with valid `ragione_sociale` and `nazione=IT`
4. Open `/engagements` → "Nuovo engagement", select the new cliente
5. Verify the engagement appears with 8 `engagement_fasi` rows in DB
6. Verify `/stato-avanzamento` matrix shows 8 PROC columns for the new engagement
7. **Assertion:** `useCreateEngagement` invalidates both `['engagements']` and `['engagements_with_fasi']`

## Scenario 3 — Form persistence and proc_code derivation
1. Open an engagement detail
2. Open Tab PROC-00 → Form 00B (Pre-Qualifica)
3. Type into multiple fields rapidly
4. Wait 1.5 s (debounce)
5. Reload page — fields are pre-filled
6. **Assertion:** Single `form_data` row with `proc_code='PROC-00'` and merged JSON snapshot

## Scenario 4 — Realtime fanout
1. Open `/` (Dashboard) in Tab A
2. In Tab B, mark an `azioni_giorno` row as completed
3. **Assertion:** within 2 s, Tab A reflects the new completion count without reload

## Scenario 5 — Storage upload + access
1. Login as User A; upload a PDF to `engagement-docs/{user_a}/{engagement_id}/file.pdf`
2. Try to read the file — succeeds
3. Login as User B; try to read User A's file via signed URL — **denied** by RLS
4. **Assertion:** storage policies enforce per-user, per-engagement access
