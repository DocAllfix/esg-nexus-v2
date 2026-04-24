import { useState } from "react";
import FormWrapper, { FormSection } from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const capitoliBilancio = [];

const STORAGE_KEY = "esg_form_06B";

const CAPITOLI_AMBIENTE = capitoliBilancio.filter(c => c.n >= 6 && c.n <= 8);

const STANDARD_PER_CAP = {
  6: ["GRI 201-2", "GRI 305-1", "GRI 305-2", "GRI 305-3", "GRI 302-1", "ESRS E1-1", "ESRS E1-4", "ESRS E1-6"],
  7: ["GRI 302-1", "GRI 302-2", "GRI 302-3", "GRI 302-4", "ESRS E1-5"],
  8: ["GRI 303-3", "GRI 303-4", "GRI 306-3", "GRI 306-4", "ESRS E3-1", "ESRS E5-1"],
};

const CONTENUTI_INIZIALI = {
  6: `## Ambiente — Cambiamento climatico ed emissioni

Nel corso del 2024, **Acme Manufacturing S.p.A.** ha avviato un percorso strutturato di misurazione e gestione delle proprie emissioni di gas a effetto serra (GHG), in conformità al GHG Protocol Corporate Standard e ai requisiti dell'ESRS E1.

### Inventario emissioni GHG

L'inventario è stato condotto distinguendo le tre categorie di emissioni:

- **Scope 1** (emissioni dirette): **183,1 tCO₂e**, principalmente da combustione di gas naturale (90,9 tCO₂e), flotta aziendale diesel (75,0 tCO₂e) e gas refrigerante (17,2 tCO₂e).
- **Scope 2 Market-Based**: **0 tCO₂e** grazie all'approvvigionamento al 100% da energia rinnovabile certificata (Garanzie di Origine).
- **Scope 2 Location-Based**: **245,7 tCO₂e** applicando il mix di rete nazionale (fattore GSE 2023: 0,289 kgCO₂e/kWh).

### Obiettivi climatici

La Società ha avviato il percorso di adesione alla Science Based Targets initiative (SBTi) con target di riduzione allineati a 1,5°C. Il piano di transizione climatica sarà completato nel 2026.`,
  7: `## Ambiente — Energia e risorse

### Consumo energetico

Nel 2024 il consumo energetico totale è stato di **4.250 MWh**, di cui il 35,2% proveniente da fonti rinnovabili (1.496 MWh). Il 100% dell'energia elettrica è acquisita tramite Garanzie di Origine (GO) certificate da fornitori italiani.

**Obiettivo 2027**: aumentare la quota rinnovabile all'80% con installazione impianto fotovoltaico da 800 kWp (prevista produzione 760 MWh/anno).

### Efficienza energetica

Nel 2024 sono state implementate misure di efficienza (sostituzione illuminazione LED, ottimizzazione compressori) con una riduzione stimata del 3% dei consumi rispetto al 2023.`,
  8: `## Ambiente — Acqua, rifiuti e biodiversità

### Gestione idrica

Il consumo idrico totale 2024 è stato di **12.500 m³**, esclusivamente da rete pubblica. Non sono stati identificati siti produttivi in aree di stress idrico elevato (fonte: WRI Aqueduct).

### Gestione rifiuti

Nel 2024 sono stati prodotti **89,4 tonnellate** di rifiuti totali, di cui il 62,1% avviato a riciclo/recupero. La Società punta ad azzerare i conferimenti in discarica entro il 2028 attraverso un programma di economia circolare.

### Biodiversità

Non sono stati identificati impatti significativi su aree protette (Natura 2000, IBA) nelle adiacenze del sito produttivo. Nel 2025 sarà avviata una valutazione TNFD preliminare.`,
};

