import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { CheckCircle2, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCUMENTI = [
  { code: "06A", label: "Piano editoriale e struttura capitoli" },
  { code: "06B", label: "Sezioni narrative Ambiente (E) — approvate" },
  { code: "06C", label: "Sezioni narrative Sociale (S) — approvate" },
  { code: "06D", label: "Sezioni narrative Governance (G) — approvate" },
  { code: "06E", label: "Piano editoriale e scadenze — completato" },
  { code: "06F", label: "GRI/ESRS Content Index — compilato e verificato" },
  { code: "06G", label: "Assurance esterna — attestazione ricevuta" },
  { code: "06H", label: "Delibera CdA e pubblicazione finale" },
];

const DEFAULT_DOC_CHECK = Object.fromEntries(DOCUMENTI.map(d => [d.code, { ok: false, data: "" }]));

export default function Form06LOG({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "06LOG");

  const docCheck = d?.doc_check ?? DEFAULT_DOC_CHECK;
  const toggleDoc = (code) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], ok: !docCheck[code]?.ok } });
  const setDocData = (code, v) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], data: v } });

  const docsOk = Object.values(docCheck).filter(dc => dc.ok).length;

  return (
    <FormWrapper
      formCode="LOG-06"
      title="Chiusura Fase 6 — Bilancio Pubblicato"
      subtitle="Checklist documenti · KPI editoriali · Delibera CdA · Pubblicazione · Avvio PROC-07"
      meta={{
        Fase: "Fase 6.9 — LOG",
        Input: "FORM-06A→06H completati · Delibera CdA",
        Responsabile: "CS ESG + PM + Cliente",
        Timing: "Post-pubblicazione Bilancio",
        Output: "Bilancio pubblicato · Archivio completo · Avvio PROC-07 (Chiusura)",
      }}
      ruleBox="Il Bilancio di Sostenibilità è il deliverable principale del progetto. La sua pubblicazione formale (con delibera CdA) completa la Fase 6 e apre la fase 7 di chiusura engagement e follow-up."
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

      <FormSection title="Checklist documenti Fase 6" cols={1}>
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

      <FormSection title="KPI editoriali Bilancio" cols={3}>
        <Field label="N. pagine totali"><Input type="number" value={d?.n_pagine} onChange={v => updateField("n_pagine", v)} /></Field>
        <Field label="N. capitoli"><Input type="number" value={d?.n_capitoli} onChange={v => updateField("n_capitoli", v)} /></Field>
        <Field label="Standard GRI — disclosure coperte"><Input value={d?.gri_coperti} onChange={v => updateField("gri_coperti", v)} placeholder="es. 42/60" /></Field>
        <Field label="Standard ESRS — disclosure coperte"><Input value={d?.esrs_coperti} onChange={v => updateField("esrs_coperti", v)} placeholder="es. 15/28" /></Field>
        <Field label="Ente di assurance"><Input value={d?.assurance_ente} onChange={v => updateField("assurance_ente", v)} placeholder="es. Deloitte, RINA, Bureau Veritas" /></Field>
        <Field label="Livello assurance"><Input value={d?.assurance_livello} onChange={v => updateField("assurance_livello", v)} placeholder="Limited / Reasonable" /></Field>
      </FormSection>

      <FormSection title="Pubblicazione e delibera" cols={1}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="URL pubblicazione bilancio">
            <Input value={d?.url_pubblicazione} onChange={v => updateField("url_pubblicazione", v)} placeholder="https://..." />
          </Field>
          <Field label="Data pubblicazione ufficiale">
            <Input type="date" value={d?.data_pubblicazione} onChange={v => updateField("data_pubblicazione", v)} />
          </Field>
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-2" onClick={() => updateField("delibera_cda", !d?.delibera_cda)}>
          <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors", d?.delibera_cda ? "bg-primary border-primary" : "border-border hover:border-primary/50")}>
            {d?.delibera_cda && <CheckCircle2 size={10} className="text-primary-foreground" />}
          </div>
          <span className="text-sm font-medium">Delibera CdA di approvazione del Bilancio ricevuta e archiviata</span>
        </label>
      </FormSection>

      <FormSection title="Autorizzazione avvio PROC-07 (Chiusura Engagement)" cols={1}>
        <Field label="Decisione">
          <RadioGroup value={d?.autorizzazione} onChange={v => updateField("autorizzazione", v)} options={[
            { value: "AUTORIZZATO",  label: "AUTORIZZATO — Bilancio pubblicato, avvio PROC-07 (Chiusura e Follow-up)" },
            { value: "CONDIZIONATO", label: "In attesa — pubblicazione imminente" },
            { value: "SOSPESO",      label: "Sospeso — revisioni ancora in corso" },
          ]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Approvato da (CS ESG / Partner)"><Input value={d?.approvato_da} onChange={v => updateField("approvato_da", v)} /></Field>
          <Field label="Data chiusura Fase 6"><Input type="date" value={d?.data_chiusura} onChange={v => updateField("data_chiusura", v)} /></Field>
        </div>
        <Field label="Note finali">
          <Textarea value={d?.note_finali} onChange={v => updateField("note_finali", v)} rows={3}
            placeholder="Comunicazione a cliente, archivio repository, next steps PROC-07..." />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
