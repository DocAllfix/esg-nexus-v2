import { useState } from "react";
import FormWrapper, { FormSection, Field, Textarea, Select } from "@/components/common/FormWrapper";
import { AlertCircle, AlertTriangle, AlertOctagon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_03F";

const PRIORITA = ["CRITICA", "ALTA", "MEDIA", "BASSA"];
const AREE = ["E", "S", "G"];
const PAL_COLORS = {
  CRITICA: "border-red-300 bg-red-50/30",
  ALTA: "border-orange-300 bg-orange-50/20",
  MEDIA: "border-yellow-300 bg-yellow-50/10",
  BASSA: "border-border",
};
const BADGE_COLORS = {
  CRITICA: "bg-red-100 text-red-800 border-red-200",
  ALTA: "bg-orange-100 text-orange-800 border-orange-200",
  MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BASSA: "bg-gray-100 text-gray-600 border-gray-200",
};

const INITIAL_GAPS = [
  { id: 1, area: "E", codice: "GAP-E01", titolo: "Piano di transizione climatica assente", descrizione: "L'azienda non dispone di un piano di transizione Net Zero approvato dal CdA, come richiesto da ESRS E1-1. Non sono stati fissati target di riduzione GHG a breve e lungo termine.", ref: "ESRS E1-1 / GRI 305-5", priorita: "CRITICA", effort: "Alto", action: "Sviluppare un piano di transizione climatica con target SBTi entro Q4 2025" },
  { id: 2, area: "E", codice: "GAP-E02", titolo: "Scope 3 non misurato (cat. 1, 11, 12)", descrizione: "Le emissioni Scope 3 sono solo parzialmente stimate. Mancano le categorie 1 (acquisti), 11 (uso prodotti), 12 (fine vita). È richiesta una metodologia documentata (GHG Protocol).", ref: "GRI 305-3 / ESRS E1-6", priorita: "ALTA", effort: "Alto", action: "Commissionare survey fornitori e calcolo Scope 3 completo per FY2025" },
  { id: 3, area: "E", codice: "GAP-E03", titolo: "Monitoraggio intensità energetica assente", descrizione: "L'energia è tracciata in valore assoluto ma non normalizzata per unità prodotta. ESRS E1-5 richiede KPI di intensità.", ref: "GRI 302-3 / ESRS E1-5", priorita: "MEDIA", effort: "Basso", action: "Definire KPI intensità energetica (MWh/unità prodotta) entro Q2 2025" },
  { id: 4, area: "E", codice: "GAP-E04", titolo: "Analisi impatto biodiversità non condotta", descrizione: "Non è stata effettuata alcuna analisi di impatto sulla biodiversità del sito produttivo di Brescia. Richiesta da ESRS E4.", ref: "GRI 304-1 / ESRS E4", priorita: "MEDIA", effort: "Medio", action: "Screening biodiversità sito produttivo con strumento TNFD entro Q3 2025" },
  { id: 5, area: "S", codice: "GAP-S01", titolo: "Policy D&I non formalizzata", descrizione: "Non esiste una politica D&I scritta e approvata. Mancano obiettivi di parità di genere e un piano di azioni affirmative.", ref: "ESRS S1-1", priorita: "CRITICA", effort: "Medio", action: "Redazione e approvazione CdA Policy D&I con target 2025-2027 entro Q2 2025" },
  { id: 6, area: "S", codice: "GAP-S02", titolo: "Gender pay gap non calcolato", descrizione: "Il gap retributivo di genere non è monitorato con metodologia documentata. È un KPI obbligatorio ESRS S1-16 per le aziende CSRD.", ref: "GRI 405-2 / ESRS S1-16", priorita: "ALTA", effort: "Basso", action: "Calcolo gender pay gap per categoria Q1/Q2 2025 e pubblicazione" },
  { id: 7, area: "S", codice: "GAP-S03", titolo: "Supply chain ESG non strutturata", descrizione: "Assenza di: policy fornitori con requisiti ESG, questionari di auto-valutazione, audit on-site. Gap significativo per ESRS S2.", ref: "GRI 414-1/2 / ESRS S2", priorita: "ALTA", effort: "Alto", action: "Sviluppare Supply Chain Policy e questionario ESG fornitori top-30 entro Q3 2025" },
  { id: 8, area: "S", codice: "GAP-S04", titolo: "Welfare e benessere organizzativo non rilevato", descrizione: "Non viene condotta alcuna indagine sul benessere dei dipendenti. Indicatore emergente richiesto da ESRS S1.", ref: "ESRS S1-14", priorita: "BASSA", effort: "Basso", action: "Predisporre engagement survey annuale entro Q3 2025" },
  { id: 9, area: "G", codice: "GAP-G01", titolo: "Canale whistleblowing non attivato", descrizione: "L'azienda non ha attivato il canale di segnalazione interna richiesto dal D.Lgs. 24/2023 (recepimento direttiva UE 2019/1937). Rischio sanzionatorio.", ref: "GRI 2-26 / ESRS G1-3 / D.Lgs. 24/2023", priorita: "CRITICA", effort: "Basso", action: "Attivazione piattaforma whistleblowing conforme entro Q2 2025 — priorità assoluta" },
  { id: 10, area: "G", codice: "GAP-G02", titolo: "Codice etico obsoleto — manca anti-corruzione", descrizione: "Il codice etico è del 2019 e non contiene clausole esplicite di anti-corruzione (GRI 205). Non allineato con requisiti ESRS G1-3.", ref: "GRI 205-1 / ESRS G1-3", priorita: "ALTA", effort: "Basso", action: "Aggiornamento codice etico con sezione anti-corruzione entro Q2 2025" },
  { id: 11, area: "G", codice: "GAP-G03", titolo: "Nessun bilancio di sostenibilità pubblicato", descrizione: "Prima rendicontazione. Nessun processo strutturato di raccolta dati ESG. Assenza totale di assurance esterna.", ref: "GRI 2-3 / ESRS 1", priorita: "ALTA", effort: "Alto", action: "Obiettivo principale del presente engagement — avvio rendicontazione GRI + ESRS" },
];

export default function Form03F() {
  const [gaps, setGaps] = useState(INITIAL_GAPS);
  const [filtroArea, setFiltroArea] = useState("TUTTI");
  const [filtroPriorita, setFiltroPriorita] = useState("TUTTI");
  const setRow = (i, k, v) => setGaps(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });
  const remove = (id) => setGaps(p => p.filter(g => g.id !== id));
  const add = () => setGaps(p => [...p, { id: Date.now(), area: "E", codice: `GAP-${Date.now()}`, titolo: "", descrizione: "", ref: "", priorita: "MEDIA", effort: "Medio", action: "" }]);

  const filtered = gaps.filter(g =>
    (filtroArea === "TUTTI" || g.area === filtroArea) &&
    (filtroPriorita === "TUTTI" || g.priorita === filtroPriorita)
  );

  const stats = PRIORITA.map(p => ({ p, count: gaps.filter(g => g.priorita === p).length }));

  return (
    <FormWrapper
      formCode="FORM-03F"
      title="Sintesi Gap — Registro Completo"
      subtitle="Riepilogo di tutti i gap identificati per area, priorità e piano d'azione"
      meta={{ "Fase": "PROC-03.6", "Resp.": "Elena Mancini", "Output": "Gap Register ufficiale" }}
      ruleBox="🔍 Il Gap Register alimenta direttamente il Piano di Azione ESG (PROC-05). Prioritizzare i gap CRITICI e ALTI per intervento immediato."
      ruleBoxType="warning"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.p} className={cn("rounded-lg p-3 text-center border", BADGE_COLORS[s.p])}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.p}</p>
          </div>
        ))}
      </div>

      {/* FILTRI */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground self-center">Area:</span>
        {["TUTTI", "E", "S", "G"].map(a => (
          <button key={a} onClick={() => setFiltroArea(a)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filtroArea === a ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{a}</button>
        ))}
        <span className="text-xs text-muted-foreground self-center ml-2">Priorità:</span>
        {["TUTTI", ...PRIORITA].map(p => (
          <button key={p} onClick={() => setFiltroPriorita(p)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filtroPriorita === p ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{p}</button>
        ))}
      </div>

      <FormSection title={`Gap rilevati (${filtered.length})`} cols={1}>
        <div className="space-y-3">
          {filtered.map(gap => {
            const i = gaps.findIndex(g => g.id === gap.id);
            return (
              <div key={gap.id} className={cn("rounded-lg border p-4 space-y-2", PAL_COLORS[gap.priorita])}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    <span className="font-mono text-xs font-bold text-muted-foreground">{gap.codice}</span>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", BADGE_COLORS[gap.priorita])}>{gap.priorita}</span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded font-bold">Area {gap.area}</span>
                    <input value={gap.titolo} onChange={e => setRow(i, "titolo", e.target.value)} className="flex-1 font-semibold text-sm bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 min-w-48" />
                  </div>
                  <button onClick={() => remove(gap.id)} className="text-muted-foreground hover:text-red-500 shrink-0"><Trash2 size={13} /></button>
                </div>
                <textarea value={gap.descrizione} onChange={e => setRow(i, "descrizione", e.target.value)} rows={2} className="w-full border border-border rounded px-2 py-1 text-xs bg-background resize-none" placeholder="Descrizione del gap..." />
                <div className="flex gap-3 text-xs flex-wrap">
                  <label className="flex items-center gap-1 text-muted-foreground">Ref: <input value={gap.ref} onChange={e => setRow(i, "ref", e.target.value)} className="border border-border rounded px-1 py-0.5 bg-background font-mono w-48" /></label>
                  <label className="flex items-center gap-1 text-muted-foreground">Effort: <input value={gap.effort} onChange={e => setRow(i, "effort", e.target.value)} className="border border-border rounded px-1 py-0.5 bg-background w-20" /></label>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Piano d'azione: </label>
                  <input value={gap.action} onChange={e => setRow(i, "action", e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background" placeholder="Azione raccomandata..." />
                </div>
              </div>
            );
          })}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi gap
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}