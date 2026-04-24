import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_03C";

const checklistE = [
  { cat: "E1 — Cambiamento Climatico & GHG", items: [
    { q: "Le fonti di emissione Scope 1 sono state identificate e documentate?", ref: "ESRS E1-6 / GRI 305-1", r: 4 },
    { q: "Il sistema di misurazione Scope 2 (MB e LB) è operativo e documentato?", ref: "GRI 305-2 / ESRS E1-6", r: 3 },
    { q: "Le emissioni Scope 3 sono stimate con metodologia documentata (GHG Protocol)?", ref: "GRI 305-3 / ESRS E1-6", r: 2 },
    { q: "Esistono target di riduzione GHG con scadenze definite?", ref: "GRI 305-5 / ESRS E1-4", r: 2 },
    { q: "Il piano di transizione climatica è stato approvato dal CdA?", ref: "ESRS E1-1", r: 1 },
    { q: "L'intensità di emissioni per unità prodotta è calcolata e monitorata?", ref: "GRI 305-4", r: 3 },
  ]},
  { cat: "E1 — Energia", items: [
    { q: "Il consumo energetico totale è tracciato per fonte (gas, elettricità, rinnovabile)?", ref: "GRI 302-1 / ESRS E1-5", r: 4 },
    { q: "È presente una politica documentata sull'efficienza energetica?", ref: "GRI 302-4", r: 3 },
    { q: "Sono stati installati sistemi di produzione rinnovabile (fotovoltaico)?", ref: "GRI 302-1", r: 3 },
    { q: "Viene monitorata l'intensità energetica per unità prodotta?", ref: "GRI 302-3", r: 2 },
  ]},
  { cat: "E2–E5 — Inquinamento, Acqua, Biodiversità, Rifiuti", items: [
    { q: "Gli scarichi di acque reflue sono monitorati con campionamento periodico?", ref: "GRI 303-2 / ESRS E3", r: 3 },
    { q: "I rifiuti prodotti sono classificati per tipologia (pericolosi/non pericolosi)?", ref: "GRI 306-3 / ESRS E5", r: 4 },
    { q: "Sono tracciate le tonnellate di rifiuti avviate a riciclo vs smaltimento?", ref: "GRI 306-4 / ESRS E5", r: 4 },
    { q: "È stata condotta un'analisi di impatto sulla biodiversità del sito produttivo?", ref: "GRI 304-1 / ESRS E4", r: 1 },
    { q: "Esiste una politica per la riduzione delle emissioni in atmosfera (NOx, SOx, PM)?", ref: "GRI 305-7 / ESRS E2", r: 2 },
  ]},
];

const ratingLabels = ["Critico", "Basso", "Medio", "Buono", "Conforme"];
const ratingColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-lime-500", "bg-green-600"];
const ratingBg = ["bg-red-50/40", "bg-orange-50/30", "bg-yellow-50/20", "", "bg-green-50/20"];

export default function Form03C() {
  const [ratings, setRatings] = useState(
    checklistE.flatMap(cat => cat.items.map((item, i) => ({ key: `${cat.cat}-${i}`, val: item.r })))
      .reduce((acc, { key, val }) => ({ ...acc, [key]: val }), {})
  );
  const [notes, setNotes] = useState({});

  const allRatings = Object.values(ratings);
  const avg = (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1);
  const critici = allRatings.filter(r => r <= 1).length;
  const bassi = allRatings.filter(r => r === 2).length;

  const levelColor = avg >= 4 ? "text-green-700" : avg >= 3 ? "text-amber-600" : "text-red-600";

  return (
    <FormWrapper
      formCode="FORM-03C"
      title="Audit Area E — Ambiente"
      subtitle="Checklist di conformità per le disclosure ambientali GRI e ESRS"
      meta={{ "Fase": "PROC-03.3", "Resp.": "Luca Ferri", "Standard": "GRI 302/303/304/305/306 + ESRS E1–E5" }}
      ruleBox="🌿 Valutare ogni criterio su scala 1–5 (1=Critico, 5=Conforme). I criteri con rating 1–2 generano gap da inserire nel Report di Diagnosi."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* SCORE HEADER */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Score medio Area E", value: `${avg}/5`, color: levelColor },
          { label: "Criteri valutati", value: allRatings.length, color: "text-foreground" },
          { label: "Gap critici (1)", value: critici, color: "text-red-600" },
          { label: "Gap bassi (2)", value: bassi, color: "text-orange-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {checklistE.map(cat => (
        <FormSection key={cat.cat} title={cat.cat} cols={1}>
          <div className="space-y-3">
            {cat.items.map((item, i) => {
              const key = `${cat.cat}-${i}`;
              const val = ratings[key] || item.r;
              return (
                <div key={i} className={cn("p-4 rounded-lg border", val <= 1 ? "border-red-300 bg-red-50/30" : val === 2 ? "border-orange-200 bg-orange-50/20" : "border-border")}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm font-medium">{item.q}</p>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded shrink-0 font-mono">{item.ref}</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {ratingLabels.map((label, ri) => (
                      <button
                        key={ri}
                        onClick={() => setRatings(prev => ({ ...prev, [key]: ri + 1 }))}
                        className={cn(
                          "flex-1 py-1.5 rounded text-xs font-medium transition-all",
                          val === ri + 1 ? `${ratingColors[ri]} text-white shadow-sm` : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                        )}
                      >
                        {ri + 1} · {label}
                      </button>
                    ))}
                  </div>
                  {val <= 2 && (
                    <input
                      value={notes[key] || ""}
                      onChange={e => setNotes(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="Descrivi il gap e il contesto rilevato..."
                      className="w-full border border-red-200 rounded px-2 py-1 text-xs bg-background"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </FormSection>
      ))}
    </FormWrapper>
  );
}