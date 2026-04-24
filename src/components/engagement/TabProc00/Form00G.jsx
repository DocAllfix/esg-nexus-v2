import { useState } from "react";
import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

// TODO: Replace with Supabase hook
const acmeFormData = {};

const STORAGE_KEY = "esg_engagement_ESG-2025-ACM-001_form_00G";
const INITIAL = acmeFormData["00G"] ?? {};

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

export default function Form00G() {
  const [d, setD] = useState(INITIAL);
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  // Summary readings from sibling forms (mock)
  const summaryItems = [
    { label: "FORM-00C Score pesato", value: "4.35/5.00", status: "GO", icon: CheckCircle2, color: "text-green-700" },
    { label: "FORM-00D Conflitti di interesse", value: "Assenti", status: "OK", icon: CheckCircle2, color: "text-green-700" },
    { label: "FORM-00F KYC Esito", value: "APPROVATO", status: "OK", icon: CheckCircle2, color: "text-green-700" },
    { label: "FORM-00E Offerta", value: "OFF-2024-047 — accettata — €43.500", status: "OK", icon: CheckCircle2, color: "text-green-700" },
  ];

  return (
    <FormWrapper
      formCode="FORM-00G"
      title="Chiusura Fase 0 — LOG"
      subtitle="Riepilogo decisioni e transizione a PROC-01"
      meta={{ "Fase": "Finale — Chiusura PROC-00", "Resp.": "Consulente Senior + Partner", "Input": "FORM-00C/D/E/F completati", "Output": "Avvio PROC-01 / Declinazione formale" }}
      ruleBox="📋 Verificare che TUTTI i form precedenti siano completati prima di procedere con questa chiusura. L'avvio di PROC-01 è condizionato alla decisione GO."
      ruleBoxType="info"
      storageKey={STORAGE_KEY}
      initialData={INITIAL}
    >

      {/* RIEPILOGO */}
      <FormSection title="Riepilogo fase 0" cols={1}>
        <div className="space-y-3">
          {summaryItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={item.color} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            );
          })}
        </div>
      </FormSection>

      {/* DECISIONE FINALE */}
      <FormSection title="Decisione finale" cols={1}>
        <Field label="Esito chiusura fase 0">
          <RadioGroup
            value={d.decisione_finale}
            onChange={v => set("decisione_finale", v)}
            options={[
              { value: "GO", label: "✅ GO — Contratto firmato — Avvio PROC-01" },
              { value: "NOGO", label: "🛑 NO-GO — Declinazione formale" },
              { value: "SOSPESO", label: "⏸ SOSPESO — In attesa" },
            ]}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <Field label="Data avvio PROC-01 (se GO)">
            <Input type="date" value={d.data_avvio} onChange={v => set("data_avvio", v)} />
          </Field>
          <div />
          <Field label="Motivazione NO-GO (se applicabile)" span={2}>
            <Textarea value={d.motivazione_nogo} onChange={v => set("motivazione_nogo", v)} rows={2} placeholder="Descrivere le ragioni della declinazione..." />
          </Field>
          <Field label="In attesa di... (se SOSPESO)" span={2}>
            <Input value={d.attesa_di} onChange={v => set("attesa_di", v)} placeholder="Es. Approvazione budget da CdA cliente entro 30/11" />
          </Field>
        </div>
      </FormSection>

      {/* STATO CRM */}
      <FormSection title="Stato CRM da aggiornare" cols={1}>
        <Field label="Seleziona il nuovo stato CRM">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CRM_STATI.map(s => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="stato_crm" value={s} checked={d.stato_crm === s} onChange={() => set("stato_crm", s)} className="accent-primary" />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
        </Field>
      </FormSection>

      {/* APPROVAZIONE */}
      <FormSection title="Approvazione e chiusura">
        <Field label="Approvato da">
          <Input value={d.approvato_da} onChange={v => set("approvato_da", v)} />
        </Field>
        <Field label="Data chiusura fase 0">
          <Input type="date" value={d.data_chiusura} onChange={v => set("data_chiusura", v)} />
        </Field>
        <Field label="Note finali" span={2}>
          <Textarea value={d.note_finali} onChange={v => set("note_finali", v)} rows={2} />
        </Field>
      </FormSection>

    </FormWrapper>
  );
}