import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, Select } from "@/components/common/FormWrapper";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "esg_form_02E";

const CHECKLIST_ITEMS = [
  { id: 1, categoria: "Processo", voce: "Stakeholder mapping completato (FORM-02A) con almeno 5 gruppi identificati", req: "obbligatorio" },
  { id: 2, categoria: "Processo", voce: "Tasso di risposta questionari ≥ 50% per stakeholder ad Alta priorità", req: "obbligatorio" },
  { id: 3, categoria: "Analisi", voce: "Tutti i 15+ IRO valutati con score impatto e finanziario (FORM-02B)", req: "obbligatorio" },
  { id: 4, categoria: "Analisi", voce: "Soglie di materialità definite e documentate con motivazione", req: "obbligatorio" },
  { id: 5, categoria: "Analisi", voce: "Matrice di materialità prodotta e verificata (FORM-02C)", req: "obbligatorio" },
  { id: 6, categoria: "Governance", voce: "Matrice presentata al management per review", req: "obbligatorio" },
  { id: 7, categoria: "Governance", voce: "Matrice approvata formalmente dal CdA (verbale allegato)", req: "obbligatorio" },
  { id: 8, categoria: "Output", voce: "Perimetro bilancio definito — mapping IRO→capitoli (FORM-02D)", req: "obbligatorio" },
  { id: 9, categoria: "Output", voce: "Lista KPI previsti per tema materiale definita", req: "obbligatorio" },
  { id: 10, categoria: "Output", voce: "Nota metodologica sulla doppia materialità redatta", req: "obbligatorio" },
  { id: 11, categoria: "Qualità", voce: "Peer review interna del processo (secondo consulente)", req: "raccomandato" },
  { id: 12, categoria: "Qualità", voce: "Allineamento con ESRS 1 §AR 1-16 verificato", req: "raccomandato" },
];

const INITIAL_CHECKLIST = CHECKLIST_ITEMS.map(item => ({
  ...item,
  fatto: item.id <= 10,
  note: "",
}));

export default function Form02E() {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [data_approvazione_cda, setDataApprovazione] = useState("2025-03-28");
  const [approvato_da, setApprovatoDa] = useState("Marco Rossetti — CEO, con delibera CdA n. 03/2025");
  const [note_finali, setNoteFinali] = useState("Processo di materialità concluso nei tempi previsti. 11 temi materiali identificati su 15 valutati. La matrice è stata approvata con voto unanime dal CdA del 28/03/2025. Avvio PROC-03 programmato per il 01/04/2025.");

  const toggle = (i) => setChecklist(p => { const n = [...p]; n[i] = { ...n[i], fatto: !n[i].fatto }; return n; });
  const setNote = (i, v) => setChecklist(p => { const n = [...p]; n[i] = { ...n[i], note: v }; return n; });

  const obbligatorie = checklist.filter(c => c.req === "obbligatorio");
  const fatteObb = obbligatorie.filter(c => c.fatto).length;
  const tutteOk = fatteObb === obbligatorie.length;

  const REQ_COLORS = { obbligatorio: "bg-red-100 text-red-700", raccomandato: "bg-amber-100 text-amber-700" };

  return (
    <FormWrapper
      formCode="FORM-02E"
      title="Chiusura PROC-02 — Analisi di Materialità"
      subtitle="Checklist di completamento e transizione a PROC-03"
      meta={{ "Fase": "Finale PROC-02", "Resp.": "Partner + Consulente Senior", "Output": "Matrice approvata — Avvio PROC-03" }}
      ruleBox={tutteOk ? "✅ Tutte le attività obbligatorie completate. Transizione a PROC-03 autorizzata." : "⚠️ Completare tutte le voci obbligatorie prima di procedere a PROC-03."}
      ruleBoxType={tutteOk ? "success" : "warning"}
      storageKey={STORAGE_KEY}
      initialData={{}}
    >
      {/* PROGRESS */}
      <div className={cn("rounded-xl border-2 p-6 text-center", tutteOk ? "border-green-400 bg-green-50" : "border-amber-300 bg-amber-50")}>
        <p className={cn("text-4xl font-bold", tutteOk ? "text-green-700" : "text-amber-700")}>{fatteObb}/{obbligatorie.length}</p>
        <p className={cn("text-sm font-medium mt-1", tutteOk ? "text-green-700" : "text-amber-700")}>
          {tutteOk ? "✅ PROC-02 COMPLETATO — Avvio PROC-03 autorizzato" : "Completare le voci obbligatorie mancanti"}
        </p>
        <div className="w-full h-2 bg-white rounded-full mt-3">
          <div className={cn("h-full rounded-full transition-all", tutteOk ? "bg-green-500" : "bg-amber-400")} style={{ width: `${(fatteObb / obbligatorie.length) * 100}%` }} />
        </div>
      </div>

      <FormSection title="Checklist di chiusura PROC-02" cols={1}>
        {["Processo", "Analisi", "Governance", "Output", "Qualità"].map(cat => (
          <div key={cat} className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{cat}</p>
            {checklist.filter(c => c.categoria === cat).map((item, idx) => {
              const i = checklist.findIndex(c => c.id === item.id);
              return (
                <div key={item.id} className={cn("rounded-lg border p-3 space-y-2", item.fatto ? "border-green-300 bg-green-50/30" : "border-border hover:bg-muted/20")}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggle(i)} className="mt-0.5 shrink-0">
                      {item.fatto ? <CheckCircle2 size={16} className="text-green-600" /> : <Circle size={16} className="text-muted-foreground" />}
                    </button>
                    <span className="text-sm flex-1">{item.voce}</span>
                    <span className={cn("text-xs px-1.5 py-0.5 rounded shrink-0", REQ_COLORS[item.req])}>{item.req}</span>
                  </div>
                  {!item.fatto && (
                    <input value={item.note} onChange={e => setNote(i, e.target.value)} placeholder="Note / piano d'azione..." className="w-full ml-7 border border-border rounded px-2 py-1 text-xs bg-background" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </FormSection>

      <FormSection title="Approvazione CdA">
        <Field label="Data approvazione CdA" required>
          <Input type="date" value={data_approvazione_cda} onChange={setDataApprovazione} />
        </Field>
        <Field label="Approvato da">
          <Input value={approvato_da} onChange={setApprovatoDa} />
        </Field>
        <Field label="Note finali e transizione a PROC-03" span={2}>
          <Textarea value={note_finali} onChange={setNoteFinali} rows={3} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}