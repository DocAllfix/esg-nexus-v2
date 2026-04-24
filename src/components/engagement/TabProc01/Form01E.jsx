import { useState, useMemo } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_form_01E";
const INITIAL = acmeFormData["01E"] ?? {};

const CLASSI = {
  CRITICO: { cls: "bg-red-600 text-white", border: "border-red-300 bg-red-50/30" },
  ALTO: { cls: "bg-orange-500 text-white", border: "border-orange-200 bg-orange-50/20" },
  MEDIO: { cls: "bg-amber-400 text-amber-900", border: "border-amber-200 bg-amber-50/20" },
  BASSO: { cls: "bg-green-500 text-white", border: "border-green-200 bg-green-50/20" },
};

const STATI_OPTIONS = ["aperto", "in_gestione", "monitorato", "chiuso"];

// 5x5 Heatmap
const HEATMAP_COLORS = (p, i) => {
  const score = p * i;
  if (score >= 15) return "bg-red-600 text-white";
  if (score >= 10) return "bg-orange-500 text-white";
  if (score >= 6) return "bg-amber-400 text-amber-900";
  if (score >= 3) return "bg-yellow-200 text-yellow-900";
  return "bg-green-100 text-green-800";
};

export default function Form01E() {
  const [rischi, setRischi] = useState(INITIAL.rischi || []);
  const setRischio = (i, k, v) => setRischi(p => { const n = [...p]; n[i] = { ...n[i], [k]: Number.isNaN(Number(v)) ? v : (["prob", "impatto", "score"].includes(k) ? Number(v) : v) }; return n; });

  // Ricalcola score
  const rischiCalcolati = rischi.map(r => ({ ...r, score: r.prob * r.impatto }));

  const stats = useMemo(() => ({
    critici: rischi.filter(r => r.classe === "CRITICO").length,
    alti: rischi.filter(r => r.classe === "ALTO").length,
    medi: rischi.filter(r => r.classe === "MEDIO").length,
    bassi: rischi.filter(r => r.classe === "BASSO").length,
  }), [rischi]);

  return (
    <FormWrapper
      formCode="FORM-01E"
      title="Risk Register"
      subtitle="Registro e piano di gestione dei rischi di progetto"
      meta={{ "Fase": "PROC-01.5", "Resp.": "Project Manager + Partner", "Output": "Risk Register approvato e condiviso" }}
      ruleBox="⚠️ Rischi CRITICI (score ≥ 15) richiedono approvazione partner e piano B definito. Aggiornare stato ad ogni SC mensile."
      ruleBoxType="warning"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >
      {/* STATISTICHE */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Critici", value: stats.critici, cls: "text-red-600" },
          { label: "Alti", value: stats.alti, cls: "text-orange-600" },
          { label: "Medi", value: stats.medi, cls: "text-amber-600" },
          { label: "Bassi", value: stats.bassi, cls: "text-green-700" },
        ].map(s => (
          <div key={s.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", s.cls)}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* HEATMAP 5x5 */}
      <FormSection title="Heatmap rischio (probabilità × impatto)" cols={1}>
        <div className="flex gap-4 items-end">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground mb-1 text-center font-semibold">P↓ I→</p>
            {[5, 4, 3, 2, 1].map(prob => (
              <div key={prob} className="flex gap-0.5 items-center">
                <span className="text-xs w-4 text-right text-muted-foreground mr-1">{prob}</span>
                {[1, 2, 3, 4, 5].map(imp => {
                  const rischiInCella = rischiCalcolati.filter(r => r.prob === prob && r.impatto === imp);
                  return (
                    <div key={imp} className={cn("w-10 h-10 rounded flex items-center justify-center text-xs font-bold relative", HEATMAP_COLORS(prob, imp))}>
                      {rischiInCella.length > 0 && (
                        <span className="w-6 h-6 rounded-full bg-white/90 text-gray-900 text-xs font-bold flex items-center justify-center">
                          {rischiInCella.map(r => r.id.replace("R", "")).join(",")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="flex gap-0.5 items-center mt-0.5">
              <span className="w-4 mr-1" />
              {[1, 2, 3, 4, 5].map(i => <span key={i} className="w-10 text-center text-xs text-muted-foreground">{i}</span>)}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            {[["CRITICO", "Score ≥ 15"], ["ALTO", "Score 8–14"], ["MEDIO", "Score 4–7"], ["BASSO", "Score 1–3"]].map(([cls, label]) => (
              <div key={cls} className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded", CLASSI[cls].cls)} />
                <span className="text-xs">{cls} — {label}</span>
              </div>
            ))}
          </div>
        </div>
      </FormSection>

      {/* TABELLA RISCHI */}
      <FormSection title="Registro rischi" cols={1}>
        <div className="space-y-3">
          {rischiCalcolati.map((r, i) => {
            const cfg = CLASSI[r.classe] || CLASSI.BASSO;
            return (
              <div key={r.id} className={cn("rounded-lg border p-4 space-y-3", cfg.border)}>
                <div className="flex items-start gap-3 flex-wrap">
                  <span className="font-mono text-xs text-muted-foreground font-bold w-8">{r.id}</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold border-0", cfg.cls)}>{r.classe}</span>
                  <span className="text-sm font-semibold flex-1">{r.descrizione}</span>
                  <div className="flex gap-2 items-center shrink-0">
                    <span className="text-xs text-muted-foreground">P:</span>
                    <input type="number" min={1} max={5} value={r.prob} onChange={e => setRischio(i, "prob", e.target.value)} className="w-10 border border-border rounded px-1 py-0.5 text-xs text-center bg-background" />
                    <span className="text-xs text-muted-foreground">I:</span>
                    <input type="number" min={1} max={5} value={r.impatto} onChange={e => setRischio(i, "impatto", e.target.value)} className="w-10 border border-border rounded px-1 py-0.5 text-xs text-center bg-background" />
                    <span className={cn("w-8 h-7 rounded flex items-center justify-center text-sm font-bold", cfg.cls)}>{r.score}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium mb-1">Piano di mitigazione</p>
                    <textarea value={r.mitigazione} onChange={e => setRischio(i, "mitigazione", e.target.value)} rows={2} className="w-full border border-border rounded px-2 py-1 text-xs bg-background resize-none" />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Piano B (fallback)</p>
                    <textarea value={r.piano_b} onChange={e => setRischio(i, "piano_b", e.target.value)} rows={2} className="w-full border border-border rounded px-2 py-1 text-xs bg-background resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <span className="text-xs text-muted-foreground">Categoria: <span className="font-medium text-foreground">{r.categoria}</span></span>
                  <span className="text-xs text-muted-foreground">Owner studio: <span className="font-medium text-foreground">{r.owner_studio}</span></span>
                  {r.owner_cliente && <span className="text-xs text-muted-foreground">Owner cliente: <span className="font-medium text-foreground">{r.owner_cliente}</span></span>}
                  <select value={r.stato} onChange={e => setRischio(i, "stato", e.target.value)} className={cn("ml-auto text-xs px-2 py-0.5 rounded border border-border bg-background")}>
                    {STATI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </FormSection>
    </FormWrapper>
  );
}