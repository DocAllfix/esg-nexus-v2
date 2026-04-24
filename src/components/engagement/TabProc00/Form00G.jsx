import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { CheckCircle2 } from "lucide-react";
import { useFormData } from "@/hooks/useFormData";

const CRM_STATI = [
  "LEAD — In valutazione",
  "QUALIFIED — Pre-qualificato",
  "PROPOSAL — Offerta inviata",
  "NEGOTIATION — In negoziazione",
  "WON — Contratto firmato",
  "CONTRATTO_FIRMATO",
  "ACTIVE — Progetto avviato",
  "COMPLETED — Progetto concluso",
  "LOST — Perso",
  "ON_HOLD — In pausa",
];

const SUMMARY_ITEMS = [
  { label: "FORM-00C Score pesato", value: "4.35/5.00" },
  { label: "FORM-00D Conflitti di interesse", value: "Assenti" },
  { label: "FORM-00F KYC Esito", value: "APPROVATO" },
  { label: "FORM-00E Offerta", value: "OFF-2024-047 — accettata — €43.500" },
];

export default function Form00G({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "00G");

  return (
    <FormWrapper
      formCode="FORM-00G"
      title="Chiusura Fase 0 — LOG"
      subtitle="Riepilogo decisioni e transizione a PROC-01"
      meta={{ "Fase": "Finale — Chiusura PROC-00", "Resp.": "Consulente Senior + Partner", "Input": "FORM-00C/D/E/F completati", "Output": "Avvio PROC-01 / Declinazione formale" }}
      ruleBox="📋 Verificare che TUTTI i form precedenti siano completati prima di procedere con questa chiusura. L'avvio di PROC-01 è condizionato alla decisione GO."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >

      <FormSection title="Riepilogo fase 0" cols={1}>
        <div className="space-y-3">
          {SUMMARY_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-700" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Decisione finale" cols={1}>
        <Field label="Esito chiusura fase 0">
          <RadioGroup
            value={d?.decisione_finale}
            onChange={v => updateField("decisione_finale", v)}
            options={[
              { value: "GO", label: "✅ GO — Contratto firmato — Avvio PROC-01" },
              { value: "NOGO", label: "🛑 NO-GO — Declinazione formale" },
              { value: "SOSPESO", label: "⏸ SOSPESO — In attesa" },
            ]}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Field label="Data avvio PROC-01 (se GO)">
            <Input type="date" value={d?.data_avvio} onChange={v => updateField("data_avvio", v)} />
          </Field>
          <div />
          <Field label="Motivazione NO-GO (se applicabile)" span={2}>
            <Textarea value={d?.motivazione_nogo} onChange={v => updateField("motivazione_nogo", v)} rows={2} placeholder="Descrivere le ragioni della declinazione..." />
          </Field>
          <Field label="In attesa di... (se SOSPESO)" span={2}>
            <Input value={d?.attesa_di} onChange={v => updateField("attesa_di", v)} placeholder="Es. Approvazione budget da CdA cliente entro 30/11" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Stato CRM da aggiornare" cols={1}>
        <Field label="Seleziona il nuovo stato CRM">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CRM_STATI.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="stato_crm" value={s} checked={d?.stato_crm === s} onChange={() => updateField("stato_crm", s)} className="accent-primary" />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
        </Field>
      </FormSection>

      <FormSection title="Approvazione e chiusura">
        <Field label="Approvato da">
          <Input value={d?.approvato_da} onChange={v => updateField("approvato_da", v)} />
        </Field>
        <Field label="Data chiusura fase 0">
          <Input type="date" value={d?.data_chiusura} onChange={v => updateField("data_chiusura", v)} />
        </Field>
        <Field label="Note finali" span={2}>
          <Textarea value={d?.note_finali} onChange={v => updateField("note_finali", v)} rows={2} />
        </Field>
      </FormSection>

    </FormWrapper>
  );
}
