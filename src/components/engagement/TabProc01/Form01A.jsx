import FormWrapper, { FormSection, Field, Input, Textarea, Select, InlineInput, InlineSelect, rowStatusClass } from "@/components/common/FormWrapper";
import { useFormData } from "@/hooks/useFormData";
import { cn } from "@/lib/utils";

const ESITI = ["sì", "no", "N/A", "condizionato"];
const CONFORMITA = ["sì", "no", "condizionato"];

export default function Form01A({ engagementId }) {
  const { data: d, status, updateField, updateStatus, saveForm, isSaving } = useFormData(engagementId, "01A");

  const clausole = d?.clausole ?? [];
  const setClausola = (i, k, v) => {
    const n = [...clausole];
    n[i] = { ...n[i], [k]: v };
    updateField("clausole", n);
  };

  const tutte_ok = clausole.every(c => c.conforme !== "no");
  const critiche = clausole.filter(c => c.conforme === "no").length;
  const condizionate = clausole.filter(c => c.conforme === "condizionato").length;

  return (
    <FormWrapper
      formCode="FORM-01A"
      title="Validazione Contratto"
      subtitle="Verifica clausole essenziali del contratto di consulenza"
      meta={{ "Fase": "PROC-01.1", "Input": "Contratto firmato OFF-00E", "Resp.": "Partner + Legal", "Output": "Contratto approvato" }}
      ruleBox="📌 Verificare ogni clausola del contratto rispetto all'offerta accettata. In caso di difformità CRITICA, bloccare l'avvio e contattare il partner."
      ruleBoxType="info"
      status={status}
      onStatusChange={updateStatus}
      onSave={saveForm}
      isSaving={isSaving}
    >
      <FormSection title="Dati contratto">
        <Field label="N. contratto" required>
          <Input value={d?.num_contratto} onChange={v => updateField("num_contratto", v)} className="font-mono" />
        </Field>
        <Field label="Data firma">
          <Input type="date" value={d?.data_firma} onChange={v => updateField("data_firma", v)} />
        </Field>
        <Field label="Data decorrenza">
          <Input type="date" value={d?.data_decorrenza} onChange={v => updateField("data_decorrenza", v)} />
        </Field>
        <Field label="Importo netto (€)">
          <Input type="number" value={d?.importo_netto} onChange={v => updateField("importo_netto", v)} className="font-mono" />
        </Field>
      </FormSection>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Clausole totali", value: clausole.length, color: "text-foreground" },
          { label: "Critiche (no)", value: critiche, color: critiche > 0 ? "text-red-600" : "text-green-700" },
          { label: "Condizionate", value: condizionate, color: condizionate > 0 ? "text-amber-600" : "text-green-700" },
        ].map(item => (
          <div key={item.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border">
            <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      <FormSection title="Checklist clausole" cols={1}>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="text-left px-4 py-2.5 w-10">#</th>
                <th className="text-left px-4 py-2.5">Clausola</th>
                <th className="px-3 py-2.5 text-center w-20">Cap.</th>
                <th className="px-3 py-2.5 text-center w-28">Presente</th>
                <th className="px-3 py-2.5 text-center w-28">Conforme</th>
                <th className="text-left px-4 py-2.5">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clausole.map((c, i) => (
                <tr key={c.id} className={cn("hover:bg-muted/20 transition-colors", rowStatusClass(c.conforme))}>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{c.id}</td>
                  <td className="px-4 py-2.5 font-medium text-sm">{c.clausola}</td>
                  <td className="px-3 py-2.5 text-center">
                    <InlineInput value={c.cap} onChange={v => setClausola(i, "cap", v)} className="w-14 text-center" />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <InlineSelect value={c.presente} onChange={v => setClausola(i, "presente", v)} options={ESITI} />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <InlineSelect value={c.conforme} onChange={v => setClausola(i, "conforme", v)} options={CONFORMITA} />
                  </td>
                  <td className="px-4 py-2.5">
                    <InlineInput value={c.note} onChange={v => setClausola(i, "note", v)} placeholder="—" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>

      <FormSection title="Esito e firma">
        <Field label="Esito validazione" required>
          <Select value={d?.esito_validazione} onChange={v => updateField("esito_validazione", v)} options={["APPROVATO", "APPROVATO CON RISERVA", "BLOCCATO"]} />
        </Field>
        <Field label="Validato da">
          <Input value={d?.validato_da} onChange={v => updateField("validato_da", v)} />
        </Field>
        <Field label="Note legali" span={2}>
          <Textarea value={d?.note_legali} onChange={v => updateField("note_legali", v)} rows={2} />
        </Field>
      </FormSection>
    </FormWrapper>
  );
}
