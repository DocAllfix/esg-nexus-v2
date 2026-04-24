import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_05B";

const AREE = ["E", "S", "G"];
const AREA_COLORS = { E: "border-green-200 bg-green-50/30", S: "border-blue-200 bg-blue-50/30", G: "border-purple-200 bg-purple-50/30" };
const AREA_DOT = { E: "bg-green-500", S: "bg-blue-500", G: "bg-purple-500" };
const PRIORITA = ["Alta", "Media", "Bassa"];
const PRIORITA_COLORS = { Alta: "bg-red-100 text-red-800", Media: "bg-amber-100 text-amber-800", Bassa: "bg-gray-100 text-gray-600" };
const ORIZZONTI = ["Breve (0-1a)", "Medio (1-3a)", "Lungo (3-5a)"];

const INITIAL_OBJ = [
  { id: 1, area: "E", codice: "OBJ-E01", titolo: "Riduzione emissioni GHG Scope 1+2", descrizione: "Ridurre le emissioni Scope 1+2 del 30% rispetto alla baseline 2024 entro il 2027, con allineamento ai target SBTi.", irо_ref: "E1-1 / E1-2", kpi_ref: "E-01, E-02", orizzonte: "Medio (1-3a)", priorita: "Alta", resp: "Sustainability Manager", scadenza: "2027-12-31" },
  { id: 2, area: "E", codice: "OBJ-E02", titolo: "Energia rinnovabile 80%", descrizione: "Aumentare la quota di energia da fonti rinnovabili all'80% del consumo totale entro il 2027 (attuale 35%).", irо_ref: "E1-3", kpi_ref: "E-06", orizzonte: "Medio (1-3a)", priorita: "Alta", resp: "Energy Manager", scadenza: "2027-12-31" },
  { id: 3, area: "E", codice: "OBJ-E03", titolo: "Calcolo e riduzione Scope 3", descrizione: "Completare l'inventario Scope 3 per tutte le categorie rilevanti entro il 2025 e definire target di riduzione cat.1 entro il 2026.", irо_ref: "E1-1", kpi_ref: "E-04", orizzonte: "Breve (0-1a)", priorita: "Alta", resp: "Sustainability Manager", scadenza: "2025-12-31" },
  { id: 4, area: "S", codice: "OBJ-S01", titolo: "Zero infortuni gravi (TRIR < 1.0)", descrizione: "Ridurre il TRIR da 1.8 a meno di 1.0 entro il 2026, eliminando gli infortuni gravi (LTI) nel biennio 2025-2026.", irо_ref: "S1-1", kpi_ref: "S-02", orizzonte: "Breve (0-1a)", priorita: "Alta", resp: "RSPP", scadenza: "2026-12-31" },
  { id: 5, area: "S", codice: "OBJ-S02", titolo: "Parità di genere in management", descrizione: "Raggiungere il 40% di donne in posizioni manageriali entro il 2028 (attuale 22%).", irо_ref: "S1-3", kpi_ref: "S-05", orizzonte: "Lungo (3-5a)", priorita: "Media", resp: "HR Manager", scadenza: "2028-12-31" },
  { id: 6, area: "S", codice: "OBJ-S03", titolo: "Audit ESG fornitori critici", descrizione: "Effettuare audit ESG su tutti i fornitori critici (top-20 per fatturato) entro il 2026.", irо_ref: "S2-1", kpi_ref: "—", orizzonte: "Medio (1-3a)", priorita: "Alta", resp: "Procurement Manager", scadenza: "2026-12-31" },
  { id: 7, area: "G", codice: "OBJ-G01", titolo: "Attivazione whistleblowing entro Q2 2025", descrizione: "Attivare il canale di segnalazione conforme D.Lgs. 24/2023 entro giugno 2025 — priorità legale assoluta.", irо_ref: "G1-1", kpi_ref: "G-04", orizzonte: "Breve (0-1a)", priorita: "Alta", resp: "Legal / Compliance", scadenza: "2025-06-30" },
  { id: 8, area: "G", codice: "OBJ-G02", titolo: "Bilancio sostenibilità annuale GRI/ESRS", descrizione: "Pubblicare il primo bilancio di sostenibilità conforme GRI e ESRS entro novembre 2025 per il FY2024.", irо_ref: "G1-2", kpi_ref: "—", orizzonte: "Breve (0-1a)", priorita: "Alta", resp: "CEO / Sustainability Mgr", scadenza: "2025-11-30" },
];

