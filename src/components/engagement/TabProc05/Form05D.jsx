import { useState } from "react";
import FormWrapper, { FormSection, Field } from "@/components/common/FormWrapper";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_05D";

const AREE_COLORS = { E: "bg-green-100 text-green-800", S: "bg-blue-100 text-blue-800", G: "bg-purple-100 text-purple-800" };
const STATI = ["Non avviata", "In corso", "Completata", "Sospesa"];
const STATI_COLORS = { "Non avviata": "bg-gray-100 text-gray-600", "In corso": "bg-amber-100 text-amber-800", "Completata": "bg-green-100 text-green-800", "Sospesa": "bg-red-100 text-red-800" };
const ORIZZONTI = ["B", "M", "L"];
const ORI_LABELS = { B: "Breve", M: "Medio", L: "Lungo" };
const PRIORITA = ["Alta", "Media", "Bassa"];
const PRIO_COLORS = { Alta: "bg-red-100 text-red-800", Media: "bg-amber-100 text-amber-800", Bassa: "bg-gray-100 text-gray-600" };

const INITIAL_INI = [
  { id: "INI-001", titolo: "Installazione impianto fotovoltaico (800 kWp)", area: "E", orizzonte: "B", owner: "G. Verdi", priorita: "Alta", gap_ref: "GAP-E01", obj_ref: "OBJ-E02", progress: 45, stato: "In corso", budget_y1: 320000, budget_y2: 0, budget_y3: 0, tipo: "CapEx", descrizione: "Installazione impianto FV da 800 kWp sul tetto dello stabilimento principale. Prevista produzione 760 MWh/anno (50% fabbisogno). ROI atteso 7 anni.", kpi_impatto: "E-05, E-06", data_avvio: "2025-03-01", data_fine: "2025-09-30" },
  { id: "INI-002", titolo: "Programma sicurezza H&S — Zero Harm", area: "S", orizzonte: "B", owner: "L. Rossi", priorita: "Alta", gap_ref: "—", obj_ref: "OBJ-S01", progress: 80, stato: "In corso", budget_y1: 35000, budget_y2: 30000, budget_y3: 25000, tipo: "OpEx", descrizione: "Programma pluriennale di formazione H&S avanzata, revisione procedure rischio, acquisto DPI di nuova generazione e implementazione sistema near-miss reporting.", kpi_impatto: "S-02", data_avvio: "2025-01-15", data_fine: "2026-12-31" },
  { id: "INI-003", titolo: "Policy anti-corruzione e whistleblowing", area: "G", orizzonte: "B", owner: "M. Bianchi", priorita: "Alta", gap_ref: "GAP-G01", obj_ref: "OBJ-G01", progress: 60, stato: "In corso", budget_y1: 15000, budget_y2: 8000, budget_y3: 5000, tipo: "OpEx", descrizione: "Aggiornamento codice etico, redazione policy anti-corruzione, attivazione piattaforma whistleblowing conforme D.Lgs. 24/2023, formazione dipendenti (100% entro Q3 2025).", kpi_impatto: "G-04, G-05", data_avvio: "2025-02-01", data_fine: "2025-06-30" },
  { id: "INI-004", titolo: "Audit ESG catena di fornitura top-20", area: "S", orizzonte: "M", owner: "L. Rossi", priorita: "Alta", gap_ref: "GAP-S03", obj_ref: "OBJ-S03", progress: 10, stato: "In corso", budget_y1: 20000, budget_y2: 25000, budget_y3: 20000, tipo: "OpEx", descrizione: "Sviluppo questionario self-assessment ESG fornitori, audit on-site sui fornitori a rischio elevato, integrazione requisiti ESG nei contratti di fornitura.", kpi_impatto: "—", data_avvio: "2025-05-01", data_fine: "2026-06-30" },
  { id: "INI-005", titolo: "Target SBTi e piano transizione climatica", area: "E", orizzonte: "M", owner: "E. Mancini", priorita: "Alta", gap_ref: "GAP-E01", obj_ref: "OBJ-E01", progress: 0, stato: "Non avviata", budget_y1: 25000, budget_y2: 15000, budget_y3: 10000, tipo: "OpEx", descrizione: "Adesione al programma Science Based Targets initiative (SBTi), definizione target approvati 1.5°C, sviluppo piano di transizione Net Zero con milestone annuali.", kpi_impatto: "E-01, E-02, E-04", data_avvio: "2025-07-01", data_fine: "2026-12-31" },
  { id: "INI-006", titolo: "Policy D&I e piano parità di genere", area: "S", orizzonte: "M", owner: "HR Manager", priorita: "Media", gap_ref: "GAP-S01", obj_ref: "OBJ-S02", progress: 15, stato: "In corso", budget_y1: 12000, budget_y2: 15000, budget_y3: 18000, tipo: "OpEx", descrizione: "Redazione e approvazione Policy D&I, analisi gender pay gap, piano di azioni affirmative (mentoring, target assunzioni, revisione JD), formazione manager su bias inconsci.", kpi_impatto: "S-04, S-05, S-06", data_avvio: "2025-04-01", data_fine: "2027-12-31" },
  { id: "INI-007", titolo: "Comitato ESG in seno al CdA", area: "G", orizzonte: "B", owner: "CEO", priorita: "Media", gap_ref: "—", obj_ref: "OBJ-G02", progress: 30, stato: "In corso", budget_y1: 5000, budget_y2: 5000, budget_y3: 5000, tipo: "OpEx", descrizione: "Istituzione comitato ESG con almeno 2 membri indipendenti del CdA, definizione mandato e frequenza riunioni, integrazione KPI ESG nella remunerazione variabile del management.", kpi_impatto: "G-01, G-02, G-03", data_avvio: "2025-03-01", data_fine: "2025-09-30" },
  { id: "INI-008", titolo: "Piano biodiversità e economia circolare", area: "E", orizzonte: "L", owner: "E. Mancini", priorita: "Bassa", gap_ref: "GAP-E04", obj_ref: "—", progress: 0, stato: "Non avviata", budget_y1: 0, budget_y2: 30000, budget_y3: 50000, tipo: "CapEx", descrizione: "Screening impatto biodiversità sito produttivo (TNFD), sviluppo progetto economia circolare per la gestione scarti di produzione, target riciclabilità packaging.", kpi_impatto: "E-08, E-09", data_avvio: "2026-01-01", data_fine: "2027-12-31" },
];

