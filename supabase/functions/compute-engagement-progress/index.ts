// deno-lint-ignore-file no-explicit-any
// Webhook handler: triggered on INSERT/UPDATE of public.form_data.
// Recomputes engagement_fasi.progresso/stato and engagements.progresso.
//
// Fix LOG-003: webhook deduplication.
//   The same write can fan out into multiple webhook deliveries (retries, batching).
//   Before recomputing, we verify that THIS payload is the most recent update for
//   the given engagement. If a newer row exists, we skip — the newer event will
//   carry the freshest snapshot.
//
// Fix SEC-001: service_role key is read from env (never hardcoded, never in Git).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";

interface FormDataRow {
  id: string;
  engagement_id: string;
  form_code: string;
  proc_code: string;
  status: "non_iniziato" | "in_corso" | "completato";
  updated_at: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: FormDataRow | null;
  old_record: FormDataRow | null;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in edge function env",
  );
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const FORMS_PER_PROC: Record<string, number> = {
  "PROC-00": 7,
  "PROC-01": 7,
  "PROC-02": 7,
  "PROC-03": 7,
  "PROC-04": 7,
  "PROC-05": 7,
  "PROC-06": 9,
  "PROC-07": 8,
};

function statoFromProgress(p: number): "non_iniziata" | "in_corso" | "completata" {
  if (p >= 100) return "completata";
  if (p > 0) return "in_corso";
  return "non_iniziata";
}

async function recompute(engagementId: string): Promise<{
  perProc: Record<string, { progresso: number; stato: string }>;
  global: number;
}> {
  const { data: forms, error } = await admin
    .from("form_data")
    .select("proc_code, status")
    .eq("engagement_id", engagementId);
  if (error) throw error;

  const counts: Record<string, { completati: number; in_corso: number }> = {};
  for (const f of forms ?? []) {
    counts[f.proc_code] ??= { completati: 0, in_corso: 0 };
    if (f.status === "completato") counts[f.proc_code].completati += 1;
    else if (f.status === "in_corso") counts[f.proc_code].in_corso += 1;
  }

  const perProc: Record<string, { progresso: number; stato: string }> = {};
  for (const proc of Object.keys(FORMS_PER_PROC)) {
    const total = FORMS_PER_PROC[proc];
    const c = counts[proc] ?? { completati: 0, in_corso: 0 };
    // weight: completed forms count fully, in-progress forms count half
    const weighted = c.completati + c.in_corso * 0.5;
    const progresso = Math.min(100, Math.round((weighted / total) * 100));
    perProc[proc] = { progresso, stato: statoFromProgress(progresso) };
  }

  const procValues = Object.values(perProc);
  const global = procValues.length === 0
    ? 0
    : Math.round(procValues.reduce((s, p) => s + p.progresso, 0) / procValues.length);

  return { perProc, global };
}

async function isLatestUpdate(
  engagementId: string,
  payloadUpdatedAt: string,
): Promise<boolean> {
  const { data, error } = await admin
    .from("form_data")
    .select("updated_at")
    .eq("engagement_id", engagementId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return true;
  return new Date(payloadUpdatedAt).getTime() >= new Date(data.updated_at).getTime();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = raw as Partial<WebhookPayload>;

    // Strict validation: webhook from Postgres trigger always has these fields.
    // Anything else is rejected with 400, not silently 500'd.
    const validType = ["INSERT", "UPDATE", "DELETE"].includes(payload.type as string);
    if (!validType || typeof payload.table !== "string" || typeof payload.schema !== "string") {
      return new Response(JSON.stringify({ error: "Invalid webhook envelope" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (payload.table !== "form_data" || payload.schema !== "public") {
      return new Response(JSON.stringify({ skipped: "unsupported table/schema" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = payload.record ?? payload.old_record;
    if (!row || typeof row.engagement_id !== "string" || row.engagement_id.length < 32) {
      return new Response(JSON.stringify({ skipped: "no valid engagement_id" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // LOG-003: dedup
    if (row.updated_at && payload.type !== "DELETE") {
      const fresh = await isLatestUpdate(row.engagement_id, row.updated_at);
      if (!fresh) {
        return new Response(JSON.stringify({ skipped: "stale webhook" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { perProc, global } = await recompute(row.engagement_id);

    // Update engagement_fasi rows in parallel
    const upserts = Object.entries(perProc).map(([proc_code, v]) =>
      admin
        .from("engagement_fasi")
        .update({
          progresso: v.progresso,
          stato: v.stato,
          updated_at: new Date().toISOString(),
        })
        .eq("engagement_id", row.engagement_id)
        .eq("proc_code", proc_code)
    );
    const results = await Promise.all(upserts);
    for (const r of results) if (r.error) throw r.error;

    const { error: engErr } = await admin
      .from("engagements")
      .update({ progresso: global, updated_at: new Date().toISOString() })
      .eq("id", row.engagement_id);
    if (engErr) throw engErr;

    return new Response(
      JSON.stringify({ engagement_id: row.engagement_id, global, perProc }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("compute-engagement-progress error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
