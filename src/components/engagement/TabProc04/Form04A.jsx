import FormWrapper, { FormSection, Field, Textarea, CellInput, CellSelect, STATO_ROW_CLASS, STATO_SELECT_CLASS } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AREE = ["GHG Scope 1", "GHG Scope 2", "GHG Scope 3", "KPI Ambiente", "KPI Sociale", "KPI Governance"];
const METODI = ["Contatori/fatture", "Sistema di monitoraggio", "Stime con fattori standard", "Survey fornitori", "Dati HR", "Report interno"];
const STATI = ["completata", "in_corso", "non_iniziata"];

export default function Form04A({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "04A");

  const piano = d?.piano ?? [];

  const setRow = (i, k, v) => { const n = [...piano]; n[i] = { ...n[i], [k]: v }; updateField("piano", n); };
  const remove = (i) => updateField("piano", piano.filter((_, idx) => idx !== i));
  const add = () => updateField("piano", [...piano, { id: Date.now(), area: "", attivita: "", metodo: "Contatori/fatture", resp_studio: "", resp_cliente: "", data_inizio: "", data_fine: "", stato: "non_iniziata", fonte: "", note: "" }]);

  const completate = piano.filter(p => p.stato === "completata").length;
  const inCorso = piano.filter(p => p.stato === "in_corso").length;

  return (
    <FormWrapper
      formCode="FORM-04A"
      title="Piano di Raccolta Dati GHG & KPI"
      subtitle="Pianificazione attività, fonti, responsabili e scadenze per la raccolta dati"
      meta={{ "Fase": "PROC-04.1", "Resp.": "Analista ESG", "Output": "Piano approvato + fonti censite", "Standard": "GHG Protocol / GRI 2" }}
      ruleBox="Definire fonti, metodi e responsabili per ogni dato richiesto. Il piano orienta la raccolta sistematica e garantisce tracciabilità per eventuale assurance."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
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
          <Textarea value={d?.nota} onChange={v => updateField("nota", v)} rows={3} />
        </Field>
      </FormSection>

      <FormSection title="Piano raccolta dati" cols={1}>
        <div className="space-y-2">
          {piano.map((row, i) => (
            <div key={row.id ?? i} className={cn("rounded-lg border p-3 space-y-2.5", STATO_ROW_CLASS[row.stato] || STATO_ROW_CLASS.non_iniziata)}>
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