export default function Form05D() {
  const [iniziative, setIniziative] = useState(INITIAL_INI);
  const [expanded, setExpanded] = useState({});
  const [filterArea, setFilterArea] = useState("TUTTI");
  const [filterStato, setFilterStato] = useState("TUTTI");

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));
  const setRow = (id, k, v) => setIniziative(p => p.map(ini => ini.id === id ? { ...ini, [k]: v } : ini));
  const remove = (id) => setIniziative(p => p.filter(ini => ini.id !== id));
  const add = () => setIniziative(p => [...p, { id: `INI-${Date.now()}`, titolo: "", area: "E", orizzonte: "B", owner: "", priorita: "Media", gap_ref: "", obj_ref: "", progress: 0, stato: "Non avviata", budget_y1: 0, budget_y2: 0, budget_y3: 0, tipo: "OpEx", descrizione: "", kpi_impatto: "", data_avvio: "", data_fine: "" }]);

  const filtered = iniziative.filter(ini =>
    (filterArea === "TUTTI" || ini.area === filterArea) &&
    (filterStato === "TUTTI" || ini.stato === filterStato)
  );

  const totBudget = iniziative.reduce((s, i) => s + i.budget_y1 + i.budget_y2 + i.budget_y3, 0);

  return (
    <FormWrapper
      formCode="FORM-05D"
      title="Catalogo Iniziative ESG"
      subtitle="Registro completo delle iniziative con budget, responsabili e avanzamento"
      meta={{ "Fase": "PROC-05.4", "Resp.": "Consulente Senior", "Output": "Piano azione approvato" }}
      ruleBox="📋 Ogni iniziativa deve essere collegata a un gap (FORM-03F) o a un obiettivo SMART (FORM-05B). Il budget alimenta il piano economico (FORM-05E)."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Iniziative totali", value: iniziative.length, color: "text-foreground" },
          { label: "In corso", value: iniziative.filter(i => i.stato === "In corso").length, color: "text-amber-600" },
          { label: "Budget totale 3Y", value: `€${(totBudget / 1000).toFixed(0)}k`, color: "text-primary" },
          { label: "% completate", value: `${Math.round(iniziative.reduce((s, i) => s + i.progress, 0) / iniziative.length)}%`, color: "text-green-700" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* FILTRI */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground self-center">Area:</span>
        {["TUTTI", "E", "S", "G"].map(a => (
          <button key={a} onClick={() => setFilterArea(a)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filterArea === a ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{a}</button>
        ))}
        <span className="text-xs text-muted-foreground self-center ml-2">Stato:</span>
        {["TUTTI", ...STATI].map(s => (
          <button key={s} onClick={() => setFilterStato(s)} className={cn("text-xs px-2 py-0.5 rounded border transition-colors", filterStato === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted")}>{s}</button>
        ))}
      </div>

      <FormSection title={`Iniziative (${filtered.length})`} cols={1}>
        <div className="space-y-2">
          {filtered.map(ini => (
            <div key={ini.id} className="rounded-lg border border-border overflow-hidden">
              {/* HEADER */}
              <div className="flex items-center gap-3 px-4 py-3 bg-card cursor-pointer hover:bg-muted/20" onClick={() => toggle(ini.id)}>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-bold", AREE_COLORS[ini.area])}>{ini.area}</span>
                <span className="font-mono text-xs text-muted-foreground font-bold">{ini.id}</span>
                <span className="flex-1 text-sm font-medium truncate">{ini.titolo || "Nuova iniziativa"}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", STATI_COLORS[ini.stato])}>{ini.stato}</span>
                <div className="flex items-center gap-1 w-20">
                  <div className="flex-1 h-1.5 bg-muted rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${ini.progress}%` }} /></div>
                  <span className="text-xs text-muted-foreground w-8">{ini.progress}%</span>
                </div>
                {expanded[ini.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
              {/* DETTAGLIO */}
              {expanded[ini.id] && (
                <div className="px-4 py-4 border-t border-border bg-muted/5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div><label className="text-xs text-muted-foreground">Titolo</label><input value={ini.titolo} onChange={e => setRow(ini.id, "titolo", e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-sm bg-background font-medium" /></div>
                    <div className="flex gap-2">
                      {[["area", ["E","S","G"]], ["orizzonte", ORIZZONTI], ["priorita", PRIORITA], ["stato", STATI], ["tipo", ["OpEx","CapEx"]]].map(([k, opts]) => (
                        <div key={k} className="flex-1"><label className="text-xs text-muted-foreground capitalize">{k}</label>
                          <select value={ini[k]} onChange={e => setRow(ini.id, k, e.target.value)} className="w-full mt-0.5 border border-border rounded px-1.5 py-1 text-xs bg-background">
                            {opts.map(o => <option key={o}>{o}</option>)}
                          </select></div>
                      ))}
                    </div>
                  </div>
                  <div><label className="text-xs text-muted-foreground">Descrizione</label><textarea value={ini.descrizione} onChange={e => setRow(ini.id, "descrizione", e.target.value)} rows={2} className="w-full mt-0.5 border border-border rounded px-2 py-1 text-xs bg-background resize-none" /></div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[["owner","Owner"],["gap_ref","Gap ref"],["obj_ref","Obj ref"],["kpi_impatto","KPI impatto"]].map(([k,l]) => (
                      <div key={k}><label className="text-muted-foreground">{l}</label><input value={ini[k]} onChange={e => setRow(ini.id, k, e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-0.5 bg-background" /></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {[["data_avvio","Avvio","date"],["data_fine","Fine","date"],["budget_y1","Budget Y1","number"],["budget_y2","Budget Y2","number"],["budget_y3","Budget Y3","number"]].map(([k,l,t]) => (
                      <div key={k}><label className="text-muted-foreground">{l}</label><input type={t} value={ini[k]} onChange={e => setRow(ini.id, k, t==="number" ? Number(e.target.value) : e.target.value)} className="w-full mt-0.5 border border-border rounded px-2 py-0.5 bg-background" /></div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-muted-foreground">Avanzamento:</label>
                    <input type="range" min={0} max={100} value={ini.progress} onChange={e => setRow(ini.id, "progress", Number(e.target.value))} className="flex-1 accent-primary" />
                    <span className="text-xs font-bold w-8">{ini.progress}%</span>
                    <button onClick={() => remove(ini.id)} className="text-muted-foreground hover:text-red-500 ml-2"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi iniziativa
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}