import FormWrapper, { FormSection, Field, Input, Textarea, RadioGroup } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";

export default function Form00D({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "00D");

  const esito_auto = () => {
    if (d?.verifica4 === "incompatibile") return "bloccanti";
    if (d?.verifica2 === "riassegna") return "bloccanti";
    if ([d?.verifica1, d?.verifica2, d?.verifica3, d?.verifica4].some(v => v && v !== "ok" && v !== "valutato" && v !== "dichiarata" && v !== "detengo")) return "gestiti";
    return "assenti";
  };

  return (
    <FormWrapper
      formCode="FORM-00D"
      title="Dichiarazione Conflitti di Interesse"
      subtitle="Verifica obbligatoria prima della decisione Go/No-Go — firmata sotto responsabilità del consulente"
      meta={{ "Fase": "0.4", "Resp.": "Consulente assegnato", "Timing": "Prima del FORM-00C", "Output": "Dichiarazione firmata + archiviazione fascicolo" }}
      ruleBox="⚠ Obbligatoria prima della decisione Go/No-Go. Dichiarazione sotto responsabilità del consulente. In caso di conflitto bloccante → NO-GO AUTOMATICO."
      ruleBoxType="warning"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >

      <FormSection title="Dati della dichiarazione">
        <Field label="Cliente potenziale" required>
          <Input value={d?.cliente_potenziale} onChange={v => updateField("cliente_potenziale", v)} placeholder="Ragione sociale cliente" />
        </Field>
        <Field label="Settore / ATECO">
          <Input value={d?.settore_ateco} onChange={v => updateField("settore_ateco", v)} placeholder="Es. Automotive — 29.10" />
        </Field>
        <Field label="Consulente dichiarante" required>
          <Input value={d?.consulente_dichiarante} onChange={v => updateField("consulente_dichiarante", v)} />
        </Field>
        <Field label="Data dichiarazione">
          <Input type="date" value={d?.data_dichiarazione} onChange={v => updateField("data_dichiarazione", v)} />
        </Field>
      </FormSection>

      <FormSection title="Verifica 1 — Clienti attivi in portafoglio" cols={1}>
        <Field>
          <RadioGroup
            value={d?.verifica1}
            onChange={v => updateField("verifica1", v)}
            options={[
              { value: "ok", label: "✓ NON esistono clienti attivi nello stesso settore con info riservate rilevanti" },
              { value: "esiste", label: "⚠ ESISTONO clienti nel medesimo settore" },
              { value: "valutato", label: "✓ Situazione valutata con il partner e ritenuta compatibile (motivazione allegata)" },
            ]}
          />
        </Field>
        <Field label="Dettaglio (se ESISTONO)">
          <Input value={d?.verifica1_dettaglio} onChange={v => updateField("verifica1_dettaglio", v)} placeholder="Specificare cliente e motivazione della compatibilità" />
        </Field>
      </FormSection>

      <FormSection title="Verifica 2 — Relazioni personali o familiari" cols={1}>
        <Field>
          <RadioGroup
            value={d?.verifica2}
            onChange={v => updateField("verifica2", v)}
            options={[
              { value: "ok", label: "✓ Nessuna relazione personale/familiare tra consulenti e management cliente" },
              { value: "dichiarata", label: "⚠ Relazione personale esistente — dichiarata al partner — non compromette obiettività" },
              { value: "riassegna", label: "🛑 Situazione richiede assegnazione del progetto ad altro consulente" },
            ]}
          />
        </Field>
      </FormSection>

      <FormSection title="Verifica 3 — Interessi economici" cols={1}>
        <Field>
          <RadioGroup
            value={d?.verifica3}
            onChange={v => updateField("verifica3", v)}
            options={[
              { value: "ok", label: "✓ Non detengo partecipazioni/interessi in aziende concorrenti del cliente" },
              { value: "detengo", label: "⚠ Detengo partecipazione dichiarata al partner" },
            ]}
          />
        </Field>
        <Field label="Dettaglio (se partecipazione presente)">
          <Input value={d?.verifica3_dettaglio} onChange={v => updateField("verifica3_dettaglio", v)} placeholder="Specificare entità, percentuale e data comunicazione al partner" />
        </Field>
      </FormSection>

      <FormSection title="Verifica 4 — Settore di attività" cols={1}>
        <Field>
          <RadioGroup
            value={d?.verifica4}
            onChange={v => updateField("verifica4", v)}
            options={[
              { value: "ok", label: "✓ Settore compatibile con la policy etica dello studio" },
              { value: "borderline", label: "⚠ Settore borderline — valutazione con partner necessaria" },
              { value: "incompatibile", label: "🛑 Settore NON compatibile — No-Go automatico" },
            ]}
          />
        </Field>
      </FormSection>

      <FormSection title="Esito complessivo" cols={1}>
        <div className="p-4 rounded-lg border bg-muted/30">
          <p className="text-sm font-semibold mb-2">Esito auto-calcolato in base alle verifiche:</p>
          <p className="text-base font-bold">
            {esito_auto() === "assenti" && "✅ Conflitti assenti — Procedi"}
            {esito_auto() === "gestiti" && "⚠ Conflitti presenti gestiti — Procedi con cautela"}
            {esito_auto() === "bloccanti" && "🛑 Conflitti bloccanti — NO-GO automatico"}
          </p>
        </div>
        <Field label="Esito manuale (conferma o sovrascrivi)">
          <RadioGroup
            value={d?.esito}
            onChange={v => updateField("esito", v)}
            options={[
              { value: "assenti", label: "✅ Conflitti assenti — Procedi" },
              { value: "gestiti", label: "⚠ Conflitti presenti gestiti — Procedi con cautela" },
              { value: "bloccanti", label: "🛑 Conflitti bloccanti — NO-GO automatico" },
            ]}
          />
        </Field>
        <Field label="Note aggiuntive" span={2}>
          <Textarea value={d?.note} onChange={v => updateField("note", v)} rows={3} placeholder="Eventuali considerazioni o motivazioni aggiuntive..." />
        </Field>
      </FormSection>

      <FormSection title="Firme">
        <Field label="Firma consulente">
          <Input value={d?.firma_consulente} onChange={v => updateField("firma_consulente", v)} />
        </Field>
        <Field label="Firma partner">
          <Input value={d?.firma_partner} onChange={v => updateField("firma_partner", v)} />
        </Field>
      </FormSection>

    </FormWrapper>
  );
}
