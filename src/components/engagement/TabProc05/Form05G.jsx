import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_05G";

const CHECKLIST = [
  { id: 1, voce: "Vision ESG e pilastri strategici approvati dal CdA (FORM-05A)", req: "obbligatorio", ok: true },
  { id: 2, voce: "Obiettivi SMART definiti per ogni area E/S/G con KPI e scadenza (FORM-05B)", req: "obbligatorio", ok: true },
  { id: 3, voce: "Catalogo iniziative completo con owner, budget e gap di riferimento (FORM-05D)", req: "obbligatorio", ok: true },
  { id: 4, voce: "Budget 3 anni approvato dal CFO (FORM-05E)", req: "obbligatorio", ok: true },
  { id: 5, voce: "Roadmap presentata al CdA con milestone (FORM-05F)", req: "obbligatorio", ok: true },
  { id: 6, voce: "Piano approvato formalmente dal CdA con verbale", req: "obbligatorio", ok: false },
  { id: 7, voce: "KPI ESG integrati nel sistema di incentivazione management", req: "raccomandato", ok: false },
  { id: 8, voce: "Comunicazione piano ai dipendenti (internal comms)", req: "raccomandato", ok: true },
  { id: 9, voce: "Piano comunicato ai principali stakeholder esterni", req: "raccomandato", ok: false },
];

export default function Form05G() {
  const [checks, setChecks] = useState(CHECKLIST);
  const [verbale, setVerbale] = useState("Delibera CdA n. 07/2025 del 15 maggio 2025. Presenti: Marco Rossetti (CEO), Giovanni Caputo (CFO), tutti i membri indipendenti. Approvazione unanime Piano ESG 2025-2028 con budget complessivo € 680.000.");
  const [data_approvazione, setDataApprovazione] = useState("2025-05-15");
  const [note, setNote] = useState("Il Piano di Azione ESG sarà pubblicato in sintesi nel bilancio di sostenibilità FY2024. La versione completa è riservata all'uso interno. Il piano sarà rivisto annualmente con aggiornamento delle milestone.");
  const [prossimo_step, setProssimoStep] = useState("Avvio PROC-06 — Redazione Bilancio di Sostenibilità. Prima riunione del Comitato Editoriale fissata per il 20 maggio 2025.");

  const toggle = (id) => setChecks(p => p.map(c => c.id === id ? { ...c, ok: !c.ok } : c));

  const obbligatorie = checks.filter(c => c.req === "obbligatorio");
  const fatteObb = obbligatorie.filter(c => c.ok).length;
  const tutteOk = fatteObb === obbligatorie.length;
  const REQ_COLORS = { obbligatorio: "bg-red-100 text-red-700", raccomandato: "bg-amber-100 text-amber-700" };

  return (
    <FormWrapper
      formCode="FORM-05G"
      title="Workshop CdA e Chiusura PROC-05"
      subtitle="Presentazione e approvazione formale del Piano ESG — Transizione a PROC-06"
      meta={{ "Fase": "Finale PROC-05", "Resp.": "Partner", "Output": "Piano ESG approvato — Avvio PROC-06" }}
      ruleBox={tutteOk ? "✅ Piano ESG approvato — Transizione a PROC-06 autorizzata." : "⚠️ Completare le attività obbligatorie prima di passare a PROC-06 (Bilancio di Sostenibilità)."}
      ruleBoxType={tutteOk ? "success" : "warning"}
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      <div className={cn("rounded-xl border-2 p-6 text-center", tutteOk ? "border-green-400 bg-green-50" : "border-amber-300 bg-amber-50")}>
        <p className={cn("text-4xl font-bold", tutteOk ? "text-green-700" : "text-amber-700")}>{fatteObb}/{obbligatorie.length}</p>
        <p className={cn("text-sm font-medium mt-1", tutteOk ? "text-green-700" : "text-amber-700")}>
          {tutteOk ? "✅ PROC-05 COMPLETATO — Avvio PROC-06 autorizzato" : "Attività obbligatorie completate"}
        </p>
        <div className="w-full h-2 bg-white rounded-full mt-3">
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

      <FormSection title="Approvazione formale CdA">
        <Field label="Data approvazione" required>
          <Input type="date" value={data_approvazione} onChange={setDataApprovazione} />
        </Field>
        <Field label="Riferimento verbale CdA">
          <Textarea value={verbale} onChange={setVerbale} rows={2} />
        </Field>
        <Field label="Note al piano approvato" span={2}>
          <Textarea value={note} onChange={setNote} rows={2} />
        </Field>
        <Field label="Prossimi passi — Avvio PROC-06" span={2}>
          <Textarea value={prossimo_step} onChange={setProssimoStep} rows={2} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}