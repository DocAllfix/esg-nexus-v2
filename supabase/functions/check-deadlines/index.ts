// Scheduled job (run every 6h via pg_cron):
//   1. Mark scadenze in stato='pending' with data_scadenza < today as 'scaduta'
//   2. For scadenze due within next 7 days that haven't been notified, write
//      an entry into eventi_log and stamp notificata_at.
//
// Idempotent: notificata_at filter prevents duplicate notifications. Uses
// service_role to read across all users.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const today = isoDate(new Date());
    const in7 = isoDate(new Date(Date.now() + 7 * 86_400_000));

    // 1) Mark overdue
    const { data: overdue, error: overdueErr } = await admin
      .from("scadenze")
      .update({ stato: "scaduta", updated_at: new Date().toISOString() })
      .eq("stato", "pending")
      .lt("data_scadenza", today)
      .select("id");
    if (overdueErr) throw overdueErr;

    // 2) Notify upcoming
    const { data: upcoming, error: upErr } = await admin
      .from("scadenze")
      .select("id, engagement_id, titolo, data_scadenza, priorita, engagements!inner(user_id)")
      .eq("stato", "pending")
      .is("notificata_at", null)
      .gte("data_scadenza", today)
      .lte("data_scadenza", in7);
    if (upErr) throw upErr;

    const events = (upcoming ?? []).map((s: any) => ({
      user_id: s.engagements.user_id,
      engagement_id: s.engagement_id,
      tipo: "warning",
      titolo: `Scadenza in arrivo: ${s.titolo}`,
      descrizione: `Prevista per ${s.data_scadenza} (priorità ${s.priorita})`,
      metadata: { scadenza_id: s.id },
    }));

    if (events.length > 0) {
      const { error: logErr } = await admin.from("eventi_log").insert(events);
      if (logErr) throw logErr;

      const { error: stampErr } = await admin
        .from("scadenze")
        .update({ notificata_at: new Date().toISOString() })
        .in("id", (upcoming ?? []).map((s: any) => s.id));
      if (stampErr) throw stampErr;
    }

    return new Response(
      JSON.stringify({
        overdue_count: overdue?.length ?? 0,
        notified_count: events.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("check-deadlines error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
