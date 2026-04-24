import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_form_01G";
const INITIAL = acmeFormData["01G"] ?? {};

export default function Form01G() {
  const [d, setD] = useState(INITIAL);
  const [checklist, setChecklist] = useState(INITIAL.checklist || []);
  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const toggle = (i) => setChecklist(p => { const n = [...p]; n[i] = { ...n[i], fatto: !n[i].fatto }; return n; });

  const fatte = checklist.filter(c => c.fatto).length;
  const tutteOk = fatte === checklist.length;

  return (
    <FormWrapper
      formCode="FORM-01G"
      title="Chiusura PROC-01 — Avvio Rapporto"
      subtitle="Checklist di completamento e transizione a PROC-02"
      meta={{ "Fase": "Finale PROC-01", "Resp.": "Partner + Project Manager", "Output": "Avvio PROC-02 autorizzato" }}
      ruleBox="✅ Prima di passare a PROC-02, tutte le voci della checklist devono essere spuntate. In caso contrario, bloccare la transizione e completare le attività mancanti."
      ruleBoxType={tutteOk ? "success" : "warning"}
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >
      {/* PROGRESS */}
      <div className={cn("rounded-xl border-2 p-6 text-center", tutteOk ? "border-green-400 bg-green-50" : "border-amber-300 bg-amber-50")}>
        <p className={cn("text-4xl font-bold", tutteOk ? "text-green-700" : "text-amber-700")}>{fatte}/{checklist.length}</p>
        <p className={cn("text-sm font-medium mt-1", tutteOk ? "text-green-700" : "text-amber-700")}>
          {tutteOk ? "✅ PROC-01 COMPLETATO — Transizione a PROC-02 autorizzata" : "⏸ Completare le voci mancanti prima di procedere"}
        </p>
        <div className="w-full h-2 bg-white rounded-full mt-3">
          <div className={cn("h-full rounded-full transition-all", tutteOk ? "bg-green-500" : "bg-amber-400")} style={{ width: `${(fatte / checklist.length) * 100}%` }} />
        </div>
      </div>

      <FormSection title="Checklist di chiusura PROC-01" cols={1}>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                item.fatto ? "border-green-300 bg-green-50 hover:bg-green-100" : "border-border hover:bg-muted/30"
              )}
            >
              {item.fatto
                ? <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                : <Circle size={18} className="text-muted-foreground shrink-0" />
              }
              <span className={cn("text-sm", item.fatto ? "text-green-800 font-medium" : "text-foreground")}>{item.voce}</span>
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection title="Chiusura formale">
        <Field label="Data chiusura PROC-01" required>
          <Input type="date" value={d.data_chiusura_proc01} onChange={v => set("data_chiusura_proc01", v)} />
        </Field>
        <Field label="Approvato da">
          <Input value={d.approvato_da} onChange={v => set("approvato_da", v)} />
        </Field>
        <Field label="Note di transizione a PROC-02" span={2}>
          <Textarea value={d.note_transizione} onChange={v => set("note_transizione", v)} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}