export default function Form06B() {
  const [capSel, setCapSel] = useState(6);
  const [contenuti, setContenuti] = useState(CONTENUTI_INIZIALI);
  const [stdChecked, setStdChecked] = useState({
    6: new Set(["GRI 305-1", "GRI 305-2", "ESRS E1-6"]),
    7: new Set(["GRI 302-1", "ESRS E1-5"]),
    8: new Set(["GRI 303-3", "GRI 306-3"]),
  });

  const toggleStd = (s) => setStdChecked(p => {
    const ns = new Set(p[capSel]);
    ns.has(s) ? ns.delete(s) : ns.add(s);
    return { ...p, [capSel]: ns };
  });

  const cap = CAPITOLI_AMBIENTE.find(c => c.n === capSel);
  const parole = (contenuti[capSel] || "").trim().split(/\s+/).length;

  return (
    <FormWrapper
      formCode="FORM-06B"
      title="Stesura Sezione Ambiente"
      subtitle="Editor capitoli 6-7-8: Clima, Energia, Acqua/Rifiuti/Biodiversità"
      meta={{ "Capitoli": "6, 7, 8", "Resp.": "Elena Mancini / Sara Greco", "Output": "Testi approvati per stampa" }}
      ruleBox="✍️ I testi devono riportare dati quantitativi validati in PROC-04. Ogni affermazione qualitativa deve essere supportata da evidenza documentale."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* TAB CAPITOLI */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {CAPITOLI_AMBIENTE.map(c => (
          <button key={c.n} onClick={() => setCapSel(c.n)} className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", capSel === c.n ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Cap. {c.n}
          </button>
        ))}
      </div>

      {cap && (
        <div className="flex gap-4 min-h-[480px] border border-border rounded-xl overflow-hidden">
          {/* EDITOR */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/20">
              <p className="text-sm font-semibold truncate">Cap. {cap.n} — {cap.titolo}</p>
              <span className="text-xs text-muted-foreground">{parole} parole / {cap.target} target</span>
            </div>
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-1 flex-wrap bg-muted/10">
              {["**G**", "_C_", "# H1", "## H2", "### H3", "- Lista", "1. Num."].map(b => (
                <button key={b} className="px-2 py-0.5 text-xs border border-border rounded hover:bg-muted transition-colors font-mono">{b}</button>
              ))}
            </div>
            <textarea
              value={contenuti[capSel] || ""}
              onChange={e => setContenuti(p => ({ ...p, [capSel]: e.target.value }))}
              className="flex-1 p-4 text-sm leading-relaxed resize-none focus:outline-none bg-background font-mono"
              placeholder="Inserire il testo del capitolo in formato Markdown..."
            />
          </div>

          {/* SIDEBAR STANDARD */}
          <div className="w-52 shrink-0 border-l border-border p-4 bg-muted/10 overflow-y-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Standard linkati</p>
            <div className="space-y-2">
              {(STANDARD_PER_CAP[capSel] || []).map(s => (
                <label key={s} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={stdChecked[capSel]?.has(s) || false} onChange={() => toggleStd(s)} className="accent-primary" />
                  <span className={cn("font-mono", s.startsWith("ESRS") ? "text-purple-700" : "text-blue-700")}>{s}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">KPI riferimento</p>
              <div className="text-xs text-muted-foreground space-y-1">
                {capSel === 6 && <>
                  <p>• E-01: Scope 1 → 183,1 tCO₂e</p>
                  <p>• E-02: Scope 2 MB → 0 tCO₂e</p>
                  <p>• E-03: Scope 2 LB → 245,7 tCO₂e</p>
                  <p>• E-04: Scope 3 → 621,1 tCO₂e</p>
                </>}
                {capSel === 7 && <>
                  <p>• E-05: Energia totale → 4.250 MWh</p>
                  <p>• E-06: Rinnovabile → 35,2%</p>
                </>}
                {capSel === 8 && <>
                  <p>• E-07: Consumo idrico → 12.500 m³</p>
                  <p>• E-08: Rifiuti → 89,4 ton</p>
                  <p>• E-09: Riciclo → 62,1%</p>
                </>}
              </div>
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}