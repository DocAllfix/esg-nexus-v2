import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const CHECKLIST_TEMPLATE = [
  { id: 1, voce: "Vision ESG e pilastri strategici approvati dal CdA (FORM-05A)", req: "obbligatorio", ok: false },
  { id: 2, voce: "Obiettivi SMART definiti per ogni area E/S/G con KPI e scadenza (FORM-05B)", req: "obbligatorio", ok: false },
  { id: 3, voce: "Catalogo iniziative completo con owner, budget e gap di riferimento (FORM-05D)", req: "obbligatorio", ok: false },
  { id: 4, voce: "Budget 3 anni approvato dal CFO (FORM-05E)", req: "obbligatorio", ok: false },
  { id: 5, voce: "Roadmap presentata al CdA con milestone (FORM-05F)", req: "obbligatorio", ok: false },
  { id: 6, voce: "Piano approvato formalmente dal CdA con verbale", req: "obbligatorio", ok: false },
  { id: 7, voce: "KPI ESG integrati nel sistema di incentivazione management", req: "raccomandato", ok: false },
  { id: 8, voce: "Comunicazione piano ai dipendenti (internal comms)", req: "raccomandato", ok: false },
  { id: 9, voce: "Piano comunicato ai principali stakeholder esterni", req: "raccomandato", ok: false },
];

const REQ_COLORS = { obbligatorio: "bg-red-100 text-red-700", raccomandato: "bg-amber-100 text-amber-700" };

export default function Form05G({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "05G");

  const checks = d?.checks ?? CHECKLIST_TEMPLATE;
  const toggle = (id) => updateField("checks", checks.map(c => c.id === id ? { ...c, ok: !c.ok } : c));

  const obbligatorie = checks.filter(c => c.req === "obbligatorio");
  const fatteObb = obbligatorie.filter(c => c.ok).length;
  const tutteOk = fatteObb === obbligatorie.length;

  return (
    <FormWrapper
      formCode="FORM-05G"
      title="Workshop CdA e Chiusura PROC-05"
      subtitle="Presentazione e approvazione formale del Piano ESG — Transizione a PROC-06"
      meta={{ "Fase": "Finale PROC-05", "Resp.": "Partner", "Output": "Piano ESG approvato — Avvio PROC-06" }}
      ruleBox={tutteOk ? "Piano ESG approvato — Transizione a PROC-06 autorizzata." : "Completare le attività obbligatorie prima di passare a PROC-06 (Bilancio di Sostenibilità)."}
      ruleBoxType={tutteOk ? "success" : "warning"}
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <div className={cn("rounded-xl border-2 p-6 text-center", tutteOk ? "border-green-400 bg-green-50/30" : "border-amber-300 bg-amber-50/20")}>
        <p className={cn("text-4xl font-bold", tutteOk ? "text-green-700" : "text-amber-700")}>{fatteObb}/{obbligatorie.length}</p>
        <p className={cn("text-sm font-medium mt-1", tutteOk ? "text-green-700" : "text-amber-700")}>
          {tutteOk ? "PROC-05 COMPLETATO — Avvio PROC-06 autorizzato" : "Attività obbligatorie completate"}
        </p>
        <div className="w-full h-2 bg-white/60 rounded-full mt-3">
          <div className={cn("h-full rounded-full transition-all", tutteOk ? "bg-green-500" : "bg-amber-400")} style={{ width: `${(fatteObb / obbligatorie.length) * 100}%` }} />
        </div>
      </div>

      <FormSection title="Checklist di chiusura PROC-05" cols={1}>
        <div className="space-y-2">
          {checks.map(c => (
            <div key={c.id} onClick={() => toggle(c.id)} className={cn("rounded-lg border p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/10",
              c.ok ? "border-green-200 bg-green-50/20" : "border-border"
            )}>
              {c.ok ? <CheckCircle2 size={16} className="text-green-600 shrink-0" /> : <Circle size={16} className="text-muted-foreground shrink-0" />}
              <span className="text-sm flex-1">{c.voce}</span>
              <span className={cn("text-xs px-1.5 py-0.5 rounded shrink-0", REQ_COLORS[c.req])}>{c.req}</span>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Approvazione formale CdA" cols={2}>
        <Field label="Data approvazione">
          <Input type="date" value={d?.data_approvazione} onChange={v => updateField("data_approvazione", v)} />
        </Field>
        <Field label="Riferimento verbale CdA">
          <Textarea value={d?.verbale} onChange={v => updateField("verbale", v)} rows={2} placeholder="Es. Delibera CdA n. 07/2025 del 15 maggio 2025..." />
        </Field>
        <Field label="Note al piano approvato" span={2}>
          <Textarea value={d?.note} onChange={v => updateField("note", v)} rows={2} />
        </Field>
        <Field label="Prossimi passi — Avvio PROC-06" span={2}>
          <Textarea value={d?.prossimo_step} onChange={v => updateField("prossimo_step", v)} rows={2} placeholder="Avvio PROC-06 — Redazione Bilancio di Sostenibilità..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
