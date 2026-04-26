// Generates a unique engagement project code: ESG-{ANNO}-{SIGLA}-{NNN}.
//   - anno: 4-digit year
//   - cliente_sigla: 3-letter uppercase code derived from the cliente name
//   - sequence: zero-padded 3-digit, monotonically increasing per (anno, sigla)
//
// Uses service_role to scan engagements (RLS-bypass needed because the caller
// might not own all rows that share the same prefix).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function sanitizeSigla(input: string): string {
  const cleaned = input
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase()
    .slice(0, 3);
  return cleaned.padEnd(3, "X");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { anno, cliente_sigla } = await req.json();

    if (!anno || typeof anno !== "number" || anno < 2015 || anno > 2050) {
      return new Response(JSON.stringify({ error: "Invalid anno" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!cliente_sigla || typeof cliente_sigla !== "string") {
      return new Response(JSON.stringify({ error: "Missing cliente_sigla" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sigla = sanitizeSigla(cliente_sigla);
    const prefix = `ESG-${anno}-${sigla}-`;

    const { data, error } = await admin
      .from("engagements")
      .select("codice_progetto")
      .like("codice_progetto", `${prefix}%`);
    if (error) throw error;

    let max = 0;
    for (const r of data ?? []) {
      const tail = (r.codice_progetto ?? "").slice(prefix.length);
      const n = parseInt(tail, 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }

    const next = String(max + 1).padStart(3, "0");
    const project_code = `${prefix}${next}`;

    return new Response(JSON.stringify({ project_code }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("generate-project-code error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
