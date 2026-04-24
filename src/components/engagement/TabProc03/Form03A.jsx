import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select, CellInput, CellSelect, STATO_ROW_CLASS, STATO_SELECT_CLASS } from "@/components/common/FormWrapper";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_03A";

const AREE_AUDIT = ["E — Ambiente", "S — Sociale", "G — Governance", "Trasversale"];
const METODI = ["Analisi documentale", "Intervista", "Osservazione diretta", "Questionario", "Workshop"];
const STATI = ["completata", "in_corso", "non_iniziata"];

const INITIAL_PIANO = [
  { id: 1, area: "E — Ambiente", attivita: "Raccolta e analisi documenti ambientali (ISO 14001, inventario GHG, report energia)", metodo: "Analisi documentale", resp_studio: "Ferri", resp_cliente: "Rossi", data_inizio: "2025-04-01", data_fine: "2025-04-03", stato: "completata", note: "Tutti i documenti ricevuti. Inventario GHG parziale su Scope 3." },
  { id: 2, area: "E — Ambiente", attivita: "Interviste responsabile HSE ed energy manager", metodo: "Intervista", resp_studio: "Mancini", resp_cliente: "Neri", data_inizio: "2025-04-04", data_fine: "2025-04-04", stato: "completata", note: "2 interviste di 60 min. Registrate con consenso." },
  { id: 3, area: "S — Sociale", attivita: "Analisi documenti HR: organizzazione, formazione, salute e sicurezza, D&I", metodo: "Analisi documentale", resp_studio: "Greco", resp_cliente: "Ferretti", data_inizio: "2025-04-05", data_fine: "2025-04-07", stato: "completata", note: "" },
  { id: 4, area: "S — Sociale", attivita: "Interviste HR Manager e RSPP", metodo: "Intervista", resp_studio: "Mancini", resp_cliente: "Ferretti", data_inizio: "2025-04-08", data_fine: "2025-04-08", stato: "completata", note: "RSPP molto collaborativo. Gap evidente su D&I." },
  { id: 5, area: "G — Governance", attivita: "Analisi statuto, composizione CdA, codice etico, sistemi di controllo interno", metodo: "Analisi documentale", resp_studio: "Mancini", resp_cliente: "Caputo", data_inizio: "2025-04-09", data_fine: "2025-04-10", stato: "completata", note: "Codice etico non aggiornato dal 2019." },
  { id: 6, area: "Trasversale", attivita: "Workshop sintesi gap con team interno e management Acme", metodo: "Workshop", resp_studio: "Mancini", resp_cliente: "Rossetti", data_inizio: "2025-04-11", data_fine: "2025-04-11", stato: "completata", note: "Partecipanti: CEO, Sustainability Mgr, HR, HSE. 3 ore." },
  { id: 7, area: "Trasversale", attivita: "Redazione report di diagnosi e presentazione gap", metodo: "Analisi documentale", resp_studio: "Mancini", resp_cliente: "", data_inizio: "2025-04-14", data_fine: "2025-04-16", stato: "completata", note: "" },
];

export default function Form03A() {
  const [piano, setPiano] = useState(INITIAL_PIANO);
  const [obiettivo, setObiettivo] = useState("Condurre un audit desk e field per identificare i gap di conformità rispetto agli standard GRI e ESRS sui temi materiali identificati nella fase PROC-02, quantificare i gap e definire le priorità di intervento per il Piano di Azione ESG.");
  const setRow = (i, k, v) => setPiano(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });
  const remove = (i) => setPiano(p => p.filter((_, idx) => idx !== i));
  const add = () => setPiano(p => [...p, { id: Date.now(), area: "", attivita: "", metodo: "Analisi documentale", resp_studio: "", resp_cliente: "", data_inizio: "", data_fine: "", stato: "non_iniziata", note: "" }]);

  const completate = piano.filter(p => p.stato === "completata").length;

  return (
    <FormWrapper
      formCode="FORM-03A"
      title="Piano di Audit Gap Analysis"
      subtitle="Pianificazione delle attività di audit documentale, interviste e workshop"
      meta={{ "Fase": "PROC-03.1", "Resp.": "Consulente Senior", "Output": "Piano audit approvato", "Standard": "GRI 2 / ESRS 1" }}
      ruleBox="📋 Definire per ogni area (E/S/G) le attività di audit, i responsabili e le date. Includere analisi documentale, interviste con referenti chiave e workshop di validazione."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Attività pianificate", value: piano.length, color: "text-foreground" },
          { label: "Completate", value: completate, color: "text-green-700" },
          { label: "Rimanenti", value: piano.length - completate, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Obiettivo audit" cols={1}>
        <Field label="Obiettivo generale della Gap Analysis">
          <Textarea value={obiettivo} onChange={setObiettivo} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Attività di audit" cols={1}>
        <div className="space-y-2">
          {piano.map((row, i) => (
            <div key={row.id} className={cn("rounded-lg border p-3 space-y-2.5", STATO_ROW_CLASS[row.stato] || STATO_ROW_CLASS.non_iniziata)}>
              <div className="flex items-center gap-2 flex-wrap">
                <CellSelect value={row.area} onChange={v => setRow(i, "area", v)} options={["", ...AREE_AUDIT]} className="w-40 font-medium" />
                <CellInput value={row.attivita} onChange={v => setRow(i, "attivita", v)} placeholder="Descrizione attività" className="flex-1 min-w-40" />
                <CellSelect value={row.metodo} onChange={v => setRow(i, "metodo", v)} options={METODI} />
                <CellSelect value={row.stato} onChange={v => setRow(i, "stato", v)} options={STATI} className={cn("font-semibold", STATO_SELECT_CLASS[row.stato])} />
                <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1"><Trash2 size={13} /></button>
              </div>
              <div className="flex gap-3 flex-wrap items-center">
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">Studio: <CellInput value={row.resp_studio} onChange={v => setRow(i, "resp_studio", v)} className="w-20" /></label>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">Cliente: <CellInput value={row.resp_cliente} onChange={v => setRow(i, "resp_cliente", v)} className="w-20" /></label>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">Dal: <CellInput type="date" value={row.data_inizio} onChange={v => setRow(i, "data_inizio", v)} /></label>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">Al: <CellInput type="date" value={row.data_fine} onChange={v => setRow(i, "data_fine", v)} /></label>
                <CellInput value={row.note} onChange={v => setRow(i, "note", v)} placeholder="Note..." className="flex-1 min-w-32" />
              </div>
            </div>
          ))}
          <button onClick={add} className="flex items-center gap-2 text-sm text-primary hover:underline mt-1">
            <Plus size={14} /> Aggiungi attività
          </button>
        </div>
      </FormSection>
    </FormWrapper>
  );
}