export default function Form05B() {
  const [obiettivi, setObiettivi] = useState(INITIAL_OBJ);
  const setRow = (i, k, v) => setObiettivi(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });
  const remove = (id) => setObiettivi(p => p.filter(o => o.id !== id));
  const add = () => setObiettivi(p => [...p, { id: Date.now(), area: "E", codice: `OBJ-${Date.now()}`, titolo: "", descrizione: "", irо_ref: "", kpi_ref: "", orizzonte: "Breve (0-1a)", priorita: "Media", resp: "", scadenza: "" }]);

  return (
    <FormWrapper
      formCode="FORM-05B"
      title="Obiettivi SMART ESG"
      subtitle="Definizione obiettivi Specifici, Misurabili, Achievable, Rilevanti, Temporali"
      meta={{ "Fase": "PROC-05.2", "Resp.": "Consulente Senior", "Output": "Registro obiettivi SMART approvato" }}
      ruleBox="🎯 Ogni obiettivo deve essere SMART: collegato a un IRO materiale, a un KPI misurabile, con scadenza definita e responsabile chiaro."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-3 gap-3">
        {AREE.map(a => {
          const count = obiettivi.filter(o => o.area === a).length;
          return (
            <div key={a} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
              <p className={cn("text-2xl font-bold", a === "E" ? "text-green-700" : a === "S" ? "text-blue-700" : "text-purple-700")}>{count}</p>
              <p className="text-xs text-muted-foreground">Obiettivi Area {a}</p>
            </div>
          );
        })}
      </div>

      <FormSection title="Obiettivi SMART" cols={1}>
        <div className="space-y-3">
          {obiettivi.map((obj, i) => (
            <div key={obj.id} className={cn("rounded-xl border-2 p-4 space-y-3", AREA_COLORS[obj.area])}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <div className={cn("w-3 h-3 rounded-full shrink-0", AREA_DOT[obj.area])} />
                  <span className="font-mono text-xs text-muted-foreground font-bold">{obj.codice}</span>
                  <select value={obj.area} onChange={e => setRow(i, "area", e.target.value)} className="border border-border rounded px-1.5 py-0.5 text-xs bg-background font-bold">
                    {AREE.map(a => <option key={a}>{a}</option>)}
                  </select>
                  <select value={obj.priorita} onChange={e => setRow(i, "priorita", e.target.value)} className={cn("border-0 rounded px-1.5 py-0.5 text-xs font-medium", PRIORITA_COLORS[obj.priorita])}>
                    {PRIORITA.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <select value={obj.orizzonte} onChange={e => setRow(i, "orizzonte", e.target.value)} className="border border-border rounded px-1.5 py-0.5 text-xs bg-background">
                    {ORIZZONTI.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button onClick={() => remove(obj.id)} className="text-muted-foreground hover:text-red-500"><Trash2 size={13} /></button>
              </div>
              <input value={obj.titolo} onChange={e => setRow(i, "titolo", e.target.value)} placeholder="Titolo obiettivo" className="w-full font-semibold text-sm border border-border rounded px-2 py-1 bg-background" />
              <textarea value={obj.descrizione} onChange={e => setRow(i, "descrizione", e.target.value)} rows={2} placeholder="Descrizione SMART dell'obiettivo..." className="w-full border border-border rounded px-2 py-1 text-xs bg-background resize-none" />
              <div className="flex gap-3 text-xs flex-wrap">
                <label className="flex items-center gap-1 text-muted-foreground">IRO ref: <input value={obj.irо_ref} onChange={e => setRow(i, "irо_ref", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background w-28 font-mono" /></label>
                <label className="flex items-center gap-1 text-muted-foreground">KPI ref: <input value={obj.kpi_ref} onChange={e => setRow(i, "kpi_ref", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background w-24 font-mono" /></label>
                <label className="flex items-center gap-1 text-muted-foreground">Resp: <input value={obj.resp} onChange={e => setRow(i, "resp", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background w-36" /></label>
                <label className="flex items-center gap-1 text-muted-foreground">Scadenza: <input type="date" value={obj.scadenza} onChange={e => setRow(i, "scadenza", e.target.value)} className="border border-border rounded px-1.5 py-0.5 bg-background" /></label>
              </div>
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi obiettivo
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}