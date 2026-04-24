import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_03D";

const checklistS = [
  { cat: "S1 — Forza lavoro propria: Salute e Sicurezza", items: [
    { q: "Esiste un sistema di gestione SSL conforme (ISO 45001 o D.Lgs. 81/08)?", ref: "GRI 403-1 / ESRS S1-14", r: 4 },
    { q: "Il tasso di infortuni (TRIR) è calcolato e monitorato con storico triennale?", ref: "GRI 403-9 / ESRS S1-14", r: 4 },
    { q: "Le malattie professionali sono tracciate e gestite?", ref: "GRI 403-10", r: 3 },
    { q: "I lavoratori ricevono formazione SSL documentata annualmente?", ref: "GRI 403-5 / ESRS S1-13", r: 5 },
    { q: "Esiste un'indagine sul benessere organizzativo / engagement survey?", ref: "ESRS S1-14", r: 2 },
  ]},
  { cat: "S1 — Forza lavoro: Sviluppo e Formazione", items: [
    { q: "Le ore di formazione per dipendente per categoria sono monitorate?", ref: "GRI 404-1 / ESRS S1-13", r: 4 },
    { q: "Esiste un piano di sviluppo professionale individuale (PDR/performance review)?", ref: "GRI 404-3 / ESRS S1-13", r: 3 },
    { q: "I programmi di riqualificazione per transizione digitale/green sono attivi?", ref: "ESRS S1-13", r: 2 },
    { q: "Esiste una policy retributiva trasparente con bande salariali?", ref: "ESRS S1-16", r: 2 },
  ]},
  { cat: "S1 — Forza lavoro: Diversità e Inclusione", items: [
    { q: "I dati occupazionali per genere, età e categoria sono rilevati e pubblicati?", ref: "GRI 405-1 / ESRS S1-6", r: 4 },
    { q: "Il gender pay gap è calcolato con metodologia documentata?", ref: "GRI 405-2 / ESRS S1-16", r: 2 },
    { q: "Esiste una policy D&I formalizzata e approvata dal CdA?", ref: "ESRS S1-1", r: 1 },
    { q: "È presente un piano di azioni affirmative per la parità di genere?", ref: "ESRS S1", r: 1 },
  ]},
  { cat: "S2 — Catena di Fornitura", items: [
    { q: "Esiste una supply chain policy con requisiti ESG per i fornitori?", ref: "GRI 414-1 / ESRS S2-1", r: 1 },
    { q: "Viene effettuato un audit ESG sui fornitori critici?", ref: "GRI 414-2 / ESRS S2-4", r: 1 },
    { q: "I fornitori sono classificati per rischio ESG?", ref: "ESRS S2-2", r: 2 },
  ]},
  { cat: "S3 — Comunità locale", items: [
    { q: "Esistono iniziative documentate di contributo alla comunità locale?", ref: "GRI 413-1 / ESRS S3", r: 3 },
    { q: "È presente una policy di gestione degli impatti sulla comunità?", ref: "GRI 413-2 / ESRS S3-2", r: 2 },
  ]},
];

const ratingLabels = ["Critico", "Basso", "Medio", "Buono", "Conforme"];
const ratingColors = ["bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-lime-500", "bg-green-600"];

export default function Form03D() {
  const [ratings, setRatings] = useState(
    checklistS.flatMap(cat => cat.items.map((item, i) => ({ key: `${cat.cat}-${i}`, val: item.r })))
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
      formCode="FORM-03D"
      title="Audit Area S — Sociale"
      subtitle="Checklist di conformità per le disclosure sociali GRI e ESRS"
      meta={{ "Fase": "PROC-03.4", "Resp.": "Sara Greco", "Standard": "GRI 401/403/404/405/413/414 + ESRS S1–S3" }}
      ruleBox="👥 Valutare ogni criterio su scala 1–5. Particolare attenzione ai gap su D&I, gender pay gap e supply chain — temi in forte evoluzione normativa ESRS."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Score medio Area S", value: `${avg}/5`, color: levelColor },
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

      {checklistS.map(cat => (
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
                      <button key={ri} onClick={() => setRatings(prev => ({ ...prev, [key]: ri + 1 }))}
                        className={cn("flex-1 py-1.5 rounded text-xs font-medium transition-all",
                          val === ri + 1 ? `${ratingColors[ri]} text-white shadow-sm` : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                        )}>
                        {ri + 1} · {label}
                      </button>
                    ))}
                  </div>
                  {val <= 2 && (
                    <input value={notes[key] || ""} onChange={e => setNotes(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="Descrivi il gap e il contesto rilevato..."
                      className="w-full border border-orange-200 rounded px-2 py-1 text-xs bg-background" />
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