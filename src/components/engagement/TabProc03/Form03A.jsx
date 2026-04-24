import FormWrapper, { FormSection, Field, Textarea, CellInput, CellSelect, STATO_ROW_CLASS, STATO_SELECT_CLASS } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AREE_AUDIT = ["E — Ambiente", "S — Sociale", "G — Governance", "Trasversale"];
const METODI = ["Analisi documentale", "Intervista", "Osservazione diretta", "Questionario", "Workshop"];
const STATI = ["completata", "in_corso", "non_iniziata"];

export default function Form03A({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "03A");

  const piano = d?.piano ?? [];

  const setRow = (i, k, v) => {
    const n = [...piano]; n[i] = { ...n[i], [k]: v }; updateField("piano", n);
  };
  const remove = (i) => updateField("piano", piano.filter((_, idx) => idx !== i));
  const add = () => updateField("piano", [...piano, { id: Date.now(), area: "", attivita: "", metodo: "Analisi documentale", resp_studio: "", resp_cliente: "", data_inizio: "", data_fine: "", stato: "non_iniziata", note: "" }]);

  const completate = piano.filter(p => p.stato === "completata").length;

  return (
    <FormWrapper
      formCode="FORM-03A"
      title="Piano di Audit Gap Analysis"
      subtitle="Pianificazione delle attività di audit documentale, interviste e workshop"
      meta={{ "Fase": "PROC-03.1", "Resp.": "Consulente Senior", "Output": "Piano audit approvato", "Standard": "GRI 2 / ESRS 1" }}
      ruleBox="Definire per ogni area (E/S/G) le attività di audit, i responsabili e le date. Includere analisi documentale, interviste con referenti chiave e workshop di validazione."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
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
          <Textarea value={d?.obiettivo} onChange={v => updateField("obiettivo", v)} rows={2} />
        </Field>
      </FormSection>

      <FormSection title="Attività di audit" cols={1}>
        <div className="space-y-2">
          {piano.map((row, i) => (
            <div key={row.id ?? i} className={cn("rounded-lg border p-3 space-y-2.5", STATO_ROW_CLASS[row.stato] || STATO_ROW_CLASS.non_iniziata)}>
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
