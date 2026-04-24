import { useState } from "react";
import FormWrapper from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const capitoliBilancio = [];

const STORAGE_KEY = "esg_form_06C";
const CAPITOLI_SOCIALE = capitoliBilancio.filter(c => c.n >= 9 && c.n <= 12);

const STANDARD_PER_CAP = {
  9:  ["GRI 2-7", "GRI 2-8", "GRI 401-1", "GRI 405-1", "ESRS S1-1", "ESRS S1-6"],
  10: ["GRI 403-1", "GRI 403-5", "GRI 403-9", "GRI 403-10", "ESRS S1-14"],
  11: ["GRI 404-1", "GRI 404-2", "GRI 404-3", "ESRS S1-13"],
  12: ["GRI 2-6", "GRI 308-1", "GRI 414-1", "ESRS S2-1", "ESRS S2-4"],
};

const CONTENUTI_INIZIALI = {
  9: `## Sociale — Persone e organizzazione

Al 31 dicembre 2024, **Acme Manufacturing S.p.A.** conta **252 dipendenti FTE**, di cui 171 uomini (67,9%) e 81 donne (32,1%).

### Composizione della forza lavoro

| Categoria | Totale | Donne | % Donne |
|-----------|--------|-------|---------|
| Dirigenti | 12 | 3 | 25,0% |
| Quadri | 42 | 9 | 21,4% |
| Impiegati | 98 | 42 | 42,9% |
| Operai | 100 | 27 | 27,0% |
| **Totale** | **252** | **81** | **32,1%** |

### Turnover

Il tasso di turnover 2024 è stato dell'8,7%, in linea con il settore manifatturiero (media ISTAT: 9,2%).`,
  10: `## Sociale — Salute e sicurezza sul lavoro

La tutela della salute e sicurezza dei lavoratori rappresenta una priorità assoluta per Acme Manufacturing.

### Sistema di gestione H&S

Il sistema di gestione H&S è certificato ISO 45001:2018 dal 2022. Il RSPP è integrato nel Comitato ESG a partire dal 2025.

### Indicatori di performance

- **TRIR (Total Recordable Incident Rate) 2024**: 1,8 per milione di ore lavorate
- **LTI (Lost Time Injuries)**: 3 infortuni con assenza dal lavoro (0 gravi)
- **Malattie professionali**: 0 casi accertati nel 2024
- **Ore di formazione H&S**: 4.860 ore totali (19,3 ore/dipendente)

### Obiettivo 2026

Riduzione del TRIR a meno di 1,0 attraverso il programma "Zero Harm".`,
  11: `## Sociale — Sviluppo e formazione

### Investimento in formazione

Nel 2024 sono state erogate **6.174 ore di formazione**, con una media di **24,5 ore per dipendente**, superando il target annuale di 20 ore.

**Ripartizione per tipologia:**
- Formazione tecnico-professionale: 48%
- Formazione manageriale e leadership: 22%
- Formazione HSE: 18%
- Formazione ESG e sostenibilità: 8%
- Formazione linguistica e digitale: 4%

### Piano di sviluppo individuale (PDI)

Il 78% dei dipendenti ha un Piano di Sviluppo Individuale attivo, aggiornato nel colloquio annuale di performance review.`,
  12: `## Sociale — Filiera e fornitori

### Catena di fornitura

Acme Manufacturing si avvale di circa **180 fornitori attivi**, di cui 42 classificati come "critici" (fatturato > 100k€/anno o forniture strategiche).

### Policy di qualifica fornitori

Tutti i nuovi fornitori sono soggetti a questionario di qualifica che include criteri ESG. Dal 2025 è in corso l'estensione della valutazione ESG a tutti i fornitori critici esistenti.

### Obiettivo 2026

Completamento audit ESG (questionario + visita on-site) su tutti i 42 fornitori critici. Inserimento di clausole ESG contrattuali in tutti i nuovi contratti quadro.`,
};

export default function Form06C() {
  const [capSel, setCapSel] = useState(9);
  const [contenuti, setContenuti] = useState(CONTENUTI_INIZIALI);
  const [stdChecked, setStdChecked] = useState({
    9: new Set(["GRI 2-7", "GRI 405-1", "ESRS S1-1"]),
    10: new Set(["GRI 403-9", "ESRS S1-14"]),
    11: new Set(["GRI 404-1", "ESRS S1-13"]),
    12: new Set(["GRI 414-1", "ESRS S2-1"]),
  });

  const toggleStd = (s) => setStdChecked(p => {
    const ns = new Set(p[capSel]); ns.has(s) ? ns.delete(s) : ns.add(s); return { ...p, [capSel]: ns };
  });

  const cap = CAPITOLI_SOCIALE.find(c => c.n === capSel);
  const parole = (contenuti[capSel] || "").trim().split(/\s+/).length;

  return (
    <FormWrapper
      formCode="FORM-06C"
      title="Stesura Sezione Sociale"
      subtitle="Editor capitoli 9-12: Persone, H&S, Formazione, Filiera"
      meta={{ "Capitoli": "9, 10, 11, 12", "Resp.": "Elena Mancini / Luca Ferri", "Output": "Testi approvati" }}
      ruleBox="✍️ Tutti i dati sociali devono provenire dal dataset validato in PROC-04 (Form 04E). Riferire sempre l'anno di rendicontazione (FY2024)."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {CAPITOLI_SOCIALE.map(c => (
          <button key={c.n} onClick={() => setCapSel(c.n)} className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", capSel === c.n ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Cap. {c.n}
          </button>
        ))}
      </div>

      {cap && (
        <div className="flex gap-4 min-h-[480px] border border-border rounded-xl overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-muted/20">
              <p className="text-sm font-semibold truncate">Cap. {cap.n} — {cap.titolo}</p>
              <span className="text-xs text-muted-foreground">{parole} parole / {cap.target} target</span>
            </div>
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-1 flex-wrap bg-muted/10">
              {["**G**", "_C_", "# H1", "## H2", "### H3", "- Lista", "| Tab |"].map(b => (
                <button key={b} className="px-2 py-0.5 text-xs border border-border rounded hover:bg-muted transition-colors font-mono">{b}</button>
              ))}
            </div>
            <textarea
              value={contenuti[capSel] || ""}
              onChange={e => setContenuti(p => ({ ...p, [capSel]: e.target.value }))}
              className="flex-1 p-4 text-sm leading-relaxed resize-none focus:outline-none bg-background font-mono"
            />
          </div>
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
                {capSel === 9 && <><p>• S-01: FTE → 252</p><p>• S-04: % Donne → 32,4%</p><p>• S-07: Turnover → 8,7%</p></>}
                {capSel === 10 && <><p>• S-02: TRIR → 1,8</p></>}
                {capSel === 11 && <><p>• S-03: Ore formaz. → 24,5h</p></>}
                {capSel === 12 && <><p>• Fornitori critici → 42</p></>}
              </div>
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}