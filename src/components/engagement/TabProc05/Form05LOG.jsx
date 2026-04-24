import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { CheckCircle2, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCUMENTI = [
  { code: "05A", label: "Dichiarazione di Visione e Impegno Strategico" },
  { code: "05B", label: "Obiettivi SMART — approvati" },
  { code: "05C", label: "Target quantitativi e allineamento SBTi" },
  { code: "05D", label: "Catalogo Iniziative ESG con schede" },
  { code: "05E", label: "Budget triennale ESG" },
  { code: "05F", label: "Roadmap visuale 3 anni" },
  { code: "05G", label: "Verbale Workshop CdA di approvazione" },
];

const DEFAULT_DOC_CHECK = Object.fromEntries(DOCUMENTI.map(d => [d.code, { ok: false, data: "" }]));

export default function Form05LOG({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "05LOG");

  const docCheck = d?.doc_check ?? DEFAULT_DOC_CHECK;
  const toggleDoc = (code) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], ok: !docCheck[code]?.ok } });
  const setDocData = (code, v) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], data: v } });

  const docsOk = Object.values(docCheck).filter(dc => dc.ok).length;

  return (
    <FormWrapper
      formCode="LOG-05"
      title="Chiusura Fase 5 e Avvio PROC-06"
      subtitle="Checklist documenti · KPI Piano Azione · Approvazione CdA · Passaggio a PROC-06"
      meta={{
        Fase: "Fase 5.8 — LOG",
        Input: "FORM-05A→05G completati · Verbale workshop CdA",
        Responsabile: "CS ESG + PM",
        Timing: "Post-approvazione CdA · entro 1 settimana",
        Output: "Piano ESG approvato · Autorizzazione avvio PROC-06 (Bilancio)",
      }}
      ruleBox="Prerequisito per PROC-06: il Piano di Azione ESG deve essere formalmente approvato dal CdA o dall'organo di governance equivalente prima di procedere alla redazione del Bilancio di Sostenibilità."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <FormSection title="Identificazione" cols={2}>
        <Field label="Codice progetto"><Input value={d?.codice_progetto} onChange={v => updateField("codice_progetto", v)} /></Field>
        <Field label="Cliente"><Input value={d?.cliente} onChange={v => updateField("cliente", v)} /></Field>
      </FormSection>

      <FormSection title="Checklist documenti Fase 5" cols={1}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest w-20">Codice</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Documento</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-widest w-24">Stato</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-widest w-36">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DOCUMENTI.map(doc => {
                const cell = docCheck[doc.code] || { ok: false, data: "" };
                return (
                  <tr key={doc.code} className={cn("hover:bg-muted/20", cell.ok && "bg-green-500/5")}>
                    <td className="px-3 py-2.5 font-mono font-bold text-[11px] text-primary">FORM-{doc.code}</td>
                    <td className="px-3 py-2.5 text-foreground">{doc.label}</td>
                    <td className="px-3 py-2.5 text-center">
                      <button onClick={() => toggleDoc(doc.code)} className="flex items-center gap-1.5 mx-auto">
                        {cell.ok
                          ? <><CheckCircle2 size={14} className="text-green-600" /><span className="text-green-600 font-bold text-[10px]">OK</span></>
                          : <><MinusCircle size={14} className="text-muted-foreground" /><span className="text-muted-foreground text-[10px]">—</span></>}
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <input type="date" value={cell.data || ""} onChange={e => setDocData(doc.code, e.target.value)}
                        className="w-full border border-border rounded px-1.5 py-0.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-muted/30 border border-border rounded-lg px-4 py-3 flex items-center gap-4">
          <p className={cn("text-2xl font-bold tabular-nums", docsOk === DOCUMENTI.length ? "text-green-600" : docsOk > 0 ? "text-amber-600" : "text-muted-foreground")}>
            {docsOk}/{DOCUMENTI.length}
          </p>
          <p className="text-xs text-muted-foreground">documenti completati</p>
        </div>
      </FormSection>

      <FormSection title="KPI Piano Azione" cols={3}>
        <Field label="N. obiettivi SMART approvati"><Input type="number" value={d?.n_obiettivi} onChange={v => updateField("n_obiettivi", v)} /></Field>
        <Field label="N. target quantitativi"><Input type="number" value={d?.n_target} onChange={v => updateField("n_target", v)} /></Field>
        <Field label="N. iniziative ESG pianificate"><Input type="number" value={d?.n_iniziative} onChange={v => updateField("n_iniziative", v)} /></Field>
        <Field label="Budget ESG triennale totale (€)"><Input value={d?.budget_totale} onChange={v => updateField("budget_totale", v)} placeholder="€ 0" /></Field>
      </FormSection>

      <FormSection title="Autorizzazione avvio PROC-06 (Bilancio di Sostenibilità)" cols={1}>
        <Field label="Decisione">
          <RadioGroup value={d?.autorizzazione} onChange={v => updateField("autorizzazione", v)} options={[
            { value: "AUTORIZZATO", label: "AUTORIZZATO — Piano ESG approvato, avvio PROC-06 (Redazione Bilancio)" },
            { value: "CONDIZIONATO", label: "Autorizzazione condizionata — punti aperti documentati" },
            { value: "SOSPESO", label: "Sospeso — piano da completare o approvare" },
          ]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data autorizzazione"><Input type="date" value={d?.data_autorizzazione} onChange={v => updateField("data_autorizzazione", v)} /></Field>
          <Field label="Approvato da"><Input value={d?.approvato_da} onChange={v => updateField("approvato_da", v)} /></Field>
        </div>
        <Field label="Punti aperti"><Textarea value={d?.punti_aperti} onChange={v => updateField("punti_aperti", v)} rows={2} /></Field>
      </FormSection>

      <FormSection title="Note passaggio a PROC-06" cols={2}>
        <Field label="Data chiusura Fase 5"><Input type="date" value={d?.data_chiusura} onChange={v => updateField("data_chiusura", v)} /></Field>
        <Field label="Note per il team PROC-06" span={2}>
          <Textarea value={d?.note_passaggio} onChange={v => updateField("note_passaggio", v)} rows={3}
            placeholder="Indicazioni per la redazione del Bilancio: temi prioritari, tono comunicativo, aspettative cliente..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
