# pg_cron + Database Webhook Setup — Manual

**Why this is not a versioned migration (Fix SEC-001):**
This setup requires the `service_role_key`, which **must never** appear in Git.
Run these statements once via SQL Editor (Supabase Dashboard) or `supabase db query --linked`.

> **Note (2026-04-26):** the `ALTER DATABASE postgres SET app.settings.*` pattern
> originally documented here is **blocked by Supabase** with `ERROR 42501:
> permission denied to set parameter`. The supported path is **Supabase Vault**
> for secret storage and `vault.decrypted_secrets` for read-back. The full setup
> below uses Vault and was applied to project `mjerafarrifhijkelqfr`.

## 1. Enable extensions

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

> On Supabase, both are available out of the box. `pg_net` is the HTTP client
> used to invoke the Edge Function from inside the database.

## 2. Store the service_role key in Vault (NEVER in Git)

The key lives encrypted in `vault.secrets`; reads go through `vault.decrypted_secrets`.

```sql
-- Idempotent: skip if already created
SELECT vault.create_secret(
  'eyJhbG...',                                                -- the service_role JWT
  'service_role_key',
  'service_role JWT used by triggers and pg_cron to invoke edge functions'
)
WHERE NOT EXISTS (
  SELECT 1 FROM vault.secrets WHERE name = 'service_role_key'
);
```

To rotate the key: `UPDATE vault.secrets SET secret = '<new>' WHERE name = 'service_role_key';`
The trigger and cron wrappers will pick up the new value on the next call.

## 3. Wrapper function for check-deadlines (called by pg_cron)

`SECURITY DEFINER` is required because `net.http_post` is not granted to
`authenticated`/`anon`. The function runs as `postgres` (its owner), which has
the grant. `SET search_path = ''` mitigates search_path injection.

```sql
CREATE OR REPLACE FUNCTION public.invoke_check_deadlines()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_service_key text;
BEGIN
  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key' LIMIT 1;

  IF v_service_key IS NULL THEN
    RAISE WARNING 'invoke_check_deadlines: service_role_key secret missing in vault';
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/check-deadlines',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || v_service_key,
      'Content-Type',  'application/json'
    ),
    body := '{}'::jsonb
  );
END;
$$;
```

## 4. Schedule check-deadlines every 6 hours

```sql
-- Unschedule existing job if any (idempotent)
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'check-deadlines';

SELECT cron.schedule(
  'check-deadlines',
  '0 */6 * * *',
  'SELECT public.invoke_check_deadlines()'
);
```

## 5. Verify cron

```sql
SELECT jobid, jobname, schedule, command, active FROM cron.job;

-- Last 5 runs
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 5;

-- Last HTTP responses (from net extension)
SELECT id, status_code, content_type, LEFT(content::text, 200) AS body, error_msg
FROM net._http_response
ORDER BY created DESC LIMIT 5;
```

## 6. Unschedule (rollback)

```sql
SELECT cron.unschedule('check-deadlines');
```

---

## Database Webhook for compute-engagement-progress

The webhook is a Postgres trigger that calls the edge function whenever a
`form_data` row is inserted or updated. Same Vault pattern as above.

### Trigger function

```sql
CREATE OR REPLACE FUNCTION public.trigger_compute_engagement_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_service_key text;
  v_url text := 'https://<project-ref>.supabase.co/functions/v1/compute-engagement-progress';
BEGIN
  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key' LIMIT 1;

  IF v_service_key IS NULL THEN
    RAISE WARNING 'trigger_compute_engagement_progress: service_role_key secret missing in vault';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || v_service_key,
      'Content-Type',  'application/json'
    ),
    body := jsonb_build_object(
      'type',       TG_OP,
      'table',      TG_TABLE_NAME,
      'schema',     TG_TABLE_SCHEMA,
      'record',     to_jsonb(NEW),
      'old_record', to_jsonb(OLD)
    )
  );

  RETURN NEW;
END;
$$;
```

### Trigger

```sql
DROP TRIGGER IF EXISTS form_data_progress_webhook ON public.form_data;

CREATE TRIGGER form_data_progress_webhook
  AFTER INSERT OR UPDATE ON public.form_data
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_compute_engagement_progress();
```

The Edge Function carries its own webhook deduplication (Fix LOG-003): if a
later UPDATE for the same engagement already exists when the function fires,
it returns `{"skipped":"stale webhook"}` without recomputing.

### Why a custom trigger (not the Dashboard webhook UI)

- Single source of truth for the service_role key (Vault), instead of inlining
  the JWT into `pg_trigger`/`pg_proc` source visible to anyone with sufficient
  privileges.
- Easier rotation: change one row in `vault.secrets`.
- Same pattern as the cron wrapper for consistency.
- The Dashboard webhook UI ultimately writes a similar trigger using
  `supabase_functions.http_request`, with the bearer header inlined.
