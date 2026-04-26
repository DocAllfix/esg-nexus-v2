// Sends a transactional email via Resend.
// Requires env vars:
//   - RESEND_API_KEY        (secret, set via `supabase secrets set`)
//   - RESEND_FROM_ADDRESS   (e.g. "ESG Nexus <noreply@esgnexus.app>")
//
// Body: { to: string|string[], subject: string, title: string, body: string, cta?: { label, href } }

import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RESEND_FROM = Deno.env.get("RESEND_FROM_ADDRESS") ??
  "ESG Nexus <noreply@esgnexus.app>";

interface EmailPayload {
  to: string | string[];
  subject: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderHtml({ title, body, cta }: EmailPayload): string {
  const safeTitle = escapeHtml(title);
  const safeBody = escapeHtml(body).replace(/\n/g, "<br/>");
  const ctaBlock = cta
    ? `<p style="margin:24px 0 0;text-align:center">
         <a href="${escapeHtml(cta.href)}"
            style="background:#0f766e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:600;font-size:14px;display:inline-block">
           ${escapeHtml(cta.label)}
         </a>
       </p>`
    : "";
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,system-ui,Segoe UI,Roboto,sans-serif;color:#1f2937">
  <div style="max-width:560px;margin:32px auto;background:#fff;border:1px solid #e7e5e4;border-radius:12px;overflow:hidden">
    <div style="background:#0f766e;color:#fff;padding:18px 24px;font-weight:700;font-size:15px;letter-spacing:.02em">
      ESG Nexus
    </div>
    <div style="padding:28px 24px">
      <h1 style="margin:0 0 12px;font-size:18px;font-weight:600">${safeTitle}</h1>
      <p style="margin:0;line-height:1.55;font-size:14px;color:#374151">${safeBody}</p>
      ${ctaBlock}
    </div>
    <div style="padding:14px 24px;border-top:1px solid #e7e5e4;font-size:11px;color:#9ca3af;text-align:center">
      Notifica automatica · ESG Nexus
    </div>
  </div>
</body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload = (await req.json()) as EmailPayload;
    if (!payload.to || !payload.subject || !payload.body) {
      return new Response(JSON.stringify({ error: "Missing to/subject/body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = renderHtml(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Resend rejected", data }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("send-notification-email error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
