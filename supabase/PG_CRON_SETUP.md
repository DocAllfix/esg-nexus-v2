# pg_cron Setup — Manual

**Why this is not a versioned migration (Fix SEC-001):**
This setup requires the `service_role_key`, which **must never** appear in Git.
Run these statements once in the Supabase SQL editor or via `psql` with admin
credentials. They reference values stored in Postgres settings, not in source.

## 1. Enable extensions

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

> On Supabase, both are available out of the box. `pg_net` is the HTTP client
> used to invoke the Edge Function from inside the database.

## 2. Store secrets in Postgres settings (NEVER in Git)

Run via SQL editor as the project owner:

```sql
-- service_role key (Supabase Dashboard → Project Settings → API → service_role)
ALTER DATABASE postgres SET app.settings.service_role_key = 'eyJhbG...';

-- Edge Function base URL (e.g. https://<project-ref>.supabase.co/functions/v1)
ALTER DATABASE postgres SET app.settings.edge_function_url =
  'https://<project-ref>.supabase.co/functions/v1';

-- Reload settings for the current session
SELECT pg_reload_conf();
```

## 3. Schedule check-deadlines every 6 hours

```sql
SELECT cron.schedule(
  'check-deadlines',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := current_setting('app.settings.edge_function_url') || '/check-deadlines',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type',  'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

## 4. Verify

```sql
SELECT jobid, schedule, command FROM cron.job;

-- Last 5 runs
SELECT * FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 5;
```

## 5. Unschedule (rollback)

```sql
SELECT cron.unschedule('check-deadlines');
```

## Database Webhook for compute-engagement-progress

**Dashboard route:** Database → Webhooks → Create a new hook

| Field         | Value                                              |
|---------------|----------------------------------------------------|
| Name          | `form_data_progress`                               |
| Table         | `public.form_data`                                 |
| Events        | `INSERT`, `UPDATE`                                 |
| Type          | Supabase Edge Function                             |
| Function      | `compute-engagement-progress`                      |
| HTTP Method   | `POST`                                             |
| HTTP Headers  | `Authorization: Bearer <service_role_key>`         |

The Edge Function carries its own webhook deduplication (Fix LOG-003): if a
later UPDATE for the same engagement already exists, the function returns
`{"skipped":"stale webhook"}` without recomputing.
