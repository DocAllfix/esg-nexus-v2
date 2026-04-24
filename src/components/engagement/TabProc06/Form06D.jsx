import { useState } from "react";
import FormWrapper from "@/components/common/FormWrapper";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const capitoliBilancio = [];

const STORAGE_KEY = "esg_form_06D";
const CAPITOLI_GOV = capitoliBilancio.filter(c => c.n === 3 || c.n === 13);

const STANDARD_PER_CAP = {
  3:  ["GRI 2-9", "GRI 2-10", "GRI 2-11", "GRI 2-12", "GRI 2-18", "ESRS G1-1", "ESRS GOV-1"],
  13: ["GRI 205-1", "GRI 205-2", "GRI 205-3", "GRI 419-1", "ESRS G1-3", "ESRS G1-4"],
};

const CONTENUTI_INIZIALI = {
  3: `## Governance della Sostenibilità

### Organo di amministrazione

Il Consiglio di Amministrazione di Acme Manufacturing S.p.A. è composto da **7 membri**, di cui 4 indipendenti (57,1%) e 3 esecutivi. La quota femminile è del 28,6% (2 amministratrici indipendenti).

### Comitato ESG

Nel maggio 2025 è stato istituito il **Comitato ESG** in seno al CdA, con il mandato di supervisionare la strategia ESG, monitorare i target e approvare il bilancio di sostenibilità. Il Comitato si riunisce trimestralmente.

### Remunerazione e ESG

A partire dall'esercizio 2025, il 20% della componente variabile della remunerazione del management (CEO, CFO, Sustainability Manager) è legata al raggiungimento di KPI ESG (riduzione emissioni, TRIR, parità di genere).

### Processo di approvazione bilancio sostenibilità

Il bilancio di sostenibilità è approvato dal CdA nella sua interezza prima della pubblicazione. La prima edizione (FY2024) è stata approvata con delibera del 15 maggio 2025.`,
  13: `## Governance — Etica e anti-corruzione

### Codice etico

Il Codice Etico di Acme Manufacturing, aggiornato nel 2025, definisce i principi e le regole di comportamento per tutti i dipendenti, amministratori, fornitori e partner. È disponibile sul sito web aziendale.

### Policy anti-corruzione

La Policy Anti-Corruzione, adottata nel 2025, vieta esplicitamente qualsiasi forma di corruzione attiva e passiva, omaggi impropri e conflitti di interesse. Nel 2024 non sono stati registrati episodi di corruzione.

### Whistleblowing

A giugno 2025 è stata attivata la piattaforma di whistleblowing conforme al D.Lgs. 24/2023. Nel 2024, ante-attivazione, non sono state ricevute segnalazioni tramite altri canali.

### Formazione sull'etica

Nel 2024, il **78,4% dei dipendenti** ha ricevuto formazione su temi di anti-corruzione e conformità, con un aumento del 15% rispetto al 2023.`,
};

export default function Form06D() {
  const [capSel, setCapSel] = useState(3);
  const [contenuti, setContenuti] = useState(CONTENUTI_INIZIALI);
  const [stdChecked, setStdChecked] = useState({
    3: new Set(["GRI 2-9", "ESRS G1-1", "ESRS GOV-1"]),
    13: new Set(["GRI 205-2", "GRI 205-3", "ESRS G1-3"]),
  });

  const toggleStd = (s) => setStdChecked(p => {
    const ns = new Set(p[capSel]); ns.has(s) ? ns.delete(s) : ns.add(s); return { ...p, [capSel]: ns };
  });

  const cap = CAPITOLI_GOV.find(c => c.n === capSel);
  const parole = (contenuti[capSel] || "").trim().split(/\s+/).length;

  return (
    <FormWrapper
      formCode="FORM-06D"
      title="Stesura Sezione Governance"
      subtitle="Editor capitoli 3 e 13: Governance ESG e Etica/Anti-corruzione"
      meta={{ "Capitoli": "3, 13", "Resp.": "Sara Greco", "Output": "Testi approvati dal CdA" }}
      ruleBox="🏛️ I testi di governance devono essere revisionati dal Legale prima dell'approvazione. Le dichiarazioni vincolanti (es. remunerazione) richiedono validazione del CdA."
      ruleBoxType="warning"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {CAPITOLI_GOV.map(c => (
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
                {capSel === 3 && <><p>• G-01: Membri CdA → 7</p><p>• G-02: % Donne CdA → 28,6%</p><p>• G-03: Indip. → 57,1%</p></>}
                {capSel === 13 && <><p>• G-04: Segnalazioni → 0</p><p>• G-05: Formati → 78,4%</p></>}
              </div>
            </div>
          </div>
        </div>
      )}
    </FormWrapper>
  );
}