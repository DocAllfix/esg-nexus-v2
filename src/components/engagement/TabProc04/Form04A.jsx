import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select, CellInput, CellSelect, STATO_ROW_CLASS, STATO_SELECT_CLASS } from "@/components/common/FormWrapper";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_04A";

const AREE = ["GHG Scope 1", "GHG Scope 2", "GHG Scope 3", "KPI Ambiente", "KPI Sociale", "KPI Governance"];
const METODI = ["Contatori/fatture", "Sistema di monitoraggio", "Stime con fattori standard", "Survey fornitori", "Dati HR", "Report interno"];
const STATI = ["completata", "in_corso", "non_iniziata"];

const INITIAL_PIANO = [
  { id: 1, area: "GHG Scope 1", attivita: "Raccolta fatture gas naturale e consumi flotta aziendale", metodo: "Contatori/fatture", resp_studio: "Ferri", resp_cliente: "Neri", data_inizio: "2025-04-15", data_fine: "2025-04-20", stato: "completata", fonte: "Fornitore gas + fleet manager", note: "Dati 2024 completi. Gas e diesel verificati." },
  { id: 2, area: "GHG Scope 1", attivita: "Stima gas refrigeranti (F-gas) impianti climatizzazione", metodo: "Stime con fattori standard", resp_studio: "Ferri", resp_cliente: "Neri", data_inizio: "2025-04-18", data_fine: "2025-04-22", stato: "completata", fonte: "Registro F-gas + IPCC AR6", note: "Dati da registro F-gas aziendale." },
  { id: 3, area: "GHG Scope 2", attivita: "Raccolta fatture energia elettrica (MB e LB)", metodo: "Contatori/fatture", resp_studio: "Ferri", resp_cliente: "Neri", data_inizio: "2025-04-15", data_fine: "2025-04-18", stato: "completata", fonte: "Fornitore energia + certificati GO", note: "GO 100% — MB = 0. LB da GSE 2023." },
  { id: 4, area: "GHG Scope 3", attivita: "Survey fornitori top-30 per cat. 1 (acquisti)", metodo: "Survey fornitori", resp_studio: "Ferri", resp_cliente: "Neri", data_inizio: "2025-04-20", data_fine: "2025-05-05", stato: "in_corso", fonte: "Survey email + Ecoinvent 3.9", note: "18/30 fornitori rispondenti. In corso follow-up." },
  { id: 5, area: "GHG Scope 3", attivita: "Calcolo emissioni trasferte (cat. 6) e trasporti (cat. 4)", metodo: "Dati HR", resp_studio: "Greco", resp_cliente: "Ferretti", data_inizio: "2025-04-20", data_fine: "2025-04-25", stato: "completata", fonte: "Note spese + logistica", note: "" },
  { id: 6, area: "KPI Ambiente", attivita: "Raccolta KPI consumi energia, acqua e rifiuti", metodo: "Contatori/fatture", resp_studio: "Greco", resp_cliente: "Neri", data_inizio: "2025-04-22", data_fine: "2025-04-30", stato: "in_corso", fonte: "Sistema ERP cliente", note: "Dati idrici parziali — manca impianto Cinisello." },
  { id: 7, area: "KPI Sociale", attivita: "Raccolta KPI HR: headcount, genere, TRIR, formazione", metodo: "Dati HR", resp_studio: "Greco", resp_cliente: "Ferretti", data_inizio: "2025-04-22", data_fine: "2025-04-28", stato: "completata", fonte: "HR system SAP + dati RSPP", note: "" },
  { id: 8, area: "KPI Governance", attivita: "Raccolta KPI CdA: composizione, indipendenza, whistleblowing", metodo: "Report interno", resp_studio: "Mancini", resp_cliente: "Caputo", data_inizio: "2025-04-25", data_fine: "2025-04-28", stato: "in_corso", fonte: "Verbali CdA + statuto", note: "Alcune date nomina CdA da verificare." },
];

export default function Form04A() {
  const [piano, setPiano] = useState(INITIAL_PIANO);
  const [nota, setNota] = useState("La raccolta dati segue il GHG Protocol Corporate Standard e la metodologia GRI per i KPI E/S/G. Il perimetro è la legal entity Acme Manufacturing S.p.A. (sede di Brescia), anno di riferimento 2024 (gennaio-dicembre). Fattori di emissione da DEFRA 2023 e IPCC AR6.");

  const setRow = (i, k, v) => setPiano(p => { const n = [...p]; n[i] = { ...n[i], [k]: v }; return n; });
  const remove = (i) => setPiano(p => p.filter((_, idx) => idx !== i));
  const add = () => setPiano(p => [...p, { id: Date.now(), area: "", attivita: "", metodo: "Contatori/fatture", resp_studio: "", resp_cliente: "", data_inizio: "", data_fine: "", stato: "non_iniziata", fonte: "", note: "" }]);

  const completate = piano.filter(p => p.stato === "completata").length;
  const inCorso = piano.filter(p => p.stato === "in_corso").length;

  return (
    <FormWrapper
      formCode="FORM-04A"
      title="Piano di Raccolta Dati GHG & KPI"
      subtitle="Pianificazione attività, fonti, responsabili e scadenze per la raccolta dati"
      meta={{ "Fase": "PROC-04.1", "Resp.": "Luca Ferri", "Output": "Piano approvato + fonti censite", "Standard": "GHG Protocol / GRI 2" }}
      ruleBox="📊 Definire fonti, metodi e responsabili per ogni dato richiesto. Il piano orienta la raccolta sistematica e garantisce tracciabilità per eventuale assurance."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Attività totali", value: piano.length, color: "text-foreground" },
          { label: "Completate", value: completate, color: "text-green-700" },
          { label: "In corso", value: inCorso, color: "text-amber-600" },
          { label: "Non avviate", value: piano.length - completate - inCorso, color: "text-muted-foreground" },
        ].map(k => (
          <div key={k.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", k.color)}>{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Nota metodologica e perimetro" cols={1}>
        <Field label="Metodologia, boundary e anno di riferimento">
          <Textarea value={nota} onChange={setNota} rows={3} />
        </Field>
      </FormSection>

      <FormSection title="Piano raccolta dati" cols={1}>
        <div className="space-y-2">
          {piano.map((row, i) => (
            <div key={row.id} className={cn("rounded-lg border p-3 space-y-2.5", STATO_ROW_CLASS[row.stato] || STATO_ROW_CLASS.non_iniziata)}>
              <div className="flex items-center gap-2 flex-wrap">
                <CellSelect value={row.area} onChange={v => setRow(i, "area", v)} options={["", ...AREE]} className="w-36 font-medium" />
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
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">Fonte: <CellInput value={row.fonte} onChange={v => setRow(i, "fonte", v)} className="w-40" /></label>
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