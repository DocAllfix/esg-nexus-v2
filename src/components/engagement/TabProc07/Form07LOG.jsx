import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { CheckCircle2, MinusCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCUMENTI = [
  { code: "07A", label: "Dossier deliverable finale — archiviato" },
  { code: "07B", label: "Questionario NPS/soddisfazione — raccolto e analizzato" },
  { code: "07C", label: "Proposta rinnovo — inviata o archiviata" },
  { code: "07D", label: "Follow-up 30 gg — completato" },
  { code: "07E", label: "Follow-up 3 mesi — completato" },
  { code: "07F", label: "Lesson Learned — documento completato" },
  { code: "07G", label: "Checklist chiusura formale — firmata" },
];

const DEFAULT_DOC_CHECK = Object.fromEntries(DOCUMENTI.map(d => [d.code, { ok: false, data: "" }]));

const CHECKLIST_AMMIN = [
  { key: "bilancio_pubblicato",  label: "Bilancio di Sostenibilità pubblicato (URL archiviato)" },
  { key: "rinnovo_proposto",     label: "Proposta rinnovo inviata al cliente" },
  { key: "rinnovo_firmato",      label: "Contratto rinnovo firmato (se applicabile)" },
  { key: "knowledge_archiviato", label: "Lesson Learned e knowledge capture archiviati nel repository" },
  { key: "gdpr_completato",      label: "GDPR: dati personali del cliente archiviati/cancellati secondo policy" },
  { key: "fatture_pagate",       label: "Fattura finale emessa e pagamento ricevuto" },
];

export default function Form07LOG({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "07LOG");

  const docCheck = d?.doc_check ?? DEFAULT_DOC_CHECK;
  const toggleDoc = (code) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], ok: !docCheck[code]?.ok } });
  const setDocData = (code, v) => updateField("doc_check", { ...docCheck, [code]: { ...docCheck[code], data: v } });

  const docsOk = Object.values(docCheck).filter(dc => dc.ok).length;

  const npsNum = parseInt(d?.nps_score);
  const npsCategoria = !isNaN(npsNum) ? npsNum >= 9 ? "PROMOTORE" : npsNum >= 7 ? "PASSIVO" : "DETRATTORE" : "";
  const npsColor = npsCategoria === "PROMOTORE" ? "text-green-600" : npsCategoria === "PASSIVO" ? "text-amber-600" : npsCategoria === "DETRATTORE" ? "text-destructive" : "text-muted-foreground";

  return (
    <FormWrapper
      formCode="LOG-07"
      title="Chiusura Formale Engagement"
      subtitle="Checklist documenti Fase 7 · KPI engagement · Chiusura amministrativa · Archivio"
      meta={{
        Fase: "Fase 7.9 — LOG Finale",
        Input: "FORM-07A→07G completati · Tutti i dati engagement",
        Responsabile: "PM ESG + Responsabile Studio",
        Timing: "Post follow-up 3 mesi",
        Output: "Engagement chiuso formalmente · Archivio completo · CRM aggiornato",
      }}
      ruleBox="Il LOG-07 chiude formalmente l'engagement nel sistema. Nessuna attività fatturabile può essere avviata dopo questa firma senza un nuovo contratto. Il documento è conservato nel repository per 10 anni (obbligatorio GDPR)."
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

      <FormSection title="Checklist documenti Fase 7" cols={1}>
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

      <FormSection title="KPI soddisfazione cliente" cols={1}>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted/30 border border-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">NPS Score (0-10)</p>
            <input type="number" min="0" max="10" value={d?.nps_score || ""} onChange={e => updateField("nps_score", e.target.value)}
              className="w-20 border border-border rounded px-2 py-1 text-2xl font-bold text-center bg-background focus:outline-none focus:ring-2 focus:ring-ring mx-auto block" />
            {npsCategoria && (
              <p className={cn("text-sm font-bold mt-2 flex items-center justify-center gap-1", npsColor)}>
                <Star size={12} /> {npsCategoria}
              </p>
            )}
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Soddisfazione media (1-5)</p>
            <input type="number" min="0" max="5" step="0.1" value={d?.sat_media || ""} onChange={e => updateField("sat_media", e.target.value)}
              className="w-20 border border-border rounded px-2 py-1 text-2xl font-bold text-center bg-background focus:outline-none focus:ring-2 focus:ring-ring mx-auto block" />
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Checklist amminist.</p>
            <div className="space-y-1.5">
              {CHECKLIST_AMMIN.map(({ key, label }) => (
                <label key={key} className="flex items-start gap-2 cursor-pointer" onClick={() => updateField(key, !d?.[key])}>
                  <div className={cn("mt-0.5 w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors", d?.[key] ? "bg-primary border-primary" : "border-border hover:border-primary/50")}>
                    {d?.[key] && <CheckCircle2 size={8} className="text-primary-foreground" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection title="Lesson Learned sintesi" cols={1}>
        <Field label="Principali lesson learned (da includere nel knowledge base dello studio)">
          <Textarea value={d?.note_lessons} onChange={v => updateField("note_lessons", v)} rows={4}
            placeholder="Cosa ha funzionato bene, cosa si può migliorare, raccomandazioni per futuri engagement simili..." />
        </Field>
      </FormSection>

      <FormSection title="Chiusura formale engagement" cols={1}>
        <Field label="Decisione di chiusura">
          <RadioGroup value={d?.decisione_chiusura} onChange={v => updateField("decisione_chiusura", v)} options={[
            { value: "CHIUSO",    label: "CHIUSO — Engagement completato formalmente, CRM aggiornato a BIL_PUBBLICATO" },
            { value: "PARZIALE",  label: "Parzialmente chiuso — follow-up ancora aperto" },
            { value: "RINNOVATO", label: "RINNOVATO — Nuovo contratto firmato, engagement continua" },
          ]} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Data chiusura formale"><Input type="date" value={d?.data_chiusura} onChange={v => updateField("data_chiusura", v)} /></Field>
          <Field label="Responsabile chiusura"><Input value={d?.approvato_da} onChange={v => updateField("approvato_da", v)} placeholder="CS ESG / Partner" /></Field>
        </div>
        <Field label="Note finali">
          <Textarea value={d?.note_finali} onChange={v => updateField("note_finali", v)} rows={2} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
